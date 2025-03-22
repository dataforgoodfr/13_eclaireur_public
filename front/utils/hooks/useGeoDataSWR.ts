"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
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

// Define the fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`)
  }

  return response.json()
}

export function useGeoDataSWR(): UseGeoDataResult {
  // Use SWR to fetch regions, departments, and communes data
  const { data: regionsData, error: regionsError } = useSWR<GeoJSONData | null>("/api/geo/regions", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 1000,
    fallbackData: JSON.parse(localStorage.getItem("geo_regions") || "null"), // LocalStorage fallback
  })

  const { data: departmentsData, error: departmentsError } = useSWR<GeoJSONData | null>("/api/geo/departments", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 1000,
    fallbackData: JSON.parse(localStorage.getItem("geo_departments") || "null"),
  })

  const { data: communesData, error: communesError } = useSWR<GeoJSONData | null>("/api/geo/communes", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 1000,
    fallbackData: JSON.parse(localStorage.getItem("geo_communes") || "null"),
  })

  // Handle errors
  const error = regionsError || departmentsError || communesError
  const isLoadingRegions = !regionsData && !regionsError
  const isLoadingDepartments = !departmentsData && !departmentsError
  const isLoadingCommunes = !communesData && !communesError

  return {
    regionsData: regionsData ?? null,
    departmentsData: departmentsData ?? null,
    communesData: communesData ?? null,
    isLoadingRegions,
    isLoadingDepartments,
    isLoadingCommunes,
    error: error ? error.message : null,
  }
}
