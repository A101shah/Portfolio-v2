"""Visitor-focused editorial layer; all project claims stay in the source content."""
import re
from html import escape

BRIEFS={
 'jobtrack':('Career workflow','Connect applications, resume versions, and interview preparation.','Keep tracking predictable; make AI assistance explicit and on demand.','Evaluate the quality of generated advice with a documented review set.'),
 'ipl-auction':('Auction management','Represent players, bids, teams, and budgets in a shared interface.','Model connected auction state with Flask and PostgreSQL.','Harden authentication and test concurrent bidding before public use.'),
 'statistical-toolkit':('Statistical learning','Show how two samples become a statistical comparison.','Place an inspectable manual calculation beside a SciPy result.','Align the manual calculation with Welch’s test and add reference tests.')
}

def chart():
 return '''<div class="distribution-art" role="img" aria-label="Illustrative distributions for two samples; synthetic data"><div class="visual-label">TWO SAMPLES / A SHARED QUESTION</div><svg viewBox="0 0 500 190" aria-hidden="true"><defs><linearGradient id="mint-fill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#88bfa6" stop-opacity=".5"/><stop offset="1" stop-color="#88bfa6" stop-opacity="0"/></linearGradient><linearGradient id="lilac-fill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#b6a3d9" stop-opacity=".4"/><stop offset="1" stop-color="#b6a3d9" stop-opacity="0"/></linearGradient></defs><path d="M30 155H470 M30 110H470 M30 65H470" stroke="#a4b4c21b"/><path d="M30 155C110 155 110 25 180 25S250 155 330 155Z" fill="url(#mint-fill)"/><path d="M30 155C110 155 110 25 180 25S250 155 330 155" fill="none" stroke="#a4e4c6" stroke-width="2"/><path d="M145 155C225 155 225 42 295 42S365 155 455 155Z" fill="url(#lilac-fill)"/><path d="M145 155C225 155 225 42 295 42S365 155 455 155" fill="none" stroke="#c9b7eb" stroke-width="2"/><path d="M180 25V155 M295 42V155" stroke="#becbd44d" stroke-dasharray="3 6"/><circle cx="180" cy="25" r="4" fill="#a4e4c6"/><circle cx="295" cy="42" r="4" fill="#c9b7eb"/></svg><div class="distribution-legend"><span>● Sample A</span><span>● Sample B</span><small>Concept illustration</small></div></div>'''

