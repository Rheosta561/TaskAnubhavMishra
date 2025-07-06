'use server'

import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import { Transaction } from '@/constants'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { BudgetCategory } from '@/constants'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)


export async function exportTransactionsAsExcel(transactions: Transaction[]) {
  if (!transactions || transactions.length === 0) return

  // preparing the data
  const data = transactions.map((txn) => ({
    ID: txn.id,
    Category: txn.category,
    Amount: txn.amount,
    Description: txn.description,
    Date: new Date(txn.date).toLocaleDateString(),
  }))

  
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions')

  // download buffer
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  })

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  saveAs(blob, 'transactions.xlsx')
}






// generating insights using gemini
export async function GenerateInsights(categories: BudgetCategory[]) {

  const prompt = `
You are a financial assistant. Based on the following category-wise budget and spending data, give 2 short insights. 
Each insight should have a short title (3-5 words) and a short description (1-2 lines).

Data:
${categories.map((c) => `- ${c.name}: limit ₹${c.limit}, spent ₹${c.spent}`).join('\n')}

Respond strictly in JSON format:
[
  { "heading": "Some Title", "description": "Brief explanation." },
  ...
]
  `
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const result = await model.generateContent(prompt)
  const response = await result.response.text()
  const cleaned = response
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();


  try {
    const json = JSON.parse(cleaned);
    return json
  } catch (e) {
    console.error(e)
    return [
      { heading: 'Insight Error', description: 'Could not parse Gemini response.' }
    ]
  }
}

