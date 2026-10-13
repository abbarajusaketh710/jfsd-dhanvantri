
import React, { useState, useEffect } from 'react';
import { HealthData, OverallRiskAssessment, Gender, DietType } from './types';
import HealthAssessment from './components/HealthAssessment';
import RiskDashboard from './components/RiskDashboard';
import ClinicFinder from './components/ClinicFinder';
import Methodology from './components/Methodology';
import UMLArchitecture from './components/UMLArchitecture';
import { HealthRiskCalculator } from './utils/riskCalculator';
import { Stethoscope, Activity, ChevronRight, ExternalLink, Shield, HeartPulse, Maximize, Minimize, PlayCircle, Sparkles, BookOpen, Users, Layers } from 'lucide-react';

type View = 'landing' | 'assessment' | 'dashboard' | 'clinics' | 'methodology' | 'architecture';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<OverallRiskAssessment | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize URL and check for Auto-Run (Demo) params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'true') {
        startDemo();
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      console.error("Error attempting to enable full-screen mode:", err);
    }
  };

  const openInNewTab = () => {
    window.open('/', '_blank');
  };

  const handleAssessmentComplete = (data: HealthData) => {
    setHealthData(data);
    const risks = HealthRiskCalculator.calculateOverallRisk(data);
    setRiskAssessment(risks);
    setCurrentView('dashboard');
  };

  const startAssessment = () => {
    setHealthData(null);
    setRiskAssessment(null);
    setCurrentView('assessment');
  };

  const startDemo = () => {
    const demoData: HealthData = {
        personalInfo: {
            age: 42,
            gender: Gender.Male,
            height: 178,
            weight: 85,
            occupation: "Corporate Executive",
            location: "New York, NY"
        },
        lifestyle: {
            smoker: false,
            alcohol: "Occasional",
            exerciseFrequency: "1-2 days",
            dietType: DietType.NonVegetarian,
            sleepHours: 6,
            stressLevel: 4,
            waterIntake: 1.5
        },
        symptoms: {
            selectedSymptoms: ["fatigue", "headaches"]
        },
        familyHistory: {
            diabetes: true,
            hypertension: true,
            heartDisease: false,
            stroke: false,
            obesity: false
        },
        vitals: {
            systolicBP: 135,
            diastolicBP: 88,
            heartRate: 78,
            glucose: 105,
            cholesterol: 210
        },
        bmi: 26.8
    };
    handleAssessmentComplete(demoData);
  };
  
  const resetApp = () => {
    setHealthData(null);
    setRiskAssessment(null);
    setCurrentView('landing');
    window.history.pushState({}, '', window.location.pathname);
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 animate-fade-in relative z-10">
            {/* Hero Icon */}
            <div className="mb-10 relative group cursor-default">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse"></div>
              <div className="relative p-8 bg-gray-900/80 backdrop-blur-md rounded-full ring-1 ring-gray-700/50 shadow-2xl transform transition duration-500 hover:scale-105">
                <Stethoscope className="w-24 h-24 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-emerald-200 tracking-tighter drop-shadow-sm">
              Dhanvantri
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-12 leading-relaxed font-light">
              Your personal AI Health Architect. 
              <br className="hidden md:block" />
              Advanced risk prediction meets <span className="text-cyan-400 font-medium">hyper-personalized</span> wellness planning.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg justify-center">
              <button 
                onClick={startAssessment}
                className="group relative flex-1 px-8 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(8,145,178,0.3)] transition-all transform hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(8,145,178,0.5)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10 flex items-center justify-center">
                  Start Analysis <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button 
                onClick={startDemo}
                className="group flex-1 flex items-center justify-center px-8 py-5 bg-gray-800/80 hover:bg-gray-700 text-white rounded-2xl font-semibold text-lg border border-gray-600 hover:border-emerald-500/50 transition-all transform hover:-translate-y-1 backdrop-blur-sm"
              >
                <PlayCircle className="w-5 h-5 mr-2 text-emerald-400 group-hover:text-emerald-300" />
                Demo Mode
              </button>
            </div>
            
            {/* Feature Grid */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-5 max-w-6xl w-full text-left">
              {[
                { icon: Activity, color: "text-emerald-400", title: "Predictive AI", desc: "Clinical-grade algorithms specifically tuned for diabetes, hypertension, and cardiac risks." },
                { icon: HeartPulse, color: "text-purple-400", title: "Holistic Plans", desc: "Personalized nutrition macros, 7-day training schedules, and daily habit tracking." },
                { icon: Shield, color: "text-blue-400", title: "Privacy First", desc: "Zero-knowledge client architecture. Your biometric data remains strictly in your browser." },
                { icon: Layers, color: "text-cyan-400", title: "UML & Specs", desc: "Full architectural diagrams, Mermaid.js sequence flows, and master LLM design prompt.", onClick: () => setCurrentView('architecture') }
              ].map((feature, idx) => (
                <div 
                  key={idx} 
                  onClick={feature.onClick}
                  className={`group p-5 rounded-2xl bg-gray-900/40 border border-gray-800 hover:border-gray-600 hover:bg-gray-800/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${feature.onClick ? 'cursor-pointer hover:border-cyan-500/50' : ''}`}
                >
                  <div className={`w-11 h-11 bg-gray-800/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300 border border-gray-700`}>
                     <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
                    <span>{feature.title}</span>
                    {feature.onClick && <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'assessment':
        return <HealthAssessment onComplete={handleAssessmentComplete} onCancel={() => setCurrentView('landing')} />;

      case 'dashboard':
        return healthData && riskAssessment ? (
          <RiskDashboard 
            data={healthData} 
            risk={riskAssessment} 
            onReset={resetApp} 
            onFindClinics={() => setCurrentView('clinics')} 
          />
        ) : null;

      case 'clinics':
        return <ClinicFinder onBack={() => setCurrentView(healthData ? 'dashboard' : 'landing')} userLocation={healthData?.personalInfo.location} />;
      
      case 'methodology':
        return <Methodology onBack={() => setCurrentView('landing')} onViewUML={() => setCurrentView('architecture')} />;

      case 'architecture':
        return <UMLArchitecture onBack={() => setCurrentView(healthData ? 'dashboard' : 'landing')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[100px] mix-blend-screen"></div>
          <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-purple-900/10 rounded-full blur-[80px] mix-blend-screen"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-gray-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={() => setCurrentView('landing')}
            >
              <div className="relative w-10 h-10 mr-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-emerald-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition"></div>
                  <div className="absolute inset-0 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-700">
                    <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                  </div>
              </div>
              <span className="font-bold text-2xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">Dhanvantri</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-2">
               <button 
                  onClick={() => setCurrentView('landing')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${currentView === 'landing' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
               >
                  Home
               </button>
               <button 
                  onClick={() => setCurrentView('methodology')}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${currentView === 'methodology' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
               >
                  <BookOpen className="w-4 h-4 mr-2" /> Methodology
               </button>
               <button 
                  onClick={() => setCurrentView('architecture')}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${currentView === 'architecture' ? 'text-white bg-white/10 text-cyan-300' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
               >
                  <Layers className="w-4 h-4 mr-2 text-cyan-400" /> UML & Architecture
               </button>
               <button 
                  onClick={() => setCurrentView('clinics')}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${currentView === 'clinics' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
               >
                  <Users className="w-4 h-4 mr-2" /> Specialists
               </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              
               <button 
                onClick={openInNewTab}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-cyan-900/20 hover:bg-cyan-900/40 text-cyan-400 text-xs font-bold uppercase tracking-wider rounded-lg border border-cyan-500/30 hover:border-cyan-500/60 transition-all shadow-lg hover:shadow-cyan-500/20"
              >
                <ExternalLink className="w-3 h-3" />
                Open New Tab
              </button>

              <button 
                onClick={toggleFullScreen}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-gray-700 hover:border-gray-500 transition-all ml-2"
              >
                {isFullscreen ? (
                    <>
                        <Minimize className="w-3 h-3" /> Exit Full Screen
                    </>
                ) : (
                    <>
                        <Maximize className="w-3 h-3" /> Full Screen
                    </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-28 pb-12 px-4 relative z-10 min-h-screen flex flex-col">
        {renderView()}
      </main>

      {/* Mobile Floating Action Button (Immersive Mode Toggle) */}
      <button 
        onClick={toggleFullScreen}
        className="md:hidden fixed bottom-6 right-6 p-4 bg-gradient-to-br from-gray-800 to-gray-900 text-cyan-400 rounded-full shadow-2xl border border-gray-700 z-50 transition-transform active:scale-95"
        aria-label="Toggle Full Screen"
      >
        {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
      </button>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
