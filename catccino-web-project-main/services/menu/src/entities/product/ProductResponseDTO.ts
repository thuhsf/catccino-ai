type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    available?: boolean | undefined;
    imageUrl?: string | undefined;
    thumbnailUrl?: string | undefined;
    createdAt: Date;
    updatedAt: Date;
};

export interface ProductResponseDTO {
    product: Product;
};

export interface ArrProductResponseDTO {
    products: Product[];
};