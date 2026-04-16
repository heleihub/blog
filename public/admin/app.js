if(localStorage.getItem('admin_logged_in')!=='true')window.location.href='/admin';

var Q1=null,Q2=null;
var TD=new TurndownService({headingStyle:'atx',codeBlockStyle:'fenced'});
TD.addRule('image',{filter:'img',replacement:function(c,n){var s=n.getAttribute('src')||'',a=n.getAttribute('alt')||'',w=n.getAttribute('width')||'';return'!['+a+']('+s+')'+(w?'{width='+w+'}':'')}});
TD.addRule('video',{filter:'iframe',replacement:function(c,n){var s=n.getAttribute('src')||'';return(s.includes('youtube')||s.includes('vimeo')||s.includes('bilibili'))?'[video]('+s+')':c}});

function h2m(h){return TD.turndown(h)}
function m2h(m){return m?marked.parse(m):''}

function ntc(m,e){
  var el=document.getElementById('ntc');
  el.textContent=m;
  el.className='mb-4 p-3 rounded-lg text-sm border-l-4 '+(e?'bg-red-50 border-red-500 text-red-700':'bg-green-50 border-green-500 text-green-700');
  el.classList.remove('hidden');
  setTimeout(function(){el.classList.add('hidden')},4000);
}

function nav(s){
  document.querySelectorAll('.sec').forEach(function(e){e.classList.add('hidden');e.classList.remove('block')});
  document.querySelectorAll('.sidebar-item').forEach(function(e){e.classList.remove('active')});
  var se=document.getElementById('sec-'+s);
  if(se){se.classList.remove('hidden');se.classList.add('block')}
  var mi=document.querySelector('.sidebar-item[data-s="'+s+'"]');
  if(mi)mi.classList.add('active');
  if(s==='posts')pTab('published');
  if(s==='dashboard')refreshDash();
  if(s==='categories')loadCats();
  if(s==='tags')loadTags();
  if(s==='comments')loadComments();
  if(s==='announcements')loadAnns();
  if(s==='profile')loadProfile();
  if(s==='gh')loadGh();
  var overlay=document.getElementById('sidebar-overlay');
  var sidebar=document.getElementById('sidebar');
  if(window.innerWidth<1024){sidebar.classList.add('-translate-x-full');overlay.classList.add('hidden')}
}

function pTab(t){
  document.querySelectorAll('.ptc').forEach(function(e){e.classList.add('hidden')});
  document.querySelectorAll('.tab-btn').forEach(function(e){e.classList.remove('active')});
  var el=document.getElementById('tab-'+t);
  if(el)el.classList.remove('hidden');
  var tb=document.querySelector('.tab-btn[data-t="'+t+'"]');
  if(tb)tb.classList.add('active');
  if(t==='new')setTimeout(initEd,100);
}

function toggleSidebar(){
  var sidebar=document.getElementById('sidebar');
  var overlay=document.getElementById('sidebar-overlay');
  sidebar.classList.toggle('-translate-x-full');
  overlay.classList.toggle('hidden');
}

function logout(){localStorage.removeItem('admin_logged_in');window.location.href='/admin'}

var svA=localStorage.getItem('admin_avatar')||'https://tu.hexiaoyiok.dpdns.org/1776234509553_9e0u4c_avatar.png';
var svN=localStorage.getItem('admin_nickname')||'XiaoHe';
document.getElementById('pf-avatar').value=svA;
document.getElementById('pv-avatar').src=svA;
document.getElementById('pf-nick').value=svN;
document.getElementById('bar-nick').textContent=svN;
document.getElementById('pf-bio').value=localStorage.getItem('admin_bio')||'热爱生活，热爱分享';
document.getElementById('pf-avatar').addEventListener('input',function(){document.getElementById('pv-avatar').src=this.value});

