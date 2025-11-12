# Coordle 🌍

Daily city guessing game inspired by Wordle. Guess the secret city in 6 tries using geographic clues!

## Development

### Quick Start

```bash
# Set up environment
cp .env.example .env

# Install API dependencies
cd apps/api
npm install

# Install web app dependencies  
cd ../web
npm install

# Start both servers (in separate terminals)
cd ../api && npm run dev    # API on :3000
cd ../web && npm run dev    # Web on :5173
```

### Game Rules

- **6 guesses** to find the daily secret city
- **4 feedback categories** per guess:
  - **Hemisphere**: N/S and E/W positioning 
  - **Latitude**: Distance in degrees (green ≤1°, yellow ≤5°, red >5°)
  - **Longitude**: Distance in degrees (same thresholds)
  - **Country**: Exact match (green), neighbor (yellow), or other (red)

### Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express + TypeScript  
- **Database**: Supabase (cities + daily rotation)
- **Deploy**: Vercel (both frontend + serverless API)

## Project Structure

```
coordle/
  apps/
    api/          # Express API server
    web/          # React Vite app
  supabase/
    seed/         # cities.min.json + neighbors.csv
```