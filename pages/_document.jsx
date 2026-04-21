import { Html, Head, Main, NextScript } from 'next/document'
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ── Primary ── */}
        <title>Journey to Hashem — Find your path home</title>
        <meta name="description" content="A Jewish learning platform for anyone finding their way back. 25 structured lessons, daily progress, and a community of learners and teachers. Launching Q3 2026." />
        <meta name="application-name" content="Journey to Hashem" />
        <meta name="theme-color" content="#0d1b2a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="JtH" />
        {/* ── Favicon & touch icon ── */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        {/* ── Open Graph ── */}
        <meta property="og:title" content="Journey to Hashem — Find your path home" />
        <meta property="og:description" content="A Jewish learning platform for anyone finding their way back. Launching Q3 2026." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://journey-to-hashem.netlify.app" />
        <meta property="og:type" content="website" />
        {/* ── Twitter ── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Journey to Hashem" />
        <meta name="twitter:description" content="Find your path home. Launching Q3 2026." />
        <meta name="twitter:image" content="/og-image.png" />
        {/* ── Fonts ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" crossOrigin="anonymous" />
      </Head>
      <body style={{ margin: 0, background: '#06101a' }}>
        {/* Netlify Forms detection — hidden, required for static export */}
        <form name="rabbi-interest" data-netlify="true" hidden>
          <input type="text" name="name" />
          <input type="text" name="synagogue" />
          <input type="email" name="email" />
          <input type="tel" name="phone" />
          <textarea name="message"></textarea>
        </form>
        <form name="user-waitlist" data-netlify="true" hidden>
          <input type="text" name="name" />
          <input type="email" name="email" />
        </form>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