def polish(page,case=None):
 depth='../' if case else ''
 page=page.replace('</head>',f'<link rel="stylesheet" href="{depth}assets/editorial.css"><script defer src="{depth}assets/editorial.js"></script></head>')
 page=page.replace('aria-label="Main navigation"','aria-label="Main navigation" id="primary-navigation"')
 page=page.replace('>Atlas</a>','>Projects</a>')
 page=page.replace('<span class="wordmark-name">AARAV SHAH</span>','<span class="wordmark-name">AARAV SHAH<small>DATA SCIENCE & DEVELOPMENT</small></span>')
 page=page.replace('<footer class="site-footer">','<footer class="site-footer">')
 page=page.replace('Data science. Thoughtful software.','Curious by nature. Thoughtful by design.')
 if case:
  label,context,decision,nextstep=BRIEFS[case]
  brief=f'''<section class="case-brief section-shell" aria-labelledby="brief-title"><div class="brief-intro"><span class="eyebrow">THE PROJECT, AT A GLANCE</span><h2 id="brief-title">{label}.</h2><span class="reading-time">A short project walkthrough</span></div><div class="brief-facts"><div><span>THE QUESTION</span><p>{context}</p></div><div><span>THE KEY DECISION</span><p>{decision}</p></div><div><span>THE NEXT STEP</span><p>{nextstep}</p></div></div></section>'''
  page=page.replace('<div class="case-render ',brief+'<div class="case-render ',1)
  page=page.replace('<span class="eyebrow">04 / HONEST BOUNDARIES</span>','<span class="eyebrow">04 / REFLECTION & NEXT STEPS</span>')
  page=page.replace('What still needs work.','What I’d improve next.')
  page=page.replace('These links point to the implementation and documentation. They are evidence you can inspect, rather than performance claims.','Explore the implementation, design choices, and supporting documentation.')
  return page
 page=page.replace('Data, ideas &amp; working software — Aarav Shah','Aarav Shah — Data science, thoughtfully built')
 page=page.replace('AARAV SHAH / DATA SCIENCE & DEVELOPMENT','INDEPENDENT MIND. CONNECTED DISCIPLINES.')
 page=page.replace('<h1>Curiosity.<br>Intelligence.<br><span>In motion.</span></h1>','<h1>Intelligence,<br>made <em>useful.</em></h1>')
 page=page.replace('I turn data, models, and ambitious ideas into interactive software. A data science student at NMIMS, building at the intersection of AI and the web.','I’m Aarav, a data science student at NMIMS. I explore how models, data, and thoughtful interfaces can make everyday problems a little easier to solve.')
 page=page.replace('Enter my world','View selected work').replace('Explore all 13 projects ↗','A little about me ↗').replace('<a class="text-link" href="#atlas">A little about me','<a class="text-link" href="#about">A little about me')
 page=page.replace('THE IDEA ENGINE','A STUDY IN CONNECTION').replace('INTERACTIVE / 3D','DRAG TO EXPLORE')
 page=page.replace('SCROLL TO DISCOVER','SELECTED WORK BELOW').replace('13 EXPLORATIONS <i>/</i> 3 FEATURED STORIES <i>/</i> ALWAYS LEARNING','AI APPLICATIONS <i>/</i> DATA SCIENCE <i>/</i> SOFTWARE SYSTEMS')
 # Replace the repetitive ticker with a short, human introduction.
 page=re.sub(r'<div class="discipline-strip">.*?</div>', '''<section class="intro-note section-shell" aria-label="My perspective"><span class="eyebrow">A NOTE ON HOW I WORK</span><p>The interesting part isn’t just<br><em>what a model can do.</em><br>It’s what someone can do with it.</p><div><span class="note-mark" aria-hidden="true">↳</span><p>That’s the thread connecting my work—from AI-assisted tools to statistical experiments and the interfaces that bring them to life.</p><a href="#knowledge">Explore my toolkit <span aria-hidden="true">↗</span></a></div></section>''',page,count=1,flags=re.S)
 page=page.replace('Beyond the render.<br>Inside the work.','Selected work.<br><em>Considered in detail.</em>')
 page=page.replace('The problem. The decisions. The next iteration.<br>Three closer looks at how I build.','Three projects that show how I think.<br>Each story connects a problem, a design decision,<br>and what I learned along the way.')
 page=page.replace('<section class="work-section section-shell"','<div class="work-chapter"><section class="work-section section-shell"',1)
 page=page.replace('<section id="atlas"','</div><section id="atlas"',1)
 page=page.replace('Explore the case study','Read the story')
 page=page.replace('<div class="project-kicker"><span>01 / AI APPLICATION</span>','<div class="project-kicker"><span>01 / AI-ASSISTED WORKFLOWS</span>')
 page=page.replace('One curiosity.<br>Many directions.','The wider collection.')
 page=page.replace('A wider view of my work.<br>From learning experiments to application prototypes.','A working collection of experiments and prototypes.<br>Follow a topic, a tool, or your curiosity.')
 page=page.replace('<div class="atlas-empty" hidden>','<div class="atlas-pagination"><button class="button secondary" id="show-projects" type="button" hidden>Show more projects <span aria-hidden="true">↓</span></button></div><div class="atlas-empty" hidden>')
 page=page.replace('Project notes draw on my original portfolio. Source links are provided where available; prototypes and explorations are not presented as verified production deployments.','A mix of academic work, personal explorations, and application prototypes. Open a project for context and available source code.')
 page=page.replace('Different tools.<br>Connected thinking.','A toolkit shaped<br>by <em>the problem.</em>')
 page=page.replace('Explore the tools and concepts<br>behind the projects.','Methods and tools I’m putting into practice.<br>Choose an area to explore.')
 page=page.replace('Always a student<br>of the problem.','A curious mind.<br><em>A practical streak.</em>')
 page=page.replace('I’m a data science student who enjoys the space between understanding a model and building something people can use.','I like the moment when an abstract idea becomes something you can actually use.')
 page=page.replace('I’m continuing to develop my understanding of evaluation, deployment, and reliable systems. These projects show both what I’ve built and the questions I’m still working through.','At NMIMS in Mumbai, I’m developing the mathematical foundations and engineering habits behind that work. I’m especially interested in evaluation, deployment, and the small interface decisions that help people feel in control.')
 page=page.replace('<span class="education-label">NMIMS · MUMBAI</span>','<span class="education-label">DATA SCIENCE STUDENT<br>NMIMS MPSTME · MUMBAI</span>')
 page=page.replace('Let’s make<br>the next thing<span>.</span>','Something in mind?<br><em>Let’s talk.</em>')
 page=page.replace('I’m open to project collaborations, learning opportunities,<br>and conversations about useful applications of data and AI.','An interesting problem, a collaboration, or an opportunity to learn.<br>I’d love to hear what you’re thinking.')
 page=page.replace('<a class="contact-email"', '<div class="contact-intents"><a class="button primary" href="mailto:shahaarav602@gmail.com?subject=Let%27s%20build%20something">Start a conversation <span aria-hidden="true">↗</span></a><a class="text-link" href="https://www.linkedin.com/in/aarav-shah-681641275/" target="_blank" rel="noopener noreferrer">Connect on LinkedIn ↗</a></div><a class="contact-email"',1)
 # Replace the formula artwork with a bespoke distribution render, while retaining accurate copy.
 page=re.sub(r'<div class="stats-visual">.*?</div><div class="project-description">',chart()+'<div class="project-description">',page,count=1,flags=re.S)
 return page
