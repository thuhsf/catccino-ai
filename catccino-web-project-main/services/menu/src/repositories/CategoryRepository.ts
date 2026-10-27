import { pool } from "@database/pg.js";
import Category from "@entities/category/Category.js";
import type { ICategoryFactory, ICategoryRepository } from "@repositories/interfaces/ICategoryRepository.js";
import type { CategoryRow } from "@repositories/types/CategoryRow.js";

class CategoryRepository implements ICategoryRepository {
    private mapToEntity(row: CategoryRow): Category {
        return new Category({
            id: row.id,
            name: row.name,
            slug: row.slug
        });
    };

    async create(data: Category): Promise<Category | null> {
        const sql = `
			INSERT INTO categories (name, slug)
		        VALUES ($1, $2)
			RETURNING *
		`;

        const result = await pool.query(sql, [
            data.getName(),
            data.getSlug()
        ]);

        if (!result.rows.length) {
            return null;
        };

        return this.mapToEntity(result.rows[0]);
    };

    async update(data: Category): Promise<Category | null> {
        const sql = `
			UPDATE categories
			SET
			  name = $1,
   			  slug = $2
			WHERE id = $3
			RETURNING *
		`;
        const result = await pool.query(sql, [
            data.getName(),
            data.getSlug(),
            data.getId()
        ]);

        if (!result.rows.length) {
            return null;
        };

        return this.mapToEntity(result.rows[0]);
    }

    async delete(id: string): Promise<Category | null> {
        const sql = `
			DELETE FROM categories
			WHERE id = $1
			RETURNING *
		`;

        const result = await pool.query(sql, [id]);

        if (!result.rows.length) {
            return null;
        };

        return this.mapToEntity(result.rows[0]);
    };

    async findByName(name: string): Promise<Category | null> {
        const sql = `
			SELECT * FROM categories
			WHERE name = $1
		`;

        const result = await pool.query(sql, [name]);

        if (!result.rows.length) {
            return null;
        }

        return this.mapToEntity(result.rows[0]);
    };

    async findById(id: string): Promise<Category | null> {
        const sql = `
			SELECT * FROM categories
			WHERE id = $1
		`;

        const result = await pool.query(sql, [id]);

        if (!result.rows.length) {
            return null;
        };

        return this.mapToEntity(result.rows[0]);
    };

    async listAll(): Promise<Category[]> {
        const sql = `
			SELECT * FROM categories
		`;

        const result = await pool.query(sql);

        return result.rows.map((row) => this.mapToEntity(row));
    };
};

class CategoryFactory implements ICategoryFactory {
    createRepository(): ICategoryRepository {
        return new CategoryRepository();
    };
};

export { CategoryRepository, CategoryFactory };
