type OrderItemProps = {
    id?: string;
    orderId: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
};

class OrderItem {

    private readonly Id: string;
    private OrderId: string;
    private ProductId: string;
    private ProductName: string;
    private Quantity: number;
    private UnitPrice: number;
    private Subtotal: number;

    constructor(props: OrderItemProps) {

        if (props.quantity <= 0) {
            throw new Error("Quantidade deve ser maior que 0");
        };

        if (props.unitPrice <= 0) {
            throw new Error("Preço unitário deve ser maior que 0");
        };

        this.Id = props.id ?? "";
        this.OrderId = props.orderId;
        this.ProductId = props.productId;
        this.ProductName = props.productName;
        this.Quantity = props.quantity;
        this.UnitPrice = props.unitPrice;

        this.Subtotal = props.quantity * props.unitPrice;
    };

    getId(): string {
        return this.Id;
    };

    getOrderId(): string {
        return this.OrderId;
    };

    getProductId(): string {
        return this.ProductId;
    };

    getProductName(): string {
        return this.ProductName;
    }

    getQuantity(): number {
        return this.Quantity;
    };

    getUnitPrice(): number {
        return this.UnitPrice;
    };

    getSubTotal(): number {
        return this.Subtotal;
    };

    changeQuantity(value: number) {

        if (value <= 0) {
            throw new Error("Quantity must be greater than zero");
        };

        this.Quantity = value;

        this.calculateSubtotal();
    };

    private calculateSubtotal() {
        this.Subtotal = this.Quantity * this.UnitPrice;
    };


};

export { OrderItem };