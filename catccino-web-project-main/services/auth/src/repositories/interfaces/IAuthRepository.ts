import type { AuthCredential } from "@entities/auth/AuthCredential.js";

interface IAuthRepository {
    create: (data: AuthCredential) => Promise<AuthCredential | null>;
    findByEmail: (email: string) => Promise<AuthCredential | null>;
    findByCustomerId: (customerId: string) => Promise<AuthCredential | null>;
}

interface IAuthFactory {
    createRepository(): IAuthRepository;
}

export type { IAuthRepository, IAuthFactory };
