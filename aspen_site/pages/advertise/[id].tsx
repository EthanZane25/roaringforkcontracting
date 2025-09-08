import { GetServerSideProps } from "next";
import { prisma } from "../../lib/prisma";
import type { Advertisement } from "@prisma/client";

type SerializableAd = Omit<Advertisement, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export default function AdPage({
  advertisement,
}: {
  advertisement: SerializableAd | null;
}) {
  if (!advertisement) {
    return <div className="container mx-auto p-4">Advertisement not found</div>;
    // Alternatively: return null and use a 404 page
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{advertisement.title}</h1>
      <p className="mb-2">{advertisement.description}</p>
      {advertisement.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={advertisement.imageUrl}
          alt={advertisement.title}
          className="mb-2 max-w-full"
        />
      ) : null}
      {advertisement.link ? (
        <p>
          Learn more:{" "}
          <a href={advertisement.link} target="_blank" rel="noopener noreferrer">
            {advertisement.link}
          </a>
        </p>
      ) : null}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  advertisement: SerializableAd | null;
}> = async (context) => {
  const { id } = context.params as { id?: string };

  // Validate id
  const adId = id ? Number.parseInt(id, 10) : NaN;
  if (!Number.isFinite(adId)) {
    return { props: { advertisement: null } };
  }

  const ad = await prisma.advertisement.findUnique({
    where: { id: adId },
  });

  // Make props JSON-serializable (Dates -> ISO strings)
  const advertisement = ad
    ? (JSON.parse(JSON.stringify(ad)) as SerializableAd)
    : null;

  return { props: { advertisement } };
};
