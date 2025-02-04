export const autoScrollToElement = (element: HTMLElement) => {
  const pos = element.getBoundingClientRect()

  const isCenteredEnough = pos.bottom > window.innerHeight * 0.75 || pos.top < window.innerHeight * 0.25
  if (isCenteredEnough) return

  window.scrollTo({ top: pos.top + pos.height / 2 + window.scrollY - window.innerHeight / 2, behavior: 'smooth' })
}
