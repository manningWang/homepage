(() => {
  'use strict';
  const KEY='mw-homepage-draft';
  const published=JSON.parse(JSON.stringify(window.SITE_CONTENT));
  let draft=JSON.parse(JSON.stringify(published));
  const h=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clone=x=>JSON.parse(JSON.stringify(x));
  let section='profile',selected=draft.publications[0]?.id,query='',dirty=false,previewWindow=null;
  const sections={profile:'个人信息 / Profile',research:'研究方向 / Research',publications:'论文管理 / Publications',internship:'科研实习 / Internships',background:'经历与荣誉 / Background',metrics:'学术数据 / Metrics'};
  function validate(d){
    const errors=[];
    if(d?.schemaVersion!==1)errors.push('内容文件版本不兼容。');
    if(!d?.profile?.name?.zh||!d?.profile?.name?.en)errors.push('请填写中英文姓名。');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d?.profile?.email||''))errors.push('请填写有效的联系邮箱。');
    if(!Array.isArray(d?.publications)||!Array.isArray(d?.research)||!d?.internship)errors.push('内容文件缺少必要栏目。');
    const ids=new Set();
    for(const p of d?.publications||[]){
      if(!p.id||ids.has(p.id))errors.push('论文编号缺失或重复。');ids.add(p.id);
      if(!p.title?.trim())errors.push('有一篇论文缺少标题。');
      if(!p.url?.trim())errors.push('请填写每篇论文的可访问链接。');
      if(!Number.isInteger(Number(p.year))||p.year<1900||p.year>2100)errors.push('论文年份应介于 1900 与 2100 之间。');
      if(!['drug','medical'].includes(p.track))errors.push('论文研究方向无效。');
      if(!p.topic?.zh||!p.topic?.en||!p.summary)errors.push('论文缺少中英文研究主题或说明字段。');
      for(const key of ['url','scholar','code'])if(p[key]&&!/^https:\/\//i.test(p[key]))errors.push('论文链接应以 https:// 开头。');
      if(p.citations!==null&&(!Number.isInteger(Number(p.citations))||Number(p.citations)<0))errors.push('引用次数应为非负整数，或留空。');
    }
    if(!/^\d{4}-\d{2}-\d{2}$/.test(d?.metrics?.date||''))errors.push('数据日期应为 YYYY-MM-DD 格式。');
    for(const k of ['citations','hIndex','i10Index'])if(!Number.isInteger(Number(d?.metrics?.[k]))||d.metrics[k]<0)errors.push('学术数据应为非负整数。');
    return [...new Set(errors)];
  }
  try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved&&!validate(saved).length){draft=saved;dirty=true;selected=draft.publications[0]?.id;}}catch{}
  function feedback(message,error=false){document.querySelector('#editor-feedback').innerHTML=message?`<div class="editor-notice ${error?'error':''}">${h(message)}</div>`:'';}
  function save(){
    dirty=true;
    try{localStorage.setItem(KEY,JSON.stringify(draft));document.querySelector('#draft-status').textContent='草稿已保存在当前浏览器 · 尚未发布';}
    catch{document.querySelector('#draft-status').textContent='浏览器未允许保存草稿，请及时导出备份。';}
  }
  const get=path=>path.split('.').reduce((o,k)=>o?.[k],draft);
  function set(path,value){const parts=path.split('.');const last=parts.pop();let at=draft;for(const p of parts)at=at[p];at[last]=value;}
  function field(path,label,type='text',help=''){
    const val=get(path);const control=type==='textarea'||type==='long'?`<textarea data-path="${h(path)}" ${type==='long'?'class="long"':''}>${h(val)}</textarea>`:`<input type="${h(type)}" data-path="${h(path)}" value="${h(val)}" ${type==='number'?'min="0" step="1"':''}>`;
    return `<label class="editor-field"><span>${h(label)}</span>${control}${help?`<small>${h(help)}</small>`:''}</label>`;
  }
  function pair(path,label,type='text'){return `<div class="field-pair full"><div class="form-grid">${field(path+'.zh',label+'（中文）',type)}${field(path+'.en',label+'（English）',type)}</div></div>`;}
  function profileForm(){
    const p=draft.profile;
    const portrait=(/^assets\/[\w.\-/]+$/.test(p.portrait)||/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(p.portrait))?p.portrait:'assets/portrait.png';
    return `<section class="form-section"><h2>个人信息与照片</h2><div class="photo-editor"><img id="editor-portrait" src="${h(portrait)}" alt="当前照片"><div><label class="editor-field"><span>更换照片（PNG、JPEG、WebP）</span><input id="photo-file" type="file" accept="image/png,image/jpeg,image/webp"></label><p class="help">新照片会自动缩放并保存在 content.js 中，无需单独上传照片文件。</p></div></div><div class="form-grid">${pair('profile.name','姓名')}${pair('profile.title','职称与导师身份')}${pair('profile.affiliation','单位')}${field('profile.email','联系邮箱','email')}${field('profile.scholar','Google Scholar 主页','url')}${field('profile.github','GitHub 主页','url')}${pair('profile.headline','首页研究标题','textarea')}${pair('profile.intro','首页简述','textarea')}${pair('profile.bio','完整个人简介','long')}</div></section>`;
  }
  function researchForm(){return draft.research.map((r,i)=>`<section class="form-section"><h2>${h(r.number)} · ${h(r.title.zh)}</h2><div class="form-grid">${pair(`research.${i}.title`,'方向名称')}${pair(`research.${i}.subtitle`,'副标题')}${pair(`research.${i}.description`,'研究介绍','textarea')}${pair(`research.${i}.topics`,'研究主题（每行一个）','textarea')}</div></section>`).join('')+`<section class="form-section"><h2>首页代表成果</h2><p class="help">选择展示的代表作，顺序对应网站上的四个成果位置。默认选题具有专门的介绍，换成其他论文后将使用该论文的标题与简介。</p><div class="form-grid">${draft.highlights.map((x,i)=>`<div class="full"><label class="editor-field"><span>位置 ${i+1} · 对应论文</span><select data-path="highlights.${i}.paper">${draft.publications.map(p=>`<option value="${h(p.id)}" ${x.paper===p.id?'selected':''}>${p.year} · ${h(p.title)}</option>`).join('')}</select></label>${pair(`highlights.${i}.label`,'成果标签')}</div>`).join('')}</div></section>`;}
  function internshipForm(){return `<section class="form-section"><h2>科研实习招募</h2><div class="form-grid">${pair('internship.title','标题')}${pair('internship.intro','招募介绍','textarea')}${draft.internship.requirements.map((r,i)=>pair(`internship.requirements.${i}`,`要求 ${i+1}`,'textarea')).join('')}${pair('internship.application','申请说明','textarea')}</div><p class="help">联系邮箱与个人信息中的邮箱保持一致。</p></section>`;}
  function backgroundForm(){
    const timeline=(key,label)=>`<section class="form-section"><h2>${h(label)}</h2>${draft[key].map((x,i)=>`<div class="repeater-item"><div class="form-grid">${field(`${key}.${i}.period`,'时间段')}${pair(`${key}.${i}.title`,'职位 / 学历')}${pair(`${key}.${i}.place`,'单位 / 学校')}</div><div class="repeater-controls"><button class="link-button" data-remove="${key}.${i}">移除此项</button></div></div>`).join('')}<button class="button secondary" data-add="${key}">＋ 添加一项</button></section>`;
    const list=(key,label)=>`<section class="form-section"><h2>${h(label)}</h2>${draft[key].map((x,i)=>`<div class="repeater-item">${pair(`${key}.${i}`,'内容','textarea')}<div class="repeater-controls"><button class="link-button" data-remove="${key}.${i}">移除此项</button></div></div>`).join('')}<button class="button secondary" data-add="${key}">＋ 添加一项</button></section>`;
    return timeline('experience','工作经历')+timeline('education','教育与访问经历')+list('honors','奖励与荣誉')+list('service','学术服务');
  }
  function metricsForm(){return `<section class="form-section"><h2>学术影响力数据</h2><p class="help">请在核对 Google Scholar 后更新这些数字，并填写查询日期。每篇论文的引用次数在“论文管理”中更新；Swin-Unet 首页引用数来自对应论文。</p><div class="form-grid">${field('metrics.citations','总引用次数','number')}${field('metrics.hIndex','h 指数','number')}${field('metrics.i10Index','i10 指数','number')}${field('metrics.date','查询日期','date')}${field('metrics.source','数据来源链接','url')}</div></section>`;}
  function renderChooser(){
    const q=query.toLowerCase();const rows=draft.publications.filter(p=>[p.title,p.year,p.venueShort,p.topic?.zh].join(' ').toLowerCase().includes(q));
    const el=document.querySelector('#paper-chooser');if(!el)return;
    el.innerHTML=rows.length?rows.map(p=>`<button class="paper-choice ${p.id===selected?'active':''}" data-paper="${h(p.id)}"><small>${p.year} · ${h(p.venueShort)} · ${p.track==='drug'?'AI 辅助制药':'医学影像 AI'}</small>${h(p.title)}</button>`).join(''):'<p class="no-papers">没有匹配的论文。</p>';
  }
  function paperFields(){
    const i=draft.publications.findIndex(p=>p.id===selected);const p=draft.publications[i];if(!p)return '<section class="form-section"><p class="help">点击“添加论文”创建第一篇论文。</p></section>';
    const base=`publications.${i}`;
    return `<section class="form-section"><h2>编辑论文</h2><div class="form-grid">${field(base+'.title','论文标题','textarea')}${field(base+'.authors','作者（请保留完整准确顺序）','textarea')}${field(base+'.year','发表年份','number')}${field(base+'.venueShort','期刊 / 会议简称')}${field(base+'.venue','完整发表信息','textarea')}<label class="editor-field"><span>研究方向</span><select data-path="${base}.track"><option value="drug" ${p.track==='drug'?'selected':''}>AI 辅助制药</option><option value="medical" ${p.track==='medical'?'selected':''}>医学影像 AI</option></select></label>${pair(base+'.topic','研究主题')}${pair(base+'.summary','简要介绍','textarea')}${field(base+'.url','论文链接（https://）','url')}${field(base+'.scholar','Scholar 详情链接（可选）','url')}${field(base+'.code','公开代码链接（可选）','url')}${field(base+'.doi','DOI（可选，不含 https://doi.org/）')}${field(base+'.citations','引用次数（没有记录时留空）','number')}</div><label class="field-check"><input type="checkbox" data-path="${base}.featured" ${p.featured?'checked':''}> 设为代表作（可使用“仅代表作”筛选）</label><button class="delete-button" data-delete-paper="${h(p.id)}">移除此论文</button><p class="danger-note">导出前可随时通过恢复内容或导入备份找回。</p></section>`;
  }
  function publicationsForm(){return `<div class="publication-edit-toolbar"><input id="editor-paper-search" type="search" placeholder="搜索论文标题、年份、会议…" value="${h(query)}" aria-label="搜索论文"><button id="add-paper" class="button">＋ 添加论文</button></div><div class="publication-editor"><div id="paper-chooser" class="paper-chooser" aria-label="论文列表"></div><div id="paper-fields">${paperFields()}</div></div>`;}
  function render(){
    document.querySelector('#editor-title').textContent=sections[section];document.querySelector('#editor-tabs').innerHTML=Object.entries(sections).map(([id,label])=>`<button data-section="${id}" class="${id===section?'active':''}" ${id===section?'aria-current="page"':''}>${h(label)}</button>`).join('');
    document.querySelector('#draft-status').textContent=dirty?'草稿已保存在当前浏览器 · 尚未发布':'已载入 content.js · 修改后可预览和导出';
    document.querySelector('#editor-form').innerHTML=({profile:profileForm,research:researchForm,publications:publicationsForm,internship:internshipForm,background:backgroundForm,metrics:metricsForm})[section]();
    if(section==='publications'){renderChooser();document.querySelector('#editor-paper-search').addEventListener('input',e=>{query=e.target.value;renderChooser();});}
    document.querySelector('#photo-file')?.addEventListener('change',async e=>{
      const file=e.target.files[0];if(!file)return;if(!['image/png','image/jpeg','image/webp'].includes(file.type)){feedback('请选择 PNG、JPEG 或 WebP 图片。',true);return;}
      if(file.size>15*1024*1024){feedback('图片过大，请选择 15 MB 以内的照片。',true);return;}
      try{const bitmap=await createImageBitmap(file);const canvas=document.createElement('canvas');const scale=Math.min(1,720/Math.max(bitmap.width,bitmap.height));canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);draft.profile.portrait=canvas.toDataURL('image/jpeg',.9);bitmap.close();save();document.querySelector('#editor-portrait').src=draft.profile.portrait;feedback('照片已加入草稿，导出 content.js 即可一并保存。');}catch{feedback('无法读取此照片，请换一张图片。',true);}
    });
  }
  document.addEventListener('input',e=>{
    const path=e.target.dataset.path;if(!path)return;let value=e.target.type==='checkbox'?e.target.checked:e.target.value;
    if(e.target.type==='number')value=value===''&&path.endsWith('.citations')?null:Number(value);
    set(path,value);save();if(section==='publications'&&(/\.(title|year|venueShort|track)$/.test(path)))renderChooser();
  });
  document.addEventListener('change',e=>{if(e.target.tagName==='SELECT'&&e.target.dataset.path){set(e.target.dataset.path,e.target.value);save();if(section==='publications')renderChooser();}});
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.section){section=b.dataset.section;feedback('');render();}
    if(b.dataset.paper){selected=b.dataset.paper;document.querySelector('#paper-fields').innerHTML=paperFields();renderChooser();}
    if(b.id==='add-paper'){
      const id='p'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);draft.publications.unshift({id,title:'',authors:'',year:new Date().getFullYear(),venue:'',venueShort:'',track:'drug',topic:{zh:'新研究主题',en:'New research topic'},summary:{zh:'',en:''},citations:null,featured:false,url:'',scholar:'',doi:'',code:''});selected=id;query='';save();render();
    }
    if(b.dataset.deletePaper){const id=b.dataset.deletePaper;if(draft.highlights.some(x=>x.paper===id)){feedback('这篇论文正在首页成果区展示。请先在“研究方向”的首页代表成果中更换论文，再移除。',true);return;}draft.publications=draft.publications.filter(p=>p.id!==id);selected=draft.publications[0]?.id;save();render();}
    if(b.dataset.remove){const [key,index]=b.dataset.remove.split('.');draft[key].splice(Number(index),1);save();render();}
    if(b.dataset.add){const key=b.dataset.add;draft[key].push(['experience','education'].includes(key)?{period:'',title:{zh:'',en:''},place:{zh:'',en:''}}:{zh:'',en:''});save();render();}
  });
  window.addEventListener('message',e=>{if(e.source===previewWindow&&e.data?.type==='mw-preview-ready')previewWindow.postMessage({type:'mw-preview-content',content:draft},'*');});
  document.querySelector('#preview-button').addEventListener('click',()=>{const errors=validate(draft);if(errors.length){feedback(errors.join(' '),true);return;}save();previewWindow=window.open('index.html?preview=1','_blank');feedback(previewWindow?'已打开草稿预览。修改后的内容尚未发布。':'浏览器拦截了预览窗口，请允许弹出窗口后重试。',!previewWindow);});
  document.querySelector('#export-button').addEventListener('click',()=>{
    const errors=validate(draft);if(errors.length){feedback(errors.join(' '),true);return;}
    save();const text='/* Bilingual academic homepage content. Edited with editor.html. */\nwindow.SITE_CONTENT = '+JSON.stringify(draft,null,2).replace(/</g,'\\u003c')+';\n';const blob=new Blob([text],{type:'text/javascript;charset=utf-8'});const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download='content.js';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),30000);feedback('已导出 content.js。请点击“打开 GitHub 上传”，将此文件拖入仓库根目录并提交。线上网站不会在导出时自动改变。');
  });
  document.querySelector('#import-button').addEventListener('click',()=>document.querySelector('#import-file').click());
  document.querySelector('#import-file').addEventListener('change',async e=>{
    const file=e.target.files[0];if(!file)return;
    try{let text=(await file.text()).trim();if(text.startsWith('/*'))text=text.replace(/^\/\*[\s\S]*?\*\//,'').trim();if(text.startsWith('window.SITE_CONTENT'))text=text.replace(/^window\.SITE_CONTENT\s*=\s*/,'').replace(/;\s*$/,'');const imported=JSON.parse(text);const errors=validate(imported);if(errors.length)throw new Error(errors.join(' '));draft=imported;selected=draft.publications[0]?.id;save();render();feedback('已导入内容。请先预览，再导出与上传。');}catch(err){feedback('导入失败：'+err.message,true);}e.target.value='';
  });
  document.querySelector('#restore-button').addEventListener('click',()=>document.querySelector('#confirm-dialog').showModal());
  document.querySelector('#cancel-restore').addEventListener('click',()=>document.querySelector('#confirm-dialog').close());
  document.querySelector('#confirm-restore').addEventListener('click',()=>{draft=clone(published);selected=draft.publications[0]?.id;save();document.querySelector('#confirm-dialog').close();render();feedback('已恢复为当前 content.js 的内容。');});
  render();
})();
