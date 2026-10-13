import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ArrowLeft, 
  Layers, 
  GitBranch, 
  Box, 
  Workflow, 
  Sparkles, 
  Download, 
  FileCode,
  Share2
} from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const MASTER_UML_PROMPT = `Act as a Principal Software Architect. Generate complete, production-grade UML diagrams (Class Diagram, Sequence Diagram, Component Architecture Diagram, and Activity/State Diagram) for the Dhanvantri AI Health Platform.

=== SYSTEM SPECIFICATION ===
Application: Dhanvantri - Comprehensive AI Health Risk Prediction & Management Platform
Stack: React 19, TypeScript, Vite, Tailwind CSS, Google Gemini 2.5 Flash API (@google/genai)

1. DOMAIN MODELS & TYPES:
- Gender: Enum { Male, Female, Other }
- DietType: Enum { Vegetarian, NonVegetarian, Vegan }
- RiskLevel: Enum { Low, Moderate, High, VeryHigh }
- PersonalInfo: { age: number, gender: Gender, height: number (cm), weight: number (kg), occupation: string, location: string }
- LifestyleData: { smoker: boolean, alcohol: string, exerciseFrequency: string, dietType: DietType, sleepHours: number, stressLevel: number (1-5), waterIntake: number }
- SymptomsData: { selectedSymptoms: string[] }
- FamilyHistoryData: { diabetes: boolean, hypertension: boolean, heartDisease: boolean, stroke: boolean, obesity: boolean }
- VitalsData: { systolicBP?: number, diastolicBP?: number, heartRate?: number, glucose?: number, cholesterol?: number }
- HealthData: Aggregate of PersonalInfo, LifestyleData, SymptomsData, FamilyHistoryData, VitalsData, and computed bmi: number.
- RiskResult: { score: number (0-100), level: RiskLevel, factors: string[], recommendations: string[] }
- OverallRiskAssessment: { diabetes: RiskResult, hypertension: RiskResult, cardiovascular: RiskResult, overall: RiskResult }
- DietMacros: { carbs: number, protein: number, fat: number, fiber: number, hydrationLiters: number }
- DietPlan: { type: string, calories: number, macros?: DietMacros, superfoods?: string[], foodsToAvoid?: string[], restrictions: string[], meals: { breakfast, midMorning, lunch, eveningSnack, dinner }, nutritionTips: string[] }
- WorkoutPlan: { level: string, frequency: string, durationPerSession: string, targetHeartRateZone?: string, schedule: string[], weeklySplit?: DayWorkoutSchedule[], exercises: Exercise[], safetyGuidelines: string[] }
- LifestyleChange: { id?: string, category: string, title: string, description: string, actionSteps: string[], timeline: string, impactPriority?: string }
- DailyHabit: { id: string, label: string, frequency: string, category: string, completed?: boolean }
- FullRecommendation: { diet: DietPlan, workout: WorkoutPlan, lifestyle: LifestyleChange[], dailyHabits?: DailyHabit[], clinicalNotes?: string[] }

2. CORE ENGINES & SERVICES:
- HealthRiskCalculator:
  + calculateDiabetesRisk(data: HealthData): RiskResult
  + calculateHypertensionRisk(data: HealthData): RiskResult
  + calculateCardiovascularRisk(data: HealthData, diabetes: RiskResult, hypertension: RiskResult): RiskResult
  + calculateOverallRisk(data: HealthData): OverallRiskAssessment
- RecommendationEngine:
  + calculateCaloricNeeds(data: HealthData, risk: OverallRiskAssessment): { calories, bmr, tdee }
  + generateDietPlan(risk: OverallRiskAssessment, data: HealthData): DietPlan
  + generateWorkoutPlan(risk: OverallRiskAssessment, data: HealthData): WorkoutPlan
  + generateLifestyleChanges(risk: OverallRiskAssessment, data: HealthData): LifestyleChange[]
  + generateDailyHabits(data: HealthData, risk: OverallRiskAssessment): DailyHabit[]
  + getDetailedRecommendations(risk: OverallRiskAssessment, data: HealthData): FullRecommendation
- AiAdvisorService:
  + generateAIHealthSummary(data: HealthData, risk: OverallRiskAssessment): Promise<string>
  + queryAIAdvisor(question: string, data: HealthData, risk: OverallRiskAssessment): Promise<string>

3. UI COMPONENT HIERARCHY:
- App (Root state: currentView, healthData, riskAssessment)
  ├── NavigationBar
  ├── LandingView (Hero, FeatureGrid, QuickDemo)
  ├── HealthAssessment (Form wizard: PersonalInfoForm -> LifestyleForm -> SymptomsForm -> FamilyHistoryForm -> VitalsForm -> BiometricAnalyzer)
  ├── RiskDashboard (HealthRadar, RiskMetricsGrid, RiskSimulator, AiInsightCard, ClinicActionBanner)
  │     └── DetailedRecommendations (DietPlanView, WorkoutScheduleView, LifestyleProtocols, HabitTracker)
  ├── ClinicFinder (Geolocation, SpecialistsMap, Ratings & Contact)
  └── Methodology & ArchitectureView (Explainable AI & UML Specifications)

=== OUTPUT REQUIREMENTS ===
Please render:
1. PlantUML Class Diagram showing full associations, aggregations, methods, and visibility markers.
2. Mermaid.js Sequence Diagram detailing: User -> Form Input -> Vitals Normalization -> Risk Calculator -> Recommendation Engine -> Gemini API call -> Dashboard Display.
3. Component Architecture Diagram showing data flow between UI, state management, calculation layers, and external Gemini LLM APIs.
4. State Machine Diagram representing the assessment workflow transitions.`;

