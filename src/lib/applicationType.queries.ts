// src/lib/applicationType.queries.ts

import {supabase} from './supabase'; // Ensure this path is correct
import type {Program} from '../types/applicationType.types';
import type {RealtimeChannel} from '@supabase/supabase-js';

/**
 * Fetches all active programs from the database, ordered by name.
 * @returns A promise that resolves to an array of active programs.
 */
export const getActivePrograms = async (): Promise<Program[]> => {
    const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('status', 'active')
        .order('name', {ascending: true});

    if (error) {
        console.error('Error fetching active programs:', error);
        // Throwing the error allows the calling component to handle it in a try-catch block.
        throw error;
    }

    return data || [];
};

/**
 * Sets up a real-time subscription to the 'programs' table.
 * When any change occurs, it invokes the provided callback function.
 * @param onProgramChange - The callback function to execute when a change is detected.
 * @returns The Supabase channel subscription, which includes an `unsubscribe` method.
 */
export const subscribeToProgramChanges = (onProgramChange: (payload: unknown) => void): RealtimeChannel => {
    const channel = supabase
        .channel('programs_changes')
        .on('postgres_changes', {
                event: '*',
                schema: 'public',
            table: 'programs'
        }, (payload) => {
            console.log('Program change detected via subscription:', payload);
            onProgramChange(payload);
        })
        .subscribe();

    return channel;
};