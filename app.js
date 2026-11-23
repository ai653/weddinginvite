const W=WEDDING,$=s=>document.querySelector(s),get=(o,p)=>p.split('.').reduce((a,k)=>a&&a[k],o);
let L=localStorage.getItem('lang')||'en',side=location.hash=='#bride'?'bride':'groom';
const first=side=='bride'?'bride':'groom',second=side=='bride'?'groom':'bride';
const nm=(p,l)=>`${p[l]} (${p.nick[l]})`;
function names(l){const a=W[first][l],b=W[second][l],el=$('#names');el.innerHTML='';
 const parts=l=='hi'?[a,'&',b]:[...a,' ','&',' ',...b];
 parts.forEach((t,i)=>{const s=document.createElement('span');s.textContent=t==' '?'\u00a0':t;s.style.animationDelay=(.3+i*(l=='hi'?.35:.06))+'s';el.append(s);if(l=='hi')el.append(' ')})}
const fmt=(d,l)=>new Date(d+'T12:00:00+05:30').toLocaleDateString(l=='hi'?'hi-IN':'en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:W.tz});
function render(){const T=I18N[L];document.documentElement.lang=L;
 document.querySelectorAll('[data-t]').forEach(e=>e.textContent=get(T,e.dataset.t));
 const nn=side=='bride'?[W.bride,W.groom]:[W.groom,W.bride];
 $('#gn').textContent=`${nn[0][L]} & ${nn[1][L]}`;$('#gd').textContent=fmt(W.events[2].date,L);$('#dt').textContent=`${T.shubh} · ${fmt(W.events[2].date,L)} · ${W.city[L]}`;
 $('#seal').textContent=W.monogram[L];$('#mono').innerHTML=W.monogramImg?`<img src="${W.monogramImg}" alt="">`:W.monogram[L];
 $('#lang').textContent=$('#gl').textContent=L=='en'?'हिंदी':'English';names(L);
 $('#cd').innerHTML=['days','hrs','min','sec'].map(k=>`<div><b id="c${k}">0</b>${T[k]}</div>`).join('');
 const tl=$('#tl');tl.innerHTML='<i></i>';
 W.events.forEach(e=>{const t=e.time||T.tba,p=new Date(e.date+'T12:00:00+05:30'),g=e.date.replace(/-/g,'');
  const ttl=T[e.id],loc=W.venue[L],q=encodeURIComponent;
  tl.insertAdjacentHTML('beforeend',`<div class="ev"><h3>${ttl}</h3><div>${fmt(e.date,L)}<br>${t}<br>${loc}${e.dress?`<br>${T.dress}: ${e.dress}`:''}</div>${e.muhurat?`<div class="sm">✦ ${T.muh}</div>`:''}
  <a class="fill" href="${W.maps}" target="_blank">${T.dir}</a><a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${q(ttl)}&dates=${g}/${g}&location=${q(W.venue.en)}" target="_blank">${T.gcal}</a><a href="#" data-ics="${e.id}">${T.ics}</a>${e.muhurat&&W.video?`<a href="#" data-film>${T.film}</a>`:''}</div>`)});
 const g=$('#gal');g.innerHTML='';
 (W.gallery.length?W.gallery:[...Array(6)]).forEach((s,i)=>{const h=[170,230,200,260,190,220][i%6];g.insertAdjacentHTML('beforeend',s?`<img src="${s}" alt="" loading="lazy">`:`<div style="height:${h}px">${T.ph}</div>`)});
 $('#rs').innerHTML=`<h3>${T.rsvp}</h3>`+W.rsvp.map(r=>`<p><a href="tel:+91${r.phone}">${r.name} · ${r.phone}</a></p>`).join('');
 $('#sh').textContent=T.share;$('#cp').textContent=T.copy;$('#pd').textContent=T.pdf}
render();
$('#lang').onclick=$('#gl').onclick=()=>{L=L=='en'?'hi':'en';localStorage.setItem('lang',L);render()};
document.addEventListener('click',e=>{const a=e.target.closest('[data-ics]');if(a){e.preventDefault();const ev=W.events.find(x=>x.id==a.dataset.ics),d=ev.date.replace(/-/g,'');
 const s=`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${I18N.en[ev.id]}\nDTSTART;VALUE=DATE:${d}\nLOCATION:${W.venue.en}\nEND:VEVENT\nEND:VCALENDAR`;
 const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([s],{type:'text/calendar'}));l.download=ev.id+'.ics';l.click()}
 if(e.target.closest('[data-film]')){e.preventDefault();$('#lb').innerHTML=`<video src="${W.video}" controls autoplay style="width:100%;height:100%" onclick="event.stopPropagation()"></video>`;$('#lb').classList.add('on');au.pause()}
 const im=e.target.closest('.gal img');if(im){$('#lb').innerHTML=[...document.querySelectorAll('.gal img')].map(i=>`<img src="${i.src}">`).join('');$('#lb').classList.add('on')}
 if(e.target.id=='lb'){$('#lb').classList.remove('on');$('#lb').innerHTML=''}});
