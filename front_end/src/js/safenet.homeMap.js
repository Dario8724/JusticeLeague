(() => {
  const SafeNet = window.SafeNet;

  SafeNet.initHomeMap = function () {
    const iframe = document.getElementById('psp-map-iframe');
    if (!iframe) return;
    const buttons = Array.from(document.querySelectorAll('[data-map-query]'));
    const regionBadges = Array.from(document.querySelectorAll('[data-map-region]:not([data-map-query])'));
    const competenceButtons = Array.from(document.querySelectorAll('[data-map-competence]'));
    const regionLabel = document.getElementById('psp-stations-region');
    const competenceLabel = document.getElementById('psp-stations-competence');
    const mapRegionLabel = document.getElementById('psp-map-region-label');
    const mapCompetenceLabel = document.getElementById('psp-map-competence-label');
    const openMapsLink = document.getElementById('psp-open-maps');
    const stationsList = document.getElementById('psp-stations-list');
    if (buttons.length === 0) return;
    if (competenceButtons.length === 0) return;

    const competenceToQuery = (competence, region) => {
      const r = (region && region !== 'Todas') ? region : '';
      const c = (competence || '').trim();
      if (!c) return r ? `Esquadra PSP ${r}` : 'Esquadra PSP';
      const suffix = r ? ` ${r}` : '';
      if (c === 'Trânsito') return `PSP Trânsito${suffix}`;
      if (c === 'Investigação criminal') return `PSP Investigação Criminal${suffix}`;
      if (c === 'Segurança aeroportuária') return `PSP Segurança Aeroportuária${suffix}`;
      if (c === 'Segurança de instalações') return `PSP Segurança Instalações${suffix}`;
      if (c === 'Transportes públicos') return `PSP Transportes Públicos${suffix}`;
      return `PSP ${c}${suffix}`;
    };

    let currentRegion = 'Todas';
    let currentCompetence = '';

    const setActive = (activeBtn) => {
      buttons.forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-light');
        btn.classList.add('border');
      });
      activeBtn.classList.remove('btn-light');
      activeBtn.classList.remove('border');
      activeBtn.classList.add('btn-primary');
    };

    const setActiveCompetence = (activeBtn) => {
      competenceButtons.forEach(btn => {
        btn.classList.remove('text-bg-primary');
        btn.classList.add('text-bg-light');
        btn.classList.add('border');
        btn.classList.remove('border-0');
      });
      activeBtn.classList.remove('text-bg-light');
      activeBtn.classList.remove('border');
      activeBtn.classList.add('text-bg-primary');
      activeBtn.classList.add('border-0');
    };

    const setMap = (query) => {
      iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
      if (openMapsLink) {
        openMapsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
      }
    };

    const renderStations = (region, competence) => {
      if (!regionLabel || !stationsList) return;
      regionLabel.innerText = region || 'Todas';
      if (competenceLabel) competenceLabel.innerText = (competence || '').trim() ? competence : 'Todas';
      if (mapRegionLabel) mapRegionLabel.innerText = region || 'Todas';
      if (mapCompetenceLabel) mapCompetenceLabel.innerText = (competence || '').trim() ? competence : 'Todas';
      const r = (region && region !== 'Todas') ? region : '';
      const c = (competence || '').trim();
      const primaryQuery = competenceToQuery(c, region);
      setMap(primaryQuery);
      const items = [
        {
          title: c ? `Pesquisar PSP (${c})${r ? ` em ${r}` : ''}` : (r ? `Pesquisar esquadras da PSP em ${r}` : 'Pesquisar esquadras da PSP (todas as regiões)'),
          query: primaryQuery
        },
        {
          title: r ? `Pesquisar postos/atendimento PSP em ${r}` : 'Pesquisar postos/atendimento PSP',
          query: r ? `PSP posto atendimento ${r}` : 'PSP posto atendimento'
        },
        {
          title: r ? `Abrir lista no Google Maps (${r})` : 'Abrir lista no Google Maps',
          url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(primaryQuery)}`
        }
      ];

      stationsList.innerHTML = items.map(item => {
        if (item.url) {
          return `
            <a href="${item.url}" target="_blank" rel="noopener"
              class="d-flex align-items-center justify-content-between px-4 py-3 rounded-4 border border-black/5 bg-[#f8f9fa] text-decoration-none">
              <span class="fw-bold text-[#1e293b] small">${item.title}</span>
              <span class="text-muted-foreground small">↗</span>
            </a>
          `;
        }
        return `
          <button type="button" data-map-query="${item.query}" data-map-region="${region || 'Todas'}"
            class="d-flex align-items-center justify-content-between px-4 py-3 rounded-4 border border-black/5 bg-[#f8f9fa] w-100 text-start">
            <span class="fw-bold text-[#1e293b] small">${item.title}</span>
            <span class="text-muted-foreground small">→</span>
          </button>
        `;
      }).join('');

      stationsList.querySelectorAll('button[data-map-query]').forEach(btn => {
        btn.addEventListener('click', () => {
          const query = btn.getAttribute('data-map-query') || 'Esquadra PSP';
          setMap(query);
        });
      });
    };

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const region = btn.getAttribute('data-map-region') || 'Todas';
        currentRegion = region;
        const query = competenceToQuery(currentCompetence, currentRegion);
        setActive(btn);
        renderStations(currentRegion, currentCompetence);
      });
    });

    competenceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const competence = btn.getAttribute('data-map-competence') || '';
        currentCompetence = competence;
        setActiveCompetence(btn);
        renderStations(currentRegion, currentCompetence);
      });
    });

    regionBadges.forEach(badge => {
      badge.addEventListener('click', () => {
        const region = badge.getAttribute('data-map-region') || 'Todas';
        currentRegion = region;
        const match = buttons.find(b => (b.getAttribute('data-map-region') || '') === region);
        if (match) {
          match.click();
          return;
        }
        renderStations(currentRegion, currentCompetence);
      });
    });

    const initial = buttons[0];
    setActive(initial);
    currentRegion = initial.getAttribute('data-map-region') || 'Todas';
    const initialCompetence = competenceButtons[0];
    setActiveCompetence(initialCompetence);
    currentCompetence = initialCompetence.getAttribute('data-map-competence') || '';
    renderStations(currentRegion, currentCompetence);
  };
})();
