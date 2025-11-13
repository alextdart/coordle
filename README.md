# Coordle 🌍

Daily city guessing game inspired by Wordle. Guess the secret city in 6 tries using geographic clues!

## Development

### Quick Start

```bash
# Set up environment
cp .env.example .env

# Install all dependencies
npm run install:all

# Start both servers (in separate terminals)
npm run dev:api    # API on :3000
npm run dev:web    # Web on :5173
```

### Build for Production

```bash
# Build both apps
./build.sh

# Or manually:
cd apps/api && npm run build
cd ../web && npm run build
```

## 🚀 Deployment

Deploy to Vercel in 3 steps:

1. **Push to GitHub**
2. **Connect to Vercel** (auto-detects config)
3. **Set environment variables** in Vercel dashboard

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Live Demo**: Deploy your own at `https://yourname-coordle.vercel.app`

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