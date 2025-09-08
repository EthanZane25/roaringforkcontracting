import { GetServerSideProps } from 'next';
import { prisma } from '../../lib/prisma';
import { Advertisement } from '@/lib/types';

interface AdProps {
  advertisement: Advertisement | null;
}

export default function Ad({ advertisement }: AdProps) {
  if (!advertisement) {
    return <div>Advertisement not found</div>;
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{advertisement.title}</h1>
      <p className="mb-2">{advertisement.description}</p>
      {advertisement.imageUrl && (
        <img src={advertisement.imageUrl} alt={advertisement.title} className="mb-2 max-w-full" />
      )}
      {advertisement.link && (
        <p>
          Learn more: <a href={advertisement.link} target="_blank" rel="noopener noreferrer">{advertisement.link}</a>
        </p>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<AdProps> = async (context) => {
  const { id } = context.params!;
  const advertisement = await prisma.advertisement.findUnique({ where: { id: Number(id) } });
  return { props: { advertisement } };
};
