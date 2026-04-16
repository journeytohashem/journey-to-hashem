import { getStore } from '@netlify/blobs';

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const { formName, ...fields } = body;

    if (!formName) {
      return new Response(JSON.stringify({ error: 'Missing formName' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const store = getStore(formName);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await store.setJSON(id, { id, submittedAt: new Date().toISOString(), ...fields });

    return new Response(JSON.stringify({ success: true, id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = { path: '/api/submit' };
