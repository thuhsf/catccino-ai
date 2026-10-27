import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authEnvConfig } from "@config/authConfig.js";

declare global {
    namespace Express {
        interface Request {
            customerId?: string;
        }
    }
}

type TokenPayload = {
    customerId: string;
    email: string;
};

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Token não informado" });
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
        return res.status(401).json({ error: "Token mal formatado" });
    }

    try {
        const { customerId } = jwt.verify(
            token,
            authEnvConfig.jwtSecret,
        ) as TokenPayload;

        req.customerId = customerId;

        return next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
}

export { ensureAuthenticated };
