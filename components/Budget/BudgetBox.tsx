'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {  Plus, Trash2, Wallet } from 'lucide-react'
import {  getMonth } from 'date-fns'
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip
} from 'recharts'
import { Category, BudgetCategory, Transaction } from '@/constants'
import { toast } from 'sonner'
import { GenerateInsights } from '@/app/transactions/action'
import InsightCard from './InsightCard'
import {
  getStoredCategories, saveCategory, deleteCategory
} from '@/app/localStorageActions/action'
import {
  getStoredBudgets, saveBudget, deleteBudget, getStoredTransactions
} from '@/app/localStorageActions/action'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const BudgetBox = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [budgets, setBudgets] = useState<BudgetCategory[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())

  const [categoryForm, setCategoryForm] = useState({ name: '', color: '#ccc' })
  const [budgetForm, setBudgetForm] = useState({ name: '', limit: '' })
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false)
  const [openBudgetDialog, setOpenBudgetDialog] = useState(false)

  const [insights, setInsights] = useState<{ heading: string; description: string }[]>([])
  const [loadingInsights, setLoadingInsights] = useState(false)

  useEffect(() => {
    setCategories(getStoredCategories())
    setBudgets(getStoredBudgets())
    setTransactions(getStoredTransactions())
  }, [])

  const handleAddCategory = () => {
    const trimmedName = categoryForm.name.trim()
    if (!trimmedName) return toast.error('Category name required')

    const exists = categories.some(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
    )

    if (exists) return toast.error('Category already exists')

    const newCat: Category = { name: trimmedName, color: categoryForm.color }
    saveCategory(newCat)
    setCategories((prev) => [...prev, newCat])
    toast.success('Category added')
    setCategoryForm({ name: '', color: '#ccc' })
    setOpenCategoryDialog(false)
  }

  const handleDeleteCategory = (name: string) => {
    deleteCategory(name)
    setCategories((prev) => prev.filter((c) => c.name !== name))
    toast.success('Category deleted')
  }

  const handleAddBudget = () => {
    if (!budgetForm.name || !budgetForm.limit) return toast.error('Fill all fields')

    const monthStr = months[selectedMonth]
    const id = `${budgetForm.name}-${monthStr}`

    if (budgets.find((b) => b.name === id)) return toast.error('Budget already exists')

    const cat = categories.find((c) => c.name === budgetForm.name)
    if (!cat) return toast.error('Category not found')

    const newBudget: BudgetCategory = {
      name: id,
      color: cat.color,
      spent: 0,
      limit: Number(budgetForm.limit)
    }

    saveBudget(newBudget)
    setBudgets((prev) => [...prev, newBudget])
    toast.success('Budget created')
    setBudgetForm({ name: '', limit: '' })
    setOpenBudgetDialog(false)
  }

  const handleDeleteBudget = (name: string) => {
    deleteBudget(name)
    setBudgets((prev) => prev.filter((b) => b.name !== name))
    toast.success('Budget deleted')
  }

  useEffect(() => {
    const map: Record<string, number> = {}
    transactions.forEach((t) => {
      const monthStr = months[getMonth(new Date(t.date))]
      const key = `${t.category}-${monthStr}`
      map[key] = (map[key] || 0) + t.amount
    })

    setBudgets((prev) =>
      prev.map((b) => ({ ...b, spent: map[b.name] || 0 }))
    )
  }, [transactions])

  const filteredBudgets = useMemo(() => {
    const monthStr = months[selectedMonth]
    return budgets.filter((b) => b.name.endsWith(monthStr))
  }, [budgets, selectedMonth])

  const chartData = filteredBudgets.map((b) => ({
    name: b.name.split('-')[0],
    spent: b.spent,
    limit: b.limit
  }))

  const handleGenerateInsights = async () => {
    setLoadingInsights(true)
    const data = await GenerateInsights(filteredBudgets)
    setInsights(data)
    setLoadingInsights(false)
  }

  return (
    <div className="h-full w-full space-y-6 overflow-auto p-4">
      <div className="flex items-center gap-2">
        <Wallet className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Budget Overview</h1>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold">Categories</h2>
        <Dialog open={openCategoryDialog} onOpenChange={setOpenCategoryDialog}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>Create a new spending category.</DialogDescription>
            <div className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Color</Label>
                <Input
                  type="color"
                  value={categoryForm.color}
                  onChange={(e) =>
                    setCategoryForm((f) => ({ ...f, color: e.target.value }))
                  }
                />
              </div>
              <Button className="w-full" onClick={handleAddCategory}>
                Add
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

     {categories.length === 0 ? (
  <div className="text-sm text-muted-foreground mt-2">
    No categories yet.{' '}
    <button
      className="text-blue-600 underline"
      onClick={() => setOpenCategoryDialog(true)}
    >
      Create one now.
    </button>
  </div>
) : (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
    {categories.map((c) => (
      <Card key={c.name} className="p-3 rounded-sm flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
          <span className="text-sm font-medium">{c.name}</span>
        </div>
        <Button size="icon" variant="ghost" onClick={() => handleDeleteCategory(c.name)}>
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </Card>
    ))}
  </div>
)}


      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">

        <div className="flex items-center gap-3 ">
          <Label>Select Month</Label>
          <Select value={months[selectedMonth]} onValueChange={(v) => setSelectedMonth(months.indexOf(v))}>
            <SelectTrigger className="w-[160px] h-8 text-sm">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={openBudgetDialog} onOpenChange={setOpenBudgetDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" /> Create Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Set Budget</DialogTitle>
            <DialogDescription>Create a monthly budget for a category.</DialogDescription>
            <div className="space-y-4">
              <div>
                <Label>Category</Label>
                <Select value={budgetForm.name} onValueChange={(v) => setBudgetForm((f) => ({ ...f, name: v }))}>
                  <SelectTrigger className="w-full h-9 text-sm">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Limit</Label>
                <Input
                  type="number"
                  value={budgetForm.limit}
                  onChange={(e) => setBudgetForm((f) => ({ ...f, limit: e.target.value }))}
                />
              </div>
              <Button onClick={handleAddBudget} className="w-full">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredBudgets.map((b) => (
          <Card key={b.name} className="p-3 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
              <span className="text-sm font-medium">{b.name.split('-')[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                ₹{b.spent} / ₹{b.limit}
              </span>
              <Button size="icon" variant="ghost" onClick={() => handleDeleteBudget(b.name)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="limit" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spent" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold">Spending Insights</h2>
        <Button size="sm" variant="outline" onClick={handleGenerateInsights}>
          Generate
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id='insights'>
        {loadingInsights
          ? Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="rounded-sm animate-pulse h-28 bg-muted" />
            ))
          : insights.map((insight, i) => (
              <InsightCard key={i} title={insight.heading} description={insight.description} />
            ))}
      </div>
    </div>
  )
}

export default BudgetBox