const MERMAID_CLASS_DIAGRAM = `classDiagram
    direction TB
    class App {
      -View currentView
      -HealthData healthData
      -OverallRiskAssessment riskAssessment
      +handleAssessmentComplete(data)
      +startDemo()
      +resetApp()
    }

    class HealthData {
      +PersonalInfo personalInfo
      +LifestyleData lifestyle
      +SymptomsData symptoms
      +FamilyHistoryData familyHistory
      +VitalsData vitals
      +number bmi
    }

    class VitalsData {
      +number systolicBP
      +number diastolicBP
      +number heartRate
      +number glucose
      +number cholesterol
    }

    class HealthRiskCalculator {
      <<service>>
      +calculateDiabetesRisk(data) RiskResult
      +calculateHypertensionRisk(data) RiskResult
      +calculateCardiovascularRisk(data, d, h) RiskResult
      +calculateOverallRisk(data) OverallRiskAssessment
    }

    class RecommendationEngine {
      <<service>>
      +calculateCaloricNeeds(data, risk) CaloricTarget
      +generateDietPlan(risk, data) DietPlan
      +generateWorkoutPlan(risk, data) WorkoutPlan
      +generateLifestyleChanges(risk, data) LifestyleChange[]
      +generateDailyHabits(data, risk) DailyHabit[]
      +getDetailedRecommendations(risk, data) FullRecommendation
    }

    class AiAdvisor {
      <<service>>
      -GoogleGenAI ai
      +generateAIHealthSummary(data, risk) Promise~string~
      +queryAIAdvisor(question, data, risk) Promise~string~
    }

    class OverallRiskAssessment {
      +RiskResult diabetes
      +RiskResult hypertension
      +RiskResult cardiovascular
      +RiskResult overall
    }

    class FullRecommendation {
      +DietPlan diet
      +WorkoutPlan workout
      +LifestyleChange[] lifestyle
      +DailyHabit[] dailyHabits
      +string[] clinicalNotes
    }

    App --> HealthData
    App --> OverallRiskAssessment
    App ..> HealthRiskCalculator : calculates
    App ..> RecommendationEngine : synthesizes
    App ..> AiAdvisor : invokes Gemini
    HealthData *-- VitalsData
    HealthRiskCalculator ..> OverallRiskAssessment : produces
    RecommendationEngine ..> FullRecommendation : generates`;

