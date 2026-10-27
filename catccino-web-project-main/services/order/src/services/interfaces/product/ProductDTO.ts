export interface ProductDTO {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    available?: boolean | undefined;
    imageUrl?: string | undefined;
    createdAt: Date;
    updatedAt: Date;
};