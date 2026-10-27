import type { KitchenTicketResponseDTO } from "@entities/kitchen-ticket/KitchenTicketResponseDTO.js";
import type { UpdateTicketStatusRequestDTO } from "@entities/kitchen-ticket/KitchenTicketRequestDTO.js";
import type { IKitchenTicketRepository } from "@repositories/interfaces/IKitchenTicketRepository.js";

class UpdateTicketStatusUseCase {
    constructor(private readonly repository: IKitchenTicketRepository) { }

    async execute(data: UpdateTicketStatusRequestDTO): Promise<KitchenTicketResponseDTO> {
        if (!data.id) {
            throw new Error("Id é obrigatório");
        }

        const ticket = await this.repository.findById(data.id);

        if (!ticket) {
            throw new Error("Ticket não encontrado");
        }

        if (data.action === "start") {
            ticket.startPreparing();
        } else if (data.action === "ready") {
            ticket.markReady();
        } else if (data.action === "delivered") {
            ticket.markDelivered();
        }

        const updated = await this.repository.update(ticket);

        if (!updated) {
            throw new Error("Falha ao atualizar ticket");
        }

        return {
            id: updated.getId(),
            orderId: updated.getOrderId(),
            status: updated.getStatus(),
            priority: updated.getPriority(),
            createdAt: updated.getCreatedAt(),
            startedAt: updated.getStartedAt(),
            finishedAt: updated.getFinishedAt(),
        };
    }
}

export { UpdateTicketStatusUseCase };