var ghCfg={owner:localStorage.getItem('gh_owner')||'',repo:localStorage.getItem('gh_repo')||'',branch:localStorage.getItem('gh_branch')||'main',token:localStorage.getItem('gh_token')||'',path:localStorage.getItem('gh_path')||'src/content/posts'};
document.getElementById('gh-owner').value=ghCfg.owner;
document.getElementById('gh-repo').value=ghCfg.repo;
document.getElementById('gh-branch').value=ghCfg.branch;
document.getElementById('gh-token').value=ghCfg.token;
document.getElementById('gh-path').value=ghCfg.path;

function ghApi(method,path,body,sha){
  var h={'Authorization':'token '+ghCfg.token,'Accept':'application/vnd.github.v3+json','Content-Type':'application/json'};
  var opts={method:method,headers:h};
  if(body){var d={message:'Update from admin panel',content:btoa(unescape(encodeURIComponent(body))),branch:ghCfg.branch};if(sha)d.sha=sha;opts.body=JSON.stringify(d)}
  return fetch('https://api.github.com/repos/'+ghCfg.owner+'/'+ghCfg.repo+'/contents/'+path,opts).then(function(r){return r.json()});
}

function ghGet(path){
  return fetch('https://api.github.com/repos/'+ghCfg.owner+'/'+ghCfg.repo+'/contents/'+path+'?ref='+ghCfg.branch,{headers:{'Authorization':'token '+ghCfg.token,'Accept':'application/vnd.github.v3+json'}}).then(function(r){return r.json()});
}

function initEd(){
  if(Q1)return;
  Q1=new Quill('#post-editor',{
    theme:'snow',
    placeholder:'在此输入文章内容...',
    modules:{toolbar:{container:[
      [{header:[1,2,3,4,5,6,false]}],
      [{size:['small',false,'large','huge']}],
      ['bold','italic','underline','strike'],
      [{color:[]},{background:[]}],
      [{align:[]}],
      [{list:'ordered'},{list:'bullet'}],
      ['blockquote','code-block'],
      ['link','image','video'],
      ['clean']
    ],handlers:{image:imageHandler}}}
  });
  Q2=new Quill('#hidden-editor',{
    theme:'snow',
    placeholder:'输入隐藏内容（用户评论后可见）...',
    modules:{toolbar:{container:[
      [{header:[1,2,3,false]}],['bold','italic','underline'],['link','image'],['code-block'],['clean']
    ],handlers:{image:imageHandler}}}
  });
  Q1.root.addEventListener('paste',pasteHandler);
}

function imageHandler(){
  var input=document.createElement('input');
  input.setAttribute('type','file');input.setAttribute('accept','image/*');input.click();
  input.onchange=function(){
    var file=input.files[0];if(!file)return;
    var reader=new FileReader();
    reader.onload=function(e){
      Q1.insertEmbed(Q1.getSelection().index,'image',e.target.result);
    };reader.readAsDataURL(file);
  };
}

function pasteHandler(e){
  var items=e.clipboardData&&e.clipboardData.items;
  if(!items)return;
  for(var i=0;i<items.length;i++){
    if(items[i].type.indexOf('image')!==-1){
      e.preventDefault();
      var file=items[i].getAsFile();
      var reader=new FileReader();
      reader.onload=function(ev){
        Q1.insertEmbed(Q1.getSelection().index,'image',ev.target.result);
      };reader.readAsDataURL(file);return;
    }
  }
}

var allPosts=[];
var allCats=[];
var allTags=[];
var allComments=[];
try{var cmtData=JSON.parse(localStorage.getItem('blog_comments')||'{}');Object.keys(cmtData).forEach(function(slug){(cmtData[slug]||[]).forEach(function(c){allComments.push(Object.assign({},c,{postSlug:slug}))})})}catch(e){}
var allAnns=[];

