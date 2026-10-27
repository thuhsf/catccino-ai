type NotificationType = "order_created" | "payment_confirmed" | "payment_rejected" | "order_ready";
type NotificationChannel = "email" | "sms" | "push";
type NotificationStatus = "pending" | "sent" | "failed";

type NotificationProps = {
    id?: string;
    orderId: string;
    type: NotificationType;
    channel: NotificationChannel;
    status?: NotificationStatus;
    sentAt?: Date | null;
    createdAt?: Date;
};

class Notification {
    private readonly Id: string;
    private OrderId: string;
    private Type: NotificationType;
    private Channel: NotificationChannel;
    private Status: NotificationStatus;
    private SentAt: Date | null;
    private CreatedAt: Date;

    constructor(props: NotificationProps) {
        this.Id = props.id ?? "";
        this.OrderId = props.orderId;
        this.Type = props.type;
        this.Channel = props.channel;
        this.Status = props.status ?? "pending";
        this.SentAt = props.sentAt ?? null;
        this.CreatedAt = props.createdAt ?? new Date();
    }

    getId(): string { return this.Id; }
    getOrderId(): string { return this.OrderId; }
    getType(): NotificationType { return this.Type; }
    getChannel(): NotificationChannel { return this.Channel; }
    getStatus(): NotificationStatus { return this.Status; }
    getSentAt(): Date | null { return this.SentAt; }
    getCreatedAt(): Date { return this.CreatedAt; }

    markSent() {
        if (this.Status !== "pending") {
            throw new Error("Apenas notificações pendentes podem ser marcadas como enviadas");
        }
        this.Status = "sent";
        this.SentAt = new Date();
    }

    markFailed() {
        if (this.Status !== "pending") {
            throw new Error("Apenas notificações pendentes podem ser marcadas como falhas");
        }
        this.Status = "failed";
    }
}

export { Notification };
export type { NotificationType, NotificationChannel, NotificationStatus };