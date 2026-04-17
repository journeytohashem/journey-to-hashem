import { getStore } from '@netlify/blobs';

// Only these store names are allowed
const ALLOWED_FORMS = new Set(['user-waitlist', 'rabbi-interest']);

// Required fields per form
const REQUIRED = {
  'user-waitlist': ['name', 'email'],
  'rabbi-interest': ['name', 'email'],
};

// Optional extra fields per form
const OPTIONAL = {
  'user-waitlist': ['signup_type'],
  'rabbi-interest': ['synagogue', 'phone', 'message', 'signup_type'],
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { formName, ...fields } = body;

  if (!formName || !ALLOWED_FORMS.has(formName)) {
    return new Response(JSON.stringify({ error: 'Unknown form' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const required = REQUIRED[formName] ?? [];
  for (const key of required) {
    if (!fields[key] || !String(fields[key]).trim()) {
      return new Response(
        JSON.stringify({ error: `Missing required field: ${key}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  if (fields.email && !EMAIL_RE.test(String(fields.email).trim())) {
    return new Response(JSON.stringify({ error: 'Invalid email address' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Strip unknown fields — only store what we expect
  const safeFields = {};
  for (const key of required) {
    safeFields[key] = String(fields[key]).trim();
  }
  for (const key of (OPTIONAL[formName] ?? [])) {
    if (fields[key]) safeFields[key] = String(fields[key]).trim();
  }

  try {
    const store = getStore(formName);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await store.setJSON(id, { id, submittedAt: new Date().toISOString(), ...safeFields });

    return new Response(JSON.stringify({ success: true, id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Submission failed. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = { path: '/api/submit' };
