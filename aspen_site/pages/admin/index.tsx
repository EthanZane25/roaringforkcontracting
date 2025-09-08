import { useState, FormEvent } from 'react';
import InputField from '../../components/InputField';
import TextAreaField from '../../components/TextAreaField';

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

async function createItem(url: string, data: any) {
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export default function Admin() {
  const [restaurant, setRestaurant] = useState({ name: '', description: '', location: '', url: '' });
  const [activity, setActivity] = useState({ name: '', description: '', location: '', url: '' });
  const [ad, setAd] = useState({ title: '', description: '', imageUrl: '', link: '' });
  const [restaurantError, setRestaurantError] = useState('');
  const [activityError, setActivityError] = useState('');
  const [adError, setAdError] = useState('');

  const handleRestaurantSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!restaurant.name || !restaurant.description || !restaurant.location || !restaurant.url) {
      setRestaurantError('All fields are required');
      return;
    }
    if (!isValidUrl(restaurant.url)) {
      setRestaurantError('Website URL must be valid');
      return;
    }
    setRestaurantError('');
    await createItem('/api/restaurants', restaurant);
    alert('Restaurant created');
  };

  const handleActivitySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!activity.name || !activity.description || !activity.location || !activity.url) {
      setActivityError('All fields are required');
      return;
    }
    if (!isValidUrl(activity.url)) {
      setActivityError('Website URL must be valid');
      return;
    }
    setActivityError('');
    await createItem('/api/activities', activity);
    alert('Activity created');
  };

  const handleAdSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!ad.title || !ad.description || !ad.imageUrl || !ad.link) {
      setAdError('All fields are required');
      return;
    }
    if (!isValidUrl(ad.imageUrl) || !isValidUrl(ad.link)) {
      setAdError('Image URL and Link must be valid URLs');
      return;
    }
    setAdError('');
    await createItem('/api/advertisements', ad);
    alert('Advertisement created');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Add Restaurant</h2>
        <form onSubmit={handleRestaurantSubmit}>
          <InputField placeholder="Name" value={restaurant.name} onChange={e => setRestaurant({ ...restaurant, name: e.target.value })} required />
          <TextAreaField placeholder="Description" value={restaurant.description} onChange={e => setRestaurant({ ...restaurant, description: e.target.value })} required />
          <InputField placeholder="Location" value={restaurant.location} onChange={e => setRestaurant({ ...restaurant, location: e.target.value })} required />
          <InputField type="url" placeholder="Website URL" value={restaurant.url} onChange={e => setRestaurant({ ...restaurant, url: e.target.value })} required />
          {restaurantError && <p className="text-red-600 mb-2">{restaurantError}</p>}
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white">Add Restaurant</button>
        </form>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Add Activity</h2>
        <form onSubmit={handleActivitySubmit}>
          <InputField placeholder="Name" value={activity.name} onChange={e => setActivity({ ...activity, name: e.target.value })} required />
          <TextAreaField placeholder="Description" value={activity.description} onChange={e => setActivity({ ...activity, description: e.target.value })} required />
          <InputField placeholder="Location" value={activity.location} onChange={e => setActivity({ ...activity, location: e.target.value })} required />
          <InputField type="url" placeholder="Website URL" value={activity.url} onChange={e => setActivity({ ...activity, url: e.target.value })} required />
          {activityError && <p className="text-red-600 mb-2">{activityError}</p>}
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white">Add Activity</button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Add Advertisement</h2>
        <form onSubmit={handleAdSubmit}>
          <InputField placeholder="Title" value={ad.title} onChange={e => setAd({ ...ad, title: e.target.value })} required />
          <TextAreaField placeholder="Description" value={ad.description} onChange={e => setAd({ ...ad, description: e.target.value })} required />
          <InputField type="url" placeholder="Image URL" value={ad.imageUrl} onChange={e => setAd({ ...ad, imageUrl: e.target.value })} required />
          <InputField type="url" placeholder="Link" value={ad.link} onChange={e => setAd({ ...ad, link: e.target.value })} required />
          {adError && <p className="text-red-600 mb-2">{adError}</p>}
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white">Add Advertisement</button>
        </form>
      </section>
    </div>
  );
}
