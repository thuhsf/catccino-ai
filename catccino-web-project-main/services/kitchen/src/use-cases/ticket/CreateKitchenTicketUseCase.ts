import { KitchenTicket } from "@entities/kitchen-ticket/KitchenTicket.js";
import type { KitchenTicketResponseDTO } from "@entities/kitchen-ticket/KitchenTicketResponseDTO.js";
import type { IKitchenTicketRepository } from "@repositories/interfaces/IKitchenTicketRepository.js";

interface CreateKitchenTicketRequestDTO {
    orderId: string;
    priority?: number;
}

class CreateKitchenTicketUseCase {
    constructor(private readonly repository: IKitchenTicketRepository) { }

    async execute(data: CreateKitchenTicketRequestDTO): Promise<KitchenTicketResponseDTO> {
        const existing = await this.repository.findByOrderId(data.orderId);

        if (existing) {
            throw new Error("Já existe um ticket para esse pedido");
        }

        const ticket = new KitchenTicket({
            orderId: data.orderId,
            priority: data.priority ?? 0,
        });

        const created = await this.repository.create(ticket);

        if (!created) {
            throw new Error("Falha ao criar ticket");
        }

        return {
            id: created.getId(),
            orderId: created.getOrderId(),
            status: created.getStatus(),
            priority: created.getPriority(),
            createdAt: created.getCreatedAt(),
            startedAt: created.getStartedAt(),
            finishedAt: created.getFinishedAt(),
        };
    }
}

export { CreateKitchenTicketUseCase };
export type { CreateKitchenTicketRequestDTO };