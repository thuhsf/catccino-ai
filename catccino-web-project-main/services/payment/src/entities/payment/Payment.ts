type PaymentStatus = "pending" | "approved" | "rejected";
type PaymentMethod = "credit_card" | "debit_card" | "pix";

type PaymentProps = {
    id?: string;
    orderId: string;
    method: PaymentMethod;
    status?: PaymentStatus;
    amount: number;
    transactionId?: string;
    paidAt?: Date | null;
    createdAt?: Date;
};

class Payment {
    private readonly Id: string;
    private OrderId: string;
    private Method: PaymentMethod;
    private Status: PaymentStatus;
    private Amount: number;
    private TransactionId: string;
    private PaidAt: Date | null;
    private CreatedAt: Date;

    constructor(props: PaymentProps) {
        if (props.amount <= 0) {
            throw new Error("Valor do pagamento deve ser maior que 0");
        }

        this.Id = props.id ?? "";
        this.OrderId = props.orderId;
        this.Method = props.method;
        this.Status = props.status ?? "pending";
        this.Amount = props.amount;
        this.TransactionId = props.transactionId ?? "";
        this.PaidAt = props.paidAt ?? null;
        this.CreatedAt = props.createdAt ?? new Date();
    }

    getId(): string { return this.Id; }
    getOrderId(): string { return this.OrderId; }
    getMethod(): PaymentMethod { return this.Method; }
    getStatus(): PaymentStatus { return this.Status; }
    getAmount(): number { return this.Amount; }
    getTransactionId(): string { return this.TransactionId; }
    getPaidAt(): Date | null { return this.PaidAt; }
    getCreatedAt(): Date { return this.CreatedAt; }

    approve(transactionId: string) {
        if (this.Status !== "pending") {
            throw new Error("Apenas pagamentos pendentes podem ser aprovados");
        }
        this.Status = "approved";
        this.TransactionId = transactionId;
        this.PaidAt = new Date();
    }

    reject() {
        if (this.Status !== "pending") {
            throw new Error("Apenas pagamentos pendentes podem ser rejeitados");
        }
        this.Status = "rejected";
    }
}

export { Payment };
export type { PaymentStatus, PaymentMethod };