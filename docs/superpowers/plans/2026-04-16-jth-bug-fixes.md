# JtH Bug Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 6 issues identified by Codex review: LiveTab crash, form submission hardening (validation + async), CSS iOS fragility, and netlify.toml routing.

**Architecture:** All changes are in three files: `pages/index.jsx` (React UI + form fetch logic), `netlify/functions/submit.js` (serverless form handler), and `styles/globals.css` (iOS Safari scroll CSS). `netlify.toml` needs a one-line addition but no restructuring.

**Tech Stack:** Next.js 14 (static export), React 18, Netlify Functions (ESM), Netlify Blobs, Tailwind-free CSS (globals.css inline styles)

---

## File Map

| File | Changes |
|------|---------|
| `pages/index.jsx:1040` | `React.useRef` → `useRef` (crash fix) |
| `pages/index.jsx:540–570` | UserWaitlistCard — await fetch, loading state, error state, duplicate-submit guard |
| `pages/index.jsx:1456–1465` | RabbiPitchScreen.handleSubmit — same async pattern |
| `netlify/functions/submit.js` | Form name whitelist, required field validation, email regex, generic 500 |
| `styles/globals.css:14` | `height:100%` → `100dvh` on html/body; remove `-webkit-overflow-scrolling:touch` |
| `netlify.toml` | Add `[[functions]]` block so `/api/submit` is not shadowed by `/*` redirect |

---

## Task 1: Fix LiveTab crash — `React.useRef` → `useRef`

**Files:**
- Modify: `pages/index.jsx:1040`

- [ ] **Step 1: Confirm the crash line**

  Open `pages/index.jsx` and find line 1040. It reads:
  ```js
  const intervalRef=React.useRef(null);
  ```
  The import on line 1 is:
  ```js
  import { useState, useEffect, useRef } from 'react';
  ```
  `React` is never imported as a default export, so `React.useRef` throws `ReferenceError: React is not defined` the moment the LiveTab component mounts.

- [ ] **Step 2: Apply the fix**

  Change line 1040 from:
  ```js
  const intervalRef=React.useRef(null);
  ```
  to:
  ```js
  const intervalRef=useRef(null);
  ```

- [ ] **Step 3: Verify no other `React.` calls exist**

  Run:
  ```bash
  grep -n "React\." pages/index.jsx
  ```
  Expected output: **no matches**. If any appear, change each `React.useXxx` to the bare hook name (which is already destructured on line 1).

- [ ] **Step 4: Commit**

  ```bash
  cd ~/Projects/journey-to-hashem
  git add pages/index.jsx
  git commit -m "fix: replace React.useRef with useRef in LiveTab — crash fix"
  ```

---

## Task 2: Harden `netlify/functions/submit.js`

**Files:**
- Modify: `netlify/functions/submit.js`

Issues to fix:
1. No whitelist — any `formName` value creates a new Blob store
2. No required-field validation per form
3. No email format check
4. Raw `err.message` leaked in 500 response

- [ ] **Step 1: Rewrite `submit.js` with all hardening**

  Replace the entire file with:
  ```js
  import { getStore } from '@netlify/blobs';

  // Only these store names are allowed
  const ALLOWED_FORMS = new Set(['user-waitlist', 'rabbi-interest']);

  // Required fields per form
  const REQUIRED = {
    'user-waitlist': ['name', 'email'],
    'rabbi-interest': ['name', 'email'],
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
    // Allow optional known extras per form
    const OPTIONAL = {
      'rabbi-interest': ['synagogue', 'phone', 'message'],
    };
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
  ```

- [ ] **Step 2: Commit**

  ```bash
  cd ~/Projects/journey-to-hashem
  git add netlify/functions/submit.js
  git commit -m "fix: harden submit function — whitelist, validation, safe error messages"
  ```

---

## Task 3: Fix async form fetch in `UserWaitlistCard`

**Files:**
- Modify: `pages/index.jsx:540–570`

Current code sets `setDone(true)` immediately without awaiting the fetch — the user sees success even if the network call fails.

- [ ] **Step 1: Find the UserWaitlistCard function**

  In `pages/index.jsx`, find the `UserWaitlistCard` function (around line 535). The current `onClick` handler looks like:
  ```js
  onClick={()=>{
    fetch('/api/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({formName:'user-waitlist',...form})}).catch(()=>{});
    setDone(true);
  }}
  ```

- [ ] **Step 2: Add loading and error state declarations**

  Find the existing `useState` calls at the top of `UserWaitlistCard`. They currently are:
  ```js
  const [form,setForm]=useState({name:'',email:''});
  const [done,setDone]=useState(false);
  ```
  Change them to:
  ```js
  const [form,setForm]=useState({name:'',email:''});
  const [done,setDone]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  ```

