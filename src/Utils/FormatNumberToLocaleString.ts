export default function FormatNumberToLocaleString(
  value: number,
  digits: number,
): string {
  const formattedNumber = Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
  });

  return formattedNumber;
}
