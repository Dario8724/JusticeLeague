(() => {
  const SafeNet = window.SafeNet;

  SafeNet.initChat = function () {
    const container = document.getElementById("messagesContainer");
    const input = document.getElementById("chatInput");
    const btn = document.getElementById("sendButton");
    if (!container || !input || !btn) return;

    const SESSION_KEY = "safenet_support_chat_session";
    let messages = [];

    const escapeHtml = (v) => {
      const s = String(v ?? "");
      return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const userIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-foreground"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    const botIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;

    const toUiMessage = (m) => {
      const remetente = String(m?.remetente || "").toUpperCase();
      return {
        id: m?.id || Date.now(),
        text: String(m?.mensagem || ""),
        sender: remetente === "UTILIZADOR" ? "user" : "bot"
      };
    };

    const ensureSessionId = async () => {
      let sessionId = String(localStorage.getItem(SESSION_KEY) || "").trim();
      if (sessionId) return sessionId;
      const created = await SafeNet.apiRequest("/chat-apoio/sessions", { method: "POST", skipAuth: true });
      sessionId = String(created?.sessionId || "").trim();
      if (!sessionId) throw new Error("Sessão de chat inválida");
      localStorage.setItem(SESSION_KEY, sessionId);
      return sessionId;
    };

    const withApiFallback = async (fn) => {
      try {
        return await fn();
      } catch (e) {
        const currentBase = SafeNet.getApiBaseUrl ? SafeNet.getApiBaseUrl() : "";
        if (currentBase && currentBase.includes("localhost:8080")) throw e;
        if (window.SAFENET_CONFIG) window.SAFENET_CONFIG.apiBaseUrl = "http://localhost:8080";
        return await fn();
      }
    };

    const render = () => {
      container.innerHTML = messages.map(msg => {
        const isUser = msg.sender === "user";
        const isSkeleton = !!msg.skeleton;
        return `
          <div class="flex gap-4 ${isUser ? "flex-row-reverse" : ""} animate-scale-in">
            <div class="safenet-chat-avatar ${isUser ? "safenet-chat-avatar--user" : "safenet-chat-avatar--bot"}">
              ${isUser ? userIcon : botIcon}
            </div>
            <div class="safenet-bubble ${isUser ? "safenet-bubble--user" : "safenet-bubble--bot"}">
              ${isSkeleton ? `
                <div class="d-grid gap-2" style="min-width: 220px;">
                  <div class="safenet-skeleton safenet-skeleton-line safenet-skeleton-line--lg" style="width: 78%;"></div>
                  <div class="safenet-skeleton safenet-skeleton-line" style="width: 92%;"></div>
                  <div class="safenet-skeleton safenet-skeleton-line" style="width: 64%;"></div>
                </div>
              `.trim() : escapeHtml(msg.text).replace(/\n/g, "<br/>")}
            </div>
          </div>
        `;
      }).join('');

      container.scrollTop = container.scrollHeight;
    };

    const loadHistory = async () => {
      try {
        const sessionId = await withApiFallback(() => ensureSessionId());
        const history = await withApiFallback(() => SafeNet.apiRequest(`/chat-apoio/sessions/${encodeURIComponent(sessionId)}/messages`, { method: "GET", skipAuth: true }));
        messages = Array.isArray(history) ? history.map(toUiMessage) : [];
      } catch (e) {
        messages = [];
        if (SafeNet.toast) SafeNet.toast("Não foi possível carregar o chat de apoio.", { variant: "danger" });
      } finally {
        render();
      }
    };

    SafeNet.sendChat = async (text) => {
      if (!text || !text.trim()) return;
      const raw = text.trim();
      const optimisticId = Date.now();
      messages.push({ id: optimisticId, text: raw, sender: "user" });
      input.value = "";
      btn.disabled = true;
      render();
      const typingId = Date.now() + 0.5;
      messages.push({ id: typingId, sender: "bot", skeleton: true });
      render();
      try {
        const sessionId = await withApiFallback(() => ensureSessionId());
        const created = await withApiFallback(() => SafeNet.apiRequest(`/chat-apoio/sessions/${encodeURIComponent(sessionId)}/messages`, {
          method: "POST",
          skipAuth: true,
          body: { mensagem: raw }
        }));
        messages = messages.filter(m => m.id !== typingId && m.id !== optimisticId);
        const arr = Array.isArray(created) ? created : [];
        for (const m of arr) {
          messages.push(toUiMessage(m));
        }
        render();
      } catch (e) {
        messages = messages.filter(m => m.id !== typingId);
        messages.push({
          id: Date.now() + 1,
          sender: "bot",
          text: `Não consegui enviar agora. Verifica se o backend está a correr em http://localhost:8080. Detalhes: ${String(e?.message || e || "erro desconhecido")}`
        });
        render();
        if (SafeNet.toast) SafeNet.toast("Não foi possível enviar a mensagem.", { variant: "danger" });
      } finally {
        btn.disabled = !input.value.trim();
      }
    };

    input.addEventListener('input', (e) => btn.disabled = !e.target.value.trim());
    input.addEventListener('keydown', (e) => e.key === 'Enter' && SafeNet.sendChat(input.value));
    btn.addEventListener('click', () => SafeNet.sendChat(input.value));
    render();
    loadHistory();
  };
})();
