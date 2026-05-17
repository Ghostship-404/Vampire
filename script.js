(() => {
  'use strict';

  const DATA = window.WORLD_DATA || { metadata: {}, sections: [], locations: [], timeline: [] };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const categoryOrder = [
    '帝国总览', '地图志', '政治制度', '经济与技术', '信仰与宗教',
    '术法体系', '黑夜种族', '历史年表', '图书馆'
  ];

  function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[char]);
  }

  function normalize(value = '') {
    return String(value).toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function safeId(value = '') {
    return encodeURIComponent(String(value));
  }

  function detailURL(type, id) {
    return `./detail.html?type=${encodeURIComponent(type)}&id=${safeId(id)}`;
  }

  function excerpt(text = '', max = 140) {
    const clean = String(text).replace(/\s+/g, ' ').trim();
    if (clean.length <= max) return clean;
    return `${clean.slice(0, max)}……`;
  }

  function matchesQuery(item, fields, query) {
    if (!query) return true;
    const haystack = normalize(fields.map((field) => item[field] || '').join(' '));
    return haystack.includes(normalize(query));
  }

  function groupBy(list, getKey) {
    return list.reduce((groups, item) => {
      const key = getKey(item) || '未分类';
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
      return groups;
    }, {});
  }

  function sectionById(id) {
    return (DATA.sections || []).find((section) => section.id === id || section.title === id);
  }

  function bestSectionForLocation(location) {
    const stripped = String(location.name || '').replace(/（.*?）/g, '');
    return (DATA.sections || []).find((section) => section.title === location.name)
      || (DATA.sections || []).find((section) => section.id === location.id)
      || (DATA.sections || []).find((section) => section.title === stripped)
      || null;
  }

  function timelineSection(event) {
    return sectionById(event.id) || (DATA.sections || []).find((section) => section.title === event.title);
  }

  function initNavigation() {
    const current = location.pathname.split('/').pop() || 'index.html';
    $$('.site-nav a').forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (href.endsWith(current)) link.classList.add('active');
    });

    const toggle = $('.nav-toggle');
    const nav = $('#siteNav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  function getSection(title) {
    return (DATA.sections || []).find((section) => section.title === title);
  }

  function renderHome() {
    const gateways = $('#homeGateways');
    if (gateways) {
      const items = [
        { label: '弗菈明帝国', type: 'section', id: '弗菈明帝国' },
        { label: '地图志', href: './atlas.html' },
        { label: '帝国五百年', href: './chronicle.html' },
        { label: '弗菈明国立图书馆', href: './library.html' },
        { label: '圣主信会', type: 'section', id: '圣主信会' },
        { label: '术士', type: 'section', id: '术士' },
        { label: '吸血鬼', type: 'section', id: '吸血鬼' },
        { label: '月人', type: 'section', id: '月人' }
      ];
      gateways.innerHTML = items.map((item) => {
        const section = item.id ? sectionById(item.id) : null;
        const href = item.href || detailURL(item.type, section?.id || item.id);
        const text = section ? excerpt((section.paragraphs || []).join(' '), 105) : '';
        return `<a class="gateway-card" href="${href}">
          <span class="gateway-title">${escapeHTML(item.label)}</span>
          ${text ? `<span class="gateway-text">${escapeHTML(text)}</span>` : '<span class="gateway-text">地点、领地、地貌与边境。</span>'}
        </a>`;
      }).join('');
    }

    const empirePanel = $('#homeEmpire');
    const empire = getSection('弗菈明帝国');
    if (empirePanel && empire) {
      empirePanel.innerHTML = `
        <p class="eyebrow">弗菈明帝国</p>
        <h2>${escapeHTML(empire.title)}</h2>
        ${(empire.paragraphs || []).slice(0, 3).map((p) => `<p>${escapeHTML(p)}</p>`).join('')}
        <a class="text-link" href="${detailURL('section', empire.id)}">阅读全文</a>`;
    }

    const homeIndex = $('#homeIndex');
    if (homeIndex) {
      const names = ['货币', '联合行会', '贵族', '缙绅会议', '纪元之手', '扭曲术源'];
      homeIndex.innerHTML = `<p class="eyebrow">索引</p><h2>相关条目</h2>` + names.map((name) => {
        const section = sectionById(name);
        return section ? `<a class="index-row" href="${detailURL('section', section.id)}"><span>${escapeHTML(section.title)}</span><i>${escapeHTML(section.category || '')}</i></a>` : '';
      }).join('');
    }
  }

  function fillRegionOptions(select) {
    if (!select) return;
    [...new Set((DATA.locations || []).map((location) => location.region || '未分类'))]
      .forEach((region) => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        select.appendChild(option);
      });
  }

  function renderAtlas() {
    const root = $('#atlasList');
    if (!root) return;
    const query = $('#atlasSearch')?.value || '';
    const region = $('#atlasRegion')?.value || 'all';
    let locations = DATA.locations || [];
    if (region !== 'all') locations = locations.filter((item) => (item.region || '未分类') === region);
    if (query) {
      locations = locations.filter((item) => matchesQuery(item, ['name', 'region', 'text'], query));
    }
    if (!locations.length) {
      root.innerHTML = '<div class="empty-state">没有匹配地点。</div>';
      return;
    }
    const groups = groupBy(locations, (item) => item.region || '未分类');
    root.innerHTML = Object.entries(groups).map(([regionName, items]) => `
      <section class="atlas-group">
        <h2>${escapeHTML(regionName)}</h2>
        <div class="place-grid">
          ${items.map((location) => {
            const section = bestSectionForLocation(location);
            const href = section ? detailURL('section', section.id) : detailURL('location', location.id);
            return `<a class="place-card" href="${href}">${escapeHTML(location.name)}</a>`;
          }).join('')}
        </div>
      </section>`).join('');
  }

  function renderChronicle() {
    const root = $('#chronicleList');
    if (!root) return;
    const query = $('#chronicleSearch')?.value || '';
    let events = DATA.timeline || [];
    if (query) events = events.filter((event) => matchesQuery(event, ['date', 'title', 'text'], query));
    if (!events.length) {
      root.innerHTML = '<div class="empty-state">没有匹配年表。</div>';
      return;
    }
    root.innerHTML = events.map((event) => {
      const section = timelineSection(event);
      const href = section ? detailURL('section', section.id) : detailURL('timeline', event.id);
      return `<a class="chronicle-item" href="${href}">
        <time>${escapeHTML(event.date || '')}</time>
        <span>${escapeHTML(event.title || '')}</span>
        <em>${escapeHTML(event.text || '')}</em>
      </a>`;
    }).join('');
  }

  function getBooks() {
    const library = getSection('弗菈明国立图书馆');
    const books = [];
    let current = null;
    (library?.paragraphs || []).forEach((paragraph) => {
      const text = String(paragraph || '').trim();
      if (!text) return;
      if (/^《.+?》/.test(text)) {
        current = { id: `book-${books.length + 1}`, title: text, text: [] };
        books.push(current);
      } else if (current) {
        current.text.push(text);
      }
    });
    return books;
  }

  function renderLibrary() {
    const root = $('#libraryList');
    if (!root) return;
    const query = $('#librarySearch')?.value || '';
    let books = getBooks();
    if (query) {
      books = books.filter((book) => normalize([book.title, ...book.text].join(' ')).includes(normalize(query)));
    }
    if (!books.length) {
      root.innerHTML = '<div class="empty-state">没有匹配馆藏。</div>';
      return;
    }
    root.innerHTML = books.map((book, index) => `
      <details class="book-card">
        <summary>
          <span class="book-number">${String(index + 1).padStart(2, '0')}</span>
          <strong>${escapeHTML(book.title)}</strong>
        </summary>
        <div class="book-body">
          ${book.text.length ? book.text.map((p) => `<p>${escapeHTML(p)}</p>`).join('') : '<p>暂无摘录。</p>'}
        </div>
      </details>`).join('');
  }

  function fillCategoryOptions(select) {
    if (!select) return;
    const categories = [...new Set((DATA.sections || []).map((section) => section.category).filter(Boolean))];
    categories.sort((a, b) => {
      const ai = categoryOrder.indexOf(a);
      const bi = categoryOrder.indexOf(b);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      select.appendChild(option);
    });
  }

  function renderArchive() {
    const root = $('#archiveList');
    if (!root) return;
    const query = $('#archiveSearch')?.value || '';
    const category = $('#archiveCategory')?.value || 'all';
    let sections = DATA.sections || [];
    if (category !== 'all') sections = sections.filter((section) => section.category === category);
    if (query) {
      sections = sections.filter((section) => normalize([section.title, section.category, ...(section.paragraphs || [])].join(' ')).includes(normalize(query)));
    }
    if (!sections.length) {
      root.innerHTML = '<div class="empty-state">没有匹配条目。</div>';
      return;
    }
    const groups = groupBy(sections, (section) => section.category || '未分类');
    root.innerHTML = Object.entries(groups).map(([categoryName, items]) => `
      <section class="archive-group">
        <h2>${escapeHTML(categoryName)}</h2>
        <div class="archive-grid">
          ${items.map((section) => `<a class="archive-card" href="${detailURL('section', section.id)}">
            <span>${escapeHTML(section.title)}</span>
            <p>${escapeHTML(excerpt((section.paragraphs || []).join(' '), 120))}</p>
          </a>`).join('')}
        </div>
      </section>`).join('');
  }

  function getDetailRecord(type, id) {
    if (type === 'location') {
      const location = (DATA.locations || []).find((item) => item.id === id || item.name === id);
      if (!location) return null;
      const section = bestSectionForLocation(location);
      if (section) return { type: 'section', title: section.title, eyebrow: section.category || '地图志', paragraphs: section.paragraphs || [], id: section.id };
      return { type: 'location', title: location.name, eyebrow: location.region || '地图志', paragraphs: [location.text || ''], id: location.id };
    }
    if (type === 'timeline') {
      const event = (DATA.timeline || []).find((item) => item.id === id || item.title === id);
      if (!event) return null;
      const section = timelineSection(event);
      if (section) return { type: 'section', title: section.title, eyebrow: section.category || '历史年表', paragraphs: section.paragraphs || [], id: section.id };
      return { type: 'timeline', title: event.title, eyebrow: event.date || '历史年表', paragraphs: [event.text || ''], id: event.id };
    }
    const section = sectionById(id);
    if (!section) return null;
    return { type: 'section', title: section.title, eyebrow: section.category || section.top || '条目', paragraphs: section.paragraphs || [], id: section.id };
  }

  function renderDetail() {
    const root = $('#detailRoot');
    if (!root) return;
    const params = new URLSearchParams(location.search);
    const type = params.get('type') || 'section';
    const id = params.get('id') || location.hash.replace(/^#/, '');
    const record = getDetailRecord(type, id);
    if (!record) {
      root.innerHTML = `<section class="not-found small"><p class="eyebrow">未找到</p><h1>没有此条目</h1><a class="action primary" href="./archive.html">返回档案索引</a></section>`;
      return;
    }
    document.title = `${record.title}｜热夜之梦`;
    const related = (DATA.sections || [])
      .filter((section) => section.id !== record.id && section.category === record.eyebrow)
      .slice(0, 8);
    root.innerHTML = `
      <article class="detail-article">
        <div class="detail-topline">
          <a class="text-link" id="detailBack" href="./archive.html">返回</a>
          <span>${escapeHTML(record.eyebrow)}</span>
        </div>
        <h1>${escapeHTML(record.title)}</h1>
        <div class="prose">
          ${record.paragraphs.filter(Boolean).map((p) => `<p>${escapeHTML(p)}</p>`).join('') || '<p>暂无正文。</p>'}
        </div>
      </article>
      ${related.length ? `<aside class="related-panel"><p class="eyebrow">同类条目</p>${related.map((item) => `<a class="index-row" href="${detailURL('section', item.id)}"><span>${escapeHTML(item.title)}</span><i>${escapeHTML(item.category || '')}</i></a>`).join('')}</aside>` : ''}`;
    const back = $('#detailBack');
    if (back) {
      back.addEventListener('click', (event) => {
        if (history.length > 1) {
          event.preventDefault();
          history.back();
        }
      });
    }
  }

  function bindInput(id, render) {
    const node = $(`#${id}`);
    if (node) node.addEventListener('input', render);
    if (node && node.tagName === 'SELECT') node.addEventListener('change', render);
  }

  function boot() {
    initNavigation();
    const page = document.body.dataset.page;
    if (page === 'home') renderHome();
    if (page === 'atlas') {
      fillRegionOptions($('#atlasRegion'));
      renderAtlas();
      bindInput('atlasSearch', renderAtlas);
      bindInput('atlasRegion', renderAtlas);
    }
    if (page === 'chronicle') {
      renderChronicle();
      bindInput('chronicleSearch', renderChronicle);
    }
    if (page === 'library') {
      renderLibrary();
      bindInput('librarySearch', renderLibrary);
    }
    if (page === 'archive') {
      fillCategoryOptions($('#archiveCategory'));
      renderArchive();
      bindInput('archiveSearch', renderArchive);
      bindInput('archiveCategory', renderArchive);
    }
    if (page === 'detail') renderDetail();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
