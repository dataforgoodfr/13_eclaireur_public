/**
 * Get the correct base URL for API calls
 * In Storybook environment, use the configured base URL
 * In production/development, use window.location.origin
 */
export function getBaseUrl(): string {
  const isStorybook = typeof window !== 'undefined' && window.location.href.includes('localhost:6006');
  const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const windowOrigin = typeof window !== 'undefined' ? window.location.origin : envBaseUrl;
  
  let baseUrl: string;
  
  if (isStorybook) {
    baseUrl = envBaseUrl;
    console.log('[getBaseUrl] Storybook environment detected, using env base URL:', baseUrl);
  } else if (typeof window !== 'undefined') {
    baseUrl = windowOrigin;
    console.log('[getBaseUrl] Browser environment, using window.location.origin:', baseUrl);
  } else {
    baseUrl = envBaseUrl;
    console.log('[getBaseUrl] Server-side rendering, using env fallback:', baseUrl);
  }
  
  return baseUrl;
}