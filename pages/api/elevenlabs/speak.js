import fetch from 'node-fetch';

// Enhanced default settings for better voice quality
const DEFAULT_SETTINGS = {
  stability: 0.85,         // Increased for better consistency
  similarity_boost: 0.85,  // Increased for better voice matching
  style: 0,                // Default style
  use_speaker_boost: true  // Enhances voice clarity
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, voiceId, language, stability, similarity_boost, style, use_speaker_boost } = req.body;
    console.log('Voice ID:', voiceId);

    try {
      // Prepare the request body with voice settings
      const requestBody = {
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: typeof stability === 'number' ? stability : DEFAULT_SETTINGS.stability,
          similarity_boost: typeof similarity_boost === 'number' ? similarity_boost : DEFAULT_SETTINGS.similarity_boost,
          style: typeof style === 'number' ? style : DEFAULT_SETTINGS.style,
          use_speaker_boost: typeof use_speaker_boost === 'boolean' ? use_speaker_boost : DEFAULT_SETTINGS.use_speaker_boost
        },
        output_format: "mp3_44100_128"  // Specify high quality audio format
      };

      // Add language if provided
      if (language) {
        requestBody.language = language;
      }

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Accept': 'audio/mpeg',
          'User-Agent': 'OpenAssistantGPT/1.0'  // Add a user agent
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response:', errorText);
        return res.status(response.status).json({ error: 'Failed to convert text to speech' });
      }

      const audioBuffer = await response.arrayBuffer();
      
      // Set appropriate headers for better audio delivery
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
      res.setHeader('Content-Length', Buffer.byteLength(audioBuffer));
      res.setHeader('Accept-Ranges', 'bytes');
      
      res.status(200).send(Buffer.from(audioBuffer));
    } catch (error) {
      console.error('Error converting text to speech:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
