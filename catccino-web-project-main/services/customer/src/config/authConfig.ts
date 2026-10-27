import dotenv from "dotenv";
dotenv.config();

type AuthEnvConfig = {
    jwtSecret: string;
};

export const authEnvConfig: AuthEnvConfig = {
    jwtSecret: process.env.JWT_SECRET as string,
};
