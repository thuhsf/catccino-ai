import { pool } from "@/database/pg.js";
import { Customer } from "@/entities/customer/Customer.js";
import type {
    ICustomerFactory,
    ICustomerRepository,
} from "./interfaces/ICustomerRepository.js";
import type { CustomerRow } from "./types/CustomerRow.js";

class CustomerRepository implements ICustomerRepository {
    private mapToEntity(row: CustomerRow) {
        return new Customer({
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }

    async create(data: Customer): Promise<Customer | null> {
        const sql = `
            INSERT INTO customers (name, email, phone)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const result = await pool.query(sql, [
            data.getName(),
            data.getEmail(),
            data.getPhone(),
        ]);

        if (!result.rows.length) {
            return null;
        }

        return this.mapToEntity(result.rows[0]);
    }

    async findByEmail(email: string): Promise<Customer | null> {
        const sql = `
            SELECT * FROM customers
            WHERE email ILIKE $1
        `;

        const result = await pool.query(sql, [email]);

        if (!result.rows.length) {
            return null;
        }

        return this.mapToEntity(result.rows[0]);
    }

    async findById(id: string): Promise<Customer | null> {
        const sql = `
			SELECT * FROM customers
			WHERE id = $1
		`;

        const result = await pool.query(sql, [id]);

        if (!result.rows.length) {
            return null;
        }

        return this.mapToEntity(result.rows[0]);
    }

    async findByName(name: string): Promise<Customer | null> {
        const sql = `
            SELECT * FROM customers
            WHERE name ILIKE $1
        `;

        const result = await pool.query(sql, [name]);

        if (!result.rows.length) {
            return null;
        }

        return this.mapToEntity(result.rows[0]);
    }

    async list(): Promise<Customer[]> {
        const sql = `
            SELECT * FROM customers
            ORDER BY created_at DESC
        `;

        const result = await pool.query(sql);

        return result.rows.map((row) => this.mapToEntity(row));
    }
}

class CustomerFactory implements ICustomerFactory {
    createRepository(): ICustomerRepository {
        return new CustomerRepository();
    }
}

export { CustomerRepository, CustomerFactory };
