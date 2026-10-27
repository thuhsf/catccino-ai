import { UpdateTicketStatusUseCase } from "@use-cases/ticket/UpdateTicketStatusUseCase.js";
import type { IKitchenTicketFactory } from "@repositories/interfaces/IKitchenTicketRepository.js";

export function makeUpdateTicketStatus(factory: IKitchenTicketFactory) {
    return new UpdateTicketStatusUseCase(factory.createRepository());
}