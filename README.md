# Freelance — Freelancer Marketplace Frontend

A responsive, frontend-only freelancer marketplace concept built in the existing Webgl repository. It helps clients discover independent talent and lets freelancers explore sample project opportunities.

## Frontend features
- Responsive landing page with search and skill discovery
- Talent cards with category filters and session-only save toggles
- Skills/category exploration
- Sample project listings and hiring calls to action
- Demo dialog for joining, login, and project-posting entry points
- Mobile navigation, toast feedback, and reduced-motion support

## Stack
- Vite
- Vanilla JavaScript, HTML, and CSS
- Google Fonts (DM Sans and Manrope)

## Run locally
1. Install Node.js LTS.
2. Clone this repository.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL printed by Vite.

## Build
Run `npm run build`; Vite outputs the production site to `dist/`. Run `npm run preview` to test the production build locally.

## Deployment
The Vite base path is configured for GitHub Pages at `/Webgl/`. In repository settings, enable GitHub Pages for the branch/folder or configure an Actions workflow to publish the `dist/` output. A Vercel deployment can use build command `npm run build` and output directory `dist`.

## Important scope
This is a frontend demo only. Profiles and job listings are sample content; search and category filters run in the browser. Login, registration, messaging, hiring, payments, and project publishing are not connected to a backend. The demo form does not submit or store personal information.
