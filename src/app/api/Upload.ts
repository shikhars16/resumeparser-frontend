// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), '/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const parseForm = async (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      multiples: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { fields, files } = await parseForm(req);
      const keywords = fields.keywords ? (Array.isArray(fields.keywords)
        ? fields.keywords.join(' ').split(/\s+/).slice(0, 5) 
        : (fields.keywords as string).split(/\s+/).slice(0, 5)) : [];

      const resumes = Array.isArray(files.resumes) ? files.resumes : [files.resumes];

      // Collect paths of the uploaded resumes
      const resumePaths = resumes.map((resume: any) => resume.filepath);

      // Call your backend Python API to process resumes
      const response = await fetch('http://your-python-backend-url/process-resumes', {
        method: 'POST',
        body: JSON.stringify({ keywords, resumes: resumePaths }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        res.status(200).json({ message: 'Resumes processed successfully' });
      } else {
        res.status(response.status).json({ message: 'Error processing resumes' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handler;
