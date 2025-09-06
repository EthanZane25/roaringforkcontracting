import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [activities, setActivities] = useState([]);
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch('/api/restaurants').then(res => res.json()).then(setRestaurants);
    fetch('/api/activities').then(res => res.json()).then(setActivities);
    fetch('/api/advertisements').then(res => res.json()).then(setAds);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Aspen Adventures & Dining</h1>
      <h2 className="text-xl font-semibold mb-2">Explore Restaurants</h2>
      <ul className="mb-4">
        {restaurants.map((r: any) => (
          <li key={r.id} className="mb-2">
            <Link href={`/eat/${r.id}`}>
              {r.name}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">Fun Things to Do</h2>
      <ul className="mb-4">
        {activities.map((a: any) => (
          <li key={a.id} className="mb-2">
            <Link href={`/fun/${a.id}`}>
              {a.name}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">Advertisements</h2>
      <ul>
        {ads.map((ad: any) => (
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
