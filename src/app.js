/* Dupedia — app logic (ported from the design canvas). */
class DCLogic{constructor(p){this.props=p||{};}setState(){}forceUpdate(){}}
let PICKS=[],THUMBS=[],CLEAN=[],FAM=[],NOTES=[],DBN=0,DBV=[],PIDX=[],PINFO=[],HASIMG=[],SHOP=[];
const PH_COL={floral:'#F7A9BE',powdery:'#F7A9BE',fruity:'#F7A9BE',citrus:'#FAE27A',green:'#DCE989',woody:'#E3C9A4',smoky:'#D8C3A8',amber:'#FBA672',gourmand:'#FBC48E',aromatic:'#8ED0F7',aquatic:'#8ED0F7',unknown:'#E9DFC9'};
function placeholder(f){const c=PH_COL[f]||PH_COL.unknown;const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240"><rect width="200" height="240" fill="'+c+'"/><rect x="62" y="96" width="76" height="104" rx="16" fill="#FFF8EC"/><rect x="86" y="70" width="28" height="30" rx="6" fill="#2672CF"/><rect x="74" y="140" width="52" height="30" rx="4" fill="'+c+'"/></svg>';return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg);}
// Photos shown on the floating cards when the app opens, so they can load first.
export function heroImages(){const seen={};return CLEAN.filter(function(k){if(!HASIMG[k]||seen[THUMBS[k]])return false;seen[THUMBS[k]]=1;return true;}).map(function(k){return{k:k,url:THUMBS[k]};});}
// Cards for the opening deck: the photo side and a branded back.
export function deckFront(k){return card('deck'+k,k);}
export function deckBack(k){const v=VAR[FAM[k]],o=shapePath(v,0,0,100,134,12),i=shapePath(v,6,6,94,128,8);
  return '<svg viewBox="0 0 100 134" width="100%" height="100%" style="display:block;overflow:visible">'+(v==='tag'?'<path d="M50 15C47 4 40 -6 33 -12" fill="none" stroke="#4A3322" stroke-width=".9" stroke-linecap="round"/>':'')+
  '<path fill-rule="evenodd" d="'+o+'" fill="#8ED0F7" stroke="#2368D0" stroke-width="2"/><path fill-rule="evenodd" d="'+i+'" fill="none" stroke="#2368D0" stroke-opacity=".45" stroke-width="1.2" stroke-dasharray="3 3"/>'+
  '<g transform="translate(26 44) scale(.48)"><path d="'+SC+'" fill="#2672CF"/><rect x="34" y="40" width="32" height="38" rx="9" fill="#F5F1E2"/><rect x="38" y="26" width="24" height="16" rx="5" fill="#123C84"/><circle cx="44" cy="56" r="3.4" fill="#123C84"/><circle cx="56" cy="56" r="3.4" fill="#123C84"/></g></svg>';}
// A photo that failed or timed out falls back to the colored bottle placeholder.
export function useFallback(k){THUMBS[k]=placeholder(FAM[k]);}
export function setData(d){PICKS=d.picks;FAM=d.fam;NOTES=d.notes;PINFO=d.pinfo;DBV=d.dbv;DBN=d.n;SHOP=d.shop||[];PIDX=d.picks.map(function(_,i){return i;});CLEAN=d.clean;HASIMG=d.img.map(Boolean);THUMBS=d.img.map(function(u,i){return u||placeholder(FAM[i]);});}

function rng(seed){let a=seed>>>0;return function(){a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function mul(a,b){const r=new Array(9);for(let i=0;i<3;i++)for(let j=0;j<3;j++)r[i*3+j]=a[i*3]*b[j]+a[i*3+1]*b[3+j]+a[i*3+2]*b[6+j];return r;}
function rotY(a){const c=Math.cos(a),s=Math.sin(a);return[c,0,s,0,1,0,-s,0,c];}
function rotX(a){const c=Math.cos(a),s=Math.sin(a);return[1,0,0,0,c,-s,0,s,c];}
const GLASS=[["#D8A24A","#9C6A1F"],["#CFCAC0","#8F8A7E"],["#2F4B80","#1B2D52"],["#E8A8A2","#B96F69"],["#86A084","#4F6B50"],["#3A322C","#1E1915"],["#E9E3D6","#C9BFA8"],["#B9573B","#7E3322"]];
const CAPS=["#B8955A","#1F1B18","#A67B52","#EFEAE0","#C4C5C1","#6B4A2E"];
function bottle(id,shape,gi,ci){
  const g=GLASS[gi],c=CAPS[ci];
  const S=[
    {el:'<path d="M22 64Q22 58 28 58H72Q78 58 78 64V146Q78 152 72 152H28Q22 152 22 146Z"/>',top:58,nw:16,cap:'cyl',lab:[34,92,32,28]},
    {el:'<circle cx="50" cy="108" r="42"/>',top:66,nw:14,cap:'ball',lab:[36,96,28,24]},
    {el:'<path d="M32 46H68Q72 46 72 50V148Q72 152 68 152H32Q28 152 28 148V50Q28 46 32 46Z"/>',top:46,nw:0,cap:'cyl2',lab:[36,84,28,34]},
    {el:'<path d="M16 80L34 56H66L84 80V148Q84 154 78 154H22Q16 154 16 148Z"/>',top:56,nw:14,cap:'cube',lab:[32,104,36,26]},
    {el:'<path d="M8 98Q8 84 22 84H78Q92 84 92 98V144Q92 154 82 154H18Q8 154 8 144Z"/>',top:84,nw:18,cap:'cyl',lab:[28,108,44,24]},
    {el:'<ellipse cx="50" cy="102" rx="31" ry="50"/>',top:52,nw:12,cap:'dome',lab:[38,92,24,28]}
  ][shape];
  const T=S.top;
  let cap,capTop;
  if(S.cap==='cyl'){capTop=T-44;cap='<rect x="36" y="'+capTop+'" width="28" height="36" rx="3"/>';}
  else if(S.cap==='cyl2'){capTop=T-30;cap='<rect x="38" y="'+capTop+'" width="24" height="30" rx="2"/>';}
  else if(S.cap==='ball'){capTop=T-31;cap='<circle cx="50" cy="'+(T-16)+'" r="15"/>';}
  else if(S.cap==='cube'){capTop=T-36;cap='<rect x="34" y="'+capTop+'" width="32" height="30" rx="3"/>';}
  else{capTop=T-36;cap='<path d="M36 '+(T-6)+'Q36 '+capTop+' 50 '+capTop+'Q64 '+capTop+' 64 '+(T-6)+'Z"/>';}
  const add=function(el,a){return el.replace(/^<(\w+)/,'<$1 '+a);};
  const L=S.lab, lvl=T+(152-T)*(0.12+((id*37)%30)/100);
  const neck=S.nw?'<rect x="'+(50-S.nw/2)+'" y="'+(T-10)+'" width="'+S.nw+'" height="14" fill="'+g[0]+'" fill-opacity=".55" stroke="rgba(30,24,18,.28)" stroke-width="1"/>':'';
  const html='<svg viewBox="0 0 100 160" width="100%" height="100%" style="display:block;overflow:visible;filter:drop-shadow(0 12px 12px rgba(60,40,20,.2))">'+
   '<defs><linearGradient id="s'+id+'" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>'+
   '<linearGradient id="l'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+g[0]+'"/><stop offset="1" stop-color="'+g[1]+'"/></linearGradient>'+
   '<clipPath id="k'+id+'">'+S.el+'</clipPath></defs>'+
   neck+add(S.el,'fill="'+g[0]+'" fill-opacity=".3"')+
   '<rect x="0" y="'+lvl+'" width="100" height="160" fill="url(#l'+id+')" clip-path="url(#k'+id+')"/>'+
   '<rect x="'+L[0]+'" y="'+L[1]+'" width="'+L[2]+'" height="'+L[3]+'" fill="#F6F2E9" fill-opacity=".93" clip-path="url(#k'+id+')"/>'+
   '<rect x="'+(L[0]+4)+'" y="'+(L[1]+6)+'" width="'+(L[2]-8)+'" height="1.6" fill="#2A2118" fill-opacity=".6"/><rect x="'+(L[0]+4)+'" y="'+(L[1]+L[3]-9)+'" width="'+(L[2]*.45)+'" height="1.2" fill="#2A2118" fill-opacity=".4"/>'+
   add(S.el,'fill="url(#s'+id+')"')+
   '<rect x="27" y="'+(T+8)+'" width="4" height="'+((152-T)*.62)+'" rx="2" fill="#fff" fill-opacity=".55" clip-path="url(#k'+id+')"/>'+
   add(S.el,'fill="none" stroke="rgba(30,24,18,.3)" stroke-width="1"')+
   add(cap,'fill="'+c+'"')+add(cap,'fill="url(#s'+id+')"')+
   '</svg>';
  return {html:html,capTop:capTop};
}
function wireSearch(inp,list,sel,rowHtml,onChoose){
  let res=[],act=-1;
  function score(p,q){const n=p[0].toLowerCase(),b=p[1].toLowerCase();if(n.startsWith(q))return 100;if(n.split(/\s+/).some(function(w){return w.startsWith(q);}))return 80;if(n.includes(q))return 60;if(b.startsWith(q))return 50;if(b.includes(q))return 40;return 0;}
  function render(){list.innerHTML=res.map(function(p,i){return rowHtml(p,i,i===act);}).join('');list.style.display=res.length?'block':'none';}
  function choose(p){inp.value=p[0];res=[];render();sel.style.display='flex';sel.querySelector('[data-n]').textContent=p[0]+' — '+p[1];if(onChoose)onChoose(p);}
  inp.addEventListener('input',function(){const q=inp.value.trim().toLowerCase();sel.style.display='none';if(!q){res=[];render();return;}res=PICKS.map(function(p){return[score(p,q),p];}).filter(function(x){return x[0];}).sort(function(a,b){return b[0]-a[0];}).slice(0,8).map(function(x){return x[1];});act=res.length?0:-1;render();});
  inp.addEventListener('keydown',function(e){if(e.key==='ArrowDown'){act=Math.min(res.length-1,act+1);render();e.preventDefault();}else if(e.key==='ArrowUp'){act=Math.max(0,act-1);render();e.preventDefault();}else if(e.key==='Enter'&&res[act]){choose(res[act]);}else if(e.key==='Escape'){res=[];render();}});
  list.addEventListener('mousedown',function(e){const r=e.target.closest('[data-i]');if(r){e.preventDefault();choose(res[+r.getAttribute('data-i')]);}});
}
function measureZones(root,els){
  if(!root)return[];const rr=root.getBoundingClientRect();const sc=rr.width/(root.clientWidth||rr.width)||1;const z=[];
  els.forEach(function(el){if(!el)return;const b=el.getBoundingClientRect();if(!b.width)return;z.push({x0:(b.left-rr.left)/sc,y0:(b.top-rr.top)/sc,x1:(b.right-rr.left)/sc,y1:(b.bottom-rr.top)/sc});});
  return z;
}
function hits(z,cx,cy,hw,hh,pad){for(let j=0;j<z.length;j++){const q=z[j];if(cx+hw>q.x0-pad&&cx-hw<q.x1+pad&&cy+hh>q.y0-pad&&cy-hh<q.y1+pad)return true;}return false;}

const N=92,DRIFT=Math.PI*2/110,W=1440,H=900;
const DOTS=["#F8DF63","#F78B4E","#7FC3EC","#F9A8A0","#E9DFC3","#D9E67F","#2B7BD1"];
const NOTE=["#F8DF63","#D9E67F","#F9A8A0","#7FC3EC"];
const TONE={blue:["#8ED0F7","#2368D0"],pink:["#F7A9BE","#D14D87"],orange:["#FBA672","#EA6A2E"],lime:["#DCE989","#93AE2E"],yellow:["#FAE27A","#D9A91A"],brown:["#EBDDC4","#4A3322"]};
const CHIPS=[["Vanilla","yellow"],["Oud","brown"],["Rose","pink"],["Bergamot","lime"],["Musk","pink"],["Amber","orange"],["Jasmine","blue"],["Sandalwood","brown"],["Citrus","yellow"],["Tonka","orange"],["Patchouli","blue"],["Iris","blue"],["Pear","lime"],["Coconut","pink"],["Saffron","orange"],["Cedar","brown"],["Fig","pink"],["Tea","lime"]];
const SC="M98.5 50.0L98.4 50.8L98.1 51.7L97.6 52.5L96.9 53.3L96.1 54.0L95.1 54.7L94.1 55.4L93.1 56.1L92.1 56.7L91.1 57.2L90.2 57.8L89.5 58.4L88.9 59.0L88.4 59.6L88.2 60.2L88.1 60.9L88.1 61.7L88.4 62.5L88.8 63.3L89.2 64.3L89.8 65.3L90.4 66.3L90.9 67.4L91.5 68.5L91.9 69.5L92.3 70.6L92.4 71.6L92.5 72.6L92.3 73.5L92.0 74.2L91.5 74.9L90.8 75.5L90.0 75.9L89.0 76.3L87.9 76.5L86.7 76.7L85.5 76.8L84.3 76.8L83.1 76.8L82.0 76.8L80.9 76.9L80.0 77.0L79.2 77.2L78.5 77.5L77.9 77.9L77.5 78.5L77.2 79.2L77.0 80.0L76.9 80.9L76.8 82.0L76.8 83.1L76.8 84.3L76.8 85.5L76.7 86.7L76.5 87.9L76.3 89.0L75.9 90.0L75.5 90.8L74.9 91.5L74.2 92.0L73.5 92.3L72.6 92.5L71.6 92.4L70.6 92.3L69.5 91.9L68.5 91.5L67.4 90.9L66.3 90.4L65.3 89.8L64.3 89.2L63.3 88.8L62.5 88.4L61.7 88.1L60.9 88.1L60.2 88.2L59.6 88.4L59.0 88.9L58.4 89.5L57.8 90.2L57.2 91.1L56.7 92.1L56.1 93.1L55.4 94.1L54.7 95.1L54.0 96.1L53.3 96.9L52.5 97.6L51.7 98.1L50.8 98.4L50.0 98.5L49.2 98.4L48.3 98.1L47.5 97.6L46.7 96.9L46.0 96.1L45.3 95.1L44.6 94.1L43.9 93.1L43.3 92.1L42.8 91.1L42.2 90.2L41.6 89.5L41.0 88.9L40.4 88.4L39.8 88.2L39.1 88.1L38.3 88.1L37.5 88.4L36.7 88.8L35.7 89.2L34.7 89.8L33.7 90.4L32.6 90.9L31.5 91.5L30.5 91.9L29.4 92.3L28.4 92.4L27.4 92.5L26.5 92.3L25.8 92.0L25.1 91.5L24.5 90.8L24.1 90.0L23.7 89.0L23.5 87.9L23.3 86.7L23.2 85.5L23.2 84.3L23.2 83.1L23.2 82.0L23.1 80.9L23.0 80.0L22.8 79.2L22.5 78.5L22.1 77.9L21.5 77.5L20.8 77.2L20.0 77.0L19.1 76.9L18.0 76.8L16.9 76.8L15.7 76.8L14.5 76.8L13.3 76.7L12.1 76.5L11.0 76.3L10.0 75.9L9.2 75.5L8.5 74.9L8.0 74.2L7.7 73.5L7.5 72.6L7.6 71.6L7.7 70.6L8.1 69.5L8.5 68.5L9.1 67.4L9.6 66.3L10.2 65.3L10.8 64.3L11.2 63.3L11.6 62.5L11.9 61.7L11.9 60.9L11.8 60.2L11.6 59.6L11.1 59.0L10.5 58.4L9.8 57.8L8.9 57.2L7.9 56.7L6.9 56.1L5.9 55.4L4.9 54.7L3.9 54.0L3.1 53.3L2.4 52.5L1.9 51.7L1.6 50.8L1.5 50.0L1.6 49.2L1.9 48.3L2.4 47.5L3.1 46.7L3.9 46.0L4.9 45.3L5.9 44.6L6.9 43.9L7.9 43.3L8.9 42.8L9.8 42.2L10.5 41.6L11.1 41.0L11.6 40.4L11.8 39.8L11.9 39.1L11.9 38.3L11.6 37.5L11.2 36.7L10.8 35.7L10.2 34.7L9.6 33.7L9.1 32.6L8.5 31.5L8.1 30.5L7.7 29.4L7.6 28.4L7.5 27.4L7.7 26.5L8.0 25.7L8.5 25.1L9.2 24.5L10.0 24.1L11.0 23.7L12.1 23.5L13.3 23.3L14.5 23.2L15.7 23.2L16.9 23.2L18.0 23.2L19.1 23.1L20.0 23.0L20.8 22.8L21.5 22.5L22.1 22.1L22.5 21.5L22.8 20.8L23.0 20.0L23.1 19.1L23.2 18.0L23.2 16.9L23.2 15.7L23.2 14.5L23.3 13.3L23.5 12.1L23.7 11.0L24.1 10.0L24.5 9.2L25.1 8.5L25.7 8.0L26.5 7.7L27.4 7.5L28.4 7.6L29.4 7.7L30.5 8.1L31.5 8.5L32.6 9.1L33.7 9.6L34.7 10.2L35.7 10.8L36.7 11.2L37.5 11.6L38.3 11.9L39.1 11.9L39.8 11.8L40.4 11.6L41.0 11.1L41.6 10.5L42.2 9.8L42.8 8.9L43.3 7.9L43.9 6.9L44.6 5.9L45.3 4.9L46.0 3.9L46.7 3.1L47.5 2.4L48.3 1.9L49.2 1.6L50.0 1.5L50.8 1.6L51.7 1.9L52.5 2.4L53.3 3.1L54.0 3.9L54.7 4.9L55.4 5.9L56.1 6.9L56.7 7.9L57.2 8.9L57.8 9.8L58.4 10.5L59.0 11.1L59.6 11.6L60.2 11.8L60.9 11.9L61.7 11.9L62.5 11.6L63.3 11.2L64.3 10.8L65.3 10.2L66.3 9.6L67.4 9.1L68.5 8.5L69.5 8.1L70.6 7.7L71.6 7.6L72.6 7.5L73.5 7.7L74.2 8.0L74.9 8.5L75.5 9.2L75.9 10.0L76.3 11.0L76.5 12.1L76.7 13.3L76.8 14.5L76.8 15.7L76.8 16.9L76.8 18.0L76.9 19.1L77.0 20.0L77.2 20.8L77.5 21.5L77.9 22.1L78.5 22.5L79.2 22.8L80.0 23.0L80.9 23.1L82.0 23.2L83.1 23.2L84.3 23.2L85.5 23.2L86.7 23.3L87.9 23.5L89.0 23.7L90.0 24.1L90.8 24.5L91.5 25.1L92.0 25.7L92.3 26.5L92.5 27.4L92.4 28.4L92.3 29.4L91.9 30.5L91.5 31.5L90.9 32.6L90.4 33.7L89.8 34.7L89.2 35.7L88.8 36.7L88.4 37.5L88.1 38.3L88.1 39.1L88.2 39.8L88.4 40.4L88.9 41.0L89.5 41.6L90.2 42.2L91.1 42.8L92.1 43.3L93.1 43.9L94.1 44.6L95.1 45.3L96.1 46.0L96.9 46.7L97.6 47.5L98.1 48.3L98.4 49.2L98.5 50.0Z";
function flower(t){const c=TONE[t],P=[0,45,90,135,180,225,270,315].map(function(a){return '<ellipse cx="50" cy="23" rx="12.5" ry="20" transform="rotate('+a+' 50 50)"/>';}).join('');return '<svg viewBox="-8 -8 116 116" width="100%" height="100%" style="display:block;overflow:visible"><g fill="'+c[1]+'" stroke="'+c[1]+'" stroke-width="7" stroke-linejoin="round">'+P+'</g><g fill="'+c[0]+'">'+P+'</g><circle cx="50" cy="50" r="9" fill="'+c[1]+'"/></svg>';}
function badge(id,t){const c=TONE[t];return '<div class="spin" style="width:100%;height:100%"><svg viewBox="0 0 100 100" width="100%" height="100%" style="display:block;overflow:visible"><path d="'+SC+'" fill="'+c[0]+'" stroke="'+c[1]+'" stroke-width="4" stroke-linejoin="round"/><defs><path id="'+id+'" d="M50 50m-28 0a28 28 0 1 1 56 0a28 28 0 1 1 -56 0"/></defs><text font-size="9.5" font-weight="700" fill="#4A3322" letter-spacing="1.6" font-family="Rubik,sans-serif"><textPath href="#'+id+'" textLength="172" lengthAdjust="spacing">WHICH ONE? · PICK ONE ·</textPath></text><g fill="#4A3322">'+[0,60,120,180,240,300].map(function(a){return '<ellipse cx="50" cy="40" rx="3.6" ry="7" transform="rotate('+a+' 50 50)"/>';}).join('')+'</g><circle cx="50" cy="50" r="3.4" fill="'+c[0]+'"/></svg></div>';}
function radial(n,r,a){const p=[];for(let i=0;i<=240;i++){const t=i/240*Math.PI*2,rr=r+a*Math.cos(n*t);p.push((.5+rr*Math.cos(t)).toFixed(3)+' '+(.5+rr*Math.sin(t)).toFixed(3));}return 'M'+p.join('L')+'Z';}
const LABEL={unknown:'Perfume',floral:'Floral',woody:'Woody',citrus:'Citrus',aquatic:'Aquatic',amber:'Amber',smoky:'Smoky',green:'Green',aromatic:'Aromatic',fruity:'Fruity',gourmand:'Gourmand',powdery:'Powdery'};
const VAR={unknown:'pillow',floral:'scallop',woody:'arch',citrus:'wave',aquatic:'wave',amber:'ticket',smoky:'ticket',green:'tag',aromatic:'tag',fruity:'pillow',gourmand:'pillow',powdery:'pillow'};
const DOT={unknown:'#CDBFA6',floral:'#E8738A',woody:'#A0673F',citrus:'#F2C14E',aquatic:'#2B7BD1',amber:'#F78B4E',smoky:'#4A3322',green:'#9BB33B',aromatic:'#7FC3EC',fruity:'#D4457D',gourmand:'#C98A4B',powdery:'#E8B4C0'};
function f1(n){return Math.round(n*100)/100;}
function shapePath(v,x0,y0,x1,y1,rb){
  const W=x1-x0;let top,yR;
  if(v==='arch'){const r=W/2;top='M'+x0+' '+f1(y0+r)+'A'+f1(r)+' '+f1(r)+' 0 0 1 '+x1+' '+f1(y0+r);yR=y0+r;}
  else if(v==='scallop'){const n=5,bw=W/n,ry=bw/2*.85;top='M'+x0+' '+f1(y0+ry);for(let k=1;k<=n;k++)top+='A'+f1(bw/2)+' '+f1(ry)+' 0 0 1 '+f1(x0+bw*k)+' '+f1(y0+ry);yR=y0+ry;}
  else if(v==='wave'){const a=W*.04,b=y0+a;top='M'+x0+' '+f1(b);for(let k=1;k<=40;k++){const t=k/40;top+='L'+f1(x0+W*t)+' '+f1(b-a*Math.sin(t*Math.PI*4));}yR=b;}
  else if(v==='ticket'){const r=W*.14;top='M'+x0+' '+f1(y0+r)+'A'+f1(r)+' '+f1(r)+' 0 0 0 '+f1(x0+r)+' '+y0+'H'+f1(x1-r)+'A'+f1(r)+' '+f1(r)+' 0 0 0 '+x1+' '+f1(y0+r);yR=y0+r;}
  else if(v==='tag'){const c=W*.22;top='M'+x0+' '+f1(y0+c)+'L'+f1(x0+c)+' '+y0+'H'+f1(x1-c)+'L'+x1+' '+f1(y0+c);yR=y0+c;}
  else{const r=W*.3;top='M'+x0+' '+f1(y0+r)+'A'+f1(r)+' '+f1(r)+' 0 0 1 '+f1(x0+r)+' '+y0+'H'+f1(x1-r)+'A'+f1(r)+' '+f1(r)+' 0 0 1 '+x1+' '+f1(y0+r);yR=y0+r;}
  const bot=rb>0?('V'+(y1-rb)+'A'+rb+' '+rb+' 0 0 1 '+(x1-rb)+' '+y1+'H'+(x0+rb)+'A'+rb+' '+rb+' 0 0 1 '+x0+' '+(y1-rb)):('V'+y1+'H'+x0);
  let d=top+bot+'Z';
  if(v==='tag')d+='M54.5 15A4.5 4.5 0 1 0 45.5 15A4.5 4.5 0 1 0 54.5 15Z';
  return d;
}
function card(id,k){
  const fam=FAM[k],v=VAR[fam],p=PICKS[k];let nm=p[0];if(nm.length>16)nm=nm.slice(0,15)+'…';
  const outer=shapePath(v,0,0,100,134,12),inner=shapePath(v,5,5,95,104,0);
  return '<svg viewBox="0 0 100 134" width="100%" height="100%" style="display:block;overflow:visible">'+
   (v==='tag'?'<path d="M50 15C47 4 40 -6 33 -12" fill="none" stroke="#4A3322" stroke-width=".9" stroke-linecap="round"/>':'')+
   '<defs><clipPath id="cc'+id+'"><path clip-rule="evenodd" d="'+inner+'"/></clipPath></defs>'+
   '<path fill-rule="evenodd" d="'+outer+'" fill="#FFFDF4"/>'+
   '<image href="'+THUMBS[k]+'" x="5" y="0" width="90" height="104" preserveAspectRatio="xMidYMid slice" clip-path="url(#cc'+id+')"/>'+
   '<text x="9" y="117" font-family="Rubik,sans-serif" font-weight="700" font-size="8.6" letter-spacing="-.2" fill="#4A3322">'+nm.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</text>'+
   '<circle cx="11.6" cy="125.6" r="2.6" fill="'+DOT[fam]+'"/>'+
   '<text x="17" y="127.8" font-family="Rubik,sans-serif" font-weight="500" font-size="6.2" letter-spacing=".4" fill="#4A3322" fill-opacity=".7">'+LABEL[fam].toUpperCase()+'</text>'+
   '</svg>';
}
const UL='<svg aria-hidden="true" style="position:absolute;left:-2%;bottom:-14px;width:104%;height:24px;overflow:visible" viewBox="0 0 300 24" preserveAspectRatio="none"><path class="ul" d="M3 15C58 5 112 19 160 10S258 6 297 13" fill="none" stroke="#F78B4E" stroke-width="7" stroke-linecap="round" pathLength="100"></path></svg>';
function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');}
function wordsHTML(t){return t.split(' ').map(function(w){return '<span class="w" style="display:inline-block">'+esc(w)+'</span>';}).join(' ');}
// Offset of the centered 1440×900 composition inside the full-window scene.
function frame(self){return{x:(self.root.clientWidth-1440)/2,y:(self.root.clientHeight-900)/2};}
const EASE='cubic-bezier(.2,.8,.2,1)',SPRING='cubic-bezier(.3,1.35,.45,1)';
const Step2={
  rootPt:function(self,el){const rr=self.root.getBoundingClientRect(),sc=rr.width/(self.root.clientWidth||rr.width)||1,b=el.getBoundingClientRect();return{x:(b.left+b.width/2-rr.left)/sc,y:(b.top+b.height/2-rr.top)/sc,w:b.width/sc,h:b.height/sc,sc:sc};},
  setHead:function(self,l1,l2){self.h1.innerHTML=wordsHTML(l1)+'<br><span style="position:relative;display:inline-block">'+wordsHTML(l2)+UL+'</span>';},
  swapHead:function(self,l1,l2,done,size){
    const ws=[].slice.call(self.h1.querySelectorAll('.w')),ul=self.h1.querySelector('.ul');
    ws.forEach(function(w,i){w.animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(-.5em)',opacity:0}],{duration:260,delay:i*30,easing:'cubic-bezier(.5,0,.9,.4)',fill:'forwards'});});
    if(ul)ul.animate([{strokeDasharray:'100 100',strokeDashoffset:0},{strokeDasharray:'100 100',strokeDashoffset:-100}],{duration:300,easing:'ease-in',fill:'forwards'});
    setTimeout(function(){
      self.h1.style.display='block';self.h1.style.fontSize=(size||94)+'px';Step2.setHead(self,l1,l2);
      const nw=[].slice.call(self.h1.querySelectorAll('.w'));
      nw.forEach(function(w,i){w.animate([{transform:'translateY(.6em)',opacity:0},{transform:'translateY(0)',opacity:1}],{duration:520,delay:i*45,easing:SPRING,fill:'backwards'});});
      const u=self.h1.querySelector('.ul');u.animate([{strokeDasharray:'100 100',strokeDashoffset:100},{strokeDasharray:'100 100',strokeDashoffset:0}],{duration:620,delay:nw.length*45+120,easing:EASE,fill:'backwards'});
      if(done)done();
    },260+ws.length*30);
  },
  flip:function(el,base,mid){
    el.animate([{transform:'perspective(900px) '+base+' rotateX(0deg)'},{transform:'perspective(900px) '+base+' rotateX(90deg)'}],{duration:170,easing:'ease-in'}).onfinish=function(){mid();el.animate([{transform:'perspective(900px) '+base+' rotateX(-90deg)'},{transform:'perspective(900px) '+base+' rotateX(0deg)'}],{duration:320,easing:SPRING});};
  },
  slotHTML:function(i){return '<div style="position:absolute;inset:0;border-radius:16px 16px 12px 12px;border:2px dashed #CDBFA6;background:#FFFBF0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:#4A3322"><span style="position:absolute;left:10px;top:8px;font-size:12px;font-weight:600;opacity:.5">0'+(i+1)+'</span><span style="width:30px;height:30px;border-radius:50%;border:1.5px solid #4A3322;display:flex;align-items:center;justify-content:center;font-size:20px;line-height:1;font-weight:400">+</span><span style="font-size:12px;font-weight:500;opacity:.75">'+(i===0?'Add a favorite':'Add another')+'</span></div>';},
  go:function(self){
    if(self.step!==1||!self.chosen)return;self.step=2;
    const p=self.chosen,k=PICKS.indexOf(p);
    // 1. lift the chosen card from the search note to the top-left
    const from=Step2.rootPt(self,self.note);
    const pin=document.createElement('div');pin.setAttribute('data-nodrag','1');
    pin.style.cssText='position:absolute;left:64px;top:70px;width:300px;height:250px;z-index:2100;pointer-events:auto';
    const nt=(NOTES[k]||'').split(',').map(function(s){return s.trim();}).filter(Boolean).slice(0,3).join(' · ');
    pin.innerHTML='<div style="position:absolute;left:0;top:0;width:150px;height:201px;transform:rotate(-6deg);filter:drop-shadow(0 14px 16px rgba(74,51,34,.24))">'+card('pin',k)+'<i class="tape" style="left:50%;top:-8px"></i></div>'+
      '<div style="position:absolute;left:138px;top:150px;width:168px;padding:14px 14px 12px;background:#8ED0F7;border-radius:12px;transform:rotate(4deg);box-shadow:0 0 0 2.5px #2368D0;color:#4A3322;font-family:Rubik,sans-serif">'+
      '<div style="font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;opacity:.7">You\'re considering</div>'+
      '<div style="font-size:19px;font-weight:600;letter-spacing:-.03em;line-height:1.05;margin-top:6px">'+esc(p[0])+'</div>'+
      '<div style="font-size:12px;font-weight:500;margin-top:3px;opacity:.75">'+esc(p[1])+'</div>'+
      (nt?'<div style="font-size:12px;margin-top:8px;line-height:1.3">'+esc(nt)+'</div>':'')+
      '<a href="#" data-back="1" style="display:inline-block;margin-top:10px;font-size:12px;font-weight:600;color:#4A3322;text-decoration:underline;text-underline-offset:3px">Change</a></div>';
    self.root.appendChild(pin);self.pin=pin;
    pin.querySelector('[data-back]').addEventListener('click',function(e){e.preventDefault();Step2.back(self);});
    const dx=from.x-(64+75),dy=from.y-(70+100);
    pin.firstChild.animate([{transform:'translate('+dx+'px,'+dy+'px) scale(.55) rotate(4deg)'},{transform:'translate('+(dx*.5)+'px,'+(dy*.5-120)+'px) scale(1.12) rotate(-14deg)',offset:.45},{transform:'translate(0,0) scale(1) rotate(-6deg)'}],{duration:950,easing:EASE});
    pin.lastChild.animate([{transform:'translate(-30px,30px) rotate(-12deg) scale(.4)',opacity:0},{transform:'rotate(4deg) scale(1)',opacity:1}],{duration:520,delay:720,easing:SPRING,fill:'backwards'});
    // 2. hide the Continue row, pulse the sphere
    self.sel.style.display='none';self.speed=5;
    self.field.style.transition='opacity 900ms '+EASE;self.field.style.opacity='.22';
    // 3. headline + pill
    Step2.swapHead(self,'Now, up to five','you love.');
    setTimeout(function(){Step2.flip(self.pill,'',function(){self.pill.textContent='Step 2 of 3';});},180);
    // 4. lift the stage so slots fit, flip the search note
    self.stage.style.transition='transform 900ms '+EASE;self.stage.style.transform='translateY(-96px)';
    setTimeout(function(){Step2.flip(self.note,'rotate(-1.2deg)',function(){self.inp.value='';self.inp.placeholder='Add a perfume you love';});},280);
    // 5. slots pop in one by one
    setTimeout(function(){
      self.slots.style.display='flex';
      self.slotEls.forEach(function(s,i){s.innerHTML=Step2.slotHTML(i);s.animate([{transform:'translateY(30px) scale(.6) rotate('+(i%2?6:-6)+'deg)',opacity:0},{transform:'none',opacity:1}],{duration:520,delay:i*70,easing:SPRING,fill:'backwards'});});
      setTimeout(function(){self.inp.focus();},500);
    },560);
  },
  add:function(self,p){
    const k=PICKS.indexOf(p);
    if(p===self.chosen||self.favs.indexOf(p)>=0||self.favs.length>=5){self.note.animate([{transform:'rotate(-1.2deg) translateX(0)'},{transform:'rotate(-1.2deg) translateX(-8px)'},{transform:'rotate(-1.2deg) translateX(8px)'},{transform:'rotate(-1.2deg) translateX(0)'}],{duration:280});self.inp.value='';return;}
    self.inp.value='';self.sel.style.display='none';
    const i=self.favs.length;self.favs.push(p);const slot=self.slotEls[i];
    const from=Step2.rootPt(self,self.note),to=Step2.rootPt(self,slot);
    const c=document.createElement('div');c.style.cssText='position:absolute;inset:-2px;cursor:pointer;filter:drop-shadow(0 10px 12px rgba(74,51,34,.22))';c.title='Remove';
    c.innerHTML=card('fav'+(self.favId++),k);
    slot.appendChild(c);
    c.animate([{transform:'translate('+(from.x-to.x)+'px,'+(from.y-to.y)+'px) scale(.7) rotate(-8deg)'},{transform:'translate('+((from.x-to.x)*.4)+'px,'+((from.y-to.y)*.4-60)+'px) scale(1.1) rotate(6deg)',offset:.5},{transform:'none'}],{duration:760,easing:EASE});
    c.addEventListener('click',function(){Step2.remove(self,p);});
    Step2.updateGo(self);
  },
  remove:function(self,p){
    const i=self.favs.indexOf(p);if(i<0)return;self.favs.splice(i,1);
    const c=self.slotEls[i].lastChild;
    c.animate([{transform:'none'},{transform:'scale(0) rotate(20deg)'}],{duration:240,easing:'ease-in'}).onfinish=function(){
      self.slotEls.forEach(function(s,j){s.innerHTML=Step2.slotHTML(j);});
      const keep=self.favs.slice();self.favs=[];keep.forEach(function(q){const kk=PICKS.indexOf(q),j=self.favs.length;self.favs.push(q);const cc=document.createElement('div');cc.style.cssText='position:absolute;inset:-2px;cursor:pointer;filter:drop-shadow(0 10px 12px rgba(74,51,34,.22))';cc.innerHTML=card('fav'+(self.favId++),kk);cc.addEventListener('click',function(){Step2.remove(self,q);});self.slotEls[j].appendChild(cc);});
      Step2.updateGo(self);
    };
  },
  updateGo:function(self){
    const on=self.favs.length>0,was=self.go.style.display!=='none';
    if(on&&!was){self.go.style.display='inline-flex';self.go.animate([{transform:'translateX(-50%) scale(.6)',opacity:0},{transform:'translateX(-50%) scale(1)',opacity:1}],{duration:480,easing:SPRING});}
    if(!on&&was)self.go.style.display='none';
    self.go.firstChild.textContent=self.favs.length>=5?'Find my match':'Find my match ('+self.favs.length+'/5)';
  },
  back:function(self){
    if(self.step!==2)return;self.step=1;self.favs=[];
    const pin=self.pin;pin.animate([{transform:'none',opacity:1},{transform:'translate(-40px,-30px) scale(.6) rotate(-20deg)',opacity:0}],{duration:360,easing:'ease-in'}).onfinish=function(){pin.remove();};
    self.slotEls.forEach(function(s,i){s.animate([{transform:'none',opacity:1},{transform:'translateY(20px) scale(.6)',opacity:0}],{duration:260,delay:i*40,easing:'ease-in',fill:'forwards'});});
    self.go.style.display='none';
    setTimeout(function(){self.slots.style.display='none';self.slotEls.forEach(function(s){s.innerHTML='';s.getAnimations().forEach(function(a){a.cancel();});});},520);
    self.stage.style.transform='translateY(0)';
    self.field.style.opacity='1';
    Step2.swapHead(self,'Which perfume are','you considering?');
    Step2.flip(self.pill,'',function(){self.pill.textContent='Step 1 of 3';});
    setTimeout(function(){Step2.flip(self.note,'rotate(-1.2deg)',function(){self.inp.value='';self.inp.placeholder='Search a name, house or note';});},200);
    self.chosen=null;
  }
};
function thumb(k){
  const v=VAR[FAM[k]],o=shapePath(v,0,0,100,120,16),inn=shapePath(v,7,7,93,113,11);
  return '<svg viewBox="0 0 100 120" width="100%" height="100%" style="display:block;overflow:visible"><defs><clipPath id="tc'+k+'"><path clip-rule="evenodd" d="'+inn+'"/></clipPath></defs><path fill-rule="evenodd" d="'+o+'" fill="#FFFDF4"/><image href="'+THUMBS[k]+'" x="7" y="0" width="86" height="113" preserveAspectRatio="xMidYMid slice" clip-path="url(#tc'+k+')"/></svg>';
}
function rowHTML(p,i,on){const k=PICKS.indexOf(p),f=FAM[k];return '<div class="row'+(on?' on':'')+'" data-i="'+i+'"><span class="th">'+thumb(k)+'</span><span class="tx"><b>'+esc(p[0])+'</b><small>'+esc(p[1])+'</small></span><span class="fm"><i style="background:'+DOT[f]+'"></i>'+LABEL[f]+'</span></div>';}
const AXES=["fresh", "warm", "sweet", "floral", "dry"];
/* ---------- Matching (content-based, see research notes) ---------- */
const W_NOTE=.45,W_FAM=.35,W_CHR=.20;
function dd(a,b){let s=0;for(let i=0;i<a.length;i++)s+=a[i]*b[i];return s/10000;}
function profileOf(list){
  const note=new Map(),emb=new Array(16).fill(0);let fam=null,chr=null,nf=0,nc=0;
  list.forEach(function(i){const v=DBV[i];
    for(let k=0;k<v[0].length;k++)note.set(v[0][k],(note.get(v[0][k])||0)+v[1][k]/100);
    for(let k=0;k<16;k++)emb[k]+=v[2][k];
    if(v[3]){fam=fam||new Array(v[3].length).fill(0);for(let k=0;k<v[3].length;k++)fam[k]+=v[3][k];nf++;}
    if(v[4]){chr=chr||new Array(v[4].length).fill(0);for(let k=0;k<v[4].length;k++)chr[k]+=v[4][k];nc++;}
  });
  let n=0;note.forEach(function(x){n+=x*x;});n=Math.sqrt(n)||1;note.forEach(function(x,k){note.set(k,x/n);});
  const un=function(a){if(!a)return null;let m=0;for(let i=0;i<a.length;i++)m+=a[i]*a[i];m=Math.sqrt(m);return m?a.map(function(x){return x/m*100;}):null;};
  return{note:note,emb:un(emb),fam:un(fam),chr:un(chr)};
}
function simTo(i,P){
  const v=DBV[i];let ns=0;for(let k=0;k<v[0].length;k++){const x=P.note.get(v[0][k]);if(x)ns+=x*v[1][k]/100;}
  const note=.6*ns+.4*(P.emb?dd(v[2],P.emb):0);let num=W_NOTE*note,den=W_NOTE;
  if(v[3]&&P.fam){num+=W_FAM*dd(v[3],P.fam);den+=W_FAM;}
  if(v[4]&&P.chr){num+=W_CHR*dd(v[4],P.chr);den+=W_CHR;}
  return num/den;
}
function runMatch(consPick,favPicks){
  const F=favPicks.map(function(k){return PIDX[k];}),c=PIDX[consPick];
  const cen=profileOf(F),singles=F.map(function(i){return profileOf([i]);});
  const score=function(i){let mx=0,arg=0;singles.forEach(function(P,j){const s=simTo(i,P);if(s>mx){mx=s;arg=j;}});return{s:.5*simTo(i,cen)+.5*mx,near:arg,nearSim:mx};};
  const me=score(c);let below=0,n=0;
  for(let i=0;i<DBN;i++){if(i===c||F.indexOf(i)>=0)continue;n++;if(score(i).s<me.s)below++;}
  const pct=Math.round(below/n*100);
  // shortlist alternatives (picks we have photos for)
  const alts=[];PIDX.forEach(function(di,k){if(k===consPick||favPicks.indexOf(k)>=0||!HASIMG[k])return;const s=score(di).s;if(s>me.s)alts.push([s,k]);});
  alts.sort(function(a,b){return b[0]-a[0];});
  return{pct:pct,n:n+F.length+1,near:favPicks[me.near],nearSim:me.nearSim,alts:alts.slice(0,2).map(function(a){return a[1];})};
}
/* ---------- Text: rules + templates, no AI ---------- */
function joinList(a){if(a.length<=1)return a.join('');return a.slice(0,-1).join(', ')+' and '+a[a.length-1];}
function pickVar(arr,seed){return arr[Math.abs(seed)%arr.length];}
function lc(s){return s.toLowerCase();}
function buildText(consPick,favPicks,m){
  const C=PINFO[consPick],seed=consPick*7+favPicks.length,favKeys={};
  favPicks.forEach(function(k){PINFO[k].n.forEach(function(x){favKeys[x[1]]=1;});});
  const shared=C.n.filter(function(x){return favKeys[x[1]];}).sort(function(a,b){return b[2]-a[2];}).slice(0,3).map(function(x){return x[0];});
  const fresh=C.n.filter(function(x){return !favKeys[x[1]];}).sort(function(a,b){return (b[3]==='b')-(a[3]==='b')||b[2]-a[2];}).map(function(x){return x[0];});
  let v;
  if(m.pct>=80)v=['A great match','for you.'];else if(m.pct>=60)v=['Pretty close','to your taste.'];else if(m.pct>=40)v=['A bit of','a gamble.'];else v=['Probably not','your style.'];
  const near=PICKS[m.near][0];
  const nearLine=m.nearSim>.55?pickVar(['Almost a sibling of your '+near+'.','Very close to your '+near+'.'],seed):pickVar(['Most like your '+near+'.','Closest to your '+near+'.'],seed);
  const sharedLine=shared.length?pickVar(["You'll recognize "+lc(joinList(shared))+'.','It shares '+lc(joinList(shared))+' with your favorites.'],seed):'No notes in common with your favorites, so this is new territory.';
  const newLine=fresh.length===0?'Nothing here you haven\'t worn before.':fresh.length>3?'Lots of new notes, including '+lc(joinList(fresh.slice(0,2)))+'.':lc(joinList(fresh.slice(0,3))).replace(/^./,function(x){return x.toUpperCase();})+(fresh.length>1?' are':' is')+' new to you.';
  // contrast from family + character attributes
  let contrast=m.pct>=60?'Very much in line with what you already wear.':m.pct>=40?'A little different from what you usually wear.':'Quite different from what you usually wear.';
  const withA=favPicks.filter(function(k){return PINFO[k].has;});
  if(C.has&&withA.length){
    const avg=AXES.map(function(_,j){return withA.reduce(function(s,k){return s+PINFO[k].a[j];},0)/withA.length;});
    let bj=-1,bd=0;AXES.forEach(function(_,j){const dlt=C.a[j]-avg[j];if(Math.abs(dlt)>Math.abs(bd)){bd=dlt;bj=j;}});
    const PH={fresh:['Fresher and lighter than what you usually wear.','Less fresh than your usual picks.'],warm:['Warmer and cozier than your usual.','Cooler and lighter than your usual.'],sweet:['Sweeter than what you usually wear.','Less sweet than your usual.'],floral:['More floral than your usual.','Less floral than your usual.'],dry:['Drier and smokier than your usual.','Softer and less smoky than your usual.']};
    if(bj>=0&&Math.abs(bd)>=.18)contrast=PH[AXES[bj]][bd>0?0:1];else if(m.pct>=60)contrast='Very much in line with what you already wear.';
  }
  // taste profile
  const fc={};favPicks.forEach(function(k){PINFO[k].f.forEach(function(f){fc[f]=(fc[f]||0)+1;});});
  const fam=Object.keys(fc).sort(function(a,b){return fc[b]-fc[a];}).slice(0,3);
  const tasteLine=fam.length?'You lean '+lc(joinList(fam.slice(0,2)))+'.':'Your favorites are hard to pin down, in a good way.';
  return{verdict:v,score:'Closer to your taste than '+m.pct+'% of the '+m.n.toLocaleString('en-US')+' perfumes we know.',nearLine:nearLine,sharedLine:sharedLine,shared:shared,fresh:fresh.slice(0,3),newLine:newLine,contrast:contrast,fam:fam.map(function(f){return[f,fc[f]];}),tasteLine:tasteLine,
    altLine:m.alts.length?'Want something even closer?':'Nothing in our shortlist beats it.'};
}
/* ---------- Step 3 scene ---------- */
const FAMTONE={Floral:'pink','Soft floral':'pink',Citrus:'yellow',Green:'lime',Woody:'brown',Amber:'orange',Smoky:'brown',Aromatic:'blue',Fruity:'pink',Gourmand:'orange',Powdery:'pink',Aquatic:'blue',Mossy:'lime','Soft amber':'orange'};
function chip(t,tone,dashed){const c=TONE[tone]||TONE.brown;return '<span style="display:inline-flex;align-items:center;height:30px;padding:0 12px;border-radius:9px;font-size:14px;font-weight:500;color:#4A3322;'+(dashed?'background:#FFFBF0;border:1.5px dashed '+c[1]:'background:'+c[0]+';box-shadow:0 0 0 1.5px '+c[1])+'">'+esc(t)+'</span>';}
const Step3={
  go:function(self){
    if(!self.favs.length||!self.chosen||self.thinking)return;
    const cons=PICKS.indexOf(self.chosen),fk=self.favs.map(function(p){return PICKS.indexOf(p);});
    const m=runMatch(cons,fk),T=buildText(cons,fk,m);self.step=3;self.result={cons:cons,fk:fk};
    // 1. clear step-2 furniture
    [self.box,self.go].forEach(function(el){el.style.transition='opacity 320ms ease-in, translate 320ms ease-in';el.style.opacity='0';el.style.translate='0 40px';el.style.pointerEvents='none';});
    self.slotEls.forEach(function(s,i){s.style.transition='opacity 380ms ease-in '+(i*45)+'ms, transform 380ms ease-in '+(i*45)+'ms';s.style.opacity='0';s.style.transform='translateY(60px) scale(.5) rotate('+(i%2?8:-8)+'deg)';});
    Step3.think(self,cons,fk,m,function(){Step3.reveal(self,cons,fk,m,T);});
  },
  think:function(self,cons,fk,m,done){
    self.thinking=true;self.field.style.opacity='.55';self.tspeed=9;self.speed=3;
    Step2.swapHead(self,'Finding your','match…',null,74);
    setTimeout(function(){Step2.flip(self.pill,'',function(){self.pill.textContent='Thinking…';});},160);
    const notes={};fk.forEach(function(k){PINFO[k].n.forEach(function(x){notes[x[1]]=x;});});
    const nl=Object.keys(notes).map(function(k){return notes[k];}).sort(function(a,b){return b[2]-a[2];});
    const top3=lc(joinList(nl.slice(0,3).map(function(x){return x[0];})));
    const tk=document.createElement('div');tk.setAttribute('data-nodrag','1');tk.setAttribute('data-frame','470');const fo=frame(self);
    tk.style.cssText='position:absolute;width:1440px;left:'+fo.x+'px;top:'+(470+fo.y)+'px;z-index:2200;display:flex;flex-direction:column;align-items:center;gap:22px;font-family:Rubik,sans-serif;color:#4A3322;pointer-events:none';
    tk.innerHTML='<div style="display:flex;align-items:center;gap:18px"><span data-t="c" style="width:64px;height:77px;filter:drop-shadow(0 6px 8px rgba(74,51,34,.22))">'+thumb(cons)+'</span><span style="font-size:15px;font-weight:600;opacity:.6">vs</span><span style="display:flex;gap:10px">'+fk.map(function(k){return '<span data-t="f" style="width:50px;height:60px;filter:drop-shadow(0 4px 6px rgba(74,51,34,.2))">'+thumb(k)+'</span>';}).join('')+'</span></div>'+
      '<div style="display:flex;align-items:center;gap:12px;height:30px"><span class="spin" style="width:28px;height:28px;animation-duration:2.4s">'+flower('blue')+'</span><span data-t="s" style="font-size:21px;font-weight:500;letter-spacing:-.01em;display:inline-block"></span></div>'+
      '<div data-t="n" style="font-size:14px;font-weight:500;opacity:.6;font-variant-numeric:tabular-nums">&nbsp;</div>';
    self.root.appendChild(tk);
    const st=tk.querySelector('[data-t="s"]'),cn=tk.querySelector('[data-t="n"]'),fs=[].slice.call(tk.querySelectorAll('[data-t="f"]'));
    const pop=function(el,d){el.animate([{transform:'translateY(18px) scale(.7)',opacity:0},{transform:'none',opacity:1}],{duration:480,delay:d,easing:SPRING,fill:'backwards'});};
    pop(tk.querySelector('[data-t="c"]'),80);fs.forEach(function(f,i){pop(f,160+i*70);});
    const say=function(t){st.animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(-14px)',opacity:0}],{duration:160,easing:'ease-in'}).onfinish=function(){st.textContent=t;st.animate([{transform:'translateY(14px)',opacity:0},{transform:'none',opacity:1}],{duration:320,easing:SPRING});};};
    st.textContent='Reading your '+fk.length+' favorite'+(fk.length>1?'s':'')+'…';
    fs.forEach(function(f,i){setTimeout(function(){f.animate([{transform:'scale(1)'},{transform:'scale(1.18) rotate(-4deg)'},{transform:'scale(1)'}],{duration:360,easing:EASE});},500+i*170);});
    const t2=600+fk.length*170;
    setTimeout(function(){say('Mapping '+nl.length+' notes, like '+top3+'…');},t2);
    setTimeout(function(){say('Comparing with '+DBN.toLocaleString('en-US')+' perfumes…');const t0=performance.now();const roll=function(now){const k=Math.min(1,(now-t0)/1300),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;cn.textContent=Math.round(DBN*e).toLocaleString('en-US')+' / '+DBN.toLocaleString('en-US')+' checked';if(k<1)requestAnimationFrame(roll);};requestAnimationFrame(roll);},t2+1000);
    setTimeout(function(){say('Weighing families and character…');},t2+2450);
    setTimeout(function(){say('Got it.');self.tspeed=1;},t2+3250);
    setTimeout(function(){tk.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(20px) scale(.96)'}],{duration:320,easing:'ease-in',fill:'forwards'}).onfinish=function(){tk.remove();};self.thinking=false;done();},t2+3700);
  },
  reveal:function(self,cons,fk,m,T){
    self.field.style.opacity='.08';
    self.stage.style.transform='translateY(-150px)';
    // 2. headline + pill
    Step2.swapHead(self,T.verdict[0],T.verdict[1],null,74);
    setTimeout(function(){Step2.flip(self.pill,'',function(){self.pill.textContent='Step 3 of 3';});},160);
    // 3. result layer
    const res=document.createElement('div');res.setAttribute('data-nodrag','1');res.setAttribute('data-frame','0');self.res=res;const fo=frame(self);
    res.style.cssText='position:absolute;width:1440px;height:900px;left:'+fo.x+'px;top:'+fo.y+'px;z-index:2200;pointer-events:none;font-family:Rubik,sans-serif;color:#4A3322';
    const tone=m.pct>=60?'blue':m.pct>=40?'orange':'pink',bt=TONE[tone];
    const SC2=radial(12,.44,.04);
    res.innerHTML=
      '<div data-r="hero" style="position:absolute;left:92px;top:150px;width:236px;height:316px;transform:rotate(-5deg);filter:drop-shadow(0 16px 18px rgba(74,51,34,.24))">'+card('hero',cons)+'<i class="tape" style="left:50%;top:-8px"></i></div>'+
      '<div data-r="badge" style="position:absolute;left:1136px;top:96px;width:220px;height:220px">'+
        '<svg viewBox="0 0 100 100" width="100%" height="100%" style="display:block;overflow:visible"><path d="'+SC2.replace(/[\d.]+ [\d.]+/g,function(p){const a=p.split(' ');return (a[0]*100).toFixed(1)+' '+(a[1]*100).toFixed(1);})+'" fill="'+bt[0]+'" stroke="'+bt[1]+'" stroke-width="2.5" stroke-linejoin="round"/></svg>'+
        '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center"><span data-r="num" style="font-size:66px;font-weight:600;letter-spacing:-.05em;line-height:1">0%</span><span style="font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-top:4px">match</span></div></div>'+
      '<div data-r="score" style="position:absolute;left:360px;right:360px;top:336px;text-align:center;font-size:19px;font-weight:500">'+esc(T.score)+'<div style="font-size:16px;font-weight:400;opacity:.75;margin-top:6px">'+esc(T.contrast)+'</div></div>'+
      '<div style="position:absolute;left:350px;top:426px;width:740px;display:flex;gap:20px;align-items:flex-start">'+
        '<div data-r="n1" style="flex:1;background:#FAE27A;border-radius:10px;padding:18px 18px 16px;transform:rotate(-1.5deg);box-shadow:0 2px 0 rgba(74,51,34,.14);min-height:200px;box-sizing:border-box">'+
          '<div style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;opacity:.7">'+(m.pct>=60?'Why it fits':'Closest link')+'</div>'+
          '<div style="display:flex;gap:12px;align-items:center;margin-top:10px"><span style="width:52px;height:62px;flex:none;filter:drop-shadow(0 3px 4px rgba(74,51,34,.2))">'+thumb(m.near)+'</span><span style="font-size:18px;font-weight:600;letter-spacing:-.02em;line-height:1.1">'+esc(T.nearLine)+'</span></div>'+
          '<div style="font-size:14px;margin-top:12px;line-height:1.35">'+esc(T.sharedLine)+'</div>'+
          '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">'+T.shared.map(function(s){return chip(s,'yellow');}).join('')+'</div></div>'+
        '<div data-r="n2" style="flex:1;background:#FFFBF0;border-radius:10px;padding:18px 18px 16px;transform:rotate(1.2deg);box-shadow:0 2px 0 rgba(74,51,34,.14);min-height:200px;box-sizing:border-box">'+
          '<div style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;opacity:.7">What\'s different</div>'+
          '<div style="font-size:18px;font-weight:600;letter-spacing:-.02em;line-height:1.15;margin-top:10px">'+esc(T.newLine)+'</div>'+
          '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">'+T.fresh.map(function(s){return chip(s,'orange',true);}).join('')+'</div></div>'+
        '<div data-r="n3" style="flex:1;background:#DCE989;border-radius:10px;padding:18px 18px 16px;transform:rotate(-.8deg);box-shadow:0 2px 0 rgba(74,51,34,.14);min-height:200px;box-sizing:border-box">'+
          '<div style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;opacity:.7">Your taste</div>'+
          '<div style="font-size:18px;font-weight:600;letter-spacing:-.02em;line-height:1.15;margin-top:10px">'+esc(T.tasteLine)+'</div>'+
          '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">'+T.fam.map(function(f){return chip(f[0]+' '+'●'.repeat(f[1]),FAMTONE[f[0]]||'brown');}).join('')+'</div>'+
          '<div style="display:flex;gap:6px;margin-top:14px">'+fk.map(function(k){return '<span style="width:34px;height:41px;filter:drop-shadow(0 2px 3px rgba(74,51,34,.2))">'+thumb(k)+'</span>';}).join('')+'</div></div>'+
      '</div>'+
      '<div data-r="alts" style="position:absolute;left:1132px;top:350px;width:236px;text-align:center"><div style="font-size:15px;font-weight:600;margin-bottom:12px">'+esc(T.altLine)+'</div>'+
        '<div style="display:flex;gap:14px;justify-content:center">'+m.alts.map(function(k){return '<div style="width:104px"><div style="width:104px;height:139px;filter:drop-shadow(0 8px 10px rgba(74,51,34,.2))">'+card('alt'+k,k)+'</div></div>';}).join('')+'</div></div>'+
      '<div data-r="acts" style="position:absolute;left:0;right:0;top:700px;display:flex;justify-content:center;align-items:center;gap:26px;pointer-events:auto">'+
        '<a href="#" data-a="retry" style="background:#8ED0F7;color:#4A3322;font-weight:600;font-size:18px;text-decoration:none;padding:15px 30px;border-radius:999px;box-shadow:0 0 0 2.5px #2368D0">Try another perfume</a>'+
        '<a href="#" data-a="reset" style="color:#4A3322;font-weight:600;font-size:16px;text-underline-offset:4px">Start over</a></div>'+
      '<div data-r="foot" style="position:absolute;left:0;right:0;top:770px;text-align:center;font-size:13px;opacity:.6">Based on notes, families and character. Not a sniff test.</div>';
    self.root.appendChild(res);
    const q=function(n){return res.querySelector('[data-r="'+n+'"]');};
    // hero flies in from the pinned card (or the search note)
    const src=self.pin?self.pin.firstChild:self.note,from=Step2.rootPt(self,src),hero=q('hero');
    const fr=frame(self),tx=from.x-(fr.x+92+118),ty=from.y-(fr.y+150+158),sc0=from.w/236;
    hero.animate([{transform:'translate('+tx+'px,'+ty+'px) scale('+sc0+') rotate(-6deg)'},{transform:'translate('+tx*.4+'px,'+(ty*.4-50)+'px) scale(1.08) rotate(3deg)',offset:.5},{transform:'rotate(-5deg)'}],{duration:900,easing:EASE});
    if(self.pin){const pn=self.pin;pn.animate([{opacity:1},{opacity:0}],{duration:200,fill:'forwards'}).onfinish=function(){pn.remove();};self.pin=null;}
    // pop the rest in
    const pop=function(el,d,rot){if(!el)return;el.animate([{transform:'translateY(26px) scale(.85) rotate('+(rot||0)+'deg)',opacity:0},{transform:el.style.transform||'none',opacity:1}],{duration:560,delay:d,easing:SPRING,fill:'backwards'});};
    pop(q('badge'),520,-20);pop(q('score'),640);pop(q('n1'),760);pop(q('n2'),840);pop(q('n3'),920);pop(q('alts'),1000);pop(q('acts'),1080);pop(q('foot'),1140);
    q('badge').querySelector('svg').animate([{transform:'rotate(-40deg)'},{transform:'rotate(0)'}],{duration:900,delay:520,easing:EASE,fill:'backwards'});
    const num=q('num'),t0=performance.now()+600;
    const count=function(now){const k=Math.min(1,Math.max(0,(now-t0)/900)),e=1-Math.pow(1-k,3);num.textContent=Math.round(m.pct*e)+'%';if(k<1)requestAnimationFrame(count);};requestAnimationFrame(count);
    res.querySelector('[data-a="retry"]').addEventListener('click',function(e){e.preventDefault();Step3.leave(self,false);});
    res.querySelector('[data-a="reset"]').addEventListener('click',function(e){e.preventDefault();Step3.leave(self,true);});
  },
  leave:function(self,reset){
    const res=self.res;self.res=null;
    res.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(30px)'}],{duration:320,easing:'ease-in',fill:'forwards'}).onfinish=function(){res.remove();};
    self.box.style.transition='opacity 420ms ease-out 200ms, translate 520ms '+SPRING+' 200ms';self.box.style.opacity='1';self.box.style.translate='0 0';self.box.style.pointerEvents='auto';
    self.go.style.transition='none';self.go.style.opacity='1';self.go.style.translate='0 0';self.go.style.pointerEvents='auto';self.go.style.display='none';
    self.slotEls.forEach(function(s){s.style.transition='none';s.style.opacity='';s.style.transform='';});
    self.field.style.opacity='1';self.stage.style.transform='translateY(0)';self.chosen=null;
    if(reset){
      self.favs=[];self.step=1;self.slots.style.display='none';self.slotEls.forEach(function(s){s.innerHTML='';});
      Step2.swapHead(self,'Which perfume are','you considering?');
      Step2.flip(self.pill,'',function(){self.pill.textContent='Step 1 of 3';});
      self.inp.placeholder='Search a name, house or note';
    }else{
      self.step=4;self.slots.style.display='none';
      Step2.swapHead(self,'Try another','perfume.');
      Step2.flip(self.pill,'',function(){self.pill.textContent='Your '+self.favs.length+' favorite'+(self.favs.length>1?'s are':' is')+' kept';});
      self.inp.placeholder='Search another perfume to test';
    }
    self.inp.value='';setTimeout(function(){self.inp.focus();},500);
  }
};
function ortho(m){const a=[m[0],m[1],m[2]];let n=Math.hypot(a[0],a[1],a[2]);a[0]/=n;a[1]/=n;a[2]/=n;let b=[m[3],m[4],m[5]];const d=a[0]*b[0]+a[1]*b[1]+a[2]*b[2];b=[b[0]-d*a[0],b[1]-d*a[1],b[2]-d*a[2]];n=Math.hypot(b[0],b[1],b[2]);b=[b[0]/n,b[1]/n,b[2]/n];const c=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];return[a[0],a[1],a[2],b[0],b[1],b[2],c[0],c[1],c[2]];}
export class Component extends DCLogic{
  constructor(props){super(props);this.M=mul(rotX(-0.25),rotY(0.5));this.zones=[];this.speed=1;this.tspeed=1;this.items=[];this.drag=null;}
  componentDidMount(){
    const self=this,r=rng(5),g=Math.PI*(3-Math.sqrt(5));let bid=0,pi=0;
    for(let i=0;i<N;i++){
      const y=1-(i+.5)/N*2,rad=Math.sqrt(1-y*y),th=i*g;
      const el=document.createElement('div');el.className='item';
      const q=r();let w,h,max=1;
      let wash=null,dep=false,ci=-1;
      if(q<.46){
        ci=pi;const k=CLEAN[(pi++*11+3)%CLEAN.length],v=VAR[FAM[k]];
        w=104+r()*14;h=w*1.34;
        el.style.cssText='width:'+w+'px;height:'+h+'px;filter:drop-shadow(0 10px 12px rgba(74,51,34,.2)) drop-shadow(0 1px 1px rgba(74,51,34,.12))';
        el.innerHTML=card(i,k)+((v==='pillow'||v==='wave')&&r()<.5?'<i class="tape"></i>':'');
      }else if(q<.64){
        const c=CHIPS[Math.floor(r()*CHIPS.length)],tn=TONE[c[1]];w=c[0].length*10.5+38;h=38;
        el.style.cssText='width:'+w+'px;height:38px;border-radius:11px;background:'+tn[0]+';color:#4A3322;font-weight:500;font-size:18px;letter-spacing:-.01em;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px '+tn[1]+'';
        el.innerHTML='<span>'+c[0]+'</span><div class="wash" style="position:absolute;inset:0;border-radius:9px;background:#FBF6E9;opacity:0"></div>';wash=el.querySelectorAll('.wash');
      }else if(q<.76){
        w=26+r()*34;h=w;max=.92;dep=true;
        const c1=DOTS[Math.floor(r()*DOTS.length)],c2=DOTS[Math.floor(r()*DOTS.length)];
        w*=1.5;h=w;
        el.innerHTML='<i style="position:absolute;left:0;top:0;width:'+(w*.66)+'px;height:'+(w*.66)+'px;border-radius:50%;background:'+c1+';mix-blend-mode:multiply"></i><i style="position:absolute;right:0;bottom:0;width:'+(w*.52)+'px;height:'+(w*.52)+'px;border-radius:50%;background:'+c2+';mix-blend-mode:multiply"></i>';
        el.style.width=w+'px';el.style.height=h+'px';
      }else if(q<.82){
        dep=true;w=h=60+r()*22;el.style.cssText='width:'+w+'px;height:'+h+'px';el.innerHTML=flower(['pink','blue','orange','lime'][Math.floor(r()*4)]);
      }else if(q<.85){
        dep=true;w=h=96+r()*20;el.style.cssText='width:'+w+'px;height:'+h+'px';el.innerHTML=badge('b'+(bid++),r()<.5?'orange':'blue');
      }else{
        const p=PICKS[Math.floor(r()*PICKS.length)];w=132;h=82;
        el.style.cssText='width:132px;height:82px;border-radius:8px;background:'+NOTE[Math.floor(r()*NOTE.length)]+';box-shadow:0 2px 0 rgba(74,51,34,.14);box-sizing:border-box;padding:13px 10px 8px 26px;overflow:hidden';
        el.innerHTML='<i style="position:absolute;left:9px;top:11px;width:8px;height:8px;border-radius:50%;background:#FBF6E9;box-shadow:inset 0 1px 2px rgba(74,51,34,.4)"></i><i style="position:absolute;left:9px;bottom:11px;width:8px;height:8px;border-radius:50%;background:#FBF6E9;box-shadow:inset 0 1px 2px rgba(74,51,34,.4)"></i><div style="font-family:Rubik,sans-serif;font-weight:600;font-size:16px;line-height:1.02;letter-spacing:-.02em;color:#4A3322">'+p[0]+'</div><div style="font-weight:500;font-size:11px;margin-top:5px;color:#4A3322;opacity:.7">'+p[1]+'</div><div class="wash" style="position:absolute;inset:0;background:#FBF6E9;opacity:0"></div>';wash=el.querySelectorAll('.wash');
      }
      this.field.appendChild(el);
      this.items.push({el:el,wash:wash,dep:dep,k:0,w:w,h:h,max:max,ci:ci,spin:(r()-.5)*160,dl:ci>=0?ci*22:520+r()*520,p:[Math.cos(th)*rad,y,Math.sin(th)*rad],rot:(r()-.5)*(q<.6?30:44),ph:r()*6.28,sp:.2+r()*.3,op:0});
    }
    wireSearch(this.inp,this.list,this.sel,rowHTML,function(p){self.sel.style.display='none';if(self.step===2)Step2.add(self,p);else if(self.step===4){if(self.favs.indexOf(p)>=0){self.inp.value='';return;}self.chosen=p;self.inp.value='';Step3.go(self);}else if(self.step===1){self.chosen=p;Step2.go(self);}});
    this.step=1;this.favs=[];this.favId=0;this.h1=this.ht;this.pill=this.pt;this.pill.textContent='Step 1 of 3';
    this.slotEls=[].slice.call(this.slots.children);
    Step2.setHead(this,'Which perfume are','you considering?');
    this.sel.querySelector('a').addEventListener('click',function(e){e.preventDefault();Step2.go(self);});
    this.go.addEventListener('click',function(e){e.preventDefault();if(self.step===2&&self.favs.length){Step3.go(self);return;}self.go.animate([{transform:'translateX(-50%) scale(1)'},{transform:'translateX(-50%) scale(.94)'},{transform:'translateX(-50%) scale(1)'}],{duration:220});});

    this.inp.addEventListener('focus',function(){self.tspeed=.2;});this.inp.addEventListener('blur',function(){self.tspeed=1;});
    this.root.addEventListener('pointerdown',function(e){if(e.target.closest('[data-nodrag]'))return;self.drag={x:e.clientX,y:e.clientY,t:performance.now()};self.vx=0;self.vy=0;});
    this.mv=function(e){if(!self.drag)return;const now=performance.now(),dx=e.clientX-self.drag.x,dy=e.clientY-self.drag.y,el=Math.max(8,now-self.drag.t)/1000;self.drag={x:e.clientX,y:e.clientY,t:now};self.M=mul(mul(rotX(-dy*.004),rotY(dx*.004)),self.M);self.vx=self.vx*.5+(dx*.004/el)*.5;self.vy=self.vy*.5+(-dy*.004/el)*.5;};
    this.up=function(){if(self.drag&&performance.now()-self.drag.t>90){self.vx=0;self.vy=0;}const cap=7,vm=Math.hypot(self.vx||0,self.vy||0);if(vm>cap){self.vx*=cap/vm;self.vy*=cap/vm;}self.drag=null;};
    window.addEventListener('pointermove',this.mv);window.addEventListener('pointerup',this.up);
    this.eyes=[].slice.call(this.root.querySelectorAll('.sniff-eye'));this.mx0=null;this.blink=0;
    this.look=function(e){self.mx0=[e.clientX,e.clientY];self.aimEyes();};
    this.aimEyes=function(){const b=self.blink>0?' scaleY(.12)':'';self.eyes.forEach(function(el){let x=0,y=0;if(self.mx0){const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=self.mx0[0]-cx,dy=self.mx0[1]-cy,d=Math.hypot(dx,dy)||1,k=Math.min(1,d/160)*13;x=dx/d*k;y=dy/d*k;}el.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)'+b;});};
    window.addEventListener('pointermove',this.look);
    this.blinkT=setInterval(function(){self.blink=1;self.aimEyes();setTimeout(function(){self.blink=0;self.aimEyes();},130);},3800+Math.random()*1500);
    this.last=performance.now();let f=0;
    const tick=function(now){
      const dt=Math.min(.05,(now-self.last)/1000);self.last=now;const t=now/1000;
      self.speed+=(self.tspeed-self.speed)*Math.min(1,dt*3);
      if(!self.drag){const vx=self.vx||0,vy=self.vy||0;self.M=mul(mul(rotX(vy*dt),rotY(vx*dt+DRIFT*dt*self.speed)),self.M);const k=Math.exp(-dt*1.3);self.vx=vx*k;self.vy=vy*k;}
      if(f%90===0)self.M=ortho(self.M);
      if(f++%20===0){self.zones=measureZones(self.root,[self.head,self.box,self.slots,self.go,self.pin]);self.vw=self.root.clientWidth||W;self.vh=self.root.clientHeight||H;}
      // the sphere stretches with the window so the sides are never empty
      const RX=610*Math.max(1,self.vw/W),RY=410*Math.max(1,self.vh/H),cx=self.vw/2,cy=self.vh*.5,m=self.M,ease=Math.min(1,dt*5);
      for(let i=0;i<N;i++){
        const it=self.items[i],p=it.p;
        const x=m[0]*p[0]+m[1]*p[1]+m[2]*p[2],y=m[3]*p[0]+m[4]*p[1]+m[5]*p[2],z=m[6]*p[0]+m[7]*p[1]+m[8]*p[2];
        const d=(z+1)/2,s=.3+.78*d,persp=.85+.15*d,sx=cx+x*RX*persp,sy=cy+y*RY*persp;
        const hit=hits(self.zones,sx,sy,it.w*.5*s,it.h*.5*s,14);
        it.k+=((hit?0:1)-it.k)*Math.min(1,dt*(hit?7:3));
        const op=it.max*(it.dep?(.55+.45*d):1);
        it.op+=(op-it.op)*Math.min(1,dt*4);
        let ss=s*(.001+.999*it.k),px=sx,py=sy,spin=0;
        // Opening deal: cards fly out of the center deck, then everything else pops in.
        if(self.intro){
          const e=Math.min(1,Math.max(0,(now-self.intro-it.dl)/(it.ci>=0?900:520)));
          if(it.ci>=0){const q=1-Math.pow(1-e,3);px=cx+(sx-cx)*q;py=cy+(sy-cy)*q;ss=ss*q+1.25*(1-q)*(e>0?1:0);spin=it.spin*(1-q);}
          else{const c1=1.7,q=e===0?0:1+(c1+1)*Math.pow(e-1,3)+c1*Math.pow(e-1,2);ss*=q;}
          if(it.ci>=0&&e===0)ss=0;
        }
        it.el.style.transform='translate3d('+(px-it.w/2).toFixed(1)+'px,'+(py-it.h/2).toFixed(1)+'px,0) rotate('+(it.rot+spin+Math.sin(t*it.sp+it.ph)*4).toFixed(2)+'deg) scale('+ss.toFixed(3)+')';
        it.el.style.zIndex=String(Math.round(d*1000));
      }
      if(self.intro&&now-self.intro>2600)self.intro=null;
      self.raf=requestAnimationFrame(tick);
    };
    this.raf=requestAnimationFrame(tick);
  }
  componentWillUnmount(){window.removeEventListener('pointermove',this.look);clearInterval(this.blinkT);cancelAnimationFrame(this.raf);window.removeEventListener('pointermove',this.mv);window.removeEventListener('pointerup',this.up);}
  renderVals(){
    const s=this;
    return{setRoot:function(e){if(e)s.root=e;},setField:function(e){if(e)s.field=e;},setHead:function(e){if(e)s.head=e;},setBox:function(e){if(e)s.box=e;},setStage:function(e){if(e)s.stage=e;},setHT:function(e){if(e)s.ht=e;},setPT:function(e){if(e)s.pt=e;},setNote:function(e){if(e)s.note=e;},setSlots:function(e){if(e)s.slots=e;},setGo:function(e){if(e)s.go=e;},setInp:function(e){if(e)s.inp=e;},setList:function(e){if(e)s.list=e;},setSel:function(e){if(e)s.sel=e;}};
  }
}
