import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Transaction schema (same as in transactionActions.ts)
const transactionSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive().max(999999999),
  description: z.string().max(250).trim().optional(),
  category: z.string().min(1).max(50).trim(),
  date: z.string().optional(),
}).strict()

// Budget schema (same as in budgetActions.ts)
const budgetSchema = z.object({
  id: z.string().optional(),
  category: z.string().min(1, 'Category is required').max(50).trim(),
  month: z.string().min(1, 'Month is required').regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  amount: z.coerce.number().positive('Amount must be positive').min(0.01).max(999999999),
}).strict()

describe('Transaction Validation', () => {
  it('validates valid transaction', () => {
    const valid = {
      type: 'expense',
      amount: '100.50',
      category: 'Food',
    }
    expect(() => transactionSchema.parse(valid)).not.toThrow()
  })

  it('rejects invalid type', () => {
    const invalid = {
      type: 'invalid',
      amount: '100',
      category: 'Food',
    }
    expect(() => transactionSchema.parse(invalid)).toThrow()
  })

  it('rejects negative amount', () => {
    const invalid = {
      type: 'expense',
      amount: '-100',
      category: 'Food',
    }
    expect(() => transactionSchema.parse(invalid)).toThrow()
  })

  it('rejects empty category', () => {
    const invalid = {
      type: 'expense',
      amount: '100',
      category: '',
    }
    expect(() => transactionSchema.parse(invalid)).toThrow()
  })

  it('rejects category too long', () => {
    const invalid = {
      type: 'expense',
      amount: '100',
      category: 'a'.repeat(51),
    }
    expect(() => transactionSchema.parse(invalid)).toThrow()
  })
})

describe('Budget Validation', () => {
  it('validates valid budget', () => {
    const valid = {
      category: 'Food',
      month: '2024-01',
      amount: '500',
    }
    expect(() => budgetSchema.parse(valid)).not.toThrow()
  })

  it('rejects invalid month format', () => {
    const invalid = {
      category: 'Food',
      month: '01-2024',
      amount: '500',
    }
    expect(() => budgetSchema.parse(invalid)).toThrow()
  })

  it('rejects month out of range', () => {
    const invalid = {
      category: 'Food',
      month: '2024-13',
      amount: '500',
    }
    expect(() => budgetSchema.parse(invalid)).toThrow()
  })

  it('rejects zero amount', () => {
    const invalid = {
      category: 'Food',
      month: '2024-01',
      amount: '0',
    }
    expect(() => budgetSchema.parse(invalid)).toThrow()
  })

  it('rejects negative amount', () => {
    const invalid = {
      category: 'Food',
      month: '2024-01',
      amount: '-100',
    }
    expect(() => budgetSchema.parse(invalid)).toThrow()
  })
})
