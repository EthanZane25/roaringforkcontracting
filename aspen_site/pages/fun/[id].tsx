import { GetServerSideProps } from 'next';
import { prisma } from '../../lib/prisma';
import { Activity } from '@/lib/types';

interface FunProps {
  activity: Activity | null;
}

export default function Fun({ activity }: FunProps) {
  if (!activity) {
    return <div>Activity not found</div>;
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{activity.name}</h1>
      <p className="mb-2">{activity.description}</p>
      {activity.location && <p><strong>Location:</strong> {activity.location}</p>}
      {activity.url && (
        <p>
          Website: <a href={activity.url} target="_blank" rel="noopener noreferrer">{activity.url}</a>
        </p>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<FunProps> = async (context) => {
  const { id } = context.params!;
  const activity = await prisma.activity.findUnique({ where: { id: Number(id) } });
  return { props: { activity } };
};
