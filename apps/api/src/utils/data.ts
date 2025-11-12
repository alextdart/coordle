import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { City } from '../types.js';

let citiesCache: City[] | null = null;

export async function loadCities(): Promise<City[]> {
  if (citiesCache) return citiesCache;
  
  try {
    const citiesPath = path.resolve(process.cwd(), '../../supabase/seed/cities.min.json');
    const raw = await fs.readFile(citiesPath, 'utf8');
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
  
  return null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}