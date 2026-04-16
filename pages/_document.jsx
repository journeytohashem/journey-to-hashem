import { Html, Head, Main, NextScript } from 'next/document'
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="application-name" content="Journey to HaShem" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="JtH" />
        <meta name="theme-color" content="#0d1b2a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="description" content="The most accessible Jewish learning app — Duolingo for Torah." />
        <meta property="og:title" content="Journey to HaShem" />
        <meta property="og:description" content="Learn Torah daily. Structured lessons, prayers, live rabbis." />
        <meta property="og:type" content="website" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" crossOrigin="anonymous" />
      </Head>
      <body style={{ margin: 0, background: '#06101a' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
