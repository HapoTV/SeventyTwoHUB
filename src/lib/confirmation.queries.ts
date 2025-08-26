// src/lib/confirmation.queries.ts

import {supabase, submitBusinessRegistration, uploadRegistrationDocument} from './supabase'; // Ensure this path is correct
import type {
    BusinessRegistrationData,
    FullRegistrationData,
    RegistrationResult,
    SelectedProgram
} from '../types/confirmation.types';

/**
 * Creates program application entries for each program the user selected.
 * @param registrationId The ID of the parent business registration.
 * @param submissionData The core data of the applicant.
 * @param selectedPrograms An array of programs the user applied for.
 */
const createProgramApplications = async (
    registrationId: string,
    submissionData: BusinessRegistrationData,
    selectedPrograms: SelectedProgram[]
) => {
    for (const program of selectedPrograms) {
        try {
            const {error} = await supabase
                .from('program_applications')
                .insert({
                    program_id: program.id,
                    applicant_id: registrationId, // Link to the business registration record
                    application_data: {
                        ...submissionData,
                        program_name: program.name,
                        application_source: 'business_registration'
                    },
                    status: 'submitted'
                });

            if (error) throw error;

        } catch (appError) {
            // Log the specific error but don't stop the entire process
            console.error(`Error creating application for program ${program.name}:`, appError);
        }
    }
};

/**
 * Uploads all documents provided during the registration process.
 * @param registrationId The ID of the parent business registration.
 * @param documents A key-value object of document types and files.
 */
const uploadAllDocuments = async (registrationId: string, documents: { [key: string]: File }) => {
    for (const [docType, file] of Object.entries(documents)) {
        if (file) {
            try {
                await uploadRegistrationDocument(registrationId, docType, file);
            } catch (docError) {
                // Log the specific error but don't stop the entire process
                console.error(`Error uploading ${docType}:`, docError);
            }
        }
    }
};

/**
 * The main orchestrator function for submitting the entire registration.
 * It handles data preparation, main submission, program applications, and document uploads.
 * @param registrationData The complete registration data from localStorage.
 * @returns A promise that resolves to the final registration result.
 */
export const finalizeRegistration = async (registrationData: FullRegistrationData): Promise<RegistrationResult> => {
    // 1. Prepare data for the main submission
    const submissionData: BusinessRegistrationData = {
        full_name: registrationData.step1?.fullName || '',
        email: registrationData.step1?.emailAddress || '',
        mobile_number: registrationData.step1?.mobileNumber || '',
        business_name: registrationData.step2?.businessName || '',
        business_category: registrationData.step2?.businessCategory || '',
        business_location: registrationData.step2?.businessLocation || '',
        business_type: registrationData.step2?.businessType || 'informal',
        number_of_employees: registrationData.step2?.numberOfEmployees || '',
        monthly_revenue: registrationData.step2?.monthlyRevenue || '',
        years_in_operation: parseInt(registrationData.step2?.yearsInOperation, 10) || 0,
        beee_level: registrationData.step2?.beeeLevel || 'not_certified',
        selected_services: registrationData.step4?.selectedTypes || [],
        description: registrationData.step4?.description || ''
    };

    // 2. Submit the main business registration
    const result = await submitBusinessRegistration(submissionData);
    if (!result) {
        throw new Error('Failed to submit main business registration');
    }

    // 3. Create associated program applications (if any)
    if (registrationData.step4?.selectedPrograms?.length > 0) {
        await createProgramApplications(result.id, submissionData, registrationData.step4.selectedPrograms);
    }

    // 4. Upload associated documents (if any)
    if (registrationData.step3) {
        await uploadAllDocuments(result.id, registrationData.step3);
    }

    return result;
};