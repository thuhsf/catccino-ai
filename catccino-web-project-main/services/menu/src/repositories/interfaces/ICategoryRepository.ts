import type Category from "@entities/category/Category.js";

export interface ICategoryRepository {
	create: (data: Category) => Promise<Category | null>;
	update: (data: Category) => Promise<Category | null>;
	listAll: () => Promise<Category[]>;
	findByName: (name: string) => Promise<Category | null>;
	findById: (id: string) => Promise<Category | null>
	delete: (id: string) => Promise<Category | null>
};

export interface ICategoryFactory {
	createRepository(): ICategoryRepository;
};
