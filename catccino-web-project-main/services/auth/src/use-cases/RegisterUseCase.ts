import bcrypt from "bcryptjs";
import { AuthCredential } from "@entities/auth/AuthCredential.js";
import type { RegisterRequestDTO } from "@entities/auth/RegisterRequestDTO.js";
import type { AuthResponseDTO } from "@entities/auth/AuthResponseDTO.js";
import type { IAuthRepository } from "@repositories/interfaces/IAuthRepository.js";
import type { ICustomerGateway } from "@services/interfaces/customer/ICustomerGateway.js";
import { signToken } from "@utils/jwt.js";

const SALT_ROUNDS = 10;

class RegisterUseCase {
    constructor(
        private readonly repository: IAuthRepository,
        private readonly customerGateway: ICustomerGateway,
    ) {}

    async execute(data: RegisterRequestDTO): Promise<AuthResponseDTO> {
        const credentialExists = await this.repository.findByEmail(data.email);

        if (credentialExists) {
            throw new Error("Já existe uma conta com esse e-mail");
        }

        // cria o perfil do cliente no customer-service
        const customer = await this.customerGateway.createCustomer({
            name: data.name,
            email: data.email,
            phone: data.phone,
        });

        const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

        const credential = new AuthCredential({
            customerId: customer.id,
            email: data.email,
            passwordHash,
        });

        const created = await this.repository.create(credential);

        if (!created) {
            throw new Error("Falha ao criar credenciais de acesso");
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

export { RegisterUseCase };
