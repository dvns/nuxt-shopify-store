export default function formatMoney({
  currencyCode,
  amount,
  locale = 'en-CA',
}) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)
}
