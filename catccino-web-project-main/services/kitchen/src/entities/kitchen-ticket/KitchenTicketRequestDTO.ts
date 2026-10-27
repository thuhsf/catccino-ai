export interface UpdateTicketStatusRequestDTO {
    id: string;
    action: "start" | "ready" | "delivered";
};