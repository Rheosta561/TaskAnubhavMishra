// actions.ts

import { Transaction, BudgetCategory, Category } from '@/constants'
import { predefinedCategories } from '@/constants/mockData'

const TRANSACTION_KEY = 'stored-transactions'
const BUDGET_KEY = 'storedBudgets'
const CATEGORY_KEY = 'categories'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const getMonthStr = (date: Date) => months[date.getMonth()]

// transaction actions 

export const getStoredTransactions = (): Transaction[] => {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(TRANSACTION_KEY)
  try {
    const parsed = JSON.parse(raw || '[]') as Transaction[]
    return parsed.map((t) => ({ ...t, date: new Date(t.date) }))
  } catch {
    return []
  }
}

export const saveTransaction = (txn: Transaction) => {
  const existing = getStoredTransactions()
  const updated = [...existing, txn]
  localStorage.setItem(TRANSACTION_KEY, JSON.stringify(updated))
  updateBudgetSpent()
}

export const updateTransaction = (txn: Transaction) => {
  const existing = getStoredTransactions()
  const updated = existing.map((t) => (t.id === txn.id ? txn : t))
  localStorage.setItem(TRANSACTION_KEY, JSON.stringify(updated))
  updateBudgetSpent()
}

export const deleteTransaction = (id: number) => {
  const existing = getStoredTransactions()
  const updated = existing.filter((t) => t.id !== id)
  localStorage.setItem(TRANSACTION_KEY, JSON.stringify(updated))
  updateBudgetSpent()
}

// budget actions

export function getStoredBudgets(): BudgetCategory[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(BUDGET_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveBudget(budget: BudgetCategory): void {
  const existing = getStoredBudgets()
  const updated = [...existing.filter((b) => b.name !== budget.name), budget]
  localStorage.setItem(BUDGET_KEY, JSON.stringify(updated))
}

export function deleteBudget(name: string): void {
  const existing = getStoredBudgets()
  const updated = existing.filter((b) => b.name !== name)
  localStorage.setItem(BUDGET_KEY, JSON.stringify(updated))
}

export function updateBudgetSpent() {
  const transactions = getStoredTransactions()
  const budgets = getStoredBudgets()
  const map: Record<string, number> = {}

  transactions.forEach((t) => {
    const month = getMonthStr(new Date(t.date))
    const key = `${t.category}-${month}`
    map[key] = (map[key] || 0) + t.amount
  })

  const updated = budgets.map((b) => ({
    ...b,
    spent: map[b.name] || 0,
  }))

  localStorage.setItem(BUDGET_KEY, JSON.stringify(updated))
}

// category actions

export const getStoredCategories = (): Category[] => {
  if (typeof window === 'undefined') return []

  const data = localStorage.getItem(CATEGORY_KEY)

  if (!data) {

    // fallback to store the predefined categories 
    localStorage.setItem(CATEGORY_KEY, JSON.stringify(predefinedCategories))
    return predefinedCategories
  }

  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}
//saving the category 
export const saveCategory = (category: Category) => {
  const existing = getStoredCategories()
  const updated = [...existing, category]
  localStorage.setItem(CATEGORY_KEY, JSON.stringify(updated))
}


// deleting category , removing from the local storage 
export const deleteCategory = (name: string) => {
  const updated = getStoredCategories().filter((c) => c.name !== name)
  localStorage.setItem(CATEGORY_KEY, JSON.stringify(updated))
}
