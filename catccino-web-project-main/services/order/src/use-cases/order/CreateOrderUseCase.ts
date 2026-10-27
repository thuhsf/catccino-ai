import type { CreateOrderRequestDTO } from "@/entities/order/CreateOrderDTO.js";
import { OrderItem } from "@/entities/order/order-item/OrderItem.js";
import { Order } from "@/entities/order/Order.js";
import type { OrderResponseDTO } from "@/entities/order/OrderResponseDTO.js";
import type { IOrderRepository } from "@repositories/interfaces/IOrderRepository.js";
import type { IProductGateway } from "@services/interfaces/product/IProductGateway.js";
import type { Producer } from "kafkajs";


class CreateOrderUseCase {
    constructor(
        private readonly repository: IOrderRepository,
        private readonly productGateway: IProductGateway,
        private readonly producer: Producer
    ) { }

    async execute(data: CreateOrderRequestDTO): Promise<OrderResponseDTO> {

        const order = new Order({
            customerId: data.customerId,
            status: "pending"
        })

        for (const item of data.items) {
            const product = await this.productGateway.findProductById(item.productId);

            if (!product) {
                throw new Error(`Produto ${item.productId} não encontrado`)
            }

            if (!product.available) {
                throw new Error(`Produto "${product.name}" não está disponível`);
            }

            const orderItem = new OrderItem({
                orderId: order.getId(),
                productId: product.id,
                productName: product.name,
                quantity: item.quantity,
                unitPrice: product.price
            })

            order.addItem(orderItem);
        }

        const createdOrder = await this.repository.create(order);

        if (!createdOrder) {
            throw new Error("Falha ao criar pedido");
        }

        await this.producer.send({
            topic: "order.created",
            messages: [
                {
                    key: createdOrder.getId(),
                    value: JSON.stringify({
                        orderId: createdOrder.getId(),
                        customerId: createdOrder.getCustomerId(),
                        total: createdOrder.getTotal(),
                        items: createdOrder.getItems().map((i) => ({
                            productId: i.getProductId(),
                            productName: i.getProductName(),
                            quantity: i.getQuantity(),
                            unitPrice: i.getUnitPrice(),
                            subTotal: i.getSubTotal(),
                        })),
                    }),
                },
            ]
        });

        return {
            id: createdOrder.getId(),
            customerId: createdOrder.getCustomerId(),
            status: createdOrder.getStatus(),
            total: createdOrder.getTotal(),
            createdAt: createdOrder.getCreatedAt(),
            updatedAt: createdOrder.getUpdatedAt(),
        }
    }
};

export { CreateOrderUseCase }