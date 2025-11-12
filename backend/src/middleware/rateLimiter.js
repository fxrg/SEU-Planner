import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: {
    success: false,
    message: 'تم تجاوز عدد الطلبات المسموح. الرجاء المحاولة لاحقاً',
    message_en: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    success: false,
    message: 'تم تجاوز عدد محاولات تسجيل الدخول. الرجاء المحاولة بعد 15 دقيقة',
    message_en: 'Too many login attempts, please try again after 15 minutes'
  },
  skipSuccessfulRequests: true
});
