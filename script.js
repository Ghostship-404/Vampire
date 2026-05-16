const DATA = window.WORLD_DATA || { metadata:{}, sections:[], locations:[], timeline:[] };
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

function highlight(text = '', query = ''){
  const safe = escapeHTML(text);
  const trimmed = query.trim();
  if(!trimmed) return safe;
  return safe.replace(new RegExp(escapeRegExp(trimmed), 'gi'), match => `<mark>${match}</mark>`);
}

function excerpt(text = '', length = 190){
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

function getSection(title){
  return (DATA.sections || []).find(section => section.title === title);
}

function sectionLink(section){
  return `./archive.html#${encodeURIComponent(section.id)}`;
}

function initNav(){
  const current = location.pathname.split('/').pop() || 'index.html';
  $$('.site-nav a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if(href.endsWith(current)) link.classList.add('active');
  });
  const button = $('#navToggle');
  const nav = $('#siteNav');
  if(!button || !nav) return;
  button.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
  });
}

function initReveal(){
  const nodes = $$('.reveal');
  if(!('IntersectionObserver' in window)){
    nodes.forEach(node => node.classList.add('visible'));
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
  nodes.forEach(node => observer.observe(node));
}

function renderHome(){
  const root = $('#homePortals');
  if(root){
    const portals = [
      {title:'地图志', href:'./atlas.html', source:'地图志'},
      {title:'圣主信会', href:'./archive.html#%E5%9C%A3%E4%B8%BB%E4%BF%A1%E4%BC%9A', source:'圣主信会'},
      {title:'术士', href:'./archive.html#%E6%9C%AF%E5%A3%AB', source:'术士'},
      {title:'吸血鬼', href:'./archive.html#%E5%90%B8%E8%A1%80%E9%AC%BC', source:'吸血鬼'},
      {title:'帝国五百年', href:'./chronicle.html', source:'帝国五百年'},
      {title:'国立图书馆', href:'./library.html', source:'弗菈明国立图书馆'}
    ];
    root.innerHTML = portals.map(item => {
      const section = getSection(item.source);
      const text = section?.summary || (section?.paragraphs || []).join(' ') || '';
      return `<a class="portal-card reveal" href="${item.href}">
        <span>${escapeHTML(item.title)}</span>
        <p>${escapeHTML(excerpt(text, 150))}</p>
      </a>`;
    }).join('');
  }

  const excerptNode = $('#homeExcerpt');
  if(excerptNode){
    const empire = getSection('弗菈明帝国');
    const paragraphs = empire?.paragraphs || [];
    excerptNode.innerHTML = `
      <p class="overline">弗菈明帝国</p>
      <h2>${escapeHTML(empire?.title || '弗菈明帝国')}</h2>
      ${(paragraphs.slice(0, 2)).map(p => `<p>${escapeHTML(p)}</p>`).join('')}
      <a class="text-link" href="${empire ? sectionLink(empire) : './archive.html'}">阅读全文</a>
    `;
  }
}

function initRegionFilter(){
  const select = $('#regionFilter');
  if(!select) return;
  const regions = [...new Set((DATA.locations || []).map(item => item.region || '未分类'))];
  regions.forEach(region => {
    const option = document.createElement('option');
    option.value = region;
    option.textContent = region;
    select.appendChild(option);
  });
}

function renderLocations(){
  const root = $('#locationList');
  if(!root) return;
  const query = $('#locationSearch')?.value.trim() || '';
  const region = $('#regionFilter')?.value || 'all';
  let locations = DATA.locations || [];
  if(region !== 'all') locations = locations.filter(item => (item.region || '未分类') === region);
  if(query) locations = locations.filter(item => [item.name, item.region, item.text].join(' ').includes(query));
  if(!locations.length){
    root.innerHTML = '<div class="empty">无匹配地点。</div>';
    return;
  }
  const grouped = groupBy(locations, item => item.region || '未分类');
  root.innerHTML = Object.entries(grouped).map(([name, items]) => `
    <section class="location-group reveal">
      <h2>${highlight(name, query)}</h2>
      <div class="location-cards">
        ${items.map(item => `<article class="location-card" id="${escapeHTML(item.id)}">
          <div class="card-kicker">${highlight(item.region || '未分类', query)}</div>
          <h3>${highlight(item.name, query)}</h3>
          <p>${highlight(item.text || '', query)}</p>
          <a class="text-link" href="./archive.html#${encodeURIComponent(item.id)}">查看条目</a>
        </article>`).join('')}
      </div>
    </section>
  `).join('');
  initReveal();
}

function renderTimeline(){
  const root = $('#timelineList');
  if(!root) return;
  const query = $('#timelineSearch')?.value.trim() || '';
  let events = DATA.timeline || [];
  if(query) events = events.filter(event => [event.date, event.title, event.text].join(' ').includes(query));
  if(!events.length){
    root.innerHTML = '<div class="empty">无匹配年表。</div>';
    return;
  }
  root.innerHTML = events.map(event => `<article class="timeline-item reveal" id="${escapeHTML(event.id)}">
    <div class="timeline-date">${highlight(event.date, query)}</div>
    <div>
      <h2>${highlight(event.title, query)}</h2>
      <p>${highlight(event.text || '', query)}</p>
      <a class="text-link" href="./archive.html#${encodeURIComponent(event.id)}">查看条目</a>
    </div>
  </article>`).join('');
  initReveal();
}

function getLibraryBooks(){
  const library = getSection('弗菈明国立图书馆');
  const books = [];
  let current = null;
  (library?.paragraphs || []).forEach(paragraph => {
    const text = paragraph.trim();
    if(/^《.+》/.test(text)){
      current = { title:text, text:[] };
      books.push(current);
    } else if(current && text){
      current.text.push(text);
    }
  });
  return books;
}

function renderLibrary(){
  const root = $('#libraryGrid');
  if(!root) return;
  const query = $('#librarySearch')?.value.trim() || '';
  let books = getLibraryBooks();
  if(query) books = books.filter(book => [book.title, ...book.text].join(' ').includes(query));
  if(!books.length){
    root.innerHTML = '<div class="empty">无匹配馆藏。</div>';
    return;
  }
  root.innerHTML = books.map((book, index) => `<article class="book-card reveal">
    <div class="book-spine" aria-hidden="true">${String(index + 1).padStart(2, '0')}</div>
    <div>
      <h2>${highlight(book.title, query)}</h2>
      <p>${highlight(excerpt(book.text.join(' '), 360), query)}</p>
    </div>
  </article>`).join('');
  initReveal();
}

function initCategoryFilter(){
  const select = $('#categoryFilter');
  if(!select) return;
  const categories = Array.isArray(DATA.metadata?.categories)
    ? DATA.metadata.categories
    : [...new Set((DATA.sections || []).map(section => section.category).filter(Boolean))];
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
  return { sections, query };
}

function renderArchive(){
  const root = $('#entryList');
  if(!root) return;
  const { sections, query } = getFilteredSections();
  if(!sections.length){
    root.innerHTML = '<div class="empty">无匹配条目。</div>';
    return;
  }
  root.innerHTML = sections.map((section, index) => {
    const shouldOpen = location.hash && decodeURIComponent(location.hash.slice(1)) === section.id;
    const open = shouldOpen || query || index < 2 ? ' open' : '';
    const paragraphs = section.paragraphs?.length ? section.paragraphs : [section.summary || ''];
    return `<details class="entry reveal" id="${escapeHTML(section.id)}"${open}>
      <summary>
        <div>
          <h2>${highlight(section.title, query)}</h2>
          <div class="entry-meta">
            ${section.category ? `<span>${escapeHTML(section.category)}</span>` : ''}
            ${section.top && section.top !== section.title ? `<span>${escapeHTML(section.top)}</span>` : ''}
          </div>
        </div>
        <span class="chevron">⌄</span>
      </summary>
      <div class="entry-body">${paragraphs.map(p => `<p>${highlight(p, query)}</p>`).join('')}</div>
    </details>`;
  }).join('');
  initReveal();
  if(location.hash){
    const id = decodeURIComponent(location.hash.slice(1));
    const target = document.getElementById(id);
    if(target){
      target.open = true;
      setTimeout(() => target.scrollIntoView({behavior:'smooth', block:'start'}), 80);
    }
  }
}

function initExpand(){
  const button = $('#expandAll');
  if(!button) return;
  button.addEventListener('click', () => {
    const entries = $$('.entry');
    const open = entries.some(item => !item.open);
    entries.forEach(item => item.open = open);
    button.textContent = open ? '收起全部' : '展开全部';
  });
}

function initListeners(){
  $('#locationSearch')?.addEventListener('input', renderLocations);
  $('#regionFilter')?.addEventListener('change', renderLocations);
  $('#timelineSearch')?.addEventListener('input', renderTimeline);
  $('#librarySearch')?.addEventListener('input', renderLibrary);
  $('#searchInput')?.addEventListener('input', renderArchive);
  $('#categoryFilter')?.addEventListener('change', renderArchive);
  window.addEventListener('hashchange', renderArchive);
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  renderHome();
  initRegionFilter();
  renderLocations();
  renderTimeline();
  renderLibrary();
  initCategoryFilter();
  renderArchive();
  initExpand();
  initListeners();
  initReveal();
});
