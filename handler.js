const { Buffer } = require('buffer');
const fs = require('fs');
const path = require('path');
const { fromBuffer } = require('file-type')
const bb = require('busboy');

exports.summarizeFile = async (event) => {
  if (event.isBase64Encoded && event.headers['Content-Type'].includes('multipart/form-data')) {
    const busboy = bb({
      headers: { 'content-type': event.headers['Content-Type'] }
    });

    const files = [];
    const fileWrites = [];

    return new Promise((resolve, reject) => {
      busboy.on('file', async (fieldname, file, { filename }, encoding, mimetype) => {
        console.log(`Processing file: ${JSON.stringify(filename)}`);

        const filePath = path.join(__dirname, '/tmp', filename); // En Lambda, guarda temporalmente en /tmp
        const writeStream = fs.createWriteStream(filePath);

        file.pipe(writeStream);

        fileWrites.push(new Promise((fileResolve, fileReject) => {
          writeStream.on('finish', async () => {
            console.log(`Finished writing ${filename}`);

            const fileBuffer = fs.readFileSync(filePath);
            const fileType = await fromBuffer(fileBuffer);

            if (!fileType) {
              return fileReject('Could not determine file type.');
            }

            console.log('File type:', fileType);

            files.push({ filename, fileType, filePath });
            fileResolve();
          });

          writeStream.on('error', fileReject);
        }));
      });

      busboy.on('finish', async () => {
        console.log('File processing finished');
        await Promise.all(fileWrites);

        files.forEach(file => {
          //Here make the request to OpenAI/Vertex with the file extension
        })

        resolve({
          statusCode: 200,
          body: JSON.stringify({ message: 'File uploaded and processed successfully', files })
        });
      });

      busboy.on('error', (error) => {
        console.error('Error processing file', error);
        reject({
          statusCode: 500,
          body: JSON.stringify({ error: 'Error processing file' })
        });
      });

      busboy.write(Buffer.from(event.body, 'base64')); // Escribir el cuerpo de la solicitud a busboy
      busboy.end();
    });
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request format' })
    };
  }
};