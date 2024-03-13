export interface PaginationFields {
	after?: string;
	before?: string;
}

export interface Pageable {
	paging: {
		next?: string;
		previous?: string;
		cursors?: PaginationFields;
	};
}
