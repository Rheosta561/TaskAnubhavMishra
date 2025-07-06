export interface Category {
  name: string;
  amount: number;
  color: string;
}
export interface Transaction {
  id: number;
  category: string;
  amount: number;
  date: Date; //  Mongoose Date format , using fns to decode 
  description: string;
}