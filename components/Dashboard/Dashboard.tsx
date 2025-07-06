'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Button } from '../ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../ui/card'
import {
  LayoutDashboard,
  BarChart3,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Repeat,
} from 'lucide-react'
import { Separator } from '../ui/separator'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from 'recharts'
import { Calendar } from '../ui/calendar'
import { format } from 'date-fns'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select'
import { toast } from 'sonner'
import { z } from 'zod'

import { getStoredBudgets } from '@/app/localStorageActions/action'
import { getStoredTransactions } from '@/app/localStorageActions/transactionsStorage'
import { Transaction, Category } from '@/constants'

import {
  predefinedCategories,
  transactions as mockTransactions,
  mockBudgets,

} from '@/constants/mockData'

function Dashboard() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [pageMap, setPageMap] = useState<{ [category: string]: number }>({})
  const [budgets, setBudgets] = useState(getStoredBudgets())
  const [transactions, setTransactions] = useState<Transaction[]>(getStoredTransactions())
  const [categories, setCategories] = useState<Category[]>([])
  const [mockMode, setMockMode] = useState(false)

  const ITEMS_PER_PAGE = 3
  const today = new Date()
  today.setHours(23, 59, 59, 999)

  const dateRangeSchema = z
    .object({ from: z.date(), to: z.date() })
    .refine((range) => range.from <= today && range.to <= today, {
      message: 'Cannot select a future date',
    })

  useEffect(() => {
    if (mockMode) {
      setBudgets(mockBudgets || [])
      setTransactions(mockTransactions)
      setCategories(predefinedCategories)
    } else {
      const storedBudgets = getStoredBudgets()
      const storedTxns = getStoredTransactions()

      setBudgets(storedBudgets)
      setTransactions(storedTxns)

      const catMap: { [name: string]: string } = {}
      storedBudgets.forEach((b) => {
        const cat = b.name.split('-')[0]
        catMap[cat] = b.color
      })
      const catList = Object.entries(catMap).map(([name, color]) => ({ name, color }))
      setCategories(catList)
    }
  }, [mockMode, dateRange])

  useEffect(() => {
    setPageMap({})
  }, [dateRange])

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((txn) => {
        if (!dateRange || !dateRange.from) return true
        const txnDate = new Date(txn.date)
        const from = new Date(dateRange.from)
        from.setHours(0, 0, 0, 0)
        const to = dateRange.to ? new Date(dateRange.to) : new Date(dateRange.from)
        to.setHours(23, 59, 59, 999)
        return txnDate >= from && txnDate <= to
      })
      .sort((a, b) => {
        if (sortBy === 'amount') return b.amount - a.amount
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
  }, [transactions, dateRange, sortBy])

  // total balance is the summation of budget limit of all the categories 
  const totalBalance = useMemo(() => {
    return budgets.reduce((sum, b) => sum + (b.limit || 0), 0)
  }, [budgets])


  // total balance is the summation of budget spent of all the categories 
  const totalExpenses = useMemo(() => {
    return budgets.reduce((sum, b) => sum + (b.spent || 0), 0)
  }, [budgets])

  // savings = total limit -total spent 
  const savingsData = useMemo(() => {
    return budgets.map((b) => ({
      date: b.name.split('-')[1] || '',
      amount: Math.max((b.limit || 0) - (b.spent || 0), 0),
    }))
  }, [budgets])

  return (
    <div className="h-full w-full p-4 bg-muted/20 border rounded-sm overflow-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-primary" />
          Dashboard
        </h1>
        <p className="text-primary/75 text-sm">
          Welcome back. Here is a quick look at your finances
        </p>
      </div>

      {budgets.length === 0 && transactions.length === 0 && !mockMode && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">No data found.</p>
          <Button
            variant="outline"
            onClick={() => {
              setMockMode(true)
              toast.success('Mock data loaded')
            }}
            className="mt-2"
          >
            Use Mock Data
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="rounded-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalBalance}</div>
            <p className="text-xs text-muted-foreground">Based on all budgets</p>
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalExpenses}</div>
            <p className="text-xs text-muted-foreground">Spent across categories</p>
          </CardContent>
        </Card>

       <Card className="rounded-sm">
  <CardHeader className="flex items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium">Budget Overview</CardTitle>
  </CardHeader>
  <CardContent className="h-[180px] -mt-2">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        {budgets.map((b, index) => {

          // filling the pie chart based on spent/limit 
          const spent = b.spent || 0
          const limit = b.limit || 1 // fallback to prevent division by zero 
          const remaining = Math.max(limit - spent, 0)
          return (
            <Pie
              key={b.name}
              data={[
                { name: 'Spent', value: spent },
                { name: 'Remaining', value: remaining },
              ]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={30 + index * 15}
              outerRadius={40 + index * 15}
              startAngle={90}
              endAngle={-270}
              paddingAngle={0}
            >
              <Cell fill={b.color} />
              <Cell fill="#e5e7eb" /> 
            </Pie>
          )
        })}
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
    <div className="flex justify-center gap-4 text-xs text-muted-foreground mt-1">
      {budgets.map((b) => (
        <div key={b.name} className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: b.color }}
          ></span>
          {b.name.split('-')[0]} 
        </div>
      ))}
    </div>
  </CardContent>
