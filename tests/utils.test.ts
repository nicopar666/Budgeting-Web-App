import { describe, it, expect } from 'vitest'
import { formatCurrency, monthKey, formatDate, cn } from '@/lib/utils'

describe('formatCurrency', () => {
  it('formats number as Philippine Peso', () => {
    expect(formatCurrency(1000)).toContain('₱')
    expect(formatCurrency(1000)).toContain('1,000.00')
  })

  it('handles zero', () => {
    expect(formatCurrency(0)).toContain('0')
  })

  it('handles decimal values', () => {
    expect(formatCurrency(99.99)).toContain('99.99')
  })
})

describe('monthKey', () => {
  it('returns correct month key format', () => {
    const date = new Date(2024, 0, 15) // January 2024
    expect(monthKey(date)).toBe('2024-01')
  })

  it('pads month with zero', () => {
    const date = new Date(2024, 8, 1) // September 2024
    expect(monthKey(date)).toBe('2024-09')
  })
})

describe('formatDate', () => {
  it('formats date string correctly', () => {
    const result = formatDate('2024-01-15')
    expect(result).toContain('01')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('handles Date object', () => {
    const result = formatDate(new Date('2024-01-15'))
    expect(result).toContain('01')
  })
})

describe('cn', () => {
  it('merges class names', () => {
    const result = cn('foo', 'bar')
    expect(result).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    const result = cn('foo', false && 'bar', 'baz')
    expect(result).toBe('foo baz')
  })
})
