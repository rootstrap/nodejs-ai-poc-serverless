const { ChatPromptTemplate, MessagesPlaceholder } = require('@langchain/core/prompts');
const { ChatVertexAI } = require('@langchain/google-vertexai');
const { HumanMessage } = require('@langchain/core/messages');
const { ChatOpenAI } = require('@langchain/openai');
const { loadSummarizationChain } = require('langchain/chains');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const pdfParse = require('pdf-parse');

function mapFileExtensionToPromptData(extension) {
  const fileExtensionToMimeType = {
    mp3: {
      mimeType: 'audio/mp3',
      messagePlaceholderType: 'audio',
      type: 'media',
    },
    mp4: {
      mimeType: 'video/mp4',
      messagePlaceholderType: 'video',
      type: 'media',
    },
    pdf: {
      mimeType: 'application/pdf',
      messagePlaceholderType: 'pdf',
      type: 'file',
    },
  };
  return fileExtensionToMimeType[extension];
}

async function callOpenAI(fileBuffer) {
  const { text } = await pdfParse(fileBuffer);

  const model = new ChatOpenAI({ temperature: 0.9, model: 'gpt-4o', openAIApiKey: process.env.OPENAI_API_KEY });

  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);

  const chain = loadSummarizationChain(model, { type: 'map_reduce' });
  const summarizedResponse = await chain.invoke({
    input_documents: docs,
  });

  return summarizedResponse.text;
}

async function callVertexAI(fileBuffer, prompt, fileExtension) {
  const promptData = mapFileExtensionToPromptData(fileExtension);

  const model = new ChatVertexAI({
    model: 'gemini-1.5-pro-001',
    location: 'us-central1',
    temperature: 0,
  });

  const promptTemplate = ChatPromptTemplate.fromMessages([new MessagesPlaceholder(promptData.messagePlaceholderType)]);

  const chain = promptTemplate.pipe(model);

  const response = await chain.invoke({
    audio: new HumanMessage({
      content: [
        {
          type: promptData.type,
          mimeType: promptData.mimeType,
          data: fileBuffer.toString('base64'),
        },
        {
          type: 'text',
          text: prompt,
        },
      ],
    }),
  });

  return response.content;
}

module.exports = {
  callVertexAI,
  callOpenAI,
};
