// Firebase Status Indicator
(function() {
    // Wait for DOM and Firebase init
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const navbar = document.querySelector('.navbar .container');
            if (!navbar) return;
            
            const statusIndicator = document.createElement('div');
            statusIndicator.style.cssText = `
                position: fixed;
                bottom: 10px;
                left: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.85rem;
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            const isFirebaseEnabled = window.FIREBASE_ENABLED;
            
            if (isFirebaseEnabled) {
                statusIndicator.innerHTML = `
                    <span style="color: #4CAF50;">●</span>
                    <span>Firebase Active</span>
                `;
                statusIndicator.title = 'الحسابات محفوظة في السحابة ☁️';
            } else {
                statusIndicator.innerHTML = `
                    <span style="color: #FF9800;">●</span>
                    <span>Offline Mode</span>
                `;
                statusIndicator.title = 'الحسابات محفوظة محلياً فقط 💾\nانقر لمعرفة كيفية تفعيل Firebase';
                
                statusIndicator.addEventListener('click', () => {
                    const message = `
⚠️ وضع Offline - الحسابات محلية فقط

الحسابات محفوظة في localStorage على جهازك فقط.

لتفعيل حفظ الحسابات في السحابة:
1. افتح ملف FIREBASE-SETUP.md
2. اتبع الخطوات لإعداد Firebase
3. أضف إعدادات Firebase في index.html
4. أعد تحميل الصفحة

بعد التفعيل، سيمكنك الوصول لحسابك من أي جهاز!
                    `;
                    alert(message);
                });
            }
            
            // Add hover effect
            statusIndicator.addEventListener('mouseenter', () => {
                statusIndicator.style.transform = 'scale(1.05)';
            });
            statusIndicator.addEventListener('mouseleave', () => {
                statusIndicator.style.transform = 'scale(1)';
            });
            
            // Auto-hide after 10 seconds for firebase enabled
            if (isFirebaseEnabled) {
                setTimeout(() => {
                    statusIndicator.style.opacity = '0.3';
                }, 10000);
                
                statusIndicator.addEventListener('mouseenter', () => {
                    statusIndicator.style.opacity = '1';
                });
            }
            
            document.body.appendChild(statusIndicator);
        }, 1000);
    });
})();
