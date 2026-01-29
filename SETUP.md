# Setup Guide

This guide will help you set up the Offline Digital Payment System Using USSD.

## Step 1: Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to finish setting up (this may take a few minutes)

## Step 2: Get Your Credentials

1. In your Supabase dashboard, go to **Project Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)

## Step 3: Configure Environment Variables

1. In the project root directory, copy `.env.example` to create a new `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 4: Database Setup

The database schema has already been applied to your Supabase project automatically. You can verify by checking the **Table Editor** in your Supabase dashboard. You should see these tables:
- profiles
- wallets
- transactions
- merchants
- ussd_sessions

## Step 5: Install Dependencies

```bash
npm install
```

## Step 6: Run the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Step 7: Create Your First Account

1. Open the application in your browser
2. Click "Sign up" on the login page
3. Fill in your details:
   - Full Name
   - Phone Number (format: +1234567890)
   - Email
   - Password
4. Click "Create Account"

After registration, you'll be automatically logged in and redirected to the dashboard.

## Troubleshooting

### Environment Variables Not Loading

If you see an error about missing environment variables:
1. Make sure your `.env` file is in the root directory
2. Restart the development server
3. Clear your browser cache

### Database Connection Issues

If you can't connect to the database:
1. Verify your Supabase credentials are correct
2. Check that your Supabase project is active
3. Make sure you copied the entire anon key (it's quite long)

### Build Errors

If you encounter build errors:
1. Delete `node_modules` folder
2. Run `npm install` again
3. Try running `npm run build`

## Next Steps

Once your account is created:
1. Explore the Dashboard to see your wallet balance
2. Check out the Transactions page
3. Browse available Merchants
4. Try the USSD code: `*123*456#` (note: actual USSD functionality requires backend integration)

## Additional Configuration

### Adding Test Data

You can add test transactions and merchants through the Supabase dashboard:
1. Go to **Table Editor** in Supabase
2. Select the table you want to add data to
3. Click "Insert" and fill in the required fields

### Customizing USSD Codes

To customize the USSD access code, update the code displayed in:
- `src/pages/Dashboard.tsx` (line showing the USSD code)
- `src/pages/Merchants.tsx` (instructions section)

## Support

For issues or questions, please check the main README.md file or create an issue in the repository.
