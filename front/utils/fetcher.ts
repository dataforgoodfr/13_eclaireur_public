export async function fetchCommunities(type?: string, limit = 100) {
    const url = new URL('/api/selected_communities', window.location.origin);
    if (type) url.searchParams.append('type', type);
    url.searchParams.append('limit', limit.toString());
  
    const res = await fetch(url.toString());
  
    if (!res.ok) {
      throw new Error('Failed to fetch communities');
    }
  
    return res.json();
  }