- [ ] **Step 3: Replace the fire-and-forget onClick with an async handler**

  Replace the entire button element (the one with `onClick={()=>{ fetch(...) }}`) with:
  ```jsx
  <button
    className={`btn-primary${(!form.name||!form.email||loading)?' btn-disabled':''}`}
    disabled={!form.name||!form.email||loading}
    onClick={async()=>{
      setLoading(true);
      setError('');
      try{
        const res=await fetch('/api/submit',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({formName:'user-waitlist',...form})
        });
        const data=await res.json();
        if(!res.ok) throw new Error(data.error||'Submission failed');
        setDone(true);
      }catch(e){
        setError(e.message||'Something went wrong. Please try again.');
      }finally{
        setLoading(false);
      }
    }}
  >{loading?'Sending…':'Join →'}</button>
  ```

- [ ] **Step 4: Add error display below the button**

  Immediately after the button, add:
  ```jsx
  {error&&<p style={{color:'#e05252',fontSize:12,marginTop:6}}>{error}</p>}
  ```

- [ ] **Step 5: Commit**

  ```bash
  cd ~/Projects/journey-to-hashem
  git add pages/index.jsx
  git commit -m "fix: await waitlist fetch, show loading/error state"
  ```

---

## Task 4: Fix async form fetch in `RabbiPitchScreen.handleSubmit`

**Files:**
- Modify: `pages/index.jsx:1456–1466`

Same fire-and-forget problem as Task 3.

- [ ] **Step 1: Add loading and error state to RabbiPitchScreen**

  In `RabbiPitchScreen` (around line 1452), find the existing state declarations:
  ```js
  const [showContact,setShowContact]=useState(false);
  const [contactForm,setContactForm]=useState({name:'',synagogue:'',email:'',phone:'',message:''});
  const [submitted,setSubmitted]=useState(false);
  ```
  Add two more lines:
  ```js
  const [submitting,setSubmitting]=useState(false);
  const [submitError,setSubmitError]=useState('');
  ```

- [ ] **Step 2: Replace `handleSubmit` with async version**

  The current `handleSubmit` (line ~1456):
  ```js
  const handleSubmit=()=>{
    if(contactForm.name&&contactForm.email){
      fetch('/api/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({formName:'rabbi-interest',...contactForm})
      }).catch(()=>{});
      setSubmitted(true);
      setTimeout(()=>{setShowContact(false);setSubmitted(false);},2000);
    }
  };
  ```
  Replace with:
  ```js
  const handleSubmit=async()=>{
    if(!contactForm.name||!contactForm.email) return;
    setSubmitting(true);
    setSubmitError('');
    try{
      const res=await fetch('/api/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({formName:'rabbi-interest',...contactForm})
      });
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||'Submission failed');
      setSubmitted(true);
      setTimeout(()=>{setShowContact(false);setSubmitted(false);},2000);
    }catch(e){
      setSubmitError(e.message||'Something went wrong. Please try again.');
    }finally{
      setSubmitting(false);
    }
  };
  ```

- [ ] **Step 3: Update the submit button to use `submitting` state**

  Find the button in the rabbi contact form that calls `handleSubmit`. It currently looks like:
  ```jsx
  <button className="btn-primary" onClick={handleSubmit}>Send Message</button>
  ```
  Change to:
  ```jsx
  <button className={`btn-primary${submitting?' btn-disabled':''}`} disabled={submitting} onClick={handleSubmit}>
    {submitting?'Sending…':'Send Message'}
  </button>
  ```

- [ ] **Step 4: Add error display near the submit button**

  After the button, add:
  ```jsx
  {submitError&&<p style={{color:'#e05252',fontSize:12,marginTop:6}}>{submitError}</p>}
  ```

- [ ] **Step 5: Commit**

  ```bash
  cd ~/Projects/journey-to-hashem
  git add pages/index.jsx
  git commit -m "fix: await rabbi pitch fetch, show loading/error state"
  ```

---

## Task 5: Fix CSS iOS Safari fragility

**Files:**
- Modify: `styles/globals.css:14,19`

Two issues:
1. `height:100%` on `html,body` breaks with iOS Safari's dynamic toolbar (address bar shrinks/expands, viewport height changes). `100dvh` (dynamic viewport height) is the correct modern fix.
2. `-webkit-overflow-scrolling:touch` is deprecated since iOS 13 and has no effect in modern iOS — remove it to avoid confusion.

- [ ] **Step 1: Open `styles/globals.css` and find lines 14 and 19**

  Line 14 reads:
  ```css
  html,body{height:100%;overflow:hidden;}
  ```
  Line 19 reads:
  ```css
  .tab-content{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;scroll-behavior:smooth;}
  ```

