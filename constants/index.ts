export interface Category {
  name: string

  color: string
}

export interface BudgetCategory extends Category {
  limit: number
  spent: number
}

export interface Transaction {
  id: number
  category: string
  amount: number
  date: Date
  description: string
}
