import dotenv from "dotenv";
dotenv.config();

type ApiEnvConfig = {
    apiCustomer: string;
};

export const apiEnvConfig: ApiEnvConfig = {
    apiCustomer: process.env.CUSTOMER_API_URL as string
}
