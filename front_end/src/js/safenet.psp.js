(() => {
  const SafeNet = window.SafeNet;

  SafeNet.initPSPPanel = function () {
    const tbody = document.getElementById('pspReportsTbody');
    const totalEl = document.getElementById('pspTotal');
    const pendingEl = document.getElementById('pspPending');
    const inProgressEl = document.getElementById('pspInProgress');
    const resolvedEl = document.getElementById('pspResolved');
    const filterStatus = document.getElementById('pspFilterStatus');
    const filterPlatform = document.getElementById('pspFilterPlatform');
    const seedBtn = document.getElementById('pspSeedDemo');
    const clearBtn = document.getElementById('pspClearAll');
    const quickSearch = document.getElementById('pspQuickSearch');
    const quickHistory = document.getElementById('pspQuickHistory');
    const modalEl = document.getElementById('pspReportModal');
    if (!tbody || !totalEl || !pendingEl || !inProgressEl || !resolvedEl) return;

    const isLoggedIn = localStorage.getItem('safenet_logged_in') === 'true';
    const userType = localStorage.getItem('safenet_user_type') || '';
    if (!isLoggedIn || userType !== 'psp') {
      window.location.href = 'LoginScreen.html?redirect=PSPScreen.html';
      return;
    }

    const reportsKey = 'safenet_reports';
    const loadReports = () => {
      const raw = localStorage.getItem(reportsKey);
      try {
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
      } catch {
        return [];
      }
    };

    const saveReports = (reports) => {
      localStorage.setItem(reportsKey, JSON.stringify(reports));
    };

    const formatDate = (iso) => {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return '';
      return d.toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const badgeForStatus = (status) => {
      if (status === 'Resolvido') return 'badge rounded-pill text-bg-success';
      if (status === 'Em progresso') return 'badge rounded-pill text-bg-primary';
      return 'badge rounded-pill text-bg-warning';
    };

    const computeCounts = (reports) => {
      const pending = reports.filter(r => r.status === 'Pendente').length;
      const inProgress = reports.filter(r => r.status === 'Em progresso').length;
      const resolved = reports.filter(r => r.status === 'Resolvido').length;
      totalEl.innerText = String(reports.length);
      pendingEl.innerText = String(pending);
      inProgressEl.innerText = String(inProgress);
      resolvedEl.innerText = String(resolved);
    };

    const applyFilters = (reports) => {
      const s = filterStatus ? filterStatus.value : '';
      const p = filterPlatform ? filterPlatform.value : '';
      return reports.filter(r => {
        if (s && r.status !== s) return false;
        if (p && r.platform !== p) return false;
        return true;
      });
    };

    const modal = modalEl ? new bootstrap.Modal(modalEl) : null;
    let currentModalId = null;

    const openModal = (report) => {
      if (!modalEl || !modal) return;
      currentModalId = report.id;
      const title = document.getElementById('pspModalTitle');
      const meta = document.getElementById('pspModalMeta');
      const desc = document.getElementById('pspModalDescription');
      const platform = document.getElementById('pspModalPlatform');
      const status = document.getElementById('pspModalStatus');
      const evidence = document.getElementById('pspModalEvidence');
      const reporter = document.getElementById('pspModalReporter');
      if (title) title.innerText = report.id;
      if (meta) meta.innerText = formatDate(report.createdAt);
      if (desc) desc.innerText = report.description || '';
      if (platform) platform.innerText = report.platform || '';
      if (status) status.innerText = report.status || '';
      if (evidence) evidence.innerText = `${report.evidenceCount || 0} ficheiro(s)`;
      if (reporter) reporter.innerText = (report.reporter && report.reporter.name) ? report.reporter.name : 'Utilizador';
      modal.show();
    };

    const setStatus = (id, nextStatus) => {
      const reports = loadReports();
      const idx = reports.findIndex(r => r.id === id);
      if (idx === -1) return;
      reports[idx].status = nextStatus;
      saveReports(reports);
      render();
    };

    const render = () => {
      const reports = loadReports();
      computeCounts(reports);
      const visible = applyFilters(reports);
      tbody.innerHTML = visible.map(r => `
        <tr>
          <td class="fw-bold text-[#1e293b]">${r.id}</td>
          <td class="text-muted-foreground">${r.platform || ''}</td>
          <td class="text-muted-foreground">${formatDate(r.createdAt)}</td>
          <td><span class="${badgeForStatus(r.status)}">${r.status}</span></td>
          <td class="text-end">
            <div class="d-inline-flex gap-2">
              <button type="button" class="btn btn-sm btn-light border rounded-3 fw-bold" data-psp-action="view" data-id="${r.id}">Ver</button>
              <button type="button" class="btn btn-sm btn-primary rounded-3 fw-bold" data-psp-action="progress" data-id="${r.id}">Em progresso</button>
              <button type="button" class="btn btn-sm btn-success rounded-3 fw-bold" data-psp-action="resolve" data-id="${r.id}">Resolver</button>
            </div>
          </td>
        </tr>
      `).join('');

      tbody.querySelectorAll('button[data-psp-action]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const action = btn.getAttribute('data-psp-action');
          const reports = loadReports();
          const report = reports.find(r => r.id === id);
          if (!report) return;
          if (action === 'view') openModal(report);
          if (action === 'progress') setStatus(id, 'Em progresso');
          if (action === 'resolve') setStatus(id, 'Resolvido');
        });
      });
    };

    if (filterStatus) filterStatus.addEventListener('change', render);
    if (filterPlatform) filterPlatform.addEventListener('change', render);

    const modalProgress = document.getElementById('pspModalInProgress');
    const modalResolved = document.getElementById('pspModalResolved');
    if (modalProgress) modalProgress.addEventListener('click', () => currentModalId && setStatus(currentModalId, 'Em progresso'));
    if (modalResolved) modalResolved.addEventListener('click', () => currentModalId && setStatus(currentModalId, 'Resolvido'));

    if (seedBtn) {
      seedBtn.addEventListener('click', () => {
        const sample = [
          {
            id: `SN-${new Date().getFullYear()}-00001`,
            createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
            status: 'Pendente',
            platform: 'Instagram',
            description: 'Recebi mensagens ofensivas e ameaças em mensagens privadas. Tenho prints.',
            evidenceCount: 2,
            reporter: { type: 'citizen', name: 'Ana Costa', phone: '9xx xxx xxx', email: 'ana@example.com' }
          },
          {
            id: `SN-${new Date().getFullYear()}-00002`,
            createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            status: 'Em progresso',
            platform: 'TikTok',
            description: 'Criaram um vídeo com a minha imagem e comentários humilhantes. Está a circular na escola.',
            evidenceCount: 1,
            reporter: { type: 'citizen', name: 'Carlos Sousa', phone: '9xx xxx xxx', email: 'carlos@example.com' }
          },
          {
            id: `SN-${new Date().getFullYear()}-00003`,
            createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            status: 'Resolvido',
            platform: 'WhatsApp',
            description: 'Grupo da turma com insultos constantes e divulgação de dados pessoais.',
            evidenceCount: 0,
            reporter: { type: 'citizen', name: 'Maria Silva', phone: '9xx xxx xxx', email: 'maria@example.com' }
          }
        ];
        saveReports(sample);
        render();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        saveReports([]);
        render();
      });
    }

    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollTo = (el) => {
      if (!el || !el.scrollIntoView) return;
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    };

    if (quickSearch) {
      quickSearch.addEventListener('click', () => {
        if (filterStatus) {
          scrollTo(filterStatus);
          filterStatus.focus();
        } else if (filterPlatform) {
          scrollTo(filterPlatform);
          filterPlatform.focus();
        }
      });
    }

    if (quickHistory) {
      quickHistory.addEventListener('click', () => {
        scrollTo(tbody);
      });
    }

    render();
  };
})();
