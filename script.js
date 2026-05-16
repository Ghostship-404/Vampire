const DATA = window.WORLD_DATA || { metadata:{}, sections:[], locations:[], timeline:[], priceTable:[] };
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function escapeHTML(value = ''){
  return String(value).replace(/[&<>'"]/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;'
  }[char]));
}

function escapeRegExp(value = ''){
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlight(text, query){
  const safe = escapeHTML(text || '');
  if(!query) return safe;
  const pattern = escapeRegExp(query.trim());
  if(!pattern) return safe;
  return safe.replace(new RegExp(pattern, 'gi'), match => `<mark>${match}</mark>`);
}

function excerpt(text = '', length = 180){
  const clean = String(text).replace(/\s+/g, ' ').trim();
  return clean.length > length ? `${clean.slice(0, length)}……` : clean;
}

function groupBy(list, keyFn){
  return list.reduce((acc, item) => {
    const key = keyFn(item) || '未分类';
    if(!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function smoothJump(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({ behavior:'smooth', block:'start' });
}

function initStats(){
  const grid = $('#statGrid');
  if(!grid) return;
  const meta = DATA.metadata || {};
  const categories = Array.isArray(meta.categories) ? meta.categories.length : 0;
  const stats = [
    ['档案条目', meta.sectionCount || DATA.sections.length || 0],
    ['设定字数', `${Math.round((meta.characterCount || 0) / 1000)}k`],
    ['地图地点', meta.locationCount || DATA.locations.length || 0],
    ['设定分类', categories]
  ];
  grid.innerHTML = stats.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
}

function initFeatures(){
  const node = $('#featureGrid');
  if(!node) return;
  const features = [
    ['♛','衰老的王权','女王、内阁、议院、缙绅会议、贵族家系与地方领主构成帝国政治主轴。'],
    ['⚙','工业化与金融','铁路、交易所、联合行会、工程师和货币体系让世界具有近代制度质感。'],
    ['ψ','信仰与术法','圣主信会、圣堂武士、卫道士、术士血脉与扭曲术源构成宗教和超自然冲突。'],
    ['☾','黑夜种族','吸血鬼、半血氏族、月人、黑夜土地和边境传说提供哥特恐怖张力。']
  ];
  node.innerHTML = features.map(([icon,title,text]) => `
    <article class="feature-card reveal">
      <span class="icon">${icon}</span>
      <h3>${escapeHTML(title)}</h3>
      <p>${escapeHTML(text)}</p>
    </article>
  `).join('');
}

function renderLocations(){
  const root = $('#locationList');
  const input = $('#locationSearch');
  if(!root) return;
  const query = input ? input.value.trim() : '';
  let locations = DATA.locations || [];
  if(query){
    locations = locations.filter(item => [item.name, item.region, item.text].join(' ').includes(query));
  }
  if(!locations.length){
    root.innerHTML = '<div class="empty">没有找到匹配地点。</div>';
    return;
  }
  const grouped = groupBy(locations, item => item.region || '未分类');
  root.innerHTML = `<div class="location-groups">${Object.entries(grouped).map(([region, items]) => `
    <section class="location-group">
      <h3>${highlight(region, query)}</h3>
      ${items.slice(0, 10).map(item => `
        <a class="location-card" href="#${encodeURIComponent(item.id)}" data-entry-id="${escapeHTML(item.id)}">
          <strong>${highlight(item.name, query)}</strong>
          <span>${highlight(excerpt(item.text || '暂无摘要。', 160), query)}</span>
        </a>
      `).join('')}
    </section>`).join('')}</div>`;
}

function renderTimeline(){
  const root = $('#timelineList');
  const input = $('#timelineSearch');
  if(!root) return;
  const query = input ? input.value.trim() : '';
  let events = DATA.timeline || [];
  if(query){
    events = events.filter(event => [event.date, event.title, event.text].join(' ').includes(query));
  }
  root.innerHTML = events.length ? events.map(event => `
    <article class="timeline-item">
      <div class="timeline-date">${highlight(event.date, query)}</div>
      <h3><a href="#${encodeURIComponent(event.id)}" data-entry-id="${escapeHTML(event.id)}">${highlight(event.title, query)}</a></h3>
      <p>${highlight(excerpt(event.text || '', 260), query)}</p>
    </article>
  `).join('') : '<div class="empty">没有找到匹配的年表事件。</div>';
}

function initLibrary(){
  const root = $('#libraryGrid');
  if(!root) return;
  const library = (DATA.sections || []).find(section => section.title === '弗菈明国立图书馆');
  if(!library){
    root.innerHTML = '<div class="empty">没有找到图书馆条目。</div>';
    return;
  }
  const books = [];
  let current = null;
  (library.paragraphs || []).forEach(paragraph => {
    const text = paragraph.trim();
    if(/^《.+》/.test(text)){
      current = { title:text, text:[] };
      books.push(current);
    } else if(current && text){
      current.text.push(text);
    }
  });
  root.innerHTML = books.slice(0, 12).map(book => `
    <article class="book-card reveal">
      <h3>${escapeHTML(book.title)}</h3>
      <p>${escapeHTML(excerpt(book.text.join(' '), 190) || '馆藏条目。')}</p>
    </article>
  `).join('');
}

function initCategoryFilter(){
  const select = $('#categoryFilter');
  if(!select) return;
  const categories = Array.isArray(DATA.metadata?.categories) ? DATA.metadata.categories : [...new Set((DATA.sections || []).map(s => s.category).filter(Boolean))];
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });
}

function getFilteredSections(){
  const query = $('#searchInput')?.value.trim() || '';
  const category = $('#categoryFilter')?.value || 'all';
  let sections = (DATA.sections || []).filter(section => (section.paragraphs || []).length || section.summary);
  if(category !== 'all') sections = sections.filter(section => section.category === category);
  if(query){
    sections = sections.filter(section => [
      section.title, section.category, section.top, section.h1, section.summary, ...(section.paragraphs || [])
    ].join(' ').includes(query));
  }
  return { sections, query, category };
}

function renderArchive(){
  const side = $('#sideIndex');
  const list = $('#entryList');
  if(!side || !list) return;
  const { sections, query } = getFilteredSections();
  side.innerHTML = sections.slice(0, 180).map(section => `
    <a href="#${encodeURIComponent(section.id)}" data-entry-id="${escapeHTML(section.id)}">${highlight(section.title, query)}</a>
  `).join('') || '<div class="empty">无匹配条目</div>';
  if(!sections.length){
    list.innerHTML = '<div class="empty">没有找到匹配条目。可以减少关键词，或切换到“全部分类”。</div>';
    return;
  }
  list.innerHTML = sections.map((section, index) => {
    const open = query || index < 3 ? ' open' : '';
    const body = (section.paragraphs || []).map(p => `<p>${highlight(p, query)}</p>`).join('') || `<p>${highlight(section.summary || '暂无正文。', query)}</p>`;
    return `
      <details class="entry" id="${escapeHTML(section.id)}"${open}>
        <summary>
          <div>
            <h3>${highlight(section.title, query)}</h3>
            <div class="entry-meta">
              ${section.category ? `<span class="tag">${escapeHTML(section.category)}</span>` : ''}
              ${section.h1 ? `<span class="parent-tag">${escapeHTML(section.h1)}</span>` : ''}
              ${section.top && section.top !== section.title ? `<span class="parent-tag">${escapeHTML(section.top)}</span>` : ''}
            </div>
          </div>
          <div class="chev">⌄</div>
        </summary>
        <div class="entry-body">${body}</div>
      </details>
    `;
  }).join('');
}

function initExpandButton(){
  const button = $('#expandAll');
  if(!button) return;
  button.addEventListener('click', () => {
    const entries = $$('.entry');
    const shouldOpen = entries.some(entry => !entry.open);
    entries.forEach(entry => entry.open = shouldOpen);
    button.textContent = shouldOpen ? '收起全部' : '展开全部';
  });
}

function initNav(){
  const button = $('#menuButton');
  const nav = $('#mainNav');
  if(button && nav){
    button.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      button.setAttribute('aria-expanded', String(open));
    });
    $$('#mainNav a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
    }));
  }
}

