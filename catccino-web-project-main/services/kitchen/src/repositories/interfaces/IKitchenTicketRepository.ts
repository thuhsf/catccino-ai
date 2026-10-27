import type { KitchenTicket } from "@entities/kitchen-ticket/KitchenTicket.js";

export interface IKitchenTicketRepository {
    create(data: KitchenTicket): Promise<KitchenTicket | null>;
    findById(id: string): Promise<KitchenTicket | null>;
    findByOrderId(orderId: string): Promise<KitchenTicket | null>;
    listAll(): Promise<KitchenTicket[]>;
    listByStatus(status: string): Promise<KitchenTicket[]>;
    update(data: KitchenTicket): Promise<KitchenTicket | null>;
};

export interface IKitchenTicketFactory {
    createRepository(): IKitchenTicketRepository;
};