import { CurrencyCode, Locale } from './enums'

export default function formatCurrency(
  locale: keyof typeof Locale,
  currency: keyof typeof CurrencyCode
): Intl.NumberFormat {
  return new Intl.NumberFormat(Locale[locale], {
    style: 'currency',
    currency,
  })
}
