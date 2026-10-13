import React, { useState, useEffect } from 'react';
import { VitalsData } from '../../types';
import { 
  Activity, 
  Heart, 
  Droplets, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Fingerprint, 
  Timer, 
  Plus, 
  Minus, 
  Wand2, 
  Sparkles, 
  RotateCcw,
  Sliders,
  Check,
  Info
} from 'lucide-react';

interface Props {
  data: VitalsData;
  updateData: (data: Partial<VitalsData>) => void;
}

type VitalTab = 'all' | 'bp' | 'glucose' | 'cholesterol' | 'heartRate';

export const VitalsForm: React.FC<Props> = ({ data, updateData }) => {
  const [activeTab, setActiveTab] = useState<VitalTab>('all');
  
  // Heart rate pulse tapper state
  const [taps, setTaps] = useState<number[]>([]);
  const [isTapping, setIsTapping] = useState(false);
  const [calculatedBPM, setCalculatedBPM] = useState<number | null>(data.heartRate || null);

  // Safe numeric updates
  const setNumeric = (field: keyof VitalsData, val: number | undefined) => {
    updateData({ [field]: val });
  };

  const handleInputChange = (field: keyof VitalsData, rawVal: string) => {
    if (rawVal === '') {
      updateData({ [field]: undefined });
      return;
    }
    const num = parseInt(rawVal, 10);
    if (!isNaN(num)) {
      updateData({ [field]: num });
    }
  };

  const stepValue = (field: keyof VitalsData, delta: number, min = 0, max = 500, fallback = 100) => {
    const current = data[field] !== undefined ? (data[field] as number) : fallback;
    const next = Math.max(min, Math.min(max, current + delta));
    updateData({ [field]: next });
  };

  // Heart Rate Tapper
  const handlePulseTap = () => {
    const now = Date.now();
    setIsTapping(true);
    setTimeout(() => setIsTapping(false), 180);

    let updatedTaps = [...taps, now];
    if (taps.length > 0 && now - taps[taps.length - 1] > 2500) {
      updatedTaps = [now];
    }
    if (updatedTaps.length > 6) {
      updatedTaps = updatedTaps.slice(updatedTaps.length - 6);
    }
    setTaps(updatedTaps);

    if (updatedTaps.length > 1) {
      const intervals: number[] = [];
      for (let i = 1; i < updatedTaps.length; i++) {
        intervals.push(updatedTaps[i] - updatedTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.round(60000 / avgInterval);
      if (bpm >= 40 && bpm <= 200) {
        setCalculatedBPM(bpm);
        updateData({ heartRate: bpm });
      }
    }
  };

  // Quick baseline profiles
  const applyPresetProfile = (profile: 'healthy' | 'elevated' | 'high') => {
    if (profile === 'healthy') {
      updateData({
        systolicBP: 118,
        diastolicBP: 76,
        glucose: 88,
        cholesterol: 175,
        heartRate: 68
      });
    } else if (profile === 'elevated') {
      updateData({
        systolicBP: 132,
        diastolicBP: 84,
        glucose: 112,
        cholesterol: 215,
        heartRate: 78
      });
    } else {
      updateData({
        systolicBP: 146,
        diastolicBP: 94,
        glucose: 135,
        cholesterol: 250,
        heartRate: 88
      });
    }
  };

  const clearAllVitals = () => {
    updateData({
      systolicBP: undefined,
      diastolicBP: undefined,
      glucose: undefined,
      cholesterol: undefined,
      heartRate: undefined
    });
    setCalculatedBPM(null);
    setTaps([]);
  };

  // Classifications according to AHA / ADA guidelines
  const getBPClassification = (sys?: number, dia?: number) => {
    if (!sys && !dia) return { label: 'Not Entered', color: 'text-gray-400 bg-gray-800 border-gray-700' };
    const s = sys || 120;
    const d = dia || 80;
    if (s > 180 || d > 120) return { label: 'Hypertensive Crisis', color: 'text-red-400 bg-red-950/80 border-red-500/50' };
    if (s >= 140 || d >= 90) return { label: 'Stage 2 Hypertension', color: 'text-rose-400 bg-rose-950/60 border-rose-500/40' };
    if ((s >= 130 && s <= 139) || (d >= 80 && d <= 89)) return { label: 'Stage 1 Hypertension', color: 'text-amber-400 bg-amber-950/60 border-amber-500/40' };
    if (s >= 120 && s <= 129 && d < 80) return { label: 'Elevated BP', color: 'text-yellow-400 bg-yellow-950/50 border-yellow-500/30' };
    return { label: 'Normal BP (<120/80)', color: 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30' };
  };

  const getGlucoseClassification = (val?: number) => {
    if (!val) return { label: 'Not Entered', color: 'text-gray-400 bg-gray-800 border-gray-700' };
    if (val < 70) return { label: 'Low (< 70)', color: 'text-blue-400 bg-blue-950/50 border-blue-500/30' };
    if (val <= 99) return { label: 'Normal Fasting (70-99)', color: 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30' };
    if (val <= 125) return { label: 'Impaired / Prediabetes (100-125)', color: 'text-amber-400 bg-amber-950/50 border-amber-500/30' };
    return { label: 'High / Diabetic Range (126+)', color: 'text-rose-400 bg-rose-950/50 border-rose-500/40' };
  };

  const getCholesterolClassification = (val?: number) => {
    if (!val) return { label: 'Not Entered', color: 'text-gray-400 bg-gray-800 border-gray-700' };
    if (val < 200) return { label: 'Desirable (< 200 mg/dL)', color: 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30' };
    if (val <= 239) return { label: 'Borderline High (200-239)', color: 'text-amber-400 bg-amber-950/50 border-amber-500/30' };
    return { label: 'High Risk (240+)', color: 'text-rose-400 bg-rose-950/50 border-rose-500/40' };
  };

  const getHeartRateClassification = (val?: number) => {
    if (!val) return { label: 'Not Entered', color: 'text-gray-400 bg-gray-800 border-gray-700' };
    if (val < 60) return { label: 'Bradycardia / Athletic (<60)', color: 'text-cyan-400 bg-cyan-950/50 border-cyan-500/30' };
    if (val <= 100) return { label: 'Normal Resting (60-100)', color: 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30' };
    return { label: 'Tachycardia / Elevated (>100)', color: 'text-rose-400 bg-rose-950/50 border-rose-500/40' };
  };

  const bpStatus = getBPClassification(data.systolicBP, data.diastolicBP);
  const glucoseStatus = getGlucoseClassification(data.glucose);
  const cholStatus = getCholesterolClassification(data.cholesterol);
  const hrStatus = getHeartRateClassification(data.heartRate);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
            Step 5: Clinical Vitals & Biometrics
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Input your readings via direct numbers, sliders, steppers, or quick clinical presets.
          </p>
        </div>

        {/* Quick-Fill Helpers */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-400 flex items-center mr-1">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Quick Autofill:
          </span>
          <button
            type="button"
            onClick={() => applyPresetProfile('healthy')}
            className="text-xs px-3 py-1.5 rounded-lg bg-emerald-900/30 text-emerald-300 hover:bg-emerald-900/50 border border-emerald-600/30 transition flex items-center font-medium"
          >
            <Check className="w-3 h-3 mr-1" /> Healthy Baseline
          </button>
          <button
            type="button"
            onClick={() => applyPresetProfile('elevated')}
            className="text-xs px-3 py-1.5 rounded-lg bg-amber-900/30 text-amber-300 hover:bg-amber-900/50 border border-amber-600/30 transition flex items-center font-medium"
          >
            Borderline
          </button>
          <button
            type="button"
            onClick={clearAllVitals}
            title="Reset vitals"
            className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-900/80 rounded-xl border border-gray-800">
        {[
          { id: 'all', label: 'All Vitals Overview' },
          { id: 'bp', label: 'Blood Pressure' },
          { id: 'glucose', label: 'Blood Glucose' },
          { id: 'cholesterol', label: 'Cholesterol' },
          { id: 'heartRate', label: 'Heart Rate' },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as VitalTab)}
            className={`px-3.5 py-2 text-xs md:text-sm font-semibold rounded-lg transition ${
              activeTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Vitals Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* 1. BLOOD PRESSURE CARD */}
        {(activeTab === 'all' || activeTab === 'bp') && (
          <div className="bg-gray-900/70 border border-gray-700/70 rounded-2xl p-5 hover:border-gray-600 transition shadow-lg relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Blood Pressure (BP)</h3>
                    <p className="text-xs text-gray-400">Systolic (Top) / Diastolic (Bottom) mmHg</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${bpStatus.color}`}>
                  {bpStatus.label}
                </span>
              </div>

              {/* Dual Inputs */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Systolic */}
                <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-700/50">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                    <span className="font-semibold text-gray-300">Systolic (Top)</span>
                    <span className="text-[10px] text-gray-500">Normal &lt;120</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => stepValue('systolicBP', -5, 70, 220, 120)}
                      className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 flex items-center justify-center transition active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      name="systolicBP"
                      min={70}
                      max={240}
                      value={data.systolicBP !== undefined ? data.systolicBP : ''}
                      onChange={(e) => handleInputChange('systolicBP', e.target.value)}
                      placeholder="120"
                      className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2 px-2 text-center text-white font-bold text-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => stepValue('systolicBP', 5, 70, 220, 120)}
                      className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 flex items-center justify-center transition active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Diastolic */}
                <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-700/50">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                    <span className="font-semibold text-gray-300">Diastolic (Bottom)</span>
                    <span className="text-[10px] text-gray-500">Normal &lt;80</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => stepValue('diastolicBP', -5, 40, 140, 80)}
                      className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 flex items-center justify-center transition active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      name="diastolicBP"
                      min={40}
                      max={140}
                      value={data.diastolicBP !== undefined ? data.diastolicBP : ''}
                      onChange={(e) => handleInputChange('diastolicBP', e.target.value)}
                      placeholder="80"
                      className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2 px-2 text-center text-white font-bold text-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => stepValue('diastolicBP', 5, 40, 140, 80)}
                      className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 flex items-center justify-center transition active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sliders for quick tactile adjustment */}
              <div className="space-y-2 mb-4 bg-gray-800/30 p-2.5 rounded-xl border border-gray-800">
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Systolic Range: 80 - 200</span>
                  <span className="font-mono text-cyan-300">{data.systolicBP || '--'} mmHg</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="200"
                  step="1"
                  value={data.systolicBP || 120}
                  onChange={(e) => setNumeric('systolicBP', parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-gray-700 rounded-lg appearance-none"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="border-t border-gray-800 pt-3">
              <span className="text-[11px] font-semibold text-gray-400 block mb-2">Quick Standard Readings:</span>
              <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                {[
                  { label: 'Normal', sys: 118, dia: 76, tag: '118/76' },
                  { label: 'Elevated', sys: 126, dia: 79, tag: '126/79' },
                  { label: 'Stage 1', sys: 135, dia: 86, tag: '135/86' },
                  { label: 'Stage 2', sys: 148, dia: 95, tag: '148/95' }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => updateData({ systolicBP: preset.sys, diastolicBP: preset.dia })}
                    className={`p-1.5 rounded-lg border transition ${
                      data.systolicBP === preset.sys && data.diastolicBP === preset.dia
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <div className="text-[10px] text-gray-400">{preset.label}</div>
                    <div className="font-mono text-xs">{preset.tag}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. FASTING BLOOD GLUCOSE CARD */}
        {(activeTab === 'all' || activeTab === 'glucose') && (
          <div className="bg-gray-900/70 border border-gray-700/70 rounded-2xl p-5 hover:border-gray-600 transition shadow-lg relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Blood Glucose (Fasting)</h3>
                    <p className="text-xs text-gray-400">Measured before morning meal (mg/dL)</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${glucoseStatus.color}`}>
                  {glucoseStatus.label}
                </span>
              </div>

              {/* Main Input with Stepper */}
              <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-700/50 mb-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                  <span className="font-semibold text-gray-300">Fasting Level</span>
                  <span className="text-[10px] text-gray-400">
                    {data.glucose ? `${(data.glucose / 18.018).toFixed(1)} mmol/L` : 'Target: 70-99 mg/dL'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => stepValue('glucose', -5, 50, 350, 90)}
                    className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 flex items-center justify-center transition active:scale-95 text-sm"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    name="glucose"
                    min={50}
                    max={350}
                    value={data.glucose !== undefined ? data.glucose : ''}
                    onChange={(e) => handleInputChange('glucose', e.target.value)}
                    placeholder="90"
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2.5 px-3 text-center text-white font-bold text-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => stepValue('glucose', 5, 50, 350, 90)}
                    className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 flex items-center justify-center transition active:scale-95 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Range Slider */}
              <div className="space-y-2 mb-4 bg-gray-800/30 p-2.5 rounded-xl border border-gray-800">
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Slider (60 - 200 mg/dL)</span>
                  <span className="font-mono text-blue-300">{data.glucose || '--'} mg/dL</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="200"
                  step="1"
                  value={data.glucose || 90}
                  onChange={(e) => setNumeric('glucose', parseInt(e.target.value, 10))}
                  className="w-full accent-blue-500 cursor-pointer h-1.5 bg-gray-700 rounded-lg appearance-none"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="border-t border-gray-800 pt-3">
              <span className="text-[11px] font-semibold text-gray-400 block mb-2">Clinical Benchmarks:</span>
              <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                {[
                  { label: 'Optimal', val: 85 },
                  { label: 'Normal', val: 95 },
                  { label: 'Prediabetes', val: 112 },
                  { label: 'Diabetic', val: 138 }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => updateData({ glucose: item.val })}
                    className={`p-1.5 rounded-lg border transition ${
                      data.glucose === item.val
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold'
                        : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <div className="text-[10px] text-gray-400">{item.label}</div>
                    <div className="font-mono text-xs">{item.val}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. TOTAL CHOLESTEROL CARD */}
        {(activeTab === 'all' || activeTab === 'cholesterol') && (
          <div className="bg-gray-900/70 border border-gray-700/70 rounded-2xl p-5 hover:border-gray-600 transition shadow-lg relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Total Cholesterol</h3>
                    <p className="text-xs text-gray-400">Lipid profile total (mg/dL)</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cholStatus.color}`}>
                  {cholStatus.label}
                </span>
              </div>

              {/* Main Input with Stepper */}
              <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-700/50 mb-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                  <span className="font-semibold text-gray-300">Total Serum</span>
                  <span className="text-[10px] text-gray-400">Target &lt;200 mg/dL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => stepValue('cholesterol', -10, 100, 450, 180)}
                    className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 flex items-center justify-center transition active:scale-95 text-sm"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    name="cholesterol"
                    min={100}
                    max={450}
                    value={data.cholesterol !== undefined ? data.cholesterol : ''}
                    onChange={(e) => handleInputChange('cholesterol', e.target.value)}
                    placeholder="180"
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2.5 px-3 text-center text-white font-bold text-xl focus:ring-2 focus:ring-amber-500 outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => stepValue('cholesterol', 10, 100, 450, 180)}
                    className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 flex items-center justify-center transition active:scale-95 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Range Slider */}
              <div className="space-y-2 mb-4 bg-gray-800/30 p-2.5 rounded-xl border border-gray-800">
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Slider (120 - 320 mg/dL)</span>
                  <span className="font-mono text-amber-300">{data.cholesterol || '--'} mg/dL</span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="320"
                  step="5"
                  value={data.cholesterol || 180}
                  onChange={(e) => setNumeric('cholesterol', parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-gray-700 rounded-lg appearance-none"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="border-t border-gray-800 pt-3">
              <span className="text-[11px] font-semibold text-gray-400 block mb-2">Clinical Benchmarks:</span>
              <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                {[
                  { label: 'Ideal', val: 165 },
                  { label: 'Desirable', val: 185 },
                  { label: 'Borderline', val: 215 },
                  { label: 'High', val: 255 }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => updateData({ cholesterol: item.val })}
                    className={`p-1.5 rounded-lg border transition ${
                      data.cholesterol === item.val
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <div className="text-[10px] text-gray-400">{item.label}</div>
                    <div className="font-mono text-xs">{item.val}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. RESTING HEART RATE CARD */}
        {(activeTab === 'all' || activeTab === 'heartRate') && (
          <div className="bg-gray-900/70 border border-gray-700/70 rounded-2xl p-5 hover:border-gray-600 transition shadow-lg relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Resting Heart Rate</h3>
                    <p className="text-xs text-gray-400">Beats per minute (BPM)</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${hrStatus.color}`}>
                  {hrStatus.label}
                </span>
              </div>

              {/* Main Input with Stepper */}
              <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-700/50 mb-3">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                  <span className="font-semibold text-gray-300">Pulse (BPM)</span>
                  <span className="text-[10px] text-gray-400">Resting range: 60-100</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => stepValue('heartRate', -2, 40, 180, 72)}
                    className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 flex items-center justify-center transition active:scale-95 text-sm"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    name="heartRate"
                    min={40}
                    max={180}
                    value={data.heartRate !== undefined ? data.heartRate : ''}
                    onChange={(e) => handleInputChange('heartRate', e.target.value)}
                    placeholder="72"
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2.5 px-3 text-center text-white font-bold text-xl focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => stepValue('heartRate', 2, 40, 180, 72)}
                    className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 flex items-center justify-center transition active:scale-95 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Interactive Pulse Tapper Tool */}
              <div className="bg-gradient-to-r from-emerald-950/30 to-teal-950/20 p-3 rounded-xl border border-emerald-500/20 mb-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center">
                    <Timer className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Tap-to-Measure Pulse
                  </div>
                  <p className="text-[11px] text-gray-400">Tap in sync with your pulse for 4-5 beats</p>
                </div>
                <button
                  type="button"
                  onClick={handlePulseTap}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center transition transform active:scale-90 ${
                    isTapping
                      ? 'bg-rose-500 text-white scale-95 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 mr-1.5 ${isTapping ? 'animate-ping' : ''}`} />
                  {isTapping ? 'Tapped!' : 'Tap Here'}
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="border-t border-gray-800 pt-3">
              <span className="text-[11px] font-semibold text-gray-400 block mb-2">Resting Profiles:</span>
              <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                {[
                  { label: 'Athlete', val: 54 },
                  { label: 'Calm', val: 68 },
                  { label: 'Average', val: 76 },
                  { label: 'Active', val: 86 }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => updateData({ heartRate: item.val })}
                    className={`p-1.5 rounded-lg border transition ${
                      data.heartRate === item.val
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <div className="text-[10px] text-gray-400">{item.label}</div>
                    <div className="font-mono text-xs">{item.val}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Helper guidance footer */}
      <div className="bg-cyan-950/20 border border-cyan-500/20 p-4 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-cyan-200/90 leading-relaxed">
          <strong className="text-white">Tip:</strong> You can enter precise lab numbers, use the <span className="text-cyan-300 font-semibold">+ / -</span> controls, or click the <span className="text-emerald-300 font-semibold">Healthy Baseline</span> button at the top to auto-populate standard clinical reference values if you haven't received recent lab tests.
        </p>
      </div>
    </div>
  );
};

export default VitalsForm;
