import { pool } from "@database/pg.js";
import { Notification } from "@entities/notification/Notification.js";
import type { INotificationFactory, INotificationRepository } from "@repositories/interfaces/INotificationRepository.js";
import type { NotificationChannel, NotificationStatus, NotificationType } from "@entities/notification/Notification.js";

type NotificationRow = {
    id: string;
    order_id: string;
    type: NotificationType;
    channel: NotificationChannel;
    status: NotificationStatus;
    sent_at: Date | null;
    created_at: Date;
};

class NotificationRepository implements INotificationRepository {
    private mapToEntity(row: NotificationRow): Notification {
        return new Notification({
            id: row.id,
            orderId: row.order_id,
            type: row.type,
            channel: row.channel,
            status: row.status,
            sentAt: row.sent_at,
            createdAt: row.created_at,
        });
    }

    async create(data: Notification): Promise<Notification | null> {
        const sql = `
            INSERT INTO notifications (order_id, type, channel, status)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const result = await pool.query<NotificationRow>(sql, [
            data.getOrderId(),
            data.getType(),
            data.getChannel(),
            data.getStatus(),
        ]);

        const row = result.rows[0];
        if (!row) return null;

        return this.mapToEntity(row);
    }

    async findById(id: string): Promise<Notification | null> {
        const sql = `SELECT * FROM notifications WHERE id = $1`;
        const result = await pool.query<NotificationRow>(sql, [id]);

        const row = result.rows[0];
        if (!row) return null;

        return this.mapToEntity(row);
    }

    async findByOrderId(orderId: string): Promise<Notification[]> {
        const sql = `
            SELECT * FROM notifications
            WHERE order_id = $1
            ORDER BY created_at DESC
        `;
        const result = await pool.query<NotificationRow>(sql, [orderId]);

        return result.rows.map((row) => this.mapToEntity(row));
    }

    async update(data: Notification): Promise<Notification | null> {
        const sql = `
            UPDATE notifications
            SET
                status = $1,
                sent_at = $2
            WHERE id = $3
            RETURNING *
        `;

        const result = await pool.query<NotificationRow>(sql, [
            data.getStatus(),
            data.getSentAt(),
            data.getId(),
        ]);

        const row = result.rows[0];
        if (!row) return null;

        return this.mapToEntity(row);
    }
}

class NotificationFactory implements INotificationFactory {
    createRepository(): INotificationRepository {
        return new NotificationRepository();
    }
}

export { NotificationRepository, NotificationFactory };