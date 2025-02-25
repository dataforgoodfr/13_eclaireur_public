export default function CommunityPage({ params }: { params: { siren: string } }) {
  console.log(params);
  return <div>Community page for {params?.siren}</div>;
}
