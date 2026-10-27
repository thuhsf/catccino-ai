import type { TicketStatus } from "@entities/kitchen-ticket/KitchenTicket.js";

export interface KitchenTicketResponseDTO {
    id: string;
    orderId: string;
    status: TicketStatus;
    priority: number;
    createdAt: Date;
    startedAt: Date | null;
    finishedAt: Date | null;
};

export interface ArrKitchenTicketResponseDTO {
    tickets: KitchenTicketResponseDTO[];
};