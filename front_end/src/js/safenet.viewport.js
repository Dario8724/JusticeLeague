(() => {
  const SafeNet = window.SafeNet;

  SafeNet.initScrollReveal = function () {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-reveal').forEach(el => observer.observe(el));
  };

  SafeNet.initUIEffects = function () {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hoverCapable = window.matchMedia && window.matchMedia('(hover: hover)').matches;
    const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

    if (!reduced && finePointer) {
      let raf = 0;
      let lastX = 0;
      let lastY = 0;

      const apply = () => {
        raf = 0;
        document.documentElement.style.setProperty('--pointer-x', `${lastX}px`);
        document.documentElement.style.setProperty('--pointer-y', `${lastY}px`);
      };

      window.addEventListener('pointermove', (e) => {
        lastX = e.clientX;
        lastY = e.clientY;
        if (!raf) raf = window.requestAnimationFrame(apply);

        const btn = e.target && e.target.closest ? e.target.closest('.btn-modern') : null;
        if (btn) {
          const rect = btn.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          btn.style.setProperty('--btn-x', `${Math.max(0, Math.min(100, x))}%`);
          btn.style.setProperty('--btn-y', `${Math.max(0, Math.min(100, y))}%`);
        }
      }, { passive: true });
    } else {
      document.documentElement.style.setProperty('--pointer-x', `50vw`);
      document.documentElement.style.setProperty('--pointer-y', `30vh`);
    }

    document.addEventListener('click', (e) => {
      if (reduced) return;
      const target = e.target && e.target.closest ? e.target.closest('.btn-modern, .nav-link, button.bg-primary, a.bg-primary') : null;
      if (!target) return;
      if (target.classList.contains('disabled') || target.getAttribute('aria-disabled') === 'true') return;

      const rect = target.getBoundingClientRect();
      const ink = document.createElement('span');
      ink.className = 'ripple-ink';
      ink.style.left = `${e.clientX - rect.left}px`;
      ink.style.top = `${e.clientY - rect.top}px`;
      target.appendChild(ink);
      ink.addEventListener('animationend', () => ink.remove(), { once: true });
    }, { passive: true });

    if (!reduced && hoverCapable && finePointer) {
      const max = 7;
      document.querySelectorAll('.card-modern').forEach((card) => {
        let cardRaf = 0;
        let px = 0;
        let py = 0;

        const render = () => {
          cardRaf = 0;
          card.style.setProperty('--ry', `${px}deg`);
          card.style.setProperty('--rx', `${py}deg`);
        };

        card.addEventListener('pointermove', (e) => {
          const rect = card.getBoundingClientRect();
          const relX = (e.clientX - rect.left) / rect.width - 0.5;
          const relY = (e.clientY - rect.top) / rect.height - 0.5;
          px = Math.max(-max, Math.min(max, relX * max * 2));
          py = Math.max(-max, Math.min(max, -relY * max * 2));
          if (!cardRaf) cardRaf = window.requestAnimationFrame(render);
        });

        card.addEventListener('pointerleave', () => {
          card.style.setProperty('--ry', `0deg`);
          card.style.setProperty('--rx', `0deg`);
        });
      });
    }
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
