import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const advertisements = await prisma.advertisement.findMany();
    return res.status(200).json(advertisements);
  } else if (req.method === 'POST') {
    const { title, description, imageUrl, link } = req.body;
    const ad = await prisma.advertisement.create({
      data: { title, description, imageUrl, link }
    });
    return res.status(201).json(ad);
  }
  res.status(405).json({ message: 'Method not allowed' });
}
