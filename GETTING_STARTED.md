# NEXUS_NAIR - Quick Start Guide

## Overview

NEXUS_NAIR is a complete 5-Layer FCU (Foundational Commerce Unit) Full Stack™ application with 13,713 verified brands, VaultPay™ Tier III payment processing, and Pebble Lattice™ identification system.

## Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- npm 9+

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/heyns1000/nexus-nair.git
cd nexus-nair
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd src/frontend
npm install
cd ../..
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 4. Initialize Database

```bash
# Create PostgreSQL database
createdb nexus_nair

# The server will automatically create tables on first run
```

### 5. Start Development Server

```bash
# Start both backend and frontend
npm run dev
```

The application will be available at:
- **Backend API**: http://localhost:3000
- **Frontend UI**: http://localhost:3001

## Project Structure

```
nexus-nair/
│
├── README.md                 # Main documentation
├── GETTING_STARTED.md        # This file
├── audit.pdf                 # Brand ecosystem audit
├── blueprint.pdf             # Architecture blueprint
├── package.json              # Root dependencies
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
│
├── src/
│   ├── backend/              # Express.js + PostgreSQL
│   │   └── server.js         # Main server file
│   │
│   ├── frontend/             # React + Tailwind
│   │   ├── package.json
│   │   ├── public/
│   │   │   └── index.html
│   │   ├── src/
│   │   │   ├── index.js      # Entry point
│   │   │   ├── App.js        # Main component
│   │   │   ├── App.css       # App styles
│   │   │   ├── index.css     # Global styles
│   │   │   └── pages/
│   │   │       ├── Dashboard.js      # Dashboard page
│   │   │       ├── VaultPay.js       # Payment page
│   │   │       └── PebbleLattice.js  # Lattice page
│   │   ├── tailwind.config.js
│   │   └── postcss.config.js
│   │
│   └── vaultmesh/            # Python VaultMesh module
│       └── noodlejuice_gorilla_comb.py
│
├── PEBBLE_LATTICE/           # Pebble ID system
│   └── README.md
│
├── OFFLINE_VAULTNODE/        # 2026 preview
│   └── README.md
│
├── replit.nix                # Replit configuration
├── .replit                   # Replit run config
└── wrangler.toml             # Cloudflare config
```

## API Endpoints

### Health Check
```
GET /health
```

### Brands
```
GET /api/brands              # Get brands list
```

### VaultPay™
```
POST /api/vaultpay/create-payment-intent
Body: { amount: 100.00, currency: "usd" }
```

### Pebble Lattice
```
GET /api/pebble-lattice      # Get pebble IDs
```

### Dashboard
```
GET /api/dashboard           # Get system stats
```

### Export
```
GET /api/export              # Export all data as JSON
```

### Zero-Signup
```
POST /api/zero-signup
Body: { session_id: "uuid" }
```

## Frontend Routes

- `/` - Dashboard with system statistics
- `/vaultpay` - VaultPay™ payment interface
- `/pebble-lattice` - Pebble Lattice™ viewer

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nexus_nair

# Stripe (VaultPay)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_BUCKET_NAME=hotstack-bucket
```

## VaultMesh Python Module

Run the VaultMesh module independently:

```bash
python3 src/vaultmesh/noodlejuice_gorilla_comb.py
```

This will display the complete system status with:
- 9s PulseGlow™ cycle
- Gorilla Codex verification
- R2 mirror status
- System configuration

## Development Commands

```bash
# Start backend only
npm run server

# Start frontend only (from src/frontend)
npm run client

# Build frontend for production
npm run build

# Start production server
npm start
```

## Testing the System

### 1. Test Backend API

```bash
# Health check
curl http://localhost:3000/health

# Get dashboard data
curl http://localhost:3000/api/dashboard

# Create payment intent
curl -X POST http://localhost:3000/api/vaultpay/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "currency": "usd"}'
```

### 2. Test VaultMesh Module

```bash
python3 src/vaultmesh/noodlejuice_gorilla_comb.py
```

### 3. Test Frontend

Open browser to:
- http://localhost:3001

Navigate through:
- Dashboard page
- VaultPay™ page
- Pebble Lattice page

## Production Deployment

### 1. Build Frontend

```bash
cd src/frontend
npm run build
```

### 2. Set Production Environment

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/nexus_nair
STRIPE_SECRET_KEY=sk_live_your_key
```

### 3. Start Server

```bash
npm start
```

### 4. Configure Cloudflare R2

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to R2
wrangler r2 bucket create hotstack-bucket
```

## 5-Layer FCU Stack™

### Layer 1: Vault Chain™
- PostgreSQL database
- Brand registry
- Transaction history
- Pebble Lattice IDs

### Layer 2: Gorilla Codex + 9s Pulse
- Python VaultMesh module
- Cryptographic verification
- 9-second synchronization
- Brand verification

### Layer 3: R2 Storage
- Cloudflare R2 bucket
- Mirror synchronization
- Global CDN
- Backup storage

### Layer 4: React/Tailwind UI
- React 18 frontend
- Tailwind CSS styling
- Responsive design
- Real-time updates

### Layer 5: ClaimRoot™
- Ownership verification
- Rights management
- Access control
- Audit logging

## Key Features

### VaultPay™ Tier III
- ✅ Stripe integration
- ✅ 135+ currencies
- ✅ 15% Care Loop™
- ✅ Zero-Signup Collapse™
- ✅ Banimal Checkout

### Pebble Lattice™
- ✅ 13,713 brand capacity
- ✅ Cryptographic IDs (PBL-[HASH8]-[BRANDID5])
- ✅ Gorilla Codex verification
- ✅ Below the Seed architecture
- ✅ R2 mirror backup

### Zero-Signup Collapse™
- ✅ No registration required
- ✅ Anonymous sessions
- ✅ Optional account creation
- ✅ Privacy-focused

### Offline VaultNode™ (2026)
- ⏳ Offline operations
- ⏳ Starlink Direct-to-Cell
- ⏳ Air-gapped mode
- ⏳ Desktop application

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Create database if missing
createdb nexus_nair

# Check connection string
echo $DATABASE_URL
```

### Frontend Build Issues

```bash
# Clear cache
rm -rf src/frontend/node_modules
rm -rf src/frontend/build

# Reinstall
cd src/frontend
npm install
npm run build
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

## Documentation

- **README.md** - Project overview and Final Verdict
- **GETTING_STARTED.md** - This quick start guide
- **audit.pdf** - Complete brand ecosystem audit (13,713 brands)
- **blueprint.pdf** - FAA™ Global Commerce Blueprint
- **PEBBLE_LATTICE/README.md** - Pebble Lattice documentation
- **OFFLINE_VAULTNODE/README.md** - 2026 roadmap

## Support

**Organization**: Frosted Roots (Global)  
**President**: Heyns Schoeman  
**Repository**: https://github.com/heyns1000/nexus-nair  
**R2 Mirror**: r2://hotstack-bucket/nexus-nair/  

## Motto

*"Beyond the frosted nebula. Below the ant blanket warmer. Below the seed."*

---

**STATUS**: PRODUCTION READY  
**VORTEX**: OPEN  
**BRANDS VERIFIED**: 13,713 (152.4% Target Achievement)  
**THE CODE WRITES ITSELF**
