-- SEU Planner Database Schema
-- Saudi Electronic University Study Planner
-- Created: 2025-11-12

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Colleges (الكليات)
CREATE TABLE colleges (
  id SERIAL PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL UNIQUE,
  name_en VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Majors/Specializations (التخصصات)
CREATE TABLE majors (
  id SERIAL PRIMARY KEY,
  college_id INTEGER REFERENCES colleges(id) ON DELETE CASCADE,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  code VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses (المقررات)
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  major_id INTEGER REFERENCES majors(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  credit_hours INTEGER DEFAULT 3,
  difficulty_level INTEGER DEFAULT 3 CHECK (difficulty_level BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(major_id, code)
);

-- Terms (الترم/الفصل)
CREATE TABLE terms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  term_number INTEGER NOT NULL CHECK (term_number IN (1, 2)),
  start_date DATE NOT NULL,
  exam_date DATE,
  end_date DATE NOT NULL,
  open_date DATE,
  is_active BOOLEAN DEFAULT false,
  academic_year VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users (المستخدمين)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  major_id INTEGER REFERENCES majors(id) ON DELETE SET NULL,
  notification_time TIME DEFAULT '07:00:00',
  notification_enabled BOOLEAN DEFAULT true,
  timezone VARCHAR(50) DEFAULT 'Asia/Riyadh',
  study_intensity VARCHAR(20) DEFAULT 'medium' CHECK (study_intensity IN ('light', 'medium', 'intensive')),
  language VARCHAR(10) DEFAULT 'ar' CHECK (language IN ('ar', 'en')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Selected Courses (المواد المختارة من المستخدم)
CREATE TABLE user_courses (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  term_id INTEGER REFERENCES terms(id) ON DELETE CASCADE,
  custom_difficulty INTEGER CHECK (custom_difficulty BETWEEN 1 AND 5),
  is_completed BOOLEAN DEFAULT false,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id, term_id)
);

-- Study Plans (خطة الدراسة)
CREATE TABLE study_plans (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  term_id INTEGER REFERENCES terms(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_study_hours DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Study Sessions (جلسات المذاكرة اليومية)
CREATE TABLE study_sessions (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER REFERENCES study_plans(id) ON DELETE CASCADE,
  user_course_id INTEGER REFERENCES user_courses(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  start_time TIME,
  duration_minutes INTEGER NOT NULL,
  session_type VARCHAR(50) DEFAULT 'review' CHECK (session_type IN ('review', 'intensive', 'exam_prep', 'light_review')),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications (الإشعارات)
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50) DEFAULT 'daily' CHECK (notification_type IN ('daily', 'reminder', 'warning', 'info', 'exam')),
  is_read BOOLEAN DEFAULT false,
  scheduled_for TIMESTAMP,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification Logs (سجل إرسال الإشعارات)
CREATE TABLE notification_logs (
  id SERIAL PRIMARY KEY,
  notification_id INTEGER REFERENCES notifications(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'sent', 'failed')),
  channel VARCHAR(50) CHECK (channel IN ('email', 'push', 'sms')),
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_courses_major ON courses(major_id);
CREATE INDEX idx_user_courses_user ON user_courses(user_id);
CREATE INDEX idx_user_courses_term ON user_courses(term_id);
CREATE INDEX idx_study_sessions_plan ON study_sessions(plan_id);
CREATE INDEX idx_study_sessions_date ON study_sessions(session_date);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for);
CREATE INDEX idx_users_email ON users(email);

-- Insert current term data (الترم الأول 2025-2026)
INSERT INTO terms (name, term_number, start_date, exam_date, end_date, open_date, is_active, academic_year) 
VALUES 
  ('الترم الأول 2025-2026', 1, '2025-11-12', '2025-12-14', '2026-01-01', '2025-11-12', true, '2025-2026'),
  ('الترم الثاني 2025-2026', 2, '2026-01-11', '2026-03-15', '2026-04-01', '2026-01-11', false, '2025-2026');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for study_plans table
CREATE TRIGGER update_study_plans_updated_at 
  BEFORE UPDATE ON study_plans 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
