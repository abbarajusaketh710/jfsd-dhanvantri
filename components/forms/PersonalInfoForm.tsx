import React from 'react';
import { PersonalInfo, Gender } from '../../types';

interface Props {
  data: PersonalInfo;
  updateData: (data: Partial<PersonalInfo>) => void;
}

const PersonalInfoForm: React.FC<Props> = ({ data, updateData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: name === 'age' || name === 'height' || name === 'weight' ? Number(value) : value });
  };

  const calculateBMI = () => {
    if (data.height && data.weight) {
      const heightInMeters = data.height / 100;
      return (data.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
  };

  const bmi = calculateBMI();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold text-cyan-400 mb-1">Personal Information</h2>
        <p className="text-gray-400 text-sm">Let's start with the basics to establish your baseline.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Age <span className="text-red-400">*</span></label>
          <input
            type="number"
            name="age"
            value={data.age || ''}
            onChange={handleChange}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition"
            placeholder="Years"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Gender <span className="text-red-400">*</span></label>
          <select
            name="gender"
            value={data.gender}
            onChange={handleChange}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition"
          >
            {Object.values(Gender).map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Height (cm) <span className="text-red-400">*</span></label>
          <input
            type="number"
            name="height"
            value={data.height || ''}
            onChange={handleChange}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition"
            placeholder="e.g. 175"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Weight (kg) <span className="text-red-400">*</span></label>
          <input
            type="number"
            name="weight"
            value={data.weight || ''}
            onChange={handleChange}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition"
            placeholder="e.g. 70"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Occupation <span className="text-red-400">*</span></label>
          <input
            type="text"
            name="occupation"
            value={data.occupation}
            onChange={handleChange}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition"
            placeholder="e.g. Software Engineer"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Location <span className="text-red-400">*</span></label>
          <input
            type="text"
            name="location"
            value={data.location}
            onChange={handleChange}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition"
            placeholder="City, Country"
            required
          />
        </div>
      </div>

      {bmi && (
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600 flex items-center justify-between animate-fade-in">
          <span className="text-gray-300">Calculated BMI:</span>
          <div className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${Number(bmi) > 25 ? 'text-orange-400' : 'text-emerald-400'}`}>
                {bmi}
            </span>
            <span className="text-xs text-gray-500">
                {Number(bmi) < 18.5 ? '(Underweight)' : Number(bmi) < 25 ? '(Normal)' : '(Overweight)'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoForm;