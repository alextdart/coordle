import { City } from '../types.js';

export function calculateFeedback(guess: City, secret: City, neighbors: Set<string> = new Set()) {
  const guessHem = getHemisphere(guess.lat, guess.lon);
  const secretHem = getHemisphere(secret.lat, secret.lon);
  
  // Hemisphere feedback
  const hemisphereColor = 
    (guessHem.ns === secretHem.ns && guessHem.ew === secretHem.ew) ? 'green' :
    (guessHem.ns === secretHem.ns || guessHem.ew === secretHem.ew) ? 'yellow' : 'red';
  
  // Latitude/Longitude deltas and colors
  const latDelta = Math.abs(guess.lat - secret.lat);
  const lonDelta = Math.abs(guess.lon - secret.lon);
  
  const latColor = getDistanceColor(latDelta);
  const lonColor = getDistanceColor(lonDelta);
  
  // Direction hints with arrows
  const latHint = guess.lat < secret.lat ? 'N' : (guess.lat > secret.lat ? 'S' : undefined);
  const lonHint = guess.lon < secret.lon ? 'E' : (guess.lon > secret.lon ? 'W' : undefined);
  
  // Combined directional arrow (8 cardinal directions)
  const getDirectionalArrow = (latHint?: string, lonHint?: string): string => {
    if (!latHint && !lonHint) return '';
    if (latHint === 'N' && lonHint === 'E') return '↗️';
    if (latHint === 'N' && lonHint === 'W') return '↖️';
    if (latHint === 'S' && lonHint === 'E') return '↘️';
    if (latHint === 'S' && lonHint === 'W') return '↙️';
    if (latHint === 'N') return '⬆️';
    if (latHint === 'S') return '⬇️';
    if (lonHint === 'E') return '➡️';
    if (lonHint === 'W') return '⬅️';
    return '';
  };
  
  const arrow = getDirectionalArrow(latHint, lonHint);
  
  // Population feedback
  const guessPopulation = guess.population || 0;
  const secretPopulation = secret.population || 0;
  let populationHint: 'higher' | 'lower' | 'similar' = 'similar';
  let populationColor: 'green' | 'yellow' | 'red' = 'green';
  
  if (guessPopulation && secretPopulation) {
    const popDiff = Math.abs(guessPopulation - secretPopulation);
    const popRatio = popDiff / Math.max(guessPopulation, secretPopulation);
    
    if (popRatio <= 0.2) { // Within 20%
      populationHint = 'similar';
      populationColor = 'green';
    } else {
      populationHint = guessPopulation < secretPopulation ? 'higher' : 'lower';
      populationColor = popRatio <= 0.5 ? 'yellow' : 'red';
    }
  }
  
  // Country feedback
  let countryMatch: 'exact' | 'neighbor' | 'other' = 'other';
  let countryColor: 'green' | 'yellow' | 'red' = 'red';
  
  if (guess.country_code === secret.country_code) {
    countryMatch = 'exact';
    countryColor = 'green';
  } else if (neighbors.has(guess.country_code)) {
    countryMatch = 'neighbor';
    countryColor = 'yellow';
  }
  
  return {
    hemisphere: {
      ns: guessHem.ns,
      ew: guessHem.ew,
      color: hemisphereColor as 'green' | 'yellow' | 'red'
    },
    latitude: {
      delta: Math.round(latDelta * 100) / 100,
      color: latColor,
      hint: latHint,
      arrow: arrow
    },
    longitude: {
      delta: Math.round(lonDelta * 100) / 100,
      color: lonColor,
      hint: lonHint,
      arrow: arrow
    },
    population: {
      value: guessPopulation,
      hint: populationHint,
      color: populationColor
    },
    country: {
      match: countryMatch,
      color: countryColor
    }
  };
}

function getHemisphere(lat: number, lon: number) {
  return {
    ns: lat >= 0 ? 'N' as const : 'S' as const,
    ew: lon >= 0 ? 'E' as const : 'W' as const
  };
}

function getDistanceColor(delta: number): 'green' | 'yellow' | 'red' {
  if (delta <= 1.0) return 'green';
  if (delta <= 5.0) return 'yellow';
  return 'red';
}