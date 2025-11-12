import { Router } from 'express';
import { loadCities, getTodaySecretCity } from '../utils/data.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const date = new Date().toISOString().slice(0, 10);
    
    // Calculate puzzle number (days since game launch)
    const launchDate = new Date('2024-01-01');
    const currentDate = new Date(date);
    const diffTime = currentDate.getTime() - launchDate.getTime();
    const shareTag = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    res.json({
      date,
      maxGuesses: 6,
      shareTag,
      tz: 'UTC'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get game status' });
  }
});

export default router;