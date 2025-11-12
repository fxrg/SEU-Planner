// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const TOKEN_KEY = 'seu_planner_token';
const USER_KEY = 'seu_planner_user';

// Term dates - الجامعة السعودية الإلكترونية
const TERM1_EXAM_DATE = new Date('2025-12-14'); // بداية اختبارات الترم الأول
const TERM1_END_DATE = new Date('2026-01-01'); // نهاية الترم الأول
const TERM2_OPEN_DATE = new Date('2026-01-11'); // بداية الترم الثاني
const TODAY = new Date('2025-11-12'); // التاريخ الحالي

// Notification settings
const DEFAULT_NOTIFICATION_TIME = '07:00'; // وقت الإشعار اليومي الافتراضي
const NOTIFICATION_ENABLED_KEY = 'seu_notification_enabled';
const NOTIFICATION_TIME_KEY = 'seu_notification_time';

// Study plan settings
const MIN_COURSES = 4; // الحد الأدنى للمواد
const MAX_COURSES = 6; // الحد الأقصى للمواد
const STUDY_INTENSITY_KEY = 'seu_study_intensity';
