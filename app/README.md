# Portfolio (React + Vite + Tailwind) — dark studio

Source for https://rishicreates20.github.io/portfolio/

## Develop
    cd app && npm install && npm run dev
## Build & deploy (served from repo root)
    cd app && npm run build && cp -r dist/* ../
    cd .. && git add -A && git commit -m "Update portfolio" && git push

Edit content in `app/src/App.jsx`. Photo: `app/src/assets/profile.jpg`.
Logo mark + favicon: `app/public/favicon.svg` (also inlined as <Mark/> in App.jsx).
Tech logos are local SVGs in `app/public/icons/` (from the `devicon` package) — no runtime CDN.
Palette / fonts: `app/tailwind.config.js`. Accent = #e9a23b (amber).
