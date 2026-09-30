# Taha Mohamed Adib — Portfolio

A responsive, single-page portfolio based on Taha's CV. It uses plain HTML, CSS, and JavaScript, so no build step or dependency install is needed.

Open `index.html` in a browser, or run a local server from this folder:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

The four projects include accessible case-study dialogs: OraSight, SafeSpend, HR email automation at Yool Education, and a retail operations platform. Product visuals are illustrative; experience, technologies, education, and certifications are based on the supplied CV. The original portrait, downloadable CV, and social preview are in `assets/`.

To update the site, edit content and links in `index.html`, visual styles in `styles.css`, and interactions in `script.js`.

Case-study content lives in the `projects` object in `script.js`. The site includes keyboard navigation, reduced-motion support, and a readable no-JavaScript fallback. No build step is required. Local QA artifacts and browser profiles in `tmp/` are excluded from version control.

GitHub Pages automatically publishes the repository root from `main`:
https://tahamohamedadib.github.io/Portfolio-Taha-Mohamed-Adib/
