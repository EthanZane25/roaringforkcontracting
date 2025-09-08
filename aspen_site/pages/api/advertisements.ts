import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const advertisements = await prisma.advertisement.findMany();
      return res.status(200).json(advertisements);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      return res.status(500).json({ message: 'Failed to fetch advertisements' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, imageUrl, link } = req.body;
      const ad = await prisma.advertisement.create({
        data: { title, description, imageUrl, link }
      });
      return res.status(201).json(ad);
    } catch (error) {
      console.error('Error creating advertisement:', error);
      return res.status(500).json({ message: 'Failed to create advertisement' });
    }
  }
  res.status(405).json({ message: 'Method not allowed' });
}