const MERMAID_SEQUENCE_DIAGRAM = `sequenceDiagram
    autonumber
    actor User as Patient/User
    participant UI as HealthAssessment Wizard
    participant VF as VitalsForm (Step 5)
    participant Calc as HealthRiskCalculator
    participant Engine as RecommendationEngine
    participant Gemini as Google Gemini 2.5 Flash API
    participant Dash as RiskDashboard

    User->>UI: Enter Demographics, Lifestyle, Symptoms & Family History
    UI->>VF: Advance to Step 5 (Vitals Check)
    User->>VF: Input BP (135/88), Glucose (105), Pulse (78), Chol (210)
    VF-->>UI: Normalized VitalsData
    User->>UI: Click "Analyze Health"
    UI->>Calc: calculateOverallRisk(HealthData)
    Calc->>Calc: Check ADA/AHA clinical rules & co-morbidities
    Calc-->>UI: OverallRiskAssessment (Scores & RiskLevels)
    UI->>Engine: getDetailedRecommendations(Risk, HealthData)
    Engine->>Engine: Calculate BMR, TDEE, Macros, 7-Day Split & Habits
    Engine-->>UI: FullRecommendation
    UI->>Gemini: generateAIHealthSummary(HealthData, Risk)
    Gemini-->>UI: 3-Sentence Executive Consultation
    UI->>Dash: Mount RiskDashboard with Radar, Scores & Plans
    Dash-->>User: Render Interactive Analysis & Habit Tracker`;

const PLANTUML_CODE = `@startuml Dhanvantri_Architecture
skinparam backgroundColor #0F172A
skinparam handwritten false
skinparam monochrome false
skinparam roundcorner 12
skinparam class {
    BackgroundColor #1E293B
    ArrowColor #22D3EE
    BorderColor #38BDF8
    FontColor #F8FAFC
}

enum RiskLevel {
  Low
  Moderate
  High
  VeryHigh
}

class HealthData {
  +PersonalInfo personalInfo
  +LifestyleData lifestyle
  +SymptomsData symptoms
  +FamilyHistoryData familyHistory
  +VitalsData vitals
  +Float bmi
}

class VitalsData {
  +Integer systolicBP
  +Integer diastolicBP
  +Integer heartRate
  +Integer glucose
  +Integer cholesterol
}

class HealthRiskCalculator {
  +calculateDiabetesRisk(data): RiskResult
  +calculateHypertensionRisk(data): RiskResult
  +calculateCardiovascularRisk(data, d, h): RiskResult
  +calculateOverallRisk(data): OverallRiskAssessment
}

class RecommendationEngine {
  +generateDietPlan(risk, data): DietPlan
  +generateWorkoutPlan(risk, data): WorkoutPlan
  +generateLifestyleChanges(risk, data): List<LifestyleChange>
  +getDetailedRecommendations(risk, data): FullRecommendation
}

class GeminiAiAdvisor {
  -GoogleGenAI aiClient
  +generateAIHealthSummary(data, risk): String
  +queryAIAdvisor(prompt, data, risk): String
}

HealthData *-- VitalsData
HealthRiskCalculator ..> HealthData : analyzes
RecommendationEngine ..> HealthData : tailors
RecommendationEngine ..> OverallRiskAssessment : references
GeminiAiAdvisor ..> HealthData : prompts
@enduml`;

