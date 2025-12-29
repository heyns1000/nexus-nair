import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PebbleLattice() {
  const [pebbles, setPebbles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPebbleLattice();
  }, []);

  const fetchPebbleLattice = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/pebble-lattice');
      setPebbles(response.data.pebbles || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch Pebble Lattice:', error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white vortex-glow mb-4">
          PEBBLE LATTICE™
        </h1>
        <p className="text-xl text-white opacity-90">
          Below the Seed - 13,713 Pebble IDs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="stat-number">13,713</div>
          <div className="stat-label">Total Pebbles</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number text-green-400">ACTIVE</div>
          <div className="stat-label">Status</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">9s</div>
          <div className="stat-label">PulseGlow™ Cycle</div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-2xl font-bold text-white mb-4">What is PEBBLE LATTICE™?</h3>
        <div className="text-white space-y-4">
          <p className="opacity-90">
            The PEBBLE LATTICE™ is a revolutionary identification system that operates
            "below the seed" - a foundational layer of the NEXUS_NAIR architecture.
            Each of the 13,713 verified brands receives a unique Pebble ID that connects
            them to the Vault Chain™.
          </p>
          <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg">
            <p className="font-bold mb-2">Core Principles:</p>
            <ul className="list-disc list-inside space-y-2 opacity-90">
              <li>Unique cryptographic identification for each brand</li>
              <li>Integration with Gorilla Codex for verification</li>
              <li>9s PulseGlow™ synchronization cycle</li>
              <li>R2 mirror backup for redundancy</li>
              <li>Offline VaultNode™ compatibility (2026)</li>
            </ul>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card">
          <div className="text-center text-white text-xl">
            Loading Pebble Lattice...
          </div>
        </div>
      ) : pebbles.length > 0 ? (
        <div className="card">
          <h3 className="text-2xl font-bold text-white mb-4">Recent Pebble IDs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white border-opacity-20">
                  <th className="text-left py-3 px-4">Pebble ID</th>
                  <th className="text-left py-3 px-4">Brand ID</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Created</th>
                </tr>
              </thead>
              <tbody>
                {pebbles.map((pebble, index) => (
                  <tr key={index} className="border-b border-white border-opacity-10 hover:bg-purple-900 hover:bg-opacity-30 transition">
                    <td className="py-3 px-4 font-mono text-sm">{pebble.pebble_id}</td>
                    <td className="py-3 px-4">{pebble.brand_id}</td>
                    <td className="py-3 px-4">
                      <span className="bg-green-900 bg-opacity-50 px-3 py-1 rounded-full text-xs">
                        {pebble.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm opacity-70">
                      {new Date(pebble.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="text-center text-white">
            <p className="text-xl mb-2">No Pebbles Found</p>
            <p className="opacity-70">The lattice is being initialized...</p>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="text-2xl font-bold text-white mb-4">Pebble ID Format</h3>
        <div className="bg-black bg-opacity-50 p-4 rounded-lg text-white font-mono">
          <p className="mb-2">Format: <span className="text-green-400">PBL-[HASH8]-[BRANDID5]</span></p>
          <p className="text-sm opacity-70 mb-4">
            Example: PBL-A3F7B2C1-00542
          </p>
          <div className="text-sm space-y-2 opacity-90">
            <p>• <span className="text-purple-400">PBL</span> - Pebble Lattice identifier</p>
            <p>• <span className="text-purple-400">HASH8</span> - 8-character MD5 hash (uppercase)</p>
            <p>• <span className="text-purple-400">BRANDID5</span> - 5-digit zero-padded brand ID</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h4 className="text-xl font-bold text-white mb-3">Integration Points</h4>
          <div className="space-y-2 text-white text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Vault Chain™ synchronization</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Gorilla Codex verification</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>R2 storage backup</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>VaultPay™ integration</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400">⏳</span>
              <span>Offline VaultNode™ (2026)</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h4 className="text-xl font-bold text-white mb-3">Security Features</h4>
          <div className="space-y-2 text-white text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">🔒</span>
              <span>Cryptographic hash verification</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">🔒</span>
              <span>Immutable ID assignment</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">🔒</span>
              <span>9s pulse synchronization</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">🔒</span>
              <span>Distributed lattice architecture</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">🔒</span>
              <span>Starlink Direct-to-Cell backup</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-r from-purple-900 to-blue-900 border-2 border-purple-400">
        <div className="text-center">
          <p className="text-2xl text-white font-bold mb-2">
            "Below the Seed"
          </p>
          <p className="text-white opacity-90 italic">
            Where every brand finds its foundation in the Frosted Roots
          </p>
        </div>
      </div>
    </div>
  );
}

export default PebbleLattice;
