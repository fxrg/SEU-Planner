# 🔥 دليل إعداد Firebase - تخزين الحسابات

## ⚠️ المشكلة الحالية

حالياً، الحسابات **لا تُحفظ في Firebase** بل تُخزّن محلياً فقط في `localStorage` لأن إعدادات Firebase غير مُفعّلة.

## ✅ الحل - تفعيل Firebase Authentication

### الخطوة 1: إنشاء مشروع Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. انقر **Add project** أو اختر مشروعك الحالي
3. اسم المشروع: `SEU Planner` (أو أي اسم تريده)
4. فعّل Google Analytics (اختياري)
5. انقر **Create project**

### الخطوة 2: تفعيل Authentication

1. في لوحة Firebase، اذهب إلى **Authentication** من القائمة اليسرى
2. انقر **Get started**
3. اذهب إلى تبويب **Sign-in method**
4. فعّل **Email/Password**:
   - انقر على السطر
   - فعّل "Enable"
   - احفظ
5. اختياري لكن يُنصح به للجلسات: فعّل **Anonymous** للسماح بالانضمام/الإنشاء بدون تسجيل كامل
   - انقر **Anonymous** ثم **Enable** ثم احفظ

### الخطوة 3: الحصول على إعدادات المشروع

1. انقر على أيقونة ⚙️ (Settings) بجانب **Project Overview**
2. اختر **Project settings**
3. مرر للأسفل حتى **Your apps**
4. إذا لم يكن هناك تطبيق web، انقر `</>` (Web)
   - اسم التطبيق: `SEU Planner Web`
   - **لا تختر** Firebase Hosting الآن
   - انقر **Register app**
5. انسخ الكود الذي يظهر في `firebaseConfig`

سيظهر شيء مثل:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "seu-planner-xxxxx.firebaseapp.com",
  projectId: "seu-planner-xxxxx",
  storageBucket: "seu-planner-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx",
  measurementId: "G-XXXXXXXXXX"
};
```

### الخطوة 4: إضافة الإعدادات للمشروع

افتح ملف `index.html` وابحث عن:

```javascript
window.FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    // ...
};
```

**استبدل** القيم بالقيم الحقيقية التي نسختها:

```javascript
window.FIREBASE_CONFIG = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "seu-planner-xxxxx.firebaseapp.com",
    projectId: "seu-planner-xxxxx",
    storageBucket: "seu-planner-xxxxx.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:xxxxxxxxxxxxx",
    measurementId: "G-XXXXXXXXXX"
};
```

### الخطوة 5: احفظ وأعد تحميل الصفحة

1. احفظ ملف `index.html`
2. أعد تحميل الموقع في المتصفح (F5)
3. افتح Console في المتصفح (F12)
4. يجب أن ترى: `✅ Firebase initialized`

### الخطوة 6: التحقق من العمل

1. انتقل لصفحة التسجيل
2. أنشئ حساب جديد
3. اذهب إلى Firebase Console → **Authentication** → **Users**
4. يجب أن ترى المستخدم الجديد في القائمة! ✅

## 🔒 الأمان - إضافة Domain للـ Authorized domains

في Firebase Console:
1. اذهب إلى **Authentication** → **Settings**
2. تبويب **Authorized domains**
3. أضف domain موقعك (مثل: `yourdomain.com`)
4. `localhost` مضاف تلقائياً للتطوير المحلي

## 📊 عرض المستخدمين

بعد تفعيل Firebase:
- اذهب إلى **Firebase Console** → **Authentication** → **Users**
- ستجد قائمة بجميع المستخدمين المسجلين
- يمكنك تعطيل أو حذف أي مستخدم

## 🔄 الوضع الحالي (Offline)

إذا **لم تفعّل Firebase**:
- ✅ الموقع يعمل بشكل طبيعي
- ✅ الحسابات تُحفظ في `localStorage` فقط
- ⚠️ البيانات محلية على جهاز المستخدم
- ⚠️ لا يمكن الوصول للحساب من جهاز آخر

بعد **تفعيل Firebase**:
- ✅ الحسابات تُحفظ في Firebase
- ✅ يمكن تسجيل الدخول من أي جهاز
- ✅ أمان أفضل
- ✅ إدارة مركزية للمستخدمين

## 🐛 حل المشاكل

### المشكلة: "Firebase is not defined"
**الحل:** تأكد من أن سكربتات Firebase محملة قبل `firebase-init.js`

### المشكلة: "Firebase: Error (auth/invalid-api-key)"
**الحل:** تأكد من صحة `apiKey` في `FIREBASE_CONFIG`

### المشكلة: "Firebase: Error (auth/unauthorized-domain)"
**الحل:** أضف domain موقعك في Authorized domains

### المشكلة: لا يظهر المستخدمون في Firebase Console
**الحل:** 
1. تأكد من تفعيل Email/Password في Sign-in method
2. تحقق من Console في المتصفح من وجود أخطاء
3. تأكد من صحة جميع قيم `FIREBASE_CONFIG`

## 📝 ملاحظات مهمة

1. **لا تشارك** إعدادات Firebase في GitHub العام
   - أضف ملف `.env` أو `config.js` منفصل
   - أضفه لـ `.gitignore`

2. **للإنتاج:** استخدم Firebase Security Rules
   ```javascript
   // في Firebase Console → Firestore Database → Rules
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth.uid == userId;
       }
            // جلسات المذاكرة المشتركة
            match /sessions/{code} {
               allow read: if true; // يمكن لأي شخص قراءة معلومات الجلسة بالكود
               allow create: if request.auth != null &&
                  request.resource.data.ownerId == request.auth.uid &&
                  request.resource.data.code.size() >= 6;
               allow update: if request.auth != null &&
                  request.resource.data.diff(resource.data).changedKeys().hasOnly(["status","startAt","onBreak","breakStartAt","breaksUsed"]) &&
                  resource.data.ownerId == request.auth.uid; // صاحب الجلسة فقط يغير الحالة والبريكات
               allow delete: if request.auth != null; // يمكن حذف الجلسة عند مغادرة آخر مشارك

               // المشاركون
               match /participants/{uid} {
                  allow read: if true;
                  allow create, update, delete: if request.auth != null && request.auth.uid == uid;
               }
            }
     }
   }
   ```

3. لتفعيل ميزة الجلسات: في `index.html` تأكد من تحميل سكربت Firestore:
    ```html
    <script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js"></script>
    ```
    وسيتم تهيئة قاعدة البيانات تلقائياً عبر `frontend/js/firebase-init.js` كـ `window.db`.

3. **النسخ الاحتياطي:** 
   - Firebase يحفظ البيانات تلقائياً
   - يمكنك تصدير المستخدمين من Authentication

## 🎯 الخطوات السريعة (TL;DR)

```bash
1. افتح https://console.firebase.google.com
2. أنشئ مشروع → فعّل Authentication (Email/Password)
3. احصل على firebaseConfig من Project Settings
4. ضعها في index.html في FIREBASE_CONFIG
5. احفظ وأعد التحميل
6. سجل مستخدم جديد
7. تحقق من Firebase Console → Users ✅
```

## 🆘 الدعم

إذا واجهت مشاكل:
- [وثائق Firebase Auth](https://firebase.google.com/docs/auth/web/start)
- [Firebase Status](https://status.firebase.google.com/)
- افتح Console في المتصفح (F12) لرؤية الأخطاء

---

**بعد تطبيق هذه الخطوات، الحسابات ستُحفظ في Firebase بشكل دائم! 🎉**
