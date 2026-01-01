import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import VaultPay from './pages/VaultPay';
import PebbleLattice from './pages/PebbleLattice';
import './App.css';

function App() {
  const [systemStatus, setSystemStatus] = useState(null);
  const [vortexOpen, setVortexOpen] = useState(true);

  useEffect(() => {
    // Fetch system status
    fetch('http://localhost:3000/health')
      .then(res => res.json())
      .then(data => setSystemStatus(data))
      .catch(err => console.error('Status check failed:', err));
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-blue-900">
        <nav className="bg-black bg-opacity-50 backdrop-blur-md p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white vortex-glow">
              NEXUS_NAIR
            </h1>
            <div className="flex gap-6">
              <Link to="/" className="text-white hover:text-purple-300 transition">
                Dashboard
              </Link>
              <Link to="/vaultpay" className="text-white hover:text-purple-300 transition">
                VaultPay™
              </Link>
              <Link to="/pebble-lattice" className="text-white hover:text-purple-300 transition">
                Pebble Lattice
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${vortexOpen ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
              <span className="text-white text-sm">
                {vortexOpen ? 'VORTEX OPEN' : 'VORTEX CLOSED'}
              </span>
            </div>
          </div>
        </nav>

        <main className="container mx-auto p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vaultpay" element={<VaultPay />} />
            <Route path="/pebble-lattice" element={<PebbleLattice />} />
          </Routes>
        </main>

        <footer className="bg-black bg-opacity-50 backdrop-blur-md p-4 mt-8">
          <div className="container mx-auto text-center text-white">
            <p className="text-sm italic">
              "Beyond the frosted nebula. Below the ant blanket warmer. Below the seed."
            </p>
            <p className="text-xs mt-2 opacity-70">
              President: Heyns Schoeman - Frosted Roots (Global)
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
