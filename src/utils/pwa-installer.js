class PwaInstaller {
  static deferredPrompt = null;

  static init() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      PwaInstaller.deferredPrompt = event;

      // Tampilkan banner
      const banner = document.getElementById('pwa-install-banner');
      if (banner) {
        banner.style.display = 'flex';
      }
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA installed!');
      PwaInstaller._hideBanner();
      PwaInstaller.deferredPrompt = null;
    });

    document.addEventListener('DOMContentLoaded', () => {
      const installBtn = document.getElementById('btn-install-pwa');
      const closeBtn = document.getElementById('btn-close-pwa-banner');

      if (installBtn) {
        installBtn.addEventListener('click', async () => {
          if (!PwaInstaller.deferredPrompt) {
            console.log('No deferred prompt available');
            return;
          }
          PwaInstaller.deferredPrompt.prompt();

          const choiceResult = await PwaInstaller.deferredPrompt.userChoice;
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          PwaInstaller.deferredPrompt = null;
          PwaInstaller._hideBanner();
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          PwaInstaller._hideBanner();
        });
      }
    });
  }

  static _hideBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.style.display = 'none';
    }
  }
}

export { PwaInstaller };
