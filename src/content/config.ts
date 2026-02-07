import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// ============================================
// NEIGHBORHOOD COLLECTION
// ============================================
const neighborhoods = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/neighborhoods' }),
  schema: z.object({
    // Required fields
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    
    // Location
    city: z.string().default('San Diego'),
    region: z.string().optional(), // "Coastal", "North County", "East County", etc.
    zipCodes: z.array(z.string()).optional(),
    
    // Real estate details
    priceRange: z.object({
      min: z.number(),
      max: z.number(),
    }).optional(),
    
    medianPrice: z.string().optional(),
    avgPricePerSqft: z.string().optional(),
    
    homeStyles: z.array(z.string()).optional(),
    
    // Features
    amenities: z.array(z.string()).optional(),
    highlights: z.array(z.string()).optional(),
    
    // Schools
    schools: z.array(z.object({
      name: z.string(),
      type: z.enum(['elementary', 'middle', 'high', 'private']),
      rating: z.number().min(1).max(10).optional(),
    })).optional(),
    
    // Media
    heroImage: z.string(),
    galleryImages: z.array(z.string()).optional(),
    
    // SEO
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    
    // Status
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    
    // Order for display
    order: z.number().default(999),
  }),
});

// ============================================
// BLOG COLLECTION
// ============================================
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    
    // Categorization
    category: z.enum([
      'buying',
      'selling',
      'market-updates',
      'neighborhoods',
      'home-improvement',
      'lifestyle',
      'investment',
    ]).optional(),
    tags: z.array(z.string()).default([]),
    
    // Media
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    
    // Status
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    
    // Timestamps
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }),
});

// ============================================
// TESTIMONIALS COLLECTION
// ============================================
const testimonials = defineCollection({
  loader: file('./src/content/testimonials/testimonials.json'),
  schema: z.object({
    id: z.string(),
    clientName: z.string(),
    clientLocation: z.string().optional(),
    quote: z.string(),
    rating: z.number().min(1).max(5).default(5),
    
    // Transaction details
    type: z.enum(['buyer', 'seller', 'both']),
    neighborhood: z.string().optional(),
    
    // Display
    featured: z.boolean().default(false),
    order: z.number().default(999),
  }),
});

// Export all collections
export const collections = {
  neighborhoods,
  blog,
  testimonials,
};
