import type { ArrKitchenTicketResponseDTO } from "@entities/kitchen-ticket/KitchenTicketResponseDTO.js";
import type { IKitchenTicketRepository } from "@repositories/interfaces/IKitchenTicketRepository.js";

interface ListTicketsRequestDTO {
    status?: string;
}

class ListKitchenTicketsUseCase {
    constructor(private readonly repository: IKitchenTicketRepository) { }

    async execute(data: ListTicketsRequestDTO): Promise<ArrKitchenTicketResponseDTO> {
        const tickets = data.status
            ? await this.repository.listByStatus(data.status)
            : await this.repository.listAll();

        return {
            tickets: tickets.map((ticket) => ({
                id: ticket.getId(),
                orderId: ticket.getOrderId(),
                status: ticket.getStatus(),
                priority: ticket.getPriority(),
                createdAt: ticket.getCreatedAt(),
                startedAt: ticket.getStartedAt(),
                finishedAt: ticket.getFinishedAt(),
            })),
        };
    }
}

export { ListKitchenTicketsUseCase };