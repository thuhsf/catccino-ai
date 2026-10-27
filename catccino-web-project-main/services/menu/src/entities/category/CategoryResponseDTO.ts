export type CategoryResponseDTO = {
	id: string;
	name: string;
	slug: string;
};

export interface ArrCategoryResponseDTO {
	categories: CategoryResponseDTO[];
};