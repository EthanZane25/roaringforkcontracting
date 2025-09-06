import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const restaurants = await prisma.restaurant.findMany();
    return res.status(200).json(restaurants);
  } else if (req.method === 'POST') {
    const { name, description, location, url } = req.body;
    const restaurant = await prisma.restaurant.create({
      data: { name, description, location, url }
    });
    return res.status(201).json(restaurant);
  }
  res.status(405).json({ message: 'Method not allowed' });
}
