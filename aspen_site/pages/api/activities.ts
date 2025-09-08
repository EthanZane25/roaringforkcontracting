import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const activities = await prisma.activity.findMany();
      return res.status(200).json(activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      return res.status(500).json({ message: 'Failed to fetch activities' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description, location, url } = req.body;
      const activity = await prisma.activity.create({
        data: { name, description, location, url }
      });
      return res.status(201).json(activity);
    } catch (error) {
      console.error('Error creating activity:', error);
      return res.status(500).json({ message: 'Failed to create activity' });
    }
  }
  res.status(405).json({ message: 'Method not allowed' });
}
