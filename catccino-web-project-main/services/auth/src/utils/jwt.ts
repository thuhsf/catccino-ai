import jwt from "jsonwebtoken";
import { authEnvConfig } from "@config/authConfig.js";

type TokenPayload = {
    customerId: string;
    email: string;
};

function signToken(payload: TokenPayload): string {
    const options: jwt.SignOptions = {
        expiresIn: authEnvConfig.jwtExpiresIn as jwt.SignOptions["expiresIn"] & string,
    };

    return jwt.sign(payload, authEnvConfig.jwtSecret, options);
}

function verifyToken(token: string): TokenPayload {
    return jwt.verify(token, authEnvConfig.jwtSecret) as TokenPayload;
}

export { signToken, verifyToken };
export type { TokenPayload };