export const UMLArchitecture: React.FC<Props> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'class' | 'sequence' | 'plantuml'>('prompt');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-fade-in text-white space-y-6">
      
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
        <div>
          <button 
            onClick={onBack} 
            className="flex items-center text-xs font-semibold text-gray-400 hover:text-cyan-400 transition mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Application
          </button>
          <div className="flex items-center space-x-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
              UML & Architecture Blueprint
            </h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Official architectural models, UML generator prompt, and data flow specifications for Dhanvantri.
          </p>
        </div>

        {/* Global Copy Prompt Action */}
        <button
          onClick={() => copyToClipboard(MASTER_UML_PROMPT, 'master-prompt')}
          className="flex items-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg transition transform hover:-translate-y-0.5"
        >
          {copied === 'master-prompt' ? (
            <>
              <Check className="w-4 h-4 mr-2 text-emerald-300" /> Copied UML Prompt!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" /> Copy Master UML Prompt
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-gray-900/90 rounded-2xl border border-gray-800">
        {[
          { id: 'prompt', label: 'Master AI Prompt', icon: Sparkles },
          { id: 'class', label: 'Class Diagram (Mermaid)', icon: Box },
          { id: 'sequence', label: 'Sequence Diagram (Mermaid)', icon: Workflow },
          { id: 'plantuml', label: 'PlantUML Specification', icon: FileCode },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      
      {/* 1. MASTER PROMPT */}
      {activeTab === 'prompt' && (
        <div className="bg-gray-900/70 border border-gray-700/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-cyan-400" /> Master UML Generation Prompt
              </h3>
              <p className="text-xs text-gray-400">
                Paste this prompt into ChatGPT, Claude, Eraser.io, or any AI assistant to render all UML diagrams.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(MASTER_UML_PROMPT, 'prompt-body')}
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 text-xs font-medium text-gray-200 flex items-center transition"
            >
              {copied === 'prompt-body' ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied === 'prompt-body' ? 'Copied' : 'Copy Prompt'}
            </button>
          </div>

          <div className="relative">
            <pre className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-xs text-cyan-100/90 font-mono overflow-x-auto whitespace-pre-wrap max-h-[500px] leading-relaxed">
              {MASTER_UML_PROMPT}
            </pre>
          </div>
        </div>
      )}

      {/* 2. CLASS DIAGRAM */}
      {activeTab === 'class' && (
        <div className="bg-gray-900/70 border border-gray-700/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center">
                <Box className="w-4 h-4 mr-2 text-cyan-400" /> System Class Diagram (Mermaid.js)
              </h3>
              <p className="text-xs text-gray-400">
                Maps relationships between HealthData, RiskCalculators, RecommendationEngine, and UI State.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(MERMAID_CLASS_DIAGRAM, 'mermaid-class')}
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 text-xs font-medium text-gray-200 flex items-center transition"
            >
              {copied === 'mermaid-class' ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied === 'mermaid-class' ? 'Copied' : 'Copy Mermaid Code'}
            </button>
          </div>

          <pre className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-xs text-emerald-200 font-mono overflow-x-auto whitespace-pre-wrap max-h-[500px]">
            {MERMAID_CLASS_DIAGRAM}
          </pre>
        </div>
      )}

      {/* 3. SEQUENCE DIAGRAM */}
      {activeTab === 'sequence' && (
        <div className="bg-gray-900/70 border border-gray-700/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center">
                <Workflow className="w-4 h-4 mr-2 text-cyan-400" /> Assessment-to-Consultation Sequence
              </h3>
              <p className="text-xs text-gray-400">
                Chronological execution flow across Patient, Vitals Form, Rule Engine, and Gemini LLM.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(MERMAID_SEQUENCE_DIAGRAM, 'mermaid-seq')}
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 text-xs font-medium text-gray-200 flex items-center transition"
            >
              {copied === 'mermaid-seq' ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied === 'mermaid-seq' ? 'Copied' : 'Copy Sequence Code'}
            </button>
          </div>

          <pre className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-xs text-blue-200 font-mono overflow-x-auto whitespace-pre-wrap max-h-[500px]">
            {MERMAID_SEQUENCE_DIAGRAM}
          </pre>
        </div>
      )}

      {/* 4. PLANTUML */}
      {activeTab === 'plantuml' && (
        <div className="bg-gray-900/70 border border-gray-700/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center">
                <FileCode className="w-4 h-4 mr-2 text-cyan-400" /> PlantUML Source Specification
              </h3>
              <p className="text-xs text-gray-400">
                Ready for compilation in PlantText, VS Code PlantUML extension, or IntelliJ.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(PLANTUML_CODE, 'plantuml')}
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 text-xs font-medium text-gray-200 flex items-center transition"
            >
              {copied === 'plantuml' ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied === 'plantuml' ? 'Copied' : 'Copy PlantUML'}
            </button>
          </div>

          <pre className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-xs text-purple-200 font-mono overflow-x-auto whitespace-pre-wrap max-h-[500px]">
            {PLANTUML_CODE}
          </pre>
        </div>
      )}

      {/* How to use info */}
      <div className="bg-gray-800/40 border border-gray-700/60 p-5 rounded-2xl">
        <h4 className="text-sm font-bold text-white mb-2">How to Render These Diagrams:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-300">
          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800">
            <strong className="text-cyan-400 block mb-1">Option 1: Mermaid Live Editor</strong>
            Copy the Mermaid code and paste it into <span className="font-mono text-white">mermaid.live</span> for instant SVG/PNG export.
          </div>
          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800">
            <strong className="text-emerald-400 block mb-1">Option 2: PlantText / Graphviz</strong>
            Copy the PlantUML specification and paste it into <span className="font-mono text-white">planttext.com</span> to generate clinical architectures.
          </div>
          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800">
            <strong className="text-purple-400 block mb-1">Option 3: ChatGPT / Claude</strong>
            Copy the Master AI Prompt into any modern LLM to produce customized documentation, ER diagrams, or code scaffolds.
          </div>
        </div>
      </div>

    </div>
  );
};

export default UMLArchitecture;
