export interface City {
  name: string;
  country_code: string;
  lat: number;
  lon: number;
  population?: number;
}

export interface Feedback {
  hemisphere: {
    ns: 'N' | 'S';
    ew: 'E' | 'W';
    color: 'green' | 'yellow' | 'red';
  };
  latitude: {
    delta: number;
    color: 'green' | 'yellow' | 'red';
    hint?: 'N' | 'S';
    arrow?: string;
  };
  longitude: {
    delta: number;
    color: 'green' | 'yellow' | 'red';
    hint?: 'E' | 'W';
    arrow?: string;
  };
  population: {
    value: number;
    hint: 'higher' | 'lower' | 'similar';
    color: 'green' | 'yellow' | 'red';
  };
  country: {
    match: 'exact' | 'neighbor' | 'other';
    color: 'green' | 'yellow' | 'red';
  };
}

export interface GuessResult {
  guess: City;
  feedback: Feedback;
  solved: boolean;
  remaining: number;
  gameEnded?: boolean;
  answer?: City;
}

export interface GameStatus {
  date: string;
  maxGuesses: number;
  shareTag: number;
  tz: string;
}