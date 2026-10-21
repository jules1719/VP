# HydroSip website

Static marketing site for **HydroSip** – student project, MCI Innsbruck, Virtual Product Development / Prototyping (winter 2026/27).
Plain HTML, CSS and vanilla JS. No build step. The only external library is Chart.js (CDN) on the demo dashboard.

## Structure

```
index.html            landing page
dashboard.html        demo dashboard (sample data only)
thanks.html           waitlist success page
404.html              not-found page
assets/css/style.css
assets/js/main.js     nav toggle, FAQ accordion
assets/js/dashboard.js  SAMPLE_DATA at the top – replace with Supabase later
assets/img/           hero-placeholder.svg, favicon.svg
netlify.toml          publish dir, security headers, asset caching
```

## Run locally

From this folder:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. (Alternative: `npx serve .`)

Note: the waitlist form only works once deployed on Netlify; locally, submitting it returns an error from the simple server.

## Deploy on Netlify

1. Push this folder to a GitHub repository (or zip it).
2. In Netlify: **Add new site → Import an existing project** → pick the repo.
   Build command: *(leave empty)* · Publish directory: `.`
   (Without Git: **Add new site → Deploy manually** and drag this folder in.)
3. After the first deploy go to **Site configuration → Forms** and make sure form detection is enabled. Redeploy once if the `waitlist` form doesn't show up.
4. Optional: **Forms → Form notifications** → add an email notification for new sign-ups.
5. Optional: set a custom domain under **Domain management**.

## Placeholders still to fill

- `assets/img/hero-placeholder.svg` and the step illustrations → real product photos (< 300 KB, WebP/JPG, add `loading="lazy"` below the fold)
- Imprint and Privacy text in the footer of `index.html` (currently "[to be completed]")
- Team names (none on the site yet)
- `og:image` → a real 1200×630 PNG/JPG with an absolute URL once the domain is known
