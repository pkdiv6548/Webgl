# FORM® — WebGL Creative Portfolio

An original, reference-inspired creative studio portfolio built with Three.js/WebGL and GSAP. It explores an immersive project gallery with a rotating 3D ring, animated project metadata, responsive layouts and dedicated Studio / Contact pages.

## Stack
- Vite
- Three.js (WebGL rendering)
- GSAP
- Vanilla JavaScript, HTML and CSS

## Run locally
1. Install Node.js LTS.
2. Clone this repository.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL printed by Vite.

## Build
Run `npm run build`; Vite outputs the production site to `dist/`. Run `npm run preview` to test the production build locally.

## Interactions
- Drag the 3D gallery or use the previous/next controls.
- Select the progress ticks to navigate directly to a project.
- Click a project or the Explore Project button for its detail dialog.
- Use arrow keys to switch projects.
- Toggle motion on/off.
- Respects the user's reduced-motion preference.

## Deployment
Import the repository into Vercel and use the default Vite settings. Build command: `npm run build`; output directory: `dist`.

## Notes
- All showcased projects and brands are fictional concept work.
- Three.js and GSAP are installed as project dependencies. Google Fonts are currently loaded remotely; replace them with locally licensed font files if a fully self-hosted deployment is required.
- The visual language is original and inspired by the broader creative-agency / immersive-portfolio genre; it does not copy Emotion Agency's branding or source code.
