import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION || '',
  project: process.env.OPENAI_PROJECT || '',
  apiKey: process.env.OPENAI_API_KEY || '',
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('Server is healthy');
});

app.post('/generate-image', async (req: Request, res: Response) => {
  const { prompt, size = "256x256", model = "dall-e-2", quality = "standard", image_provider = process.env.IMAGE_PROVIDER || "picsum" } = req.body;

  if (!prompt) {
    return res.status(400).send('Prompt is required');
  }

  try {
    let imageUrls: string[] = [];

    if (image_provider === 'openai') {
      const response = await openai.images.generate({
        prompt,
        n: 1,
        size,
        model,
        quality,
      });
      imageUrls.push(response.data[0].url as string);
    } else if (image_provider === 'pixabay') {
      const pixabayApiKey = process.env.PIXABAY_API_KEY || '';
      const pixabayResponse = await axios.get('https://pixabay.com/api/', {
        params: {
          key: pixabayApiKey,
          q: prompt,
          image_type: 'vector',
          per_page: 200,
        },
      });
      const pixabayImages = pixabayResponse.data.hits;
      if (pixabayImages.length > 0) {
        imageUrls = pixabayImages.map((image: { webformatURL: string }) => image.webformatURL);
      } else {
        return res.status(404).send('No images found');
      }
    } else {
      imageUrls.push('https://picsum.photos/200');
    }

    res.json({ imageUrls });
  } catch (error: any) {
    console.error('Error generating image:', error.response ? error.response.data : error.message);
    res.status(500).send('Error generating image');
  }
});

app.get('/proxy', async (req: Request, res: Response) => {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).send('URL is required');
  }

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'];
    res.set('Content-Type', contentType);
    res.set('Access-Control-Allow-Origin', '*');
    res.send(Buffer.from(response.data, 'binary'));
  } catch (error: any) {
    console.error('Error fetching the image:', error.message);
    res.status(500).send('Error fetching the image');
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
