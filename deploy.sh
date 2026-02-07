#!/bin/bash
set -e

# Vercel deployment script for rauhomegroup-astro
# Uses token from 1Password for authentication

TOKEN=$(op read "op://Aria/ot25ya5oswbbvtjk6kw2emh4hu/password" 2>/dev/null) || {
    echo "Error: Could not read Vercel token from 1Password"
    echo "Make sure 1Password CLI is authenticated"
    exit 1
}

echo "🚀 Building and deploying to Vercel..."
vercel --prod --token="$TOKEN"
echo "✅ Deployment complete!"
