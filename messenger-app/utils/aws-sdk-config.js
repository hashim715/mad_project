import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.S3_Access,
  secretAccessKey: process.env.S3_secret,
  region: process.env.s3_region,
});

export const s3 = new AWS.S3();
