export default class PWAHelper {
    static installAppPrompt: any;

    static initializePWAHook() {
        // window.addEventListener('beforeinstallprompt', (e) => {
        //     // Prevent the mini-infobar from appearing on mobile
        //     e.preventDefault();
        //     // Stash the event so it can be triggered later.
        //     this.installAppPrompt = e;
        //     // Update UI notify the user they can install the PWA
        //     this.installAppPrompt.prompt();
        //     // Optionally, send analytics event that PWA install promo was shown.
        //     console.log(`'beforeinstallprompt' event was fired.`);
        // });
    }

    static installPWA() {
        // this.installAppPrompt?.prompt();
    }

    static isPWA(): boolean {
        return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
            || (window.navigator as any).standalone; // Fallback for iOS
    }
}