# NULL ISLAND

A personal website built with plain HTML, CSS, and JavaScript. Designed for GitHub Pages.

## Files

- `index.html` — homepage and working terminal
- `about.html`, `archive.html`, `workshop.html`, `frequencies.html`, `field-notes.html`, `elsewhere.html` — public pages
- `lost.html` — 404-style page
- `backroom.html`, `logs.html` — unlisted pages
- `css/style.css` — shared visual system
- `js/site.js` — menu, active navigation, archive search, current year
- `js/terminal.js` — simulated terminal commands and virtual filesystem

## Run locally

You can open `index.html` directly in a browser. For a more reliable local server, use VS Code's Live Server extension or run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish on GitHub Pages

1. Create a GitHub repository and upload the contents of this folder.
2. Open **Settings → Pages**.
3. Under build and deployment, choose **Deploy from a branch**.
4. Select your default branch and `/ (root)`, then save.
5. Wait for GitHub Pages to publish the site.

This project uses relative links and does not require a build step, so it can be published directly from the repository root.

## Customise it

1. Replace the sample text in `about.html` and the sample entries in the other pages.
2. Edit the location cards in `index.html` if you rename or remove pages.
3. Add terminal routes and virtual files in `js/terminal.js` (`files`, `docs`, and `routeFor`).
4. Change colours and fonts at the top of `css/style.css`.
5. Replace the title, favicon, and metadata with your own details.

## Notes

- The terminal is simulated. It does not execute operating-system commands or access server files.
- Hidden pages are unlisted, not secure. Anyone who knows a URL can open them.
- The site does not collect visitor data or require a backend.
- External font loading is optional. If you want the site to work without third-party requests, remove the Google Fonts `@import` and the fallback fonts will be used.
