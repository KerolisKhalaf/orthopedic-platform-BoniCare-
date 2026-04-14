import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const getUploadUrl = async (fileName) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: `uploads/${fileName}`,
  });
  return await getSignedUrl(s3, command, { expiresIn: 3600 });
};

export const getFileUrl = async (fileName) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: fileName,
  });
  return await getSignedUrl(s3, command, { expiresIn: 3600 });
};
