# BudgetPro - Personal Finance App

**Live Demo**: https://budgetpro-r4r4mb1fm-skythelight15-4492s-projects.vercel.app/

_Last Updated: March 26, 2026_

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

Next.js 14, React 18, TypeScript, Tailwind CSS, Prisma, PostgreSQL (Vercel Postgres), Next-Auth, Recharts, Zod, Vitest

## Quick Start (Local Development)

```bash
npm install
npx prisma generate
```

Create `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/budgetpro"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

```bash
npm run dev
```

### Database

- **Local**: Use any PostgreSQL database (e.g., via Docker or local installation)
- **Production**: Vercel Postgres (free tier)

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run test` | Run tests |
| `npm run lint` | ESLint check |
| `npx prisma studio` | Database GUI |

## Deployment

- **Platform**: Vercel
- **Database**: Vercel Postgres (Neon)
- **Build Command**: `npm run vercel-build` (runs `prisma generate && next build`)
- **Output Directory**: `.next`

### Environment Variables (Vercel)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random string for session encryption |
| `NEXTAUTH_URL` | Production URL (e.g., https://your-project.vercel.app) |

## License

MIT
