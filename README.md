# Aarav Shah — Portfolio V2

An independent, responsive portfolio for a data science student at NMIMS. It introduces three projects through readable case studies with direct links to source evidence and clearly stated limitations.

This repository is a separate redesign. It does not replace or modify the existing `A101shah/Portfolio` website.

## What is included

- Static homepage with selected work, project filters, approach, about, skill evidence, and contact.
- Dedicated case studies for JobTrack AI, IPL Auction, and the Two-Sample t-Test calculator.
- Dark and light themes with a remembered preference.
- Keyboard-accessible links and controls, skip navigation, reduced-motion handling, and responsive layouts.
- Copy-email control with a failure fallback.
- GitHub Pages workflow that validates the site before deployment.

The core content is present in HTML and remains available without JavaScript. JavaScript only enhances theme selection, filtering, and email copying. Google Fonts are optional; system font fallbacks are provided.

## Run locally

Python 3 is enough to serve the checked-in site:

```sh
python3 -m http.server 3000 --directory dist
```

Open `http://localhost:3000`. No npm dependency installation is required.

## Edit and validate

Edit content and page structure in `scripts/build.py`. Edit appearance in `dist/assets/style.css` and behaviors in `dist/assets/app.js`.

```sh
python3 scripts/build.py
python3 scripts/check.py
node --check dist/assets/app.js
node scripts/check-interactions.cjs
```

Python 3 and Node.js are needed for the complete checks. `dist/` is the deployable website; the builder regenerates HTML while retaining its assets. Do not edit generated HTML unless you also update the builder.

## Publish as a new GitHub Pages site

1. Create a new repository, such as `Portfolio-v2`, and push these files to its `main` branch.
2. In the new repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Run the **Validate and deploy portfolio** workflow (or push a new commit).
4. Use the deployment URL returned by that workflow. For the proposed repository name under `A101shah`, the expected path is `https://a101shah.github.io/Portfolio-v2/`—this is not a claim that the URL is already live.
5. Put the verified live URL in this README and the repository About field.

All internal links are relative, so the site supports GitHub Pages project subpaths. The separate `.openai/hosting.json` file configures the private comparison preview and is not needed by GitHub Pages.

## Project evidence and content boundaries

Descriptions are based on the reviewed project source and documentation:

| Project | Source | Portfolio framing |
| --- | --- | --- |
| JobTrack AI | https://github.com/A101shah/Job_Track_AI | AI-assisted application tracker; deterministic and model-assisted features distinguished |
| IPL Auction | https://github.com/A101shah/ipl_auction | Flask/PostgreSQL auction application; no unsupported ML valuation claim |
| Two-Sample t-Test | https://github.com/A101shah/2_sample_ttest_deployment | Learning prototype; current statistical implementation limitations disclosed |

The JobTrack product illustration uses synthetic data and is explicitly labeled. The hero plot is illustrative. No model accuracy, latency benchmark, user count, or hiring outcome is claimed. Linked project source was reviewed on 13 October 2026; check it again before updating these descriptions. No public project demo URL was verified.

Contact details use the existing portfolio's centralized project data and README. Confirm them before promoting this redesign as the primary portfolio.

## Verification scope

Automated checks cover HTML structure, local links and fragments, assets, JavaScript syntax, theme behavior, project filtering, and clipboard behavior. They do not certify visual rendering, mobile browser behavior, contrast, external project correctness, or live project availability. Perform a browser review at desktop and mobile sizes before promotion.

## License

No open-source license is granted for this portfolio yet. The package is marked `UNLICENSED` pending the owner's choice. Linked projects retain their own licensing terms.
