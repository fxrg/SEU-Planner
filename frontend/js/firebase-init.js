// Firebase initialization (optional)
// To enable, define window.FIREBASE_CONFIG in index.html or here.
(function(){
  try {
    if (window.firebase && window.FIREBASE_CONFIG && 
        window.FIREBASE_CONFIG.apiKey && 
        window.FIREBASE_CONFIG.apiKey !== 'YOUR_API_KEY_HERE') {
      if (firebase.apps && firebase.apps.length === 0) {
        firebase.initializeApp(window.FIREBASE_CONFIG);
      }
      // Initialize Firestore if available
      if (firebase.firestore) {
        try {
          window.db = firebase.firestore();
        } catch (e) {
          console.warn('Firestore init warning:', e);
        }
      }
      window.FIREBASE_ENABLED = true;
      console.log('%c✅ Firebase Enabled - Accounts saved to cloud', 'color: green; font-weight: bold');
      console.log('📊 Check users at: https://console.firebase.google.com');
    } else {
      window.FIREBASE_ENABLED = false;
      console.log('%c⚠️ Firebase NOT configured - Running in OFFLINE mode', 'color: orange; font-weight: bold');
      console.log('📝 Accounts saved to localStorage ONLY (not synced across devices)');
      console.log('🔥 To enable Firebase:');
      console.log('   1. Open FIREBASE-SETUP.md for instructions');
      console.log('   2. Add your Firebase config to index.html');
      console.log('   3. Reload the page');
    }
  } catch (e) {
    console.warn('Firebase init error:', e);
    window.FIREBASE_ENABLED = false;
  }
})();
