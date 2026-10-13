import { 
  HealthData, 
  OverallRiskAssessment, 
  DietPlan, 
  WorkoutPlan, 
  LifestyleChange, 
  FullRecommendation, 
  DietType,
  DietMacros,
  DayWorkoutSchedule,
  DailyHabit
} from '../types';

/**
 * Calculates basal metabolic rate (BMR) using the Mifflin-St Jeor equation
 * and adjusts for daily physical activity level (TDEE).
 */
export const calculateCaloricNeeds = (data: HealthData, risk: OverallRiskAssessment): { calories: number; bmr: number; tdee: number } => {
  const { age, gender, height, weight } = data.personalInfo;
  
  // Safe fallbacks if any metric is missing
  const h = height || 170;
  const w = weight || 70;
  const a = age || 35;

  let bmr = (10 * w) + (6.25 * h) - (5 * a);
  if (gender === 'Male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  // Activity Multiplier
  let activityFactor = 1.2; // Sedentary
  if (data.lifestyle.exerciseFrequency === '1-2 days') activityFactor = 1.375;
  if (data.lifestyle.exerciseFrequency === '3-4 days') activityFactor = 1.55;
  if (data.lifestyle.exerciseFrequency === '5+ days') activityFactor = 1.725;

  const tdee = Math.round(bmr * activityFactor);

  // Goal adjustment based on BMI and cardiovascular/metabolic risks
  let targetCalories = tdee;
  if (data.bmi > 25) {
    // Healthy, sustainable 15-20% deficit for weight management
    targetCalories = Math.max(1400, Math.round(tdee * 0.82));
  } else if (data.bmi < 18.5) {
    targetCalories = Math.round(tdee * 1.1);
  }

  return { calories: targetCalories, bmr: Math.round(bmr), tdee };
};

/**
 * Generates an individualized diet plan with precise macro targets,
 * superfoods, foods to avoid, and meal sequencing.
 */
export const generateDietPlan = (risk: OverallRiskAssessment, data: HealthData): DietPlan => {
  const isVegetarian = data.lifestyle.dietType === DietType.Vegetarian;
  const isVegan = data.lifestyle.dietType === DietType.Vegan;
  const { calories } = calculateCaloricNeeds(data, risk);
  
  const hasDiabetesRisk = risk.diabetes.level === 'High' || risk.diabetes.level === 'Very High' || (data.vitals.glucose && data.vitals.glucose > 100);
  const hasHBP = risk.hypertension.level === 'High' || risk.hypertension.level === 'Very High' || (data.vitals.systolicBP && data.vitals.systolicBP > 130);
  const hasHeartRisk = risk.cardiovascular.level === 'High' || risk.cardiovascular.level === 'Very High' || (data.vitals.cholesterol && data.vitals.cholesterol > 200);

  let type = "Balanced Mediterranean & Metabolic Wellness";
  let superfoods: string[] = ["Wild berries", "Extra virgin olive oil", "Walnuts", "Chia seeds", "Avocado"];
  let foodsToAvoid: string[] = ["Ultra-processed snack foods", "High-fructose corn syrup", "Trans fats", "Fried items"];
  let restrictions = ["Refined sugar", "Excess sodium (>2,000mg/day)", "Hydrogenated oils"];

  // Macro calculation
  let carbPct = 0.45;
  let proteinPct = 0.25;
  let fatPct = 0.30;

  if (hasDiabetesRisk) {
    type = "Low-Glycemic Insulin-Sensitizing Protocol";
    carbPct = 0.35;
    proteinPct = 0.30;
    fatPct = 0.35;
    superfoods = ["Cinnamon", "Apple cider vinegar (before meals)", "Fenugreek/chia seeds", "Cruciferous greens", "Bitter melon/berries"];
    foodsToAvoid.push("White bread and polished white rice", "Sugary sodas & fruit juices", "Pastries & sweets");
    restrictions.push("High GI carbohydrates", "Sweetened beverages");
  } else if (hasHBP || hasHeartRisk) {
    type = "Clinical DASH & Cardio-Protective Nutrition";
    carbPct = 0.50;
    proteinPct = 0.22;
    fatPct = 0.28;
    superfoods = ["Garlic", "Beetroot juice / roasted beets", "Flaxseed meal", "Dark leafy spinach", "Pomegranate", "Fatty fish (or algal DHA)"];
    foodsToAvoid.push("High-sodium canned soups", "Cured meats & sausages", "Salted chips & snacks", "Commercial salad dressings");
    restrictions.push("Table salt (< 1,500mg sodium daily)", "Saturated animal fats");
  } else if (data.bmi > 25) {
    type = "High-Satiety Metabolic Optimization";
    carbPct = 0.38;
    proteinPct = 0.32;
    fatPct = 0.30;
    superfoods = ["Greek yogurt / fermented tofu", "Edamame", "Green tea (EGCG)", "Almonds", "Broccoli sprouts"];
    foodsToAvoid.push("Liquid calories", "Refined grains", "Late-night heavy snacks");
  }

  // Gram calculations
  const proteinGrams = Math.round((calories * proteinPct) / 4);
  const carbGrams = Math.round((calories * carbPct) / 4);
  const fatGrams = Math.round((calories * fatPct) / 9);
  const fiberGrams = Math.max(30, Math.round(carbGrams * 0.18));
  const hydrationLiters = parseFloat(((data.personalInfo.weight || 70) * 0.035 + (data.lifestyle.exerciseFrequency !== 'None' ? 0.5 : 0.2)).toFixed(1));

  const macros: DietMacros = {
    carbs: carbGrams,
    protein: proteinGrams,
    fat: fatGrams,
    fiber: fiberGrams,
    hydrationLiters
  };

  const nutritionTips = [
    `Drink at least ${hydrationLiters}L of water daily. Begin your morning with 500ml of room-temperature lemon water.`,
    "Implement the 'Fiber First, Protein Second, Carbohydrates Last' meal sequencing rule to flatten glucose spikes.",
    `Maintain a minimum of ${fiberGrams}g of daily dietary fiber to support gut microbiome and cholesterol clearance.`,
    "Avoid eating within 2.5 to 3 hours before your scheduled sleep time for optimal nocturnal heart rate dipping."
  ];

  if (hasHBP) {
    nutritionTips.push("Flavor meals with garlic, oregano, turmeric, and lemon zest instead of salt shakers.");
  }
  if (hasDiabetesRisk) {
    nutritionTips.push("Pair any fruit intake with raw nuts or unsweetened Greek/plant yogurt to blunt insulin response.");
  }

  // Tailored meals based on dietary preference
  let meals;
  if (isVegan) {
    meals = {
      breakfast: {
        name: "Morning Fuel (7:30 - 8:30 AM)",
        food: ["Overnight steel-cut oats with chia seeds and unsweetened almond milk", "1/2 cup fresh organic blueberries", "1 scoop pea/hemp protein powder", "Sprinkle of Ceylon cinnamon"],
        notes: "High in beta-glucan soluble fiber to naturally pull LDL cholesterol from circulation."
      },
      midMorning: {
        name: "Mid-Morning Sustenance (10:30 AM)",
        food: ["Handful of raw walnuts and pumpkin seeds (approx 30g)", "Cup of organic green tea with lemon"],
        notes: "Rich in plant-based ALA Omega-3 and magnesium for vascular relaxation."
      },
      lunch: {
        name: "Midday Vitality Bowl (1:00 - 2:00 PM)",
        food: ["Quinoa and warm spiced lentil curry (Dal)", "Steamed broccoli florets with cold-pressed extra virgin olive oil", "Baby spinach and arugula salad with apple cider vinegar vinaigrette"],
        notes: "Complete plant amino-acid profile; high polyphenol load protects arterial endothelium."
      },
      eveningSnack: {
        name: "Afternoon Reset (4:30 - 5:00 PM)",
        food: ["Crisp cucumber and carrot sticks with 3 tbsp garlic sesame hummus", "1 cup roasted edamame"],
        notes: "Prevents afternoon energy slump without triggering reactive hypoglycemia."
      },
      dinner: {
        name: "Evening Restorative Supper (7:30 - 8:30 PM)",
        food: ["Pan-seared organic firm tofu with ginger and bok choy stir-fry", "Light cauliflower mash or 1/2 cup brown basmati rice", "Clear shiitake mushroom broth"],
        notes: "Light and easily digestible. Anti-inflammatory mushroom compounds support restful sleep."
      }
    };
  } else if (isVegetarian) {
    meals = {
      breakfast: {
        name: "Morning Fuel (7:30 - 8:30 AM)",
        food: ["2 whole boiled eggs or paneer scramble with spinach & tomatoes", "1 slice sprouted 100% whole grain sourdough toast", "Handful of crushed walnuts"],
        notes: "Choline in eggs supports liver lipid transport; low glycemic index keeps morning cortisol balanced."
      },
      midMorning: {
        name: "Mid-Morning Sustenance (10:30 AM)",
        food: ["Unsweetened Greek yogurt (150g) with 1 tbsp ground flaxseeds and fresh berries", "Green tea or matcha"],
        notes: "Probiotics strengthen gut integrity while lignans in flaxseeds assist blood pressure regulation."
      },
      lunch: {
        name: "Midday Power Plate (1:00 - 2:00 PM)",
        food: ["Spiced chickpea and sprouted mung bean salad with diced avocado and lemon", "Warm bowl of vegetable quinoa or brown rice", "Mixed cucumber-tomato mint raita"],
        notes: "Sustained slow-burning complex carbohydrates prevent post-lunch fatigue."
      },
      eveningSnack: {
        name: "Afternoon Reset (4:30 - 5:00 PM)",
        food: ["Roasted makhana (fox nuts) with turmeric and a pinch of rock salt", "Handful of raw almonds", "Chamomile or ginger herbal infusion"],
        notes: "Low-calorie crunchy snack rich in magnesium and anti-stress bioflavonoids."
      },
      dinner: {
        name: "Evening Restorative Supper (7:30 - 8:30 PM)",
        food: ["Grilled paneer (100g) or seasoned firm tofu steak", "Roasted asparagus, bell peppers, and zucchini with olive oil", "Hearty lentil soup (masoor dal)"],
        notes: "Moderate protein promotes nocturnal muscle protein synthesis without overburdening digestion."
      }
    };
  } else {
    // Non-Vegetarian
    meals = {
      breakfast: {
        name: "Morning Fuel (7:30 - 8:30 AM)",
        food: ["3-egg pasture-raised scramble (2 whites, 1 whole) with baby spinach, tomatoes, and avocado slices", "1 slice seeded sprouted grain toast", "Black coffee or green tea"],
        notes: "High biological value protein prevents mid-morning cravings and stabilizes glucose curve."
      },
      midMorning: {
        name: "Mid-Morning Sustenance (10:30 AM)",
        food: ["1 crisp green apple or pear sliced", "12 raw California almonds", "Sparkling water with lime"],
        notes: "Pectin in green apples binds bile acids, assisting cholesterol reduction."
      },
      lunch: {
        name: "Midday Power Plate (1:00 - 2:00 PM)",
        food: ["Herb-grilled chicken breast (150g)", "Roasted sweet potato wedges (100g)", "Large Mediterranean salad with dark leafy greens, kalamata olives, and cold-pressed olive oil"],
        notes: "Monounsaturated fats from olive oil and potassium from sweet potato optimize vascular tone."
      },
      eveningSnack: {
        name: "Afternoon Reset (4:30 - 5:00 PM)",
        food: ["Celery sticks with 2 tbsp natural unsweetened almond butter", "Cup of hibiscus tea (clinically shown to support healthy BP)"],
        notes: "Hibiscus tea polyphenols support healthy arterial compliance and nitric oxide bioavailability."
      },
      dinner: {
        name: "Evening Restorative Supper (7:30 - 8:30 PM)",
        food: ["Wild baked salmon or white fish (160g) with lemon and dill", "Steamed broccoli and roasted Brussels sprouts", "Light miso or clear vegetable broth"],
        notes: "EPA and DHA fatty acids in salmon directly lower serum triglycerides and quiet systemic inflammation."
      }
    };
  }

  return {
    type,
    calories,
    macros,
    superfoods,
    foodsToAvoid,
    restrictions,
    nutritionTips,
    meals
  };
};

/**
 * Generates an age, BMI, and biometric-adaptive workout program
 * with 7-day structure, target heart rate zones, and injury prevention rules.
 */
export const generateWorkoutPlan = (risk: OverallRiskAssessment, data: HealthData): WorkoutPlan => {
  const age = data.personalInfo.age || 35;
  const bmi = data.bmi || 24;
  const isHighRiskCVD = risk.cardiovascular.level === 'High' || risk.cardiovascular.level === 'Very High';
  const hasHighBP = (data.vitals.systolicBP && data.vitals.systolicBP >= 140) || risk.hypertension.level === 'High';
  const isBeginner = data.lifestyle.exerciseFrequency === 'None' || data.lifestyle.exerciseFrequency === '1-2 days';

  // Target heart rate zone (Karvonen guideline)
  const maxHR = 220 - age;
  const zone2Low = Math.round(maxHR * 0.60);
  const zone2High = Math.round(maxHR * 0.72);
  const targetHeartRateZone = `${zone2Low} - ${zone2High} BPM (Zone 2 Aerobic Base)`;

  let level = "Beginner (Gradual Adaptation)";
  let frequency = "3-4 days/week";
  let durationPerSession = "25 - 35 mins";

  if (!isBeginner && data.lifestyle.exerciseFrequency === '3-4 days') {
    level = "Intermediate (Progressive Overload)";
    frequency = "4-5 days/week";
    durationPerSession = "40 - 50 mins";
  } else if (!isBeginner && data.lifestyle.exerciseFrequency === '5+ days') {
    level = "Advanced (Performance & Longevity)";
    frequency = "5-6 days/week";
    durationPerSession = "45 - 60 mins";
  }

  const weeklySplit: DayWorkoutSchedule[] = [
    {
      day: "Monday",
      focus: "Aerobic Cardiovascular Foundation",
      routine: bmi > 28 ? "Low-impact brisk incline treadmill or outdoor power walk" : "Zone 2 aerobic jogging or cycling",
      duration: "30 mins",
      intensity: "Moderate"
    },
    {
      day: "Tuesday",
      focus: "Posterior Chain & Core Stability",
      routine: "Bodyweight glute bridges, wall push-ups, bird-dog, farmer walks",
      duration: "30 mins",
      intensity: "Moderate"
    },
    {
      day: "Wednesday",
      focus: "Active Recovery & Fascial Mobility",
      routine: "Cat-cow spinal mobility, hamstring dynamic stretches, 20m light walk",
      duration: "20 mins",
      intensity: "Low"
    },
    {
      day: "Thursday",
      focus: "Metabolic Resistance Training",
      routine: "Goblet squats (or chair squats), dumbbell bent-over rows, step-ups",
      duration: "35 mins",
      intensity: "Moderate"
    },
    {
      day: "Friday",
      focus: "Low-Impact Zone 2 Cardio",
      routine: "Swimming, stationary cycling, or elliptical trainer",
      duration: "30 mins",
      intensity: "Moderate"
    },
    {
      day: "Saturday",
      focus: "Functional Outdoor Activity",
      routine: "Nature hike, recreational badminton/pickleball, or extended park walk",
      duration: "45 mins",
      intensity: "Low"
    },
    {
      day: "Sunday",
      focus: "Complete Rest & Parasympathetic Reset",
      routine: "15-minute restorative yoga, physiological sigh breathwork, Epsom salt bath",
      duration: "15 mins",
      intensity: "Rest"
    }
  ];

  const exercises = [
    {
      name: bmi > 28 ? "Power Incline Walking" : "Brisk Zone 2 Jogging/Walking",
      type: "Cardiovascular",
      duration: "25-35 mins",
      intensity: "Zone 2 (Able to hold a conversation)",
      description: "Sustained rhythm where mitochondrial density is maximized without overloading joints.",
      benefits: "Increases insulin sensitivity by recruiting GLUT4 transporters without adrenaline surges."
    },
    {
      name: "Chair or Goblet Squats",
      type: "Resistance",
      duration: "3 sets of 10-12 reps",
      intensity: "Moderate (RPE 6/10)",
      description: "Stand with feet shoulder-width, engage core, lower hips back with chest proud.",
      benefits: "Builds largest metabolic muscle groups (quads and glutes) to sponge post-meal glucose."
    },
    {
      name: "Desk Posture Thoracic Openers & Wall Angels",
      type: "Mobility",
      duration: "3 sets of 10 reps",
      intensity: "Low",
      description: "Stand with spine against a flat wall, raise arms in W-to-Y shapes while keeping shoulder blades pinned.",
      benefits: "Reverses forward-head posture and reduces tension-induced blood pressure spikes."
    },
    {
      name: "Dead Bug & Pelvic Tilt Core Engagement",
      type: "Stability",
      duration: "3 sets of 8 reps per side",
      intensity: "Low-Moderate",
      description: "Lie flat on back, alternate extending opposite arm and leg while pressing lower back into floor.",
      benefits: "Protects lumbar spine and improves diaphragm-assisted autonomic relaxation."
    }
  ];

  if (hasHighBP) {
    exercises.push({
      name: "Isometric Wall Sit / Handgrip Hold",
      type: "Isometric Vascular",
      duration: "4 x 2 min intervals",
      intensity: "Low Impact",
      description: "Hold a 45-degree wall sit or compress a grip dynamometer at 30% maximal voluntary contraction.",
      benefits: "Clinically proven by the British Journal of Sports Medicine to induce post-exercise vasodilation and lower resting BP by 8-10 mmHg."
    });
  }

  const safetyGuidelines = [
    "Always begin every workout with 5 minutes of dynamic joint circles and end with slow nasal breathing.",
    "Stay hydrated: Drink 200ml of water every 15-20 minutes during exertion.",
    `Keep pulse in your optimal target zone (${targetHeartRateZone}).`
  ];

  if (isHighRiskCVD || hasHighBP) {
    safetyGuidelines.push("Strictly avoid the 'Valsalva maneuver' (holding your breath during lifts). Always exhale through pursed lips during exertion.");
    safetyGuidelines.push("If you ever experience chest tightness, sudden shortness of breath, or dizziness, immediately halt activity and sit down.");
  }
  if (bmi > 28) {
    safetyGuidelines.push("Wear supportive, cushioned footwear and prioritize low-impact surfaces (grass, tracks, treadmills, water) over hard asphalt.");
  }

  return {
    level,
    frequency,
    durationPerSession,
    targetHeartRateZone,
    schedule: ["Mon: Cardio Base", "Tue: Strength", "Wed: Mobility", "Thu: Resistance", "Fri: Cardio", "Sat: Active", "Sun: Rest"],
    weeklySplit,
    exercises,
    safetyGuidelines
  };
};

/**
 * Generates personalized lifestyle interventions and daily habit checklists.
 */
export const generateLifestyleChanges = (risk: OverallRiskAssessment, data: HealthData): LifestyleChange[] => {
  const changes: LifestyleChange[] = [];
  const occupation = (data.personalInfo.occupation || '').toLowerCase();
  const isDeskJob = occupation.includes('exec') || occupation.includes('corporate') || occupation.includes('soft') || occupation.includes('desk') || occupation.includes('tech') || occupation.includes('engineer') || occupation.includes('manager') || occupation.includes('student');

  // Sleep Hygiene
  if (data.lifestyle.sleepHours < 7) {
    changes.push({
      id: 'sleep-optimization',
      category: "Sleep Architecture",
      title: "Cortisol-Lowering Sleep Chrono-Protocol",
      description: `You reported ${data.lifestyle.sleepHours} hours of sleep. Chronic sleep deprivation (<7 hrs) elevates circulating evening cortisol by up to 37% and induces temporary insulin resistance.`,
      actionSteps: [
        "Eliminate blue-light screen exposure 60 minutes before bed; replace with reading or dim amber lighting.",
        "Maintain bedroom temperature at a cool 18-20°C (65-68°F) to facilitate natural core body temperature drop.",
        "Establish an unshakeable wake-up time 7 days a week to lock in your master circadian clock."
      ],
      timeline: "Noticeable alertness gains within 7-10 days",
      impactPriority: "Critical"
    });
  }

  // Stress & Autonomic Nervous System
  if (data.lifestyle.stressLevel >= 3) {
    changes.push({
      id: 'vagal-stress-reset',
      category: "Neuro-Autonomic Balance",
      title: "Vagal Nerve Stimulation & Stress Reset",
      description: "High stress elevates sympathetic nervous system tone, causing micro-vascular constriction and cardiac strain.",
      actionSteps: [
        "Practice the 'Physiological Sigh' (two quick inhales through the nose followed by a long, slow unforced exhale through the mouth) 3 times during high-pressure moments.",
        "Complete 10 minutes of box breathing (4s in, 4s hold, 4s out, 4s hold) before dinner.",
        "Step outside into natural morning sunlight within 30 minutes of waking for 10-15 minutes."
      ],
      timeline: "Immediate acute calming; lower resting BP in 14 days",
      impactPriority: "High"
    });
  }

  // Smoking Cessation
  if (data.lifestyle.smoker) {
    changes.push({
      id: 'smoking-harm-reduction',
      category: "Cardiovascular Rescue",
      title: "Endothelial Restoration & Smoking Cessation",
      description: "Combustion toxins damage arterial lining (endothelium) and instantly double your 10-year risk of cardiovascular events.",
      actionSteps: [
        "Schedule a clinical consultation with your primary physician to discuss NRT (Nicotine Replacement Therapy) or bupropion.",
        "Replace the tactile hand-to-mouth routine with cinnamon toothpicks or sparkling water with mint.",
        "Track daily smoke-free hours on a habit app; arterial endothelial repair begins within 48 hours of your last cigarette."
      ],
      timeline: "24-48 hours for arterial recovery; 3-6 months for lasting freedom",
      impactPriority: "Critical"
    });
  }

  // Desk Worker Ergonomics & Micro-Breaks
  if (isDeskJob || data.lifestyle.exerciseFrequency === 'None') {
    changes.push({
      id: 'posture-microbreaks',
      category: "Occupational Ergonomics",
      title: "Sedentary De-Risking & Posture Micro-Breaks",
      description: "Prolonged unbroken sitting disables lipoprotein lipase in leg muscles, impeding triglyceride clearance.",
      actionSteps: [
        "Follow the '20-20-20' rule: Every 20 minutes, look at an object 20 feet away for 20 seconds to reset ocular strain.",
        "Perform 10 standing calf raises or air squats every 50 minutes of seated computer work.",
        "Conduct phone calls and 1-on-1 brainstorming meetings while walking."
      ],
      timeline: "Immediate reduction in neck stiffness and afternoon fatigue",
      impactPriority: "Medium"
    });
  }

  // Hydration & Electrolytes
  if (data.lifestyle.waterIntake < 2.5) {
    changes.push({
      id: 'cellular-hydration',
      category: "Cellular Hydration",
      title: "Optimized Plasma Volume Protocol",
      description: `Reported hydration (${data.lifestyle.waterIntake}L) is below physiological demand. Sub-clinical dehydration increases blood viscosity and elevates resting heart rate.`,
      actionSteps: [
        "Keep a 1-liter marked glass or stainless bottle at your desk; consume one full bottle by 12:00 PM and another by 5:00 PM.",
        "Add a pinch of unrefined mineral salt and lemon to morning water to support cellular osmotic balance.",
        "Replace afternoon sodas or sugary lattes with plain sparkling water with lime."
      ],
      timeline: "3-5 days for enhanced cognitive clarity and digestion",
      impactPriority: "Medium"
    });
  }

  return changes;
};

/**
 * Creates actionable daily habit checklist items for the user's dashboard.
 */
export const generateDailyHabits = (data: HealthData, risk: OverallRiskAssessment): DailyHabit[] => {
  const habits: DailyHabit[] = [
    { id: 'water-500', label: 'Morning 500ml lemon hydration upon waking', frequency: 'Daily (Morning)', category: 'Hydration' },
    { id: 'sunlight-10', label: '10 mins of direct natural morning sunlight exposure', frequency: 'Daily (Morning)', category: 'Circadian' },
    { id: 'walk-post-meal', label: '15-minute brisk walk following largest meal (lunch/dinner)', frequency: 'Daily (Post-Meal)', category: 'Glucose' },
    { id: 'movement-session', label: `${data.lifestyle.exerciseFrequency === 'None' ? '20 mins' : '35 mins'} planned workout or Zone 2 cardio`, frequency: 'Scheduled Days', category: 'Fitness' },
    { id: 'stress-breath', label: '5 minutes of slow nasal 4-7-8 relaxation breathing', frequency: 'Daily (Evening)', category: 'Mental' },
    { id: 'screen-curfew', label: 'No digital screens within 60 minutes of bedtime', frequency: 'Daily (Night)', category: 'Sleep' },
  ];

  if (risk.hypertension.level !== 'Low' || (data.vitals.systolicBP && data.vitals.systolicBP > 125)) {
    habits.push({ id: 'bp-log', label: 'Record seated blood pressure in morning & evening log', frequency: 'Twice Daily', category: 'Vitals' });
  }

  if (risk.diabetes.level !== 'Low' || (data.vitals.glucose && data.vitals.glucose > 100)) {
    habits.push({ id: 'fiber-first', label: 'Eat vegetables/salad before carbs at every meal', frequency: 'Every Meal', category: 'Nutrition' });
  }

  return habits;
};

/**
 * Master aggregation engine combining all clinical and lifestyle recommendations.
 */
export const getDetailedRecommendations = (risk: OverallRiskAssessment, data: HealthData): FullRecommendation => {
  const diet = generateDietPlan(risk, data);
  const workout = generateWorkoutPlan(risk, data);
  const lifestyle = generateLifestyleChanges(risk, data);
  const dailyHabits = generateDailyHabits(data, risk);

  const clinicalNotes: string[] = [
    `Personalized for ${data.personalInfo.age}yo ${data.personalInfo.gender} with BMI ${data.bmi.toFixed(1)} (${data.personalInfo.occupation || 'Standard Profile'}).`,
    `Primary focus: Mitigating ${risk.overall.level.toLowerCase()} overall risk profile driven by ${risk.overall.factors.slice(0, 2).join(' and ') || 'preventative maintenance'}.`,
    "Recommendations conform to American Heart Association (AHA) and American Diabetes Association (ADA) lifestyle intervention guidelines."
  ];

  return {
    diet,
    workout,
    lifestyle,
    dailyHabits,
    clinicalNotes
  };
};
