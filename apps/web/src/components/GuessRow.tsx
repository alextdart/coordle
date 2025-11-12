import { Feedback } from '../types';

interface GuessRowProps {
  guess: string;
  feedback?: Feedback;
}

export default function GuessRow({ guess, feedback }: GuessRowProps) {
  if (!feedback) {
    return (
      <div className="guess-row">
        <div className="guess-cell">{guess}</div>
        <div className="guess-cell">-</div>
        <div className="guess-cell">-</div>
        <div className="guess-cell">-</div>
        <div className="guess-cell">-</div>
      </div>
    );
  }

  return (
    <div className="guess-row">
      <div className="guess-cell">{guess}</div>
      <div className={`guess-cell color-${feedback.hemisphere.color}`}>
        {feedback.hemisphere.ns}{feedback.hemisphere.ew}
      </div>
      <div className={`guess-cell color-${feedback.latitude.color}`}>
        {feedback.latitude.delta}° {feedback.latitude.arrow || ''}
      </div>
      <div className={`guess-cell color-${feedback.longitude.color}`}>
        {feedback.longitude.delta}° {feedback.longitude.arrow || ''}
      </div>
      <div className={`guess-cell color-${feedback.country.color}`}>
        {feedback.country.match === 'exact' ? '✓' : 
         feedback.country.match === 'neighbor' ? '~' : '✗'}
      </div>
    </div>
  );
}