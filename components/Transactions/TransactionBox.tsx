'use client'

import React, { useState, useMemo } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
} from 'recharts'
import { format } from 'date-fns'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { exportTransactionsAsExcel } from '@/app/transactions/action'
import { Transaction } from '@/constants'
import { predefinedCategories } from '@/constants/mockData'
import {z} from 'zod';
import { toast } from 'sonner'

export interface Category {
  name: string
  amount: number
  color: string
}





const defaultCategories: Category[] = [
  { name: 'Food', amount: 0, color: '#FF5733' },
  { name: 'Transport', amount: 0, color: '#4287f5' },
  { name: 'Shopping', amount: 0, color: '#FFC300' },
]

function TransactionBox(){

    //zod validation for adding transactions
    const transactionSchema = z.object({
        amount: z.string().min(1, 'Amount is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  category: z.string().min(1, 'Category is required'),

    })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [form, setForm] = useState({ amount: '', description: '', date: '', category: '' })
  const [filterCategory, setFilterCategory] = useState<string>('All')
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAddOrUpdate = () => {
  const result = transactionSchema.safeParse(form)
  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join(', ')
    toast.error('Validation Error', {
      description: message,
    })
    return
  }

  const updated: Transaction = {
    id: editing ? editing.id : Date.now(),
    amount: Number(form.amount),
    description: form.description,
    category: form.category,
    date: new Date(form.date),
  }

  setTransactions((prev) =>
    editing ? prev.map((t) => (t.id === editing.id ? updated : t)) : [...prev, updated]
  )

  setForm({ amount: '', description: '', date: '', category: '' })
  setEditing(null)
  setDialogOpen(false)

  toast.success(`Transaction ${editing ? 'updated' : 'added'} successfully`)
}


  const handleEdit = (txn: Transaction) => {
    setEditing(txn)
    setForm({
      amount: txn.amount.toString(),
      description: txn.description,
      date: txn.date.toISOString().split('T')[0],
      category: txn.category,
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setTransactions((prev) => prev.filter((txn) => txn.id !== id))
  }

  const filteredTxns = useMemo(() => {
    return filterCategory === 'All'
      ? transactions
      : transactions.filter((t) => t.category === filterCategory)
  }, [transactions, filterCategory])

  const monthlyData = filteredTxns.reduce((acc: { [key: string]: number }, txn) => {
    const key = format(new Date(txn.date), 'MMM yyyy')
    acc[key] = (acc[key] || 0) + txn.amount
    return acc
  }, {})

  const chartData = Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount,
  }))

  return (
    <div className="overflow-auto p-2 space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-muted-foreground text-sm">Manage and view your expenses.</p>
      </div>

      <Card className='rounded-sm'>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Monthly Expenses</CardTitle>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[160px] text-xs h-8">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" className='rounded-sm'>All</SelectItem>
              {defaultCategories.map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="gap-1 rounded-sm">
              <Plus className="w-4 h-4" /> Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{editing ? 'Edit Transaction' : 'New Transaction'}</DialogTitle>
            <DialogDescription>Enter transaction details below.</DialogDescription>
            <div className="space-y-4 mt-2">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="desc">Description</Label>
                <Input
                  id="desc"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="border rounded-md w-full p-2 text-sm"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  <option value="">Select category</option>
                  {defaultCategories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleAddOrUpdate} className="w-full">
                {editing ? 'Update' : 'Add'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          onClick={() => exportTransactionsAsExcel(transactions)}
          className="gap-1 rounded-sm"
        >
          Export
        </Button>
      </div>

      <Card className='rounded-sm'>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredTxns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions to show.</p>
          ) : (
            filteredTxns.map((txn) => (
            <div key={txn.id} className="flex justify-between items-center border p-2 rounded-sm">
  <div>
    <div className="font-medium">₹{txn.amount}</div>
    <div className="text-xs text-muted-foreground">{txn.description}</div>
    <div className="text-xs text-muted-foreground flex items-center gap-2">
      <span
        className="inline-block w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: predefinedCategories.find((cat) => cat.name === txn.category)?.color || '#ccc' }}
      />
      <span>{txn.category}</span> • {format(new Date(txn.date), 'MMM d, yyyy')}
    </div>
  </div>
  <div className="flex gap-2">
    <Button size="icon" variant="ghost" onClick={() => handleEdit(txn)}>
      <Pencil className="w-4 h-4" />
    </Button>
    <Button size="icon" variant="ghost" onClick={() => handleDelete(txn.id)}>
      <Trash2 className="w-4 h-4 text-red-500" />
    </Button>
  </div>
</div>

            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default TransactionBox
