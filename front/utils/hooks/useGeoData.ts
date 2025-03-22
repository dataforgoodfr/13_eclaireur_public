"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Feature, FeatureCollection, Geometry, GeoJsonProperties } from "geojson"

// Define types for our GeoJSON data that are compatible with deck.gl
export interface GeoJSONFeature extends Feature<Geometry, GeoJsonProperties> {
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

// Make GeoJSONData extend FeatureCollection to be compatible with deck.gl
export interface GeoJSONData extends FeatureCollection<Geometry, GeoJsonProperties> {
  features: GeoJSONFeature[]
}

// Define the return type for our hook
interface UseGeoDataResult {
  regionsData: GeoJSONData | null
  departmentsData: GeoJSONData | null
  communesData: GeoJSONData | null
  isLoadingRegions: boolean
  isLoadingDepartments: boolean
  isLoadingCommunes: boolean
  error: string | null
}

// Define cache entry type
interface CacheEntry {
  data: GeoJSONData
  timestamp: number
}

// Create a client-side cache
const CLIENT_CACHE = new Map<string, CacheEntry>()
const CLIENT_CACHE_TTL = 30 * 60 * 1000 // 30 minutes in milliseconds

export function useGeoData(): UseGeoDataResult {
  const [regionsData, setRegionsData] = useState<GeoJSONData | null>(null)
  const [departmentsData, setDepartmentsData] = useState<GeoJSONData | null>(null)
  const [communesData, setCommunesData] = useState<GeoJSONData | null>(null)
  const [isLoadingRegions, setIsLoadingRegions] = useState(true)
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true)
  const [isLoadingCommunes, setIsLoadingCommunes] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if we have data in localStorage on initial load
  useEffect(() => {
    try {
      // Try to load from localStorage first (for persistent caching)
      const storedRegions = localStorage.getItem("geo_regions")
      const storedDepartments = localStorage.getItem("geo_departments")
      const storedCommunes = localStorage.getItem("geo_communes")

      if (storedRegions) {
        try {
          const parsed = JSON.parse(storedRegions) as CacheEntry
          if (Date.now() - parsed.timestamp < CLIENT_CACHE_TTL) {
            console.log("Using localStorage cached regions data")
            setRegionsData(parsed.data)
            setIsLoadingRegions(false)
          }
        } catch (e) {
          console.warn("Error parsing regions from localStorage:", e)
        }
      }

      if (storedDepartments) {
        try {
          const parsed = JSON.parse(storedDepartments) as CacheEntry
          if (Date.now() - parsed.timestamp < CLIENT_CACHE_TTL) {
            console.log("Using localStorage cached departments data")
            setDepartmentsData(parsed.data)
            setIsLoadingDepartments(false)
          }
        } catch (e) {
          console.warn("Error parsing departments from localStorage:", e)
        }
      }

      if (storedCommunes) {
        try {
          const parsed = JSON.parse(storedCommunes) as CacheEntry
          if (Date.now() - parsed.timestamp < CLIENT_CACHE_TTL) {
            console.log("Using localStorage cached communes data")
            setCommunesData(parsed.data)
            setIsLoadingCommunes(false)
          }
        } catch (e) {
          console.warn("Error parsing communes from localStorage:", e)
        }
      }
    } catch (e) {
      console.warn("Error loading from localStorage:", e)
      // Continue with normal fetching if localStorage fails
    }
  }, [])

