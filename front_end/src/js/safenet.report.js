(() => {
  const SafeNet = window.SafeNet;

  SafeNet.initReport = function () {
    const desc = document.getElementById('description');
    const typeField = document.getElementById('reportType');
    const typeHint = document.getElementById('reportTypeHint');
    const typeButtons = Array.from(document.querySelectorAll('[data-report-type]'));
    const pBtn = document.getElementById('platformDropdownBtn');
    const pDrop = document.getElementById('platformDropdown');
    const sPlat = document.getElementById('selectedPlatform');
    const dIcon = document.getElementById('dropdownIcon');
    const fInp = document.getElementById('fileInput');
    const fCnt = document.getElementById('fileCount');
    const sBtn = document.getElementById('submitBtn');
    if (!desc || !pBtn || !pDrop || !sBtn) return;

    const isLoggedIn = localStorage.getItem('safenet_logged_in') === 'true';
    const userType = localStorage.getItem('safenet_user_type') || '';
    const needsAuthToSubmit = !isLoggedIn;
    const draftKey = 'safenet_report_draft';
    const requiresType = typeButtons.length > 0;

    const saveDraft = () => {
      const draft = {
        description: desc.value || '',
        platform: (sPlat && !sPlat.classList.contains('text-muted-foreground')) ? (sPlat.innerText || '') : '',
        type: typeField ? (typeField.value || '') : ''
      };
      sessionStorage.setItem(draftKey, JSON.stringify(draft));
    };

    const restoreDraft = () => {
      const raw = sessionStorage.getItem(draftKey);
      if (!raw) return;
      let draft;
      try { draft = JSON.parse(raw); } catch { return; }
      if (draft && typeof draft.description === 'string') desc.value = draft.description;
      if (draft && typeof draft.platform === 'string' && draft.platform.trim()) {
        sPlat.innerText = draft.platform.trim();
        sPlat.classList.remove('text-muted-foreground');
        sPlat.classList.add('text-foreground');
      }
      if (draft && typeof draft.type === 'string' && draft.type.trim() && typeField) {
        typeField.value = draft.type.trim();
      }
      sessionStorage.removeItem(draftKey);
    };

    restoreDraft();

    const updateTypeUI = () => {
      if (!requiresType) return;
      const selected = typeField ? (typeField.value || '').trim() : '';
      typeButtons.forEach(btn => {
        const val = (btn.getAttribute('data-report-type') || '').trim();
        const active = selected && val === selected;
        btn.classList.toggle('border-primary/40', active);
        btn.classList.toggle('bg-white', active);
        btn.classList.toggle('shadow-sm', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      if (typeHint) typeHint.classList.toggle('hidden', !!selected);
    };

    const updateSubmitState = () => {
      const hasDesc = !!(desc.value || '').trim();
      const hasType = !requiresType || !!((typeField && typeField.value) ? typeField.value.trim() : '');
      sBtn.disabled = !(hasDesc && hasType);
    };

    if (requiresType && typeField) {
      typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          typeField.value = (btn.getAttribute('data-report-type') || '').trim();
          updateTypeUI();
          updateSubmitState();
        });
      });
      updateTypeUI();
    }

    if (needsAuthToSubmit) {
      const container = document.querySelector('main .container');
      if (container && !document.getElementById('report-auth-notice')) {
        const notice = document.createElement('div');
        notice.id = 'report-auth-notice';
        notice.className = 'alert alert-warning d-flex align-items-center justify-content-between gap-3 rounded-4 border-0 shadow-sm mb-4';
        notice.innerHTML = `
          <div class="fw-semibold text-[#1e293b]">Para submeter a denúncia, tens de fazer login ou registar.</div>
          <a href="LoginScreen.html?redirect=ReportScreen.html" class="btn btn-sm btn-primary fw-bold rounded-3 px-3">Entrar</a>
        `;
        container.prepend(notice);
      }
    }

    const platforms = ["Instagram", "TikTok", "WhatsApp", "Snapchat", "Facebook", "YouTube", "Discord", "Outro"];
    pDrop.innerHTML = platforms.map(p => `<button class="w-full text-left px-5 py-3 text-sm hover:bg-muted transition-colors text-foreground" onclick="SafeNet.selectPlatform('${p}')">${p}</button>`).join('');

    pBtn.addEventListener('click', () => {
      pDrop.classList.toggle('hidden');
      if (dIcon) dIcon.classList.toggle('rotate-180');
    });

    SafeNet.selectPlatform = (p) => {
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

    desc.addEventListener('input', updateSubmitState);
    updateSubmitState();
    let submitting = false;
    sBtn.addEventListener('click', async () => {
      if (needsAuthToSubmit) {
        saveDraft();
        window.location.href = 'LoginScreen.html?redirect=ReportScreen.html';
        return;
      }

      if (submitting) return;
      const description = desc.value.trim();
      if (!description) return;
      const selectedType = requiresType && typeField ? (typeField.value || '').trim() : '';
      if (requiresType && !selectedType) return;

      const platformText = (sPlat && !sPlat.classList.contains('text-muted-foreground')) ? (sPlat.innerText || '').trim() : '';
      const profileRaw = localStorage.getItem('safenet_user_profile');
      let profile = null;
      try { profile = profileRaw ? JSON.parse(profileRaw) : null; } catch { profile = null; }
      const reporterName = profile && profile.nome ? profile.nome : 'Utilizador';
      const reporterPhone = profile && profile.telemovel ? profile.telemovel : '';
      const reporterEmail = profile && profile.email ? profile.email : '';

      const reportsKey = 'safenet_reports';
      const existingRaw = localStorage.getItem(reportsKey);
      let existing = [];
      try { existing = existingRaw ? JSON.parse(existingRaw) : []; } catch { existing = []; }
      if (!Array.isArray(existing)) existing = [];

      const fallbackId = `SN-${new Date().getFullYear()}-${String(existing.length + 1).padStart(5, '0')}`;
      const filesCount = fInp && fInp.files ? fInp.files.length : 0;
      const report = {
        id: fallbackId,
        createdAt: new Date().toISOString(),
        status: 'Pendente',
        type: selectedType || 'Não indicado',
        platform: platformText || 'Não indicado',
        description,
        evidenceCount: filesCount,
        reporter: {
          type: userType || 'citizen',
          name: reporterName,
          phone: reporterPhone,
          email: reporterEmail
        }
      };

      submitting = true;
      sBtn.disabled = true;
      let finalId = fallbackId;
      let savedRemote = false;
      try {
        if (SafeNet.api && typeof SafeNet.api.createReport === 'function') {
          const apiPayload = {
            ...report,
            reporterType: report.reporter ? report.reporter.type : '',
            reporterName: report.reporter ? report.reporter.name : '',
            reporterPhone: report.reporter ? report.reporter.phone : '',
            reporterEmail: report.reporter ? report.reporter.email : ''
          };
          const resp = await SafeNet.api.createReport(apiPayload);
          const remoteId =
            (resp && (resp.id || resp.reportId || resp.reference || resp.codigo)) ||
            (resp && resp.data && (resp.data.id || resp.data.reportId)) ||
            '';
          if (remoteId && String(remoteId).trim()) finalId = String(remoteId).trim();
          savedRemote = true;
        }
      } catch {
        savedRemote = false;
      }

      if (!savedRemote) {
        existing.unshift(report);
        localStorage.setItem(reportsKey, JSON.stringify(existing.slice(0, 200)));
      }

      sessionStorage.setItem('safenet_last_report_id', finalId);
      window.location.href = 'ConfirmationScreen.html';
    });
  };
})();
