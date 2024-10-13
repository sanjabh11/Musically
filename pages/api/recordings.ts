import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { IncomingForm, File } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  if (req.method === 'POST') {
    const form = new IncomingForm({
      uploadDir: uploadsDir,
      keepExtensions: true,
      multiples: false,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Failed to upload recording' });
      }

      const file = files.audio as unknown as File;
      if (!file || !file.filepath) {
        return res.status(400).json({ error: 'No audio file provided' });
      }

      try {
        const originalExt = path.extname(file.originalFilename || '').toLowerCase();
        const fileName = `recording-${Date.now()}${originalExt}`;
        const newPath = path.join(uploadsDir, fileName);

        await fs.promises.rename(file.filepath, newPath);
        
        res.status(200).json({ message: 'Recording uploaded successfully', fileName });
      } catch (error) {
        console.error('Error moving file:', error);
        res.status(500).json({ error: 'Failed to save the file' });
      }
    });
  } else if (req.method === 'GET') {
    try {
      const files = await fs.promises.readdir(uploadsDir);
      const audioFiles = files.filter(file => file.match(/\.(mp3|wav|ogg|webm|m4a)$/i));
      const fileUrls = audioFiles.map(file => `/uploads/${encodeURIComponent(file)}`);
      res.status(200).json(fileUrls);
    } catch (error) {
      console.error('Error reading uploads directory:', error);
      res.status(500).json({ error: 'Failed to fetch recordings' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}