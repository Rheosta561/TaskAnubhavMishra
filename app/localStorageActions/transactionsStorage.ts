import { Transaction, BudgetCategory } from '@/constants'

const TRANSACTION_KEY = 'stored-transactions'
const BUDGET_KEY = 'storedBudgets'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const getMonthStr = (date: Date) => months[date.getMonth()]

// fetching stored transactions from the local storage , 
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

// fetching stored budgets from the local storage 
export const getStoredBudgets = (): BudgetCategory[] => {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(BUDGET_KEY)
  try {
    return JSON.parse(raw || '[]') as BudgetCategory[]
  } catch {
    return []
  }
}

// saving the budget 
export const saveBudgets = (budgets: BudgetCategory[]) => {
  localStorage.setItem(BUDGET_KEY, JSON.stringify(budgets))
}
// updating the spent of budgetCategory
export const updateBudgetSpent = () => {
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

  saveBudgets(updated)
}

// saving transaction after validation 
export const saveTransaction = (txn: Transaction) => {
  const existing = getStoredTransactions()
  const updated = [...existing, txn]
  localStorage.setItem(TRANSACTION_KEY, JSON.stringify(updated))
  updateBudgetSpent()
}
// updating the transaction
export const updateTransaction = (txn: Transaction) => {
  const existing = getStoredTransactions()
  const updated = existing.map((t) => (t.id === txn.id ? txn : t))
  localStorage.setItem(TRANSACTION_KEY, JSON.stringify(updated))
  updateBudgetSpent()
}

// deleting the transaction 

export const deleteTransaction = (id: number) => {
  const existing = getStoredTransactions()
  const updated = existing.filter((t) => t.id !== id)
  localStorage.setItem(TRANSACTION_KEY, JSON.stringify(updated))
  updateBudgetSpent()
}
