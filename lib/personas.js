const fs = require('fs');
const path = require('path');

const PERSONAS_DIR = path.join(__dirname, '..', 'personas');

function parsePersonaFile(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;

  const [, frontmatter, body] = match;
  const meta = {};
  frontmatter.split(/\r?\n/).forEach((line) => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  });

  return {
    name: meta.name || '',
    description: meta.description || '',
    systemPrompt: body.trim(),
  };
}

function loadPersonas() {
  let files;
  try {
    files = fs.readdirSync(PERSONAS_DIR).filter((f) => f.endsWith('.md'));
  } catch (err) {
    return [];
  }

  return files
    .map((file) => {
      const id = path.basename(file, '.md');
      const raw = fs.readFileSync(path.join(PERSONAS_DIR, file), 'utf8');
      const parsed = parsePersonaFile(raw);
      if (!parsed) return null;
      return { id, ...parsed };
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getPersonaById(id) {
  return loadPersonas().find((p) => p.id === id) || null;
}

module.exports = { loadPersonas, getPersonaById };
