# Project Knowledge for Claude Code

## About Me

**Name:** Rusty Rau  
**Business:** Rau Home Group  
**Location:** San Diego, California (born and raised)  
**Profession:** Real Estate Agent (6 years experience)  
**DRE License:** #02084462  
**Email:** rusty@rauhomegroup.com  
**Phone:** (858) 204-4692  

**Social Media:**
- Instagram: @rustyrausd

---

## My Business

**Rau Home Group** - San Diego Real Estate

**What I Do:**
- Help buyers find homes in the competitive San Diego market
- Help sellers maximize their home's value with strategic marketing
- Specialize in: First-time buyers, luxury homes, military/veterans, investment properties and much more

**My Value Proposition:**
- Born and raised in San Diego (deep local knowledge)
- Patient, honest guidance through the buying/selling process
- Strong negotiation skills
- 100% 5-star reviews
- Top 5% of agents in San Diego

**Target Markets:**
- San Diego neighborhoods: La Jolla, Pacific Beach, North Park, Del Mar, Carmel Valley, Downtown/Gaslamp, Rancho Penasquitos, Poway, Rancho Bernardo, Clairemont, etc
- Price range: $500K - $5M+
- Client types: First-time buyers, move-up buyers, luxury clients, investors

---

## Current Tech Stack

**Website:**
- Framework: Astro (static site generator)
- Hosting: Vercel
- Deployment: Vercel CLI (manual deployment via `./deploy.sh`)
- Domain: rauhomegroup.com
- Staging: rauhomegroup-astro.vercel.app
- Repository: GitHub (rustyrau93/rauhomegroup-astro)

**Key Files:**
- `/src/pages/index.astro` - Homepage
- `/src/pages/buyers.astro` - Buyers page
- `/src/pages/sellers.astro` - Sellers page
- `/src/pages/neighborhoods/` - Individual neighborhood pages
- `/src/styles/global.css` - Main stylesheet
- `/src/layouts/BaseLayout.astro` - Site layout template

**Design:**
- Colors: Navy blue (#1a2332), Gold accent (#c8a882)
- Fonts: Playfair Display (headings), Inter (body)
- Style: Luxury real estate aesthetic, professional but approachable

---

## Current Projects & Priorities

### Active Website Pages:
1. **Homepage** - Main landing page with hero, about, testimonials, neighborhoods carousel
2. **Buyers Page** - Guide for home buyers
3. **Sellers Page** - Guide for home sellers  
4. **Neighborhoods** - 5 detailed neighborhood guides:
   - La Jolla
   - Del Mar
   - Carmel Valley
   - Downtown/Gaslamp
   - North Park

### Recent Improvements:
- Added JSON-LD structured data for SEO
- Fixed navbar transparency issue
- Added contact forms to buyers/sellers pages
- Optimized for mobile responsiveness
- Set up Vercel CLI deployment workflow

### Ongoing Priorities:
1. **Lead Generation** - Email campaigns, landing pages, lead magnets
2. **SEO** - Rank for "San Diego real estate agent" and neighborhood-specific keywords
3. **Content Marketing** - Neighborhood guides, market updates, seller/buyer resources
4. **Conversion Optimization** - Forms, CTAs, user experience improvements

---

## What I Need Help With

### Website Development:
- Bug fixes and UI improvements
- Mobile responsiveness
- Performance optimization
- New features and functionality
- SEO improvements

### Content Creation:
- Neighborhood guides (expand to more areas)
- Blog posts about San Diego real estate market
- Landing pages for specific buyer/seller types
- Email templates

### Marketing Automation:
- Lead capture forms
- Email campaigns
- CRM integration (Follow Up Boss)
- Analytics tracking

---

## My Preferences

**Communication Style:**
- Direct and clear
- I'm not super technical with coding - explain things simply
- Show me what you're doing and why
- Always test before deploying

**Development Workflow:**
1. Make changes locally
2. Test thoroughly
3. Commit to GitHub for version control
4. Deploy via `./deploy.sh` when ready to go live

**Quality Standards:**
- Professional appearance (I'm representing a luxury real estate brand)
- Mobile-first (most clients browse on phones)
- Fast loading times
- Clean, maintainable code
- SEO-friendly

**Important:**
- Never remove existing functionality without asking
- Always keep contact forms and CTAs prominent
- Maintain brand colors and styling
- Test on mobile before deploying

---

## Files & Locations

**Deployment:**
- Deploy script: `./deploy.sh` (pulls Vercel token from 1Password)
- Vercel token stored in: 1Password (Aria vault)

**Important Configs:**
- `vercel.json` - Vercel configuration (cache headers)
- `astro.config.mjs` - Astro configuration
- `package.json` - Dependencies

**Assets:**
- Images: `/public/images/`
- Fonts: Google Fonts (loaded in BaseLayout)
- Icons: Font Awesome

---

## Common Tasks

### Deploy Changes:
```bash
git add .
git commit -m "description of changes"
git push                # Version control
./deploy.sh             # Deploy to production
```

### Test Locally:
```bash
npm run dev             # Start dev server
# Open http://localhost:4321
```

### Build for Production:
```bash
npm run build          # Test build locally
```

---

## Business Context

**San Diego Real Estate Market:**
- Highly competitive (multiple offers common)
- Median home price: ~$925K
- Inventory: Tight (buyer's need expert guidance)
- Luxury market: $2M+ homes (strong demand)

**My Competitive Advantages:**
1. Local expertise (born and raised in San Diego)
2. Personal service (not a faceless team)
3. Strong track record (100% 5-star reviews)
4. Modern marketing (professional photography, social media, high-quality website)

**Client Pain Points I Solve:**
- First-time buyers overwhelmed by the process
- Sellers unsure how to price/market their home
- Out-of-state buyers unfamiliar with San Diego neighborhoods
- Investors looking for the right opportunities

---

## Contact & Support

If you need more context or have questions:
- Ask me directly in the chat
- Check existing pages for design patterns
- Reference the Astro documentation: https://docs.astro.build
- Vercel docs: https://vercel.com/docs

---

**Last Updated:** February 7, 2026
