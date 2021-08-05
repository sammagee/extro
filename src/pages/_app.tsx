import type { AppProps } from 'next/app'
import Head from 'next/head'
import '@/css/app.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" sizes="196x196" href="/favicon.png" />
      </Head>

      <Component {...pageProps} />
    </>
  )
}
