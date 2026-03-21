(() => {
  const SafeNet = window.SafeNet;

  SafeNet.initResources = function () {
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
        desc: "Faz o nosso questionário para identificares sinais de cyberbullying.",
        color: "bg-[#f3e8ff] text-[#a855f7]",
        href: "QuizScreen.html"
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
      <${res.href ? `a href="${res.href}"` : 'div'} class="animate-fade-up flex flex-col items-start gap-4 p-8 rounded-[2rem] bg-white border border-border/40 text-left shadow-sm hover:shadow-md transition-all duration-300 text-decoration-none" style="animation-delay: ${i * 100}ms;">
        <div class="w-11 h-11 rounded-2xl ${res.color} flex items-center justify-center shadow-sm">
          ${res.icon}
        </div>
        <div>
          <h3 class="font-bold text-lg mb-2 text-[#1e293b]">${res.title}</h3>
          <p class="text-sm text-muted-foreground leading-relaxed">${res.desc}</p>
        </div>
      </${res.href ? 'a' : 'div'}>
    `).join('');
  };
})();
