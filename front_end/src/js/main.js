const SafeNet = {
  init() {
    this.initNavbar();
    this.initActiveLinks();
    this.initAccordions();
    this.initAlertHandlers();
    this.initCarousel();
    this.initChat();
    this.initReport();
    this.initResources();
  },

  initNavbar() {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => {
      const isOpen = !menu.classList.contains('hidden');
      menu.classList.toggle('hidden');
      menuIcon.classList.toggle('hidden', !isOpen);
      closeIcon.classList.toggle('hidden', isOpen);
    });
  },

  initActiveLinks() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const path = link.getAttribute('data-path') || link.getAttribute('href');
      if (path === currentPath || (currentPath === 'index.html' && path === 'HomeScreen.html')) {
        link.classList.remove('text-muted-foreground', 'hover:text-foreground', 'hover:bg-muted');
        link.classList.add('bg-primary/10', 'text-primary');
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
    const botIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent-foreground"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;

    const render = () => {
      container.innerHTML = messages.map(msg => {
        const isUser = msg.sender === "user";
        return `
          <div class="flex gap-3 ${isUser ? "flex-row-reverse" : ""} animate-scale-in">
            <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${isUser ? "bg-primary" : "bg-accent"}">
              ${isUser ? userIcon : botIcon}
            </div>
            <div class="max-w-[70%] px-5 py-3.5 text-sm leading-relaxed ${isUser ? "bg-chat-user text-chat-user-foreground rounded-2xl rounded-tr-md" : "bg-chat-bot text-chat-bot-foreground rounded-2xl rounded-tl-md"}">
              ${msg.text}
            </div>
          </div>
        `;
      }).join('');
      if (messages.length <= 3) {
        const quick = ["Preciso de ajuda", "Quero denunciar", "Sinto-me triste", "Não sei o que fazer"];
        const qHtml = `<div class="flex flex-wrap gap-2 pt-3 pl-11">${quick.map(r => `<button onclick="SafeNet.sendChat('${r}')" class="bg-secondary text-secondary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-all duration-150 border border-border/60 hover:shadow-md cursor-pointer">${r}</button>`).join('')}</div>`;
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
      { icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`, title: "Linha de Ajuda", desc: "SOS Criança: 116 111. 24h.", color: "bg-alert text-alert-foreground" },
      { icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`, title: "Segurança Online", desc: "Dicas de proteção digital.", color: "bg-primary/10 text-primary" },
      { icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`, title: "Cyberbullying?", desc: "Identifica os sinais.", color: "bg-secondary text-secondary-foreground" },
      { icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`, title: "Saúde Mental", desc: "Bem-estar emocional.", color: "bg-alert text-alert-foreground" },
      { icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="19" cy="11" r="3"/></svg>`, title: "Falar com Alguém", desc: "Adultos de confiança.", color: "bg-primary/10 text-primary" },
      { icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>`, title: "Links Úteis", desc: "Organizações de apoio.", color: "bg-secondary text-secondary-foreground" }
    ];

    grid.innerHTML = resources.map((res, i) => `
      <button class="animate-fade-up flex flex-col items-start gap-4 p-6 rounded-2xl bg-card border border-border/60 text-left card-hover shadow-sm" style="animation-delay: ${i * 100}ms;">
        <div class="p-3 rounded-xl ${res.color}">${res.icon}</div>
        <div>
          <h3 class="font-bold text-base mb-1 text-foreground">${res.title}</h3>
          <p class="text-sm text-muted-foreground leading-relaxed">${res.desc}</p>
        </div>
      </button>
    `).join('');
  }
};

document.addEventListener('DOMContentLoaded', () => SafeNet.init());
