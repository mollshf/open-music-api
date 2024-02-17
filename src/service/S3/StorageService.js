/* eslint-disable no-underscore-dangle */
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

class StorageService {
  constructor() {
    this.S3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async writeFile(file, meta) {
    const parameter = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: meta.filename,
      Body: file._data,
      ContentType: meta.headers['content-type'],
    });

    await this.S3.send(parameter);

    return meta.filename;
  }
}

module.exports = StorageService;
