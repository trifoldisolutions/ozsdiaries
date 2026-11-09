const express = require('express');
const { Readable } = require('stream');
const router = express.Router();
const { loadPersonas, getPersonaById } = require('../services/personas');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const MODEL = process.env.OPENROUTER_MODEL || 'inclusionai/ling-2.6-flash';

async function isOpenRouterReachable() {
  if (!OPENROUTER_API_KEY) return false;
  try {
    const res = await fetch(`${OPENROUTER_URL}/models`, {
      headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}` },
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

router.get('/', (req, res) => {
  res.render('app/index', { title: 'App' });
});

router.get('/login', (req, res) => {
  res.render('app/auth/login', { title: 'Log In / Sign Up' });
});

router.get('/diaries', (req, res) => {
  res.render('app/diaries', { title: 'Diaries' });
});

router.get('/ollama-chat', async (req, res) => {
  const personas = loadPersonas();
  const reachable = await isOpenRouterReachable();
  res.render('app/ollama-chat', {
    title: 'AI Chat',
    personas,
    selectedPersonaId: personas[0] ? personas[0].id : '',
    prompt: '',
    error: reachable
      ? null
      : `Could not reach OpenRouter. Check that OPENROUTER_API_KEY is set.`,
  });
});

router.post('/ollama-chat/generate', async (req, res) => {
  const { prompt, personaId } = req.body;

  if (!prompt || !personaId) {
    return res.status(400).json({ error: 'A prompt and persona are required.' });
  }

  const persona = getPersonaById(personaId);
  if (!persona) {
    return res.status(400).json({ error: 'Unknown persona.' });
  }

  let genRes;
  try {
    genRes = await fetch(`${OPENROUTER_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        messages: [
          { role: 'system', content: persona.systemPrompt },
          { role: 'user', content: prompt },
        ],
      }),
    });
    if (!genRes.ok) throw new Error(`OpenRouter returned status ${genRes.status}`);
  } catch (err) {
    return res.status(502).json({ error: `Failed to reach OpenRouter: ${err.message}` });
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  let buffer = '';
  for await (const chunk of Readable.fromWeb(genRes.body)) {
    buffer += chunk.toString('utf8');
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') continue;

      try {
        const delta = JSON.parse(data).choices?.[0]?.delta?.content;
        if (delta) res.write(delta);
      } catch (err) {
        // ignore malformed/partial SSE payloads
      }
    }
  }
  res.end();
});

router.routes = [
  { method: 'GET', path: '/', label: 'App index' },
  { method: 'GET', path: '/login', label: 'Login / Sign up' },
  { method: 'GET', path: '/diaries', label: 'Diaries (placeholder)' },
  { method: 'GET', path: '/ollama-chat', label: 'AI chat (OpenRouter)' },
  { method: 'POST', path: '/ollama-chat/generate', label: 'Send prompt to OpenRouter (JSON, no reload)' },
];

module.exports = router;
