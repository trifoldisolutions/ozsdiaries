# Project Understanding Report — OzsDiaries

*Written by the model under test.*

## What this app is

**OzsDiaries** is a Node.js web application built with **Express 5 + EJS server-side templates and Mongoose/MongoDB**, styled with **Tailwind CSS v4**. It lives at `F:\trifoldi\projects\ozsdiaries` and is served from a single entry point, `server.js`, which loads `.env`, connects to a local Mongo database named `ozsdiaries`, mounts four facades, and prints a clickable route map on every start/restart.

## Architecture (the four facades)

| Facade | Routes file | Views dir | Mount |
|---|---|---|---|
| Public | `routes/public.js` | `views/public/` | `/` |
| App | `routes/app.js` | `views/app/` | `/app` |
| Admin | `routes/admin.js` | `views/admin/` | `/admin` |
| Dev Resources | `routes/tasks.js` | `dev_resources/` | `/dev-resources/tasks` |

Shared **partials** (`header.ejs`, `footer.ejs`) are included by every view. The app facade contains login/sign-up, a diaries placeholder page, and — most interestingly — an **AI chat page** (`ollama-chat.ejs`).

## The AI chat feature (the current focus)

`routes/app.js` implements a persona-driven chat UI backed by **OpenRouter**:

- `GET /app/ollama-chat` renders the form; it loads every persona from `personas/*.md` and probes OpenRouter reachability before rendering.
- `POST /app/ollama-chat/generate` takes `{ prompt, personaId }`, validates both, and calls the OpenRouter chat-completions endpoint with the selected persona's body as the **system prompt**, streaming the response back as `text/plain`.
- `lib/personas.js` is the persona loader: it reads every `.md` file in `personas/`, parses a minimal YAML-ish front-matter (`name`, `description`) and uses the remainder as the system prompt. Persona id = filename without extension.
- Three shipped personas: **Sage** (calm mentor), **Spark** (upbeat coach), **Nova** (witty dry friend).
- `.env.example` documents `PORT`, `MONGO_URI`, `SESSION_SECRET`, and the OpenRouter key/model (`inclusionai/ling-2.6-flash`).

## Persistence layer

The only Mongoose model is **`models/Task.js`**, which backs the internal task board served at `/dev-resources/tasks`. It's a dev-facing tool, not user-facing — hence the `dev_resources/` folder for its templates and journal (`tasks.ejs`, `journal.md`, `companionship-mvp.md`).

## Build / run conventions (from CLAUDE.md)

- **Two long-running processes** must stay alive after any edit:
  - `npm run dev` — nodemon on `server.js`
  - `npm run tw` — Tailwind CLI watch build (`src/input.css` → `public/output.css`)
- `npm run dev:all` runs both via `concurrently`.
- VS Code auto-starts both as background tasks on folder open (`.vscode/tasks.json`).
- **Rule**: before ending a turn, confirm both processes are still up; restart either that has crashed.

## Environment assumptions

- Local Mongo at `mongodb://localhost:27017/ozsdiaries`.
- App port `3009`.
- OpenRouter is the LLM backend (not Ollama despite the page's historical name).

---

*Summary: a small, deliberately-structured Express/EJS app with four mounted facades, one AI chat feature wired through persona files to an OpenRouter-backed streaming endpoint, one Mongoose task-board model, and a strict two-process dev loop.*
