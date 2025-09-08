// aspen_site/pages/fun/[id].tsx
import { GetServerSideProps } from "next";
import { prisma } from "../../lib/prisma";
import type { Activity } from "@prisma/client";

type SerializableActivity = Omit<Activity, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export default function FunPage({
  activity,
}: {
  activity: SerializableActivity | null;
}) {
  if (!activity) {
    return <div className="container mx-auto p-4">Activity not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{activity.name}</h1>
      <p className="mb-2">{activity.description}</p>
      {activity.location ? (
        <p>
          <strong>Location:</strong> {activity.location}
        </p>
      ) : null}
      {activity.url ? (
        <p>
          Website:{" "}
          <a href={activity.url} target="_blank" rel="noopener noreferrer">
            {activity.url}
          </a>
        </p>
      ) : null}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  activity: SerializableActivity | null;
}> = async (context) => {
  const { id } = context.params as { id?: string };

  const activityId = id ? Number.parseInt(id, 10) : NaN;
  if (!Number.isFinite(activityId)) {
    return { props: { activity: null } };
  }

  const a = await prisma.activity.findUnique({
    where: { id: activityId },
  });

  const activity = a
    ? (JSON.parse(JSON.stringify(a)) as SerializableActivity)
    : null;

  return { props: { activity } };
};
