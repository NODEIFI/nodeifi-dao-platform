# NODEIFI DAO Platform

A production-ready blockchain governance platform featuring authentic Aragon DAO integration, corporate website, and real-time proposal voting on Base mainnet.

## Features

### 🏛️ Authentic DAO Governance
- Live proposal data from Aragon contract `0x2c154014103b5ec2ac0337599fDe0F382d9fb52f`
- Real-time voting status and timestamps
- Base mainnet blockchain integration
- Wallet connectivity (MetaMask, Coinbase, WalletConnect)

### 🏢 Corporate Website
- Professional team showcase with live Twitter profiles
- Portfolio projects with interactive trading charts
- Contact forms with email notifications
- Mobile-responsive design

### ⚡ Performance Optimized
- Adaptive performance monitoring
- Database query optimization
- Real-time metrics collection
- Error handling and logging

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Alchemy API key (Base mainnet)

### Installation
```bash
npm install
```

### Environment Setup
Create environment variables in Replit Secrets tab:
```
DATABASE_URL=your_postgresql_url
ALCHEMY_RPC_URL=https://base-mainnet.g.alchemy.com/v2/your_key
SENDGRID_API_KEY=your_sendgrid_key
```

### Database Setup
```bash
npm run db:push
```

### Development
```bash
npm run dev
```

Server runs on port 5000

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL
- **Blockchain**: ethers.js, Wagmi, Aragon SDK
- **Database**: Drizzle ORM with Neon PostgreSQL
- **Email**: SendGrid integration
- **Performance**: Custom monitoring system

## Project Structure

```
├── client/              # React frontend
├── server/              # Express backend
├── shared/              # Shared schemas and types
├── lib/                 # Utility libraries
└── attached_assets/     # Static assets
```

## Governance Contract

**Contract Address**: `0x2c154014103b5ec2ac0337599fDe0F382d9fb52f`
**Network**: Base Mainnet
**Type**: Aragon DAO

## Security

- Environment variables excluded from repository
- Private repository for code protection
- Production API credentials required
- Secure wallet integration

## Deployment

1. Import repository to Replit
2. Configure environment variables in Secrets tab
3. Run database migrations: `npm run db:push`
4. Start application: `npm run dev`
5. Deploy using Replit Deployments

## Team Profiles

The platform showcases authentic team member profiles with live social media integration and professional backgrounds in blockchain infrastructure.

## License

Private - NODEIFI DAO Platform