const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/generate-image', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send('Prompt is required');
  }

  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: '256x256',
    });

    const imageUrl = response.data.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
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
    res.status(500).send('Error fetching the image');
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
