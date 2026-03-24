# Budgeting Web App

A full-stack personal finance management application built with Next.js, Prisma, and SQLite.

## Features

### Core Features
- **Transaction Management** - Add, edit, and delete income/expense transactions
- **Budget Tracking** - Set monthly budgets per category with progress visualization
- **Savings Goals** - Create and track progress toward savings targets
- **Search & Filter** - Search transactions by category/description, filter by date range
- **Data Export** - Export transactions to CSV format

### Analytics
- **Expense Pie Chart** - Visual breakdown of expenses by category
- **Income vs Expense Bar Chart** - Monthly comparison trends
- **Savings Trend Chart** - Track savings over time
- **Summary Cards** - Quick view of total income, expenses, balance, and savings rate

### Security
- JWT-based authentication with bcrypt password hashing
- Rate limiting (5 attempts per 15 minutes)
- Security headers (CSP, X-Frame-Options, etc.)
- Session timeout (30 minutes)
- Input validation with Zod

### Additional Features
- **AI Financial Assistant** - Chatbot providing financial advice
- **Responsive Design** - Works on mobile and desktop
- **Modern UI** - Clean interface with Tailwind CSS

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 13 | Full-stack framework |
| React 18 | UI library |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Prisma + SQLite | Database |
| Next-Auth | Authentication |
| Recharts | Data visualization |
| Zod | Input validation |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Budgeting-Web-App
   ```

2. **Run the setup script**
   
   Windows (PowerShell):
   ```powershell
   .\start.ps1
   ```
   
   Or double-click `run.bat`

3. **Or manually install**
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

4. **Open browser**
   Navigate to http://localhost:3000

### Environment Variables

Create a `.env` file:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Project Structure

```
src/
├── actions/           # Server Actions (API)
│   ├── budgetActions.ts
│   ├── savingsActions.ts
│   └── transactionActions.ts
├── app/              # Next.js App Router
│   ├── api/          # API routes
│   ├── auth/         # Authentication pages
│   ├── dashboard/   # Main dashboard
│   └── page.tsx      # Landing page
├── components/       # React components
│   ├── ai/          # AI chat
│   ├── auth/        # Auth components
│   ├── budget/     # Budget components
│   ├── charts/      # Chart components
│   ├── savings/     # Savings components
│   ├── transaction/ # Transaction components
│   └── ui/          # UI components
├── lib/             # Utilities
│   ├── auth.ts      # Next-Auth config
│   ├── prisma.ts    # Prisma client
│   ├── rateLimit.ts # Rate limiting
│   └── utils.ts     # Utility functions
└── test/            # Unit tests
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run test` | Run unit tests |
| `npm run test:coverage` | Run tests with coverage |
| `npx prisma studio` | Open Prisma database GUI |

## API Documentation

See [openapi.yaml](./openapi.yaml) for OpenAPI/Swagger documentation.

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - Login/logout

### Server Actions
- `createTransaction` - Add transaction
- `updateTransaction` - Update transaction  
- `deleteTransaction` - Delete transaction
- `upsertBudget` - Create/update budget
- `deleteBudget` - Delete budget
- `createSavingsGoal` - Create savings goal
- `addToSavingsGoal` - Add to savings goal
- `deleteSavingsGoal` - Delete savings goal

## Testing

Run unit tests:
```bash
npm run test
```

Run with coverage:
```bash
npm run test:coverage
```

## CI/CD

GitHub Actions workflow is configured in `.github/workflows/ci-cd.yml`:

1. **Lint & Type Check** - ESLint + TypeScript
2. **Unit Tests** - Vitest
3. **Build** - Production build
4. **Deploy** - Manual production deployment

## Security Features

- JWT authentication with 30-minute session timeout
- Bcrypt password hashing
- Rate limiting (5 attempts per 15 minutes)
- Security headers (CSP, X-Frame-Options, X-Content-Type-Options)
- Input validation with Zod
- User-scoped data access

## Database Schema

```
User
├── id (PK)
├── email (unique)
├── name
├── password (hashed)
└── timestamps

Transaction
├── id (PK)
├── userId (FK)
├── type (income/expense)
├── amount
├── description
├── category
├── date
└── timestamps

Budget
├── id (PK)
├── userId (FK)
├── category
├── month (YYYY-MM)
├── amount
└── timestamps

SavingsGoal
├── id (PK)
├── userId (FK)
├── name
├── targetAmount
├── currentAmount
├── deadline
├── completed
└── timestamps
```

## Milestones Completed

| Week | Milestone | Status |
|------|-----------|--------|
| Week 1 | Proposal & Architecture | ✅ |
| Week 2 | Database + Auth | ✅ |
| Week 3 | Core CRUD | ✅ |
| Week 4 | Analytics + Notifications | ✅ |
| Week 5 | Testing + CI/CD | ✅ |
| Week 6 | Documentation | ✅ |

## License

MIT License
