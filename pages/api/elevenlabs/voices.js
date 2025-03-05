import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch voices' });
      }

      const data = await response.json();
      res.status(200).json(data.voices || []);
    } catch (error) {
      console.error('Error fetching voices:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
