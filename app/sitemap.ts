import type { MetadataRoute } from 'next'

const BASE = 'https://zsystems.vercel.app'
const NOW  = new Date().toISOString()

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          pt: BASE,
          en: `${BASE}/en`,
        },
      },
    },
    {
      url: `${BASE}/#about`,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/#services`,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE}/#projects`,
      lastModified: NOW,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE}/#team`,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE}/#contact`,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    /* Project detail pages */
    ...['agro', 'bioclean', 'ucm', 'deyril', 'samson'].map((id) => ({
      url: `${BASE}/projects/${id}`,
      lastModified: NOW,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ]
}