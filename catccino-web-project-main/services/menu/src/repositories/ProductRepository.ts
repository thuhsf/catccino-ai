import { pool } from "@database/pg.js";
import Product from "@entities/product/Product.js";
import type {
    IProductFactory,
    IProductRepository,
} from "@repositories/interfaces/IProductRepository.js";
import type { ProductRow } from "@repositories/types/ProductRow.js";

class ProductRepository implements IProductRepository {
    private mapToEntity(row: ProductRow): Product {
        return new Product({
            id: row.id,
            name: row.name,
            description: row.description,
            price: Number(row.price),
            categoryId: row.category_id,
            available: row.available,
            imageUrl: row.image_url,
            thumbnailUrl: row.thumbnail_url,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }

    async create(data: Product): Promise<Product | null> {
        const sql = `
			INSERT INTO products (name, description, price, category_id, available, image_url, thumbnail_url, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
			RETURNING *
		`;
        const result = await pool.query(sql, [
            data.getName(),
            data.getDescription(),
            data.getPrice(),
            data.getCategoryId(),
            data.getAvailable(),
            data.getImageUrl(),
            data.getThumbnailUrl(),
        ]);

        if (!result.rows.length) {
            return null;
        }

        return this.mapToEntity(result.rows[0]);
    }

    async update(data: Product): Promise<Product | null> {
        const sql = `
			UPDATE products
			SET
			  name = $1,
			  description = $2,
		          price = $3,
			  category_id = $4,
			  available = $5,
			  image_url = $6,
              thumbnail_url = $7,
			  updated_at = NOW()
			WHERE id = $8
			RETURNING *
		`;

        const result = await pool.query(sql, [
            data.getName(),
            data.getDescription(),
            data.getPrice(),
            data.getCategoryId(),
            data.getAvailable(),
            data.getImageUrl(),
            data.getThumbnailUrl(),
            data.getId(),
        ]);

        if (!result.rows.length) {
            return null;
        }

        return new Product({
            id: result.rows[0].id,
            name: result.rows[0].name,
            description: result.rows[0].description,
            price: Number(result.rows[0].price),
            categoryId: result.rows[0].category_id,
            available: result.rows[0].available,
            imageUrl: result.rows[0].image_url,
            thumbnailUrl: result.rows[0].thumbnail_url,
        });
    }

    async findByName(name: string): Promise<Product | null> {
        const sql = `
            SELECT * FROM products
            WHERE name ILIKE $1
        `;

        const result = await pool.query(sql, [name]);

        if (!result.rows.length) {
            return null;
        }

        return this.mapToEntity(result.rows[0]);
    }

    async searchByName(name: string): Promise<Product[]> {
        const sql = `
            SELECT * FROM products
            WHERE name ILIKE $1
        `;
        const result = await pool.query<ProductRow>(sql, [`%${name}%`]);
        return result.rows.map((row: ProductRow) => this.mapToEntity(row));
    }

    async listAll(): Promise<Product[]> {
        const sql = `
			SELECT * FROM products
		`;

        const result = await pool.query<ProductRow>(sql);

        return result.rows.map((row: ProductRow) => this.mapToEntity(row));
    }

    async findById(id: string): Promise<Product | null> {
        const sql = `
			SELECT * FROM products
			WHERE id = $1
		`;

        const result = await pool.query(sql, [id]);

        if (!result.rows.length) {
            return null;
        }

        return this.mapToEntity(result.rows[0]);
    }
}

class ProductFactory implements IProductFactory {
    createRepository(): IProductRepository {
        return new ProductRepository();
    }
}

export { ProductFactory, ProductRepository };
