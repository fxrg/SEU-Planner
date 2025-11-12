import { addDays, differenceInDays, format, isWeekend } from 'date-fns';
import { query, transaction } from '../database/db.js';
import { logger } from '../utils/logger.js';

/**
 * Generate intelligent study plan based on courses, term dates, and user preferences
 * توليد خطة دراسة ذكية بناءً على المواد ومواعيد الترم وتفضيلات المستخدم
 */
export async function generateStudyPlan(userId, termId, courseIds) {
  return transaction(async (client) => {
    logger.info(`Generating plan for user ${userId}, term ${termId}`);

    // 1. Get term dates
    const termResult = await client.query(
      'SELECT * FROM terms WHERE id = $1',
      [termId]
    );
    const term = termResult.rows[0];

    // 2. Get user preferences
    const userResult = await client.query(
      'SELECT study_intensity FROM users WHERE id = $1',
      [userId]
    );
    const user = userResult.rows[0];

    // 3. Get courses details
    const coursesResult = await client.query(
      'SELECT * FROM courses WHERE id = ANY($1::int[])',
      [courseIds]
    );
    const courses = coursesResult.rows;

    if (courses.length === 0) {
      throw new Error('No courses found');
    }

    // 4. Create user_courses entries
    const userCourseIds = [];
    for (const course of courses) {
      const result = await client.query(
        `INSERT INTO user_courses (user_id, course_id, term_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, course_id, term_id) DO UPDATE SET added_at = NOW()
         RETURNING id`,
        [userId, course.id, termId]
      );
      userCourseIds.push({
        id: result.rows[0].id,
        course: course
      });
    }

    // 5. Calculate study plan parameters
    const today = new Date();
    const examDate = new Date(term.exam_date);
    const termEnd = new Date(term.end_date);
    
    const daysUntilExam = differenceInDays(examDate, today);
    const intensiveStartDate = addDays(examDate, -14); // 2 weeks before exam

    logger.info(`Days until exam: ${daysUntilExam}, Intensive starts: ${format(intensiveStartDate, 'yyyy-MM-dd')}`);

    // 6. Calculate session parameters based on intensity
    const intensityMultiplier = {
      light: 0.7,
      medium: 1.0,
      intensive: 1.3
    }[user.study_intensity || 'medium'];

    // Base sessions per week per course
    const baseSessionsPerWeek = 3;
    const sessionsPerWeek = Math.round(baseSessionsPerWeek * intensityMultiplier);

    // 7. Create study plan
    const planResult = await client.query(
      `INSERT INTO study_plans (user_id, term_id, start_date, end_date, is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id`,
      [userId, termId, today, termEnd]
    );
    const planId = planResult.rows[0].id;

    // 8. Generate sessions
    const sessions = [];
    let currentDate = new Date(today);

    while (currentDate <= examDate) {
      // Skip weekends (optional, can be configured)
      if (!isWeekend(currentDate)) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        const isIntensivePeriod = currentDate >= intensiveStartDate;
        const isExamWeek = differenceInDays(examDate, currentDate) <= 7;

        // Determine session type
        let sessionType = 'review';
        let sessionMultiplier = 1;

        if (isExamWeek) {
          sessionType = 'exam_prep';
          sessionMultiplier = 1.5;
        } else if (isIntensivePeriod) {
          sessionType = 'intensive';
          sessionMultiplier = 1.3;
        }

        // Distribute courses across available days
        // Rotate courses to ensure even distribution
        const dayIndex = differenceInDays(currentDate, today);
        const coursesForToday = [];

        // Select 2-3 courses per day (varies by intensity)
        const coursesPerDay = isIntensivePeriod ? 3 : 2;
        
        for (let i = 0; i < coursesPerDay && i < userCourseIds.length; i++) {
          const courseIndex = (dayIndex + i) % userCourseIds.length;
          coursesForToday.push(userCourseIds[courseIndex]);
        }

        // Create sessions for each course
        for (const userCourse of coursesForToday) {
          const course = userCourse.course;
          
          // Base duration on difficulty (30-90 minutes)
          const baseDuration = 30 + (course.difficulty_level * 10);
          const duration = Math.round(baseDuration * sessionMultiplier);

          sessions.push({
            plan_id: planId,
            user_course_id: userCourse.id,
            session_date: dateStr,
            duration_minutes: duration,
            session_type: sessionType
          });
        }
      }

      currentDate = addDays(currentDate, 1);
    }

    // Add light review sessions after exams (until term end)
    currentDate = addDays(examDate, 1);
    while (currentDate <= termEnd) {
      if (!isWeekend(currentDate)) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        
        // One course per day for light review
        const dayIndex = differenceInDays(currentDate, examDate);
        const courseIndex = dayIndex % userCourseIds.length;
        const userCourse = userCourseIds[courseIndex];

        sessions.push({
          plan_id: planId,
          user_course_id: userCourse.id,
          session_date: dateStr,
          duration_minutes: 30, // Light review
          session_type: 'light_review'
        });
      }

      currentDate = addDays(currentDate, 1);
    }

    // 9. Insert all sessions
    logger.info(`Inserting ${sessions.length} study sessions...`);
    
    for (const session of sessions) {
      await client.query(
        `INSERT INTO study_sessions (plan_id, user_course_id, session_date, duration_minutes, session_type)
         VALUES ($1, $2, $3, $4, $5)`,
        [session.plan_id, session.user_course_id, session.session_date, session.duration_minutes, session.session_type]
      );
    }

    // 10. Update plan with total hours
    const totalHours = sessions.reduce((sum, s) => sum + s.duration_minutes, 0) / 60;
    await client.query(
      'UPDATE study_plans SET total_study_hours = $1 WHERE id = $2',
      [totalHours, planId]
    );

    // 11. Return plan summary
    const summary = {
      plan_id: planId,
      courses: courses.map(c => ({ id: c.id, name_ar: c.name_ar, name_en: c.name_en, code: c.code })),
      total_sessions: sessions.length,
      total_hours: Math.round(totalHours * 10) / 10,
      start_date: format(today, 'yyyy-MM-dd'),
      end_date: format(termEnd, 'yyyy-MM-dd'),
      exam_date: format(examDate, 'yyyy-MM-dd'),
      intensive_start: format(intensiveStartDate, 'yyyy-MM-dd'),
      sessions_by_type: {
        review: sessions.filter(s => s.session_type === 'review').length,
        intensive: sessions.filter(s => s.session_type === 'intensive').length,
        exam_prep: sessions.filter(s => s.session_type === 'exam_prep').length,
        light_review: sessions.filter(s => s.session_type === 'light_review').length
      }
    };

    logger.info(`✅ Plan generated: ${summary.total_sessions} sessions, ${summary.total_hours}h`);

    return summary;
  });
}

