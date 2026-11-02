/* Static bilingual academic homepage. Content lives in content.js. */
(() => {
  'use strict';
  let data = window.SITE_CONTENT;
  const storage = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k,v) { try { localStorage.setItem(k,v); } catch {} } };
  const isPreview = new URLSearchParams(location.search).get('preview') === '1';
  if (isPreview) { try { const draft = JSON.parse(storage.get('mw-homepage-draft')); if (draft?.schemaVersion === 1) data = draft; } catch {} document.querySelector('#preview-banner').hidden = false; }
  if (!data?.profile || !Array.isArray(data.publications)) return;
  let lang = new URLSearchParams(location.search).get('lang') || storage.get('mw-language') || 'zh';
  lang = lang === 'en' ? 'en' : 'zh';
  const state = { track: 'all', year: 'all', search: '', featured: false, limit: 12 };
  const h = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tx = v => typeof v === 'object' && v ? (v[lang] ?? v.en ?? v.zh ?? '') : v;
  const num = v => Number(v).toLocaleString('en-US');
  const url = v => { try { const u = new URL(v); return u.protocol === 'https:' ? h(u.href) : '#'; } catch { return '#'; } };
  const link = (u,label,cls='') => `<a class="${h(cls)}" href="${url(u)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  const dict = {
    zh: { about:'关于我',research:'两个方向，同一个科学目标',researchIntro:'以人工智能方法连接分子机制与临床观察。',contributions:'AI 研究代表成果',contributionsIntro:'从高影响力医学分割，到弱监督病理分析与分子学习。',publications:'论文精选',background:'经历与学术服务',nav:['简介','经历与学术服务','研究','成果','论文','实习'],contact:'联系我',citations:'总引用次数',hIndex:'h 指数',i10:'i10 指数',swinCites:'Swin-Unet 引用次数',snapshot:'Google Scholar 数据快照',asOf:'截至',learn:'查看论文',viewTrack:'查看该方向论文',all:'全部方向',drug:'AI 辅助制药',medical:'医学影像 AI',search:'搜索标题、作者、研究主题…',year:'全部年份',sort:'排序',recent:'按年份排序',cited:'按引用排序',onlyFeatured:'仅代表作',paper:'论文',code:'代码',cite:'引用',citedBy:'次引用',showMore:'显示更多论文',noResults:'没有找到匹配的论文。',reset:'重置筛选',result:'篇匹配论文',displaying:'当前显示',pubSource:'论文主要来自个人 Google Scholar 主页，并结合会议论文集及本人提供的信息补充；已合并本页中的重复版本。引用数据为查询当日快照，完整成果请查看 Google Scholar。',apply:'邮件申请实习',experience:'工作经历',education:'教育与访问经历',honors:'奖励与荣誉',service:'学术服务',editor:'内容编辑',footer:'AI for Drug Discovery & Medical Imaging',copy:'复制引用',copied:'已复制引用。',copyFallback:'请选中上方文本并复制。',pathologyNote:'NeurIPS 2022（spotlight） / 2023 / 2024/2026：弱监督蒸馏、可解释性、少样本学习与域适应。',discoveryNote:'从表面与多模态表征，到功能预测和盲对接。',collaborative:'代表性合作成果',milestone:'方法与影响',viewFull:'查看完整论文列表',professor:'王满宁教授',source:'来源',more:'更多',bioNote:'连接计算方法与生物医学问题，以表征学习、弱监督学习和几何建模探索跨尺度的智能分析。',aboutLabel:'RESEARCH PERSPECTIVE',outreach:'科研交流与合作',email:'电子邮箱',preview:'本地编辑预览，尚未发布。',backEditor:'返回编辑器',next:'返回顶部',citeUnknown:'尚无引用记录' },
    en: { about:'About me',research:'Two directions. One scientific pursuit.',researchIntro:'Connecting molecular mechanisms and clinical observations through AI.',contributions:'Selected contributions in AI',contributionsIntro:'From influential medical segmentation to weakly supervised pathology and molecular learning.',publications:'Selected publications',background:'Background & academic service',nav:['About','Background','Research','Highlights','Publications','Join us'],contact:'Get in touch',citations:'Total citations',hIndex:'h-index',i10:'i10-index',swinCites:'Swin-Unet citations',snapshot:'Google Scholar snapshot',asOf:'As of',learn:'Read paper',viewTrack:'Explore publications',all:'All research',drug:'AI for Drug Discovery',medical:'AI for Medical Imaging',search:'Search titles, authors, research topics…',year:'All years',sort:'Sort',recent:'Newest first',cited:'Most cited',onlyFeatured:'Key papers only',paper:'Paper',code:'Code',cite:'Cite',citedBy:'citations',showMore:'Show more publications',noResults:'No publications match your search.',reset:'Reset filters',result:'matching publications',displaying:'Showing',pubSource:'Selected primarily from the personal Google Scholar profile, supplemented by conference proceedings and author-provided information. Duplicate versions within this selection are consolidated. Citation counts are a dated snapshot. See Google Scholar for the full publication list.',apply:'Apply by email',experience:'Academic appointments',education:'Education & visiting experience',honors:'Awards & recognition',service:'Academic service',editor:'Content editor',footer:'AI for Drug Discovery & Medical Imaging',copy:'Copy citation',copied:'Citation copied.',copyFallback:'Select the text above and copy it.',pathologyNote:'NeurIPS 2022 (Spotlight) / 2023 / 2024 / 2026: weakly supervised distillation, interpretability, few-shot learning and domain adaptation.',discoveryNote:'From surface and multimodal representations to function prediction and blind docking.',collaborative:'Selected collaborative work',milestone:'Methods & impact',viewFull:'Full publication list',professor:'Professor Manning Wang',source:'Source',more:'More',bioNote:'Connecting computational methods with biomedical questions through representation learning, weak supervision and geometric modeling.',aboutLabel:'RESEARCH PERSPECTIVE',outreach:'Research inquiries & collaboration',email:'Email',preview:'Local editing preview. Changes have not been published.',backEditor:'Back to editor',next:'Back to top',citeUnknown:'No citation count yet' }
  };
  const t = key => dict[lang][key];
  const find = id => data.publications.find(p => p.id === id);
  const arrow = '<span aria-hidden="true">↗</span>';
  function art(track) {
    if (track === 'drug') return '<svg class="research-art" viewBox="0 0 150 76" fill="none" aria-hidden="true"><g stroke="#26766c" stroke-width="1"><path d="M16 40L42 18L70 29L96 12L128 34L114 61L79 58L51 66L16 40L70 29L79 58L128 34M42 18L51 66M96 12L114 61"/></g><g fill="#edf1eb" stroke="#26766c" stroke-width="1.5"><circle cx="16" cy="40" r="4"/><circle cx="42" cy="18" r="6"/><circle cx="70" cy="29" r="5"/><circle cx="96" cy="12" r="4"/><circle cx="128" cy="34" r="7"/><circle cx="114" cy="61" r="4"/><circle cx="79" cy="58" r="6"/><circle cx="51" cy="66" r="4"/></g><circle cx="70" cy="29" r="2" fill="#ad6845"/></svg>';
    return '<svg class="research-art" viewBox="0 0 150 76" fill="none" aria-hidden="true"><g stroke="#7b8eac"><rect x="22" y="5" width="53" height="53" rx="1"/><rect x="56" y="20" width="53" height="53" rx="1"/><rect x="90" y="7" width="42" height="42" rx="1"/></g><g fill="#8494b0" opacity=".6"><ellipse cx="40" cy="21" rx="7" ry="3" transform="rotate(25 40 21)"/><ellipse cx="59" cy="39" rx="8" ry="4" transform="rotate(-30 59 39)"/><ellipse cx="73" cy="55" rx="7" ry="3"/><ellipse cx="89" cy="39" rx="5" ry="9" transform="rotate(28 89 39)"/><ellipse cx="113" cy="27" rx="7" ry="4" transform="rotate(-40 113 27)"/></g></svg>';
  }
  function renderHero() {
    const p = data.profile;
    const portrait = /^assets\/[\w.\-/]+$/.test(p.portrait) || /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(p.portrait) ? p.portrait : 'assets/portrait.png';
    document.querySelector('#hero').innerHTML = `<div><p class="eyebrow">FUDAN UNIVERSITY · RESEARCH & DISCOVERY</p><h1>${h(tx(p.name))}<span>${h(p.name[lang === 'zh' ? 'en' : 'zh'])}</span></h1><p class="identity">${h(tx(p.title))}</p><p class="affiliation">${h(tx(p.affiliation))}</p><h2>${h(tx(p.headline))}</h2><p class="lede">${h(tx(p.intro))}</p><div class="hero-links"><a class="button" href="mailto:${h(p.email)}">${h(t('contact'))} ${arrow}</a>${link(p.scholar,'Google Scholar '+arrow)}${link(p.github,'GitHub '+arrow)}</div></div><div class="hero-photo"><img class="portrait" src="${h(portrait)}" alt="${h(t('professor'))}" width="396" height="398"><p class="photo-caption">${h(p.name.en.toUpperCase())}</p><div class="photo-decor" aria-hidden="true"></div></div>`;
    const swin = find('t0');
    const values = [[data.metrics.citations,'citations'],[data.metrics.hIndex,'hIndex'],[data.metrics.i10Index,'i10'],[swin?.citations ?? 0,'swinCites']];
    document.querySelector('#impact').innerHTML = `<div class="metric-grid">${values.map(([v,k]) => `<div class="metric"><strong>${num(v)}</strong><span>${h(t(k))}</span></div>`).join('')}</div><p class="source-note">${link(data.metrics.source,h(t('snapshot')))} · ${h(t('asOf'))} ${h(data.metrics.date)}</p>`;
    document.querySelector('#biography').innerHTML = `<div class="about-content"><p class="bio-text">${h(tx(p.bio))}</p><aside class="about-note"><p class="label">${h(t('aboutLabel'))}</p><p>${h(t('bioNote'))}</p></aside></div>`;
  }
  function renderDirections() {
    document.querySelector('#directions').innerHTML = data.research.map(r => `<article class="research-panel ${h(r.id)}"><div class="research-top"><span class="research-number">${h(r.number)} /</span>${art(r.id)}</div><h3>${h(tx(r.title))}</h3><p class="subtitle">${h(tx(r.subtitle))}</p><p class="description">${h(tx(r.description))}</p><ul>${String(tx(r.topics)).split('\n').filter(Boolean).map(s => `<li>${h(s)}</li>`).join('')}</ul><a class="text-link track-link" data-track="${h(r.id)}" href="#publications">${h(t('viewTrack'))} ${arrow}</a></article>`).join('');
  }
  function renderHighlights() {
    document.querySelector('#featured').innerHTML = data.highlights.map((x,i) => {
      const p = find(x.paper); if (!p) return '';
      let extra = '';
      if (p.id === 't9') extra = `<ul class="mini-works">${['t13','t65'].map(id => find(id)).filter(Boolean).map(q => `<li>${q.year} · ${link(q.url,h(q.title))}</li>`).join('')}</ul>`;
      const shortTitle = {'drug-tta-2025':'Drug-TTA','t0':'Swin-Unet','t9':lang==='zh'?'弱监督与少样本病理分析':'Weakly supervised & few-shot pathology','r40':'ProteinMAE','r18':lang==='zh'?'蛋白质–配体盲对接':'Protein–ligand blind docking'}[p.id] || p.title;
      let summary = tx(p.summary);
      if (p.id === 't9') summary = t('pathologyNote');
      if (p.id === 'r18') { const latest = find('r3'); if (latest) extra = `<ul class="mini-works"><li>2025 · ${link(p.url,'PPDock')}</li><li>2026 · ${link(latest.url,'IAP-CFDock')}</li></ul>`; }
      return `<article class="highlight"><div class="highlight-meta"><span class="pill">${h(tx(x.label))}</span><span class="highlight-index">0${i+1} / ${h(p.venueShort)}</span></div><h3>${h(shortTitle)}</h3><p>${h(summary)}</p>${extra}<div class="highlight-bottom">${link(p.url,h(t('learn'))+' '+arrow,'text-link')}<span class="${p.id==='t0'||p.presentation==='Oral'?'citation-badge':'topic'}">${p.id === 't0' ? num(p.citations)+' '+h(t('citedBy')) : h(p.venueShort)+' · '+p.year+(p.presentation?' · '+h(p.presentation):'')}</span></div></article>`;
    }).join('');
  }
  function renderControls() {
    const years = [...new Set(data.publications.map(p => p.year))].sort((a,b)=>b-a);
    document.querySelector('#publication-controls').innerHTML = `<div class="filter-top"><div class="tabs" role="group" aria-label="${h(t('research'))}">${['all','drug','medical'].map(k=>`<button class="tab ${state.track===k?'active':''}" type="button" data-track="${k}" aria-pressed="${state.track===k}">${h(t(k))}</button>`).join('')}</div></div><div class="filter-inputs"><label class="search-wrap"><span class="sr-only">${h(t('search'))}</span><input id="paper-search" type="search" value="${h(state.search)}" placeholder="${h(t('search'))}" aria-label="${h(t('search'))}"></label><select id="paper-year" aria-label="${h(t('year'))}"><option value="all">${h(t('year'))}</option>${years.map(y=>`<option value="${y}" ${String(state.year)===String(y)?'selected':''}>${y}</option>`).join('')}</select><select id="paper-sort" aria-label="${h(t('sort'))}"><option value="recent">${h(t('recent'))}</option><option value="cited">${h(t('cited'))}</option></select><label class="check-label"><input type="checkbox" id="featured-only" ${state.featured?'checked':''}>${h(t('onlyFeatured'))}</label></div><div id="result-count" class="result-count" role="status" aria-live="polite"></div>`;
    const sort = document.querySelector('#paper-sort'); sort.value=state.sort||'recent';
    document.querySelector('#paper-search').addEventListener('input', e=>{state.search=e.target.value;state.limit=12;renderPapers();});
    document.querySelector('#paper-year').addEventListener('change', e=>{state.year=e.target.value;state.limit=12;renderPapers();});
    sort.addEventListener('change', e=>{state.sort=e.target.value;renderPapers();});
    document.querySelector('#featured-only').addEventListener('change', e=>{state.featured=e.target.checked;state.limit=12;renderPapers();});
  }
  const normalize = x => String(x).toLocaleLowerCase().normalize('NFKC').replace(/[–—−]/g,'-');
  function filtered() {
    const query=normalize(state.search).trim();
    return data.publications.filter(p=>(state.track==='all'||p.track===state.track)&&(state.year==='all'||String(p.year)===String(state.year))&&(!state.featured||p.featured)&&(!query||normalize([p.title,p.authors,p.venue,p.venueShort,p.topic.zh,p.topic.en,p.summary.zh,p.summary.en].join(' ')).includes(query))).sort((a,b)=>state.sort==='cited'?((b.citations??-1)-(a.citations??-1)||b.year-a.year):(b.year-a.year||Number(b.featured)-Number(a.featured)||(b.citations??-1)-(a.citations??-1)));
  }
  function authorText(s) { return h(s).replace(/\b(Manning Wang|M Wang|MN Wang)\b/g,'<strong>$1</strong>'); }
  function renderPapers() {
    const rows=filtered();const shown=rows.slice(0,state.limit);
    document.querySelector('#result-count').textContent=`${rows.length} ${t('result')} · ${t('displaying')} ${shown.length}`;
    document.querySelector('#publication-list').innerHTML = rows.length ? shown.map(p=>`<article class="paper"><div class="paper-year">${p.year}</div><div><h3>${link(p.url,h(p.title))}</h3>${p.authors?`<p class="authors">${authorText(p.authors)}</p>`:''}<div class="venue-row"><span class="venue">${h(p.venueShort)}${p.presentation?' · '+h(p.presentation):''}</span><span class="topic">${h(tx(p.topic))}</span>${p.featured?'<span class="pill">'+h(t('collaborative'))+'</span>':''}</div><div class="paper-links">${link(p.url,h(t('paper'))+' '+arrow)}${p.code?link(p.code,h(t('code'))+' '+arrow):''}${link(p.scholar,'Scholar '+arrow)}<button class="link-button" type="button" data-cite="${h(p.id)}">${h(t('cite'))}</button></div></div><div class="paper-cites">${p.citations===null?`<span title="${h(t('citeUnknown'))}">—</span>`:`<strong>${num(p.citations)}</strong><span>${h(t('citedBy'))}</span>`}</div></article>`).join('') : `<div class="empty-state">${h(t('noResults'))}<br><button class="button secondary" id="reset-filters" type="button">${h(t('reset'))}</button></div>`;
    document.querySelector('#publication-more').innerHTML=rows.length>shown.length?`<button id="show-more" class="button secondary" type="button">${h(t('showMore'))} <span aria-hidden="true">↓</span></button>`:'';
    document.querySelector('#show-more')?.addEventListener('click',()=>{state.limit+=12;renderPapers();});
    document.querySelector('#reset-filters')?.addEventListener('click',()=>{Object.assign(state,{track:'all',year:'all',search:'',featured:false,limit:12});renderControls();renderPapers();});
    document.querySelector('#publication-source').innerHTML=`${h(t('pubSource'))} ${h(t('asOf'))} ${h(data.metrics.date)} · ${link(data.profile.scholar,'Google Scholar '+arrow)}`;
  }
  function renderInternship() {
    const d=data.internship;const email=data.profile.email;const subject=encodeURIComponent(lang==='zh'?'科研实习申请':'Research internship application');
    document.querySelector('#internship').innerHTML=`<div><p class="eyebrow">06 / JOIN THE RESEARCH</p><h2>${h(tx(d.title))}</h2><p>${h(tx(d.intro))}</p><a class="button" href="mailto:${h(email)}?subject=${subject}">${h(t('apply'))} ${arrow}</a><a class="email" href="mailto:${h(email)}">${h(email)}</a></div><div><ul>${d.requirements.map(r=>`<li>${h(tx(r))}</li>`).join('')}</ul><p class="application-note">${h(tx(d.application))}</p></div>`;
  }
  function renderBackground() {
    const timeline=items=>items.map(x=>`<div class="timeline-item"><time>${h(x.period)}</time><div><strong>${h(tx(x.title))}</strong><p>${h(tx(x.place))}</p></div></div>`).join('');
    const list=items=>`<ul class="list-simple">${items.map(s=>`<li>${h(tx(s))}</li>`).join('')}</ul>`;
    document.querySelector('#background-content').innerHTML=`<div class="background-grid"><div><h3>${h(t('experience'))}</h3>${timeline(data.experience)}<h3 class="education-title">${h(t('education'))}</h3>${timeline(data.education)}</div><div><h3>${h(t('honors'))}</h3>${list(data.honors)}<h3>${h(t('service'))}</h3>${list(data.service)}</div></div>`;
  }
  function render() {
    document.documentElement.lang=lang==='zh'?'zh-CN':'en';
    document.title=lang==='zh'?'王满宁 Manning Wang · 复旦大学':'Manning Wang · Fudan University';
    document.querySelector('meta[name="description"]').content=tx(data.profile.intro);
    document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});
    document.querySelector('#navigation').innerHTML=['about','background','research','highlights','publications','join'].map((id,i)=>`<a href="#${id}">${h(t('nav')[i])}</a>`).join('');
    document.querySelector('#navigation').setAttribute('aria-label',lang==='zh'?'主导航':'Main navigation');
    const languageButton=document.querySelector('#language');languageButton.innerHTML=(lang==='zh'?'EN':'中文')+' <span aria-hidden="true">↗</span>';languageButton.setAttribute('aria-label',lang==='zh'?'Switch to English':'切换至中文');
    if(isPreview)document.querySelector('#preview-banner').innerHTML=`${h(t('preview'))} <a href="editor.html">${h(t('backEditor'))}</a>`;
    renderHero();renderDirections();renderHighlights();renderControls();renderPapers();renderInternship();renderBackground();
    document.querySelector('#footer').innerHTML=`<div><div class="footer-name">${h(tx(data.profile.name))}</div><div class="footer-note">${h(t('footer'))}</div></div><div class="footer-links">${link(data.profile.scholar,'Google Scholar '+arrow)}<a href="mailto:${h(data.profile.email)}">${h(t('email'))} ${arrow}</a><a href="editor.html">${h(t('editor'))}</a><a href="#">↑ ${h(t('next'))}</a></div>`;
  }
  document.querySelector('#language').addEventListener('click',()=>{lang=lang==='zh'?'en':'zh';storage.set('mw-language',lang);render();});
  document.addEventListener('click',e=>{
    const track=e.target.closest('[data-track]');
    if(track){state.track=track.dataset.track;state.limit=12;renderControls();renderPapers();}
    const citation=e.target.closest('[data-cite]');
    if(citation){const p=find(citation.dataset.cite);if(!p)return;document.querySelector('#citation-title').textContent=t('cite');document.querySelector('#citation-text').value=`${p.authors?p.authors+'. ':''}(${p.year}). ${p.title}. ${p.venue}. ${p.doi?'https://doi.org/'+p.doi:p.url}`;document.querySelector('#copy-status').textContent='';document.querySelector('#copy-citation').textContent=t('copy');document.querySelector('#citation-dialog').showModal();}
  });
  document.querySelector('#close-dialog').addEventListener('click',()=>document.querySelector('#citation-dialog').close());
  document.querySelector('#copy-citation').addEventListener('click',async()=>{const field=document.querySelector('#citation-text');try{await navigator.clipboard.writeText(field.value);document.querySelector('#copy-status').textContent=t('copied');}catch{field.select();document.querySelector('#copy-status').textContent=t('copyFallback');}});
  document.querySelector('#citation-dialog').addEventListener('click',e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.currentTarget.close();}});
  if (isPreview && window.opener) {
    window.addEventListener('message', e => {
      if (e.source !== window.opener || e.data?.type !== 'mw-preview-content') return;
      const next = e.data.content;
      if (next?.schemaVersion !== 1 || !next?.profile || !Array.isArray(next?.publications)) return;
      data = next; render();
    });
    window.opener.postMessage({type:'mw-preview-ready'}, '*');
  }
  render();
})();
