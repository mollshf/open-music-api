/* eslint-disable no-underscore-dangle */
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const config = require('../../../utils/config');

class StorageService {
  constructor() {
    this.S3 = new S3Client({
      region: config.s3.region,
      credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
      },
    });
  }

  async writeFile(file, meta) {
    const parameter = new PutObjectCommand({
      Bucket: config.s3.bucketName,
      Key: meta.filename,
      Body: file._data,
      ContentType: meta.headers['content-type'],
    });

    await this.S3.send(parameter);

    return meta.filename;
  }
}

module.exports = StorageService;
