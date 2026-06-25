import { centsToString, toCents } from '@/lib/money'
import type { CartLine } from '@/types/api'

export function cartLineTotal(line: CartLine): string {
  return centsToString(toCents(line.unitPrice) * line.quantity)
}
