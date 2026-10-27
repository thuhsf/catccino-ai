import multer from "multer";

type MimeTypes = string[];

const allowedMimeTypes: MimeTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp"
];

const upload = multer({

    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(
                new Error("Tipo inválido de arquivo")
            );
        }

        cb(null, true);
    }
});

export { upload };