  // Fetch regions and departments data
  useEffect(() => {
    async function fetchBasicData() {
      try {
        setError(null)

        // Check memory cache first for regions
        if (CLIENT_CACHE.has("regions")) {
          const cached = CLIENT_CACHE.get("regions")!
          if (Date.now() - cached.timestamp < CLIENT_CACHE_TTL) {
            console.log("Using memory cached regions data")
            setRegionsData(cached.data)
            setIsLoadingRegions(false)
          } else {
            // Cache expired, fetch new data
            fetchRegions()
          }
        } else if (isLoadingRegions) {
          // No cache, fetch new data
          fetchRegions()
        }

        // Check memory cache first for departments
        if (CLIENT_CACHE.has("departments")) {
          const cached = CLIENT_CACHE.get("departments")!
          if (Date.now() - cached.timestamp < CLIENT_CACHE_TTL) {
            console.log("Using memory cached departments data")
            setDepartmentsData(cached.data)
            setIsLoadingDepartments(false)
          } else {
            // Cache expired, fetch new data
            fetchDepartments()
          }
        } else if (isLoadingDepartments) {
          // No cache, fetch new data
          fetchDepartments()
        }
      } catch (error) {
        console.error("Error in fetchBasicData:", error)
        setError(error instanceof Error ? error.message : "Failed to load map data")
      }
    }

    async function fetchRegions() {
      try {
        setIsLoadingRegions(true)
        const response = await fetch("/api/geo/regions")

        if (!response.ok) {
          throw new Error(`Failed to fetch regions: ${response.statusText}`)
        }

        const data = (await response.json()) as GeoJSONData

        // Validate the data structure
        if (!data.features || !Array.isArray(data.features)) {
          console.warn("Regions data is not in the expected format", data)
          setRegionsData({ type: "FeatureCollection", features: [] })
        } else {
          // Filter to ensure we only have regions
          const filteredData: GeoJSONData = {
            ...data,
            features: data.features.filter((f) => f.properties && f.properties.type === "REG"),
          }

          setRegionsData(filteredData)

          // Store in memory cache
          CLIENT_CACHE.set("regions", { data: filteredData, timestamp: Date.now() })

          // Store in localStorage for persistence
          try {
            localStorage.setItem(
              "geo_regions",
              JSON.stringify({
                data: filteredData,
                timestamp: Date.now(),
              }),
            )
          } catch (e) {
            console.warn("Error storing regions in localStorage:", e)
          }
        }
      } catch (error) {
        console.error("Error fetching regions:", error)
        setError(error instanceof Error ? error.message : "Failed to load regions")
      } finally {
        setIsLoadingRegions(false)
      }
    }

    async function fetchDepartments() {
      try {
        setIsLoadingDepartments(true)
        const response = await fetch("/api/geo/departments")

        if (!response.ok) {
          throw new Error(`Failed to fetch departments: ${response.statusText}`)
        }

        const data = (await response.json()) as GeoJSONData

        // Validate the data structure
        if (!data.features || !Array.isArray(data.features)) {
          console.warn("Departments data is not in the expected format", data)
          setDepartmentsData({ type: "FeatureCollection", features: [] })
        } else {
          // Filter to ensure we only have departments
          const filteredData: GeoJSONData = {
            ...data,
            features: data.features.filter((f) => f.properties && f.properties.type === "DEP"),
          }

          setDepartmentsData(filteredData)

          // Store in memory cache
          CLIENT_CACHE.set("departments", { data: filteredData, timestamp: Date.now() })

          // Store in localStorage for persistence
          try {
            localStorage.setItem(
              "geo_departments",
              JSON.stringify({
                data: filteredData,
                timestamp: Date.now(),
              }),
            )
          } catch (e) {
            console.warn("Error storing departments in localStorage:", e)
          }
        }
      } catch (error) {
        console.error("Error fetching departments:", error)
        setError(error instanceof Error ? error.message : "Failed to load departments")
      } finally {
        setIsLoadingDepartments(false)
      }
    }

    fetchBasicData()
  }, [isLoadingRegions, isLoadingDepartments])

  // Fetch communes data after basic data is loaded
  useEffect(() => {
    if (!isLoadingRegions && !isLoadingDepartments && !error) {
      async function fetchCommunesData() {
        // Check memory cache first
        if (CLIENT_CACHE.has("communes")) {
          const cached = CLIENT_CACHE.get("communes")!
          if (Date.now() - cached.timestamp < CLIENT_CACHE_TTL) {
            console.log("Using memory cached communes data")
            setCommunesData(cached.data)
            return
          }
        }

        try {
          setIsLoadingCommunes(true)
          const response = await fetch("/api/geo/communes")

          if (!response.ok) {
            throw new Error(`Failed to fetch communes: ${response.statusText}`)
          }

          const data = (await response.json()) as GeoJSONData

          // Validate the data structure
          if (!data.features || !Array.isArray(data.features)) {
            console.warn("Communes data is not in the expected format", data)
            setCommunesData({ type: "FeatureCollection", features: [] })
          } else {
            // Filter to ensure we only have communes
            const filteredData: GeoJSONData = {
              ...data,
              features: data.features.filter((f) => f.properties && f.properties.type === "COM"),
            }

            setCommunesData(filteredData)

            // Store in memory cache
            CLIENT_CACHE.set("communes", { data: filteredData, timestamp: Date.now() })

            // Store in localStorage for persistence
            try {
              localStorage.setItem(
                "geo_communes",
                JSON.stringify({
                  data: filteredData,
                  timestamp: Date.now(),
                }),
              )
            } catch (e) {
              console.warn("Error storing communes in localStorage:", e)
            }
          }
        } catch (error) {
          console.error("Error loading communes geo data:", error)
          // Don't set the main error state for communes, as we still want to show the map
        } finally {
          setIsLoadingCommunes(false)
        }
      }

      fetchCommunesData()
    }
  }, [isLoadingRegions, isLoadingDepartments, error])

  return {
    regionsData,
    departmentsData,
    communesData,
    isLoadingRegions,
    isLoadingDepartments,
    isLoadingCommunes,
    error,
  }
}

