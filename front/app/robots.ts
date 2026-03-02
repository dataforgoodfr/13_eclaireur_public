import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eclaireurpublic.fr';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/_next/static/media/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
