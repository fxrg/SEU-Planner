// Firebase initialization (optional)
// To enable, define window.FIREBASE_CONFIG in index.html or here.
(function(){
  try {
    if (window.firebase && window.FIREBASE_CONFIG) {
      if (firebase.apps && firebase.apps.length === 0) {
        firebase.initializeApp(window.FIREBASE_CONFIG);
      }
      window.FIREBASE_ENABLED = true;
      console.log('✅ Firebase initialized');
    } else {
      console.log('ℹ️ Firebase not configured. Running in offline mode.');
    }
  } catch (e) {
    console.warn('Firebase init error:', e);
  }
})();
