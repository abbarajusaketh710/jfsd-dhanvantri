import { HealthData, RiskLevel, RiskResult, OverallRiskAssessment } from '../types';

export class HealthRiskCalculator {
  
  private static getRiskLevel(score: number): RiskLevel {
    if (score < 30) return RiskLevel.Low;
    if (score < 60) return RiskLevel.Moderate;
    if (score < 85) return RiskLevel.High;
    return RiskLevel.VeryHigh;
  }

  public static calculateDiabetesRisk(data: HealthData): RiskResult {
    let score = 0;
    const factors: string[] = [];
    const recommendations: string[] = [];

    // Age
    if (data.personalInfo.age > 45) {
      score += 20;
      factors.push('Age over 45');
    }

    // BMI
    if (data.bmi > 25) {
      score += 20;
      factors.push(`Elevated BMI (${data.bmi.toFixed(1)})`);
    } else if (data.bmi > 30) {
      score += 40;
      factors.push(`High BMI (${data.bmi.toFixed(1)})`);
    }

    // Family History
    if (data.familyHistory.diabetes) {
      score += 20;
      factors.push('Family history of diabetes');
    }

    // Lifestyle
    if (data.lifestyle.exerciseFrequency === 'None' || data.lifestyle.exerciseFrequency === '1-2 days') {
      score += 15;
      factors.push('Sedentary lifestyle');
    }

    // Symptoms
    const diabetesSymptoms = ['frequent_urination', 'excessive_thirst', 'blurred_vision', 'fatigue'];
    const symptomCount = data.symptoms.selectedSymptoms.filter(s => diabetesSymptoms.includes(s)).length;
    if (symptomCount > 0) {
      score += symptomCount * 10;
      factors.push(`Reported ${symptomCount} diabetes-related symptoms`);
    }

    // Vitals
    if (data.vitals.glucose && data.vitals.glucose > 100) {
      score += 30;
      factors.push('Elevated fasting glucose');
    }

    score = Math.min(score, 100);
    const level = this.getRiskLevel(score);

    if (level !== RiskLevel.Low) {
      recommendations.push('Monitor blood sugar levels regularly.');
      recommendations.push('Reduce sugar and refined carb intake.');
    } else {
        recommendations.push('Maintain a balanced diet to keep risk low.');
    }

    return { score, level, factors, recommendations };
  }

  public static calculateHypertensionRisk(data: HealthData): RiskResult {
    let score = 0;
    const factors: string[] = [];
    const recommendations: string[] = [];

    if (data.personalInfo.age > 50) {
        score += 15;
        factors.push('Age over 50');
    }

    if (data.bmi > 25) {
        score += 15;
        factors.push('Overweight/Obese');
    }

    if (data.familyHistory.hypertension) {
        score += 20;
        factors.push('Family history of hypertension');
    }

    if (data.lifestyle.smoker) {
        score += 25;
        factors.push('Smoking habit');
    }

    if (data.lifestyle.alcohol === 'Frequent') {
        score += 15;
        factors.push('Frequent alcohol consumption');
    }

    if (data.lifestyle.stressLevel >= 4) {
        score += 20;
        factors.push('High stress levels');
    }

    if (data.vitals.systolicBP && data.vitals.systolicBP > 120) {
        score += 30;
        factors.push(`Elevated Systolic BP (${data.vitals.systolicBP})`);
    }

    score = Math.min(score, 100);
    const level = this.getRiskLevel(score);

    if (level !== RiskLevel.Low) {
        recommendations.push('Reduce sodium intake immediately.');
        recommendations.push('Practice stress-reduction techniques like meditation.');
    }

    return { score, level, factors, recommendations };
  }

  public static calculateCardiovascularRisk(data: HealthData, diabetesRisk: RiskResult, hypertensionRisk: RiskResult): RiskResult {
    let score = 0;
    const factors: string[] = [];
    const recommendations: string[] = [];

    // Base risk from other conditions
    score += diabetesRisk.score * 0.3;
    score += hypertensionRisk.score * 0.3;

    if (data.familyHistory.heartDisease || data.familyHistory.stroke) {
        score += 25;
        factors.push('Family history of CVD');
    }

    if (data.lifestyle.smoker) {
        score += 30;
        factors.push('Smoking (High Impact)');
    }

    if (data.vitals.cholesterol && data.vitals.cholesterol > 200) {
        score += 30;
        factors.push('High Cholesterol');
    }

    if (data.lifestyle.exerciseFrequency === 'None') {
        score += 15;
        factors.push('Lack of physical activity');
    }

    score = Math.min(score, 100);
    const level = this.getRiskLevel(score);

    if (level !== RiskLevel.Low) {
        recommendations.push('Engage in cardiovascular exercises (walking, swimming).');
        recommendations.push('Consult a cardiologist for a lipid profile check.');
    }

    return { score, level, factors, recommendations };
  }

  public static calculateOverallRisk(data: HealthData): OverallRiskAssessment {
    const diabetes = this.calculateDiabetesRisk(data);
    const hypertension = this.calculateHypertensionRisk(data);
    const cardiovascular = this.calculateCardiovascularRisk(data, diabetes, hypertension);

    const weightedScore = (diabetes.score + hypertension.score + cardiovascular.score) / 3;
    const overallLevel = this.getRiskLevel(weightedScore);

    const overall: RiskResult = {
        score: Math.round(weightedScore),
        level: overallLevel,
        factors: [...new Set([...diabetes.factors, ...hypertension.factors, ...cardiovascular.factors])],
        recommendations: ['Prioritize annual health checkups.', 'Focus on holistic lifestyle improvements.'],
    };

    return {
        diabetes,
        hypertension,
        cardiovascular,
        overall
    };
  }
}
