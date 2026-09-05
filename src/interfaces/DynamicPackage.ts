export interface DynamicPackageInput {
    name: string;
    price: number;
    slug: string;
    description?: string;
    imageUrl?: string;
    custom?: Record<string, string>;
}

export interface DynamicPackagesRequest {
    username: string;
    categoryId: number;
    packages: DynamicPackageInput[];
}
