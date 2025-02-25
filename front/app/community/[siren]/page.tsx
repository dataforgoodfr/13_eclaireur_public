export default async function CommunityPage({ params }: { params: Promise<{ siren: string }> }) {
  const siren = (await params).siren;
  return <div>Community page for {siren}</div>;
}
