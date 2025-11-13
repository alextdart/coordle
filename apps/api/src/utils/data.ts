import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { City } from '../types.js';

let citiesCache: City[] | null = null;
let neighborsCache: Set<string> | null = null;

const CITIES_PATH = path.resolve(process.cwd(), '../../supabase/seed/cities.min.json');
const NEIGHBORS_PATH = path.resolve(process.cwd(), '../../supabase/seed/neighbors.csv');

export async function loadCities(): Promise<City[]> {
  if (citiesCache) return citiesCache;
  
  try {
    const raw = await fs.readFile(CITIES_PATH, 'utf8');
    const cities = JSON.parse(raw) as City[];
    
    // Add IDs if missing
    citiesCache = cities.map((city, i) => ({
      ...city,
      id: city.id || i + 1,
      slug: city.slug || slugify(`${city.name}-${city.country_code}`)
    }));
    
    return citiesCache;
  } catch (error) {
    console.error('Failed to load cities:', error);
    throw new Error('Cities data not available');
  }
}

export async function loadNeighbors(): Promise<Set<string>> {
  if (neighborsCache) return neighborsCache;
  
  try {
    const raw = await fs.readFile(NEIGHBORS_PATH, 'utf8');
    const lines = raw.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    neighborsCache = new Set();
    for (const line of lines) {
      const [countryA, countryB] = line.trim().split(',');
      if (countryA && countryB) {
        // Add both directions
        neighborsCache.add(`${countryA}-${countryB}`);
        neighborsCache.add(`${countryB}-${countryA}`);
      }
    }
    
    return neighborsCache;
  } catch (error) {
    console.error('Failed to load neighbors:', error);
    return new Set();
  }
}

export function areNeighbors(countryA: string, countryB: string, neighborsSet: Set<string>): boolean {
  return neighborsSet.has(`${countryA}-${countryB}`) || neighborsSet.has(`${countryB}-${countryA}`);
}

export function getTodaySecretCity(date: string, cities: City[]): City {
  const salt = process.env.DAILY_SALT || 'coordle-default-salt';
  const hash = crypto.createHmac('sha256', salt).update(date).digest('hex');
  const index = parseInt(hash.slice(0, 8), 16) % cities.length;
  return cities[index];
}

export function findCityByName(cities: City[], query: string): City | null {
  const normalized = query.toLowerCase().trim();
  
  // Try exact name match first
  let city = cities.find(c => c.name.toLowerCase() === normalized);
  if (city) return city;
  
  // Try slug match
  city = cities.find(c => c.slug.toLowerCase() === normalized);
  if (city) return city;
  
  // Try partial name match
  city = cities.find(c => c.name.toLowerCase().includes(normalized));
  if (city) return city;
  
  // Try fuzzy matching for typos
  const fuzzyMatch = findBestFuzzyMatch(cities, normalized);
  if (fuzzyMatch) return fuzzyMatch;
  
  return null;
}

function findBestFuzzyMatch(cities: City[], query: string): City | null {
  let bestMatch: City | null = null;
  let bestScore = 0;
  const minScore = 0.6; // Minimum similarity threshold
  
  for (const city of cities) {
    const cityName = city.name.toLowerCase();
    const score = calculateSimilarity(query, cityName);
    
    if (score > bestScore && score >= minScore) {
      bestScore = score;
      bestMatch = city;
    }
  }
  
  return bestMatch;
}

function calculateSimilarity(str1: string, str2: string): number {
  // Simple Levenshtein distance-based similarity
  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  return (maxLength - distance) / maxLength;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // deletion
        matrix[j - 1][i] + 1,     // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

export function getCitySuggestions(cities: City[], query: string, limit: number = 5): City[] {
  if (!query.trim()) return [];
  
  const normalized = query.toLowerCase().trim();
  const suggestions: Array<{ city: City; score: number }> = [];
  
  for (const city of cities) {
    const cityName = city.name.toLowerCase();
    let score = 0;
    
    // Exact match gets highest score
    if (cityName === normalized) {
      score = 1.0;
    }
    // Starts with query gets high score
    else if (cityName.startsWith(normalized)) {
      score = 0.9;
    }
    // Contains query gets medium score
    else if (cityName.includes(normalized)) {
      score = 0.7;
    }
    // Fuzzy match gets lower score
    else {
      score = calculateSimilarity(normalized, cityName);
    }
    
    if (score > 0.4) { // Lower threshold for suggestions
      suggestions.push({ city, score });
    }
  }
  
  // Sort by score and return top results
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.city);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}