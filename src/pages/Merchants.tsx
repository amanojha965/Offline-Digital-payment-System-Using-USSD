import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Layout } from '../components/Layout';

interface Merchant {
  id: string;
  business_name: string;
  merchant_code: string;
  category: string;
  is_verified: boolean;
  created_at: string;
}

export function Merchants() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMerchants();
  }, []);

  const loadMerchants = async () => {
    try {
      const { data, error } = await supabase
        .from('merchants')
        .select('*')
        .eq('is_verified', true)
        .order('business_name');

      if (error) throw error;
      if (data) setMerchants(data);
    } catch (error) {
      console.error('Error loading merchants:', error);
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Verified Merchants</h1>
          <p className="text-gray-600 mt-1">Browse and pay verified merchants using USSD</p>
        </div>

        <div className="card">
          {merchants.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-gray-500">No merchants available yet</p>
              <p className="text-sm text-gray-400 mt-1">Check back later for verified merchants</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {merchants.map((merchant) => (
                <div key={merchant.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 text-xl font-bold">
                        {merchant.business_name.charAt(0)}
                      </span>
                    </div>
                    {merchant.is_verified && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{merchant.business_name}</h3>
                  <p className="text-sm text-gray-600 mb-4 capitalize">{merchant.category}</p>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-500 mb-1">Merchant Code</p>
                    <p className="text-sm font-mono font-bold text-gray-900">{merchant.merchant_code}</p>
                  </div>

                  <button className="w-full btn btn-primary text-sm">
                    Pay via USSD
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">How to pay merchants</h3>
              <p className="text-sm text-blue-700">
                Dial <span className="font-mono font-bold">*123*456#</span>, select "Pay Merchant",
                enter the merchant code, and follow the prompts to complete your payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
