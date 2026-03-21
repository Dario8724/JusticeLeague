(() => {
  const SafeNet = window.SafeNet;

  SafeNet.initScrollReveal = function () {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-reveal').forEach(el => observer.observe(el));
  };

  SafeNet.adaptViewport = function () {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    const setScale = () => {
      const baseWidth = 1440;
      const width = window.innerWidth;
      if (width > 768 && width < baseWidth) {
        const scale = width / baseWidth;
        document.body.style.zoom = scale;
      } else {
        document.body.style.zoom = 1;
      }
    };

    window.addEventListener('resize', () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      setScale();
    });
    setScale();
  };
})();
