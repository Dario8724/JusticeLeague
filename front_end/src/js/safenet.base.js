(() => {
  const SafeNet = window.SafeNet || {};

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

  SafeNet.init = function () {
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
