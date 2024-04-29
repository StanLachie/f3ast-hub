interface Product {
	name: string;
	icon: {
		name: string;
		color: string;
	};
	prices: {
		monthly: number;
		yearly: number;
	};
	description: string;
	features: string[];
}

export type { Product };
