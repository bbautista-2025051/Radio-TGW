(function () {
  'use strict';

  const state = {
    category: 'TODAS',
    subcategory: 'TODAS',
    search: '',
    programChannel: 'ALL',
    isPlaying: true,
    audioCtx: null,
    gainNode: null,
    programs: [],
    culturalEvents: [],
    archives: [],
    sslMetadata: null
  };

  const categoryLabels = {
    TODAS: 'Noticias W — Cobertura Nacional e Internacional',
    GUATEMALA: 'Noticias W — Guatemala',
    CULTURA: 'Noticias W — Cultura, Arte y Música',
    DEPORTES: 'Noticias W — Deportes',
    OPINION_W: 'OpiniónW — Editorial (Sujeta a Validación del Director General)',
    INTERNACIONALES: 'Noticias W Internacionales',
    CURIOSIDADES: 'Curiosidades de la Radio y Patrimonio'
  };

  const subcategoryLabels = {
    EJECUTIVO: 'Ejecutivo',
    LEGISLATIVO: 'Legislativo',
    JUDICIAL_MP: 'Judicial – MP',
    SEGURIDAD: 'Seguridad',
    ELECCIONES_2027: 'Elecciones 2027',
    CULTURA_ARTE_MUSICA: 'Cultura, Arte y Música',
    DEPORTES: 'Deportes',
    EDITORIAL_DG: 'OpiniónW • Dirección General',
    MUNDO: 'Internacionales',
    HISTORIA_SONORA: 'Curiosidades TGW'
  };

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // 1. Inicializar Tema Oscuro / Claro
  function initTheme() {
    const saved = localStorage.getItem('tgw-theme');
    if (saved === 'dark') {
      document.body.classList.add('dark-theme');
    }
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('tgw-theme', isDark ? 'dark' : 'light');
      });
    }
  }

  // 2. Menú de Tres Líneas Horizontales (Sobre nosotros, Historia de TGW, Misión, Visión, Valores)
  function initInstitutionalDrawer() {
    const openBtn = document.getElementById('openDrawerBtn');
    const closeBtn = document.getElementById('closeDrawerBtn');
    const backdrop = document.getElementById('drawerBackdrop');
    const drawer = document.getElementById('institutionalDrawer');

    function toggleDrawer(open) {
      if (!drawer || !backdrop) return;
      drawer.classList.toggle('open', open);
      backdrop.classList.toggle('open', open);
    }

    if (openBtn) openBtn.addEventListener('click', () => toggleDrawer(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleDrawer(false));
    if (backdrop) backdrop.addEventListener('click', () => toggleDrawer(false));

    const tabBtns = document.querySelectorAll('[data-inst-tab]');
    const sections = document.querySelectorAll('[data-inst-section]');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.getAttribute('data-inst-tab');
        sections.forEach((sec) => {
          const secName = sec.getAttribute('data-inst-section');
          if (target === 'all' || target === secName) {
            sec.style.display = 'block';
          } else {
            sec.style.display = 'none';
          }
        });
      });
    });
  }

  // 3. Reproductor AL AIRE con barras en movimiento
  function initOnAirPlayer() {
    const btn = document.getElementById('onAirToggleBtn');
    const iconPause = document.getElementById('onAirIconPause');
    const iconPlay = document.getElementById('onAirIconPlay');
    const bars = document.getElementById('equalizerBars');
    const label = document.getElementById('onAirStatusText');

    if (!btn) return;

    btn.addEventListener('click', () => {
      state.isPlaying = !state.isPlaying;
      if (state.isPlaying) {
        if (iconPause) iconPause.style.display = 'block';
        if (iconPlay) iconPlay.style.display = 'none';
        if (bars) bars.classList.remove('is-paused');
        if (label) label.textContent = 'AL AIRE • 107.3 FM';
      } else {
        if (iconPause) iconPause.style.display = 'none';
        if (iconPlay) iconPlay.style.display = 'block';
        if (bars) bars.classList.add('is-paused');
        if (label) label.textContent = 'EN PAUSA';
      }
    });
  }

  // 4. Cargar y Filtrar Noticias desde Base de Datos Prisma (/api/news)
  async function loadNews() {
    const container = document.getElementById('newsGridContainer');
    const heading = document.getElementById('newsSectionHeading');
    const opinionBanner = document.getElementById('opinionValidationBanner');

    if (!container) return;

    const params = new URLSearchParams();
    if (state.category && state.category !== 'TODAS') {
      params.set('category', state.category);
    }
    if (state.subcategory && state.subcategory !== 'TODAS') {
      params.set('subcategory', state.subcategory);
    }
    if (state.search && state.search.trim() !== '') {
      params.set('search', state.search.trim());
    }

    if (heading) {
      let title = categoryLabels[state.category] || 'Noticias W';
      if (state.subcategory && state.subcategory !== 'TODAS') {
        title += ` • ${subcategoryLabels[state.subcategory] || state.subcategory}`;
      }
      heading.textContent = title;
    }

    if (opinionBanner) {
      opinionBanner.style.display = state.category === 'OPINION_W' ? 'flex' : 'none';
    }

    try {
      const res = await fetch(`/api/news?${params.toString()}`);
      const json = await res.json();
      const items = json.data || [];

      if (items.length === 0) {
        container.innerHTML = `
          <div class="feature-box" style="grid-column: 1 / -1; text-align: center; padding: 36px;">
            <h3>No se encontraron noticias para este filtro</h3>
            <p>Prueba seleccionando otra categoría de Noticias W o limpia el término de búsqueda.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = items
        .map((item) => {
          const catBadge = escapeHtml(item.category.replace('_', ' '));
          const subBadge = item.subcategory
            ? `<span class="news-card__cat-badge sub">${escapeHtml(
                subcategoryLabels[item.subcategory] || item.subcategory
              )}</span>`
            : '';
          const validationBadge =
            item.category === 'OPINION_W'
              ? `<div class="news-card__validated">✔ ${escapeHtml(
                  item.validatedBy || 'Validado por el Director General de Radio TGW'
                )}</div>`
              : '';

          return `
            <article class="news-card">
              <div class="news-card__image-wrap">
                <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}" loading="lazy" />
                <div class="news-card__badges">
                  <span class="news-card__cat-badge">${catBadge}</span>
                  ${subBadge}
                </div>
              </div>
              <div class="news-card__body">
                ${validationBadge}
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.summary)}</p>
                <div class="news-card__footer">
                  <span>✍️ ${escapeHtml(item.author)} • 👁️ ${item.views}</span>
                  <button type="button" class="read-more-btn" data-slug="${escapeHtml(item.slug)}">
                    Leer nota completa →
                  </button>
                </div>
              </div>
            </article>
          `;
        })
        .join('');

      container.querySelectorAll('.read-more-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const slug = btn.getAttribute('data-slug');
          if (slug) openArticleModal(slug);
        });
      });
    } catch (err) {
      console.error('Error cargando noticias:', err);
    }
  }

  async function openArticleModal(slug) {
    const modal = document.getElementById('articleDetailModal');
    const content = document.getElementById('articleModalContent');
    const catHeader = document.getElementById('articleModalCategory');
    if (!modal || !content) return;

    try {
      const res = await fetch(`/api/news/${encodeURIComponent(slug)}`);
      const json = await res.json();
      if (!json.data) return;
      const item = json.data;

      if (catHeader) {
        catHeader.textContent = `${item.category} ${
          item.subcategory ? '• ' + (subcategoryLabels[item.subcategory] || item.subcategory) : ''
        }`;
      }

      content.innerHTML = `
        <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(
        item.title
      )}" style="width:100%; max-height:280px; object-fit:cover; border-radius:12px; margin-bottom:16px;" />
        ${
          item.category === 'OPINION_W'
            ? `<div class="news-card__validated" style="margin-bottom:10px;">🛡️ ${escapeHtml(
                item.validatedBy || 'Validado por el Director General de Radio TGW'
              )}</div>`
            : ''
        }
        <h2 style="margin:0 0 10px; font-size:1.4rem;">${escapeHtml(item.title)}</h2>
        <p style="font-size:0.8rem; color:var(--tgw-text-muted); margin-bottom:16px;">
          Por <strong>${escapeHtml(item.author)}</strong> • Frecuencia 107.3 FM / 107.5 FM • Lecturas: ${item.views}
        </p>
        <p style="font-weight:700; font-size:0.96rem; line-height:1.6; margin-bottom:14px;">
          ${escapeHtml(item.summary)}
        </p>
        <p style="font-size:0.93rem; line-height:1.72; color:var(--tgw-text-secondary);">
          ${escapeHtml(item.content)}
        </p>
      `;
      modal.classList.add('open');
    } catch (e) {
      console.error(e);
    }
  }

  // 5. Cargar Datos Generales del Portal (Programación W, Agenda Cultural, Huellas W y Certificado SSL)
  async function loadPortalOverview() {
    try {
      const res = await fetch('/api/portal/overview');
      const json = await res.json();
      if (!json.data) return;

      state.programs = json.data.programs || [];
      state.culturalEvents = json.data.culturalEvents || [];
      state.archives = json.data.archives || [];
      state.sslMetadata = json.data.securityCertificate || null;

      if (json.data.exchangeRate) {
        const exEl = document.getElementById('exchangeRateValue');
        if (exEl) exEl.textContent = `Q ${json.data.exchangeRate}`;
      }

      renderPrograms();
      renderCulturalAgenda();
      renderHuellasW();
    } catch (err) {
      console.error('Error cargando overview:', err);
    }
  }

  function renderPrograms() {
    const container = document.getElementById('programsGridContainer');
    if (!container) return;

    const filtered =
      state.programChannel === 'ALL'
        ? state.programs
        : state.programs.filter((p) => p.channel === state.programChannel);

    container.innerHTML = filtered
      .map(
        (p) => `
        <article class="feature-box">
          <div class="feature-box__top">
            <span class="feature-box__tag">${p.channel === 'TGW_FM' ? '📻 TGW FM 107.3 • 107.5' : '📺 TGW TV Digital'}</span>
            ${
              p.isLiveNow
                ? '<span class="feature-box__tag live">● EN TRANSMISIÓN</span>'
                : `<span class="feature-box__tag orange">${escapeHtml(p.category)}</span>`
            }
          </div>
          <h3>${escapeHtml(p.name)}</h3>
          <p>${escapeHtml(p.description)}</p>
          <div class="feature-box__meta">
            <span>🕒 ${escapeHtml(p.schedule)}</span>
            <span>📅 ${escapeHtml(p.days)}</span>
          </div>
        </article>
      `
      )
      .join('');
  }

  function renderCulturalAgenda() {
    const container = document.getElementById('culturalAgendaContainer');
    if (!container) return;

    container.innerHTML = state.culturalEvents
      .map(
        (ev) => `
        <article class="feature-box">
          <div class="feature-box__top">
            <span class="feature-box__tag">${escapeHtml(ev.category)}</span>
            <span class="feature-box__tag orange">${escapeHtml(ev.price)}</span>
          </div>
          <h3>${escapeHtml(ev.title)}</h3>
          <p>${escapeHtml(ev.description)}</p>
          <div class="feature-box__meta">
            <span>📅 ${escapeHtml(ev.dateText)} (${escapeHtml(ev.timeText)})</span>
            <span>📍 ${escapeHtml(ev.venue)}</span>
          </div>
        </article>
      `
      )
      .join('');
  }

  function renderHuellasW() {
    const container = document.getElementById('huellasWContainer');
    if (!container) return;

    container.innerHTML = state.archives
      .map(
        (arc) => `
        <article class="feature-box">
          <div class="feature-box__top">
            <span class="feature-box__tag">${escapeHtml(arc.badgeText)}</span>
            <span class="feature-box__tag orange">${arc.episodesCount} Episodios</span>
          </div>
          <h3>${escapeHtml(arc.title)}</h3>
          <p>${escapeHtml(arc.description)}</p>
          <div class="feature-box__meta">
            <span>🗂️ ${escapeHtml(arc.period)}</span>
            <span>⏱️ ${escapeHtml(arc.audioDuration)}</span>
          </div>
        </article>
      `
      )
      .join('');
  }

  // 6. Eventos de Navegación, Desplegables y Formularios
  function initInteractions() {
    // Submenú Guatemala (click y desplegar)
    const toggleGtBtn = document.getElementById('toggleGuatemalaSubmenu');
    const gtList = document.getElementById('guatemalaSubmenuList');
    if (toggleGtBtn && gtList) {
      toggleGtBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        gtList.classList.toggle('expanded');
      });
    }

    // Filtros de Noticias W (desde menú superior y chips)
    document.querySelectorAll('.js-news-filter').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-category') || 'TODAS';
        const sub = btn.getAttribute('data-subcategory') || 'TODAS';
        state.category = cat;
        state.subcategory = sub;

        document.querySelectorAll('.news-toolbar .filter-chip').forEach((chip) => {
          chip.classList.toggle('active', chip.getAttribute('data-category') === cat);
        });
        document.querySelectorAll('.subfilters-bar .sub-chip').forEach((chip) => {
          chip.classList.toggle('active', chip.getAttribute('data-subcategory') === sub);
        });

        const newsSec = document.getElementById('noticias-w');
        if (newsSec) newsSec.scrollIntoView({ behavior: 'smooth' });
        loadNews();
      });
    });

    // Búsqueda de noticias en vivo
    const searchInput = document.getElementById('newsSearchInput');
    if (searchInput) {
      let timer;
      searchInput.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          state.search = searchInput.value;
          loadNews();
        }, 220);
      });
    }

    // Filtro de Programación W (TGW FM / TGW TV)
    document.querySelectorAll('.js-prog-filter').forEach((btn) => {
      btn.addEventListener('click', () => {
        const channel = btn.getAttribute('data-channel') || 'ALL';
        state.programChannel = channel;
        document.querySelectorAll('#programacion-w .filter-chip').forEach((c) => {
          c.classList.toggle('active', c.getAttribute('data-channel') === channel);
        });
        const progSec = document.getElementById('programacion-w');
        if (progSec) progSec.scrollIntoView({ behavior: 'smooth' });
        renderPrograms();
      });
    });

    // Scroll suave en botones con data-scroll
    document.querySelectorAll('[data-scroll]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-scroll');
        if (target) {
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Cerrar modales
    document.querySelectorAll('[data-close-modal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-close-modal');
        const modal = id ? document.getElementById(id) : null;
        if (modal) modal.classList.remove('open');
      });
    });

    // Abrir modal de publicar noticia / OpiniónW
    const openNewArticleBtn = document.getElementById('openNewArticleModalBtn');
    const openOpinionBtn = document.getElementById('openOpinionSubmitBtn');
    const newArticleModal = document.getElementById('newArticleModal');
    const newsCategorySelect = document.getElementById('newsCategory');

    if (openNewArticleBtn && newArticleModal) {
      openNewArticleBtn.addEventListener('click', () => newArticleModal.classList.add('open'));
    }
    if (openOpinionBtn && newArticleModal && newsCategorySelect) {
      openOpinionBtn.addEventListener('click', () => {
        newsCategorySelect.value = 'OPINION_W';
        newArticleModal.classList.add('open');
      });
    }

    // Envío de nueva noticia a Prisma
    const createNewsForm = document.getElementById('createNewsForm');
    if (createNewsForm) {
      createNewsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const category = document.getElementById('newsCategory').value;
        const payload = {
          title: document.getElementById('newsTitle').value,
          category,
          subcategory: category === 'GUATEMALA' ? document.getElementById('newsSubcategory').value : undefined,
          author: document.getElementById('newsAuthor').value,
          summary: document.getElementById('newsSummary').value,
          content: document.getElementById('newsContent').value,
          directorValidated: document.getElementById('newsDirectorValidated').checked
        };

        const res = await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (res.ok) {
          createNewsForm.reset();
          if (newArticleModal) newArticleModal.classList.remove('open');
          loadNews();
          alert(json.message);
        }
      });
    }

    // Abrir modal de Trámites a tu Favor
    const procedureModal = document.getElementById('procedureModal');
    const procTypeSelect = document.getElementById('procTypeSelect');
    const procResultBox = document.getElementById('procedureResultBox');

    document.querySelectorAll('.js-open-procedure').forEach((btn) => {
      btn.addEventListener('click', () => {
        const proc = btn.getAttribute('data-proc');
        if (proc && procTypeSelect) procTypeSelect.value = proc;
        if (procResultBox) procResultBox.style.display = 'none';
        if (procedureModal) procedureModal.classList.add('open');
      });
    });

    const procedureForm = document.getElementById('procedureForm');
    if (procedureForm) {
      procedureForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          procedureType: document.getElementById('procTypeSelect').value,
          applicantName: document.getElementById('procApplicant').value,
          dpiOrNit: document.getElementById('procDpi').value,
          email: document.getElementById('procEmail').value,
          phone: document.getElementById('procPhone').value,
          details: document.getElementById('procDetails').value
        };
        const res = await fetch('/api/portal/procedures', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (res.ok && procResultBox) {
          procResultBox.style.display = 'block';
          procResultBox.innerHTML = `<div class="news-card__validated" style="padding:12px;">✅ ${escapeHtml(
            json.message
          )}</div>`;
          procedureForm.reset();
        }
      });
    }

    // Abrir modal de Voz Ciudadana (Información Pública / Quejas y Denuncias)
    const citizenModal = document.getElementById('citizenModal');
    const citizenType = document.getElementById('citizenType');
    const citizenResultBox = document.getElementById('citizenResultBox');

    document.querySelectorAll('.js-citizen-action').forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        if (type && citizenType) citizenType.value = type;
        if (citizenResultBox) citizenResultBox.style.display = 'none';
        if (citizenModal) citizenModal.classList.add('open');
      });
    });

    const citizenForm = document.getElementById('citizenForm');
    if (citizenForm) {
      citizenForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          reportType: document.getElementById('citizenType').value,
          citizenName: document.getElementById('citizenName').value,
          email: document.getElementById('citizenEmail').value,
          subject: document.getElementById('citizenSubject').value,
          message: document.getElementById('citizenMessage').value,
          isAnonymous: document.getElementById('citizenAnonymous').checked
        };
        const res = await fetch('/api/portal/citizen-reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (res.ok && citizenResultBox) {
          citizenResultBox.style.display = 'block';
          citizenResultBox.innerHTML = `<div class="news-card__validated" style="padding:12px;">✅ ${escapeHtml(
            json.message
          )}</div>`;
          citizenForm.reset();
        }
      });
    }

    // Modal de Certificado de Seguridad SSL/TLS
    const openSslBtn = document.getElementById('openSslModalBtn');
    const sslModal = document.getElementById('sslCertModal');
    const sslBody = document.getElementById('sslCertModalBody');

    if (openSslBtn && sslModal && sslBody) {
      openSslBtn.addEventListener('click', async () => {
        sslModal.classList.add('open');
        if (!state.sslMetadata) {
          const res = await fetch('/api/portal/security/certificate');
          const json = await res.json();
          state.sslMetadata = json.data;
        }
        const m = state.sslMetadata;
        if (m) {
          sslBody.innerHTML = `
            <div class="inst-card" style="margin-bottom: 14px;">
              <span class="inst-card__badge">Certificado X.509 Activo</span>
              <h3>${escapeHtml(m.protocol)}</h3>
              <p><strong>Sujeto (Subject):</strong> ${escapeHtml(m.subject)}</p>
              <p><strong>Emisor (Issuer):</strong> ${escapeHtml(m.issuer)}</p>
              <p><strong>Serial Number:</strong> <code>${escapeHtml(m.serialNumber)}</code></p>
              <p><strong>Vigencia:</strong> ${escapeHtml(m.validFrom)} — ${escapeHtml(m.validTo)}</p>
              <p><strong>Huella Digital SHA-256:</strong><br/><code style="font-size:0.75rem; word-break:break-all;">${escapeHtml(
                m.fingerprint256
              )}</code></p>
            </div>
            <div class="inst-card orange-accent">
              <span class="inst-card__badge">Cabeceras y Políticas de Seguridad en Producción</span>
              <ul style="margin:0; padding-left:18px; font-size:0.86rem; line-height:1.7;">
                ${(m.securityHeaders || []).map((h) => `<li>${escapeHtml(h)}</li>`).join('')}
              </ul>
            </div>
          `;
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initInstitutionalDrawer();
    initOnAirPlayer();
    initInteractions();
    loadNews();
    loadPortalOverview();
  });
})();
