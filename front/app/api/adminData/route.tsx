export async function GET() {
  try {
    const [communes] = await Promise.all([
      fetch(
        'https://geo.api.gouv.fr/communes?fields=nom,code,population,departement,region,siren',
      ).then((res) => res.json()),
    ]);
    return new Response(JSON.stringify({ communes }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=86400, stale-while-revalidate', // CDN cache for 1 day
      },
    });
  } catch (err) {
    return new Response('Failed to fetch data', { status: 500 });
  }
}
