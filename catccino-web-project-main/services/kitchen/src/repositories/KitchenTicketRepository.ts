import { pool } from "@database/pg.js";
import { KitchenTicket } from "@entities/kitchen-ticket/KitchenTicket.js";
import type { IKitchenTicketFactory, IKitchenTicketRepository } from "@repositories/interfaces/IKitchenTicketRepository.js";

type KitchenTicketRow = {
    id: string;
    order_id: string;
    status: "pending" | "preparing" | "ready" | "delivered";
    priority: number;
    created_at: Date;
    started_at: Date | null;
    finished_at: Date | null;
};

class KitchenTicketRepository implements IKitchenTicketRepository {
    private mapToEntity(row: KitchenTicketRow): KitchenTicket {
        return new KitchenTicket({
            id: row.id,
            orderId: row.order_id,
            status: row.status,
            priority: row.priority,
            createdAt: row.created_at,
            startedAt: row.started_at,
            finishedAt: row.finished_at,
        });
    }

    async create(data: KitchenTicket): Promise<KitchenTicket | null> {
        const sql = `
            INSERT INTO kitchen_tickets (order_id, status, priority)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const result = await pool.query<KitchenTicketRow>(sql, [
            data.getOrderId(),
            data.getStatus(),
            data.getPriority(),
        ]);

        const row = result.rows[0];
        if (!row) return null;

        return this.mapToEntity(row);
    }

    async findById(id: string): Promise<KitchenTicket | null> {
        const sql = `SELECT * FROM kitchen_tickets WHERE id = $1`;
        const result = await pool.query<KitchenTicketRow>(sql, [id]);

        const row = result.rows[0];
        if (!row) return null;

        return this.mapToEntity(row);
    }

    async findByOrderId(orderId: string): Promise<KitchenTicket | null> {
        const sql = `SELECT * FROM kitchen_tickets WHERE order_id = $1`;
        const result = await pool.query<KitchenTicketRow>(sql, [orderId]);

        const row = result.rows[0];
        if (!row) return null;

        return this.mapToEntity(row);
    }

    async listAll(): Promise<KitchenTicket[]> {
        const sql = `
            SELECT * FROM kitchen_tickets
            ORDER BY priority DESC, created_at ASC
        `;
        const result = await pool.query<KitchenTicketRow>(sql);

        return result.rows.map((row) => this.mapToEntity(row));
    }

    async listByStatus(status: string): Promise<KitchenTicket[]> {
        const sql = `
            SELECT * FROM kitchen_tickets
            WHERE status = $1
            ORDER BY priority DESC, created_at ASC
        `;
        const result = await pool.query<KitchenTicketRow>(sql, [status]);

        return result.rows.map((row) => this.mapToEntity(row));
    }

    async update(data: KitchenTicket): Promise<KitchenTicket | null> {
        const sql = `
            UPDATE kitchen_tickets
            SET
                status = $1,
                started_at = $2,
                finished_at = $3
            WHERE id = $4
            RETURNING *
        `;

        const result = await pool.query<KitchenTicketRow>(sql, [
            data.getStatus(),
            data.getStartedAt(),
            data.getFinishedAt(),
            data.getId(),
        ]);

        const row = result.rows[0];
        if (!row) return null;

        return this.mapToEntity(row);
    }
}

class KitchenTicketFactory implements IKitchenTicketFactory {
    createRepository(): IKitchenTicketRepository {
        return new KitchenTicketRepository();
    }
}

export { KitchenTicketRepository, KitchenTicketFactory };