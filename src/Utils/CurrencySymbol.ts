export default function getCurrencySymbol(currency: string): string {
  console.log(currency);
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  });

  const parts = formatter.formatToParts(1);
  const symbolPart = parts.find(p => p.type === 'currency');

  // Garantir que não seja undefined
  return symbolPart ? symbolPart.value : '';
}
