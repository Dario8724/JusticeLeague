(() => {
  const SafeNet = window.SafeNet || {};

  SafeNet.getAuthToken = function () {
    return localStorage.getItem('safenet_auth_token') || '';
  };

  SafeNet.setAuthToken = function (token) {
    const t = String(token || '').trim();
    if (!t) {
      localStorage.removeItem('safenet_auth_token');
      return;
    }
    localStorage.setItem('safenet_auth_token', t);
  };

  SafeNet.clearAuth = function () {
    localStorage.removeItem('safenet_logged_in');
    localStorage.removeItem('safenet_user_type');
    localStorage.removeItem('safenet_user_profile');
    localStorage.removeItem('safenet_auth_token');
  };

  SafeNet.getConfig = function () {
    return window.SAFENET_CONFIG || {};
  };

  SafeNet.getApiBaseUrl = function () {
    const cfg = this.getConfig();
    const raw = (cfg && cfg.apiBaseUrl) ? String(cfg.apiBaseUrl) : '';
    const trimmed = raw.trim();
    if (!trimmed) return '';
    return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
  };

  SafeNet.getApiPrefix = function () {
    const cfg = this.getConfig();
    const raw = (cfg && cfg.apiPrefix) ? String(cfg.apiPrefix) : '/api';
    let p = raw.trim() || '/api';
    if (!p.startsWith('/')) p = '/' + p;
    if (p.endsWith('/')) p = p.slice(0, -1);
    return p;
  };

  SafeNet.apiUrl = function (path) {
    const p = String(path || '').trim();
    if (!p) return this.getApiBaseUrl() + this.getApiPrefix();
    if (p.startsWith('http://') || p.startsWith('https://')) return p;
    const rel = p.startsWith('/') ? p : '/' + p;
    return this.getApiBaseUrl() + this.getApiPrefix() + rel;
  };

  SafeNet.apiRequest = async function (path, options) {
    const cfg = this.getConfig();
    const timeoutMs = Number.isFinite(cfg.apiTimeoutMs) ? cfg.apiTimeoutMs : 12000;
    const url = this.apiUrl(path);
    if (!url || url === this.getApiPrefix()) throw new Error('API base URL não configurado');

    const init = options ? { ...options } : {};
    const headers = new Headers(init.headers || {});
    headers.set('Accept', headers.get('Accept') || 'application/json');

    const token = this.getAuthToken();
    if (token && !headers.get('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const hasBody = init.body !== undefined && init.body !== null;
    const isForm = hasBody && (init.body instanceof FormData);
    if (hasBody && !isForm) {
      headers.set('Content-Type', headers.get('Content-Type') || 'application/json');
      if (typeof init.body !== 'string') init.body = JSON.stringify(init.body);
    }

    init.headers = headers;
    init.credentials = init.credentials || 'include';

    const ctrl = new AbortController();
    const t = window.setTimeout(() => ctrl.abort(), timeoutMs);
    init.signal = ctrl.signal;

    try {
      const res = await fetch(url, init);
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `HTTP ${res.status}`);
      }
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      if (ct.includes('application/json')) return await res.json();
      const text = await res.text();
      if (!text) return null;
      try { return JSON.parse(text); } catch { return text; }
    } finally {
      window.clearTimeout(t);
    }
  };

  SafeNet.getSurveyPath = function () {
    const cfg = this.getConfig();
    const raw = (cfg && cfg.surveyPath) ? String(cfg.surveyPath) : '/survey';
    let p = raw.trim() || '/survey';
    if (!p.startsWith('/')) p = '/' + p;
    if (p.endsWith('/')) p = p.slice(0, -1);
    return p;
  };

  SafeNet.getReportsPath = function () {
    const cfg = this.getConfig();
    const raw = (cfg && cfg.reportsPath) ? String(cfg.reportsPath) : '/reports';
    let p = raw.trim() || '/reports';
    if (!p.startsWith('/')) p = '/' + p;
    if (p.endsWith('/')) p = p.slice(0, -1);
    return p;
  };

  SafeNet.api = SafeNet.api || {};
  SafeNet.api.listReports = async function () {
    const p = SafeNet.getReportsPath();
    return await SafeNet.apiRequest(p, { method: 'GET' });
  };
  SafeNet.api.createReport = async function (payload) {
    const p = SafeNet.getReportsPath();
    return await SafeNet.apiRequest(p, { method: 'POST', body: payload });
  };
  SafeNet.api.updateReportStatus = async function (id, status) {
    const p = SafeNet.getReportsPath();
    const enc = encodeURIComponent(String(id || '').trim());
    try {
      return await SafeNet.apiRequest(`${p}/${enc}`, { method: 'PATCH', body: { status } });
    } catch {
      return await SafeNet.apiRequest(`${p}/${enc}/status`, { method: 'PUT', body: { status } });
    }
  };
  SafeNet.api.createSurvey = async function (payload) {
    const p = SafeNet.getSurveyPath();
    return await SafeNet.apiRequest(p, { method: 'POST', body: payload });
  };

  SafeNet.getAuthLoginPath = function () {
    const cfg = this.getConfig();
    const raw = (cfg && cfg.authLoginPath) ? String(cfg.authLoginPath) : '/auth/login';
    let p = raw.trim() || '/auth/login';
    if (!p.startsWith('/')) p = '/' + p;
    if (p.endsWith('/')) p = p.slice(0, -1);
    return p;
  };

  SafeNet.getAuthRegisterPath = function () {
    const cfg = this.getConfig();
    const raw = (cfg && cfg.authRegisterPath) ? String(cfg.authRegisterPath) : '/auth/register';
    let p = raw.trim() || '/auth/register';
    if (!p.startsWith('/')) p = '/' + p;
    if (p.endsWith('/')) p = p.slice(0, -1);
    return p;
  };

  SafeNet.getAuthMePath = function () {
    const cfg = this.getConfig();
    const raw = (cfg && cfg.authMePath) ? String(cfg.authMePath) : '/auth/me';
    let p = raw.trim() || '/auth/me';
    if (!p.startsWith('/')) p = '/' + p;
    if (p.endsWith('/')) p = p.slice(0, -1);
    return p;
  };

  SafeNet.getAuthLogoutPath = function () {
    const cfg = this.getConfig();
    const raw = (cfg && cfg.authLogoutPath) ? String(cfg.authLogoutPath) : '/auth/logout';
    let p = raw.trim() || '/auth/logout';
    if (!p.startsWith('/')) p = '/' + p;
    if (p.endsWith('/')) p = p.slice(0, -1);
    return p;
  };

  SafeNet.authLogin = async function (credentials) {
    const payload = credentials ? { ...credentials } : {};
    const redirect = String(payload.redirect || '').trim();
    delete payload.redirect;

    const resp = await this.apiRequest(this.getAuthLoginPath(), { method: 'POST', body: payload });

    const token = (resp && (resp.token || resp.accessToken || resp.jwt)) || '';
    if (token) this.setAuthToken(token);

    const role = (resp && (resp.userType || resp.role || resp.perfil)) || payload.userType || '';
    if (role) localStorage.setItem('safenet_user_type', String(role).toLowerCase());
    localStorage.setItem('safenet_logged_in', 'true');

    const profile =
      (resp && (resp.profile || resp.user)) ||
      (resp && resp.data && (resp.data.profile || resp.data.user)) ||
      null;
    if (profile && typeof profile === 'object') {
      localStorage.setItem('safenet_user_profile', JSON.stringify(profile));
    }

    if (redirect) window.location.href = redirect;
    return resp;
  };

  SafeNet.authRegister = async function (data) {
    const payload = data ? { ...data } : {};
    const redirect = String(payload.redirect || '').trim();
    delete payload.redirect;

    const resp = await this.apiRequest(this.getAuthRegisterPath(), { method: 'POST', body: payload });

    const token = (resp && (resp.token || resp.accessToken || resp.jwt)) || '';
    if (token) this.setAuthToken(token);

    const role = (resp && (resp.userType || resp.role || resp.perfil)) || payload.userType || payload.tipo || '';
    if (role) localStorage.setItem('safenet_user_type', String(role).toLowerCase());
    localStorage.setItem('safenet_logged_in', 'true');

    const profile =
      (resp && (resp.profile || resp.user)) ||
      (resp && resp.data && (resp.data.profile || resp.data.user)) ||
      null;
    if (profile && typeof profile === 'object') {
      localStorage.setItem('safenet_user_profile', JSON.stringify(profile));
    }

    if (redirect) window.location.href = redirect;
    return resp;
  };

  SafeNet.authMe = async function () {
    const resp = await this.apiRequest(this.getAuthMePath(), { method: 'GET' });
    const role = (resp && (resp.userType || resp.role || resp.perfil)) || '';
    if (role) localStorage.setItem('safenet_user_type', String(role).toLowerCase());
    localStorage.setItem('safenet_logged_in', 'true');
    if (resp && typeof resp === 'object') localStorage.setItem('safenet_user_profile', JSON.stringify(resp));
    return resp;
  };

  SafeNet.authLogout = async function () {
    try { await this.apiRequest(this.getAuthLogoutPath(), { method: 'POST' }); } catch { }
    this.clearAuth();
  };

  SafeNet.ensureToastHost = function () {
    if (document.getElementById('safenet-toast-host')) return;
    const host = document.createElement('div');
    host.id = 'safenet-toast-host';
    host.setAttribute('aria-live', 'polite');
    host.setAttribute('aria-atomic', 'true');
    document.body.appendChild(host);
  };

  SafeNet.toast = function (message, options) {
    const text = String(message || '').trim();
    if (!text) return;
    this.ensureToastHost();
    const host = document.getElementById('safenet-toast-host');
    if (!host) return;

    const opts = options && typeof options === 'object' ? options : {};
    const variant = String(opts.variant || 'info').toLowerCase();
    const timeoutMs = Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : 3200;

    const t = document.createElement('div');
    t.className = `safenet-toast safenet-toast--${variant}`;
    t.setAttribute('role', 'status');
    t.innerHTML = `
      <div class="safenet-toast__body">${text}</div>
      <button type="button" class="safenet-toast__close" aria-label="Fechar">×</button>
    `.trim();

    const close = () => {
      t.classList.add('safenet-toast--hide');
      window.setTimeout(() => t.remove(), 220);
    };

    const btn = t.querySelector('.safenet-toast__close');
    if (btn) btn.addEventListener('click', close);
    t.addEventListener('click', (e) => {
      const target = e.target;
      const isLink = target && (target.tagName === 'A' || target.closest('a'));
      if (!isLink) close();
    });

    host.appendChild(t);
    window.setTimeout(() => t.classList.add('safenet-toast--show'), 10);
    if (timeoutMs > 0) window.setTimeout(close, timeoutMs);
  };

  SafeNet.init = function () {
    this.ensureToastHost();
    if (this.renderNavbar) this.renderNavbar();
    if (this.renderFooter) this.renderFooter();
    if (this.initNavbar) this.initNavbar();
    if (this.initActiveLinks) this.initActiveLinks();
    if (this.initHomeMap) this.initHomeMap();
    if (this.initHomeSurvey) this.initHomeSurvey();
    if (this.initPSPPanel) this.initPSPPanel();
    if (this.initChat) this.initChat();
    if (this.initReport) this.initReport();
    if (this.initResources) this.initResources();
    if (this.adaptViewport) this.adaptViewport();
    if (this.initUIEffects) this.initUIEffects();
    if (this.initScrollReveal) this.initScrollReveal();
  };

  window.SafeNet = SafeNet;
})();
