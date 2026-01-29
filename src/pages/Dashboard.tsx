import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';

interface Profile {
  full_name: string;
  phone_number: string;
}

interface Wallet {
  balance: number;
  currency: string;
}

interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  status: string;
  created_at: string;
  description: string | null;
}

export function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const [profileRes, walletRes, transactionsRes] = await Promise.all([
        supabase.from('profiles').select('full_name, phone_number').eq('id', user.id).maybeSingle(),
        supabase.from('wallets').select('balance, currency').eq('user_id', user.id).maybeSingle(),
        supabase
          .from('transactions')
          .select('id, amount, transaction_type, status, created_at, description')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (walletRes.data) setWallet(walletRes.data);
      if (transactionsRes.data) setRecentTransactions(transactionsRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.full_name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-1">Manage your USSD payment account</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <h3 className="text-sm font-medium opacity-90">Wallet Balance</h3>
            <p className="text-4xl font-bold mt-2">
              {wallet?.currency} {wallet?.balance.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm opacity-80 mt-4">Available for transactions</p>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <h3 className="text-sm font-medium opacity-90">Phone Number</h3>
            <p className="text-2xl font-bold mt-2">{profile?.phone_number}</p>
            <p className="text-sm opacity-80 mt-4">USSD Access Number</p>
          </div>

          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <h3 className="text-sm font-medium opacity-90">Total Transactions</h3>
            <p className="text-4xl font-bold mt-2">{recentTransactions.length}</p>
            <p className="text-sm opacity-80 mt-4">Recent activity</p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
            <a href="/transactions" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              View All
            </a>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500">No transactions yet</p>
              <p className="text-sm text-gray-400 mt-1">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.transaction_type === 'send' ? 'bg-red-100' :
                      transaction.transaction_type === 'receive' ? 'bg-green-100' :
                      'bg-blue-100'
                    }`}>
                      <span className={`text-lg ${
                        transaction.transaction_type === 'send' ? 'text-red-600' :
                        transaction.transaction_type === 'receive' ? 'text-green-600' :
                        'text-blue-600'
                      }`}>
                        {transaction.transaction_type === 'send' ? '↑' :
                         transaction.transaction_type === 'receive' ? '↓' : '•'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{transaction.transaction_type}</p>
                      <p className="text-sm text-gray-500">{transaction.description || 'No description'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.transaction_type === 'send' ? 'text-red-600' :
                      transaction.transaction_type === 'receive' ? 'text-green-600' :
                      'text-gray-900'
                    }`}>
                      {transaction.transaction_type === 'send' ? '-' : '+'}${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <h3 className="text-xl font-bold mb-4">USSD Quick Access</h3>
          <p className="text-gray-300 mb-6">Dial the following code on your mobile phone to access USSD payment services:</p>
          <div className="bg-white/10 rounded-lg p-6 text-center">
            <p className="text-4xl font-mono font-bold">*123*456#</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="font-medium">Send Money</p>
              <p className="text-gray-400 mt-1">Option 1</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="font-medium">Check Balance</p>
              <p className="text-gray-400 mt-1">Option 2</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
