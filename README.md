# Offline Digital Payment System Using USSD

A modern, offline-capable digital payment platform that operates through USSD technology, enabling mobile payments without internet connectivity. Built with React, TypeScript, Vite, and Supabase.

## Features

- **User Authentication**: Secure email/password authentication with Supabase
- **Digital Wallets**: Multi-currency wallet management with balance tracking
- **USSD Integration**: Mobile phone-based payment system accessible via USSD codes
- **Transaction Management**: Complete transaction history with filtering and status tracking
- **Merchant Directory**: Browse and pay verified merchants
- **Real-time Updates**: Live transaction updates and balance changes
- **Secure**: Row-level security policies and PIN-based authorization

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Routing**: React Router v6

## Database Schema

The application uses the following tables:

- **profiles**: User profile information
- **wallets**: User wallet balances and currency management
- **transactions**: Payment transaction records
- **merchants**: Verified merchant accounts
- **ussd_sessions**: Active USSD session tracking

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## USSD Access

Users can access the payment system by dialing:

```
*123*456#
```

Available USSD options:
- Option 1: Send Money
- Option 2: Check Balance
- Option 3: Pay Merchant
- Option 4: Transaction History

## Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/        # React contexts (Auth)
├── lib/            # Supabase client setup
├── pages/          # Page components
├── types/          # TypeScript type definitions
└── main.tsx        # Application entry point
```

## Features Overview

### Dashboard
- Wallet balance display
- Recent transaction history
- USSD quick access code
- Account statistics

### Transactions
- Complete transaction history
- Filter by type (sent/received)
- Status tracking
- Reference numbers

### Merchants
- Verified merchant directory
- Merchant code lookup
- Category filtering
- Direct USSD payment

## Security Features

- Row Level Security (RLS) on all database tables
- Authenticated access required
- PIN-based transaction authorization
- Secure password hashing
- Session management

## License

MIT License