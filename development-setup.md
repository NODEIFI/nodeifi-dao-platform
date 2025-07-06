# Development Environment Setup

## Production Environment (Current)
- **Replit**: This current Replit
- **Domain**: nodeifi.io
- **Database**: Production PostgreSQL
- **Git**: Syncing with GitHub repository

## Development Environment Setup

### Step 1: Fork This Replit
1. Click the "Fork" button on this Replit
2. Name it: "nodeifi-development" or similar
3. This creates an exact copy of your production code

### Step 2: Configure Development Environment
The forked Replit will automatically:
- Copy all your code files
- Copy package.json and dependencies
- Create a separate database environment
- Run on a different port/URL

### Step 3: Development Workflow

**Making Changes:**
1. Work in the development Replit
2. Test thoroughly with dev database
3. When ready, sync changes to production

**Database Strategy:**
- **Production**: Keep current database with real data
- **Development**: Gets its own PostgreSQL database for testing
- **Schema Changes**: Test in dev first, then push to production

### Step 4: Syncing Changes Between Environments

**Option A: Manual Sync (Recommended)**
- Copy changed files from dev to production
- Test in production environment
- Push to Git from production

**Option B: Git Workflow**
- Both environments connected to same Git repository
- Use branches for development
- Merge to main branch for production

## Environment Variables
- **Production**: Current live API keys and services
- **Development**: Can use same keys or test keys
- **Database**: Automatically separate databases

## Benefits of This Setup
- Safe testing without affecting production
- Same codebase structure
- Easy to sync changes
- Independent databases
- Separate performance monitoring

## Next Steps
1. Fork this Replit to create development environment
2. Run `npm run db:push` in development to set up dev database
3. Start developing new features safely