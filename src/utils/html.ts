/**
 * This utility takes the document styles and the contents of a given
 * selector and downloads that content to a file with a specified
 * filename.
 */
export const downloadHtml = (
  filename: string = 'export',
  selector: string
): void => {
  const link = document.createElement('a')
  const styles = encodeURIComponent(
    `
    <style>
      ${[...document.styleSheets]
        .map((sheet) =>
          [...sheet.cssRules].map((rule) => rule.cssText).join('')
        )
        .join('')}
      body {
        align-items: center;
        display: flex;
        justify-content: center;
        min-height: 100vh;
      }
      #messages {
        max-width: 32rem;
        padding: 2rem;
        width: 100%;
      }
    </style>`.replace(/(\r\n|\n|\r)/g, '')
  )
  const markup = encodeURIComponent(
    (document.getElementById(selector)?.outerHTML || '').replace(
      /(\r\n|\n|\r)/g,
      ''
    )
  )

  link.href = `data:text/html,${styles}${markup}`
  link.download = `${filename}.html`

  document.body.appendChild(link)

  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  )

  document.body.removeChild(link)
}
