export type ProductRow = {
    id: string;
    name: string;
    description: string;
    price: number;
    category_id: string;
    available: boolean;
    image_url: string;
    thumbnail_url: string;
    created_at: Date;
    updated_at: Date;
};