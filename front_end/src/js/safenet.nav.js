(() => {
  const SafeNet = window.SafeNet;

  SafeNet.renderNavbar = function () {
    const header = document.getElementById('main-navbar-container');
    if (!header) return;
    const isLoggedIn = localStorage.getItem('safenet_logged_in') === 'true';
    const userType = localStorage.getItem('safenet_user_type') || '';
    const isPSP = userType === 'psp';
    const logoHref = isPSP ? 'PSPScreen.html' : 'HomeScreen.html';
    const navLinks = isPSP
      ? `<a href="PSPScreen.html" class="nav-link">Painel PSP</a>`
      : `
            <a href="HomeScreen.html" class="nav-link">Início</a>
            <a href="ChatScreen.html" class="nav-link">Chat de Apoio</a>
            <a href="ResourcesScreen.html" class="nav-link">Recursos</a>
            <a href="ReportScreen.html" class="nav-link">Denúncia</a>
          `;

    header.innerHTML = `
      <header id="main-navbar" class="fixed-top glass border-b border-border/50 bg-white/80 backdrop-blur-md">
        <div class="container h-16 d-flex align-items-center justify-content-between px-4">
          <a href="${logoHref}" class="d-flex align-items-center gap-2 text-decoration-none group">
            <div class="w-10 h-10 rounded-xl bg-primary d-flex align-items-center justify-content-center shadow-lg shadow-primary/20 group-active:scale-95 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
              </svg>
            </div>
            <span class="text-xl font-black tracking-tight text-dark">Safe<span class="gradient-text">Net</span></span>
          </a>
          <nav class="d-none d-md-flex align-items-center gap-2">
            ${navLinks}
          </nav>
          <div class="d-none d-md-flex align-items-center gap-3">
            ${isLoggedIn
        ? `<button onclick="SafeNet.logout()" class="text-muted-foreground hover:text-primary text-sm font-bold transition-all bg-transparent border-0">Sair</button>`
        : `<a href="LoginScreen.html" class="text-muted-foreground hover:text-primary text-sm font-bold transition-all text-decoration-none">Entrar</a>`
      }
            ${isPSP ? '' : `<a href="ChatScreen.html" class="bg-primary text-white px-6 py-2.5 rounded-2xl text-sm font-black shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all text-decoration-none">Pedir Ajuda</a>`}
          </div>
          <button id="mobile-toggle" class="d-md-none p-2 rounded-xl hover:bg-muted active:scale-95 transition-all text-foreground border-0 bg-transparent" aria-label="Menu" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
        <div id="scroll-progress" class="scroll-progress"></div>
      </header>
    `;
  };

  SafeNet.renderFooter = function () {
    const footer = document.getElementById('main-footer-container');
    if (!footer) return;
    footer.innerHTML = `
      <footer class="border-top border-black/5 py-5 mt-5">
        <div class="container px-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
          <div class="d-flex align-items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-primary d-flex align-items-center justify-content-center shadow-lg shadow-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
              </svg>
            </div>
            <span class="fw-black small uppercase tracking-tighter text-dark">SafeNet</span>
          </div>
          <p class="small text-muted-foreground mb-0 font-medium">© 2026 SafeNet · Plataforma de apoio contra o cyberbullying</p>
          <div class="d-flex gap-4">
            <a href="ChatScreen.html" class="small fw-bold text-muted-foreground hover:text-primary text-decoration-none transition-all">Chat</a>
            <a href="ResourcesScreen.html" class="small fw-bold text-muted-foreground hover:text-primary text-decoration-none transition-all">Recursos</a>
            <a href="ReportScreen.html" class="small fw-bold text-muted-foreground hover:text-primary text-decoration-none transition-all">Denúncia</a>
          </div>
        </div>
      </footer>
    `;
  };

  SafeNet.initNavbar = function () {
    const navbar = document.getElementById('main-navbar');
    const toggle = document.getElementById('mobile-toggle');
    if (!navbar || !toggle) return;

    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);

      let menu = document.getElementById('mobile-menu');
      if (!menu) {
        const isLoggedIn = localStorage.getItem('safenet_logged_in') === 'true';
        const userType = localStorage.getItem('safenet_user_type') || '';
        const isPSP = userType === 'psp';
        const links = isPSP
          ? `<a href="PSPScreen.html" class="nav-link d-block">Painel PSP</a>`
          : `
            <a href="HomeScreen.html" class="nav-link d-block">Início</a>
            <a href="ChatScreen.html" class="nav-link d-block">Chat de Apoio</a>
            <a href="ResourcesScreen.html" class="nav-link d-block">Recursos</a>
            <a href="ReportScreen.html" class="nav-link d-block">Denúncia</a>
          `;
        menu = document.createElement('div');
        menu.id = 'mobile-menu';
        menu.className = 'd-md-none border-t border-border/50 bg-white/95 backdrop-blur-md animate-fade-in position-fixed w-100 start-0 z-40';
        menu.style.top = '64px';
        menu.innerHTML = `
          <div class="container py-4 space-y-2">
            ${links}
            <hr class="border-border/50 my-2">
            ${isLoggedIn
            ? `<button onclick="SafeNet.logout()" class="nav-link d-block w-100 text-left bg-transparent border-0">Sair</button>`
            : `<a href="LoginScreen.html" class="nav-link d-block">Entrar / Registar</a>`
          }
            ${isPSP ? '' : `<a href="ChatScreen.html" class="d-block w-100 bg-primary text-white text-center px-4 py-3 rounded-xl text-sm font-black mt-2 text-decoration-none shadow-lg">Pedir Ajuda</a>`}
          </div>
        `;
        document.body.appendChild(menu);
        SafeNet.initActiveLinks();
        menu.addEventListener('click', (e) => {
          const target = e.target;
          const isLink = target && (target.tagName === 'A' || target.closest('a'));
          if (isLink) {
            toggle.setAttribute('aria-expanded', 'false');
            menu.classList.add('d-none');
          }
        });
      } else {
        menu.classList.toggle('d-none');
      }
    });

    const progress = document.getElementById('scroll-progress');
    let raf = 0;
    const update = () => {
      raf = 0;
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      if (scrollTop > 10) navbar.classList.add('navbar-scrolled');
      else navbar.classList.remove('navbar-scrolled');

      if (progress) {
        const max = (document.documentElement.scrollHeight || 0) - window.innerHeight;
        const pct = max > 0 ? Math.min(100, Math.max(0, (scrollTop / max) * 100)) : 0;
        progress.style.width = `${pct}%`;
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  };

  SafeNet.logout = function () {
    localStorage.removeItem('safenet_logged_in');
    localStorage.removeItem('safenet_user_type');
    localStorage.removeItem('safenet_user_profile');
    window.location.reload();
  };

  SafeNet.login = function () {
    localStorage.setItem('safenet_logged_in', 'true');
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || 'HomeScreen.html';
    window.location.href = redirect;
  };

  SafeNet.loginAnonymous = function (email) {
    localStorage.setItem('safenet_logged_in', 'true');
    localStorage.setItem('safenet_user_type', 'anonymous');
    const normalizedEmail = (email || '').trim();
    if (normalizedEmail) {
      localStorage.setItem('safenet_user_profile', JSON.stringify({ nome: 'Anónimo', email: normalizedEmail }));
    } else {
      localStorage.setItem('safenet_user_profile', JSON.stringify({ nome: 'Anónimo', email: '' }));
    }
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || 'ReportScreen.html';
    window.location.href = redirect;
  };

  SafeNet.initActiveLinks = function () {
    const currentPath = window.location.pathname.split('/').pop() || 'HomeScreen.html';
    const normalizedPath = (currentPath === 'index.html' || currentPath === '') ? 'HomeScreen.html' : currentPath;
    document.querySelectorAll('.nav-link').forEach(link => {
      const path = link.getAttribute('href');
      if (path === normalizedPath) link.classList.add('active');
      else link.classList.remove('active');
    });
  };
})();
