import { pool } from "@database/pg.js";
import { Payment } from "@entities/payment/Payment.js";
import type { IPaymentFactory, IPaymentRepository } from "@repositories/interfaces/IPaymentRepository.js";
import type { PaymentRow } from "@repositories/types/PaymentRow.js";

class PaymentRepository implements IPaymentRepository {
    private mapToEntity(row: PaymentRow): Payment {
        return new Payment({
            id: row.id,
            orderId: row.order_id,
            method: row.method,
            status: row.status,
            amount: Number(row.amount),
            transactionId: row.transaction_id ?? "",
            paidAt: row.paid_at,
            createdAt: row.created_at,
        });
    }

    async create(data: Payment): Promise<Payment | null> {
        const sql = `
        INSERT INTO payments (order_id, method, status, amount)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;

        const result = await pool.query<PaymentRow>(sql, [
            data.getOrderId(),
            data.getMethod(),
            data.getStatus(),
            data.getAmount(),
        ]);

        const row = result.rows[0];
        if (!row) return null;

        return this.mapToEntity(row);
    }

    async findById(id: string): Promise<Payment | null> {
        const sql = `SELECT * FROM payments WHERE id = $1`;
        const result = await pool.query<PaymentRow>(sql, [id]);

        const row = result.rows[0];
        if (!row) return null;

        return this.mapToEntity(row);
    }

    async findByOrderId(orderId: string): Promise<Payment | null> {
        const sql = `SELECT * FROM payments WHERE order_id = $1`;
        const result = await pool.query<PaymentRow>(sql, [orderId]);

        const row = result.rows[0];
        if (!row) return null;

        return this.mapToEntity(row);
    }

    async update(data: Payment): Promise<Payment | null> {
        const sql = `
        UPDATE payments
        SET
            status = $1,
            transaction_id = $2,
            paid_at = $3
        WHERE id = $4
        RETURNING *
    `;

        const result = await pool.query<PaymentRow>(sql, [
            data.getStatus(),
            data.getTransactionId(),
            data.getPaidAt(),
            data.getId(),
        ]);

        const row = result.rows[0];
        if (!row) return null;

        return this.mapToEntity(row);
    }
}

class PaymentFactory implements IPaymentFactory {
    createRepository(): IPaymentRepository {
        return new PaymentRepository();
    }
}

export { PaymentRepository, PaymentFactory };