- [ ] **Step 2: Apply the two fixes**

  Change line 14 to:
  ```css
  html,body{height:100dvh;overflow:hidden;}
  ```

  Change line 19 to (remove `-webkit-overflow-scrolling:touch;`):
  ```css
  .tab-content{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;scroll-behavior:smooth;}
  ```

  > **Why `100dvh`?** `dvh` = dynamic viewport height, which accounts for iOS Safari's collapsible address bar. `100%` propagates upward and can be shorter than the actual visual viewport when the toolbar is hidden.

- [ ] **Step 3: Commit**

  ```bash
  cd ~/Projects/journey-to-hashem
  git add styles/globals.css
  git commit -m "fix: use 100dvh for iOS Safari toolbar compatibility, remove deprecated webkit scroll"
  ```

---

## Task 6: Fix `netlify.toml` — ensure `/api/submit` is not swallowed by catch-all redirect

**Files:**
- Modify: `netlify.toml`

The current `/*` → `/index.html` redirect catches everything. Netlify processes functions before redirects, so in theory `/api/submit` is safe — but adding an explicit `[[functions]]` block and a higher-priority redirect exception makes intent explicit and prevents future surprises.

- [ ] **Step 1: Add `/api/*` passthrough before the catch-all**

  The current file:
  ```toml
  [build]
    command = "npm run build"
    publish = "out"

  [build.environment]
    NETLIFY_NEXT_PLUGIN_SKIP = "true"

  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```

  Replace with:
  ```toml
  [build]
    command = "npm run build"
    publish = "out"

  [build.environment]
    NETLIFY_NEXT_PLUGIN_SKIP = "true"

  [functions]
    directory = "netlify/functions"

  # Functions take priority, but this makes the intent explicit:
  # /api/* is never rewritten to index.html
  [[redirects]]
    from = "/api/*"
    to = "/.netlify/functions/:splat"
    status = 200

  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```

  > **Note:** Netlify Functions with `export const config = { path: '/api/submit' }` in the function file itself (Netlify Functions v2 URL routing) already bypass redirects. This redirect block is belt-and-suspenders for clarity and future compatibility if the config-path syntax is ever dropped.

- [ ] **Step 2: Commit**

  ```bash
  cd ~/Projects/journey-to-hashem
  git add netlify.toml
  git commit -m "fix: add explicit /api/* passthrough in netlify.toml"
  ```

---

## Task 7: Build and deploy, verify live

**Files:** None (deploy only)

- [ ] **Step 1: Run the full deploy**

  ```bash
  cd ~/Projects/journey-to-hashem
  npm run deploy
  ```
  Expected: Next.js builds to `out/`, then `netlify deploy --prod --dir=out` uploads. You'll see a deploy URL like `https://journey-to-hashem.netlify.app`.

- [ ] **Step 2: Verify LiveTab no longer crashes**

  Open https://journey-to-hashem.netlify.app in browser. Tap the **Live** tab. It should render without a blank screen or console `ReferenceError`.

- [ ] **Step 3: Verify waitlist form**

  1. Fill in a name and email in the "Join the Waitlist" card on the Home tab.
  2. Click **Join →** — button should show **Sending…** while the request is in flight.
  3. On success, the card should show the success/done state.
  4. Open DevTools Network tab and confirm the `/api/submit` request returned `200 { success: true }`.

- [ ] **Step 4: Verify rabbi pitch form**

  1. Tap the **Community** tab → **Partner with us** / pitch button.
  2. Fill in name + email, click **Send Message**.
  3. Button should show **Sending…**, then success state after 2s.

- [ ] **Step 5: Verify form validation rejects bad input**

  In DevTools Console, run:
  ```js
  fetch('/api/submit', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ formName: 'evil-store', name: 'x', email: 'x' })
  }).then(r => r.json()).then(console.log)
  ```
  Expected response: `{ error: 'Unknown form' }` with status 400.

- [ ] **Step 6: Check for scroll on iOS (or Chrome DevTools mobile emulation)**

  Open DevTools → Toggle device toolbar → Select iPhone 14 Pro. Navigate between tabs and scroll content. No stuck/frozen scroll should occur.

---

## Self-Review

**Spec coverage check:**
- ✅ LiveTab crash — Task 1
- ✅ `submit.js` whitelist + validation — Task 2
- ✅ Async fetch + loading state — Tasks 3 & 4
- ✅ CSS iOS fragility — Task 5
- ✅ `netlify.toml` routing — Task 6
- ✅ Live verification — Task 7

**Placeholder scan:** None found. All steps contain exact code or commands.

**Type consistency:** No new types introduced. All hook names (`useRef`, `useState`) match line-1 named imports. State variable names (`loading`, `error`, `submitting`, `submitError`) are consistent between declaration and usage steps.
