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

        const botResponses = {
            "Preciso de ajuda": "Claro, estou aqui para te ouvir. Podes contar-me o que se passa?",
            "Quero denunciar": "Compreendo. Posso ajudar-te a fazer uma denúncia. Queres descrever o que aconteceu?",
            "Sinto-me triste": "Lamento que estejas a passar por isso. Lembra-te: não estás sozinho/a. Queres falar sobre o que sentes?",
            "Não sei o que fazer": "Está tudo bem não saber. Vamos falar com calma e encontrar uma solução juntos.",
        };

        const userIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-foreground"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
        const botIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;

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

            if (messages.length <= 2) {
                const quick = ["Preciso de ajuda", "Quero denunciar", "Sinto-me triste", "Não sei o que fazer"];
                const qHtml = `<div class="flex flex-wrap gap-2.5 pt-4" style="padding-left: 52px;">${quick.map(r => `<button onclick="SafeNet.sendChat('${r}')" class="safenet-chip btn-modern border-0" type="button">${r}</button>`).join('')}</div>`;
                container.innerHTML += qHtml;
            }

            container.scrollTop = container.scrollHeight;
        };

        SafeNet.sendChat = (text) => {
            if (!text || !text.trim()) return;
            messages.push({ id: Date.now(), text: text.trim(), sender: "user" });
            input.value = "";
            btn.disabled = true;
            render();
            setTimeout(() => {
                const res = botResponses[text.trim()] || "Obrigado por partilhares. Estou aqui para te ouvir e ajudar no que precisares.";
                messages.push({ id: Date.now() + 1, text: res, sender: "bot" });
                if (!emergencyCtaShown) {
                    emergencyCtaShown = true;
                    messages.push({
                        id: Date.now() + 2,
                        sender: "bot",
                        text: `
              <div class="fw-bold mb-2">Se estiveres em perigo imediato, liga já para o 112.</div>
              <a href="tel:112" class="d-inline-flex align-items-center gap-2 bg-primary text-white px-5 py-3 rounded-2xl text-sm fw-black text-decoration-none shadow-lg shadow-primary/25 active:scale-[0.98] transition-all">
                Ligar 112
                <span aria-hidden="true">↗</span>
              </a>
            `.trim()
                    });
                }
                render();
            }, 800);
        };

        input.addEventListener('input', (e) => btn.disabled = !e.target.value.trim());
        input.addEventListener('keydown', (e) => e.key === 'Enter' && SafeNet.sendChat(input.value));
        btn.addEventListener('click', () => SafeNet.sendChat(input.value));
        render();
    };
})();
