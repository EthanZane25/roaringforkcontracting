// aspen_site/pages/index.tsx
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Restaurant, Activity, Advertisement } from "@prisma/client";

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [restaurantsError, setRestaurantsError] = useState<string | null>(null);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);

  const [ads, setAds] = useState<Advertisement[]>([]);
  const [adsLoading, setAdsLoading] = useState(true);
  const [adsError, setAdsError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    async function fetchData<T>(url: string, setter: (data: T[]) => void, setError: (msg: string | null) => void, setLoading: (loading: boolean) => void, errorMsg: string) {
      setLoading(true);
      try {
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(errorMsg);
        const data: T[] = await res.json();
        setter(data);
        setError(null);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    }

    fetchData<Restaurant>("/api/restaurants", setRestaurants, setRestaurantsError, setRestaurantsLoading, "Failed to load restaurants");
    fetchData<Activity>("/api/activities", setActivities, setActivitiesError, setActivitiesLoading, "Failed to load activities");
    fetchData<Advertisement>("/api/advertisements", setAds, setAdsError, setAdsLoading, "Failed to load advertisements");

    return () => ac.abort();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Welcome to Aspen Adventures &amp; Dining
      </h1>

      {/* Restaurants */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Explore Restaurants</h2>
        {restaurantsLoading ? (
          <p>Loading restaurants…</p>
        ) : restaurantsError ? (
          <p className="text-red-500">{restaurantsError}</p>
        ) : restaurants.length === 0 ? (
          <p>No restaurants found.</p>
        ) : (
          <ul>
            {restaurants.map((r) => (
              <li key={r.id} className="mb-2">
                <Link href={`/eat/${r.id}`} className="text-blue-600 underline">
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Activities */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Fun Things to Do</h2>
        {activitiesLoading ? (
          <p>Loading activities…</p>
        ) : activitiesError ? (
          <p className="text-red-500">{activitiesError}</p>
        ) : activities.length === 0 ? (
          <p>No activities found.</p>
        ) : (
          <ul>
            {activities.map((a) => (
              <li key={a.id} className="mb-2">
                <Link href={`/fun/${a.id}`} className="text-blue-600 underline">
                  {a.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Ads */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Advertisements</h2>
        {adsLoading ? (
          <p>Loading advertisements…</p>
        ) : adsError ? (
          <p className="text-red-500">{adsError}</p>
        ) : ads.length === 0 ? (
          <p>No advertisements available.</p>
        ) : (
          <ul>
            {ads.map((ad) => (
              <li key={ad.id} className="mb-2">
                <Link
                  href={`/advertise/${ad.id}`}
                  className="text-blue-600 underline"
                >
                  {ad.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-10">
        <Link href="/admin" className="text-blue-700 font-semibold underline">
          Go to Admin Dashboard
        </Link>
      </p>
    </div>
  );
}
