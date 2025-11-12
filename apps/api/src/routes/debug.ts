import { Router } from 'express';
import { loadCities, getTodaySecretCity } from '../utils/data.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Only allow in development or with admin token
    const adminToken = process.env.ADMIN_TOKEN;
    const providedToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (process.env.NODE_ENV !== 'development' && providedToken !== adminToken) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const cities = await loadCities();
    const date = new Date().toISOString().slice(0, 10);
    const secretCity = getTodaySecretCity(date, cities);
    
    res.json({
      date,
      secret: {
        name: secretCity.name,
        country_code: secretCity.country_code,
        lat: secretCity.lat,
        lon: secretCity.lon
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get debug info' });
  }
});

export default router;