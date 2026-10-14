# Aarav Shah — Interactive Portfolio

[Explore the live portfolio](https://a101shah.github.io/Portfolio-v2/)

An independent redesign of my portfolio: a real-time 3D sculpture, detailed project stories, and a searchable atlas of 13 projects across AI, data science, and software development. The original `A101shah/Portfolio` stays separate.

## The experience

- **Interactive 3D idea engine:** a custom WebGL renderer with a torus knot, rippling sphere, and torus. Drag or use arrow keys to rotate; pause motion or reset the view.
- **Three featured stories:** JobTrack AI, IPL Auction, and Two-Sample t-Test, with decisions, source evidence, limitations, and next steps.
- **Project atlas:** 13 owner-described projects, text search, category filters, accessible project-detail dialogs, and public source links where available.
- **Knowledge explorer:** keyboard-operable tabs connecting AI, mathematics, and software systems to project work.
- **Polished presentation:** dark/light themes, depth effects, scroll reveals, abstract case-study renders, and responsive layouts.

The WebGL scene is an abstract generative sculpture, not a trained neural network visualization. Project mockups and renders are explicitly illustrative. No fabricated model scores, deployment counts, testimonials, or skill percentages are presented.

## Run locally

No package installation is needed. Python serves the built website:

```sh
python3 -m http.server 3000 --directory dist
```

Open `http://localhost:3000`.

## Edit and validate

- `scripts/build.py`: featured case-study content and base page structure.
- `scripts/enhance.py`: immersive homepage, knowledge explorer, and the 13-project archive.
- `dist/assets/immersive.css`: visual design and responsive layouts.
- `dist/assets/sculpture.js`: WebGL geometry, lighting, orbit controls, and render lifecycle.
- `dist/assets/experience.js`: atlas search, project dialogs, tabs, reveals, and reading progress.
- `dist/assets/app.js`: shared theme, featured-project filters, and email-copy behavior.

HTML and `dist/assets/projects.js` are generated. Edit their builders, then run:

```sh
python3 scripts/build.py
python3 scripts/check.py
node --check dist/assets/app.js
node --check dist/assets/experience.js
node --check dist/assets/sculpture.js
node --check dist/assets/sculpture-fallback.js
node scripts/check-interactions.cjs
node scripts/check-sculpture.cjs
```

## Deployment

GitHub Pages uses **GitHub Actions** as its publishing source. Every push to `main` validates the site and deploys `dist/`. The workflow can also be run manually. All internal paths work under the `/Portfolio-v2/` project subpath.

## Accessibility and performance

Content remains in static HTML. Without JavaScript, atlas notes are accessible through native disclosures. When WebGL is unavailable, a Canvas 2D renderer projects and shades the same 3D forms in software at a lower resolution, retaining all controls. A static CSS sculpture remains the final fallback. Reduced-motion preference pauses automatic 3D rotation and disables reveal transitions. A pause control remains available to everyone. The animation loop stops when the scene is offscreen or the tab is hidden, and rendering resolution is capped at a 1.75 device pixel ratio. Touch interaction preserves vertical page scrolling.

Project dialogs use the native modal element, Escape dismissal, and focus restoration. Knowledge tabs support arrow keys, Home, and End. Search announces result counts. Focus rings, skip links, and semantic headings are included.

## Content and evidence

The expanded archive uses my original portfolio's project descriptions (reviewed October 2026). Public repository existence was checked for the supplied links. Four entries—Academic Intelligence, Prompt Architect, Neural Cypher, and the Blitzit-inspired Focus Suite—do not have verified public source URLs, so no fake demo or GitHub destination is provided.

Featured case studies retain the previous source review and disclose implementation limits. Broader archive descriptions are owner-provided summaries, not independent production audits. In particular, federated learning is not treated as proof of encryption or privacy, and an intended AWS architecture is not treated as a verified deployment.

## Verification scope

Automated checks cover HTML structure, internal links, assets, script syntax, shared controls, finite mesh coordinates and valid indices for all three geometries, keyboard-rotation handling, and the no-WebGL fallback. They do not replace device-specific accessibility, GPU, or mobile testing. Source projects themselves are separate from this portfolio and are not modified by it.

## License

No open-source license is granted yet. The package is `UNLICENSED` pending the owner's choice. Linked projects retain their own licensing terms.
