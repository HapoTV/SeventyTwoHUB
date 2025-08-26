// src/pages/registration/Confirmation.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Upload, BookOpen, MessageSquare, Copy } from 'lucide-react';
import {finalizeRegistration} from '../../lib/confirmation.queries';
import type {FullRegistrationData} from '../../types/confirmation.types';

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const [applicationNumber, setApplicationNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
  const submitRegistration = async () => {
    try {
      setIsSubmitting(true);
        const registrationData = JSON.parse(localStorage.getItem('registrationData') || '{}') as FullRegistrationData;

        if (!registrationData.step1 || !registrationData.step2) {
            throw new Error("Incomplete registration data. Redirecting...");
        }

        // Call the single, clean function to handle all backend logic
        const result = await finalizeRegistration(registrationData);
      
      setApplicationNumber(result.reference_number);

        // Store final application data with reference number
      localStorage.setItem('applicationData', JSON.stringify({
        ...registrationData,
        applicationNumber: result.reference_number,
        status: 'Pending Review',
        submittedAt: result.submitted_at
      }));
      
    } catch (error) {
        console.error('An error occurred during the final submission step:', error);
        alert('Error submitting registration. Please try again or contact support.');
        // Optionally, navigate to an error page or back to the first step
        navigate('/register/start');
    } finally {
      setIsSubmitting(false);
    }
  };

      void submitRegistration();
  }, [navigate]);

  const copyToClipboard = () => {
      if (!applicationNumber) return;
      navigator.clipboard.writeText(applicationNumber)
          .then(() => alert('Application number copied to clipboard!'))
          .catch(err => console.error('Failed to copy text:', err));
  };

    const goToLogin = () => {
    // Clear registration data and redirect to login
    localStorage.removeItem('registrationData');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank you for registering!</h1>
            <p className="text-gray-600">Your business registration has been submitted for review.</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Application Reference Number</h3>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg font-mono text-primary-600 h-7">
                {isSubmitting ? 'Generating...' : applicationNumber}
              </span>
              <button
                onClick={copyToClipboard}
                disabled={isSubmitting || !applicationNumber}
                className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="text-left mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                  <span>We'll review your application within 2-3 business days.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                  <span>You'll receive an email notification once approved.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                  <span>You can then log in to your new dashboard.</span>
              </li>
            </ul>
          </div>

          <button
              onClick={goToLogin}
            className="w-full py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors mb-4"
          >
            Go to Login
          </button>

          <div className="grid grid-cols-3 gap-2">
              <button className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
              <Upload className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <span className="text-xs text-gray-600">Upload Docs</span>
            </button>
              <button className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
              <BookOpen className="w-5 h-5 text-gray-600 mx-auto mb-1" />
              <span className="text-xs text-gray-600">Resources</span>
            </button>
              <button className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
              <MessageSquare className="w-5 h-5 text-gray-600 mx-auto mb-1" />
              <span className="text-xs text-gray-600">Messages</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
              <a href="mailto:support@seventytwo.co.za" className="text-primary-600 hover:text-primary-700">
                  support@seventytwo.co.za
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;