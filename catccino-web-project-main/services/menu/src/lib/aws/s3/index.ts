import { DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { s3Config } from "@config/awsConfig.js";
import { generateFileKey } from "@utils/generateFileKey.js";

type UploadProductImageProps = {
    fileBuffer: Buffer;
    mimetype: string;
    folder: "products/800x800" | "products/200x200";
};

type UploadProductImageResponse = {
    key: string;
    url: string;
    size?: number;
    contentType?: string;
};

async function uploadProductImage({ fileBuffer, mimetype, folder }: UploadProductImageProps): Promise<UploadProductImageResponse> {
    const bucket = process.env.AWS_BUCKET_NAME;
    const cdnUrl = process.env.CDN_URL;

    const key = generateFileKey(folder, mimetype);

    try {
        const upload = new Upload({
            client: s3Config,
            params: {
                Bucket: bucket,
                Key: key,
                Body: fileBuffer,
                ContentType: mimetype
            },
            queueSize: 4,
            partSize: 5 * 1024 * 1024,
            leavePartsOnError: false
        });

        await upload.done();

        const fileMetadata = await s3Config.send(
            new HeadObjectCommand({ Bucket: bucket, Key: key })
        );

        const response: UploadProductImageResponse = {
            key,
            url: `${cdnUrl}/${key}`
        };

        if (fileMetadata.ContentLength !== undefined) response.size = fileMetadata.ContentLength;
        if (fileMetadata.ContentType !== undefined) response.contentType = fileMetadata.ContentType;

        return response;

    } catch (error) {
        console.error("Erro ao enviar imagem:", error);
        throw new Error("Falha ao realizar upload da imagem.");
    }
}

async function deleteProductImage(key: string): Promise<void> {
    const bucket = process.env.AWS_BUCKET_NAME;
    try {
        await s3Config.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    } catch (error) {
        console.error("Erro ao deletar imagem do S3:", error);
    }
}

export { uploadProductImage, deleteProductImage }