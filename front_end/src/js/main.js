const SafeNet = {
  init() {
    this.renderNavbar();
    this.renderFooter();
    this.initNavbar();
    this.initActiveLinks();
    this.initAccordions();
    this.initAlertHandlers();
    this.initCarousel();
    this.initChat();
    this.initReport();
    this.initResources();
    this.adaptViewport();
    this.initScrollReveal();
  },

  renderNavbar() {
    const header = document.getElementById('main-navbar-container');
    if (!header) return;
    const isLoggedIn = localStorage.getItem('safenet_logged_in') === 'true';

    header.innerHTML = `
      <header id="main-navbar" class="fixed-top glass border-b border-border/50 bg-white/80 backdrop-blur-md">
        <div class="container h-16 d-flex align-items-center justify-content-between px-4">
          <a href="HomeScreen.html" class="d-flex align-items-center gap-2 text-decoration-none group">
            <div class="w-10 h-10 rounded-xl bg-primary d-flex align-items-center justify-center shadow-lg shadow-primary/20 group-active:scale-95 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
              </svg>
            </div>
            <span class="text-xl font-black tracking-tight text-dark">Safe<span class="gradient-text">Net</span></span>
          </a>
          <nav class="d-none d-md-flex align-items-center gap-2">
            <a href="HomeScreen.html" class="nav-link">Início</a>
            <a href="ChatScreen.html" class="nav-link">Chat de Apoio</a>
            <a href="ResourcesScreen.html" class="nav-link">Recursos</a>
            <a href="ReportScreen.html" class="nav-link">Denúncia</a>
          </nav>
          <div class="d-none d-md-flex align-items-center gap-3">
            ${isLoggedIn
        ? `<button onclick="SafeNet.logout()" class="text-muted-foreground hover:text-primary text-sm font-bold transition-all bg-transparent border-0">Sair</button>`
        : `<a href="LoginScreen.html" class="text-muted-foreground hover:text-primary text-sm font-bold transition-all text-decoration-none">Entrar</a>`
      }
            <a href="ChatScreen.html" class="bg-primary text-white px-6 py-2.5 rounded-2xl text-sm font-black shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all text-decoration-none">Pedir Ajuda</a>
          </div>
          <button id="mobile-toggle" class="d-md-none p-2 rounded-xl hover:bg-muted active:scale-95 transition-all text-foreground border-0 bg-transparent" aria-label="Menu" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>
    `;
  },

  renderFooter() {
    const footer = document.getElementById('main-footer-container');
    if (!footer) return;
    footer.innerHTML = `
      <footer class="border-top border-black/5 py-5 mt-5">
        <div class="container px-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
          <div class="d-flex align-items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-primary d-flex align-items-center justify-center shadow-lg shadow-primary/20">
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
  },

  initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-reveal').forEach(el => observer.observe(el));
  },

  initNavbar() {
    const navbar = document.getElementById('main-navbar');
    const toggle = document.getElementById('mobile-toggle');
    if (!navbar || !toggle) return;

    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);

      let menu = document.getElementById('mobile-menu');
      if (!menu) {
        const isLoggedIn = localStorage.getItem('safenet_logged_in') === 'true';
        menu = document.createElement('div');
        menu.id = 'mobile-menu';
        menu.className = 'd-md-none border-t border-border/50 bg-white/95 backdrop-blur-md animate-fade-in position-fixed w-100 start-0 z-40';
        menu.style.top = '64px';
        menu.innerHTML = `
          <div class="container py-4 space-y-2">
            <a href="HomeScreen.html" class="nav-link d-block">Início</a>
            <a href="ChatScreen.html" class="nav-link d-block">Chat de Apoio</a>
            <a href="ResourcesScreen.html" class="nav-link d-block">Recursos</a>
            <a href="ReportScreen.html" class="nav-link d-block">Denúncia</a>
            <hr class="border-border/50 my-2">
            ${isLoggedIn
            ? `<button onclick="SafeNet.logout()" class="nav-link d-block w-100 text-left bg-transparent border-0">Sair</button>`
            : `<a href="LoginScreen.html" class="nav-link d-block">Entrar / Registar</a>`
          }
            <a href="ChatScreen.html" class="d-block w-100 bg-primary text-white text-center px-4 py-3 rounded-xl text-sm font-black mt-2 text-decoration-none shadow-lg">Pedir Ajuda</a>
          </div>
        `;
        document.body.appendChild(menu);
        this.initActiveLinks();
      } else {
        menu.classList.toggle('d-none');
      }
    });
  },

  logout() {
    localStorage.removeItem('safenet_logged_in');
    window.location.reload();
  },

  login() {
    localStorage.setItem('safenet_logged_in', 'true');
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || 'HomeScreen.html';
    window.location.href = redirect;
  },

  initActiveLinks() {
    const currentPath = window.location.pathname.split('/').pop() || 'HomeScreen.html';
    const normalizedPath = (currentPath === 'index.html' || currentPath === '') ? 'HomeScreen.html' : currentPath;

    document.querySelectorAll('.nav-link').forEach(link => {
      const path = link.getAttribute('href');
      if (path === normalizedPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  initAccordions() {
    window.toggleAccordion = (trigger) => {
      const item = trigger.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const isOpen = item.getAttribute('data-state') === 'open';
      const accordion = trigger.closest('.accordion');
      if (accordion) {
        accordion.querySelectorAll('.accordion-item').forEach(other => {
          if (other !== item) {
            other.setAttribute('data-state', 'closed');
            const otherContent = other.querySelector('.accordion-content');
            if (otherContent) otherContent.style.height = '0px';
          }
        });
      }
      if (isOpen) {
        item.setAttribute('data-state', 'closed');
        content.style.height = '0px';
      } else {
        item.setAttribute('data-state', 'open');
        content.style.height = content.scrollHeight + 'px';
      }
    };
    document.querySelectorAll('.accordion-content').forEach(c => c.style.height = '0px');
  },

  initAlertHandlers() {
    window.openAlertDialog = (id) => {
      const o = document.getElementById(`${id}-overlay`);
      const c = document.getElementById(`${id}-content`);
      if (o && c) {
        o.style.display = 'block';
        c.style.display = 'grid';
        setTimeout(() => {
          o.setAttribute('data-state', 'open');
          c.setAttribute('data-state', 'open');
        }, 10);
        document.body.style.overflow = 'hidden';
      }
    };
    window.closeAlertDialog = (id) => {
      const o = document.getElementById(`${id}-overlay`);
      const c = document.getElementById(`${id}-content`);
      if (o && c) {
        o.setAttribute('data-state', 'closed');
        c.setAttribute('data-state', 'closed');
        setTimeout(() => {
          o.style.display = 'none';
          c.style.display = 'none';
          document.body.style.overflow = '';
        }, 200);
      }
    };
  },

  initCarousel() {
    const viewportNode = document.getElementById('embla-viewport');
    if (!viewportNode || typeof EmblaCarousel !== 'function') return;
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const emblaApi = EmblaCarousel(viewportNode, { loop: false });
    const updateButtons = () => {
      if (prevBtn) prevBtn.disabled = !emblaApi.canScrollPrev();
      if (nextBtn) nextBtn.disabled = !emblaApi.canScrollNext();
    };
    if (prevBtn) prevBtn.addEventListener('click', () => emblaApi.scrollPrev());
    if (nextBtn) nextBtn.addEventListener('click', () => emblaApi.scrollNext());
    emblaApi.on('select', updateButtons);
    emblaApi.on('init', updateButtons);
    emblaApi.on('reInit', updateButtons);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') emblaApi.scrollPrev();
      if (e.key === 'ArrowRight') emblaApi.scrollNext();
    });
  },

  initChat() {
    const container = document.getElementById("messagesContainer");
    const input = document.getElementById("chatInput");
    const btn = document.getElementById("sendButton");
    if (!container || !input || !btn) return;

    let messages = [
      { id: 1, text: "Olá! 👋 Sou o teu assistente de apoio. Estou aqui para te ajudar de forma segura e confidencial.", sender: "bot" },
      { id: 2, text: "Como te posso ajudar hoje?", sender: "bot" },
    ];

    const botResponses = {
      "Preciso de ajuda": "Claro, estou aqui para te ouvir. Podes contar-me o que se passa? 💙",
      "Quero denunciar": "Compreendo. Posso ajudar-te a fazer uma denúncia. Queres descrever o que aconteceu?",
      "Sinto-me triste": "Lamento que estejas a passar por isso. Lembra-te: não estás sozinho/a. Queres falar sobre o que sentes?",
      "Não sei o que fazer": "Está tudo bem não saber. Vamos falar com calma e encontrar uma solução juntos. 🤝",
    };

    const userIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-foreground"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    const botIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;

    const render = () => {
      container.innerHTML = messages.map(msg => {
        const isUser = msg.sender === "user";
        return `
          <div class="flex gap-4 ${isUser ? "flex-row-reverse" : ""} animate-scale-in">
            <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${isUser ? "bg-primary" : "bg-[#7c3aed]"}">
              ${isUser ? userIcon : botIcon}
            </div>
            <div class="max-w-[80%] px-5 py-3.5 text-sm leading-relaxed ${isUser ? "bg-primary text-white rounded-2xl rounded-tr-sm" : "bg-[#f1f5f9] text-[#1e293b] rounded-2xl rounded-tl-sm"}">
              ${msg.text}
            </div>
          </div>
        `;
      }).join('');
      if (messages.length <= 2) {
        const quick = ["Preciso de ajuda", "Quero denunciar", "Sinto-me triste", "Não sei o que fazer"];
        const qHtml = `<div class="flex flex-wrap gap-2.5 pt-4 pl-13">${quick.map(r => `<button onclick="SafeNet.sendChat('${r}')" class="bg-[#f1f5f9] text-[#4338ca] px-5 py-2.5 rounded-full text-sm font-semibold active:scale-95 transition-all duration-150 hover:bg-[#e2e8f0] cursor-pointer border-0">${r}</button>`).join('')}</div>`;
        container.innerHTML += qHtml;
      }
      container.scrollTop = container.scrollHeight;
    };

    window.SafeNet.sendChat = (text) => {
      if (!text || !text.trim()) return;
      messages.push({ id: Date.now(), text: text.trim(), sender: "user" });
      input.value = "";
      btn.disabled = true;
      render();
      setTimeout(() => {
        const res = botResponses[text.trim()] || "Obrigado por partilhares. Estou aqui para te ouvir e ajudar no que precisares. 💙";
        messages.push({ id: Date.now() + 1, text: res, sender: "bot" });
        render();
      }, 800);
    };

    input.addEventListener('input', (e) => btn.disabled = !e.target.value.trim());
    input.addEventListener('keydown', (e) => e.key === 'Enter' && window.SafeNet.sendChat(input.value));
    btn.addEventListener('click', () => window.SafeNet.sendChat(input.value));
    render();
  },

  initReport() {
    const desc = document.getElementById('description');
    const pBtn = document.getElementById('platformDropdownBtn');
    const pDrop = document.getElementById('platformDropdown');
    const sPlat = document.getElementById('selectedPlatform');
    const dIcon = document.getElementById('dropdownIcon');
    const fInp = document.getElementById('fileInput');
    const fCnt = document.getElementById('fileCount');
    const sBtn = document.getElementById('submitBtn');
    if (!desc || !pBtn || !pDrop || !sBtn) return;

    // Verificar login
    const isLoggedIn = localStorage.getItem('safenet_logged_in') === 'true';
    if (!isLoggedIn) {
      window.location.href = 'LoginScreen.html?redirect=ReportScreen.html';
      return;
    }

    const platforms = ["Instagram", "TikTok", "WhatsApp", "Snapchat", "Facebook", "YouTube", "Discord", "Outro"];
    pDrop.innerHTML = platforms.map(p => `<button class="w-full text-left px-5 py-3 text-sm hover:bg-muted transition-colors text-foreground" onclick="SafeNet.selectPlatform('${p}')">${p}</button>`).join('');

    pBtn.addEventListener('click', () => {
      pDrop.classList.toggle('hidden');
      if (dIcon) dIcon.classList.toggle('rotate-180');
    });

    window.SafeNet.selectPlatform = (p) => {
      sPlat.innerText = p;
      sPlat.classList.remove('text-muted-foreground');
      sPlat.classList.add('text-foreground');
      pDrop.classList.add('hidden');
      if (dIcon) dIcon.classList.remove('rotate-180');
    };

    window.addEventListener('click', (e) => {
      if (!pBtn.contains(e.target) && !pDrop.contains(e.target)) {
        pDrop.classList.add('hidden');
        if (dIcon) dIcon.classList.remove('rotate-180');
      }
    });

    if (fInp) {
      fInp.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
          fCnt.innerText = `✓ ${files.length} ficheiro(s) selecionado(s)`;
          fCnt.classList.remove('hidden');
        } else {
          fCnt.classList.add('hidden');
        }
      });
    }

    desc.addEventListener('input', (e) => sBtn.disabled = !e.target.value.trim());
    sBtn.addEventListener('click', () => {
      if (desc.value.trim()) window.location.href = 'ConfirmationScreen.html';
    });
  },

  initResources() {
    const grid = document.getElementById('resourcesGrid');
    if (!grid) return;

    const resources = [
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
        title: "Linha de Ajuda",
        desc: "Liga para a Linha SOS Criança: 116 111. Disponível 24 horas.",
        color: "bg-[#fee2e2] text-[#ef4444]"
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
        title: "Segurança Online",
        desc: "Dicas práticas para protegeres a tua presença digital.",
        color: "bg-[#e0f2fe] text-[#0ea5e9]"
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
        title: "O que é Cyberbullying?",
        desc: "Aprende a identificar sinais e formas de cyberbullying.",
        color: "bg-[#f3e8ff] text-[#a855f7]"
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
        title: "Saúde Mental",
        desc: "Cuida de ti. Recursos sobre bem-estar emocional.",
        color: "bg-[#fee2e2] text-[#ef4444]"
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><circle cx="19" cy="11" r="3"/></svg>`,
        title: "Falar com Alguém",
        desc: "Como pedir ajuda a um adulto de confiança.",
        color: "bg-[#e0f2fe] text-[#0ea5e9]"
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>`,
        title: "Links Úteis",
        desc: "Organizações portuguesas de apoio e proteção de jovens.",
        color: "bg-[#f3e8ff] text-[#a855f7]"
      }
    ];

    grid.innerHTML = resources.map((res, i) => `
      <div class="animate-fade-up flex flex-col items-start gap-4 p-8 rounded-[2rem] bg-white border border-border/40 text-left shadow-sm hover:shadow-md transition-all duration-300" style="animation-delay: ${i * 100}ms;">
        <div class="w-11 h-11 rounded-2xl ${res.color} flex items-center justify-center shadow-sm">
          ${res.icon}
        </div>
        <div>
          <h3 class="font-bold text-lg mb-2 text-[#1e293b]">${res.title}</h3>
          <p class="text-sm text-muted-foreground leading-relaxed">${res.desc}</p>
        </div>
      </div>
    `).join('');
  },

  adaptViewport() {
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
  }
};

document.addEventListener('DOMContentLoaded', () => SafeNet.init());
