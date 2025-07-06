# Nodeifi DAO Platform

## Overview

This is a full-stack web application for Nodeifi DAO - a blockchain infrastructure organization with governance capabilities. The platform combines a corporate website showcasing services and team information with a decentralized governance system built on the Base blockchain using Aragon DAO contracts.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion for smooth transitions and interactions
- **Blockchain Integration**: ethers.js v6 with Wagmi/Viem for wallet connectivity

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based auth with Google OAuth integration
- **Email Service**: SendGrid for notifications
- **Performance Monitoring**: Custom adaptive optimization system

### Key Components

1. **Corporate Website**
   - Hero section with adaptive logo system
   - Portfolio showcase with animated trading charts
   - Team member profiles
   - Services and contact information
   - Performance dashboard with real-time metrics

2. **DAO Governance System**
   - Proposal viewing and voting interface
   - Multi-signature wallet integration
   - Real-time blockchain data synchronization
   - Wallet connection management

3. **Admin Systems**
   - Logo settings configuration panel
   - Performance monitoring and optimization
   - Contact form management with ClickUp integration

## Data Flow

### Blockchain Integration
1. Frontend connects to Base mainnet via Alchemy RPC endpoints
2. Aragon DAO contract interactions for proposal data and voting
3. Real-time synchronization with on-chain governance state
4. Wallet connection management across MetaMask, Coinbase Wallet, and WalletConnect

### Database Schema
- **Users**: Authentication and session management
- **Projects**: Portfolio project information
- **Team Members**: Leadership team profiles
- **Governance Cache**: Cached blockchain data for performance
- **Performance Metrics**: System monitoring and optimization data
- **Logo Settings**: Adaptive logo configuration

### API Architecture
- RESTful endpoints for CRUD operations
- Real-time blockchain data fetching
- Email and notification services
- Performance metrics collection and optimization

## External Dependencies

### Blockchain Infrastructure
- **Alchemy**: Base mainnet RPC provider
- **Aragon SDK**: DAO contract interactions
- **Wagmi/Viem**: Wallet connection and blockchain utilities

### Third-Party Services
- **SendGrid**: Email delivery service
- **ClickUp**: Task management integration for contact forms
- **Google OAuth**: Authentication service

### UI/UX Libraries
- **shadcn/ui**: Component library built on Radix UI
- **Framer Motion**: Animation framework
- **Chart.js**: Data visualization for performance metrics

## Deployment Strategy

### Development Environment
- **Replit**: Primary development platform
- **Hot Module Replacement**: Vite dev server with fast refresh
- **Database**: Neon PostgreSQL for development

### Production Build
- **Build Process**: Vite for frontend, esbuild for backend
- **Static Assets**: Bundled and optimized for CDN delivery
- **Database Migrations**: Drizzle Kit for schema management
- **Environment Variables**: Secure configuration management

### Performance Optimization
- **Adaptive Performance Monitor**: Automatic system optimization
- **Database Query Optimization**: Cached blockchain data
- **Asset Optimization**: Image compression and lazy loading
- **CDN Integration**: Static asset delivery optimization

## Changelog

- June 17, 2025. Initial setup
- June 28, 2025. Security incident resolved - recreated GitHub repository with proper .gitignore
- June 28, 2025. Created complete export package for secure GitHub upload
- June 28, 2025. Repository recreated and deployed on Render with PostgreSQL database
- June 28, 2025. Complete file structure uploaded to fresh GitHub repository resolving all build errors
- July 5, 2025. Fixed CSS formatting crisis - Render deployment was missing styling while Replit maintained proper cosmic theme
- July 5, 2025. Resolved CSS syntax error at line 140 causing build failures on Render
- July 5, 2025. Successfully deployed corrected index.css with complete cosmic theme to Render via GitHub
- July 6, 2025. Resolved database connection issues - created PostgreSQL database and pushed schema
- July 6, 2025. Successfully deployed to Replit with custom domain nodeifi.io
- July 6, 2025. SSL certificate configured - nodeifi.io fully secure with HTTPS
- July 6, 2025. Added www.nodeifi.io domain with SSL - both domains fully operational
- July 6, 2025. Development environment template created for safe testing

## User Preferences

Preferred communication style: Simple, everyday language.

## Repository Management
- User prefers downloadable packages over direct Git operations
- Secure credential management required (Secrets tab only, never .env files)
- Private GitHub repository: https://github.com/NODEIFI/nodeifi-dao-platform
- Deployment platform: Railway (preferred over Replit for production)

## Deployment Strategy Update
- **Railway Deployment**: Direct GitHub integration with built-in PostgreSQL
- **Custom Domains**: Railway provides automatic SSL certificates
- **Environment Variables**: Secure management through Railway dashboard
- **Production Ready**: Unlimited bandwidth and uptime compared to Replit limitations