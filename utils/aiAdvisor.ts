import { GoogleGenAI } from "@google/genai";
import { HealthData, OverallRiskAssessment } from '../types';

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates an executive clinical summary using Gemini 2.5 Flash,
 * with robust clinical fallback if API key is unconfigured or rate-limited.
 */
export const generateAIHealthSummary = async (data: HealthData, risk: OverallRiskAssessment): Promise<string> => {
  const fallbackSummary = () => {
    const primaryFactor = risk.overall.factors[0] || "sedentary lifestyle";
    const bpStr = data.vitals.systolicBP && data.vitals.diastolicBP ? `${data.vitals.systolicBP}/${data.vitals.diastolicBP} mmHg` : "unrecorded BP";
    const glucoseStr = data.vitals.glucose ? `${data.vitals.glucose} mg/dL` : "baseline fasting glucose";
    
    return `Your clinical evaluation reveals a ${risk.overall.level.toLowerCase()} overall risk profile (Score: ${risk.overall.score}/100), predominantly driven by ${primaryFactor} alongside a BMI of ${data.bmi.toFixed(1)} and current vitals (${bpStr}, ${glucoseStr}). Proactively addressing this with daily 25-minute Zone 2 cardiovascular movement and sodium-moderated Mediterranean nutrition will directly reverse vascular strain. Small, consistent 1% daily modifications now protect arterial longevity and metabolic resilience for decades ahead.`;
  };

  if (!apiKey) {
    return fallbackSummary();
  }

  try {
    const prompt = `
      You are the Dhanvantri AI Chief Medical Architect.
      Analyze this clinical profile for a ${data.personalInfo.age}-year-old ${data.personalInfo.gender} (${data.personalInfo.occupation || 'Standard profession'}):
      
      - Biometrics: BMI ${data.bmi.toFixed(1)}, Resting Heart Rate ${data.vitals.heartRate || 'N/A'} bpm, Blood Pressure ${data.vitals.systolicBP || 'N/A'}/${data.vitals.diastolicBP || 'N/A'} mmHg, Fasting Glucose ${data.vitals.glucose || 'N/A'} mg/dL, Total Cholesterol ${data.vitals.cholesterol || 'N/A'} mg/dL.
      - Lifestyle: Smoking: ${data.lifestyle.smoker}, Alcohol: ${data.lifestyle.alcohol}, Exercise: ${data.lifestyle.exerciseFrequency}, Diet: ${data.lifestyle.dietType}, Sleep: ${data.lifestyle.sleepHours} hrs, Stress: ${data.lifestyle.stressLevel}/5, Water: ${data.lifestyle.waterIntake}L.
      - Symptoms: ${data.symptoms.selectedSymptoms.join(', ') || 'None reported'}.
      - Family History: Diabetes: ${data.familyHistory.diabetes}, Hypertension: ${data.familyHistory.hypertension}, Heart Disease: ${data.familyHistory.heartDisease}.
      - Risk Assessment: Overall: ${risk.overall.level} (${risk.overall.score}/100), Diabetes: ${risk.diabetes.level}, Hypertension: ${risk.hypertension.level}, CVD: ${risk.cardiovascular.level}.
      - Key Risk Factors: ${risk.overall.factors.join(', ')}.

      Provide a high-impact, empathetic 3-to-4 sentence executive clinical consultation:
      1. Sentence 1: Honest, clear assessment of their current physiological status without alarming them.
      2. Sentence 2: Explain the direct mechanistic link between their lifestyle habits and their highest calculated risk.
      3. Sentence 3: State the single most impactful, immediate action they can take today to move their score towards 'Low'.
      4. Sentence 4: A short, memorable psychological encouragement.
      Keep it professional, evidence-based, and around 70-85 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || fallbackSummary();
  } catch (error) {
    console.warn("Gemini generation fallback used:", error);
    return fallbackSummary();
  }
};

/**
 * Generates an on-demand AI answer for personalized wellness questions.
 */
export const queryAIAdvisor = async (
  question: string, 
  data: HealthData, 
  risk: OverallRiskAssessment
): Promise<string> => {
  if (!apiKey) {
    return "Based on your clinical markers, maintaining a heart-healthy diet low in refined carbohydrates, keeping your blood pressure under 120/80 mmHg, and adhering to 150 minutes of moderate activity weekly are your top priorities.";
  }

  try {
    const prompt = `
      You are the Dhanvantri AI Health Advisor.
      User Profile: ${data.personalInfo.age}yo ${data.personalInfo.gender}, BMI ${data.bmi.toFixed(1)}, BP ${data.vitals.systolicBP || '--'}/${data.vitals.diastolicBP || '--'}, Glucose ${data.vitals.glucose || '--'}, Overall Risk: ${risk.overall.level}.
      
      User Question: "${question}"
      
      Provide a concise, practical, clinically grounded 2-3 paragraph answer tailored directly to their metrics. Include a brief reminder to consult their personal physician.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Consult your physician for personalized medical advice.";
  } catch (error) {
    console.error("AI Query Error:", error);
    return "Our AI Advisor is momentarily unavailable. Please follow the structured guidelines in your recommendations tab.";
  }
};