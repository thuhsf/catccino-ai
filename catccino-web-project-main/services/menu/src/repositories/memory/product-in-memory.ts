import type { UUID } from "crypto";
import type { IProductRepository } from "@repositories/interfaces/IProductRepository.js";
import type Product from "@entities/product/Product.js";

/* @inMemory just for tests */

class ProductInMemo implements IProductRepository {
	private arrList: Array<Product> = [];

	create(data: Product): Product | null {
		this.arrList.push(data);

		return data;
	}

	update(id: UUID): Product | null {
		const product = this.arrList.find((product) => product.getId == id);

		return product || null;
	}

	findByName(name: string): Product | null {
		const product = this.arrList.find((product) => product.getName == name);

		return product || null;
	}

	listAll(): Product | null {
		this.arrList.map((product) => {
			return product;
		})

		return null;
	}

}
