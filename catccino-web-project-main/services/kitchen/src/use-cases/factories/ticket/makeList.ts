import { ListKitchenTicketsUseCase } from "@use-cases/ticket/ListKitchenTicketsUseCase.js";
import type { IKitchenTicketFactory } from "@repositories/interfaces/IKitchenTicketRepository.js";

export function makeListTickets(factory: IKitchenTicketFactory) {
    return new ListKitchenTicketsUseCase(factory.createRepository());
}