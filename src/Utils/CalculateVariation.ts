export default function CalculateVariation(
  currentValue: number,
  previousValue: number,
): number {
  if (currentValue === 0 || previousValue === 0) {
    return 0;
  } else {
    return (currentValue / previousValue) * 100 - 100;
  }
}
