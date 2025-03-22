import db from "@/utils/db"

export enum CommunityType {
  Region = "REG",
  Departement = "DEP",
  Commune = "COM",
}

// Define GeoJSON types
export interface GeoJSONFeature {
  type: string
  geometry: any
  properties: {
    type: string
    libgeo: string
    siren?: string
    population?: number
    codgeo?: string
    reg?: string
    dep?: string
    [key: string]: any
  }
}

export interface GeoJSONData {
  type: string
  features: GeoJSONFeature[]
}

// In-memory cache for server-side
const CACHE = new Map<string, { data: GeoJSONData; timestamp: number }>()
const CACHE_TTL = 1000 // 1 hour in milliseconds

export async function newFetchGeoData(type: CommunityType): Promise<GeoJSONData> {
  try {
    // Check server-side cache first
    const cacheKey = `geo_${type}`
    const cachedData = CACHE.get(cacheKey)

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      console.log(`Using server-side cached data for ${type}`)
      return cachedData.data
    }

    // Define the join condition based on the community type
    let joinCondition = ""
    let additionalFilter = ""
    
    if (type === CommunityType.Region) {
      joinCondition = `
        LEFT JOIN staging_communities sc ON 
        g.type = sc.type AND g.reg = sc.cog 
      `
      // Ensure we're only getting actual regions
      additionalFilter = "AND g.type = 'REG'"
    } else if (type === CommunityType.Departement) {
      joinCondition = `
        LEFT JOIN staging_communities sc ON 
        g.type = sc.type AND g.dep = sc.cog
      `
      // Ensure we're only getting actual departments
      additionalFilter = "AND g.type = 'DEP'"
    } else if (type === CommunityType.Commune) {
      joinCondition = `
        LEFT JOIN staging_communities sc ON 
        g.type = sc.type AND g.codgeo = sc.cog
      `
      // Ensure we're only getting actual communes
      additionalFilter = "AND g.type = 'COM'"
    }

    // Construct the SQL query with additional filtering
    const querySQL = `
      WITH features AS (
        SELECT jsonb_build_object(
          'type', 'Feature',
          'geometry', ST_AsGeoJSON(g.geometry_simplified_001)::jsonb,
          'properties', jsonb_build_object(
            'type', g.type,
            'libgeo', g.libgeo,
            'siren', sc.siren,
            'population', sc.population,
            'codgeo', g.codgeo,
            'reg', g.reg,
            'dep', g.dep
          )
        ) AS feature
        FROM geo_data g
        ${joinCondition}
        WHERE g.type = $1 ${additionalFilter}
      )
      SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(feature)
      )::json as geojson
      FROM features;
    `

    console.log("Executing query for type:", type)
    // Use parameterized query to prevent SQL injection
    const result = await db.query(querySQL, [type])

    // Check if we got results
    if (result.rows.length === 0 || !result.rows[0].geojson) {
      console.warn(`No data found for type: ${type}`)
      return { type: "FeatureCollection", features: [] }
    }

    const geojson = result.rows[0].geojson as GeoJSONData

    // Log the feature count to help debug
    const featureCount = geojson.features?.length || 0
    console.log(`Fetched ${featureCount} features for type: ${type}`)

    // Store in server-side cache
    CACHE.set(cacheKey, {
      data: geojson,
      timestamp: Date.now(),
    })

    return geojson
  } catch (error) {
    console.error(`Error in fetchCommunitiesGeoJSON for type ${type}:`, error)
    throw error
  }
}