</Card>

      </div>

      <Separator />

      <div className="mt-8 border p-2 rounded-sm">
        <div className="w-full flex items-center gap-2 mb-4">
          <Repeat className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Transactions</h2>
        </div>

<div className="flex flex-col lg:flex-row gap-4 mb-6">
  {/* Sort Selector */}
  <div className="flex-1">
    <div className="mb-2 text-sm text-muted-foreground">Sort by</div>
    <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'date' | 'amount')}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="date">Date</SelectItem>
        <SelectItem value="amount">Amount</SelectItem>
      </SelectContent>
    </Select>
  </div>


  <div className="flex flex-col items-center gap-2 border rounded-md p-2 w-full lg:w-[300px]">
    <Calendar
      mode="range"
      selected={dateRange}
      onSelect={(range) => {
        if (range?.from && range?.to) {
          const parsed = dateRangeSchema.safeParse({
            from: range.from,
            to: range.to,
          })
          if (!parsed.success) {
            toast.error(parsed.error.errors[0].message)
            return
          }
          setDateRange({ from: range.from, to: range.to })
        } else {
          setDateRange(undefined)
        }
      }}
    />
    <span className="text-xs text-muted-foreground">
      {dateRange?.from && dateRange?.to
        ? `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`
        : 'Select date range'}
    </span>
  </div>


  <div className="border rounded-md p-2 flex-1">
    <p className="text-sm font-medium mb-1">Savings Over Time</p>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={savingsData}>
        <XAxis dataKey="date" fontSize={10} />
        <YAxis fontSize={10} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ r: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const txns = filteredTransactions.filter((t) => t.category === cat.name)
            if (txns.length === 0) return null

            const page = pageMap[cat.name] || 0
            const totalPages = Math.ceil(txns.length / ITEMS_PER_PAGE)
            const paginatedTxns = txns.slice(
              page * ITEMS_PER_PAGE,
              page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
            )

            const goToPage = (newPage: number) => {
              setPageMap((prev) => ({ ...prev, [cat.name]: newPage }))
            }

            return (
              <Card key={cat.name} className="rounded-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ background: cat.color }}
                    />
                    {cat.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  {paginatedTxns.map((t) => (
                    <div key={t.id} className="flex justify-between text-muted-foreground">
                      <div>
                        <div className="font-medium text-black dark:text-white">{t.description}</div>
                        <div className="text-xs">{format(new Date(t.date), 'MMM d, yyyy')}</div>
                      </div>
                      <div className="text-right font-semibold text-black dark:text-white">
                        ₹{t.amount}
                      </div>
                    </div>
                  ))}

                  {totalPages > 1 && (
                    <div className="flex justify-between items-center pt-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={page === 0}
                        onClick={() => goToPage(page - 1)}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        Page {page + 1} of {totalPages}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={page + 1 >= totalPages}
                        onClick={() => goToPage(page + 1)}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
