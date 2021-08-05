import NextDocument, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

export default class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await NextDocument.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
      <Html className="font-sans antialiased">
        <Head />
        <body className="bg-gray-900">
          <Main />

          <NextScript />
        </body>
      </Html>
    )
  }
}
