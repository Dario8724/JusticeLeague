(() => {
  window.SafeNet = window.SafeNet || {};

    const base = (() => {
        const cs = document.currentScript;
        if (cs && cs.src) return new URL('.', cs.src).href;
        return '';
    })();

    const files = [
        'safenet.base.js',
        'safenet.nav.js',
        'safenet.homeMap.js',
        'safenet.psp.js',
        'safenet.chat.js',
        'safenet.report.js',
        'safenet.resources.js',
        'safenet.viewport.js'
    ];

    const load = (file) => new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = base + file;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });

    const boot = async () => {
        for (const file of files) {
            await load(file);
        }
        if (window.SafeNet && typeof window.SafeNet.init === 'function') {
            window.SafeNet.init();
        }
    window.SafeNetReady = true;
    window.dispatchEvent(new Event('safenet:ready'));
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
