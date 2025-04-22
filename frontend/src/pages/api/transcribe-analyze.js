import { transcribeAndAnalyzeAudio } from '../../lib/groqService';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm();
  form.uploadDir = './';
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Error parsing form data' });

    const filePath = files.audio?.filepath || files.audio?.path;

    try {
      const result = await transcribeAndAnalyzeAudio(filePath);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ summary: 'Failed to process the audio.' });
    } finally {
      // Optionally delete the file
      fs.unlink(filePath, () => {});
    }
  });
}
