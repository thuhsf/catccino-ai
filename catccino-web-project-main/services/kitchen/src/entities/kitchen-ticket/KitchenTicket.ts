type TicketStatus = "pending" | "preparing" | "ready" | "delivered";

type KitchenTicketProps = {
    id?: string;
    orderId: string;
    status?: TicketStatus;
    priority?: number;
    createdAt?: Date;
    startedAt?: Date | null;
    finishedAt?: Date | null;
};

class KitchenTicket {
    private readonly Id: string;
    private OrderId: string;
    private Status: TicketStatus;
    private Priority: number;
    private CreatedAt: Date;
    private StartedAt: Date | null;
    private FinishedAt: Date | null;

    constructor(props: KitchenTicketProps) {
        this.Id = props.id ?? "";
        this.OrderId = props.orderId;
        this.Status = props.status ?? "pending";
        this.Priority = props.priority ?? 0;
        this.CreatedAt = props.createdAt ?? new Date();
        this.StartedAt = props.startedAt ?? null;
        this.FinishedAt = props.finishedAt ?? null;
    }

    getId(): string { return this.Id; }
    getOrderId(): string { return this.OrderId; }
    getStatus(): TicketStatus { return this.Status; }
    getPriority(): number { return this.Priority; }
    getCreatedAt(): Date { return this.CreatedAt; }
    getStartedAt(): Date | null { return this.StartedAt; }
    getFinishedAt(): Date | null { return this.FinishedAt; }

    startPreparing() {
        if (this.Status !== "pending") {
            throw new Error("Apenas tickets pendentes podem ser iniciados");
        }
        this.Status = "preparing";
        this.StartedAt = new Date();
    }

    markReady() {
        if (this.Status !== "preparing") {
            throw new Error("Apenas tickets em preparo podem ser marcados como prontos");
        }
        this.Status = "ready";
        this.FinishedAt = new Date();
    }

    markDelivered() {
        if (this.Status !== "ready") {
            throw new Error("Apenas tickets prontos podem ser marcados como entregues");
        }
        this.Status = "delivered";
    }

    changePriority(value: number) {
        if (value < 0) {
            throw new Error("Prioridade não pode ser negativa");
        }
        this.Priority = value;
    }
}

export { KitchenTicket };
export type { TicketStatus };