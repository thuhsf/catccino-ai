type customerProps = {
    id?: string;
    name: string;
    email: string;
    phone: string;
    createdAt?: Date;
    updatedAt?: Date;
};

class Customer {
    private readonly Id: string;
    private Name: string;
    private Email: string;
    private Phone: string;
    private CreatedAt: Date;
    private UpdatedAt: Date;

    constructor(props: customerProps) {
        this.Id = props.id ?? "";
        this.Name = props.name;
        this.Email = props.email;
        this.Phone = props.phone;
        this.CreatedAt = props.createdAt ?? new Date();
        this.UpdatedAt = props.updatedAt ?? new Date();
    }
    getId(): string {
        return this.Id;
    }
    public getName(): string {
        return this.Name;
    }
    public getEmail(): string {
        return this.Email;
    }
    public getPhone(): string {
        return this.Phone;
    }
    public getCreatedAt(): Date {
        return this.CreatedAt;
    }
    public getUpdatedAt(): Date {
        return this.UpdatedAt;
    }

    public rename(value: string) {
        this.Name = value;
        this.touch();
    }
    public changeEmail(value: string) {
        this.Email = value;
        this.touch();
    }
    public changePhone(value: string) {
        this.Phone = value;
        this.touch();
    }
    private touch() {
        this.UpdatedAt = new Date();
    }
}

export { Customer };
