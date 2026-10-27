type CategoryProps = {
	id?: string;
	name: string;
	slug: string;
};

class Category {
	private readonly Id: string;
	private Name: string;
	private Slug: string;

	constructor(props: CategoryProps) {
		this.Id = props.id ?? "";
		this.Name = props.name;
		this.Slug = props.slug;
	};

	getId(): string {
		return this.Id;
	};

	getName(): string {
		return this.Name;
	};

	getSlug(): string {
		return this.Slug;
	};

	rename(value: string) {
		if (value.length < 3) {
			throw new Error("Invalid category name");
		};

		this.Name = value;
	};

	changeSlug(value: string) {
		this.Slug = value;
	};

};

export default Category;
