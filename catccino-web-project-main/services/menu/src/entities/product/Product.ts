type ProductProps = {
    id?: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    available?: boolean;
    imageUrl?: string;
    thumbnailUrl: string;
    createdAt?: Date;
    updatedAt?: Date;
};

class Product {
    private readonly Id: string;
    private Name: string;
    private Description: string;
    private Price: number;
    private CategoryId: string;
    private Available: boolean;
    private ImageUrl: string;
    private ThumbnailUrl: string;
    private CreatedAt: Date;
    private UpdatedAt: Date;

    constructor(props: ProductProps) {
        this.Id = props.id ?? "";
        this.Name = props.name;
        this.Description = props.description;
        this.Price = props.price;
        this.CategoryId = props.categoryId;
        this.Available = props.available ?? false;
        this.ImageUrl = props.imageUrl ?? "";
        this.ThumbnailUrl = props.thumbnailUrl ?? "";
        this.CreatedAt = props.createdAt ?? new Date();
        this.UpdatedAt = props.updatedAt ?? new Date();

        this.validate();
    }

    private validate() {
        if (this.Name.length < 3) {
            throw new Error("Invalid product name");
        };

        if (this.Price <= 0) {
            throw new Error("Invalid product price");
        };
    };

    getId(): string { return this.Id; };
    getName(): string { return this.Name; };
    getDescription(): string { return this.Description; };
    getPrice(): number { return this.Price; };
    getCategoryId(): string { return this.CategoryId; };
    getAvailable(): boolean { return this.Available; };
    getImageUrl(): string { return this.ImageUrl; };
    getThumbnailUrl(): string { return this.ThumbnailUrl; };
    getCreatedAt(): Date { return this.CreatedAt; };
    getUpdatedAt(): Date { return this.UpdatedAt; };

    rename(value: string) {
        if (value.length < 3) throw new Error("Invalid product name");
        this.Name = value;
        this.touch();
    };

    changeDescription(value: string) {
        this.Description = value;
        this.touch();
    };

    changePrice(value: number) {
        if (value <= 0) throw new Error("Invalid product price");
        this.Price = value;
        this.touch();
    };

    activate() {
        this.Available = true;
        this.touch();
    };

    deactivate() {
        this.Available = false;
        this.touch();
    };

    changeImage(value: string) {
        this.ImageUrl = value;
        this.touch();
    };

    changeThumbnail(value: string) {
        this.ThumbnailUrl = value;
        this.touch();
    }

    private touch() {
        this.UpdatedAt = new Date();
    };
};

export default Product;
