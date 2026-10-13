
import React from 'react';
import { Brain, Activity, Database, ShieldCheck, ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
  onViewUML?: () => void;
}

const Methodology: React.FC<Props> = ({ onBack, onViewUML }) => {
  const steps = [
    {
      icon: Database,
      title: "1. Data Collection & Normalization",
      desc: "We aggregate user inputs across 5 dimensions: Demographics, Vitals, Lifestyle, Symptoms, and Family History. Data is normalized (e.g., converting height/weight to BMI) to match clinical dataset standards."
    },
    {
      icon: Brain,
      title: "2. Rule-Based Inference Engine",
      desc: "Our engine applies weighted clinical guidelines (ADA, AHA, JNC-8 standards). For example, a combination of 'High BMI' + 'Sedentary Lifestyle' + 'Family History' triggers a specific multiplier for Diabetes risk."
    },
    {
      icon: Activity,
      title: "3. Multi-Factor Risk Scoring",
      desc: "Risks are not isolated. Dhanvantri calculates a 'Cardiovascular Aggregate' by checking the interplay between Hypertension and Diabetes scores, increasing the risk level if co-morbidities are detected."
    },
    {
      icon: ShieldCheck,
      title: "4. Personalized Recommendation Mapping",
      desc: "Outputs are mapped to a database of lifestyle interventions. If 'Stress' is high, the engine prioritizes Mindfulness in the plan. If 'Diabetes Risk' is high, it swaps the Diet Plan to Low-Glycemic Index."
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-fade-in text-white">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white transition mb-4 text-xs font-semibold">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </button>
          <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400 mb-2">
            How Dhanvantri Works
          </h1>
          <p className="text-lg text-gray-300">Transparent, Explainable AI for Clinical Health Prediction.</p>
        </div>

        {onViewUML && (
          <button
            onClick={onViewUML}
            className="flex items-center px-4 py-2.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-semibold text-xs transition shadow-lg"
          >
            Explore UML Architecture & Specs →
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {steps.map((step, idx) => (
            <div key={idx} className="bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
                <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-800 rounded-xl border border-gray-700">
                        <step.icon className="w-7 h-7 text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">{step.desc}</p>
                    </div>
                </div>
            </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/20 rounded-2xl">
        <h3 className="text-lg font-bold text-blue-300 mb-2">Medical Disclaimer</h3>
        <p className="text-sm text-blue-200/80 leading-relaxed">
            Dhanvantri is an AI-powered educational tool and does not provide medical diagnosis or treatment. The risk scores are statistical estimates based on provided data. Always consult a qualified healthcare professional for medical advice.
        </p>
      </div>
    </div>
  );
};

export default Methodology;
