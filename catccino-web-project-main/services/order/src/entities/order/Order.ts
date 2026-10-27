import type { OrderItem } from "@entities/order/order-item/OrderItem.js";

type OrderStatus = "pending" | "paid" | "canceled";

type OrderProps = {
    id?: string;
    customerId: string;
    status?: OrderStatus;
    items?: OrderItem[];
    createdAt?: Date;
    updatedAt?: Date;
};

class Order {
    private readonly Id: string;
    private CustomerId: string;
    private Status: OrderStatus;
    private Total: number;
    private CreatedAt: Date;
    private UpdatedAt: Date;
    private Items: OrderItem[];

    constructor(props: OrderProps) {
        this.Id = props.id ?? "";
        this.CustomerId = props.customerId;
        this.Status = props.status ?? "pending";

        this.Items = props.items ?? [];

        this.Total = 0;
        this.calculateTotal();

        this.CreatedAt = props.createdAt ?? new Date();
        this.UpdatedAt = props.updatedAt ?? new Date();
    };

    getId(): string {
        return this.Id;
    };

    getCustomerId(): string {
        return this.CustomerId;
    };

    getStatus(): OrderStatus {
        return this.Status;
    };

    getTotal(): number {
        return this.Total;
    };

    getCreatedAt(): Date {
        return this.CreatedAt;
    };

    getUpdatedAt(): Date {
        return this.UpdatedAt;
    };

    getItems(): ReadonlyArray<OrderItem> {
        return this.Items;
    };

    changeStatus(value: OrderStatus) {
        this.Status = value;

        this.touch();
    };

    private touch() {
        this.UpdatedAt = new Date();
    };

    addItem(newItem: OrderItem) {

        const existingItem = this.Items.find((item) => item.getProductId() === newItem.getProductId());

        if (existingItem) {
            existingItem.changeQuantity(
                existingItem.getQuantity() + newItem.getQuantity()
            );
        } else {
            this.Items.push(newItem);
        };

        this.calculateTotal();
        this.touch();
    };

    private calculateTotal() {

        this.Total = this.Items.reduce(
            (acc, item) => acc + item.getSubTotal(),
            0
        );

    };
};

export { Order };