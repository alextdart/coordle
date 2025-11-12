import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import statusRouter from './routes/status.js';
import guessRouter from './routes/guess.js';
import debugRouter from './routes/debug.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/status', statusRouter);
app.use('/api/guess', guessRouter);
app.use('/api/debug', debugRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🌍 Coordle API running on http://localhost:${port}`);
});