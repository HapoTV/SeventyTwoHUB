// src/types/applicationType.types.ts

/**
 * Defines the structure for a program available for application.
 * This corresponds to the structure of the 'programs' table in your database.
 */
export interface Program {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'inactive' | 'completed';
    start_date?: string | null;
    end_date?: string | null;
    application_deadline?: string | null;
    max_participants?: number | null;
    created_at: string;
}