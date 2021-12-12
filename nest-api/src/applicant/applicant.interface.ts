export interface applicantCreateBody {
	readonly level: string;
	readonly language?: string[];
	readonly categories: string[];
	readonly salary: number;
	readonly id_user: number;
}

export interface applicantUpdateBody {
	readonly level?: string;
	readonly language?: string[];
	readonly categories?: string[];
	readonly salary?: number;
}

export interface getAllApplQuery {
	readonly categories?: string;
	readonly level?: string;
	readonly salary?: number;
}
