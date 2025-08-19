export function createPriceFormatter(currency: string, locale: string = 'en-US') {
  const nf = new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 })
  return (amount: number | string) => nf.format(typeof amount === 'string' ? parseFloat(amount) : amount)
}

export function formatPrice(amount: number | string, currency: string, locale: string = 'en-US') {
  return createPriceFormatter(currency, locale)(amount)
}

