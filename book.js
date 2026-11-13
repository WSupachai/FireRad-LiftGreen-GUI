
(function(){
var K='gbook:',R=document.documentElement;
function get(k,d){try{var v=localStorage.getItem(K+k);return v===null?d:v}catch(e){return d}}
function put(k,v){try{localStorage.setItem(K+k,v)}catch(e){}}
var THEMES=['paper','light','dark'],theme=get('theme','paper'),size=parseInt(get('size','19'),10)||19;
function applyTheme(){R.setAttribute('data-theme',theme)}function applySize(){R.style.setProperty('--fs',size+'px')}
applyTheme();applySize();
function done(){try{return JSON.parse(get('done','[]'))}catch(e){return []}}
function $(s){return document.querySelector(s)}
document.addEventListener('DOMContentLoaded',function(){
 var page=document.body.getAttribute('data-page'),total=+document.body.getAttribute('data-total')||0;
 $('#btn-theme').onclick=function(){theme=THEMES[(THEMES.indexOf(theme)+1)%THEMES.length];put('theme',theme);applyTheme()};
 $('#btn-plus').onclick=function(){size=Math.min(30,size+1);put('size',size);applySize()};
 $('#btn-minus').onclick=function(){size=Math.max(13,size-1);put('size',size);applySize()};
 $('#btn-search').onclick=openSearch;
 window.addEventListener('scroll',function(){var h=R.scrollHeight-innerHeight;$('#bar').style.width=(h>0?scrollY/h*100:0)+'%'},{passive:true});
 if(page==='chapter'){
  var n=+$('#btn-done').getAttribute('data-ch');
  put('last',JSON.stringify({f:location.pathname.split('/').pop(),t:$('.ctitle').textContent,n:n}));
  var b=$('#btn-done');function paint(){var on=done().indexOf(n)>-1;b.classList.toggle('on',on);b.textContent=on?'✓ ผ่านด่านนี้แล้ว':'ทำเครื่องหมายว่าผ่านด่านนี้แล้ว'}
  b.onclick=function(){var d=done(),i=d.indexOf(n);if(i>-1)d.splice(i,1);else d.push(n);put('done',JSON.stringify(d));paint()};paint();
  document.querySelectorAll('.content img').forEach(function(im){im.onclick=function(){var l=document.createElement('div');l.className='lb';var x=document.createElement('img');x.src=im.src;l.appendChild(x);l.onclick=function(){l.remove()};document.body.appendChild(l)}});
 }else{
  var d=done();document.querySelectorAll('.toc li').forEach(function(li){if(d.indexOf(+li.getAttribute('data-ch'))>-1)li.classList.add('done')});
  $('#pfill').style.width=(total?d.length/total*100:0)+'%';$('#ptext').textContent='ผ่านแล้ว '+d.length+' / '+total+' บท';
  try{var l=JSON.parse(get('last','null'));if(l){var c=$('#continue');c.hidden=false;c.href=l.f;c.textContent='อ่านต่อ: '+l.t}}catch(e){}
 }
 document.addEventListener('keydown',function(e){
  var t=(e.target.tagName||'').toLowerCase();if(t==='input'||e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==='Escape'){var o=$('#ov');if(o)o.remove();var lb=$('.lb');if(lb)lb.remove();return}
  if(e.key==='/'){e.preventDefault();openSearch();return}
  var a=e.key==='ArrowLeft'?$('a[rel=prev]'):e.key==='ArrowRight'?$('a[rel=next]'):null;if(a)location.href=a.href});
});
function openSearch(){
 if($('#ov'))return;
 var ov=document.createElement('div');ov.id='ov';
 ov.innerHTML='<div class="box"><input id="q" placeholder="ค้นหาในหนังสือ เช่น ชื่อเมือง โปเกม่อน ไอเท็ม…" autocomplete="off"><div id="res"></div></div>';
 ov.onclick=function(e){if(e.target===ov)ov.remove()};document.body.appendChild(ov);
 var q=$('#q'),res=$('#res');q.focus();
 q.oninput=function(){
  res.textContent='';var idx=window.BOOK_INDEX||[],terms=q.value.toLowerCase().split(/\s+/).filter(Boolean);if(!terms.length)return;
  var hits=[];idx.forEach(function(c){var tl=c.t.toLowerCase(),ok=terms.every(function(w){return tl.indexOf(w)>-1||c.x.indexOf(w)>-1});
   if(ok)hits.push({c:c,s:terms.some(function(w){return tl.indexOf(w)>-1})?1:0})});
  hits.sort(function(a,b){return b.s-a.s||a.c.i-b.c.i});
  if(!hits.length){res.textContent='ไม่พบ';return}
  hits.slice(0,40).forEach(function(h){var c=h.c,p=c.x.indexOf(terms[0]),a=document.createElement('a');a.href=c.f;
   var b=document.createElement('b');b.textContent=c.i+'. '+c.t;var s=document.createElement('small');
   if(p>-1){var st=Math.max(0,p-40);s.textContent='…'+c.x.slice(st,p+90)+'…'}a.appendChild(b);a.appendChild(s);res.appendChild(a)})};
}
})();
