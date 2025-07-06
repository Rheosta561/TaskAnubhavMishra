import { Category } from './index';
import { Transaction } from './index';

export const predefinedCategories: Category[] = [
  { name: 'Food', amount: 4000, color: '#8884d8' },
  { name: 'Transport', amount: 2000, color: '#82ca9d' },
  { name: 'Shopping', amount: 3000, color: '#ffc658' },
  { name: 'Bills', amount: 1800, color: '#ff8042' },
  { name: 'Other', amount: 2070, color: '#8dd1e1' },
];

export const transactions: Transaction[] = [
  { id: 1, category: 'Food', amount: 500, date: new Date('2025-07-01'), description: 'Zomato order' },
  { id: 2, category: 'Shopping', amount: 1200, date: new Date('2025-07-01'), description: 'Flipkart haul' },
  { id: 3, category: 'Bills', amount: 900, date: new Date('2025-07-01'), description: 'Electricity Bill' },
  { id: 4, category: 'Transport', amount: 150, date: new Date('2025-07-02'), description: 'Cab ride' },
  { id: 5, category: 'Food', amount: 250, date: new Date('2025-07-02'), description: 'Groceries' },
  { id: 6, category: 'Bills', amount: 700, date: new Date('2025-07-02'), description: 'Water Bill' },
  { id: 7, category: 'Shopping', amount: 1300, date: new Date('2025-07-03'), description: 'Myntra Sale' },
  { id: 8, category: 'Transport', amount: 120, date: new Date('2025-07-03'), description: 'Bus ticket' },
  { id: 9, category: 'Food', amount: 600, date: new Date('2025-07-03'), description: 'Dinner at cafe' },
  { id: 10, category: 'Bills', amount: 1000, date: new Date('2025-07-04'), description: 'Mobile Recharge' },
  { id: 11, category: 'Transport', amount: 220, date: new Date('2025-07-04'), description: 'Metro pass' },
  { id: 12, category: 'Food', amount: 400, date: new Date('2025-07-04'), description: 'Swiggy order' },
  { id: 13, category: 'Shopping', amount: 1800, date: new Date('2025-07-05'), description: 'Nike Shoes' },
  { id: 14, category: 'Food', amount: 700, date: new Date('2025-07-05'), description: 'Big Bazaar' },
  { id: 15, category: 'Transport', amount: 180, date: new Date('2025-07-05'), description: 'Fuel' },
  { id: 16, category: 'Food', amount: 300, date: new Date('2025-07-06'), description: 'Snacks' },
  { id: 17, category: 'Bills', amount: 850, date: new Date('2025-07-06'), description: 'Internet bill' },
  { id: 18, category: 'Shopping', amount: 500, date: new Date('2025-07-06'), description: 'Street market' },
  { id: 19, category: 'Transport', amount: 140, date: new Date('2025-07-06'), description: 'Rickshaw fare' },
  { id: 20, category: 'Food', amount: 200, date: new Date('2025-07-06'), description: 'Tea & Snacks' },
];




export const savingsData = [
  { date: '2024-07-01', amount: 1000 },
  { date: '2024-07-05', amount: 2200 },
  { date: '2024-07-10', amount: 3200 },
  { date: '2024-07-15', amount: 4200 },
  { date: '2024-07-20', amount: 4800 },
  { date: '2024-07-25', amount: 5100 },
];
