// aspen_site/pages/eat/[id].tsx
import { GetServerSideProps } from "next";
import { prisma } from "../../lib/prisma";
import type { Restaurant } from "@prisma/client";

type SerializableRestaurant = Omit<Restaurant, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export default function EatPage({
  restaurant,
}: {
  restaurant: SerializableRestaurant | null;
}) {
  if (!restaurant) {
    return <div className="container mx-auto p-4">Restaurant not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{restaurant.name}</h1>
      <p className="mb-2">{restaurant.description}</p>
      {restaurant.location ? (
        <p>
          <strong>Location:</strong> {restaurant.location}
        </p>
      ) : null}
      {restaurant.url ? (
        <p>
          Website:{" "}
          <a href={restaurant.url} target="_blank" rel="noopener noreferrer">
            {restaurant.url}
          </a>
        </p>
      ) : null}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  restaurant: SerializableRestaurant | null;
}> = async (context) => {
  const { id } = context.params as { id?: string };

  const restId = id ? Number.parseInt(id, 10) : NaN;
  if (!Number.isFinite(restId)) {
    return { props: { restaurant: null } };
  }

  const r = await prisma.restaurant.findUnique({
    where: { id: restId },
  });

  const restaurant = r
    ? (JSON.parse(JSON.stringify(r)) as SerializableRestaurant)
    : null;

  return { props: { restaurant } };
};
