# [POC] AI File Processing Serverless Application

This project is a serverless application built with AWS Lambda and Node.js that processes various file types using AI services (Google Vertex AI and OpenAI). It provides capabilities to analyze and summarize content from different file formats including MP3, MP4, and PDF files.

## Features

- **Multi-format Support**: Process different file types including:

  - MP3 audio files
  - MP4 video files
  - PDF documents

- **AI Integration**:

  - Google Vertex AI integration for audio and video processing
  - OpenAI integration for PDF processing
  - Customizable prompts for different file types

- **Serverless Architecture**:
  - Built on AWS Lambda
  - Easy deployment using Serverless Framework
  - Local development support with serverless-offline

## Prerequisites

- Node.js (version specified in `.nvmrc`)
- AWS Account and configured credentials
- Google Vertex AI credentials
- OpenAI API key (if using PDF processing)
- Serverless Framework CLI

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   - Copy `.env.example` to `.env`
   - Fill in the required variables:
     ```
     OPENAI_API_KEY=your_openai_api_key
     VERTEX_PROJECT_ID=your_vertex_project_id
     ```

4. Add your Google Vertex AI credentials:
   - Place your `credentials.json` file in the project root
   - Ensure proper permissions are set

## Development

To run the project locally:

```bash
npm run start:dev
```

This will start the serverless-offline server, allowing you to test your functions locally.

## Deployment

Deploy to AWS:

```bash
npm run deploy
```

## API Endpoints

The service exposes an endpoint for file processing:

### POST /summarize

Processes files using AI to generate summaries and analysis.

**Request Format:**

- Method: POST
- Content-Type: multipart/form-data
- Body: Include file in form data, you can give any name to it.

**Query Parameters:**

- `action` (optional): Specifies the type of analysis to perform. If not provided, defaults to general analysis.

  Available actions by file type:

  - MP3 files:
    - `song`: Analyzes the instruments used and identifies the song genre
    - `discussion`: Creates a detailed summary of spoken discussions
  - MP4 files:
    - `timeline`: Creates a YouTube-style timeline with key moments
    - `summarize`: Generates a comprehensive summary of the video content

**Example Requests:**

1. Analyze a song (MP3):

```bash
curl --location 'http://localhost:3000/dev/summarize?action=song' \
--form 'file=@"path/to/song.mp3"'
```

2. Analyze a discussion (MP3):

```bash
curl --location 'http://localhost:3000/dev/summarize?action=discussion' \
--form 'file=@"path/to/discussion.mp3"'
```

3. Create video timeline (MP4):

```bash
curl --location 'http://localhost:3000/dev/summarize?action=timeline' \
--form 'file=@"path/to/video.mp4"'
```

4. Default analysis (for PDFs):

```bash
curl --location 'http://localhost:3000/dev/summarize' \
--form 'file=@"path/to/file.pdf"'
```

**Response:**
Returns a JSON object containing the AI-generated analysis based on the file type and specified action.

## Project Structure

- `/functions` - Contains AI service integration functions
- `/constants` - Contains prompt templates and configurations
- `handler.js` - Main Lambda function handlers
- `serverless.yml` - Serverless Framework configuration

## Available Scripts

- `npm run start:dev` - Start local development server
- `npm run deploy` - Deploy to AWS
- `npm run format` - Format code using Prettier
