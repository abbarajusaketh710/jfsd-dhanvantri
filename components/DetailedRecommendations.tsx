import React, { useState, useEffect } from 'react';
import { FullRecommendation, DietMeal, DailyHabit, DayWorkoutSchedule } from '../types';
import { 
  Utensils, 
  Dumbbell, 
  Moon, 
  Clock, 
  Flame, 
  ShieldAlert, 
  CheckSquare, 
  Square, 
  Sparkles, 
  Droplets, 
  Apple, 
  Heart, 
  Calendar, 
  Download, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

interface Props {
  recommendations: FullRecommendation;
  userName?: string;
}

const HABIT_STORAGE_KEY = 'dhanvantri_daily_habits_status';

export const DetailedRecommendations: React.FC<Props> = ({ recommendations, userName = "Patient" }) => {
  const [activeTab, setActiveTab] = useState<'diet' | 'workout' | 'lifestyle' | 'habits'>('diet');
  
  // Daily habit tracker state
  const [completedHabits, setCompletedHabits] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(HABIT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify(completedHabits));
  }, [completedHabits]);

  const toggleHabit = (id: string) => {
    setCompletedHabits(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const { diet, workout, lifestyle, dailyHabits = [], clinicalNotes = [] } = recommendations;

  const totalHabits = dailyHabits.length;
  const completedCount = dailyHabits.filter(h => completedHabits[h.id]).length;
  const habitPercentage = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

  return (
    <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/80 rounded-3xl overflow-hidden shadow-2xl mt-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-800 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Hyper-Personalized Wellness Prescription</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Your Tailored Health Roadmap</h2>
          <p className="text-gray-400 text-xs mt-1">
            Engineered from your specific biometrics, clinical guidelines, and lifestyle profile.
          </p>
        </div>

        {/* Habit Completion Quick Pill */}
        <div className="flex items-center bg-gray-800/80 border border-gray-700 rounded-2xl p-2.5 px-4 space-x-3">
          <div className="text-right">
            <div className="text-xs text-gray-400">Daily Habits</div>
            <div className="text-sm font-bold text-white">{completedCount} of {totalHabits} Done</div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center font-bold text-xs text-emerald-400">
            {habitPercentage}%
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 bg-gray-950/40 overflow-x-auto">
        <button
          onClick={() => setActiveTab('diet')}
          className={`flex-1 min-w-[130px] py-4 text-center font-medium transition-all border-b-2 ${
            activeTab === 'diet' 
              ? 'bg-gray-800/60 text-cyan-400 border-cyan-400 shadow-sm' 
              : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-800/20'
          }`}
        >
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Utensils className="w-4 h-4" />
            <span>Diet & Nutrition</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('workout')}
          className={`flex-1 min-w-[130px] py-4 text-center font-medium transition-all border-b-2 ${
            activeTab === 'workout' 
              ? 'bg-gray-800/60 text-emerald-400 border-emerald-400 shadow-sm' 
              : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-800/20'
          }`}
        >
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Dumbbell className="w-4 h-4" />
            <span>Workout Plan</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('lifestyle')}
          className={`flex-1 min-w-[130px] py-4 text-center font-medium transition-all border-b-2 ${
            activeTab === 'lifestyle' 
              ? 'bg-gray-800/60 text-purple-400 border-purple-400 shadow-sm' 
              : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-800/20'
          }`}
        >
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Moon className="w-4 h-4" />
            <span>Lifestyle Protocols</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('habits')}
          className={`flex-1 min-w-[130px] py-4 text-center font-medium transition-all border-b-2 ${
            activeTab === 'habits' 
              ? 'bg-gray-800/60 text-amber-400 border-amber-400 shadow-sm' 
              : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-800/20'
          }`}
        >
          <div className="flex items-center justify-center space-x-2 text-sm">
            <CheckSquare className="w-4 h-4" />
            <span>Daily Tracker</span>
          </div>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6 md:p-8 animate-fade-in">
        
        {/* ==================== DIET TAB ==================== */}
        {activeTab === 'diet' && (
          <div className="space-y-6">
            {/* Diet Header & Calorie / Macro Target */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 p-6 rounded-2xl border border-gray-700/80 shadow-lg">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    Target Protocol
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-2">{diet.type}</h3>
                  <p className="text-gray-400 text-sm mt-1">Calculated via individual basal metabolism and chronic risk markers.</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-gray-900/80 px-4 py-2.5 rounded-xl border border-gray-700 text-right">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Energy Target</span>
                    <span className="text-xl font-black text-cyan-400 font-mono">{diet.calories}</span>
                    <span className="text-xs text-gray-400 ml-1">kcal/day</span>
                  </div>
                  {diet.macros?.hydrationLiters && (
                    <div className="bg-gray-900/80 px-4 py-2.5 rounded-xl border border-gray-700 text-right">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Hydration</span>
                      <span className="text-xl font-black text-blue-400 font-mono">{diet.macros.hydrationLiters}</span>
                      <span className="text-xs text-gray-400 ml-1">L/day</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Macro Nutrients Breakdown Grid */}
              {diet.macros && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-700/60">
                  <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-700/40">
                    <span className="text-xs text-gray-400 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-amber-400 mr-1.5"></span> Carbs
                    </span>
                    <div className="text-lg font-bold text-white font-mono mt-1">{diet.macros.carbs}g</div>
                    <span className="text-[10px] text-gray-500">Low GI & Complex</span>
                  </div>

                  <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-700/40">
                    <span className="text-xs text-gray-400 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5"></span> Protein
                    </span>
                    <div className="text-lg font-bold text-white font-mono mt-1">{diet.macros.protein}g</div>
                    <span className="text-[10px] text-gray-500">Lean & Bioavailable</span>
                  </div>

                  <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-700/40">
                    <span className="text-xs text-gray-400 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 mr-1.5"></span> Healthy Fats
                    </span>
                    <div className="text-lg font-bold text-white font-mono mt-1">{diet.macros.fat}g</div>
                    <span className="text-[10px] text-gray-500">Omega-3 & MUFA</span>
                  </div>

                  <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-700/40">
                    <span className="text-xs text-gray-400 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-purple-400 mr-1.5"></span> Dietary Fiber
                    </span>
                    <div className="text-lg font-bold text-white font-mono mt-1">{diet.macros.fiber}g</div>
                    <span className="text-[10px] text-gray-500">Gut & Lipid Support</span>
                  </div>
                </div>
              )}
            </div>

            {/* Superfoods & Foods to Avoid Pills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diet.superfoods && diet.superfoods.length > 0 && (
                <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl">
                  <h4 className="text-sm font-bold text-emerald-300 flex items-center mb-2.5">
                    <Apple className="w-4 h-4 mr-1.5" /> High-Priority Therapeutic Superfoods
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {diet.superfoods.map((food, i) => (
                      <span key={i} className="px-3 py-1 text-xs bg-emerald-900/40 text-emerald-200 rounded-lg border border-emerald-500/30">
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-rose-950/20 border border-rose-500/30 p-4 rounded-2xl">
                <h4 className="text-sm font-bold text-rose-300 flex items-center mb-2.5">
                  <ShieldAlert className="w-4 h-4 mr-1.5" /> Inflammatory Triggers to Minimize
                </h4>
                <div className="flex flex-wrap gap-2">
                  {diet.restrictions.map((r, i) => (
                    <span key={i} className="px-3 py-1 text-xs bg-rose-900/40 text-rose-200 rounded-lg border border-rose-500/30">
                      Avoid {r}
                    </span>
                  ))}
                  {diet.foodsToAvoid?.map((fa, i) => (
                    <span key={`fa-${i}`} className="px-3 py-1 text-xs bg-rose-900/30 text-rose-300/90 rounded-lg border border-rose-700/30">
                      {fa}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Meal Plan Cards */}
            <div>
              <h4 className="text-base font-bold text-white mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-cyan-400" /> Complete Daily Meal Blueprint
              </h4>
              <div className="grid gap-4">
                {(Object.entries(diet.meals) as [string, DietMeal][]).map(([key, meal]) => (
                  <div key={key} className="bg-gray-800/40 hover:bg-gray-800/60 transition p-4 rounded-xl border border-gray-700/60">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-white text-base">{meal.name}</h5>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-900/40 text-cyan-300 border border-cyan-600/30 font-medium">
                        Scheduled Portion
                      </span>
                    </div>
                    <ul className="space-y-1 text-sm text-gray-300 mb-3">
                      {meal.food.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 mr-2.5 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="text-xs text-gray-400 italic bg-gray-900/50 p-2.5 rounded-lg border border-gray-800">
                      <strong className="text-cyan-300 not-italic">Clinical Rationale: </strong>
                      {meal.notes}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Guidelines List */}
            <div className="bg-gray-800/30 p-5 rounded-2xl border border-gray-700/60">
              <h4 className="text-sm font-bold text-white mb-3">Core Nutritional Rules for Success</h4>
              <ul className="space-y-2">
                {diet.nutritionTips.map((tip, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ==================== WORKOUT TAB ==================== */}
        {activeTab === 'workout' && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-gray-900 to-teal-950/40 p-6 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Adaptive Fitness Level
                </span>
                <h3 className="text-2xl font-bold text-white mt-2">{workout.level}</h3>
                <p className="text-emerald-400/90 text-sm mt-1">{workout.frequency} • {workout.durationPerSession} per session</p>
              </div>

              {workout.targetHeartRateZone && (
                <div className="bg-gray-900/90 p-4 rounded-2xl border border-emerald-500/30 flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <Heart className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Target Heart Rate</span>
                    <span className="text-sm font-bold text-white font-mono">{workout.targetHeartRateZone}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 7-Day Weekly Training Split */}
            {workout.weeklySplit && (
              <div>
                <h4 className="text-base font-bold text-white mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-emerald-400" /> 7-Day Structured Weekly Split
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {workout.weeklySplit.map((dayPlan, idx) => (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-xl border transition ${
                        dayPlan.intensity === 'Rest' 
                          ? 'bg-purple-950/20 border-purple-800/40' 
                          : 'bg-gray-800/40 border-gray-700/60 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-white text-sm">{dayPlan.day}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          dayPlan.intensity === 'Rest' ? 'bg-purple-900/40 text-purple-300' :
                          dayPlan.intensity === 'Low' ? 'bg-blue-900/40 text-blue-300' :
                          dayPlan.intensity === 'Moderate' ? 'bg-emerald-900/40 text-emerald-300' :
                          'bg-amber-900/40 text-amber-300'
                        }`}>
                          {dayPlan.intensity}
                        </span>
                      </div>
                      <h5 className="text-xs font-semibold text-emerald-300 mb-1">{dayPlan.focus}</h5>
                      <p className="text-xs text-gray-300 leading-relaxed mb-2">{dayPlan.routine}</p>
                      <div className="text-[10px] text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> {dayPlan.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exercise Breakdown Cards */}
            <div>
              <h4 className="text-base font-bold text-white mb-3 flex items-center">
                <Dumbbell className="w-4 h-4 mr-2 text-emerald-400" /> Core Prescribed Movements
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                {workout.exercises.map((ex, i) => (
                  <div key={i} className="bg-gray-800/40 p-4 rounded-xl border border-gray-700 hover:border-emerald-500/50 transition">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-base font-bold text-gray-100">{ex.name}</h5>
                      <span className="text-[10px] px-2 py-1 bg-gray-700/80 rounded-md text-gray-300 font-medium">{ex.type}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-gray-400 mb-3">
                      <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-emerald-400" /> {ex.duration}</span>
                      <span className="flex items-center"><Flame className="w-3.5 h-3.5 mr-1 text-amber-400" /> {ex.intensity}</span>
                    </div>
                    <p className="text-xs text-gray-300 mb-2 leading-relaxed">{ex.description}</p>
                    <div className="text-xs text-emerald-400/90 font-medium bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/20">
                      Benefit: {ex.benefits}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Guidelines */}
            <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-500/30">
              <h4 className="flex items-center text-amber-400 font-bold text-sm mb-2">
                <ShieldAlert className="w-4 h-4 mr-2" /> Clinical Safety Precautions
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-200/80">
                {workout.safetyGuidelines.map((g, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ==================== LIFESTYLE TAB ==================== */}
        {activeTab === 'lifestyle' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-950/40 to-gray-900 p-5 rounded-2xl border border-purple-500/30 mb-4">
              <h3 className="text-xl font-bold text-white mb-1">Targeted Neuro-Metabolic Interventions</h3>
              <p className="text-xs text-purple-200/80">
                Addresses chronic stressors, sleep architecture, and occupational risks.
              </p>
            </div>

            {lifestyle.length === 0 ? (
              <div className="text-center text-gray-400 py-10">No critical lifestyle anomalies detected. Continue maintaining your balanced baseline!</div>
            ) : (
              <div className="grid gap-4">
                {lifestyle.map((change, i) => (
                  <div key={i} className="flex flex-col md:flex-row bg-gray-800/40 rounded-2xl overflow-hidden border border-gray-700 hover:border-gray-600 transition">
                    <div className="bg-gray-800/80 p-5 md:w-56 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-700">
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-2 ${
                          change.impactPriority === 'Critical' 
                            ? 'bg-rose-900/40 text-rose-300 border border-rose-500/30'
                            : 'bg-purple-900/40 text-purple-300 border border-purple-500/30'
                        }`}>
                          {change.impactPriority || 'High'} Impact
                        </span>
                        <h5 className="text-sm font-bold text-white">{change.category}</h5>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-4 flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-cyan-400" />
                        <span>{change.timeline}</span>
                      </div>
                    </div>

                    <div className="p-5 flex-1">
                      <h4 className="text-base font-bold text-white mb-1.5">{change.title}</h4>
                      <p className="text-gray-300 text-xs leading-relaxed mb-4">{change.description}</p>
                      
                      <div className="bg-gray-900/50 p-3.5 rounded-xl border border-gray-800">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Prescribed Actions:</span>
                        <ul className="space-y-1.5">
                          {change.actionSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start text-xs text-gray-200">
                              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== HABITS TAB ==================== */}
        {activeTab === 'habits' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-950/40 via-gray-900 to-emerald-950/40 p-6 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Daily Habit Adherence Tracker</h3>
                <p className="text-xs text-gray-300">
                  Tick off items daily as you complete them. Progress is automatically saved in your browser.
                </p>
              </div>

              <div className="flex items-center space-x-3 bg-gray-900/80 px-4 py-3 rounded-xl border border-gray-700">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                <div>
                  <div className="text-xs text-gray-400">Score Today</div>
                  <div className="text-lg font-bold text-emerald-400">{completedCount} / {totalHabits} Completed ({habitPercentage}%)</div>
                </div>
              </div>
            </div>

            {/* Habit Progress Bar */}
            <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden border border-gray-700">
              <div 
                className="bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-400 h-full transition-all duration-500" 
                style={{ width: `${habitPercentage}%` }}
              ></div>
            </div>

            {/* Checklist items */}
            <div className="grid gap-3">
              {dailyHabits.map((habit) => {
                const isChecked = !!completedHabits[habit.id];
                return (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-500/50 text-white'
                        : 'bg-gray-800/40 border-gray-700/60 hover:bg-gray-800/70 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                      <div>
                        <span className={`text-sm font-medium ${isChecked ? 'line-through text-gray-400' : 'text-gray-200'}`}>
                          {habit.label}
                        </span>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-[10px] text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40 font-mono">
                            {habit.frequency}
                          </span>
                          <span className="text-[10px] text-gray-500">{habit.category}</span>
                        </div>
                      </div>
                    </div>

                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                      isChecked ? 'bg-emerald-500/20 text-emerald-300' : 'text-gray-500'
                    }`}>
                      {isChecked ? 'Completed' : 'Tap to mark'}
                    </span>
                  </div>
                );
              })}
            </div>

            {habitPercentage === 100 && (
              <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-xl flex items-center justify-center space-x-2 text-emerald-300 animate-bounce">
                <Award className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">Outstanding! You've accomplished 100% of your daily health habits today!</span>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Clinical Notes Footer */}
      {clinicalNotes.length > 0 && (
        <div className="bg-gray-950/60 p-4 px-6 border-t border-gray-800 text-[11px] text-gray-500">
          <strong className="text-gray-400">Clinical Formulation Basis: </strong>
          {clinicalNotes.join(' ')}
        </div>
      )}
    </div>
  );
};

export default DetailedRecommendations;