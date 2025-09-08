// aspen_site/pages/admin/index.tsx
import { useState, useEffect, FormEvent } from "react";
import InputField from "../../components/InputField";
import TextAreaField from "../../components/TextAreaField";

type Restaurant = {
  name: string;
  description: string;
  location: string;
  url: string;
};

type Activity = {
  name: string;
  description: string;
  location: string;
  url: string;
};

type Ad = {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
};

const TOKEN_KEY = "admin_token";

function isValidUrl(url: string): boolean {
  try {
    // Basic URL check; new URL() throws if invalid
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

async function createItem<T extends object>(
  url: string,
  data: T,
  token: string
): Promise<void> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(
      `Failed to create item (${res.status} ${res.statusText}) ${msg ? `- ${msg}` : ""}`
    );
  }
}

export default function Admin() {
  const [restaurant, setRestaurant] = useState<Restaurant>({
    name: "",
    description: "",
    location: "",
    url: "",
  });
  const [activity, setActivity] = useState<Activity>({
    name: "",
    description: "",
    location: "",
    url: "",
  });
  const [ad, setAd] = useState<Ad>({
    title: "",
    description: "",
    imageUrl: "",
    link: "",
  });

  const [restaurantError, setRestaurantError] = useState("");
  const [activityError, setActivityError] = useState("");
  const [adError, setAdError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // Safely read token on client only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(TOKEN_KEY);
      if (stored) setToken(stored);
    }
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setBusy(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "Invalid password");
        throw new Error(msg || "Invalid password");
      }
      const data = (await res.json()) as { token: string };
      if (!data?.token) throw new Error("No token returned");
      setToken(data.token);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(TOKEN_KEY, data.token);
      }
      setPassword("");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  };

  const handleRestaurantSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!restaurant.name || !restaurant.description || !restaurant.location || !restaurant.url) {
      setRestaurantError("All fields are required");
      return;
    }
    if (!isValidUrl(restaurant.url)) {
      setRestaurantError("Website URL must be valid");
      return;
    }
    if (!token) {
      setRestaurantError("You must be logged in");
      return;
    }
    setRestaurantError("");
    try {
      await createItem("/api/restaurants", restaurant, token);
      alert("Restaurant created");
      setRestaurant({ name: "", description: "", location: "", url: "" });
    } catch (err: unknown) {
      setRestaurantError(err instanceof Error ? err.message : "Failed to create restaurant");
    }
  };

  const handleActivitySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!activity.name || !activity.description || !activity.location || !activity.url) {
      setActivityError("All fields are required");
      return;
    }
    if (!isValidUrl(activity.url)) {
      setActivityError("Website URL must be valid");
      return;
    }
    if (!token) {
      setActivityError("You must be logged in");
      return;
    }
    setActivityError("");
    try {
      await createItem("/api/activities", activity, token);
      alert("Activity created");
      setActivity({ name: "", description: "", location: "", url: "" });
    } catch (err: unknown) {
      setActivityError(err instanceof Error ? err.message : "Failed to create activity");
    }
  };

  const handleAdSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!ad.title || !ad.description || !ad.imageUrl || !ad.link) {
      setAdError("All fields are required");
      return;
    }
    if (!isValidUrl(ad.imageUrl) || !isValidUrl(ad.link)) {
      setAdError("Image URL and Link must be valid URLs");
      return;
    }
    if (!token) {
      setAdError("You must be logged in");
      return;
    }
    setAdError("");
    try {
      await createItem("/api/advertisements", ad, token);
      alert("Advertisement created");
      setAd({ title: "", description: "", imageUrl: "", link: "" });
    } catch (err: unknown) {
      setAdError(err instanceof Error ? err.message : "Failed to create advertisement");
    }
  };

  if (!token) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Admin Login</h1>
        <form onSubmit={handleLogin} className="max-w-sm space-y-3">
          {/* Ensure your InputField forwards type, value, onChange, required */}
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white disabled:opacity-60"
            disabled={busy}
          >
            {busy ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-gray-600 text-white">
          Logout
        </button>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Add Restaurant</h2>
        <form onSubmit={handleRestaurantSubmit} className="space-y-3">
          <InputField
            placeholder="Name"
            value={restaurant.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRestaurant({ ...restaurant, name: e.target.value })
            }
            required
          />
          <TextAreaField
            placeholder="Description"
            value={restaurant.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setRestaurant({ ...restaurant, description: e.target.value })
            }
            required
          />
          <InputField
            placeholder="Location"
            value={restaurant.location}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRestaurant({ ...restaurant, location: e.target.value })
            }
            required
          />
          <InputField
            type="url"
            placeholder="Website URL"
            value={restaurant.url}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRestaurant({ ...restaurant, url: e.target.value })
            }
            required
          />
          {restaurantError && <p className="text-red-600">{restaurantError}</p>}
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white">
            Add Restaurant
          </button>
        </form>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Add Activity</h2>
        <form onSubmit={handleActivitySubmit} className="space-y-3">
          <InputField
            placeholder="Name"
            value={activity.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setActivity({ ...activity, name: e.target.value })
            }
            required
          />
          <TextAreaField
            placeholder="Description"
            value={activity.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setActivity({ ...activity, description: e.target.value })
            }
            required
          />
          <InputField
            placeholder="Location"
            value={activity.location}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setActivity({ ...activity, location: e.target.value })
            }
            required
          />
          <InputField
            type="url"
            placeholder="Website URL"
            value={activity.url}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setActivity({ ...activity, url: e.target.value })
            }
            required
          />
          {activityError && <p className="text-red-600">{activityError}</p>}
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white">
            Add Activity
          </button>
        </form>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Add Advertisement</h2>
        <form onSubmit={handleAdSubmit} className="space-y-3">
          <InputField
            placeholder="Title"
            value={ad.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAd({ ...ad, title: e.target.value })
            }
            required
          />
          <TextAreaField
            placeholder="Description"
            value={ad.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setAd({ ...ad, description: e.target.value })
            }
            required
          />
          <InputField
            type="url"
            placeholder="Image URL"
            value={ad.imageUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAd({ ...ad, imageUrl: e.target.value })
            }
            required
          />
          <InputField
            type="url"
            placeholder="Link"
            value={ad.link}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAd({ ...ad, link: e.target.value })
            }
            required
          />
          {adError && <p className="text-red-600">{adError}</p>}
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white">
            Add Advertisement
          </button>
        </form>
      </section>
    </div>
  );
}
