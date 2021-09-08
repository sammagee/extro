export const scrollTo = (element: HTMLElement): void => {
  const rect = element.getBoundingClientRect()
  const top = (document.body.clientHeight - rect.top + rect.height / 2) / 2
  window.scrollTo({ top, left: 0, behavior: 'smooth' })
}
