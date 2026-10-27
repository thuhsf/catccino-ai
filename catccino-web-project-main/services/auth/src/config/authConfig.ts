import dotenv from "dotenv";
dotenv.config();

type AuthEnvConfig = {
    jwtSecret: string;
    jwtExpiresIn: string;
};

export const authEnvConfig: AuthEnvConfig = {
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d"
};
