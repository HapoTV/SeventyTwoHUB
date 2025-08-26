// src/types/confirmation.types.ts

/**
 * Defines the structure of the data submitted for a new business registration.
 */
export interface BusinessRegistrationData {
    full_name: string;
    email: string;
    mobile_number: string;
    business_name: string;
    business_category: string;
    business_location: string;
    business_type: 'informal' | 'formal' | string;
    number_of_employees: string;
    monthly_revenue: string;
    years_in_operation: number;
    beee_level: 'not_certified' | string;
    selected_services: string[];
    description: string;
}

/**
 * Defines the structure of a program object stored in localStorage.
 */
export interface SelectedProgram {
    id: string;
    name: string;
    // Add other program properties if they exist
}

/**
 * Defines the structure of the successful registration result.
 */
export interface RegistrationResult {
    id: string;
    reference_number: string;
    submitted_at: string;
}

/**
 * Defines the full registration data object retrieved from localStorage.
 */
export interface FullRegistrationData {
    step1: { fullName: string; emailAddress: string; mobileNumber: string; };
    step2: {
        businessName: string;
        businessCategory: string;
        businessLocation: string;
        businessType: string;
        numberOfEmployees: string;
        monthlyRevenue: string;
        yearsInOperation: string;
        beeeLevel: string;
    };
    step3?: { [key: string]: File };
    step4: {
        selectedPrograms: SelectedProgram[];
        selectedTypes: string[];
        description: string;
    };
}