// countdown
setInterval(()=>{let d=Math.max(0,new Date(W.muhurat)-Date.now())/1e3|0;const v={days:d/86400|0,hrs:d%86400/3600|0,min:d%3600/60|0,sec:d%60};for(const k in v){const e=$('#c'+k);if(e)e.textContent=v[k]}},1000);
// music
const au=new Audio(W.music);au.loop=true;au.volume=.5;let want=false;
$('#mus').onclick=()=>{want=au.paused;want?au.play().catch(()=>{}):au.pause()};
document.addEventListener('visibilitychange',()=>{document.hidden?au.pause():want&&au.play().catch(()=>{})});
// gate
$('#go').onclick=()=>{$('#gate').classList.add('open');want=true;au.play().catch(()=>{});burst();setTimeout(()=>$('#gate').remove(),2600)};
// share
$('#sh').onclick=()=>{const u=W.url+(side=='bride'?'#bride':'');navigator.share?navigator.share({title:document.title,url:u}).catch(()=>{}):open('https://wa.me/?text='+encodeURIComponent(document.title+' '+u))};
$('#cp').onclick=async()=>{try{await navigator.clipboard.writeText(location.href);$('#cp').textContent=I18N[L].copied}catch(e){}};
$('#pd').onclick=()=>print();
// scroll thread
addEventListener('scroll',()=>{const t=$('#tl'),r=t.getBoundingClientRect();t.style.setProperty('--p',Math.min(100,Math.max(0,(innerHeight*.6-r.top)/r.height*100))+'%')});
// petals: 3 parallax layers, per-section flower colours, wind on fast scroll
const cv=$('#fx'),cx=cv.getContext('2d'),COL={rose:['#B3202A','#F4F0E4'],genda:['#F2A21B','#E8761A'],lotus:['#E9A7B4','#B85D4B'],pink:['#F2A3C3','#F9D3E2'],ashoka:['#7C9A5B','#F2A21B'],bougain:['#C2306E','#E56BA0'],gold:['#B3202A','#C29B58']};
let P=[],cur='rose',sy=0,wind=0,rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const rs=()=>{cv.width=innerWidth;cv.height=innerHeight};rs();addEventListener('resize',rs);
for(let i=0;i<36;i++)P.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,z:1+i%3,r:Math.random()*6,s:Math.random()+.4});
function burst(){for(let i=0;i<40;i++)P.push({x:Math.random()*innerWidth,y:-20-Math.random()*300,z:2,r:Math.random()*6,s:Math.random()*1.5+1,tmp:1,c:i%2?'#F2A21B':'#B3202A'})}
(function loop(){cx.clearRect(0,0,cv.width,cv.height);
 const dy=scrollY-sy;sy=scrollY;wind=wind*.95+Math.min(Math.abs(dy),40)*.05;
 document.querySelectorAll('section').forEach(s=>{const r=s.getBoundingClientRect();if(r.top<innerHeight/2&&r.bottom>innerHeight/2)cur=s.dataset.f});
 P=P.filter(p=>!p.tmp||p.y<cv.height+30);
 P.forEach(p=>{if(!rm){p.y+=p.s*p.z*.5;p.x+=Math.sin(p.y/60+p.r)*.4+wind*p.z*.3;p.r+=.01*p.z}
  if(p.y>cv.height+20&&!p.tmp){p.y=-20;p.x=Math.random()*cv.width}if(p.x>cv.width+20)p.x=-20;
  cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.globalAlpha=p.tmp?.9:.55;cx.fillStyle=p.c||COL[cur][p.z%2];
  cx.beginPath();cx.ellipse(0,0,3+p.z*2.2,2+p.z*1.4,0,0,7);cx.fill();cx.restore()});
 requestAnimationFrame(loop)})();
