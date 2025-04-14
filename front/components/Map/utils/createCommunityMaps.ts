import { Community } from "@/app/models/community";

const createCommunityMaps = (
  regions: Community[],
  departments: Community[],
  communes: Community[]
) => ({
  regionsByCode: Object.fromEntries(regions.map(r => [r.code_insee_region, r])),
  departmentsByCode: Object.fromEntries(departments.map(d => [d.code_insee, d])),
  communesByCode: Object.fromEntries(communes.map(c => [c.code_insee, c])),
});

export default createCommunityMaps