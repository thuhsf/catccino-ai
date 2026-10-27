type Product = {
    id?: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    available?: boolean | undefined;
    imageUrl?: string | undefined;
    thumbnailUrl?: string | undefined;
};

type PartialProduct = {
    id: string;
    name?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    categoryId?: string | undefined;
    available?: boolean | undefined;
    imageUrl?: string | undefined;
    thumbnailUrl?: string | undefined;
};

export interface ProductRequestDTO {
    product: Product;
};

export interface UpdateProductRequestDTO {
    product: PartialProduct;
};
