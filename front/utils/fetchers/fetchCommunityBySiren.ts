
export default async function fetchCommunityBySiren(siren: string) {
    const baseURL = process.env.BASE_URL;

    if (!baseURL) {
        throw new Error("BASE_URL is not defined in the environment variables.");
    }

    const url = new URL(`/api/selected_communities?siren=${siren}&limit=1`, baseURL);
    console.log(url.toString(), 'url'); // Ensure the URL is correctly formatted

    const res = await fetch(url.toString());

    if (!res.ok) {
        throw new Error(`Failed to fetch community: ${res.status} ${res.statusText}`);
    }

    const community = await res.json();

    return community[0];
}
