import React, { useState, useEffect } from 'react';
import { HealthData, Gender, DietType } from '../types';
import { Activity, ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Brain, Search, Database } from 'lucide-react';

import PersonalInfoForm from './forms/PersonalInfoForm';
import LifestyleForm from './forms/LifestyleForm';
import SymptomsForm from './forms/SymptomsForm';
import FamilyHistoryForm from './forms/FamilyHistoryForm';
import VitalsForm from './forms/VitalsForm';

interface Props {
  onComplete: (data: HealthData) => void;
  onCancel: () => void;
}

const STORAGE_KEY = 'dhanvantri_draft_data';

const HealthAssessment: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const [data, setData] = useState<HealthData>({
    personalInfo: { age: 0, gender: Gender.Male, height: 0, weight: 0, occupation: '', location: '' },
    lifestyle: { smoker: false, alcohol: 'None', exerciseFrequency: 'None', dietType: DietType.NonVegetarian, sleepHours: 7, stressLevel: 3, waterIntake: 2 },
    symptoms: { selectedSymptoms: [] },
    familyHistory: { diabetes: false, hypertension: false, heartDisease: false, stroke: false, obesity: false },
    vitals: {},
    bmi: 0
  });

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            setData(parsed);
        } catch (e) {
            console.error("Failed to load draft");
        }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateSection = (section: keyof HealthData, update: any) => {
    setData(prev => ({ ...prev, [section]: { ...prev[section], ...update } }));
    if (error) setError(null);
  };

  const calculateFinalBMI = () => {
    if (data.personalInfo.height && data.personalInfo.weight) {
      const h = data.personalInfo.height / 100;
      return parseFloat((data.personalInfo.weight / (h * h)).toFixed(1));
    }
    return 0;
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
        case 1:
            if (!data.personalInfo.age || data.personalInfo.age <= 0) {
                setError("Please enter a valid age.");
                return false;
            }
            if (data.personalInfo.age > 120) {
                setError("Please enter a realistic age.");
                return false;
            }
            if (!data.personalInfo.height || data.personalInfo.height <= 0) {
                setError("Please enter a valid height (cm).");
                return false;
            }
             if (!data.personalInfo.weight || data.personalInfo.weight <= 0) {
                setError("Please enter a valid weight (kg).");
                return false;
            }
            if (!data.personalInfo.occupation.trim()) {
                setError("Please enter your occupation.");
                return false;
            }
             if (!data.personalInfo.location.trim()) {
                setError("Please enter your location.");
                return false;
            }
            return true;
        case 2:
            return true;
        default:
            return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(step)) return;

    if (step < 5) {
        setStep(step + 1);
        window.scrollTo(0, 0);
    } else {
      startAnalysis();
    }
  };

  const startAnalysis = () => {
      setIsAnalyzing(true);
      // Clear draft on completion
      localStorage.removeItem(STORAGE_KEY);
      
      const steps = [
          () => setAnalysisStep(1), 
          () => setAnalysisStep(2), 
          () => setAnalysisStep(3), 
          () => {
             const finalData = { ...data, bmi: calculateFinalBMI() };
             onComplete(finalData);
          }
      ];

      steps.forEach((fn, index) => {
          setTimeout(fn, (index + 1) * 1200);
      });
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    setError(null);
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <PersonalInfoForm data={data.personalInfo} updateData={(d) => updateSection('personalInfo', d)} />;
      case 2: return <LifestyleForm data={data.lifestyle} updateData={(d) => updateSection('lifestyle', d)} />;
      case 3: return <SymptomsForm data={data.symptoms} updateData={(d) => updateSection('symptoms', d)} />;
      case 4: return <FamilyHistoryForm data={data.familyHistory} updateData={(d) => updateSection('familyHistory', d)} />;
      case 5: return <VitalsForm data={data.vitals} updateData={(d) => updateSection('vitals', d)} />;
      default: return null;
    }
  };

  const stepsLabels = ['Basics', 'Lifestyle', 'Symptoms', 'Family', 'Vitals'];

  if (isAnalyzing) {
      return (
          <div className="w-full max-w-2xl mx-auto min-h-[500px] flex flex-col items-center justify-center p-8 animate-fade-in">
              <div className="relative w-32 h-32 mb-8">
                  <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
                  <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-12 h-12 text-cyan-400 animate-pulse" />
                  </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-6">Analyzing Health Profile</h2>
              
              <div className="w-full space-y-4">
                  <AnalysisStep label="Processing biometric data..." active={analysisStep >= 0} completed={analysisStep > 0} icon={Database} />
                  <AnalysisStep label="Running risk prediction models..." active={analysisStep >= 1} completed={analysisStep > 1} icon={Activity} />
                  <AnalysisStep label="Cross-referencing medical protocols..." active={analysisStep >= 2} completed={analysisStep > 2} icon={Search} />
                  <AnalysisStep label="Generating personalized roadmap..." active={analysisStep >= 3} completed={analysisStep > 3} icon={Brain} />
              </div>
          </div>
      );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
            <Activity className="text-cyan-400 w-8 h-8" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
                Assessment
            </h1>
        </div>
        <button onClick={onCancel} className="text-gray-400 hover:text-white transition">Exit</button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 relative">
        <div className="flex justify-between mb-2">
            {stepsLabels.map((label, idx) => (
                <span key={idx} className={`text-xs md:text-sm font-medium transition-colors duration-300 ${step > idx ? 'text-cyan-400' : step === idx + 1 ? 'text-white' : 'text-gray-600'}`}>
                    {label}
                </span>
            ))}
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500 ease-out"
                style={{ width: `${(step / 5) * 100}%` }}
            ></div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-gray-900/60 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 md:p-8 shadow-2xl min-h-[450px] relative">
        
        {error && (
            <div className="absolute top-4 left-4 right-4 bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center animate-fade-in z-10">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
            </div>
        )}

        <div className="mt-4">
            {renderStep()}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                step === 1 ? 'opacity-0 cursor-default' : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
            }`}
        >
            <ArrowLeft className="w-5 h-5 mr-2" /> Previous
        </button>

        <button
            onClick={handleNext}
            className="flex items-center px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-bold shadow-[0_0_15px_rgba(8,145,178,0.5)] transform hover:-translate-y-1 transition-all"
        >
            {step === 5 ? 'Analyze Health' : 'Next Step'}
            {step === 5 ? <CheckCircle className="w-5 h-5 ml-2" /> : <ArrowRight className="w-5 h-5 ml-2" />}
        </button>
      </div>
    </div>
  );
};

const AnalysisStep = ({ label, active, completed, icon: Icon }: { label: string, active: boolean, completed: boolean, icon: any }) => (
    <div className={`flex items-center p-4 rounded-xl transition-all duration-500 ${active || completed ? 'bg-gray-800/50 border border-gray-700' : 'opacity-30'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 transition-colors duration-500 ${completed ? 'bg-emerald-500 text-white' : active ? 'bg-cyan-500 text-white animate-pulse' : 'bg-gray-700 text-gray-400'}`}>
            {completed ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
        </div>
        <span className={`font-medium ${completed ? 'text-emerald-400' : active ? 'text-white' : 'text-gray-500'}`}>{label}</span>
    </div>
);

export default HealthAssessment;