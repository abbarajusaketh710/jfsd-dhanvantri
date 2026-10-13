import React from 'react';
import { SymptomsData } from '../../types';

interface Props {
  data: SymptomsData;
  updateData: (data: Partial<SymptomsData>) => void;
}

const SYMPTOM_LIST = [
  { id: 'frequent_urination', label: 'Frequent Urination', category: 'Diabetes' },
  { id: 'excessive_thirst', label: 'Excessive Thirst', category: 'Diabetes' },
  { id: 'blurred_vision', label: 'Blurred Vision', category: 'Diabetes' },
  { id: 'fatigue', label: 'Chronic Fatigue', category: 'General' },
  { id: 'headaches', label: 'Frequent Headaches', category: 'Hypertension' },
  { id: 'dizziness', label: 'Dizziness', category: 'Hypertension' },
  { id: 'chest_pain', label: 'Chest Pain/Discomfort', category: 'Cardiovascular' },
  { id: 'shortness_breath', label: 'Shortness of Breath', category: 'Cardiovascular' },
  { id: 'palpitations', label: 'Heart Palpitations', category: 'Cardiovascular' },
];

const SymptomsForm: React.FC<Props> = ({ data, updateData }) => {
  const toggleSymptom = (id: string) => {
    const current = data.selectedSymptoms;
    if (current.includes(id)) {
      updateData({ selectedSymptoms: current.filter(s => s !== id) });
    } else {
      updateData({ selectedSymptoms: [...current, id] });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-semibold text-cyan-400 mb-4">Symptoms Check</h2>
      <p className="text-gray-400 text-sm mb-4">Select any symptoms you have experienced recently.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SYMPTOM_LIST.map((symptom) => (
            <div 
                key={symptom.id}
                onClick={() => toggleSymptom(symptom.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-center justify-between
                    ${data.selectedSymptoms.includes(symptom.id) 
                        ? 'bg-cyan-900/30 border-cyan-500 text-cyan-100' 
                        : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-800'}`}
            >
                <span>{symptom.label}</span>
                {data.selectedSymptoms.includes(symptom.id) && (
                    <span className="text-cyan-400">✓</span>
                )}
            </div>
        ))}
      </div>
      
      {data.selectedSymptoms.length === 0 && (
          <div className="mt-4 text-center text-gray-500 italic text-sm">
              No symptoms selected (Healthy)
          </div>
      )}
    </div>
  );
};

export default SymptomsForm;