/**
 * Reschedule missed sessions
 * إعادة جدولة الجلسات الفائتة
 */
export async function rescheduleMissedSessions(userId, planId) {
  const today = format(new Date(), 'yyyy-MM-dd');

  // Get missed sessions (past dates, not completed)
  const missedResult = await query(
    `SELECT ss.*, uc.course_id
     FROM study_sessions ss
     INNER JOIN user_courses uc ON ss.user_course_id = uc.id
     INNER JOIN study_plans sp ON ss.plan_id = sp.id
     WHERE sp.user_id = $1 
       AND sp.id = $2
       AND ss.session_date < $3
       AND ss.is_completed = false`,
    [userId, planId, today]
  );

  const missedSessions = missedResult.rows;
  
  if (missedSessions.length === 0) {
    return { rescheduled: 0 };
  }

  logger.info(`Rescheduling ${missedSessions.length} missed sessions for user ${userId}`);

  // Distribute across next available days
  let currentDate = new Date();
  let rescheduled = 0;

  for (const session of missedSessions) {
    // Find next available day
    while (isWeekend(currentDate)) {
      currentDate = addDays(currentDate, 1);
    }

    // Update session date
    await query(
      'UPDATE study_sessions SET session_date = $1 WHERE id = $2',
      [format(currentDate, 'yyyy-MM-dd'), session.id]
    );

    currentDate = addDays(currentDate, 1);
    rescheduled++;
  }

  return { rescheduled };
}
