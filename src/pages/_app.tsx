import type { AppProps } from 'next/app'
import Head from 'next/head'
import '@/css/app.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