function refreshDash(){
  fetch('/search.json').then(function(r){return r.json()}).then(function(data){
    allPosts=data;
    var pub=data.length;
    document.getElementById('s-p').textContent=pub;
    document.getElementById('s-pub').textContent=pub;
    document.getElementById('s-d').textContent=0;
    document.getElementById('s-c').textContent=allComments.length;
    document.getElementById('posts-bd').textContent=pub;
    document.getElementById('pub-n').textContent=pub;
    document.getElementById('dra-n').textContent=0;
    var dp=document.getElementById('dash-posts');
    if(data.length===0){dp.innerHTML='<p class="text-gray-400 text-center py-8">暂无文章</p>';return}
    var html='<div class="space-y-3">';
    data.slice(0,5).forEach(function(p){
      html+='<a href="/posts/'+p.slug+'" target="_blank" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">';
      html+='<span class="text-sm font-medium text-gray-800 hover:text-blue-600">'+p.title+'</span>';
      html+='<span class="text-xs text-gray-400">'+(p.date||'')+'</span>';
      html+='</a>';
    });
    html+='</div>';
    dp.innerHTML=html;
    var dc=document.getElementById('dash-comments');
    if(allComments.length===0){dc.innerHTML='<p class="text-gray-400 text-center py-8">暂无评论</p>'}
    else{
      var ch='<div class="space-y-3">';
      allComments.slice(0,5).forEach(function(c){
        ch+='<div class="p-3 rounded-lg bg-gray-50"><div class="flex items-center justify-between mb-1"><span class="text-sm font-medium text-gray-800">'+c.author+'</span><span class="text-xs text-gray-400">'+(c.date||'')+'</span></div><p class="text-xs text-gray-500 line-clamp-2">'+c.content.substring(0,80)+'</p></div>';
      });
      ch+='</div>';
      dc.innerHTML=ch;
    }
    loadPubList();
  }).catch(function(){ntc('加载文章数据失败',true)});
}

function loadPubList(){
  var el=document.getElementById('pub-list');
  if(allPosts.length===0){el.innerHTML='<tr><td colspan="5" class="px-6 py-8 text-center text-gray-400">暂无文章</td></tr>';return}
  var html='';
  allPosts.forEach(function(p){
    html+='<tr class="hover:bg-gray-50 transition-colors">';
    html+='<td class="px-6 py-3"><a href="/posts/'+p.slug+'" target="_blank" class="text-sm font-medium text-blue-600 hover:text-blue-800">'+p.title+'</a></td>';
    html+='<td class="px-6 py-3 text-sm text-gray-500">'+(p.categoryName||p.category||'-')+'</td>';
    html+='<td class="px-6 py-3"><div class="flex flex-wrap gap-1">'+(p.tags||[]).map(function(t){return'<span class="inline-block px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full">'+t+'</span>'}).join('')+'</div></td>';
    html+='<td class="px-6 py-3 text-sm text-gray-500">'+(p.date||'-')+'</td>';
    html+='<td class="px-6 py-3"><div class="flex gap-2">';
    html+='<button onclick="editPost(\''+p.slug+'\')" class="text-sm text-blue-600 hover:text-blue-800 font-medium">编辑</button>';
    html+='<button onclick="delPost(\''+p.slug+'\')" class="text-sm text-red-500 hover:text-red-700 font-medium">删除</button>';
    html+='</div></td></tr>';
  });
  el.innerHTML=html;
}

