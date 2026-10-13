import React from 'react';
import { FamilyHistoryData } from '../../types';

interface Props {
  data: FamilyHistoryData;
  updateData: (data: Partial<FamilyHistoryData>) => void;
}

const FamilyHistoryForm: React.FC<Props> = ({ data, updateData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    updateData({ [name]: checked });
  };

  const conditions = [
      { key: 'diabetes', label: 'Diabetes' },
      { key: 'hypertension', label: 'Hypertension (High BP)' },
      { key: 'heartDisease', label: 'Heart Disease' },
      { key: 'stroke', label: 'Stroke' },
      { key: 'obesity', label: 'Obesity' },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-semibold text-cyan-400 mb-4">Family History</h2>
      <p className="text-gray-400 text-sm mb-4">Does anyone in your immediate family (parents, siblings) have a history of:</p>
      
      <div className="space-y-3">
        {conditions.map((item) => (
             <div key={item.key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <label className="text-gray-200 flex-1 cursor-pointer" htmlFor={item.key}>{item.label}</label>
                 <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input 
                        type="checkbox" 
                        name={item.key} 
                        id={item.key} 
                        checked={data[item.key as keyof FamilyHistoryData]}
                        onChange={handleChange}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out transform checked:translate-x-full checked:border-cyan-500"
                    />
                    <label htmlFor={item.key} className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${data[item.key as keyof FamilyHistoryData] ? 'bg-cyan-500' : 'bg-gray-600'}`}></label>
                </div>
            </div>
        ))}
      </div>
      <style>{`
        .toggle-checkbox:checked {
            right: 0;
            border-color: #06b6d4;
        }
        .toggle-checkbox:checked + .toggle-label {
            background-color: #06b6d4;
        }
      `}</style>
    </div>
  );
};

export default FamilyHistoryForm;
