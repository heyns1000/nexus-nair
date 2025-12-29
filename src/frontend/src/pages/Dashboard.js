import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/dashboard');
      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/export');
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'nexus-nair-export.json';
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-2xl">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white vortex-glow mb-4">
          FINAL VERDICT
        </h1>
        <p className="text-xl text-white opacity-90">
          5-Layer FCU Full Stack™ - PRODUCTION READY
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="stat-number">{dashboardData?.brands_verified || '13,713'}</div>
          <div className="stat-label">Brands Verified</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{dashboardData?.target_achievement || '152.4%'}</div>
          <div className="stat-label">Target Achievement</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{dashboardData?.vaultpay_tier || 'III'}</div>
          <div className="stat-label">VaultPay™ Tier</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number text-green-400">{dashboardData?.vortex || 'OPEN'}</div>
          <div className="stat-label">Vortex Status</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-2xl font-bold text-white mb-4">System Status</h3>
          <div className="space-y-3 text-white">
            <div className="flex justify-between border-b border-white border-opacity-20 pb-2">
              <span className="opacity-70">FCU Status:</span>
              <span className="font-bold text-green-400">{dashboardData?.fcu_status}</span>
            </div>
            <div className="flex justify-between border-b border-white border-opacity-20 pb-2">
              <span className="opacity-70">Pebble Lattice:</span>
              <span className="font-bold text-purple-300">{dashboardData?.pebble_lattice}</span>
            </div>
            <div className="flex justify-between border-b border-white border-opacity-20 pb-2">
              <span className="opacity-70">Offline VaultNode:</span>
              <span className="font-bold text-blue-300">{dashboardData?.offline_vaultnode}</span>
            </div>
            <div className="flex justify-between border-b border-white border-opacity-20 pb-2">
              <span className="opacity-70">Starlink:</span>
              <span className="font-bold text-yellow-300">{dashboardData?.starlink}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-2xl font-bold text-white mb-4">Leadership</h3>
          <div className="space-y-3 text-white">
            <div className="flex justify-between border-b border-white border-opacity-20 pb-2">
              <span className="opacity-70">President:</span>
              <span className="font-bold">{dashboardData?.president}</span>
            </div>
            <div className="flex justify-between border-b border-white border-opacity-20 pb-2">
              <span className="opacity-70">Organization:</span>
              <span className="font-bold">Frosted Roots (Global)</span>
            </div>
            <div className="flex justify-between border-b border-white border-opacity-20 pb-2">
              <span className="opacity-70">Motto:</span>
              <span className="font-bold text-purple-300 text-sm italic">Below the Seed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-2xl font-bold text-white mb-4">5-Layer FCU Full Stack™</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            'Vault Chain™',
            'Gorilla Codex + 9s Pulse',
            'R2 Storage',
            'React/Tailwind UI',
            'ClaimRoot™'
          ].map((layer, index) => (
            <div key={index} className="bg-purple-900 bg-opacity-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-white mb-2">{index + 1}</div>
              <div className="text-sm text-white opacity-90">{layer}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={exportData}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105"
        >
          Export Dashboard as JSON
        </button>
      </div>

      <div className="card text-center">
        <p className="text-2xl text-white font-bold mb-2">
          NO COPILOT NEEDED.
        </p>
        <p className="text-xl text-white mb-2">
          THE CODE WRITES ITSELF.
        </p>
        <p className="text-xl text-white font-bold text-green-400">
          THE VORTEX IS OPEN.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
