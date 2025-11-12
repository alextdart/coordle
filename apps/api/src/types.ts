export interface City {
  id?: number;
  name: string;
  slug: string;
  country_code: string;
  lat: number;
  lon: number;
  population?: number;
}

export interface GuessResult {
  guess: City;
  feedback: {
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
    country: {
      match: 'exact' | 'neighbor' | 'other';
      color: 'green' | 'yellow' | 'red';
    };
  };
  solved: boolean;
  remaining: number;
}