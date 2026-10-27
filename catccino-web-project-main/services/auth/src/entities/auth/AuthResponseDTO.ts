export interface AuthResponseDTO {
    token: string;
    customer: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
}