function editPost(slug){
  if(!ghCfg.token){ntc('请先配置 GitHub 设置',true);nav('gh');return}
  pTab('new');
  document.getElementById('ed-title').textContent='编辑文章';
  document.getElementById('ed-slug').value=slug;
  ghGet(ghCfg.path+'/'+slug+'.md').then(function(r){
    if(r.message){ntc('获取文章失败: '+r.message,true);return}
    document.getElementById('ed-sha').value=r.sha;
    var content=decodeURIComponent(escape(atob(r.content)));
    var fm=content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if(fm){
      var meta=fm[1],body=fm[2];
      var titleM=meta.match(/title:\s*["']?(.+?)["']?\n/);
      var catM=meta.match(/category:\s*["']?(.+?)["']?\n/);
      var tagsM=meta.match(/tags:\s*\[(.+?)\]/);
      var coverM=meta.match(/coverImage:\s*["']?(.+?)["']?\n/);
      var excerptM=meta.match(/excerpt:\s*["']?(.+?)["']?\n/);
      if(titleM)document.getElementById('p-title').value=titleM[1].replace(/['"]/g,'');
      if(catM)document.getElementById('p-cat').value=catM[1].replace(/['"]/g,'');
      if(tagsM)document.getElementById('p-tags').value=tagsM[1].replace(/['"]/g,'');
      if(coverM)document.getElementById('p-cover').value=coverM[1].replace(/['"]/g,'');
      if(excerptM)document.getElementById('p-excerpt').value=excerptM[1].replace(/['"]/g,'');
      var hiddenM=body.match(/<!--hidden-->\n([\s\S]*)<!--\/hidden-->/);
      var mainBody=body.replace(/<!--hidden-->\n[\s\S]*<!--\/hidden-->/,'').trim();
      setTimeout(function(){
        if(Q1)Q1.root.innerHTML=m2h(mainBody);
        if(Q2&&hiddenM)Q2.root.innerHTML=m2h(hiddenM[1]);
      },200);
    }
  }).catch(function(e){ntc('获取文章失败',true)});
}

function delPost(slug){
  if(!confirm('确定要删除这篇文章吗？'))return;
  if(!ghCfg.token){ntc('请先配置 GitHub 设置',true);return}
  ghGet(ghCfg.path+'/'+slug+'.md').then(function(r){
    if(r.message){ntc('获取文章信息失败',true);return}
    return ghApi('DELETE',ghCfg.path+'/'+slug+'.md','',r.sha);
  }).then(function(r){
    if(r&&r.commit){ntc('文章已删除');refreshDash()}else{ntc('删除失败',true)}
  }).catch(function(){ntc('删除失败',true)});
}

function pubPost(publish){
  if(!ghCfg.token){ntc('请先配置 GitHub 设置',true);nav('gh');return}
  var title=document.getElementById('p-title').value.trim();
  if(!title){ntc('请输入文章标题',true);return}
  var cat=document.getElementById('p-cat').value;
  var tags=document.getElementById('p-tags').value.split(',').map(function(t){return t.trim()}).filter(Boolean);
  var cover=document.getElementById('p-cover').value.trim();
  var excerpt=document.getElementById('p-excerpt').value.trim();
  var bodyHtml=Q1?Q1.root.innerHTML:'';
  var bodyMd=h2m(bodyHtml);
  var hiddenHtml=Q2?Q2.root.innerHTML:'';
  var hiddenMd='';
  if(hiddenHtml&&hiddenHtml!=='<p><br></p>'){hiddenMd='\n\n<!--hidden-->\n'+h2m(hiddenHtml)+'\n<!--/hidden-->'}
  var slug=document.getElementById('ed-slug').value||title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g,'-').replace(/^-|-$/g,'');
  var date=new Date().toISOString().split('T')[0];
  var fm='---\ntitle: "'+title+'"\ndate: '+date+'\nauthor: "'+svN+'"\n';
  if(cat)fm+='category: "'+cat+'"\n';
  if(tags.length)fm+='tags: ['+tags.map(function(t){return'"'+t+'"'}).join(', ')+']\n';
  if(cover)fm+='coverImage: "'+cover+'"\n';
  if(excerpt)fm+='excerpt: "'+excerpt+'"\n';
  fm+='draft: '+(publish?'false':'true')+'\n---\n\n';
  var content=fm+bodyMd+hiddenMd;
  var sha=document.getElementById('ed-sha').value;
  var path=ghCfg.path+'/'+slug+'.md';
  ghApi('PUT',path,content,sha||null).then(function(r){
    if(r.commit){ntc(publish?'文章已发布！':'草稿已保存！');document.getElementById('ed-slug').value='';document.getElementById('ed-sha').value='';document.getElementById('p-title').value='';document.getElementById('p-tags').value='';document.getElementById('p-cover').value='';document.getElementById('p-excerpt').value='';if(Q1)Q1.setText('');if(Q2)Q2.setText('');refreshDash()}else{ntc('发布失败: '+(r.message||'未知错误'),true)}
  }).catch(function(){ntc('发布失败',true)});
}

function loadCats(){
  fetch('/search.json').then(function(r){return r.json()}).then(function(posts){
    var catMap={};
    posts.forEach(function(p){if(p.category)catMap[p.category]=p.categoryName||p.category});
    allCats=Object.keys(catMap).map(function(k){return{id:k,name:catMap[k]}});
    var el=document.getElementById('cat-list');
    if(allCats.length===0){el.innerHTML='<tr><td colspan="4" class="px-6 py-8 text-center text-gray-400">暂无分类</td></tr>';return}
    var html='';
    allCats.forEach(function(c){
      html+='<tr class="hover:bg-gray-50 transition-colors">';
      html+='<td class="px-6 py-3 text-sm font-medium text-gray-800">'+c.name+'</td>';
      html+='<td class="px-6 py-3 text-sm text-gray-500">'+c.id+'</td>';
      html+='<td class="px-6 py-3 text-sm text-gray-500">-</td>';
      html+='<td class="px-6 py-3"><button onclick="delCat(\''+c.id+'\')" class="text-sm text-red-500 hover:text-red-700 font-medium">删除</button></td>';
      html+='</tr>';
    });
    el.innerHTML=html;
    var sel=document.getElementById('p-cat');sel.innerHTML='<option value="">选择分类</option>';
    allCats.forEach(function(c){sel.innerHTML+='<option value="'+c.id+'">'+c.name+'</option>'});
  });
}

function addCat(){
  var id=document.getElementById('nc-id').value.trim();
  var name=document.getElementById('nc-name').value.trim();
  var desc=document.getElementById('nc-desc').value.trim();
  if(!id||!name){ntc('请填写分类ID和名称',true);return}
  if(!ghCfg.token){ntc('请先配置 GitHub 设置',true);nav('gh');return}
  ghGet('content/categories.json').then(function(r){
    var cats=[];if(r.content){cats=JSON.parse(decodeURIComponent(escape(atob(r.content))))}
    cats.push({id:id,name:name,description:desc||''});
    return ghApi('PUT','content/categories.json',JSON.stringify(cats,null,2),r.sha||null);
  }).then(function(r){
    if(r&&r.commit){ntc('分类已添加');document.getElementById('add-cat').classList.add('hidden');document.getElementById('nc-id').value='';document.getElementById('nc-name').value='';document.getElementById('nc-desc').value='';loadCats()}else{ntc('添加失败',true)}
  }).catch(function(){ntc('添加失败',true)});
}

function delCat(id){
  if(!confirm('确定删除此分类？'))return;
  if(!ghCfg.token){ntc('请先配置 GitHub 设置',true);return}
  ghGet('content/categories.json').then(function(r){
    var cats=JSON.parse(decodeURIComponent(escape(atob(r.content))));
    cats=cats.filter(function(c){return c.id!==id});
    return ghApi('PUT','content/categories.json',JSON.stringify(cats,null,2),r.sha);
  }).then(function(r){
    if(r&&r.commit){ntc('分类已删除');loadCats()}else{ntc('删除失败',true)}
  }).catch(function(){ntc('删除失败',true)});
}

function loadTags(){
  fetch('/search.json').then(function(r){return r.json()}).then(function(posts){
    var tagSet={};
    posts.forEach(function(p){(p.tags||[]).forEach(function(t){tagSet[t]=t})});
    allTags=Object.keys(tagSet);
    var el=document.getElementById('tag-list');
    if(allTags.length===0){el.innerHTML='<p class="text-gray-400 text-center py-4">暂无标签</p>';return}
    el.innerHTML=allTags.map(function(t){
      return'<span class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"><span>'+t+'</span><button onclick="delTag(\''+t+'\')" class="ml-1 text-blue-400 hover:text-red-500 transition-colors">&times;</button></span>';
    }).join('');
  });
}

function addTag(){
  var id=document.getElementById('nt-id').value.trim();
  var name=document.getElementById('nt-name').value.trim();
  var slug=document.getElementById('nt-slug').value.trim();
  if(!id||!name){ntc('请填写标签ID和名称',true);return}
  if(!ghCfg.token){ntc('请先配置 GitHub 设置',true);nav('gh');return}
  ghGet('content/tags.json').then(function(r){
    var tags=[];if(r.content){tags=JSON.parse(decodeURIComponent(escape(atob(r.content))))}
    tags.push({id:id,name:name,slug:slug||id});
    return ghApi('PUT','content/tags.json',JSON.stringify(tags,null,2),r.sha||null);
  }).then(function(r){
    if(r&&r.commit){ntc('标签已添加');document.getElementById('add-tag').classList.add('hidden');document.getElementById('nt-id').value='';document.getElementById('nt-name').value='';document.getElementById('nt-slug').value='';loadTags()}else{ntc('添加失败',true)}
  }).catch(function(){ntc('添加失败',true)});
}

function delTag(name){
  if(!confirm('确定删除此标签？'))return;
  if(!ghCfg.token){ntc('请先配置 GitHub 设置',true);return}
  ghGet('content/tags.json').then(function(r){
    var tags=JSON.parse(decodeURIComponent(escape(atob(r.content))));
    tags=tags.filter(function(t){return t.id!==name&&t.name!==name});
    return ghApi('PUT','content/tags.json',JSON.stringify(tags,null,2),r.sha);
  }).then(function(r){
    if(r&&r.commit){ntc('标签已删除');loadTags()}else{ntc('删除失败',true)}
  }).catch(function(){ntc('删除失败',true)});
}

function loadComments(){
  var el=document.getElementById('cmt-list');
  if(allComments.length===0){el.innerHTML='<tr><td colspan="5" class="px-6 py-8 text-center text-gray-400">暂无评论</td></tr>';return}
  var html='';
  allComments.forEach(function(c,i){
    html+='<tr class="hover:bg-gray-50 transition-colors">';
    html+='<td class="px-6 py-3 text-sm font-medium text-gray-800">'+c.author+'</td>';
    html+='<td class="px-6 py-3 text-sm text-gray-500">'+c.content.substring(0,50)+'</td>';
    html+='<td class="px-6 py-3 text-sm text-gray-500">'+(c.postSlug||'-')+'</td>';
    html+='<td class="px-6 py-3 text-sm text-gray-500">'+(c.date||'-')+'</td>';
    html+='<td class="px-6 py-3"><button onclick="delCmt('+i+')" class="text-sm text-red-500 hover:text-red-700 font-medium">删除</button></td>';
    html+='</tr>';
  });
  el.innerHTML=html;
}

function delCmt(i){
  if(!confirm('确定删除此评论？'))return;
  var cmt=allComments[i];
  if(!cmt)return;
  var slug=cmt.postSlug;
  var cmtData=JSON.parse(localStorage.getItem('blog_comments')||'{}');
  if(slug&&cmtData[slug]){
    cmtData[slug]=cmtData[slug].filter(function(c){return c.id!==cmt.id});
    if(cmtData[slug].length===0)delete cmtData[slug];
    localStorage.setItem('blog_comments',JSON.stringify(cmtData));
  }
  allComments.splice(i,1);
  loadComments();ntc('评论已删除');
}

function loadAnns(){
  if(!ghCfg.token){renderAnns([]);return}
  ghGet('content/config/announcements.json').then(function(r){
    if(r.content){
      var data=JSON.parse(decodeURIComponent(escape(atob(r.content))));
      allAnns=data.announcements||[];
      renderAnns(allAnns);
    }else{renderAnns([])}
  }).catch(function(){renderAnns([])});
}

function renderAnns(anns){
  var el=document.getElementById('ann-list');
  if(!anns||anns.length===0){el.innerHTML='<tr><td colspan="4" class="px-6 py-8 text-center text-gray-400">暂无公告</td></tr>';return}
  var html='';
  anns.forEach(function(a,i){
    var active=a.active!==false;
    html+='<tr class="hover:bg-gray-50 transition-colors">';
    html+='<td class="px-6 py-3 text-sm text-gray-800">'+(a.content||'').substring(0,80)+'</td>';
    html+='<td class="px-6 py-3"><span class="inline-flex items-center gap-1.5 text-sm"><span class="w-2 h-2 rounded-full '+(active?'bg-green-500':'bg-amber-400')+'"></span>'+(active?'已发布':'未发布')+'</span></td>';
    html+='<td class="px-6 py-3 text-sm text-gray-500">'+(a.publishedAt?a.publishedAt.substring(0,10):'-')+'</td>';
    html+='<td class="px-6 py-3"><div class="flex gap-3">';
    html+='<button onclick="toggleAnn('+i+')" class="text-sm font-medium '+(active?'text-amber-600 hover:text-amber-800':'text-green-600 hover:text-green-800')+'">'+(active?'取消发布':'发布')+'</button>';
    html+='<button onclick="delAnn('+i+')" class="text-sm font-medium text-red-500 hover:text-red-700">删除</button>';
    html+='</div></td></tr>';
  });
  el.innerHTML=html;
}

function addAnn(){
  var content=document.getElementById('na-content').value.trim();
  if(!content){ntc('请输入公告内容',true);return}
  if(!ghCfg.token){ntc('请先配置 GitHub 设置',true);nav('gh');return}
  ghGet('content/config/announcements.json').then(function(r){
    var data={announcements:[]};
    if(r.content){data=JSON.parse(decodeURIComponent(escape(atob(r.content))))}
    data.announcements.push({id:Date.now().toString(),content:content,publishedAt:new Date().toISOString(),active:true});
    return ghApi('PUT','content/config/announcements.json',JSON.stringify(data,null,2),r.sha||null);
  }).then(function(r){
    if(r&&r.commit){ntc('公告已发布');document.getElementById('add-ann').classList.add('hidden');document.getElementById('na-content').value='';loadAnns()}else{ntc('发布失败',true)}
  }).catch(function(){ntc('发布失败',true)});
}

function delAnn(i){
  if(!confirm('确定删除此公告？'))return;
  if(!ghCfg.token){ntc('请先配置 GitHub 设置',true);return}
  ghGet('content/config/announcements.json').then(function(r){
    var data=JSON.parse(decodeURIComponent(escape(atob(r.content))));
    data.announcements.splice(i,1);
    return ghApi('PUT','content/config/announcements.json',JSON.stringify(data,null,2),r.sha);
  }).then(function(r){
    if(r&&r.commit){ntc('公告已删除');loadAnns()}else{ntc('删除失败',true)}
  }).catch(function(){ntc('删除失败',true)});
}

function toggleAnn(i){
  if(!ghCfg.token){ntc('请先配置 GitHub 设置',true);return}
  ghGet('content/config/announcements.json').then(function(r){
    var data=JSON.parse(decodeURIComponent(escape(atob(r.content))));
    if(data.announcements[i]){data.announcements[i].active=!data.announcements[i].active}
    return ghApi('PUT','content/config/announcements.json',JSON.stringify(data,null,2),r.sha);
  }).then(function(r){
    if(r&&r.commit){ntc('公告状态已更新');loadAnns()}else{ntc('更新失败',true)}
  }).catch(function(){ntc('更新失败',true)});
}

function loadProfile(){
  document.getElementById('pf-avatar').value=svA;
  document.getElementById('pv-avatar').src=svA;
  document.getElementById('pf-nick').value=svN;
  document.getElementById('bar-nick').textContent=svN;
  document.getElementById('pf-bio').value=localStorage.getItem('admin_bio')||'热爱生活，热爱分享';
}

function loadGh(){
  document.getElementById('gh-owner').value=ghCfg.owner;
  document.getElementById('gh-repo').value=ghCfg.repo;
  document.getElementById('gh-branch').value=ghCfg.branch;
  document.getElementById('gh-token').value=ghCfg.token;
  document.getElementById('gh-path').value=ghCfg.path;
}

function saveProfile(){
  var avatar=document.getElementById('pf-avatar').value;
  var nick=document.getElementById('pf-nick').value;
  var bio=document.getElementById('pf-bio').value;
  localStorage.setItem('admin_avatar',avatar);
  localStorage.setItem('admin_nickname',nick);
  localStorage.setItem('admin_bio',bio);
  svA=avatar;svN=nick;
  document.getElementById('bar-nick').textContent=nick;
  document.getElementById('pv-avatar').src=avatar;
  ntc('个人资料已保存');
}

function changePw(){
  var cpw=document.getElementById('pf-cpw').value;
  var npw=document.getElementById('pf-npw').value;
  var cpw2=document.getElementById('pf-cpw2').value;
  var saved=localStorage.getItem('admin_password')||'admin123';
  if(cpw!==saved){ntc('当前密码不正确',true);return}
  if(npw!==cpw2){ntc('两次密码不一致',true);return}
  if(npw.length<6){ntc('密码至少6位',true);return}
  localStorage.setItem('admin_password',npw);
  document.getElementById('pf-cpw').value='';
  document.getElementById('pf-npw').value='';
  document.getElementById('pf-cpw2').value='';
  ntc('密码已修改');
}

function saveGh(){
  ghCfg.owner=document.getElementById('gh-owner').value;
  ghCfg.repo=document.getElementById('gh-repo').value;
  ghCfg.branch=document.getElementById('gh-branch').value;
  ghCfg.token=document.getElementById('gh-token').value;
  ghCfg.path=document.getElementById('gh-path').value;
  localStorage.setItem('gh_owner',ghCfg.owner);
  localStorage.setItem('gh_repo',ghCfg.repo);
  localStorage.setItem('gh_branch',ghCfg.branch);
  localStorage.setItem('gh_token',ghCfg.token);
  localStorage.setItem('gh_path',ghCfg.path);
  ntc('GitHub 设置已保存');
}

function testGh(){
  saveGh();
  if(!ghCfg.owner||!ghCfg.repo||!ghCfg.token){ntc('请填写完整的 GitHub 配置',true);return}
  var el=document.getElementById('gh-result');
  el.classList.remove('hidden');
  el.textContent='测试连接中...';
  el.className='mt-4 text-sm text-gray-500';
  fetch('https://api.github.com/repos/'+ghCfg.owner+'/'+ghCfg.repo,{headers:{'Authorization':'token '+ghCfg.token}}).then(function(r){return r.json()}).then(function(d){
    if(d.id){el.textContent='✓ 连接成功！仓库: '+d.full_name;el.className='mt-4 text-sm text-green-600'}
    else{el.textContent='✗ 连接失败: '+(d.message||'未知错误');el.className='mt-4 text-sm text-red-600'}
  }).catch(function(e){el.textContent='✗ 连接失败: '+e.message;el.className='mt-4 text-sm text-red-600'});
}

refreshDash();
