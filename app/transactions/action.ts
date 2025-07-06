'use client'

import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import { Transaction } from '@/constants'

export function exportTransactionsAsExcel(transactions: Transaction[]) {
  if (!transactions || transactions.length === 0) return

  // Prepare data
  const data = transactions.map((txn) => ({
    ID: txn.id,
    Category: txn.category,
    Amount: txn.amount,
    Description: txn.description,
    Date: new Date(txn.date).toLocaleDateString(),
  }))

  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions')

  // Generate buffer and download
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  })

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  saveAs(blob, 'transactions.xlsx')
}
