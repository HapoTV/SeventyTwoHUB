// src/types/marketplace.types.ts

/**
 * Defines the structure for a category object.
 */
export interface Category {
    id: string;
    name: string;
}

/**
 * Defines the structure for a location object.
 */
export interface Location {
    id: string;
    name: string;
}

/**
 * Defines the structure for a product or service listing.
 */
export interface Product {
    id: number;
    title: string;
    description: string;
    price: string;
    seller: string;
    location: string;
    category: string;
    rating: number;
    reviews: number;
    image: string;
    featured: boolean;
    inStock: boolean;
}