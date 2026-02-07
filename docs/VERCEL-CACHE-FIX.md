# Vercel Edge Cache Fix

## Problem
Vercel's edge cache was serving stale content after deployments (`x-vercel-cache: HIT`). Users would see outdated versions of the site even after `git push`.

## Solution
Created `vercel.json` with proper cache headers to disable edge caching for HTML pages while still allowing immutable caching for hashed assets.

### Configuration
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, s-maxage=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/_astro/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### How It Works
- **`s-maxage=0`**: Tells Vercel's edge (CDN) to revalidate with origin on every request
- **`must-revalidate`**: Forces revalidation when cache is stale
- **`/_astro/` assets**: These have content hashes in their filenames, so they can be cached forever (immutable)

## What `x-vercel-cache: HIT` Means
After this fix, you may still see `x-vercel-cache: HIT` in headers. This is normal because:
1. Vercel still caches responses at the edge for efficiency
2. With `s-maxage=0`, the edge revalidates with origin on EVERY request
3. HIT just means "edge served a cached copy" but with our headers, it's always fresh

## Forcing a Full Cache Purge
If needed, you can force a complete cache purge:
```bash
cd rauhomegroup-astro
vercel --token YOUR_TOKEN --prod --force
```

This rebuilds WITHOUT using any cached build artifacts.

## Verification
```bash
curl -sI https://rauhomegroup-astro.vercel.app/ | grep -i cache
```

Should show:
```
cache-control: public, max-age=0, s-maxage=0, must-revalidate
x-vercel-cache: HIT
```

## Date Fixed
2026-02-07

## Commit
`fix: add vercel.json to prevent edge cache serving stale content`
