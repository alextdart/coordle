const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export async function getGameStatus() {
  const response = await fetch(`${API_BASE}/api/status`);
  if (!response.ok) {
    throw new Error('Failed to fetch game status');
  }
  return response.json();
}

export async function submitGuess(guess: string, guessCount: number) {
  const response = await fetch(`${API_BASE}/api/guess`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ guess, guessCount }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit guess');
  }
  
  return response.json();
}