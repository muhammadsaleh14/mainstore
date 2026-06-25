import type { ProductVariant } from '@/types/api'

export function formatPriceRange(variants: ProductVariant[]): string {
  if (variants.length === 0) return '—'
  const prices = variants.map((v) => Number(v.price))
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  if (min === max) return `$${min.toFixed(2)}`
  return `$${min.toFixed(2)} – $${max.toFixed(2)}`
}

export function getDefaultVariant(variants: ProductVariant[]) {
  return variants.find((v) => v.isDefault) ?? variants[0] ?? null
}
