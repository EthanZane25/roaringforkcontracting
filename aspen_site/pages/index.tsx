import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [restaurantsError, setRestaurantsError] = useState<string | null>(null);

  const [activities, setActivities] = useState<any[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);

  const [ads, setAds] = useState<any[]>([]);
  const [adsLoading, setAdsLoading] = useState(true);
  const [adsError, setAdsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setRestaurantsLoading(true);
      try {
        const res = await fetch('/api/restaurants');
        if (!res.ok) throw new Error('Failed to load restaurants');
        const data = await res.json();
        setRestaurants(data);
      } catch (err) {
        setRestaurantsError('Failed to load restaurants');
      } finally {
        setRestaurantsLoading(false);
      }
    };

    const fetchActivities = async () => {
      setActivitiesLoading(true);
      try {
        const res = await fetch('/api/activities');
        if (!res.ok) throw new Error('Failed to load activities');
        const data = await res.json();
        setActivities(data);
      } catch (err) {
        setActivitiesError('Failed to load activities');
      } finally {
        setActivitiesLoading(false);
      }
    };

    const fetchAds = async () => {
      setAdsLoading(true);
      try {
        const res = await fetch('/api/advertisements');
        if (!res.ok) throw new Error('Failed to load advertisements');
        const data = await res.json();
        setAds(data);
      } catch (err) {
        setAdsError('Failed to load advertisements');
      } finally {
        setAdsLoading(false);
      }
    };

    fetchRestaurants();
    fetchActivities();
    fetchAds();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Aspen Adventures & Dining</h1>
      <h2 className="text-xl font-semibold mb-2">Explore Restaurants</h2>
      {restaurantsLoading ? (
        <p>Loading restaurants...</p>
      ) : restaurantsError ? (
        <p className="text-red-500">{restaurantsError}</p>
      ) : (
        <ul className="mb-4">
          {restaurants.map((r: any) => (
            <li key={r.id} className="mb-2">
              <Link href={`/eat/${r.id}`}>
                {r.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <h2 className="text-xl font-semibold mb-2">Fun Things to Do</h2>
      {activitiesLoading ? (
        <p>Loading activities...</p>
      ) : activitiesError ? (
        <p className="text-red-500">{activitiesError}</p>
      ) : (
        <ul className="mb-4">
          {activities.map((a: any) => (
            <li key={a.id} className="mb-2">
              <Link href={`/fun/${a.id}`}>
                {a.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <h2 className="text-xl font-semibold mb-2">Advertisements</h2>
      {adsLoading ? (
        <p>Loading advertisements...</p>
      ) : adsError ? (
        <p className="text-red-500">{adsError}</p>
      ) : (
        <ul>
          {ads.map((ad: any) => (
            <li key={ad.id} className="mb-2">
              <Link href={`/advertise/${ad.id}`}>
                {ad.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-8">
        <Link href="/admin">
          Go to Admin Dashboard
        </Link>
      </p>
    </div>
  );
}
