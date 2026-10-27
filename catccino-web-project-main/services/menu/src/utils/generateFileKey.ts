import crypto from "node:crypto";

const mimeExtensions: Record<string, string> = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/webp": ".webp"
};

export const generateFileKey = (folder: string, mimetype: string) => {

    const extension = mimeExtensions[mimetype];

    const filename = crypto.randomUUID();

    return `${folder}/${filename}${extension}`;
};