function initPinLinks(){
  $$('.map-pin').forEach(pin => {
    pin.addEventListener('click', () => {
      const targetName = pin.dataset.target;
      const loc = (DATA.locations || []).find(item => item.name === targetName || item.id === targetName);
      if(loc){
        const search = $('#locationSearch');
        if(search) search.value = targetName;
        renderLocations();
        setTimeout(() => smoothJump('atlas'), 0);
      }
    });
  });
}

function initDelegatedEntryLinks(){
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-entry-id]');
    if(!link) return;
    const id = link.getAttribute('data-entry-id');
    const entry = document.getElementById(id);
    if(entry){
      event.preventDefault();
      entry.open = true;
      entry.scrollIntoView({ behavior:'smooth', block:'start' });
    }
  });
}

function initReveal(){
  const targets = $$('.reveal');
  if(!('IntersectionObserver' in window)){
    targets.forEach(item => item.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold:.08 });
  targets.forEach(item => observer.observe(item));
}

function initSearchListeners(){
  $('#locationSearch')?.addEventListener('input', renderLocations);
  $('#timelineSearch')?.addEventListener('input', renderTimeline);
  $('#searchInput')?.addEventListener('input', renderArchive);
  $('#categoryFilter')?.addEventListener('change', renderArchive);
}

document.addEventListener('DOMContentLoaded', () => {
  initStats();
  initFeatures();
  renderLocations();
  renderTimeline();
  initLibrary();
  initCategoryFilter();
  renderArchive();
  initExpandButton();
  initNav();
  initPinLinks();
  initDelegatedEntryLinks();
  initSearchListeners();
  initReveal();
});
