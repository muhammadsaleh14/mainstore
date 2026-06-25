export function toCents(amount: string): number {
  return Math.round(Number(amount) * 100)
}

export function centsToString(cents: number): string {
  return (cents / 100).toFixed(2)
}
