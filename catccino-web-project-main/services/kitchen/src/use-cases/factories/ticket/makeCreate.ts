import { CreateKitchenTicketUseCase } from "@use-cases/ticket/CreateKitchenTicketUseCase.js";
import type { IKitchenTicketFactory } from "@repositories/interfaces/IKitchenTicketRepository.js";

export function makeCreateTicket(factory: IKitchenTicketFactory) {
    return new CreateKitchenTicketUseCase(factory.createRepository());
}