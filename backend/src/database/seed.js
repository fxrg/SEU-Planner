import pool from './db.js';
import { logger } from '../utils/logger.js';
import { colleges, majors, courses } from './seedData.js';

async function seed() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    logger.info('🌱 Starting database seeding...');

    // Clear existing data (for development)
    await client.query('TRUNCATE colleges, majors, courses, users, user_courses, study_plans, study_sessions, notifications, notification_logs RESTART IDENTITY CASCADE');
    logger.info('🧹 Cleared existing data');

    // Insert colleges
    logger.info('📚 Inserting colleges...');
    const collegeMap = {};
    for (const college of colleges) {
      const result = await client.query(
        'INSERT INTO colleges (name_ar, name_en) VALUES ($1, $2) RETURNING id',
        [college.name_ar, college.name_en]
      );
      collegeMap[college.name_ar] = result.rows[0].id;
      logger.info(`  ✓ ${college.name_ar}`);
    }

    // Insert majors
    logger.info('🎓 Inserting majors...');
    const majorMap = {};
    for (const major of majors) {
      const collegeId = collegeMap[major.college];
      const result = await client.query(
        'INSERT INTO majors (college_id, name_ar, name_en, code) VALUES ($1, $2, $3, $4) RETURNING id',
        [collegeId, major.name_ar, major.name_en, major.code]
      );
      majorMap[major.code] = result.rows[0].id;
      logger.info(`  ✓ ${major.name_ar} (${major.code})`);
    }

    // Insert courses
    logger.info('📖 Inserting courses...');
    let totalCourses = 0;
    for (const majorCourses of courses) {
      const majorId = majorMap[majorCourses.major_code];
      if (!majorId) {
        logger.warn(`  ⚠ Major code ${majorCourses.major_code} not found, skipping...`);
        continue;
      }

      for (const course of majorCourses.courses) {
        await client.query(
          `INSERT INTO courses (major_id, code, name_ar, name_en, credit_hours, difficulty_level) 
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (major_id, code) DO NOTHING`,
          [majorId, course.code, course.name_ar, course.name_en, course.credit_hours, course.difficulty]
        );
        totalCourses++;
      }
      logger.info(`  ✓ Added ${majorCourses.courses.length} courses for ${majorCourses.major_code}`);
    }

    await client.query('COMMIT');
    logger.info(`✅ Database seeded successfully!`);
    logger.info(`📊 Summary:`);
    logger.info(`   - Colleges: ${colleges.length}`);
    logger.info(`   - Majors: ${majors.length}`);
    logger.info(`   - Courses: ${totalCourses}`);

  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(err => {
  logger.error(err);
  process.exit(1);
});
