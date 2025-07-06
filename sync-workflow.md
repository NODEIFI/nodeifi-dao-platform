# Sandbox to Production Sync Workflow

## Current Setup
- **Production**: This Replit (nodeifi.io domain, live database)
- **Sandbox**: Template-based copy (separate database, development URL)

## Syncing Changes: Sandbox → Production

### Method 1: File-by-File Copy (Recommended)
1. **Develop in sandbox** - Make and test changes
2. **Identify changed files** - Note which files you modified
3. **Copy to production** - Transfer working files to this production Replit
4. **Test in production** - Verify changes work with live data
5. **Deploy** - Changes go live automatically

### Method 2: Download/Upload
1. **Download from sandbox** - Export changed files as zip
2. **Upload to production** - Import files to this Replit
3. **Restart workflow** - Apply changes

### Method 3: Git Integration (Advanced)
1. **Push from sandbox** - Commit changes to GitHub
2. **Pull to production** - Sync from GitHub repository
3. **Deploy updates** - Changes applied to nodeifi.io

## Key Files to Monitor
- `client/src/` - Frontend changes
- `server/` - Backend logic updates
- `shared/schema.ts` - Database schema changes
- `package.json` - New dependencies

## Database Schema Changes
1. **Test in sandbox** - Run `npm run db:push` in sandbox first
2. **Verify data migration** - Ensure no data loss
3. **Apply to production** - Run `npm run db:push` in production
4. **Backup consideration** - For major schema changes

## Testing Checklist Before Sync
- [ ] Features work in sandbox environment
- [ ] No console errors in browser
- [ ] Database queries successful
- [ ] Performance acceptable
- [ ] All pages load correctly

## Environment Variables
- **Sandbox**: Can use test API keys
- **Production**: Live API keys and services
- **Database**: Automatically separate databases

## Best Practices
- Make small, incremental changes
- Test thoroughly in sandbox before syncing
- Keep production stable - avoid experimental features
- Document major changes in replit.md

## Emergency Rollback
If issues occur in production:
1. Revert to previous working files
2. Restart production workflow
3. Fix issues in sandbox before re-syncing