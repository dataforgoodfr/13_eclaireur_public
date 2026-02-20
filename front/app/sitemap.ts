import type { MetadataRoute } from 'next';

import { getQueryFromPool } from '#utils/db';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eclaireurpublic.fr';

const staticRoutes: MetadataRoute.Sitemap = [
  { url: `${baseUrl}/`, priority: 1.0, changeFrequency: 'weekly' },
  { url: `${baseUrl}/advanced-search`, priority: 0.9, changeFrequency: 'weekly' },
  { url: `${baseUrl}/map`, priority: 0.8, changeFrequency: 'weekly' },
  { url: `${baseUrl}/perspectives`, priority: 0.8, changeFrequency: 'monthly' },
  { url: `${baseUrl}/le-projet`, priority: 0.7, changeFrequency: 'monthly' },
  { url: `${baseUrl}/qui-sommes-nous`, priority: 0.7, changeFrequency: 'monthly' },
  { url: `${baseUrl}/methodologie`, priority: 0.7, changeFrequency: 'monthly' },
  { url: `${baseUrl}/contexte`, priority: 0.7, changeFrequency: 'monthly' },
  { url: `${baseUrl}/cadre-reglementaire`, priority: 0.6, changeFrequency: 'monthly' },
  { url: `${baseUrl}/faq`, priority: 0.6, changeFrequency: 'monthly' },
  { url: `${baseUrl}/aide-aux-elus`, priority: 0.6, changeFrequency: 'monthly' },
  { url: `${baseUrl}/benevoles`, priority: 0.5, changeFrequency: 'monthly' },
  { url: `${baseUrl}/contact`, priority: 0.5, changeFrequency: 'yearly' },
  { url: `${baseUrl}/legal`, priority: 0.3, changeFrequency: 'yearly' },
  { url: `${baseUrl}/license`, priority: 0.3, changeFrequency: 'yearly' },
];

async function getCommunityRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const rows = (await getQueryFromPool('SELECT siren FROM collectivites ORDER BY siren')) as {
      siren: string;
    }[];

    if (!rows) return [];

    return rows.map(({ siren }) => ({
      url: `${baseUrl}/community/${siren}`,
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const communityRoutes = await getCommunityRoutes();
  return [...staticRoutes, ...communityRoutes];
}
