import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const restaurants = await prisma.restaurant.findMany();
      return res.status(200).json(restaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return res.status(500).json({ message: 'Failed to fetch restaurants' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description, location, url } = req.body;
      const restaurant = await prisma.restaurant.create({
        data: { name, description, location, url }
      });
      return res.status(201).json(restaurant);
    } catch (error) {
      console.error('Error creating restaurant:', error);
      return res.status(500).json({ message: 'Failed to create restaurant' });
    }
  }
  res.status(405).json({ message: 'Method not allowed' });
}
