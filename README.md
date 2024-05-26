# Proxy-for-OpenAI

## Overview
Proxy-for-OpenAI is a simple Node.js application that provides a proxy server for interacting with OpenAI's API and generating images. It also includes a health check endpoint and a proxy endpoint for fetching images from external URLs.

## Features
- Generate images using OpenAI's DALL-E model.
- Health check endpoint to verify server status.
- Proxy endpoint to fetch images from external URLs.

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/shivamc489/proxy-for-openai.git
   cd proxy-for-openai
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Configuration
Create a `.env` file in the root directory and add your OpenAI API credentials:
```env
OPENAI_ORGANIZATION=your_openai_organization
OPENAI_PROJECT=your_openai_project
OPENAI_API_KEY=your_openai_api_key
IMAGE_PROVIDER=openai
```

## Usage
1. Start the server:
   ```sh
   npm start
   ```
2. The server will run on `http://localhost:3001`.

## Endpoints
### Health Check
`GET /health`
Returns a status message indicating the server is healthy.

### Generate Image
`POST /generate-image`
Generate an image using OpenAI's DALL-E model.
#### Request Body
```json
{
  "prompt": "A description of the image to generate",
  "size": "256x256", // Optional, default is "256x256"
  "model": "dall-e-2", // Optional, default is "dall-e-2"
  "quality": "standard" // Optional, default is "standard"
}
```
#### Response
```json
{
  "imageUrl": "URL of the generated image"
}
```

### Proxy
`GET /proxy`
Fetch an image from an external URL.
#### Query Parameters
`url` - The URL of the image to fetch.

## License
This project is licensed under the MIT License.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.