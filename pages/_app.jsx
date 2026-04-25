import '../styles/globals.css'
import { useEffect } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (POSTHOG_KEY && typeof window !== 'undefined') {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        capture_pageview: true,
        capture_pageleave: true,
        persistence: 'localStorage',
        autocapture: false, // manual events only — keep signal clean
      })
      window.posthog = posthog
    }
  }, [])

  return (
    <PostHogProvider client={posthog}>
      <Component {...pageProps} />
      <div className="bh-badge" aria-label="B'ezrat Hashem — with God's help">B&quot;H</div>
    </PostHogProvider>
  )
}
