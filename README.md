<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="热夜之梦：弗菈明帝国世界观档案。" />
  <title>热夜之梦｜弗菈明帝国世界观档案</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="ambient ambient-1"></div>
  <div class="ambient ambient-2"></div>
  <header class="site-header" id="top">
    <nav class="nav-shell" aria-label="主导航">
      <a class="brand" href="#top" aria-label="返回首页">
        <span class="brand-mark">ψ</span>
        <span>
          <strong>热夜之梦</strong>
          <small>Archive of Flaminia</small>
        </span>
      </a>
      <button class="nav-toggle" id="navToggle" aria-label="打开目录" aria-expanded="false">目录</button>
      <div class="nav-links" id="navLinks">
        <a href="#overview">总览</a>
        <a href="#atlas">地图志</a>
        <a href="#timeline">帝国五百年</a>
        <a href="#library">国立图书馆</a>
        <a href="#prices">物价表</a>
        <a href="#archive">全文档案</a>
      </div>
    </nav>
  </header>

  <main>
    <section class="hero section-pad" id="overview">
      <div class="hero-grid">
        <div class="hero-copy reveal">
          <p class="eyebrow">Western Fantasy · Steam · Faith · Blood</p>
          <h1>弗菈明帝国<br><span>一半是魔法，一半是钢铁。</span></h1>
          <p class="hero-text">列维尼娅二世治下的帝国正在从荣光滑向深夜：铁轨、蒸汽、信会、术士、吸血鬼氏族、贵族会议和殖民地共同构成这份世界档案。</p>
          <div class="hero-actions">
            <a class="button primary" href="#archive">进入档案</a>
            <a class="button ghost" href="#timeline">查看年表</a>
          </div>
        </div>
        <aside class="hero-card reveal" aria-label="世界观摘要">
          <div class="crest">♛</div>
          <h2>帝国历 1556</h2>
          <p>女王加冕第五十六周年。世俗王权、宗教秩序、术法余烬与黑夜种族在同一张地图上互相啮合。</p>
          <dl class="stats" id="stats"></dl>
        </aside>
      </div>
    </section>

    <section class="section-pad themes" aria-labelledby="themesTitle">
      <div class="section-heading reveal">
        <p class="eyebrow">Narrative Architecture</p>
        <h2 id="themesTitle">网站叙事骨架</h2>
        <p>这份文档的强项是制度密度和历史纵深，因此网页不做单纯长文堆叠，而做可检索的世界百科。</p>
      </div>
      <div class="theme-grid" id="themeGrid"></div>
    </section>

    <section class="section-pad atlas" id="atlas" aria-labelledby="atlasTitle">
      <div class="section-heading reveal">
        <p class="eyebrow">Atlas</p>
        <h2 id="atlasTitle">地图志</h2>
        <p>以文字地图代替图片地图：城市、河流、殖民地与黑夜土地按地域分组，点击可跳转到完整条目。</p>
      </div>
      <div class="atlas-layout">
        <div class="map-panel reveal" aria-hidden="true">
          <div class="map-river"></div>
          <div class="map-node n1">维肯尼亚</div>
          <div class="map-node n2">孪闸城</div>
          <div class="map-node n3">高垣</div>
          <div class="map-node n4">黑夜土地</div>
          <div class="map-node n5">鸥憩群岛</div>
        </div>
        <div class="location-list reveal" id="locationList"></div>
      </div>
    </section>

    <section class="section-pad timeline-section" id="timeline" aria-labelledby="timelineTitle">
      <div class="section-heading reveal">
        <p class="eyebrow">Chronicle</p>
        <h2 id="timelineTitle">帝国五百年</h2>
        <p>从北水望之乱到列维尼娅二世加冕后的现代，年表用于让读者迅速理解权力更替和制度变化。</p>
      </div>
      <div class="timeline-controls reveal">
        <input id="timelineSearch" type="search" placeholder="搜索年表，例如：北水望、鸥憩群岛、列维尼娅" aria-label="搜索年表" />
      </div>
      <div class="timeline" id="timelineList"></div>
    </section>

    <section class="section-pad library" id="library" aria-labelledby="libraryTitle">
      <div class="section-heading reveal">
        <p class="eyebrow">State Library</p>
        <h2 id="libraryTitle">弗菈明国立图书馆</h2>
        <p>以书目和报刊摘录承载“世界内部的知识体系”，适合做成沉浸式文献柜。</p>
      </div>
      <div class="library-grid" id="libraryGrid"></div>
    </section>

    <section class="section-pad prices" id="prices" aria-labelledby="pricesTitle">
      <div class="section-heading reveal">
        <p class="eyebrow">Currency & Daily Cost</p>
        <h2 id="pricesTitle">货币与物价表</h2>
        <p>乌塞斯体系和首都周边价格能够让世界更可信。这里保留原始表格结构，便于后续扩展成经济设定页。</p>
      </div>
      <div class="price-panel reveal">
        <div class="price-note">1 金钨 = 20 银钨 = 240 镍钨；塔索、昂斯特用于大宗贸易记账。</div>
        <div class="table-wrap"><table id="priceTable"></table></div>
      </div>
    </section>

    <section class="section-pad archive" id="archive" aria-labelledby="archiveTitle">
      <div class="section-heading reveal">
        <p class="eyebrow">Complete Archive</p>
        <h2 id="archiveTitle">全文档案</h2>
        <p>所有条目已从 Word 文档转换为网页条目。用搜索和分类筛选阅读。</p>
      </div>
      <div class="archive-tools reveal">
        <input id="searchInput" type="search" placeholder="搜索：术士、圣主信会、吸血鬼、维肯尼亚、货币……" aria-label="搜索全文档案" />
        <select id="categoryFilter" aria-label="分类筛选">
          <option value="all">全部分类</option>
        </select>
        <button id="expandAll" class="tool-button" type="button">展开全部</button>
      </div>
      <div class="archive-layout">
        <aside class="side-index reveal" aria-label="条目目录">
          <div class="side-index-title">目录索引</div>
          <div id="sideIndex"></div>
        </aside>
        <div class="entry-list" id="entryList"></div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <a href="#top">返回顶部</a>
    <span>热夜之梦 · GitHub Pages 静态站点模板</span>
  </footer>

  <script src="world-data.js"></script>
  <script src="script.js"></script>
</body>
</html>
