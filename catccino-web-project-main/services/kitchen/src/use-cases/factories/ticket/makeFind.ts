import { FindKitchenTicketUseCase } from "@use-cases/ticket/FindKitchenTicketUseCase.js";
import type { IKitchenTicketFactory } from "@repositories/interfaces/IKitchenTicketRepository.js";

export function makeFindTicket(factory: IKitchenTicketFactory) {
    return new FindKitchenTicketUseCase(factory.createRepository());
}