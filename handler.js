const { Buffer } = require('buffer');
const { fromBuffer } = require('file-type');
const bb = require('busboy');
const { callVertexAI } = require('./functions/callVertexAI');
const prompts = require('./constants/prompts');

const availableFeatures = {
  mp3: {
    call: callVertexAI,
    prompts: prompts.mp3,
  },
  pdf: {
    call: () => console.log('pdf call'), //TODO: add PDF AI call
    prompts: prompts.pdf,
  },
  mp4: {
    call: callVertexAI,
    prompts: prompts.mp4,
  },
};

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
          const fileType = await fromBuffer(fileBuffer);
          const feature = availableFeatures[fileType.ext];

          if (feature) {
            const prompt = feature.prompts[event.queryStringParameters?.action] || prompts.default;

            const response = await feature.call(fileBuffer, prompt, fileType.ext);

            resolve({
              statusCode: 200,
              body: JSON.stringify({
                message: 'File uploaded and processed successfully',
                fileType,
                response,
              }),
            });
          } else {
            reject({
              statusCode: 500,
              body: JSON.stringify({
                mesage: `File extension ${fileType.ext} is not supported. Please upload a file that has one of the following extensions: ${Object.keys(availableFeatures)}`,
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
