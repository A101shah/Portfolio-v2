(() => {
  'use strict';
  const header=document.querySelector('.site-header');
  const navLinks=[...document.querySelectorAll('#primary-navigation a')];
  const sections=navLinks.map(link=>{const url=new URL(link.href);return url.pathname===location.pathname||url.pathname.endsWith('/index.html')&&location.pathname.endsWith('/')?document.getElementById(url.hash.slice(1)):null;}).filter(Boolean);
  let queued=false;
  function update(){
    header?.classList.toggle('scrolled',scrollY>20);
    let current=null;
    sections.forEach(section=>{if(section.getBoundingClientRect().top<innerHeight*.4)current=section.id;});
    navLinks.forEach(link=>{if(current&&link.hash==='#'+current)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});
    queued=false;
  }
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update);}},{passive:true});
  update();
})();
