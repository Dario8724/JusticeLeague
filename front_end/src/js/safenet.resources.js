(() => {
  const SafeNet = window.SafeNet;

  SafeNet.initResources = function () {
    const grid = document.getElementById('resourcesGrid');
    if (!grid) return;

    const telHref = (raw) => `tel:${String(raw || '').replace(/[^\d+]/g, '')}`;

    const ensureHelpPanel = () => {
      if (document.getElementById('helpLineModal')) return;

      const pspContacts = [
        {
          unit: 'COMANDO METROPOLITANO DE LISBOA',
          address: 'Av. de Moscavide, n.º 88, Edifício da PSP',
          postalCode: '1886-502',
          locality: 'Moscavide',
          phone: '217 654 242',
          fax: '217 654 338',
          email: ''
        },
        {
          unit: '1ª Divisão Policial de Lisboa',
          address: 'Rua da Palma, n.º 169',
          postalCode: '1100-391',
          locality: 'Lisboa',
          phone: '219 021 200',
          fax: '219 021 009',
          email: ''
        },
        {
          unit: '2ª Divisão Policial de Lisboa',
          address: 'Rua Cidade de Nampula, Edifício PSP',
          postalCode: '1800-105',
          locality: 'Lisboa',
          phone: '219 021 300',
          fax: '219 021 009',
          email: ''
        },
        {
          unit: '3ª Divisão Policial de Lisboa',
          address: 'Rua André de Resende, s/n',
          postalCode: '1500-040',
          locality: 'Lisboa',
          phone: '219 021 400',
          fax: '219 021 009',
          email: ''
        },
        {
          unit: '4ª Divisão Policial de Lisboa',
          address: 'Largo do Calvário, n.º 7',
          postalCode: '1300-113',
          locality: 'Lisboa',
          phone: '219 021 500',
          fax: '219 021 009',
          email: ''
        },
        {
          unit: '5ª Divisão Policial de Lisboa',
          address: 'Av. Coronel Eduardo Galhardo - Edifício da PSP',
          postalCode: '1170-105',
          locality: 'Lisboa',
          phone: '219 021 600',
          fax: '219 021 009',
          email: ''
        },
        {
          unit: 'Divisão de Segurança a Transportes Públicos de Lisboa',
          address: 'Estação da CP/Rossio',
          postalCode: '1200-147',
          locality: 'Lisboa',
          phone: '219 021 940',
          fax: '219 021 009',
          email: ''
        },
        {
          unit: 'Divisão de Investigação Criminal de Lisboa',
          address: 'Estrada Forte do Alto do Duque, Forte do Alto do Duque, s/n',
          postalCode: '1449-028',
          locality: 'Lisboa',
          phone: '219 021 800',
          fax: '219 021 009',
          email: ''
        },
        {
          unit: 'Esquadra de Segurança ao Campus Justiça de Lisboa',
          address: 'Avª D. João II, Lote 1.08, Edifício F, Parque das Nações',
          postalCode: '1990-097',
          locality: 'Lisboa',
          phone: '218 364 090',
          fax: '218 364 096',
          email: ''
        },
        {
          unit: 'SECÇÃO DE ACHADOS DO AEROPORTO - LISBOA',
          address: 'Chegadas, Aeroporto de Lisboa',
          postalCode: '1700-008',
          locality: 'Lisboa',
          phone: '218 413 896',
          fax: '',
          email: ''
        },
        {
          unit: 'Secção de Achados Lisboa',
          address: 'Praça Cidade Salazar 180',
          postalCode: '1800-125',
          locality: 'Lisboa',
          phone: '219 021 147',
          fax: '',
          email: ''
        },
        {
          unit: 'Esquadra de Trânsito do Aeroporto de Lisboa',
          address: 'Chegadas, Aeroporto Lisboa',
          postalCode: '1700-008',
          locality: 'Lisboa',
          phone: '218 444 530',
          fax: '',
          email: ''
        },
        {
          unit: 'Esquadra de Turismo de Lisboa – Posto de Atendimento (Horário 08H00 às 23H00)',
          address: 'Doca Jardim do Tabaco, Terminal de Cruzeiros de Lisboa, Edifício SW',
          postalCode: '1100-651',
          locality: 'Lisboa',
          phone: '219 021 950',
          fax: '219 021 009',
          email: ''
        }
      ];

      const rowsHtml = pspContacts.map((c) => {
        const phone = c.phone ? `<a class="fw-bold text-decoration-none" href="${telHref(c.phone)}">${c.phone}</a>` : `<span class="text-muted-foreground">—</span>`;
        const fax = c.fax ? `<span class="text-muted-foreground">${c.fax}</span>` : `<span class="text-muted-foreground">—</span>`;
        const email = c.email ? `<a class="text-decoration-none" href="mailto:${c.email}">${c.email}</a>` : `<span class="text-muted-foreground">—</span>`;

        return `
          <div class="card-modern p-4">
            <div class="d-flex flex-column flex-lg-row gap-3 justify-content-between">
              <div style="min-width: 16rem;">
                <div class="fw-black text-[#1e293b]">${c.unit}</div>
                <div class="text-muted-foreground small">${c.address}</div>
              </div>
              <div class="d-flex flex-wrap gap-4 align-items-start">
                <div>
                  <div class="text-muted-foreground text-xs fw-bold text-uppercase tracking-[0.12em]">Cód. Postal</div>
                  <div class="fw-semibold text-[#1e293b]">${c.postalCode || '—'}</div>
                </div>
                <div>
                  <div class="text-muted-foreground text-xs fw-bold text-uppercase tracking-[0.12em]">Localidade</div>
                  <div class="fw-semibold text-[#1e293b]">${c.locality || '—'}</div>
                </div>
                <div>
                  <div class="text-muted-foreground text-xs fw-bold text-uppercase tracking-[0.12em]">Telefone</div>
                  <div>${phone}</div>
                </div>
                <div>
                  <div class="text-muted-foreground text-xs fw-bold text-uppercase tracking-[0.12em]">Fax</div>
                  <div>${fax}</div>
                </div>
                <div>
                  <div class="text-muted-foreground text-xs fw-bold text-uppercase tracking-[0.12em]">Email</div>
                  <div>${email}</div>
                </div>
              </div>
            </div>
          </div>
        `.trim();
      }).join('');

      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        <div class="modal fade" id="helpLineModal" tabindex="-1" aria-labelledby="helpLineModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
            <div class="modal-content border-0 overflow-hidden" style="border-radius: 2rem;">
              <div class="modal-header px-4 px-md-5 py-4 border-0">
                <div>
                  <div class="text-primary fw-black small tracking-[0.2em] text-uppercase">Linha de Ajuda</div>
                  <h2 id="helpLineModalLabel" class="h4 fw-black mb-0">Contactos úteis</h2>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
              </div>
              <div class="modal-body px-4 px-md-5 pb-5 pt-0">
                <div class="card-modern p-4 mb-4">
                  <div class="d-flex align-items-start justify-content-between gap-3">
                    <div>
                      <div class="fw-black text-[#1e293b] mb-1">Emergência</div>
                      <div class="text-muted-foreground">Se estiveres em perigo imediato, liga para o 112.</div>
                    </div>
                    <a href="tel:112" class="btn-modern bg-primary text-white px-5 py-3 rounded-2xl text-sm fw-black text-decoration-none shadow-lg shadow-primary/25">Ligar 112</a>
                  </div>
                </div>
                <div class="d-flex align-items-end justify-content-between gap-3 mb-3">
                  <div>
                    <div class="fw-black text-[#1e293b]">PSP</div>
                    <div class="text-muted-foreground small">Lista de contactos (começa pelo comando).</div>
                  </div>
                </div>
                <div class="d-grid gap-3">
                  ${rowsHtml}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(wrapper.firstElementChild);
    };

    const ensureSecurityTipsModal = () => {
      if (document.getElementById('securityTipsModal')) return;

      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        <div class="modal fade" id="securityTipsModal" tabindex="-1" aria-labelledby="securityTipsModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div class="modal-content border-0 overflow-hidden" style="border-radius: 2rem;">
              <div class="modal-header px-4 px-md-5 py-4 border-0">
                <div>
                  <div class="text-primary fw-black small tracking-[0.2em] text-uppercase">Segurança Online</div>
                  <h2 id="securityTipsModalLabel" class="h4 fw-black mb-0">Dicas práticas</h2>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
              </div>
              <div class="modal-body px-4 px-md-5 pb-5 pt-0">
                <div class="d-grid gap-3">
                  <div class="card-modern p-4">
                    <div class="fw-black text-[#1e293b] mb-2">1. Protege as tuas contas</div>
                    <ul class="text-muted-foreground mb-0">
                      <li>Usa palavras-passe fortes (com letras, números e símbolos).</li>
                      <li>Ativa a verificação em dois fatores (2FA) em apps como Instagram, WhatsApp e Facebook.</li>
                      <li>Evita partilhar informações pessoais (morada, escola, rotina).</li>
                    </ul>
                  </div>
                  <div class="card-modern p-4">
                    <div class="fw-black text-[#1e293b] mb-2">2. Não respondas ao agressor</div>
                    <div class="text-muted-foreground">Muitas vezes, quem faz cyberbullying quer atenção ou reação. Ignorar pode ajudar a cortar o comportamento.</div>
                  </div>
                  <div class="card-modern p-4">
                    <div class="fw-black text-[#1e293b] mb-2">3. Guarda provas</div>
                    <ul class="text-muted-foreground mb-0">
                      <li>Tira capturas de ecrã das mensagens, comentários ou perfis.</li>
                      <li>Guarda links e datas, isto é importante caso precises de denunciar.</li>
                    </ul>
                  </div>
                  <div class="card-modern p-4">
                    <div class="fw-black text-[#1e293b] mb-2">4. Bloqueia e denuncia</div>
                    <ul class="text-muted-foreground mb-0">
                      <li>Usa as opções de bloquear e denunciar nas plataformas.</li>
                      <li>Apps como TikTok e Snapchat têm ferramentas próprias para isso.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(wrapper.firstElementChild);
    };

    const resources = [
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
        title: "Linha de Ajuda",
        desc: "Ver contactos de emergência e números úteis da PSP.",
        color: "bg-[#fee2e2] text-[#ef4444]",
        action: "helpLine"
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
        title: "Segurança Online",
        desc: "Dicas práticas para protegeres a tua presença digital.",
        color: "bg-[#e0f2fe] text-[#0ea5e9]",
        action: "securityTips"
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
        title: "Notícias e atualizações",
        desc: "Notícias, eventos e alertas sobre segurança digital.",
        color: "bg-[#f3e8ff] text-[#a855f7]",
        href: "NewsAndUpdates.html"
      }
    ];

    ensureHelpPanel();
    ensureSecurityTipsModal();

    grid.innerHTML = resources.map((res, i) => `
      <${res.href ? `a href="${res.href}"` : res.action ? 'button type="button"' : 'div'} ${res.action === 'helpLine' ? 'data-bs-toggle="modal" data-bs-target="#helpLineModal" aria-haspopup="dialog"' : res.action === 'securityTips' ? 'data-bs-toggle="modal" data-bs-target="#securityTipsModal" aria-haspopup="dialog"' : ''} class="animate-fade-up flex flex-col items-start gap-4 p-8 rounded-[2rem] bg-white border border-border/40 text-left shadow-sm hover:shadow-md transition-all duration-300 text-decoration-none w-100" style="animation-delay: ${i * 100}ms;">
        <div class="w-11 h-11 rounded-2xl ${res.color} flex items-center justify-center shadow-sm">
          ${res.icon}
        </div>
        <div>
          <h3 class="font-bold text-lg mb-2 text-[#1e293b]">${res.title}</h3>
          <p class="text-sm text-muted-foreground leading-relaxed">${res.desc}</p>
        </div>
      </${res.href ? 'a' : res.action ? 'button' : 'div'}>
    `).join('');
  };
})();
