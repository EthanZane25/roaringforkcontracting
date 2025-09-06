import { GetServerSideProps } from 'next';
import { prisma } from '../../lib/prisma';

export default function Eat({ restaurant }: { restaurant: any }) {
  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{restaurant.name}</h1>
      <p className="mb-2">{restaurant.description}</p>
      {restaurant.location && <p><strong>Location:</strong> {restaurant.location}</p>}
      {restaurant.url && (
        <p>
          Website: <a href={restaurant.url} target="_blank" rel="noopener noreferrer">{restaurant.url}</a>
        </p>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const restaurant = await prisma.restaurant.findUnique({ where: { id: Number(id) } });
  return { props: { restaurant: restaurant || null } };
};
