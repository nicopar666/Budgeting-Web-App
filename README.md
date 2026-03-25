# BudgetPro - Personal Finance App

A full-stack personal finance management application with budgeting, savings tracking, analytics, and AI-powered assistance.

## Features

### Core
- **Authentication** - Secure register/login with JWT
- **Transactions** - Income/expense tracking with categories, search & filter
- **Budgets** - Monthly budgets per category with progress tracking
- **Savings Goals** - Goals with targets, deadlines, progress tracking
- **Bill Reminders** - Recurring bills, auto-creates transaction on payment
- **Debt Tracking** - Manage debts with payment history
- **Assets** - Track cash, investments, property, vehicles
- **CSV Export** - Export transactions

### Analytics
- Expense Pie Chart
- Income vs Expense Bar Chart
- Savings Trend Chart
- Weekly Spending Chart
- Month Comparison Chart
- Balance Forecast Chart (3-month projection)
- Summary Cards (Income, Expenses, Net Balance, Savings Rate)

### AI Features
- **AI Assistant** - Smart chatbot for financial advice (budgeting, saving, debt, investing, taxes)
- **AI Goal Suggestions** - Personalized recommendations based on financial data

### Financial Tools
- **Net Worth Calculator** - Total assets minus liabilities with breakdown
- **Financial Health Score** - Gamified scoring (savings rate, budget compliance, debt, emergency fund, goals)
- **Spending Alerts** - Notifications when approaching budget limits
- **Financial Report** - Detailed monthly reports

- ### Data
- **Data Backup/Import** - AES-256-GCM encrypted exports, password-protected

### UI/UX
- **Theme Toggle** - Dark/light mode
- **Real-time Sync** - All data updates reflected immediately

### Security
- JWT authentication with bcrypt
- Rate limiting (5 attempts/15 min)
- Security headers (CSP, X-Frame-Options)
- Session timeout (30 min)
- Input validation with Zod

## Tech Stack

Next.js 13, React 18, TypeScript, Tailwind CSS, Prisma, SQLite, Next-Auth, Recharts, Zod, Vitest

## Quick Start

```bash
npm install
npx prisma generate
npx prisma db push
```

Create `.env`:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

```bash
npm run dev
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run test` | Run tests |
| `npm run lint` | ESLint check |
| `npx prisma studio` | Database GUI |

## Deployment (Dashboard)
- Deploy via Cloudflare Pages dashboard (recommended). Set build command to "npm install && npm run build", output directory to ".next".
- Wrangler-based deploys are no longer used (wrangler.toml removed).

## License

MIT
