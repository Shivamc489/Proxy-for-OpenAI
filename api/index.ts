const express = require('express');
const cors = require('cors');
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION,
  project: process.env.OPENAI_PROJECT,
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

app.post('/generate-image', async (req, res) => {
  const { prompt, size = "256x256", model = "dall-e-2", quality = "standard" } = req.body;

  if (!prompt) {
    return res.status(400).send('Prompt is required');
  }

  try {
    let imageUrl;
    if (process.env.IMAGE_PROVIDER === 'openai') {
      const response = await openai.images.generate({
        prompt,
        n: 1,
        size,
        model,
        quality,
      });
      imageUrl = response.data[0].url;
    } else {
      imageUrl = 'https://picsum.photos/200';
    }
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error.response ? error.response.data : error.message);
    res.status(500).send('Error generating image');
  }
});

app.get('/proxy', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type');
    res.set('Content-Type', contentType);
    res.set('Access-Control-Allow-Origin', '*');
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Error fetching the image:', error.message);
    res.status(500).send('Error fetching the image');
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
