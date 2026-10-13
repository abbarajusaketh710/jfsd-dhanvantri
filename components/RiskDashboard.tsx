import React, { useEffect, useState } from 'react';
import { HealthData, OverallRiskAssessment, RiskLevel } from '../types';
import DetailedRecommendations from './DetailedRecommendations';
import HealthRadar from './HealthRadar';
import { getDetailedRecommendations } from '../utils/recommendationEngine';
import { generateAIHealthSummary, queryAIAdvisor } from '../utils/aiAdvisor';
import { HealthRiskCalculator } from '../utils/riskCalculator';
import { 
  AlertTriangle, 
  Heart, 
  Activity, 
  Droplets, 
  MapPin, 
  Download, 
  RefreshCcw, 
  ChevronDown, 
  CheckCircle, 
  Sparkles, 
  Bot, 
  Sliders, 
  Send, 
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface Props {
  data: HealthData;
  risk: OverallRiskAssessment;
  onReset: () => void;
  onFindClinics: () => void;
}

export const RiskDashboard: React.FC<Props> = ({ data, risk, onReset, onFindClinics }) => {
  const [recommendations, setRecommendations] = useState(() => getDetailedRecommendations(risk, data));
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // AI Interactive consultation state
  const [userQuery, setUserQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [querying, setQuerying] = useState(false);

  // Risk Simulator State
  const [simBPNormal, setSimBPNormal] = useState(false);
  const [simGlucoseNormal, setSimGlucoseNormal] = useState(false);
  const [simExerciseActive, setSimExerciseActive] = useState(false);
  const [simQuitSmoking, setSimQuitSmoking] = useState(data.lifestyle.smoker);
  const [simWeightLoss, setSimWeightLoss] = useState(false);

  // Calculate simulated health data & risk
  const getSimulatedData = (): HealthData => {
    return {
      ...data,
      bmi: simWeightLoss ? Math.max(22, data.bmi - 3.5) : data.bmi,
      lifestyle: {
        ...data.lifestyle,
        exerciseFrequency: simExerciseActive ? '3-4 days' : data.lifestyle.exerciseFrequency,
        smoker: simQuitSmoking ? false : data.lifestyle.smoker,
      },
      vitals: {
        ...data.vitals,
        systolicBP: simBPNormal ? 118 : data.vitals.systolicBP,
        diastolicBP: simBPNormal ? 76 : data.vitals.diastolicBP,
        glucose: simGlucoseNormal ? 88 : data.vitals.glucose,
      }
    };
  };

  const simulatedData = getSimulatedData();
  const simulatedRisk = HealthRiskCalculator.calculateOverallRisk(simulatedData);
  const scoreDiff = risk.overall.score - simulatedRisk.overall.score;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const triggerAI = async () => {
    setLoadingAi(true);
    const summary = await generateAIHealthSummary(data, risk);
    setAiSummary(summary);
    setLoadingAi(false);
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    setQuerying(true);
    const reply = await queryAIAdvisor(userQuery, data, risk);
    setAiAnswer(reply);
    setQuerying(false);
  };

  const getRiskBadgeColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.Low: return 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30';
      case RiskLevel.Moderate: return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30';
      case RiskLevel.High: return 'bg-orange-900/30 text-orange-400 border-orange-500/30';
      case RiskLevel.VeryHigh: return 'bg-red-900/30 text-red-400 border-red-500/30';
      default: return 'bg-gray-800 text-gray-400';
    }
  };

  const downloadJSON = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify({ 
        profile: data, 
        riskAssessment: risk, 
        simulatedRisk: simulatedRisk.overall,
        detailedPlan: recommendations, 
        aiSummary 
      }, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `dhanvantri_health_report_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900/70 backdrop-blur-xl border border-gray-700/80 rounded-3xl p-6 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Clinical Risk Analysis Protocol</span>
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
            Dhanvantri Diagnostic Report
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Patient: <span className="text-white font-medium">{data.personalInfo.age}yo {data.personalInfo.gender}</span> • {data.personalInfo.occupation || 'Standard'} • {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="flex space-x-3 mt-4 md:mt-0">
          <button 
            onClick={downloadJSON} 
            className="flex items-center px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl transition border border-gray-600 shadow-lg"
          >
            <Download className="w-4 h-4 mr-2 text-cyan-400" /> Export JSON Report
          </button>
          <button 
            onClick={onReset} 
            className="flex items-center px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl transition border border-gray-600 shadow-lg"
          >
            <RefreshCcw className="w-4 h-4 mr-2 text-emerald-400" /> New Assessment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Radar & AI Insight */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Overall Score Card */}
          <div className="bg-gray-900/60 border border-gray-700/80 rounded-3xl p-6 flex flex-col items-center justify-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-500 to-emerald-500"></div>
            <HealthRadar data={data} risk={risk} />
            <div className="mt-4 text-center">
              <h2 className="text-4xl font-extrabold text-white font-mono">
                {risk.overall.score}<span className="text-lg text-gray-500 font-normal">/100</span>
              </h2>
              <span className={`inline-block mt-2 px-4 py-1.5 rounded-full border ${getRiskBadgeColor(risk.overall.level)} font-bold uppercase tracking-wider text-xs`}>
                {risk.overall.level} Risk Profile
              </span>
            </div>
          </div>

          {/* AI Advisor Card */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-gray-900 border border-indigo-500/40 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-indigo-200 font-bold text-sm flex items-center">
                <Bot className="w-4 h-4 mr-2 text-indigo-400" /> Chief Medical AI Insight
              </h3>
              {!aiSummary && !loadingAi && (
                <button 
                  onClick={triggerAI} 
                  className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl transition flex items-center font-semibold shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-cyan-300" /> Synthesize
                </button>
              )}
            </div>
            
            {loadingAi ? (
              <div className="space-y-2.5 animate-pulse py-2">
                <div className="h-2.5 bg-indigo-500/20 rounded w-3/4"></div>
                <div className="h-2.5 bg-indigo-500/20 rounded w-full"></div>
                <div className="h-2.5 bg-indigo-500/20 rounded w-5/6"></div>
              </div>
            ) : aiSummary ? (
              <div className="bg-indigo-950/60 p-4 rounded-2xl border border-indigo-500/30 mb-4">
                <p className="text-indigo-100 text-xs md:text-sm leading-relaxed italic">
                  "{aiSummary}"
                </p>
              </div>
            ) : (
              <p className="text-indigo-200/70 text-xs mb-4">
                Click synthesize to generate an executive consultation powered by Google Gemini 2.5 Flash.
              </p>
            )}

            {/* Quick Ask AI Box */}
            <form onSubmit={handleAskAI} className="mt-4 pt-4 border-t border-indigo-500/20">
              <span className="text-[11px] font-semibold text-indigo-300 block mb-2">
                Ask Dhanvantri a personalized question:
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="e.g. How to lower fasting sugar naturally?"
                  className="w-full bg-gray-950 border border-indigo-900 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:ring-1 focus:ring-indigo-400 outline-none"
                />
                <button
                  type="submit"
                  disabled={querying || !userQuery.trim()}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition disabled:opacity-50 flex items-center"
                >
                  {querying ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </div>

              {aiAnswer && (
                <div className="mt-3 p-3 bg-gray-950/80 rounded-xl border border-indigo-800/40 text-xs text-indigo-100 leading-relaxed animate-fade-in">
                  <strong className="text-indigo-300 block mb-1">AI Recommendation:</strong>
                  {aiAnswer}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Detailed Metrics & Interactive Simulator */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Diabetes */}
            <div className="bg-gray-900/60 border border-gray-700/80 p-5 rounded-2xl flex flex-col justify-between hover:border-blue-500/50 transition duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-blue-900/30 rounded-xl text-blue-400 border border-blue-500/20">
                  <Droplets className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getRiskBadgeColor(risk.diabetes.level)}`}>
                  {risk.diabetes.level}
                </span>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-gray-200 font-semibold text-sm">Diabetes Risk</h4>
                  <span className="text-xs font-mono text-blue-400">{risk.diabetes.score}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden border border-gray-700">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${risk.diabetes.score}%` }}></div>
                </div>
              </div>
            </div>

            {/* Hypertension */}
            <div className="bg-gray-900/60 border border-gray-700/80 p-5 rounded-2xl flex flex-col justify-between hover:border-purple-500/50 transition duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-purple-900/30 rounded-xl text-purple-400 border border-purple-500/20">
                  <Activity className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getRiskBadgeColor(risk.hypertension.level)}`}>
                  {risk.hypertension.level}
                </span>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-gray-200 font-semibold text-sm">Hypertension</h4>
                  <span className="text-xs font-mono text-purple-400">{risk.hypertension.score}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden border border-gray-700">
                  <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${risk.hypertension.score}%` }}></div>
                </div>
              </div>
            </div>

            {/* Cardiovascular */}
            <div className="bg-gray-900/60 border border-gray-700/80 p-5 rounded-2xl flex flex-col justify-between hover:border-rose-500/50 transition duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-rose-900/30 rounded-xl text-rose-400 border border-rose-500/20">
                  <Heart className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getRiskBadgeColor(risk.cardiovascular.level)}`}>
                  {risk.cardiovascular.level}
                </span>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-gray-200 font-semibold text-sm">Cardiovascular</h4>
                  <span className="text-xs font-mono text-rose-400">{risk.cardiovascular.score}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden border border-gray-700">
                  <div className="bg-rose-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${risk.cardiovascular.score}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Risk Drivers */}
          <div className="bg-gray-800/40 border border-gray-700/70 p-6 rounded-2xl shadow-lg">
            <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-amber-400" />
              Primary Risk Drivers Identified
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {risk.overall.factors.length > 0 ? (
                risk.overall.factors.map((factor, i) => (
                  <span key={i} className="px-3.5 py-1.5 bg-gray-800 text-gray-200 text-xs font-medium rounded-lg border border-gray-700 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2"></span>
                    {factor}
                  </span>
                ))
              ) : (
                <span className="text-emerald-400 text-xs italic flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  No elevated risk factors detected.
                </span>
              )}
            </div>
          </div>

          {/* INTERACTIVE RISK SIMULATOR ("What-If" Engine) */}
          <div className="bg-gradient-to-br from-teal-950/30 via-gray-900 to-cyan-950/30 border border-cyan-500/30 p-6 rounded-2xl shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 inline-block mb-1">
                  Dynamic Prognosis Simulator
                </span>
                <h4 className="text-base font-bold text-white flex items-center">
                  <Sliders className="w-4 h-4 mr-2 text-cyan-400" /> What-If Health Optimizer
                </h4>
                <p className="text-xs text-gray-400">
                  Toggle positive interventions to visualize your immediate risk reduction potential.
                </p>
              </div>

              {scoreDiff > 0 && (
                <div className="bg-emerald-950/50 border border-emerald-500/40 px-3.5 py-1.5 rounded-xl flex items-center space-x-2 text-emerald-300 text-xs font-bold animate-pulse">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  <span>-{scoreDiff} pts Risk Reduction!</span>
                </div>
              )}
            </div>

            {/* Simulator Toggles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
              <button
                type="button"
                onClick={() => setSimBPNormal(!simBPNormal)}
                className={`p-2.5 rounded-xl border text-xs font-medium transition text-left ${
                  simBPNormal 
                    ? 'bg-cyan-900/40 border-cyan-500 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                <div className="font-bold">Target BP 118/76</div>
                <div className="text-[10px] opacity-80">{simBPNormal ? '✓ Applied' : '+ Tap to test'}</div>
              </button>

              <button
                type="button"
                onClick={() => setSimGlucoseNormal(!simGlucoseNormal)}
                className={`p-2.5 rounded-xl border text-xs font-medium transition text-left ${
                  simGlucoseNormal 
                    ? 'bg-cyan-900/40 border-cyan-500 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                <div className="font-bold">Fasting Sugar &lt;95</div>
                <div className="text-[10px] opacity-80">{simGlucoseNormal ? '✓ Applied' : '+ Tap to test'}</div>
              </button>

              <button
                type="button"
                onClick={() => setSimExerciseActive(!simExerciseActive)}
                className={`p-2.5 rounded-xl border text-xs font-medium transition text-left ${
                  simExerciseActive 
                    ? 'bg-cyan-900/40 border-cyan-500 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                <div className="font-bold">Exercise 3-4 days</div>
                <div className="text-[10px] opacity-80">{simExerciseActive ? '✓ Applied' : '+ Tap to test'}</div>
              </button>

              <button
                type="button"
                onClick={() => setSimWeightLoss(!simWeightLoss)}
                className={`p-2.5 rounded-xl border text-xs font-medium transition text-left ${
                  simWeightLoss 
                    ? 'bg-cyan-900/40 border-cyan-500 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                <div className="font-bold">Drop 3.5 BMI Pts</div>
                <div className="text-[10px] opacity-80">{simWeightLoss ? '✓ Applied' : '+ Tap to test'}</div>
              </button>

              {data.lifestyle.smoker && (
                <button
                  type="button"
                  onClick={() => setSimQuitSmoking(!simQuitSmoking)}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition text-left ${
                    simQuitSmoking 
                      ? 'bg-cyan-900/40 border-cyan-500 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                      : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold">Smoke-Free</div>
                  <div className="text-[10px] opacity-80">{simQuitSmoking ? '✓ Applied' : '+ Tap to test'}</div>
                </button>
              )}
            </div>

            {/* Real-time comparison meter */}
            <div className="bg-gray-950/70 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Current Score</span>
                <span className="text-xl font-bold text-white font-mono">{risk.overall.score}</span>
                <span className="text-xs text-gray-500 ml-1">({risk.overall.level})</span>
              </div>

              <ArrowRight className="w-5 h-5 text-cyan-400" />

              <div className="text-right">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Projected Score</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">{simulatedRisk.overall.score}</span>
                <span className="text-xs text-emerald-300 ml-1">({simulatedRisk.overall.level})</span>
              </div>
            </div>
          </div>

          {/* Action Banner: Specialist Finder */}
          <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/20 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center shadow-lg gap-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-0.5">Connect with Certified Specialists</h3>
              <p className="text-blue-200 text-xs">
                Find cardiologists, endocrinologists, and wellness clinics near <span className="text-white font-medium">{data.personalInfo.location || 'your area'}</span>.
              </p>
            </div>
            <button 
              onClick={onFindClinics}
              className="flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition transform hover:-translate-y-0.5 flex-shrink-0"
            >
              <MapPin className="w-4 h-4 mr-1.5" /> Find Clinics Near Me
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center py-2">
        <ChevronDown className="w-6 h-6 text-gray-600 animate-bounce" />
      </div>

      {/* Detailed Recommendations Component */}
      <DetailedRecommendations recommendations={recommendations} userName={data.personalInfo.occupation || "Patient"} />

    </div>
  );
};

export default RiskDashboard;