import { S3Client } from "@aws-sdk/client-s3";

export const s3Config = new S3Client({
    region: String(process.env.AWS_REGION),
    credentials: {
        accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
        secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY)
    }
});

