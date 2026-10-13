import React from 'react';
import { HealthData, OverallRiskAssessment, RiskLevel } from '../types';

interface Props {
  data: HealthData;
  risk: OverallRiskAssessment;
}

const HealthRadar: React.FC<Props> = ({ data, risk }) => {
  // Normalize scores to 0-100 scale (where 100 is BEST health, 0 is WORST)
  // We invert the risk scores because high risk = low health score
  
  const getLifestyleScore = () => {
    let score = 100;
    if (data.lifestyle.smoker) score -= 20;
    if (data.lifestyle.exerciseFrequency === 'None') score -= 20;
    if (data.lifestyle.sleepHours < 6) score -= 10;
    if (data.lifestyle.stressLevel > 3) score -= 10;
    return Math.max(0, score);
  };

  const getBiometricScore = () => {
    let score = 100;
    if (data.bmi > 25) score -= 15;
    if (data.bmi > 30) score -= 15;
    if (data.vitals.systolicBP && data.vitals.systolicBP > 130) score -= 15;
    return Math.max(0, score);
  };

  const stats = [
    { label: 'Cardio', value: 100 - risk.cardiovascular.score },
    { label: 'Metabolic', value: 100 - risk.diabetes.score },
    { label: 'Lifestyle', value: getLifestyleScore() },
    { label: 'Biometrics', value: getBiometricScore() },
    { label: 'Family', value: data.familyHistory.heartDisease || data.familyHistory.diabetes ? 60 : 100 }, // Genetic luck
  ];

  // SVG Config
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const angleStep = (Math.PI * 2) / stats.length;

  const getCoordinates = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2; // Start at top
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return [x, y];
  };

  const points = stats.map((stat, i) => getCoordinates(stat.value, i)).map(p => p.join(',')).join(' ');
  const bgPoints = stats.map((_, i) => getCoordinates(100, i)).map(p => p.join(',')).join(' ');
  const midPoints = stats.map((_, i) => getCoordinates(50, i)).map(p => p.join(',')).join(' ');

  return (
    <div className="flex flex-col items-center justify-center animate-fade-in">
      <div className="relative">
        <svg width={size} height={size} className="overflow-visible">
          {/* Background Web */}
          <polygon points={bgPoints} fill="rgba(30, 41, 59, 0.5)" stroke="#334155" strokeWidth="1" />
          <polygon points={midPoints} fill="transparent" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Axis Lines */}
          {stats.map((_, i) => {
            const [x, y] = getCoordinates(100, i);
            return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#334155" strokeWidth="1" />;
          })}

          {/* Data Shape */}
          <polygon 
            points={points} 
            fill="rgba(6, 182, 212, 0.2)" 
            stroke="#06b6d4" 
            strokeWidth="3" 
            className="drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000 ease-out"
          />
          
          {/* Labels */}
          {stats.map((stat, i) => {
            const [x, y] = getCoordinates(115, i);
            return (
              <text 
                key={i} 
                x={x} 
                y={y} 
                textAnchor="middle" 
                dominantBaseline="middle" 
                fill="#94a3b8" 
                fontSize="12" 
                fontWeight="bold"
                className="uppercase tracking-wider"
              >
                {stat.label}
              </text>
            );
          })}

          {/* Data Dots */}
          {stats.map((stat, i) => {
             const [x, y] = getCoordinates(stat.value, i);
             return (
               <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke="#06b6d4" strokeWidth="2" />
             );
          })}
        </svg>
      </div>
      <div className="mt-4 text-center">
        <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-widest">Health Balance Radar</h4>
        <p className="text-xs text-gray-500">Outer edge = Optimal Health</p>
      </div>
    </div>
  );
};

export default HealthRadar;