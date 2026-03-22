(() => {
  const SafeNet = window.SafeNet;

  SafeNet.initChat = function () {
    const container = document.getElementById("messagesContainer");
    const input = document.getElementById("chatInput");
    const btn = document.getElementById("sendButton");
    if (!container || !input || !btn) return;

    let messages = [
      { id: 1, text: "Olá. Sou o teu assistente de apoio. Estou aqui para ajudar de forma segura e confidencial.", sender: "bot" },
      { id: 2, text: "Como te posso ajudar hoje?", sender: "bot" },
    ];
    let emergencyCtaShown = false;
    let lastTopic = "";

    const normalize = (v) => {
      const s = String(v || "").trim();
      if (!s) return "";
      return s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    };

    const includesAny = (text, needles) => {
      if (!text) return false;
      return needles.some(n => text.includes(n));
    };

    const classify = (raw) => {
      const t = normalize(raw);
      const urgent =
        includesAny(t, [
          "quero morrer",
          "vou morrer",
          "matar-me",
          "me matar",
          "suicid",
          "auto mutil",
          "automutil",
          "cortar-me",
          "cortar me",
          "fazer mal a mim",
          "nao aguento mais",
          "estou em perigo",
          "perigo agora",
          "ameaçou matar",
          "ameaçou me matar",
          "ameaçou me",
          "ameaçou a minha vida",
        ]);

      const wantsReport = includesAny(t, ["denunciar", "denuncia", "queixa", "reportar", "psp", "policia", "autoridad"]);
      const sextortion = includesAny(t, ["chantagem", "sextortion", "nudes", "nu", "foto intima", "video intimo", "ameaça partilhar", "ameaça publicar", "ameaçou partilhar", "ameaçou publicar", "expor", "vazar", "leak"]);
      const impersonation = includesAny(t, ["perfil falso", "passar por mim", "fingir ser", "imperson", "roubar conta", "hack", "invadiram", "invadido"]);
      const harassment = includesAny(t, ["gozam", "gozo", "insulto", "ameaça", "ameaçam", "humilham", "bullying", "cyberbullying", "assedio", "assediam", "ofensa", "ofens"]);
      const evidence = includesAny(t, ["prova", "provas", "print", "prints", "screenshot", "captura", "evidenc", "link", "mensagem", "conversa"]);
      const law = includesAny(t, ["lei", "legal", "crime", "pena", "artigo", "tribunal", "processo"]);
      const definition = includesAny(t, ["o que e", "oque e", "defin", "significa", "explica"]);
      const asksWhatToDo = includesAny(t, ["o que faco", "oque faco", "o que fazer", "como agir", "como paro", "como parar", "como resolver", "como lido"]);

      let topic = "";
      if (urgent) topic = "urgencia";
      else if (sextortion) topic = "chantagem";
      else if (impersonation) topic = "conta";
      else if (harassment) topic = "assedio";
      else if (law) topic = "lei";
      else if (evidence) topic = "provas";

      let intent = "";
      if (urgent) intent = "urgencia";
      else if (wantsReport) intent = "denunciar";
      else if (asksWhatToDo) intent = "o_que_fazer";
      else if (definition) intent = "definicao";
      else intent = "apoio";

      return { t, urgent, wantsReport, sextortion, impersonation, harassment, evidence, law, definition, asksWhatToDo, topic, intent };
    };

    const cta112 = () => `
      <div class="fw-bold mb-2">Se estiveres em perigo imediato, liga já para o 112.</div>
      <div class="d-flex flex-wrap gap-2">
        <a href="tel:112" class="d-inline-flex align-items-center gap-2 bg-primary text-white px-5 py-3 rounded-2xl text-sm fw-black text-decoration-none shadow-lg shadow-primary/25 active:scale-[0.98] transition-all">
          Ligar 112
          <span aria-hidden="true">↗</span>
        </a>
        <a href="tel:808242424" class="d-inline-flex align-items-center gap-2 bg-white text-primary px-5 py-3 rounded-2xl text-sm fw-black text-decoration-none shadow-lg border">
          SNS 24
          <span class="text-muted-foreground" aria-hidden="true">808 24 24 24</span>
        </a>
      </div>
    `.trim();

    const responseFor = (raw) => {
      const c = classify(raw);
      if (c.topic) lastTopic = c.topic;

      const tipsBase = `
      <div class="fw-bold mb-2">Passos práticos (agora):</div>
      <ul class="mb-0">
        <li>Não respondas a provocações.</li>
        <li>Guarda provas (prints, links, datas e nomes de utilizador).</li>
        <li>Bloqueia e denuncia na plataforma (Instagram/TikTok/WhatsApp/jogo).</li>
        <li>Fala com um adulto de confiança ou com alguém da escola.</li>
      </ul>
    `.trim();

      if (c.urgent) {
        return `
        <div class="fw-bold mb-2">Sinto muito que estejas a passar por isso. A tua segurança vem primeiro.</div>
        <div class="text-muted-foreground mb-3">Se há risco imediato, procura ajuda já. Se estiveres acompanhado/a, diz a alguém perto de ti o que se passa.</div>
        ${cta112()}
      `.trim();
      }

      if (c.sextortion) {
        return `
        <div class="fw-bold mb-2">Isso parece chantagem com conteúdo íntimo (sextortion). Não é culpa tua.</div>
        <ul class="mb-3">
          <li>Não pagues e não envies mais fotos/vídeos.</li>
          <li>Guarda tudo: mensagens, perfis, links, IBAN/MBWay se houver, e prints.</li>
          <li>Denuncia e bloqueia a conta na plataforma.</li>
          <li>Se envolver menores, é ainda mais grave: pede ajuda imediata a um adulto e às autoridades.</li>
        </ul>
        <div class="d-flex flex-wrap gap-2">
          <a href="ReportScreen.html" class="btn-modern bg-primary text-white px-5 py-3 rounded-2xl text-sm fw-black text-decoration-none shadow-lg shadow-primary/25">Fazer denúncia</a>
          <a href="InfoScreen.html" class="btn-modern bg-white text-primary px-5 py-3 rounded-2xl text-sm fw-black text-decoration-none shadow-lg border">Ver informação</a>
        </div>
      `.trim();
      }

      if (c.impersonation) {
        return `
        <div class="fw-bold mb-2">Percebi. Pode ser impersonação ou conta comprometida.</div>
        <ul class="mb-3">
          <li>Reporta o perfil/conta falsa na plataforma.</li>
          <li>Se for a tua conta: muda a palavra-passe e ativa 2FA (autenticação em 2 passos).</li>
          <li>Revê dispositivos ligados e termina sessões desconhecidas.</li>
          <li>Guarda provas (URL do perfil, prints, mensagens).</li>
        </ul>
        <div class="text-muted-foreground">Diz-me: é um perfil falso a passar-se por ti, ou achas que a tua conta foi invadida?</div>
      `.trim();
      }

      if (c.wantsReport) {
        return `
        <div class="fw-bold mb-2">Posso ajudar-te a denunciar.</div>
        <div class="text-muted-foreground mb-3">Antes de preencher, é útil ter as provas preparadas (prints/links/datas).</div>
        <div class="d-flex flex-wrap gap-2">
          <a href="ReportScreen.html" class="btn-modern bg-primary text-white px-5 py-3 rounded-2xl text-sm fw-black text-decoration-none shadow-lg shadow-primary/25">Abrir denúncia</a>
          <a href="InfoScreen.html" class="btn-modern bg-white text-primary px-5 py-3 rounded-2xl text-sm fw-black text-decoration-none shadow-lg border">Saber mais</a>
        </div>
        <div class="text-muted-foreground mt-3">Queres dizer-me em que plataforma aconteceu (Instagram, WhatsApp, TikTok, jogo, etc.)?</div>
      `.trim();
      }

      if (c.definition) {
        return `
        <div class="fw-bold mb-2">Cyberbullying é violência online repetida.</div>
        <div class="text-muted-foreground">Pode ser insultos, humilhação, ameaças, partilha de conteúdo sem consentimento, contas falsas ou chantagem. Se estiver a afetar-te, é sério e merece apoio.</div>
      `.trim();
      }

      if (c.asksWhatToDo || c.harassment) {
        return `
        <div class="fw-bold mb-3">Percebo. Vamos por partes.</div>
        ${tipsBase}
        <div class="text-muted-foreground mt-3">Se me disseres onde aconteceu (rede social/jogo/mensagens) e se houve ameaças, eu digo-te os próximos passos mais certos.</div>
      `.trim();
      }

      if (c.law) {
        return `
        <div class="fw-bold mb-2">Sobre a parte legal:</div>
        <div class="text-muted-foreground mb-3">Não substituo apoio jurídico, mas posso orientar-te nos passos práticos e onde encontrar informação.</div>
        ${tipsBase}
        <div class="text-muted-foreground mt-3">Queres que eu te ajude a preparar uma denúncia (com provas e descrição) ou preferes ler a secção de Legislação na página Informação?</div>
      `.trim();
      }

      if (c.evidence) {
        return `
        <div class="fw-bold mb-2">Boa ideia guardar provas.</div>
        <ul class="mb-0">
          <li>Captura o ecrã com a mensagem e o nome do perfil.</li>
          <li>Guarda links e datas (quando aconteceu).</li>
          <li>Se for em chat, exporta a conversa se a app permitir.</li>
          <li>Não apagues imediatamente: pode ser útil mais tarde.</li>
        </ul>
      `.trim();
      }

      const topicHint = lastTopic
        ? `Queres continuar sobre ${lastTopic === "assedio" ? "assédio online" : lastTopic === "conta" ? "contas/perfis" : lastTopic === "chantagem" ? "chantagem" : "isto"}?`
        : "Queres contar-me um pouco mais do que aconteceu?";

      return `
      <div class="fw-bold mb-2">Obrigado por partilhares.</div>
      <div class="text-muted-foreground mb-3">${topicHint}</div>
      <div class="text-muted-foreground">Diz-me: onde aconteceu (rede social/jogo/mensagens) e o que a outra pessoa fez?</div>
    `.trim();
    };

    const userIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-foreground"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    const botIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;

    const quickActionsFor = () => {
      const base = [
        { label: "Fazer denúncia", kind: "nav", value: "ReportScreen.html" },
        { label: "Contactos úteis", kind: "nav", value: "ResourcesScreen.html#help" },
        { label: "Dicas de segurança", kind: "nav", value: "ResourcesScreen.html#security" },
      ];

      if (lastTopic === "provas") {
        return [
          { label: "Como guardar provas", kind: "send", value: "Quero saber como guardar provas" },
          { label: "Fazer denúncia", kind: "nav", value: "ReportScreen.html" },
          { label: "Contactos úteis", kind: "nav", value: "ResourcesScreen.html#help" },
        ];
      }
      if (lastTopic === "conta") {
        return [
          { label: "Perfil falso", kind: "send", value: "Há um perfil falso a passar-se por mim" },
          { label: "Conta invadida", kind: "send", value: "A minha conta foi invadida" },
          { label: "Contactos úteis", kind: "nav", value: "ResourcesScreen.html#help" },
        ];
      }
      if (lastTopic === "chantagem") {
        return [
          { label: "Guardar provas", kind: "send", value: "Que provas devo guardar?" },
          { label: "Fazer denúncia", kind: "nav", value: "ReportScreen.html" },
          { label: "Contactos úteis", kind: "nav", value: "ResourcesScreen.html#help" },
        ];
      }
      if (lastTopic === "lei") {
        return [
          { label: "Ver legislação", kind: "nav", value: "InfoScreen.html" },
          { label: "Fazer denúncia", kind: "nav", value: "ReportScreen.html" },
          { label: "Guardar provas", kind: "send", value: "Que provas devo guardar?" },
        ];
      }
      if (lastTopic === "assedio") {
        return [
          { label: "O que fazer agora", kind: "send", value: "O que devo fazer agora?" },
          { label: "Guardar provas", kind: "send", value: "Que provas devo guardar?" },
          { label: "Fazer denúncia", kind: "nav", value: "ReportScreen.html" },
        ];
      }

      return base;
    };

    SafeNet.chatAction = (kind, value) => {
      const k = String(kind || "");
      const v = String(value || "");
      if (k === "send") SafeNet.sendChat(v);
      if (k === "nav") window.location.href = v;
    };

    const render = () => {
      container.innerHTML = messages.map(msg => {
        const isUser = msg.sender === "user";
        return `
          <div class="flex gap-4 ${isUser ? "flex-row-reverse" : ""} animate-scale-in">
            <div class="safenet-chat-avatar ${isUser ? "safenet-chat-avatar--user" : "safenet-chat-avatar--bot"}">
              ${isUser ? userIcon : botIcon}
            </div>
            <div class="safenet-bubble ${isUser ? "safenet-bubble--user" : "safenet-bubble--bot"}">
              ${msg.text}
            </div>
          </div>
        `;
      }).join('');

      const initial = [
        { label: "Preciso de ajuda", kind: "send", value: "Preciso de ajuda" },
        { label: "Quero denunciar", kind: "send", value: "Quero denunciar" },
        { label: "Sinto-me triste", kind: "send", value: "Sinto-me triste" },
        { label: "Não sei o que fazer", kind: "send", value: "Não sei o que fazer" },
      ];
      const actions = messages.length <= 2 ? initial : quickActionsFor();
      const qHtml = `
        <div class="flex flex-wrap gap-2.5 pt-4" style="padding-left: 52px;">
          ${actions.map(a => `<button class="safenet-chip btn-modern border-0" type="button" data-chat-kind="${a.kind}" data-chat-value="${a.value.replace(/"/g, '&quot;')}">${a.label}</button>`).join('')}
        </div>
      `.trim();
      container.innerHTML += qHtml;

      container.scrollTop = container.scrollHeight;
    };

    SafeNet.sendChat = (text) => {
      if (!text || !text.trim()) return;
      const raw = text.trim();
      messages.push({ id: Date.now(), text: raw, sender: "user" });
      input.value = "";
      btn.disabled = true;
      render();
      setTimeout(() => {
        const res = responseFor(raw);
        messages.push({ id: Date.now() + 1, text: res, sender: "bot" });

        const c = classify(raw);
        if (c.urgent && !emergencyCtaShown) {
          emergencyCtaShown = true;
        }
        render();
      }, 800);
    };

    input.addEventListener('input', (e) => btn.disabled = !e.target.value.trim());
    input.addEventListener('keydown', (e) => e.key === 'Enter' && SafeNet.sendChat(input.value));
    btn.addEventListener('click', () => SafeNet.sendChat(input.value));
    container.addEventListener('click', (e) => {
      const el = e.target && e.target.closest ? e.target.closest('[data-chat-kind]') : null;
      if (!el) return;
      const kind = el.getAttribute('data-chat-kind');
      const value = el.getAttribute('data-chat-value');
      SafeNet.chatAction(kind, value);
    });
    render();
  };
})();
