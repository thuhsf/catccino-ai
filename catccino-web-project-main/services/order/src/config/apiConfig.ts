import dotenv from "dotenv";
dotenv.config();

type ApiEnvConfig = {
    apiMenu: string;
};

export const apiEnvConfig: ApiEnvConfig = {
    apiMenu: process.env.MENU_API_URL as string
}