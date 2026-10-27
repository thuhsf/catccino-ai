import { pool } from "@database/pg.js";
import { Order } from "@entities/order/Order.js";
import { OrderItem } from "@entities/order/order-item/OrderItem.js";
import type { OrderRow, OrderItemRow } from "@repositories/types/order/OrderRow.js";
import type { IOrderFactory, IOrderRepository } from "@repositories/interfaces/IOrderRepository.js";

class OrderRepository implements IOrderRepository {

    private mapItemRowToEntity(row: OrderItemRow): OrderItem {

        return new OrderItem({
            id: row.id,
            orderId: row.order_id,
            productId: row.product_id,
            productName: row.product_name,
            quantity: row.quantity,
            unitPrice: Number(row.unit_price)
        });

    };

    private mapToEntity(
        row: OrderRow,
        items: OrderItem[]
    ): Order {

        return new Order({
            id: row.id,
            customerId: row.customer_id,
            status: row.status,
            items,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });

    };

    async create(data: Order): Promise<Order | null> {

        const client = await pool.connect();

        try {

            await client.query("BEGIN");

            const orderSql = `
                INSERT INTO orders (
                    customer_id,
                    status,
                    total
                )
                VALUES ($1, $2, $3)
                RETURNING *
            `;

            const orderValues = [
                data.getCustomerId(),
                data.getStatus(),
                data.getTotal()
            ];

            const orderResult = await client.query<OrderRow>(
                orderSql,
                orderValues
            );

            const createdOrder = orderResult.rows[0];

            if (!createdOrder) {
                throw new Error("Erro ao criar pedido");
            }

            const items = data.getItems();

            for (const item of items) {

                const itemSql = `
                    INSERT INTO order_items (
                        order_id,
                        product_id,
                        product_name,
                        quantity,
                        unit_price
                    )
                    VALUES ($1, $2, $3, $4, $5)
                `;

                const itemValues = [
                    createdOrder.id,
                    item.getProductId(),
                    item.getProductName(),
                    item.getQuantity(),
                    item.getUnitPrice(),
                ];

                await client.query(itemSql, itemValues);

            };

            await client.query("COMMIT");

            return this.findById(createdOrder.id);

        } catch (error) {

            await client.query("ROLLBACK");

            throw error;

        } finally {

            client.release();

        };

    };

    async delete(orderId: string): Promise<Order> {

        const order = await this.findById(orderId);

        if (!order) {
            throw new Error("Pedido não encontrado");
        };

        const sql = `
            DELETE FROM orders
            WHERE id = $1
        `;

        await pool.query(sql, [orderId]);

        return order;

    };

    async findAll(): Promise<Order[]> {

        const sql = `
            SELECT *
            FROM orders
            ORDER BY created_at DESC
        `;

        const result = await pool.query<OrderRow>(sql);

        const orders: Order[] = [];

        for (const row of result.rows) {

            const itemsSql = `
                SELECT *
                FROM order_items
                WHERE order_id = $1
            `;

            const itemsResult = await pool.query<OrderItemRow>(
                itemsSql,
                [row.id]
            );

            const items = itemsResult.rows.map((itemRow) =>
                this.mapItemRowToEntity(itemRow)
            );

            orders.push(
                this.mapToEntity(row, items)
            );

        };

        return orders;

    };

    async findById(id: string): Promise<Order | null> {

        const orderSql = `
            SELECT *
            FROM orders
            WHERE id = $1
        `;

        const orderResult = await pool.query<OrderRow>(
            orderSql,
            [id]
        );

        if (orderResult.rows.length === 0) {
            return null;
        };

        const orderRow = orderResult.rows[0];

        if (!orderRow) {
            return null;
        };

        const itemsSql = `
            SELECT *
            FROM order_items
            WHERE order_id = $1
        `;

        const itemsResult = await pool.query<OrderItemRow>(
            itemsSql,
            [id]
        );

        const items = itemsResult.rows.map((itemRow) =>
            this.mapItemRowToEntity(itemRow)
        );

        return this.mapToEntity(orderRow, items);

    };

    async findByCustomerId(customerId: string): Promise<Order[]> {
        const sql = `
        SELECT * FROM orders
        WHERE customer_id = $1
        ORDER BY created_at DESC
    `;

        const result = await pool.query<OrderRow>(sql, [customerId]);

        const orders: Order[] = [];

        for (const row of result.rows) {
            const itemsSql = `
            SELECT *
            FROM order_items
            WHERE order_id = $1
        `;

            const itemsResult = await pool.query<OrderItemRow>(itemsSql, [row.id]);

            const items = itemsResult.rows.map((itemRow) =>
                this.mapItemRowToEntity(itemRow)
            );

            orders.push(this.mapToEntity(row, items));
        }

        return orders;
    };


    async updateStatus(
        orderId: string,
        status: "pending" | "paid" | "canceled"
    ): Promise<Order | null> {

        const sql = `
            UPDATE orders
            SET
                status = $1,
                updated_at = NOW()
            WHERE id = $2
            RETURNING *
        `;

        const result = await pool.query<OrderRow>(
            sql,
            [status, orderId]
        );

        if (result.rows.length === 0) {
            return null;
        };

        return this.findById(orderId);

    };

};

class OrderFactory implements IOrderFactory {

    createRepository(): IOrderRepository {
        return new OrderRepository();
    }

};

export { OrderRepository, OrderFactory };