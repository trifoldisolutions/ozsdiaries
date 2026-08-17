> After making any edit, and before ending a turn or task, verify that `npm run dev` and
> `npm run tw` are still running. If either has stopped, treat it as crashed — don't assume
> it restarts on its own. Restart it before finishing the edit or task, and only report the
> work as done once both are confirmed alive again.

## Project overview

**OzsDiaries** — Node.js/Express app using EJS views and MongoDB (via Mongoose).

- **Stack**: Express 5, Mongoose, EJS, Tailwind CSS v4, dotenv.
- **Entry point**: `server.js` — loads `.env`, connects to MongoDB (`dbName: 'ozsdiaries'`),
  mounts three facades, and prints a clickable route map on every start/restart.
- **Facades**:
  - Public (`routes/public.js`, `views/public/`) — mounted at `/`.
  - App (`routes/app.js`, `views/app/`) — mounted at `/app`. Login/sign-up + placeholder
    entity pages.
  - Admin (`routes/admin.js`, `views/admin/`) — mounted at `/admin`.
  - Dev Resources (`routes/tasks.js`, `dev_resources/tasks.ejs`) — mounted at
    `/dev-resources/tasks`, internal task board backed by `models/Task.js`.
- **Scripts**:
  - `npm run dev` — nodemon on `server.js`.
  - `npm run tw` — Tailwind CLI watch build (`src/input.css` → `public/output.css`).
  - `npm run dev:all` — optional manual convenience script running both via `concurrently`
    in one terminal pane. Normal auto-start on folder open uses two separate VS Code tasks
    instead (see `.vscode/tasks.json`), not this script.
- **Env vars**: see `.env.example`. `MONGO_URI` must be set for anything that touches the
  database (including the task board) to actually persist.
