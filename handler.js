const { Buffer } = require('buffer');
const { fromBuffer } = require('file-type');
const bb = require('busboy');
const { callVertexAI, callOpenAI } = require('./functions/callAI');
const prompts = require('./constants/prompts');

const availableFileExtensionFeatures = {
  mp3: {
    call: (fileBuffer, prompt) => callVertexAI(fileBuffer, prompt, 'mp3'),
    prompts: prompts.mp3,
  },
  pdf: {
    call: callOpenAI,
    prompts: {},
  },
  mp4: {
    call: (fileBuffer, prompt) => callVertexAI(fileBuffer, prompt, 'mp4'),
    prompts: prompts.mp4,
  },
};

function getPrompt(fileExtension, action) {
  const fileExtensionFeature = availableFileExtensionFeatures[fileExtension];
  const prompt = fileExtensionFeature.prompts[action] || prompts.default;
  return prompt;
}

exports.summarizeFile = async (event) => {
  if (event.isBase64Encoded && event.headers['Content-Type'].includes('multipart/form-data')) {
    const busboy = bb({
      headers: { 'content-type': event.headers['Content-Type'] },
    });

    return new Promise((resolve, reject) => {
      busboy.on('file', async (_fieldname, file, _fileinfo, _encoding, _mimetype) => {
        let fileBuffer;

        file.on('data', (data) => {
          fileBuffer = data;
        });

        file.on('end', async () => {
          console.log(`Starting to process file`);

          const fileType = await fromBuffer(fileBuffer);
          const fileExtension = fileType?.ext;

          console.log(`File extension: ${fileExtension}. Looking if we support that extension...`);

          const fileExtensionFeature = availableFileExtensionFeatures[fileExtension];

          console.log(`File extension: ${fileExtension}. Supported: ${fileExtensionFeature ? 'Yes' : 'No'}`);

          if (fileExtensionFeature) {
            console.log(`Looking for a prompt for the file extension ${fileExtension} and action ${event.queryStringParameters?.action}`);
            const prompt = getPrompt(fileExtension, event.queryStringParameters?.action);

            console.log(`Prompt found. Is default? ${prompt === prompts.default ? 'Yes' : 'No'}\nPrompt detail: "${prompt}"`);

            const response = fileExtensionFeature.prompt ? await fileExtensionFeature.call(fileBuffer, prompt) : await fileExtensionFeature.call(fileBuffer);

            console.log(`File processed successfully, returning response.`);

            resolve({
              statusCode: 200,
              body: JSON.stringify({
                message: 'File uploaded and processed successfully',
                fileType,
                response,
              }),
            });
          } else {
            console.log(`We do not support the file extension ${fileExtension}. Returning error.`);
            reject({
              statusCode: 500,
              body: JSON.stringify({
                mesage: `File extension ${fileExtension} is not supported. Please upload a file that has one of the following extensions: ${Object.keys(availableFileExtensionFeatures)}`,
              }),
            });
          }
        });
      });

      busboy.on('error', (error) => {
        console.error('Error processing file', error);
        reject({
          statusCode: 500,
          body: JSON.stringify({ error: 'Error processing file' }),
        });
      });

      busboy.write(Buffer.from(event.body, 'base64'));
      busboy.end();
    });
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request format' }),
    };
  }
};
