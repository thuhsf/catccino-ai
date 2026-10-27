import dotenv from "dotenv";
dotenv.config();

type TypeDbEnvConfig = {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
};

export const dbEnvConfig: TypeDbEnvConfig = {
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    port: Number(process.env.DB_PORT)
};
