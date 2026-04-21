import '../styles/globals.css'
export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <div className="bh-badge" aria-label="B'ezrat Hashem — with God's help">B&quot;H</div>
    </>
  )
}
