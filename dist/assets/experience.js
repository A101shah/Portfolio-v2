(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const progress = document.querySelector('.reading-progress');
  let scrollQueued=false;
  function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;scrollQueued=false;}
  addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateProgress);}},{passive:true});
  updateProgress();
  // Progressive reveal: all content stays visible if JS or observers are unavailable.
  if('IntersectionObserver' in window&&!reduced.matches){
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target);}}),{threshold:.07});
    document.querySelectorAll('.section-heading,.project-card,.approach-grid article,.knowledge-layout,.about-section,.contact-section').forEach(el=>{el.classList.add('reveal-ready');observer.observe(el);});
    reduced.addEventListener('change',e=>{if(e.matches)document.querySelectorAll('.reveal-ready').forEach(el=>el.classList.add('revealed'));});
  }
  const cards=[...document.querySelectorAll('[data-atlas-category]')];
  const search=document.getElementById('project-search');
  const filterButtons=[...document.querySelectorAll('[data-atlas-filter]')];
  let category='all', expanded=false;
  const more=document.getElementById('show-projects');
  function filter(){
    const query=search.value.trim().toLowerCase();
    const matches=cards.filter(card=>(category==='all'||card.dataset.atlasCategory===category)&&card.dataset.search.includes(query));
    const limited=!query&&category==='all'&&!expanded;
    const shown=limited?matches.slice(0,6):matches;
    cards.forEach(card=>{card.hidden=!shown.includes(card);});
    document.getElementById('atlas-count').textContent=limited?`Showing ${shown.length} of ${matches.length} projects`:`${matches.length} project${matches.length===1?'':'s'} to explore`;
    document.querySelector('.atlas-empty').hidden=matches.length!==0;
    if(more){more.hidden=!!query||category!=='all';more.textContent=expanded?'Show fewer projects ↑':'Explore all 13 projects ↓';more.setAttribute('aria-expanded',String(expanded));}
  }
  more?.addEventListener('click',()=>{expanded=!expanded;filter();if(expanded){const firstNew=cards[6]?.querySelector('[data-project]');firstNew?.focus({preventScroll:true});}else document.getElementById('atlas').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});});
  if(search)filter();
  search?.addEventListener('input',filter);
  filterButtons.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.atlasFilter;filterButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filter();}));
  document.getElementById('clear-search')?.addEventListener('click',()=>{search.value='';category='all';filterButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.atlasFilter==='all')));filter();search.focus();});
  const dialog=document.getElementById('project-dialog');let opener;
  if(dialog&&typeof dialog.showModal==='function'){
    document.documentElement.classList.add('project-dialogs-ready');
    document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
      const project=window.portfolioProjects[Number(button.dataset.project)];opener=button;
      for(const key of ['title','label','summary','detail'])document.getElementById('dialog-'+key).textContent=project[key==='title'?'name':key];
      const tags=document.getElementById('dialog-stack');tags.replaceChildren();project.stack.split(' · ').forEach(s=>{const tag=document.createElement('span');tag.textContent=s;tags.append(tag);});
      const actions=document.getElementById('dialog-actions');actions.replaceChildren();
      if(project.case){const a=document.createElement('a');a.href=project.case;a.className='button primary';a.textContent='Read full case study ↗';actions.append(a);}
      if(project.source){const a=document.createElement('a');a.href=project.source;a.target='_blank';a.rel='noopener noreferrer';a.className='text-link';a.textContent='Explore source ↗';actions.append(a);}
      if(!project.case&&!project.source){const p=document.createElement('p');p.className='source-note';p.textContent='Personal project notes · Source not linked.';actions.append(p);}
      dialog.showModal();document.body.classList.add('dialog-open');
    }));
    dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
    dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');opener?.focus();});
  }
  document.querySelector('.knowledge-panels a[href="#atlas"]')?.addEventListener('click',()=>{category='ai';search.value='';filterButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.atlasFilter==='ai')));filter();});
  const tabs=[...document.querySelectorAll('[data-skill]')];
  function activate(tab){tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById('panel-'+t.dataset.skill).hidden=!active;});}
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowDown'||e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowUp'||e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();activate(tabs[next]);tabs[next].focus();});});
  // Small pointer-driven depth on the product concept, never on touch scrolling.
  if(matchMedia('(hover: hover) and (pointer: fine)').matches&&!reduced.matches){
    document.querySelectorAll('.product-preview').forEach(el=>{
      let pending=0,x=0,y=0;el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();x=((e.clientX-r.left)/r.width-.5)*7;y=-((e.clientY-r.top)/r.height-.5)*7;if(!pending)pending=requestAnimationFrame(()=>{el.style.transform=`perspective(900px) rotateX(${y}deg) rotateY(${x}deg)`;pending=0;});});
      el.addEventListener('pointerleave',()=>{cancelAnimationFrame(pending);pending=0;el.style.transform='';});
    });
  }
})();
