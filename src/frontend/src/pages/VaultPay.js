import React, { useState } from 'react';
import axios from 'axios';

function VaultPay() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('usd');
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const currencies = ['usd', 'eur', 'gbp', 'jpy', 'aud', 'cad', 'chf', 'cny', 'zar'];

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setPaymentStatus(null);

    try {
      const response = await axios.post('http://localhost:3000/api/vaultpay/create-payment-intent', {
        amount: parseFloat(amount),
        currency: currency
      });

      setPaymentStatus({
        success: true,
        message: 'Payment Intent Created Successfully',
        data: response.data
      });
    } catch (error) {
      setPaymentStatus({
        success: false,
        message: 'Payment Failed: ' + (error.response?.data?.error || error.message)
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white vortex-glow mb-4">
          VaultPay™
        </h1>
        <p className="text-xl text-white opacity-90">
          Tier III - Stripe Integration - 135+ Currencies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="stat-number">III</div>
          <div className="stat-label">VaultPay Tier</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">135+</div>
          <div className="stat-label">Currencies</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">15%</div>
          <div className="stat-label">Care Loop™</div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-2xl font-bold text-white mb-6">Create Payment</h3>
        
        <form onSubmit={handlePayment} className="space-y-6">
          <div>
            <label className="block text-white mb-2 font-semibold">Amount</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-purple-900 bg-opacity-50 text-white rounded-lg border border-purple-500 focus:border-purple-300 focus:outline-none"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2 font-semibold">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-3 bg-purple-900 bg-opacity-50 text-white rounded-lg border border-purple-500 focus:border-purple-300 focus:outline-none"
            >
              {currencies.map(curr => (
                <option key={curr} value={curr}>{curr.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={processing}
            className={`w-full px-8 py-4 rounded-lg font-bold text-white transition transform ${
              processing
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105'
            }`}
          >
            {processing ? 'Processing...' : 'Create Payment Intent'}
          </button>
        </form>

        {paymentStatus && (
          <div className={`mt-6 p-4 rounded-lg ${
            paymentStatus.success
              ? 'bg-green-900 bg-opacity-50 border border-green-500'
              : 'bg-red-900 bg-opacity-50 border border-red-500'
          }`}>
            <p className="text-white font-semibold mb-2">{paymentStatus.message}</p>
            {paymentStatus.success && paymentStatus.data && (
              <div className="text-white text-sm space-y-1 opacity-90">
                <p>Status: {paymentStatus.data.status}</p>
                <p>Tier: {paymentStatus.data.tier}</p>
                <p>Currencies Supported: {paymentStatus.data.currencies_supported}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="text-2xl font-bold text-white mb-4">VaultPay™ Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">✓</div>
            <div>
              <div className="font-bold">Stripe Integration</div>
              <div className="text-sm opacity-70">Secure payment processing</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-2xl">✓</div>
            <div>
              <div className="font-bold">135+ Currencies</div>
              <div className="text-sm opacity-70">Global payment support</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-2xl">✓</div>
            <div>
              <div className="font-bold">15% Care Loop™</div>
              <div className="text-sm opacity-70">Automatic contribution system</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-2xl">✓</div>
            <div>
              <div className="font-bold">Zero-Signup Collapse™</div>
              <div className="text-sm opacity-70">No registration required</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-2xl">✓</div>
            <div>
              <div className="font-bold">Banimal Checkout</div>
              <div className="text-sm opacity-70">Streamlined payment flow</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-2xl">✓</div>
            <div>
              <div className="font-bold">R2 Backup</div>
              <div className="text-sm opacity-70">Cloudflare R2 integration</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-r from-purple-900 to-blue-900 border-2 border-purple-400">
        <div className="text-center">
          <p className="text-xl text-white font-bold mb-2">
            🔒 Secured by Vault Chain™
          </p>
          <p className="text-white opacity-90">
            Part of the 5-Layer FCU Full Stack™ Architecture
          </p>
        </div>
      </div>
    </div>
  );
}

export default VaultPay;
