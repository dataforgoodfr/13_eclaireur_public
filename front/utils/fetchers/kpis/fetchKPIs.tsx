import { fetchCommunitiesGoodScoresCount } from './fetchCommunitiesGoodScoresCount';
import { fetchCommunitiesTotalCount } from './fetchCommunitiesTotalCount';
import { fetchPublishedSubventionsTotal } from './fetchPublishedSubventionsTotal';
import { fetchSubventionsTotalBudget } from './fetchSubventionsTotalBudget';

export async function fetchKPIs(year: number) {
  const communitiesTotalCount = await fetchCommunitiesTotalCount();
  const communitiesGoodScoresCount = await fetchCommunitiesGoodScoresCount(year);
  const communitiesGoodScoresPercentage = Math.round(
    (communitiesGoodScoresCount / communitiesTotalCount) * 100,
  );

  const subventionsTotalBudget = await fetchSubventionsTotalBudget(year);
  const publishedSubventionsTotal = await fetchPublishedSubventionsTotal(year);
  const publishedSubventionsPercentage = Math.round(
    (publishedSubventionsTotal / subventionsTotalBudget) * 100,
  );

  return {
    communitiesTotalCount,
    communitiesGoodScoresPercentage,
    publishedSubventionsPercentage,
    subventionsTotalBudget,
  };
}
