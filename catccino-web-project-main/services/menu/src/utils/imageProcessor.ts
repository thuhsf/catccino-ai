import sharp from "sharp"

type ProcessImageProps = {
    fileBuffer: Buffer;
};

type ProcessedImages = {
    image: Buffer;
    thumbnail: Buffer;
};

export async function processImage({ fileBuffer }: ProcessImageProps): Promise<ProcessedImages> {
    const [image, thumbnail] = await Promise.all([
        sharp(fileBuffer)
            .rotate()
            .resize(800, 800, { fit: "cover" })
            .webp({ quality: 80 })
            .toBuffer(),

        sharp(fileBuffer)
            .rotate()
            .resize(200, 200, { fit: "cover" })
            .webp({ quality: 75 })
            .toBuffer()
    ]);

    return { image, thumbnail };
}
