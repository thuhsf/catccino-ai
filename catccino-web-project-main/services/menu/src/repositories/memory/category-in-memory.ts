import type { UUID } from "crypto";
import type Category from "@entities/category/Category.js";
import type { ICategoryRepository } from "@repositories/interfaces/ICategoryRepository.js";

/* @inMemory just for tests */

class CategoryInMemo implements ICategoryRepository {
	private arrList: Array<Category> = [];

	create(data: Category): Category | null {
		this.arrList.push(data);

		return data;
	}

	update(id: UUID): Category | null {
		const category = this.arrList.find((category) => category.getId == id);

		return category || null;
	}

	findByName(name: string): Category | null {
		const category = this.arrList.find((category) => category.getName == name);

		return category || null;
	}

	listAll(): Category | null {
		this.arrList.map((category) => {
			return category;
		})

		return null;
	}
}
