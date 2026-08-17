# Project Journal

<!--
## YYYY-MM-DD
- What changed
- Why
-->

## 2026-08-16
- Bootstrapped the project: Express + EJS + Mongoose + dotenv, Tailwind v4 dev pipeline,
  three-facade route structure (public/app/admin), internal dev_resources task board,
  VS Code folder-open auto-tasks, and a `.vbs` launcher.
- Chose the two-separate-terminal-tabs approach (`.vscode/tasks.json` with `runOn:
  folderOpen`) over a single `concurrently`-merged pane for the default auto-start, so
  Tailwind and server output don't interleave. `concurrently` is still installed and wired
  up as an optional `npm run dev:all` for anyone who prefers one pane.
