export interface Restaurant {
  id: number;
  name: string;
  description: string;
  location?: string | null;
  url?: string | null;
}

export interface Activity {
  id: number;
  name: string;
  description: string;
  location?: string | null;
  url?: string | null;
}

export interface Advertisement {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  link?: string | null;
}
