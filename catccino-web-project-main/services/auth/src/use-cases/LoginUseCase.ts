import bcrypt from "bcryptjs";
import type { LoginRequestDTO } from "@entities/auth/LoginRequestDTO.js";
import type { AuthResponseDTO } from "@entities/auth/AuthResponseDTO.js";
import type { IAuthRepository } from "@repositories/interfaces/IAuthRepository.js";
import type { ICustomerGateway } from "@services/interfaces/customer/ICustomerGateway.js";
import { signToken } from "@utils/jwt.js";

class LoginUseCase {
    constructor(
        private readonly repository: IAuthRepository,
        private readonly customerGateway: ICustomerGateway,
    ) {}

    async execute(data: LoginRequestDTO): Promise<AuthResponseDTO> {
        const credential = await this.repository.findByEmail(data.email);

        if (!credential) {
            throw new Error("E-mail ou senha inválidos");
        }

        const passwordMatches = await bcrypt.compare(
            data.password,
            credential.getPasswordHash(),
        );

        if (!passwordMatches) {
            throw new Error("E-mail ou senha inválidos");
        }

        const customer = await this.customerGateway.findCustomerById(
            credential.getCustomerId(),
        );

        if (!customer) {
            throw new Error("Cliente vinculado a essa conta não foi encontrado");
        }

        const token = signToken({
            customerId: customer.id,
            email: customer.email,
        });

        return {
            token,
            customer: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
            },
        };
    }
}

export { LoginUseCase };
