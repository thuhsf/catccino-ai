type authCredentialProps = {
    id?: string;
    customerId: string;
    email: string;
    passwordHash: string;
    createdAt?: Date;
    updatedAt?: Date;
};

class AuthCredential {
    private readonly Id: string;
    private CustomerId: string;
    private Email: string;
    private PasswordHash: string;
    private CreatedAt: Date;
    private UpdatedAt: Date;

    constructor(props: authCredentialProps) {
        this.Id = props.id ?? "";
        this.CustomerId = props.customerId;
        this.Email = props.email;
        this.PasswordHash = props.passwordHash;
        this.CreatedAt = props.createdAt ?? new Date();
        this.UpdatedAt = props.updatedAt ?? new Date();
    }

    getId(): string {
        return this.Id;
    }
    public getCustomerId(): string {
        return this.CustomerId;
    }
    public getEmail(): string {
        return this.Email;
    }
    public getPasswordHash(): string {
        return this.PasswordHash;
    }
    public getCreatedAt(): Date {
        return this.CreatedAt;
    }
    public getUpdatedAt(): Date {
        return this.UpdatedAt;
    }
}

export { AuthCredential };
