import { Router } from 'express';
import { loadCities, getCitySuggestions } from '../utils/data.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.json([]);
    }
    
    const cities = await loadCities();
    const suggestions = getCitySuggestions(cities, q.trim(), parseInt(limit as string));
    
    const result = suggestions.map(city => ({
      name: city.name,
      country_code: city.country_code,
      slug: city.slug
    }));
    
    res.json(result);
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

export default router;