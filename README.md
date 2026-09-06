# Ahnaf Shahriar — Personal portfolio

Live site: https://shahriarahnaf.github.io/

This repository contains the editable React/TypeScript source. Vinext builds it into a fully static site for GitHub Pages. No application server is needed in production.

## Where to edit

| Change | File |
| --- | --- |
| Headline, project cards, about text, social links, résumé URL, footer | `app/page.tsx` |
| Companies, roles, dates, logos, expandable experience descriptions | `app/experience.tsx` |
| Colors, spacing, typography sizes, responsive layouts | `app/globals.css` |
| Browser title, description, font families | `app/layout.tsx` |
| Photos and project images | `public/images/` |
| Company logos | `public/images/companies/` |
| Favicon | `public/favicon.svg` |
| Automatic build and publishing | `.github/workflows/pages.yml` |

Assets in `public/` use root URLs: `public/images/ahnaf.jpg` becomes `/images/ahnaf.jpg`.
The résumé links to an existing May 2025 PDF archive; update both its URL and date labels when replacing it.

## Local development

Use Node.js 22.13 or newer and npm.

```sh
npm ci
npm run dev
```

Open the local address printed by the development server. Changes appear automatically.

## Build and preview the static site

```sh
npm run build
npm start
```

The output is `dist/client/`. `npm start` serves it at http://localhost:3000 using Python 3.
Generated files and dependencies are ignored by Git; edit source files rather than build output.

## Publishing

Push source changes to `main`. The **Build and deploy portfolio** GitHub Actions workflow installs the locked dependencies, checks TypeScript, builds the static site, and publishes it to GitHub Pages. It can also be run manually from the Actions tab.

GitHub Pages uses **GitHub Actions** as its publishing source. There is no manual copying and the old `gh-pages` branch is no longer used. A failed build leaves the previously published site available.

`.openai/hosting.json` records the original Sites project and static output directory; GitHub Pages deployment does not require Sites credentials. `CONTENT_SOURCES.md` documents the portfolio's factual sources and image origins.

The former Hugo site and the earlier prebuilt-only version remain in Git history.
