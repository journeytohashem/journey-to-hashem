# Journey to HaShem — Next.js App

## Deploy to Netlify in 2 minutes (free, real URL)

### Option A — Drag & Drop (no account needed for first deploy)
1. Go to **[netlify.com/drop](https://netlify.com/drop)**
2. Drag the **`out/`** folder from this project into the browser window
3. You get a live URL instantly — e.g. `https://amazing-name-123.netlify.app`
4. Share that link with rabbis, beta users, anyone

> The `out/` folder is already built and included. You don't need to run anything.

---

### Option B — GitHub + auto-deploy (recommended for ongoing updates)

1. Push this folder to a GitHub repo:
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/journey-to-hashem.git
git push -u origin main
```

2. Go to **[app.netlify.com](https://app.netlify.com)** → "Add new site" → "Import from Git"
3. Select your repo
4. Settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `out`
5. Click **Deploy site**
6. Every future `git push` auto-deploys

---

### Custom Domain (optional, ~$12/year)
- Buy `journeytohashem.com` on Namecheap or Google Domains
- In Netlify: Site settings → Domain management → Add custom domain
- Free HTTPS included automatically

---

## Add to iPhone Home Screen (PWA — works like a native app)
1. Open the live Netlify URL in **Safari** on iPhone
2. Tap the **Share** button (box with arrow)
3. Tap **"Add to Home Screen"**
4. The app opens full-screen with no browser chrome

---

## Local Development
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Rebuild after changes
```bash
npm run build
# Then re-drag the `out/` folder to Netlify, or just push to GitHub
```

---

## Project Structure
```
pages/
  index.jsx       ← entire app (all components + data)
  _app.jsx        ← CSS imports
  _document.jsx   ← PWA meta tags, fonts
styles/
  globals.css     ← all app CSS
public/
  manifest.json   ← PWA manifest
  icon.svg        ← app icon (replace with real PNG before App Store)
netlify.toml      ← Netlify build config (already set up)
out/              ← pre-built static files (deploy this folder)
```

## Next Steps (Roadmap)
- [ ] Add real app icons (1024×1024 PNG) to `public/`
- [ ] Set up Supabase for user accounts + cross-device sync
- [ ] Add OneSignal for push notifications
- [ ] Add Stripe for $9.99/month premium tier
- [ ] Wrap with Capacitor → App Store + Google Play
