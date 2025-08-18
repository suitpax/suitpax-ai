export function setBodyScrollability(canScroll: boolean) {
  if (typeof document === 'undefined') return
  document.body.style.overflow = canScroll ? '' : 'hidden'
}

