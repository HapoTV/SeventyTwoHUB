import {supabase} from '../supabaseClient'; // Assuming you have a supabase client setup
import type {Category, Location, Product} from '../types/marketplace.types';

/**
 * Fetches the list of all available categories from the database.
 * @returns A promise that resolves to an array of categories.
 */
export const getCategories = async (): Promise<Category[]> => {
    console.log('Fetching categories from the database...');

    const {data, error} = await supabase
        .from('categories')
        .select('*');

    if (error) {
        console.error('Error fetching categories:', error);
        // Depending on your error handling strategy, you might want to throw the error
        return [];
    }

    return data || [];
};

/**
 * Fetches the list of all available locations from the database.
 * @returns A promise that resolves to an array of locations.
 */
export const getLocations = async (): Promise<Location[]> => {
    console.log('Fetching locations from the database...');

    const {data, error} = await supabase
        .from('locations')
        .select('*');

    if (error) {
        console.error('Error fetching locations:', error);
        return [];
    }

    return data || [];
};

/**
 * Fetches the list of all products from the database.
 * @returns A promise that resolves to an array of products.
 */
export const getProducts = async (): Promise<Product[]> => {
    console.log('Fetching products from the database...');

    const {data, error} = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return data || [];
};