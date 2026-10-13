import React from 'react';
import { LifestyleData, DietType } from '../../types';

interface Props {
  data: LifestyleData;
  updateData: (data: Partial<LifestyleData>) => void;
}

const LifestyleForm: React.FC<Props> = ({ data, updateData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        updateData({ [name]: checked });
    } else {
        updateData({ [name]: name === 'sleepHours' || name === 'stressLevel' || name === 'waterIntake' ? Number(value) : value });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-semibold text-cyan-400 mb-4">Lifestyle Habits</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <input
                type="checkbox"
                name="smoker"
                checked={data.smoker}
                onChange={handleChange}
                className="w-5 h-5 text-cyan-500 rounded focus:ring-cyan-500 bg-gray-700 border-gray-600"
            />
            <label className="text-gray-200">Do you smoke?</label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Alcohol Consumption</label>
                <select name="alcohol" value={data.alcohol} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white outline-none">
                    <option value="None">None</option>
                    <option value="Occasional">Occasional</option>
                    <option value="Frequent">Frequent</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Exercise Frequency</label>
                <select name="exerciseFrequency" value={data.exerciseFrequency} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white outline-none">
                    <option value="None">None</option>
                    <option value="1-2 days">1-2 days/week</option>
                    <option value="3-4 days">3-4 days/week</option>
                    <option value="5+ days">5+ days/week</option>
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Diet Type</label>
                <select name="dietType" value={data.dietType} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white outline-none">
                    {Object.values(DietType).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Daily Water Intake (Liters)</label>
                <input type="number" step="0.5" name="waterIntake" value={data.waterIntake} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white outline-none" />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Average Sleep (Hours)</label>
             <input type="range" name="sleepHours" min="3" max="12" value={data.sleepHours} onChange={handleChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
             <div className="text-right text-sm text-cyan-400">{data.sleepHours} hours</div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Stress Level (1-5)</label>
             <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Low</span><span>High</span></div>
             <input type="range" name="stressLevel" min="1" max="5" value={data.stressLevel} onChange={handleChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
             <div className="text-right text-sm text-orange-400">Level: {data.stressLevel}</div>
        </div>

      </div>
    </div>
  );
};

export default LifestyleForm;
