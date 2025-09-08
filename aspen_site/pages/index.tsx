import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Restaurant, Activity, Advertisement } from '@/lib/types';

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);

  useEffect(() => {
    fetch('/api/restaurants')
      .then(res => res.json())
      .then((data: Restaurant[]) => setRestaurants(data));
    fetch('/api/activities')
      .then(res => res.json())
      .then((data: Activity[]) => setActivities(data));
    fetch('/api/advertisements')
      .then(res => res.json())
      .then((data: Advertisement[]) => setAds(data));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Aspen Adventures & Dining</h1>
      <h2 className="text-xl font-semibold mb-2">Explore Restaurants</h2>
      <ul className="mb-4">
        {restaurants.map(r => (
          <li key={r.id} className="mb-2">
            <Link href={`/eat/${r.id}`}>
              {r.name}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">Fun Things to Do</h2>
      <ul className="mb-4">
        {activities.map(a => (
          <li key={a.id} className="mb-2">
            <Link href={`/fun/${a.id}`}>
              {a.name}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">Advertisements</h2>
      <ul>
        {ads.map(ad => (
          <li key={ad.id} className="mb-2">
            <Link href={`/advertise/${ad.id}`}>
              {ad.title}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8">
        <Link href="/admin">
          Go to Admin Dashboard
        </Link>
      </p>
    </div>
  );
}
