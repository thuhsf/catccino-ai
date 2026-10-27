import { pool } from "@database/pg.js";
import { AuthCredential } from "@entities/auth/AuthCredential.js";
import type {
    IAuthFactory,
    IAuthRepository,
} from "./interfaces/IAuthRepository.js";
import type { AuthCredentialRow } from "./types/AuthCredentialRow.js";

class AuthRepository implements IAuthRepository {
    private mapToEntity(row: AuthCredentialRow) {
        return new AuthCredential({
            id: row.id,
            customerId: row.customer_id,
            email: row.email,
            passwordHash: row.password_hash,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }

    async create(data: AuthCredential): Promise<AuthCredential | null> {
        const sql = `
			INSERT INTO auth_credentials (customer_id, email, password_hash)
			VALUES ($1, $2, $3)
			RETURNING *
		`;

        const result = await pool.query(sql, [
            data.getCustomerId(),
            data.getEmail(),
            data.getPasswordHash(),
        ]);

        if (!result.rows.length) {
            return null;
        }

        return this.mapToEntity(result.rows[0]);
    }

    async findByEmail(email: string): Promise<AuthCredential | null> {
        const sql = `
            SELECT * FROM auth_credentials
            WHERE email ILIKE $1
        `;

        const result = await pool.query(sql, [email]);

        if (!result.rows.length) {
            return null;
        }

        return this.mapToEntity(result.rows[0]);
    }

    async findByCustomerId(customerId: string): Promise<AuthCredential | null> {
        const sql = `
			SELECT * FROM auth_credentials
			WHERE customer_id = $1
		`;

        const result = await pool.query(sql, [customerId]);

        if (!result.rows.length) {
            return null;
        }

        return this.mapToEntity(result.rows[0]);
    }
}

class AuthFactory implements IAuthFactory {
    createRepository(): IAuthRepository {
        return new AuthRepository();
    }
}

export { AuthRepository, AuthFactory };
