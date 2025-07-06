#  Mwave — Your Finance Tracker

**Mwave** is a modern, minimal, and customizable personal finance tracker built using **Next.js 14 App Router**, **TypeScript**, and **Tailwind CSS**.  
It allows you to track expenses, manage budgets, analyze savings over time, and get insights via **Gemini AI**.

---

##  Important Note

>  **Authentication Notice**  
> As mentioned in the task — **"Do not implement authentication/login. Submissions with login/signup will not be evaluated."**  
> Therefore, **only `localStorage`** is used to persist records.  
>  The application is fully **scalable and ready to connect with MongoDB** 

##  Project Structure

```
mwave/
├── app/                    # Application routes and logic
│   ├── budget/             # Budget management views
│   ├── localStorageActions/ # Logic for localStorage CRUD
│   ├── transactions/       # Transaction history, insights, filters
│   ├── layout.tsx          # App layout
│   └── page.tsx            # Root page
├── components/             # UI components (Navbar, Footer, Cards, etc.)
├── constants/              # Static values like categories and mock data
├── lib/                    # Utility functions (e.g., Gemini fetch)
├── public/                 # Static assets (e.g., favicon)
├── .env                    # Environment variables (Gemini API key)
├── package.json            # Project dependencies and scripts
└── README.md               # You're here!
```

---

## ⚙️ Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/Rheosta561/TaskAnubhavMishra.git
cd mwave
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory with the following content:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

>  This API key powers the AI-generated finance insights.

4. **Run the app**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to open Mwave in your browser.

---

##  Features

- **Dashboard**: Total balance, categorized expenses, and insights  
- **Transactions**: View, filter, sort by date/amount, and paginate  
- **Calendar Filters**: Filter financial activity by custom date ranges  
- **Savings Over Time**: Visualize monthly savings with line charts  
-  **AI Insights**: Get auto-generated budget insights from Gemini  
- **LocalStorage Powered**: All user data is persisted in localStorage  
-  **Responsive**: Fully responsive and mobile-first UI  
-  **Mock Data**: One-click mock data generation for testing  

---

## Gemini API Integration

This app uses Google Gemini to generate intelligent financial insights based on your budget and transactions.

> You must provide your `GEMINI_API_KEY` in the `.env` file for this to work.

---

## 🛠 Tech Stack

- **Next.js 14** (App Router)  
- **React 18**  
- **TypeScript**  
- **Tailwind CSS**  
- **Lucide React Icons**  
- **Recharts**  
- **Zod** (validation)  
- **Sonner** (toasts)  

---

## Mock Mode

If you load the app with no transactions or budgets, you'll see a `Use Mock Data` button. This lets you explore the app with predefined categories, mock transactions, and sample insights.

---

## 📌 License

This project is MIT licensed. See [`LICENSE`](./LICENSE) for more info.

---

##  Credits

Developed with 💙 by [Anubhav Mishra](https://portfolioanubhavmishra.vercel.app/)
