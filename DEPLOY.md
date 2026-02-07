# Deployment Guide

This project uses **Vercel CLI** for deployments (not GitHub auto-deploy).

## Quick Deploy

```bash
./deploy.sh
```

Or manually:
```bash
vercel --prod --token="$(op read 'op://Aria/ot25ya5oswbbvtjk6kw2emh4hu/password')"
```

## Preview Deployment

To create a preview deployment (not production):
```bash
vercel --token="$(op read 'op://Aria/ot25ya5oswbbvtjk6kw2emh4hu/password')"
```

## Workflow

1. **Make changes** - Edit files locally
2. **Test locally** - `npm run dev`
3. **Commit to Git** - `git add . && git commit -m "your message"`
4. **Push to GitHub** - `git push` (for version control only, no auto-deploy)
5. **Deploy** - `./deploy.sh`

## URLs

- **Production:** https://rauhomegroup-astro.vercel.app
- **Project Dashboard:** https://vercel.com/rusty-raus-projects/rauhomegroup-astro

## Troubleshooting

### "No existing credentials found"
Make sure 1Password is unlocked and you have the Vercel token stored.

### Build fails
Run locally first to check for errors:
```bash
npm run build
```

### Token from 1Password not working
You can also pass the token directly:
```bash
vercel --prod --token="YOUR_TOKEN_HERE"
```

## Why CLI Deploy?

- **Control** - Deploy only when ready, not on every push
- **Preview** - Test deployments before going to production
- **Speed** - No waiting for GitHub webhook triggers
