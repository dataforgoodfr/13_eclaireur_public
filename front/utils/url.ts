const DEFAULT_BASE_URL = 'https://eclaireurpublic.fr';

/**
 * Sanitized base URL: strips trailing slash and www. prefix from NEXT_PUBLIC_BASE_URL.
 * Guards against redirect loops and double-slash issues in sitemap/robots URLs.
 */
export function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL ?? DEFAULT_BASE_URL)
    .replace(/\/$/, '')
    .replace(/^(https?:\/\/)www\./, '$1');
}
