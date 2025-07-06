# Git-Based Development Workflow

## Current Setup
- **Production**: This Replit (nodeifi.io) → Connected to GitHub repository
- **Sandbox**: Template-based Replit → Development environment

## Step-by-Step Git Workflow

### 1. Connect Sandbox to Same Git Repository

**In your sandbox Replit:**
1. Go to Version Control tab
2. Connect to your existing GitHub repository
3. This creates a development branch automatically

### 2. Branch Strategy

**Production Branch (main/master):**
- This production Replit stays on main branch
- Only stable, tested code
- Directly deploys to nodeifi.io

**Development Branch:**
- Sandbox works on development branch
- All new features and experiments
- Safe testing environment

### 3. Development Process

**In Sandbox:**
```bash
# Make sure you're on development branch
git checkout development

# Make your changes
# Test thoroughly

# Commit changes
git add .
git commit -m "Add new feature: [description]"

# Push to GitHub
git push origin development
```

**In Production:**
```bash
# When ready to deploy, merge development
git checkout main
git pull origin development
git push origin main

# Changes automatically deploy to nodeifi.io
```

### 4. Database Schema Changes

**Testing in Sandbox:**
1. Modify `shared/schema.ts`
2. Run `npm run db:push` in sandbox
3. Test with development database

**Deploying to Production:**
1. Merge schema changes via Git
2. Run `npm run db:push` in production
3. Schema updates live database

### 5. Environment Variables

**Sandbox:**
- Can use test API keys
- Development database (automatic)
- Separate performance monitoring

**Production:**
- Live API keys and services
- Production database
- Real user data

### 6. Safety Features

**Automatic Separation:**
- Different databases prevent data conflicts
- Separate domains (sandbox URL vs nodeifi.io)
- Independent performance monitoring

**Rollback Options:**
- Git history for easy rollbacks
- Branch protection for main
- Staging verification before production

## Quick Command Reference

**Start new feature in sandbox:**
```bash
git checkout development
git pull origin development
# Make changes, test
git add .
git commit -m "Feature: [description]"
git push origin development
```

**Deploy to production:**
```bash
git checkout main
git merge development
git push origin main
# Production auto-updates
```