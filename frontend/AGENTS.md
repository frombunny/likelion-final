# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains React source code and the Vite entry points (`src/main.jsx`, `src/App.jsx`).
- `src/pages/` holds route-level views; `src/router/` defines routing setup.
- Shared UI and utilities live in `src/shared/`.
- Styling is split between `src/styles/` (global/theme) and component styles (see `src/App.css`, `src/index.css`).
- Static assets live in `public/` and `src/assets/` (imported in code).

## Build, Test, and Development Commands
- `npm run dev`: start the Vite dev server with HMR.
- `npm run build`: produce a production build in `dist/`.
- `npm run preview`: serve the production build locally.
- `npm run lint`: run ESLint over `src` and config files.

## Coding Style & Naming Conventions
- Use 2-space indentation and semicolons (see `src/App.jsx`).
- Prefer double quotes in JSX/JS files to match existing code.
- Component files use PascalCase (e.g., `UserCard.jsx`); hooks use `useX` naming.
- Keep route-level files in `src/pages/` and colocate component styles when practical.
- Run `npm run lint` before PRs; ESLint enforces React Hooks rules.

## Testing Guidelines
- No automated test framework is currently configured.
- If you add tests, document the runner and naming convention in this file.
- For UI changes, validate manually in the browser and note the steps in the PR.

## Commit & Pull Request Guidelines
- Commit messages follow `type: summary` (examples in history: `feat: ...`, `refactor: ...`, `docs: ...`, `chore: ...`).
- Keep commits focused and avoid mixing unrelated changes.
- PRs should include a concise description, linked issues if applicable, and screenshots or clips for UI changes.

## Configuration & Tooling Notes
- This is a Vite + React app using `react-router-dom` and `styled-components`.
- Build artifacts are in `dist/` and should not be committed.
