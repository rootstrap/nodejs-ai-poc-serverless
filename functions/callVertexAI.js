const { ChatPromptTemplate, MessagesPlaceholder } = require('@langchain/core/prompts');
const { ChatVertexAI } = require('@langchain/google-vertexai');
const { HumanMessage } = require('@langchain/core/messages');

function mapFileExtensionToPromptData(extension) {
  const fileExtensionToMimeType = {
    mp3: {
      mimeType: 'audio/mp3',
      messagePlaceholderType: 'audio',
      type: 'media',
    },
    mp4: {
      mimeType: 'video/mp4',
      messagePlaceholderType: 'videp',
      type: 'media',
    },
    //TODO: add PDF config
  };
  return fileExtensionToMimeType[extension];
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
};
