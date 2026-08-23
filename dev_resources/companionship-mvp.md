# Companionship MVP — Scoping Doc

Working doc for the AI/human companionship layer on top of the diary. Captures what's
been discussed so we don't re-litigate it, and lists the open questions to work through
this session. Not a spec — update freely as decisions land.

## 1. Concept

The diary isn't just a private log — it's paired with a companion who reads the user's
entries and acts like a 1:1 session partner (therapist/coach archetype, not a generic
chatbot). Companions start as AI personas with invented, fully-fleshed identities.
Later, real professionals can apply to become companions and get paid per session.

## 2. What already exists (prototype, uncommitted)

- `lib/personas.js` — loads persona `.md` files from `personas/`, parses YAML
  frontmatter (`name`, `description`) + body (system prompt).
- `personas/sage.md`, `personas/spark.md` — generic placeholder personas (mentor /
  hype coach), one-liner system prompts. Look like scaffolding, not real personas —
  see open question below on whether to delete them.
- `personas/nova.md` — a stub "witty dry-humored friend," not yet the Nova Mendez
  persona described in this doc. Needs a full rewrite.
- `views/app/ollama-chat.ejs` + `routes/app.js` (`GET/POST /app/ollama-chat*`) —
  working streaming chat UI against OpenRouter (`OPENROUTER_API_KEY`,
  `OPENROUTER_MODEL`, default `inclusionai/ling-2.6-flash`). This is the seed for the
  real companion chat panel.

## 3. Entry flow

- Public landing page (`/`) stays as-is for now — just the "Enter the app" button.
  Real domain later: `app.ozsdiaries.com`.
- On app load: check if the visitor has an account. If not, silently create an anon
  account for them. Anon accounts carry restrictions — **not yet defined** (see open
  questions).

## 4. Layout — single-page, 3 columns

- **Left** — navigation / menus.
- **Middle** — diary panel (entries, writing).
- **Right** — companion panel (chat with the active companion).

## 5. Companions

### 5a. AI personas (MVP — 3 total)

| Handle | Name | Archetype |
|---|---|---|
| `@drmel` | Dr. Amelia Surdough | Psychotherapist |
| `@chethan` | Ethan Chase | Yoga / fitness coach |
| `@thegirlnextdoor` | Nova Mendez | Existing witty-friend Nova, promoted to full persona |

Each needs a deep, invented identity — backstory, personality, formative experiences,
speech patterns, values, quirks, boundaries — enough that responses never read as "an
AI assistant." No disclaimers, no breaking character. This is a writing task as much as
an engineering one; likely wants its own persona-bible file per companion (bigger than
the current one-line system prompts).

### 5b. Human companions (post-MVP, phase 2)

- Application / vetting flow — professionals only, no open signup.
- Approved companions get a profile + calendar.
- Users book sessions; companion sets their own price per seance.
- Not building this now, but the data model (§8) shouldn't foreclose it.

## 6. Personalization / memory system

- Diary entries feed an AI-built "identity card" for the user — described as
  `personality.md` / `experiences.md`-style content, built from diary insights.
- Every chat with a companion is a bounded **seance** (has a duration, eventually a
  price).
- After a seance ends: transcript goes through an extraction pass — the AI pulls out
  anything worth remembering about the user long-term and folds it into their identity
  card.
- The identity card is what makes the companion feel like it "knows" the user across
  sessions, not just within one conversation.

## 7. Seance model

- One bounded conversation between a user and a companion.
- Has a start/end, a duration, a transcript, and (eventually) a price.
- Ends → triggers the extraction-to-identity-card pipeline.

## 8. Rough data model (directional)

- `User` — incl. `isAnon`, restriction flags.
- `Companion` — `type: ai | human`, handle, display name, persona ref (AI) or
  profile/rate (human), status.
- `Seance` — userId, companionId, startedAt, endedAt, transcript, price, status.
- `MemoryEntry` / `IdentityCard` — userId, content, source (seanceId or diaryEntryId),
  createdAt.
- `DiaryEntry` — need to check `models/` for what exists today.
- *(Phase 2)* `CompanionApplication`, `Availability`/calendar slots, `Booking`/payment.

## 9. MVP scope

**In:** 3 fully-written AI personas, 3-column SPA shell, anon account
auto-provisioning, diary → identity card pipeline (v1), seance chat with transcript +
post-seance extraction, companion panel to pick between the 3 personas.

**Out (phase 2+):** human companion applications/vetting, companion calendars &
booking, payments, anon-account restriction enforcement beyond a basic flag.

## 10. Open questions for this session

- What exactly is an anon account restricted from? (persisting entries? talking to
  companions at all? capped seances/day?)
- Anon → real account upgrade: how does existing diary/seance history get claimed?
- Does the companion see diary entries automatically, or does the user share
  on-demand per entry?
- Is the identity card **shared** across all 3 companions, or does each companion keep
  its own memory of the user?
- Seance pricing/duration for AI companions in MVP — free, capped, metered against
  OpenRouter cost?
- Keep `sage.md`/`spark.md` as dev fixtures, or delete now that real personas are
  defined?
- Persona storage: stay as markdown files (current pattern), or move into MongoDB once
  human companions need editable, dynamic profiles?
- Extraction pipeline: synchronous at seance end, or an async job/queue?
