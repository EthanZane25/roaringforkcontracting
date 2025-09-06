import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const activities = await prisma.activity.findMany();
    return res.status(200).json(activities);
  } else if (req.method === 'POST') {
    const { name, description, location, url } = req.body;
    const activity = await prisma.activity.create({
      data: { name, description, location, url }
    });
    return res.status(201).json(activity);
  }
  res.status(405).json({ message: 'Method not allowed' });
}
