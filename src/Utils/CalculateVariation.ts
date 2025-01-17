export default function CalculateVariation(
  currentValue: number,
  previousValue: number,
): number {
  return (currentValue / previousValue) * 100 - 100;
}
