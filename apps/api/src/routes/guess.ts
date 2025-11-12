import { Router } from 'express';
import { loadCities, getTodaySecretCity, findCityByName } from '../utils/data.js';
import { calculateFeedback } from '../logic/feedback.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { guess, guessCount = 1 } = req.body; // Accept guess count from client
    
    if (!guess || typeof guess !== 'string') {
      return res.status(400).json({ error: 'Guess is required' });
    }
    
    const cities = await loadCities();
    const guessCity = findCityByName(cities, guess);
    
    if (!guessCity) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    const date = new Date().toISOString().slice(0, 10);
    const secretCity = getTodaySecretCity(date, cities);
    
    // Load country neighbors (TODO: implement properly)
    const neighbors = new Set<string>();
    
    const feedback = calculateFeedback(guessCity, secretCity, neighbors);
    const solved = guessCity.id === secretCity.id;
    const maxGuesses = 6;
    const remaining = maxGuesses - guessCount;
    const gameEnded = solved || guessCount >= maxGuesses;
    
    const result: any = {
      guess: {
        name: guessCity.name,
        country_code: guessCity.country_code,
        lat: guessCity.lat,
        lon: guessCity.lon,
        population: guessCity.population
      },
      feedback,
      solved,
      remaining,
      gameEnded
    };
    
    // Reveal answer if game ended without solving
    if (gameEnded && !solved) {
      result.answer = {
        name: secretCity.name,
        country_code: secretCity.country_code,
        lat: secretCity.lat,
        lon: secretCity.lon,
        population: secretCity.population
      };
    }
    
    res.json(result);
  } catch (error) {
    console.error('Guess error:', error);
    res.status(500).json({ error: 'Failed to process guess' });
  }
});

export default router;