class NotificationHelper {
    static async registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.log('Service Worker tidak didukung di browser ini');
            return null;
        }

        try {
            const registration = await navigator.serviceWorker.register('./sw.js', {
                scope: './',
            });
            console.log('Service Worker berhasil didaftarkan', registration);
            return registration;
        } catch (error) {
            console.error('Registrasi Service Worker gagal:', error);
            return null;
        }
    }

    static async requestPermission() {
        if (!('Notification' in window)) {
            console.log('Browser tidak mendukung notifikasi');
            return false;
        }

        const result = await Notification.requestPermission();
        if (result === 'denied') {
            console.log('Fitur notifikasi tidak diizinkan');
            return false;
        }

        if (result === 'default') {
            console.log('Pengguna menutup kotak dialog permintaan izin');
            return false;
        }

        return true;
    }

    static async getVapidPublicKey() {
        return 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
    }

    static async subscribePushNotification(registration) {
        if (!registration.active) {
            console.error('Service Worker tidak aktif');
            return;
        }

        const vapidPublicKey = await this.getVapidPublicKey();
        const convertedVapidKey = this._urlBase64ToUint8Array(vapidPublicKey);

        try {
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey,
            });

            console.log('Berhasil melakukan subscribe dengan endpoint:', subscription.endpoint);
            await this._sendSubscriptionToServer(subscription);
            return subscription;
        } catch (error) {
            console.error('Gagal melakukan subscribe:', error);
            return null;
        }
    }

    static async _sendSubscriptionToServer(subscription) {
        try {
            const { AuthConfig } = await import('../config/auth-config.js');
            const authConfig = new AuthConfig();
            
            const formattedSubscription = {
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: subscription.keys.p256dh,
                    auth: subscription.keys.auth
                }
            };
            
            await authConfig.subscribeNotification(formattedSubscription);
            console.log('Berhasil mengirim subscription ke server');
        } catch (error) {
            console.error('Gagal mengirim subscription ke server:', error);
            throw error;
        }
    }

    static _urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; i++) {
            outputArray[i] = rawData.charCodeAt(i);
        }

        return outputArray;
    }

    static showNotification(title, options) {
        if (!('Notification' in window)) {
            console.log('Browser tidak mendukung notifikasi');
            return;
        }

        if (Notification.permission === 'granted') {
            navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification(title, options);
            });
        } else {
            console.log('Izin notifikasi tidak diberikan');
            alert('Anda belum memberikan izin untuk menerima notifikasi.');
        }
    }
}

export { NotificationHelper };
