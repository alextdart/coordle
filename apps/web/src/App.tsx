import React, { useState, useEffect } from 'react';
import GuessRow from './components/GuessRow';
import { GuessResult, GameStatus } from './types';
import { getGameStatus, submitGuess } from './api';

function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus | null>(null);
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameEnded, setGameEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    getGameStatus()
      .then(setGameStatus)
      .catch(err => setError(err.message));
  }, []);

  const handleSubmitGuess = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentGuess.trim() || loading || gameEnded) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const guessCount = guesses.length + 1;
      const result = await submitGuess(currentGuess.trim(), guessCount);
      setGuesses(prev => [...prev, result]);
      setCurrentGuess('');
      
      if (result.solved || result.gameEnded) {
        setGameEnded(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div>
        <h1>🌍 Coordle</h1>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    );
  }

  if (!gameStatus) {
    return (
      <div>
        <h1>🌍 Coordle</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>🌍 Coordle</h1>
      <p>Puzzle #{gameStatus.shareTag} - {gameStatus.date}</p>
      <p>Guess the secret city in {gameStatus.maxGuesses} tries!</p>
      
      <div className="guess-table">
        <div className="guess-row">
          <div className="guess-cell"><strong>City</strong></div>
          <div className="guess-cell"><strong>Hemisphere</strong></div>
          <div className="guess-cell"><strong>Latitude</strong></div>
          <div className="guess-cell"><strong>Longitude</strong></div>
          <div className="guess-cell"><strong>Population</strong></div>
          <div className="guess-cell"><strong>Country</strong></div>
        </div>
        
        {guesses.map((result, i) => (
          <GuessRow 
            key={i}
            guess={result.guess.name}
            feedback={result.feedback}
          />
        ))}
        
        {/* Empty rows for remaining guesses */}
        {Array.from({ length: gameStatus.maxGuesses - guesses.length }).map((_, i) => (
          <GuessRow key={`empty-${i}`} guess="?" />
        ))}
      </div>

      {!gameEnded && (
        <form onSubmit={handleSubmitGuess} className="input-bar">
          <input
            type="text"
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value)}
            placeholder="Enter a city name..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !currentGuess.trim()}>
            {loading ? 'Guessing...' : 'Guess'}
          </button>
        </form>
      )}

      {gameEnded && (
        <div>
          {guesses[guesses.length - 1]?.solved ? (
            <p style={{ color: '#22c55e' }}>🎉 Congratulations! You found the city!</p>
          ) : (
            <div>
              <p style={{ color: '#ef4444' }}>Game over! Better luck tomorrow.</p>
              {guesses[guesses.length - 1]?.answer && (
                <p style={{ color: '#ffffff' }}>
                  The answer was: <strong>{guesses[guesses.length - 1].answer!.name}</strong> 
                  ({guesses[guesses.length - 1].answer!.country_code}) 
                  at {guesses[guesses.length - 1].answer!.lat.toFixed(2)}°, {guesses[guesses.length - 1].answer!.lon.toFixed(2)}°
                  {guesses[guesses.length - 1].answer!.population && 
                    ` with ${(guesses[guesses.length - 1].answer!.population! / 1000000).toFixed(1)}M people`}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;