// TODO: Review and remove unused variables. This file ignores unused vars for now.
/* eslint-disable @typescript-eslint/no-unused-vars */

type RankingCommunityProps = {
  communityName: string;
};
export default function RankingCommunity({ communityName }: RankingCommunityProps) {
  return (
    <div className='right max-w-[300] px-4 py-2 font-bold'>
      10e sur 120 villes de plus de 100 000 habitants
    </div>
  );
}
