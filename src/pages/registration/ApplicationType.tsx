// src/pages/registration/ApplicationType.tsx

import React, {useState, useEffect, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import {ArrowLeft, Calendar, RefreshCw, Users, BookOpen, Target, Zap, AlertTriangle} from 'lucide-react';
import {getActivePrograms, subscribeToProgramChanges} from '../../lib/applicationType.queries';
import type {Program} from '../../types/applicationType.types';

const ApplicationType: React.FC = () => {
  const navigate = useNavigate();
    const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [availablePrograms, setAvailablePrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    const loadAvailablePrograms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
        const data = await getActivePrograms();
      setAvailablePrograms(data);
        console.log('Loaded available programs:', data.length);
    } catch (err) {
      console.error('Error loading programs:', err);
      setError('Failed to load available programs. Please try again.');
    } finally {
      setLoading(false);
    }
    }, []);

  useEffect(() => {
      // Initial data load
      void loadAvailablePrograms();

      // Setup real-time subscription
      const subscription = subscribeToProgramChanges(() => {
          // Reload programs when a change is detected
          void loadAvailablePrograms();
      });

      // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [loadAvailablePrograms]);


  const getIconForProgram = (programName: string) => {
    const name = programName.toLowerCase();
      if (name.includes('accelerator') || name.includes('startup')) return Zap;
      if (name.includes('training') || name.includes('course') || name.includes('learn')) return BookOpen;
      if (name.includes('business') || name.includes('entrepreneur')) return Target;
    if (name.includes('mentor') || name.includes('coach') || name.includes('support')) return Users;
      return Calendar;
  };

  const getColorForProgram = (index: number) => {
    const colors = [
      'text-blue-600',
      'text-green-600', 
      'text-purple-600',
      'text-orange-600',
      'text-red-600',
      'text-indigo-600'
    ];
    return colors[index % colors.length];
  };

    const handleProgramToggle = (programId: string) => {
        setSelectedPrograms(prev =>
            prev.includes(programId)
                ? prev.filter(id => id !== programId)
                : [...prev, programId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      if (selectedPrograms.length === 0) {
          alert('Please select at least one program to apply for');
      return;
    }

    // Update registration data
    const existingData = JSON.parse(localStorage.getItem('registrationData') || '{}');
    localStorage.setItem('registrationData', JSON.stringify({
      ...existingData,
      step4: {
          selectedPrograms,
        description,
          selectedProgramsData: availablePrograms.filter(p => selectedPrograms.includes(p.id))
      }
    }));
    
    navigate('/register/confirmation');
  };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-ZA', {year: 'numeric', month: 'long', day: 'numeric'});
    };

    const isDeadlinePassed = (deadline: string) => {
        return new Date(deadline) < new Date();
    };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button
              onClick={() => navigate('/register/business')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
            <h1 className="text-xl font-semibold text-gray-900 ml-4">Select Programs</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Available Programs</h2>
                  <p className="text-sm text-gray-600">Select the training programs you want to join</p>
              </div>
              <button
                  onClick={() => void loadAvailablePrograms()}
                disabled={loading}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Refresh programs"
              >
                <RefreshCw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600"/>
              <p className="text-red-800 text-sm">{error}</p>
                </div>
              <button
                  onClick={() => void loadAvailablePrograms()}
                className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {loading && (
            <div className="mb-6 text-center">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Loading available programs...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!loading && availablePrograms.length === 0 && !error && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Programs Available</h3>
                <p className="text-gray-600">There are currently no active programs accepting applications.</p>
                  <button
                      onClick={() => navigate('/welcome')}
                      className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                      Back to Welcome
                  </button>
              </div>
            )}

            {!loading && availablePrograms.length > 0 && (
              <div className="space-y-3">
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 text-sm">
                          <strong>Note:</strong> You can select multiple programs. Each program may have different
                          requirements and timelines.
                      </p>
                  </div>

                {availablePrograms.map((program, index) => {
                  const Icon = getIconForProgram(program.name);
                    const isSelected = selectedPrograms.includes(program.id);
                  const color = getColorForProgram(index);
                    // --- FIX IS HERE ---
                    const deadlinePassed = !!(program.application_deadline && isDeadlinePassed(program.application_deadline));

                  return (
                    <label
                      key={program.id}
                      className={`flex items-start space-x-3 p-4 border-2 rounded-lg transition-colors ${
                          deadlinePassed
                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                              : isSelected
                                  ? 'border-primary-500 bg-primary-50 cursor-pointer'
                                  : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => !deadlinePassed && handleProgramToggle(program.id)}
                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
                        disabled={deadlinePassed}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Icon className={`w-5 h-5 ${color}`} />
                          <h3 className="font-medium text-gray-900">{program.name}</h3>
                            {deadlinePassed && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              Deadline Passed
                            </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{program.description}</p>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                          {program.start_date && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                                <span>Starts: {formatDate(program.start_date)}</span>
                            </div>
                          )}
                          {program.application_deadline && (
                            <div className="flex items-center space-x-1">
                                <AlertTriangle className={`w-3 h-3 ${deadlinePassed ? 'text-red-500' : ''}`}/>
                                <span className={deadlinePassed ? 'text-red-500 font-medium' : ''}>
                                Deadline: {formatDate(program.application_deadline)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}

                  {selectedPrograms.length > 0 && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <h4 className="font-medium text-green-900 mb-2">Selected Programs
                              ({selectedPrograms.length})</h4>
                          <div className="space-y-1">
                              {availablePrograms
                                  .filter(p => selectedPrograms.includes(p.id))
                                  .map(program => (
                                      <div key={program.id} className="flex items-center justify-between">
                                          <span className="text-sm text-green-800">{program.name}</span>
                                          <button type="button" onClick={() => handleProgramToggle(program.id)}
                                                  className="text-green-600 hover:text-green-700 text-xs">
                                              Remove
                                          </button>
                                      </div>
                                  ))}
                          </div>
                      </div>
                  )}
              </div>
            )}

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why do you want to join these programs? (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Share your goals and how these programs align with your business objectives..."
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{description.length}/500 characters</p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || availablePrograms.length === 0 || selectedPrograms.length === 0}
                className="w-full py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                  {selectedPrograms.length > 0 ? `Apply to ${selectedPrograms.length} Program${selectedPrograms.length > 1 ? 's' : ''}` : 'Select Programs to Continue'}
              </button>

                {selectedPrograms.length === 0 && !loading && availablePrograms.length > 0 && (
                    <p className="text-center text-sm text-gray-500 mt-2">Please select at least one program to
                        continue</p>
                )}
            </div>
          </form>
        </div>

          <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 mb-2">Need help choosing programs?</p>
              <p className="text-xs text-gray-500">Contact us at <a href="mailto:support@seventytwo.co.za"
                                                                    className="text-primary-600 hover:text-primary-700">support@seventytwo.co.za</a>
              </p>
          </div>
      </div>
    </div>
  );
};

export default ApplicationType;