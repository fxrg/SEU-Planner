import cron from 'node-cron';
import { format } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { query } from '../database/db.js';
import { logger } from '../utils/logger.js';
import { sendEmail } from './emailService.js';

// Daily notification job - runs every day at configured time
export function initializeCronJobs() {
  // Default: 7:00 AM Riyadh time
  const notificationTime = process.env.NOTIFICATION_TIME || '07:00';
  const [hour, minute] = notificationTime.split(':');
  
  // Cron expression: minute hour * * *
  const cronExpression = `${minute} ${hour} * * *`;
  
  logger.info(`⏰ Scheduling daily notifications at ${notificationTime} (${cronExpression})`);

  cron.schedule(cronExpression, async () => {
    logger.info('🔔 Running daily notification job...');
    await sendDailyNotifications();
  }, {
    timezone: process.env.NOTIFICATION_TIMEZONE || 'Asia/Riyadh'
  });

  // Exam reminder - 2 weeks before exam date
  cron.schedule('0 8 * * *', async () => {
    await sendExamReminders();
  });

  // Term 2 unlock reminder
  cron.schedule('0 9 * * *', async () => {
    await checkTerm2Status();
  });
}

async function sendDailyNotifications() {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Get all users with today's sessions
    const result = await query(`
      SELECT DISTINCT 
        u.id, u.email, u.full_name, u.language,
        COUNT(ss.id) as session_count
      FROM users u
      INNER JOIN study_plans sp ON u.id = sp.user_id AND sp.is_active = true
      INNER JOIN study_sessions ss ON sp.id = ss.plan_id
      WHERE ss.session_date = $1 
        AND ss.is_completed = false
        AND u.notification_enabled = true
      GROUP BY u.id, u.email, u.full_name, u.language
    `, [today]);

    logger.info(`📨 Found ${result.rows.length} users to notify`);

    for (const user of result.rows) {
      // Get user's sessions for today
      const sessionsResult = await query(`
        SELECT 
          ss.id,
          ss.duration_minutes,
          ss.session_type,
          c.name_ar,
          c.name_en,
          c.code
        FROM study_sessions ss
        INNER JOIN user_courses uc ON ss.user_course_id = uc.id
        INNER JOIN courses c ON uc.course_id = c.id
        WHERE ss.session_date = $1 
          AND ss.is_completed = false
          AND ss.plan_id IN (
            SELECT id FROM study_plans WHERE user_id = $2 AND is_active = true
          )
        ORDER BY c.name_ar
      `, [today, user.id]);

      const sessions = sessionsResult.rows;
      
      // Create notification message
      const isArabic = user.language === 'ar';
      const coursesList = sessions.map(s => 
        `- ${isArabic ? s.name_ar : s.name_en} (${s.duration_minutes} ${isArabic ? 'دقيقة' : 'min'})`
      ).join('\n');

      const message = isArabic 
        ? `مرحباً ${user.full_name}،\n\nخطة دراستك لهذا اليوم:\n\n${coursesList}\n\nبالتوفيق! 📚`
        : `Hello ${user.full_name},\n\nYour study plan for today:\n\n${coursesList}\n\nGood luck! 📚`;

      // Save notification to database
      await query(`
        INSERT INTO notifications (user_id, title, message, notification_type, scheduled_for)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        user.id,
        isArabic ? 'خطة دراستك اليوم' : 'Your Study Plan Today',
        message,
        'daily',
        new Date()
      ]);

      // Send email
      try {
        await sendEmail({
          to: user.email,
          subject: isArabic ? '📚 خطة دراستك اليوم - SEU Planner' : '📚 Your Study Plan Today - SEU Planner',
          text: message
        });
        logger.info(`✅ Notification sent to ${user.email}`);
      } catch (emailError) {
        logger.error(`❌ Failed to send email to ${user.email}:`, emailError);
      }
    }

    logger.info('✅ Daily notifications job completed');
  } catch (error) {
    logger.error('❌ Error in daily notifications job:', error);
  }
}

async function sendExamReminders() {
  try {
    const examDate = new Date(process.env.TERM1_EXAM_DATE || '2025-12-14');
    const today = new Date();
    const daysUntilExam = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExam === 14 || daysUntilExam === 7 || daysUntilExam === 3) {
      const users = await query(`
        SELECT id, email, full_name, language
        FROM users
        WHERE notification_enabled = true
      `);

      for (const user of users.rows) {
        const isArabic = user.language === 'ar';
        const message = isArabic
          ? `تذكير: باقي ${daysUntilExam} يوم على الاختبارات النهائية! ⏰\n\nوقت المراجعة المكثفة 💪`
          : `Reminder: ${daysUntilExam} days until final exams! ⏰\n\nIntensive review time 💪`;

        await query(`
          INSERT INTO notifications (user_id, title, message, notification_type)
          VALUES ($1, $2, $3, $4)
        `, [
          user.id,
          isArabic ? 'تذكير الاختبارات' : 'Exam Reminder',
          message,
          'exam'
        ]);

        await sendEmail({
          to: user.email,
          subject: isArabic ? `⏰ باقي ${daysUntilExam} يوم على الاختبارات` : `⏰ ${daysUntilExam} days until exams`,
          text: message
        });
      }

      logger.info(`✅ Exam reminders sent (${daysUntilExam} days remaining)`);
    }
  } catch (error) {
    logger.error('❌ Error in exam reminders:', error);
  }
}

async function checkTerm2Status() {
  try {
    const term2OpenDate = new Date(process.env.TERM2_OPEN_DATE || '2026-01-11');
    const today = new Date();
    const daysUntilOpen = Math.ceil((term2OpenDate - today) / (1000 * 60 * 60 * 24));

    // Notify 7, 3, 1 day before
    if ([7, 3, 1].includes(daysUntilOpen)) {
      const users = await query(`
        SELECT id, email, full_name, language
        FROM users
        WHERE notification_enabled = true
      `);

      for (const user of users.rows) {
        const isArabic = user.language === 'ar';
        const message = isArabic
          ? `الترم الثاني يفتح خلال ${daysUntilOpen} ${daysUntilOpen === 1 ? 'يوم' : 'أيام'}! 🎉`
          : `Term 2 opens in ${daysUntilOpen} day${daysUntilOpen > 1 ? 's' : ''}! 🎉`;

        await query(`
          INSERT INTO notifications (user_id, title, message, notification_type)
          VALUES ($1, $2, $3, $4)
        `, [
          user.id,
          isArabic ? 'الترم الثاني قريباً' : 'Term 2 Coming Soon',
          message,
          'info'
        ]);
      }

      logger.info(`✅ Term 2 reminders sent (${daysUntilOpen} days until open)`);
    }

    // Unlock Term 2 on the open date
    if (daysUntilOpen === 0) {
      await query(`
        UPDATE terms 
        SET is_active = true 
        WHERE term_number = 2 AND academic_year = '2025-2026'
      `);
      logger.info('🔓 Term 2 unlocked!');
    }
  } catch (error) {
    logger.error('❌ Error checking Term 2 status:', error);
  }
}
