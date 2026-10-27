import type { KitchenTicketResponseDTO } from "@entities/kitchen-ticket/KitchenTicketResponseDTO.js";
import type { IKitchenTicketRepository } from "@repositories/interfaces/IKitchenTicketRepository.js";

class FindKitchenTicketUseCase {
    constructor(private readonly repository: IKitchenTicketRepository) { }

    async execute(id: string): Promise<KitchenTicketResponseDTO> {
        if (!id) throw new Error("Id é obrigatório");

        const ticket = await this.repository.findById(id);

        if (!ticket) throw new Error("Ticket não encontrado");

        return {
            id: ticket.getId(),
            orderId: ticket.getOrderId(),
            status: ticket.getStatus(),
            priority: ticket.getPriority(),
            createdAt: ticket.getCreatedAt(),
            startedAt: ticket.getStartedAt(),
            finishedAt: ticket.getFinishedAt(),
        };
    }
}

export { FindKitchenTicketUseCase };