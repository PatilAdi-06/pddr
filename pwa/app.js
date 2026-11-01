// ============================================================================
// DAYLIGHT WELLNESS (PDDR) - APPLICATION ENGINE & AI COACH
// ============================================================================

/**
 * ----------------------------------------------------------------------------
 * 🤖 AI WELLNESS ASSISTANT CONFIGURATION
 * ----------------------------------------------------------------------------
 * To connect live Google Gemini or OpenAI models in the future:
 * 1. Insert your API key in `apiKey` below (OR configure via the in-app AI settings).
 * 2. Select your provider ('gemini' or 'openai').
 *
 * NOTE: When apiKey is empty, Daylight automatically runs in Demo / Local Mode
 * with an intelligent rule-based wellness engine (zero latency, works offline!).
 */
const AI_CONFIG = {
  // PASTE YOUR GEMINI OR OPENAI API KEY HERE IN THE FUTURE:
  apiKey: '', 
  provider: 'gemini', // 'gemini' | 'openai'
  geminiModel: 'gemini-1.5-flash',
  openaiModel: 'gpt-4o-mini',
  systemInstruction: `You are Daylight AI Coach, a supportive, certified wellness and nutrition guide for the PDDR (Personalized Diet and Daily Routine Recommendation System). Provide concise, evidence-based nutrition tips, meal swap suggestions, hydration advice, and routine habits. Never provide medical prescriptions.`
};

// ----------------------------------------------------------------------------
// INITIAL STATE & DATA STORES
// ----------------------------------------------------------------------------
const defaultState = {
  user: {
    isLoggedIn: true,
    name: 'Adarsh',
    email: 'adarsh@daylight.app',
    role: 'Member'
  },
  profile: {
    name: 'Adarsh',
    age: 24,
    gender: 'Male',
    height: 174,
    weight: 68,
    targetWeight: 65,
    activity: 'Moderate',
    goal: 'Maintain',
    preference: 'Vegetarian',
    allergies: 'None',
    conditions: ['General Wellness']
  },
  water: 1500,
  exercise: 20,
  sleep: 7.5,
  mealsDone: { Breakfast: true, Lunch: false, Dinner: false },
  extraCalories: 0,
  extraProtein: 0,
  extraFoods: [],
  routineDone: {
    wake: true,
    morningWater: true,
    breakfast: true,
    midHydrate: false,
    lunch: false,
    workout: false,
    dinner: false,
    sleepRoutine: false
  },
  groceries: [
    { name: 'Rolled oats', quantity: '500 g', category: 'Grains & Pulses', purchased: false },
    { name: 'Fresh paneer', quantity: '400 g', category: 'Dairy & Proteins', purchased: false },
    { name: 'Organic quinoa', quantity: '250 g', category: 'Grains & Pulses', purchased: false },
    { name: 'Greek yogurt', quantity: '500 g', category: 'Dairy & Proteins', purchased: true },
    { name: 'Spinach & greens', quantity: '2 bunches', category: 'Fresh Produce', purchased: false },
    { name: 'Yellow lentils (Dal)', quantity: '500 g', category: 'Grains & Pulses', purchased: false },
    { name: 'Roasted makhana', quantity: '100 g', category: 'Pantry & Snacks', purchased: false },
    { name: 'Chia seeds', quantity: '150 g', category: 'Pantry & Snacks', purchased: true }
  ],
  chatMessages: [
    {
      sender: 'assistant',
      text: 'Hello Adarsh! I am your Daylight AI Coach. Ask me anything about your diet, healthy swaps, hydration, or daily workout routine.',
      time: '08:00 AM'
    }
  ],
  weeklyHistory: [
    { day: 'Mon', score: 72, calories: 1980, water: 2200 },
    { day: 'Tue', score: 80, calories: 2050, water: 2400 },
    { day: 'Wed', score: 65, calories: 1750, water: 1900 },
    { day: 'Thu', score: 85, calories: 2100, water: 2500 },
    { day: 'Fri', score: 78, calories: 2020, water: 2350 },
    { day: 'Sat', score: 82, calories: 2150, water: 2400 },
    { day: 'Sun', score: 79, calories: 2080, water: 2380 }
  ],
  reminders: {
    water: true,
    meals: true,
    workout: true,
    sleep: true
  },
  theme: 'light',
  customApiKey: ''
};

// Meal Database with Multi-swap Support
const mealCatalog = {
  Breakfast: [
    {
      name: 'Masala oats & boiled eggs',
      calories: 420,
      protein: 24,
      carbs: 48,
      fats: 12,
      ingredients: ['Rolled oats', 'Eggs', 'Onion', 'Tomato', 'Spices'],
      recipe: 'Cook oats with fresh chopped vegetables and mild spices. Serve alongside two seasoned boiled eggs.',
      swaps: ['Moong dal chilla', 'Tofu scramble toast', 'Paneer bhurji wrap']
    },
    {
      name: 'Moong dal chilla with mint chutney',
      calories: 380,
      protein: 22,
      carbs: 44,
      fats: 10,
      ingredients: ['Moong dal batter', 'Paneer stuffing', 'Mint', 'Coriander'],
      recipe: 'Griddled protein savory crepes stuffed with grated paneer and herbs.',
      swaps: ['Masala oats & boiled eggs', 'Tofu scramble toast', 'Greek yogurt granola bowl']
    },
    {
      name: 'Tofu scramble & whole wheat toast',
      calories: 410,
      protein: 26,
      carbs: 40,
      fats: 14,
      ingredients: ['Firm tofu', 'Turmeric', 'Bell peppers', 'Whole wheat bread'],
      recipe: 'Crumble and sauté tofu with onions, turmeric, and bell peppers; serve with toasted bread.',
      swaps: ['Masala oats & boiled eggs', 'Moong dal chilla', 'Greek yogurt granola bowl']
    }
  ],
  'Mid-morning': [
    {
      name: 'Greek yogurt with berries & chia',
      calories: 190,
      protein: 14,
      carbs: 22,
      fats: 5,
      ingredients: ['Greek yogurt', 'Berries', 'Chia seeds', 'Honey'],
      recipe: 'Layer Greek yogurt with fresh berries and soaked chia seeds. Chill 5 mins before serving.',
      swaps: ['Spiced buttermilk & almonds', 'Soy yogurt parfait', 'Apple slices with peanut butter']
    },
    {
      name: 'Spiced buttermilk & roasted almonds',
      calories: 170,
      protein: 10,
      carbs: 12,
      fats: 8,
      ingredients: ['Curd', 'Cumin', 'Roasted almonds', 'Curry leaves'],
      recipe: 'Whisk churned curd with roasted cumin, green chili, and serve with 10 roasted almonds.',
      swaps: ['Greek yogurt with berries & chia', 'Soy yogurt parfait', 'Seasonal fruit bowl']
    }
  ],
  Lunch: [
    {
      name: 'Paneer quinoa power bowl',
      calories: 560,
      protein: 32,
      carbs: 64,
      fats: 18,
      ingredients: ['Fresh paneer', 'Organic quinoa', 'Baby spinach', 'Cucumber', 'Lemon tahini'],
      recipe: 'Cook fluffy quinoa, pan-sear cubes of paneer, and toss with crunchy cucumber and spinach.',
      swaps: ['Chickpea brown rice bowl', 'Soya chunks pulao & curd', 'Grilled tofu & steamed millets']
    },
    {
      name: 'Chickpea spinach brown rice bowl',
      calories: 540,
      protein: 28,
      carbs: 72,
      fats: 12,
      ingredients: ['Chickpeas', 'Brown rice', 'Spinach gravy', 'Tomatoes'],
      recipe: 'Slow simmered chickpea curry layered over warm brown rice and sautéed greens.',
      swaps: ['Paneer quinoa power bowl', 'Soya chunks pulao & curd', 'Grilled tofu & steamed millets']
    },
    {
      name: 'Soya chunks pulao with spiced curd',
      calories: 550,
      protein: 35,
      carbs: 68,
      fats: 13,
      ingredients: ['Soya chunks', 'Basmati rice', 'Curd', 'Carrots', 'Beans'],
      recipe: 'Pressure cook high-protein soya chunks with fragrant basmati and diced vegetables.',
      swaps: ['Paneer quinoa power bowl', 'Chickpea brown rice bowl', 'Grilled tofu & steamed millets']
    }
  ],
  'Evening snack': [
    {
      name: 'Roasted makhana & herbal chai',
      calories: 160,
      protein: 7,
      carbs: 26,
      fats: 4,
      ingredients: ['Roasted makhana', 'Cardamom', 'Herbal green tea'],
      recipe: 'Crisp dry roast lotus seeds with rock salt and black pepper.',
      swaps: ['Sprouted moong chaat', 'Roasted chana bowl', 'Boiled sweet corn cup']
    },
    {
      name: 'Sprouted moong & pomegranate chaat',
      calories: 180,
      protein: 11,
      carbs: 30,
      fats: 2,
      ingredients: ['Sprouted moong', 'Pomegranate', 'Lemon juice', 'Chaat masala'],
      recipe: 'Toss steamed sprouts with sweet pomegranate kernels and freshly squeezed lime.',
      swaps: ['Roasted makhana & herbal chai', 'Roasted chana bowl', 'Handful of walnuts']
    }
  ],
  Dinner: [
    {
      name: 'Dal tadka, multigrain roti & greens',
      calories: 490,
      protein: 24,
      carbs: 70,
      fats: 11,
      ingredients: ['Yellow lentils', 'Multigrain flour', 'Seasonal greens', 'Ghee'],
      recipe: 'Pressure cook lentils with ginger and cumin. Enjoy with two hot rotis and sautéed greens.',
      swaps: ['Paneer tikka salad & quinoa', 'Vegetable khichdi & flaxseed curd', 'Soybean curry & millets']
    },
    {
      name: 'Paneer tikka salad with quinoa',
      calories: 480,
      protein: 28,
      carbs: 48,
      fats: 16,
      ingredients: ['Marinated paneer', 'Cooked quinoa', 'Bell peppers', 'Mint drizzle'],
      recipe: 'Oven-roasted or pan-grilled spiced paneer cubes tossed over tossed quinoa salad.',
      swaps: ['Dal tadka, multigrain roti & greens', 'Vegetable khichdi & flaxseed curd', 'Soybean curry & millets']
    },
    {
      name: 'Moong vegetable khichdi & flaxseed curd',
      calories: 460,
      protein: 21,
      carbs: 68,
      fats: 10,
      ingredients: ['Moong dal', 'Rice', 'Mixed veggies', 'Curd', 'Flaxseeds'],
      recipe: 'Calming one-pot comforting lentil grain porridge served with seeded curd.',
      swaps: ['Dal tadka, multigrain roti & greens', 'Paneer tikka salad & quinoa', 'Soybean curry & millets']
    }
  ]
};

// Selected active meals index map
let mealIndexMap = {
  Breakfast: 0,
  'Mid-morning': 0,
  Lunch: 0,
  'Evening snack': 0,
  Dinner: 0
};

// Quick snack catalog for on-the-fly logging
const quickSnacks = [
  { name: 'Raw Almonds (12 pcs)', calories: 160, protein: 6 },
  { name: '1 Medium Banana', calories: 105, protein: 1 },
  { name: 'Whey / Plant Protein Shake', calories: 130, protein: 25 },
  { name: 'Hard Boiled Eggs (2)', calories: 140, protein: 12 },
  { name: 'Sprouted Moong Salad', calories: 120, protein: 9 },
  { name: 'Fresh Tender Coconut Water', calories: 45, protein: 1 },
  { name: 'Roasted Peanuts (30g)', calories: 170, protein: 8 }
];

// Load persisted state or fallback
let state = JSON.parse(localStorage.getItem('daylight-state-v3') || 'null') || structuredClone(defaultState);
let currentView = 'today';
let selectedGroceryFilter = 'All';
const app = document.querySelector('#app');

// ----------------------------------------------------------------------------
// HEALTH METRICS & FORMULAS (Mifflin-St Jeor)
// ----------------------------------------------------------------------------
function health() {
  const p = state.profile;
  const bmi = p.weight / ((p.height / 100) ** 2);
  const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.gender === 'Female' ? -161 : 5);
  const factors = { Low: 1.2, Moderate: 1.45, High: 1.7 };
  const adjustments = { 'Lose weight': -350, Maintain: 0, 'Gain muscle': 300 };
  const targetCalories = Math.round(bmr * (factors[p.activity] || 1.4) + (adjustments[p.goal] || 0));
  const waterTarget = Math.round(p.weight * 35);

  // Scientific Macro Targets: Protein (25%), Carbs (50%), Fats (25%)
  const proteinGrams = Math.round((targetCalories * 0.25) / 4);
  const carbsGrams = Math.round((targetCalories * 0.50) / 4);
  const fatsGrams = Math.round((targetCalories * 0.25) / 9);

  return {
    bmi,
    bmr: Math.round(bmr),
    calories: targetCalories,
    water: waterTarget,
    protein: proteinGrams,
    carbs: carbsGrams,
    fats: fatsGrams,
    label: bmi < 18.5 ? 'Below range' : bmi < 25 ? 'Healthy range' : bmi < 30 ? 'Above range' : 'High range'
  };
}

function getActiveMeals() {
  const times = {
    Breakfast: '08:00 AM',
    'Mid-morning': '11:00 AM',
    Lunch: '01:30 PM',
    'Evening snack': '04:30 PM',
    Dinner: '08:00 PM'
  };
  return Object.keys(mealCatalog).map((type) => {
    const list = mealCatalog[type];
    const item = list[mealIndexMap[type] % list.length];
    return { ...item, type, time: times[type] };
  });
}

function getConsumedTotals() {
  const activeMeals = getActiveMeals();
  let cal = state.extraCalories;
  let pro = state.extraProtein;
  let carbs = 0;
  let fats = 0;

  activeMeals.forEach((meal) => {
    if (state.mealsDone[meal.type]) {
      cal += meal.calories;
      pro += meal.protein;
      carbs += meal.carbs || 45;
      fats += meal.fats || 12;
    }
  });
  return { cal, pro, carbs, fats };
}

function score() {
  const h = health();
  const consumed = getConsumedTotals();
  const mealCount = Object.values(state.mealsDone).filter(Boolean).length;
  const mealScore = mealCount * 12;
  const calDiff = Math.abs(consumed.cal - h.calories);
  const calorieScore = Math.max(0, 20 - (calDiff / h.calories) * 20);
  const waterScore = Math.min(20, (state.water / h.water) * 20);
  const exerciseScore = Math.min(15, (state.exercise / 30) * 15);
  const sleepScore = Math.min(15, (state.sleep / 8) * 15);
  const routineDoneCount = Object.values(state.routineDone || {}).filter(Boolean).length;
  const routineScore = (routineDoneCount / 8) * 18;

  return Math.min(100, Math.round(mealScore + calorieScore + waterScore + exerciseScore + sleepScore + routineScore));
}

function save() {
  localStorage.setItem('daylight-state-v3', JSON.stringify(state));
}

function esc(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function metric(label, value, unit, detail, tone) {
  return `<article class="metric ${tone}"><small>${label}</small><strong>${value} <em>${unit}</em></strong><span>${detail}</span></article>`;
}

function mealCard(meal, index) {
  const isDone = !!state.mealsDone[meal.type];
  return `
    <button class="meal-card" data-meal="${esc(meal.type)}" aria-label="View details for ${esc(meal.name)}">
      <span class="meal-index" style="${isDone ? 'background:#d8f59a;color:#185843;' : ''}">${isDone ? '✓' : index + 1}</span>
      <span class="meal-content">
        <small>${esc(meal.type)} <time>${meal.time}</time></small>
        <strong>${esc(meal.name)}</strong>
        <span>${meal.calories} kcal · ${meal.protein}g protein · Tap for recipe & swaps</span>
      </span>
      <b>›</b>
    </button>
  `;
}

// ----------------------------------------------------------------------------
// VIEW RENDERERS
// ----------------------------------------------------------------------------
function render() {
  applyTheme(state.theme || 'light');
  updateTopbar();

  const views = {
    today: renderToday,
    plan: renderPlan,
    track: renderTrack,
    grocery: renderGrocery,
    profile: renderProfile
  };

  app.innerHTML = views[currentView] ? views[currentView]() : renderToday();
  document.querySelectorAll('.nav-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === currentView);
  });
  bindActions();
}

function updateTopbar() {
  const avatar = document.querySelector('#profileButton');
  if (avatar) {
    const initials = state.profile.name ? state.profile.name.slice(0, 2).toUpperCase() : 'AS';
    avatar.textContent = initials;
  }
  const themeBtn = document.querySelector('#themeToggle');
  if (themeBtn) {
    themeBtn.textContent = state.theme === 'dark' ? '☀️' : '🌙';
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'dark' ? '#121916' : '#176b52');
  }
}

// 1. TODAY VIEW
function renderToday() {
  const h = health();
  const consumed = getConsumedTotals();
  const activeMeals = getActiveMeals();
  const currentScore = score();
  const remainingCal = Math.max(0, h.calories - consumed.cal);
  const calPercent = Math.min(100, Math.round((consumed.cal / h.calories) * 100));

  return `
    <p class="eyebrow">TODAY · ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</p>
    <h1>Good morning, ${esc(state.profile.name)}.</h1>
    <p class="subtle">Adaptive nutrition and daily routine recommendation engine.</p>

    <!-- Daily Calorie Target Card -->
    <section class="target">
      <div>
        <small>YOUR DAILY TARGET</small>
        <strong>${h.calories} <em>kcal</em></strong>
        <span>Adaptive goal for ${esc(state.profile.goal.toLowerCase())} · BMR: ${h.bmr} kcal</span>
      </div>
      <div class="score">
        <b>${currentScore}</b>
        <small>wellness</small>
      </div>
      <div class="bar"><i style="width:${calPercent}%"></i></div>
      <footer>
        <span>${consumed.cal} kcal consumed</span>
        <span>${remainingCal} kcal remaining</span>
      </footer>
    </section>

    <!-- Macronutrient Breakdown Card -->
    <section class="macro-card">
      <div class="macro-header">
        <small>MACRONUTRIENT BALANCE</small>
        <span style="font-size:11px;color:var(--text-muted);">${consumed.pro}g / ${h.protein}g Protein</span>
      </div>
      <div class="macro-grid">
        <div class="macro-item macro-protein">
          <span>Protein (25%)</span>
          <strong>${consumed.pro} / ${h.protein}g</strong>
          <div class="macro-bar"><i style="width:${Math.min(100, (consumed.pro / h.protein) * 100)}%"></i></div>
        </div>
        <div class="macro-item macro-carbs">
          <span>Carbs (50%)</span>
          <strong>${consumed.carbs} / ${h.carbs}g</strong>
          <div class="macro-bar"><i style="width:${Math.min(100, (consumed.carbs / h.carbs) * 100)}%"></i></div>
        </div>
        <div class="macro-item macro-fats">
          <span>Fats (25%)</span>
          <strong>${consumed.fats} / ${h.fats}g</strong>
          <div class="macro-bar"><i style="width:${Math.min(100, (consumed.fats / h.fats) * 100)}%"></i></div>
        </div>
      </div>
    </section>

    <!-- Interactive AI Assistant Banner -->
    <div class="ai-banner" data-action="open-ai" role="button" tabindex="0">
      <div class="ai-banner-left">
        <div class="ai-sparkle">✨</div>
        <div class="ai-banner-text">
          <strong>Daylight AI Wellness Coach</strong>
          <span>Need a customized snack, meal swap, or workout tip? Tap to chat</span>
        </div>
      </div>
      <button class="ai-banner-btn">Chat →</button>
    </div>

    <!-- Health Metrics Row -->
    <section class="metrics">
      ${metric('BMI', h.bmi.toFixed(1), 'kg/m²', h.label, 'mint')}
      ${metric('Hydration', (state.water / 1000).toFixed(1), 'L', `${Math.round((state.water / h.water) * 100)}% of goal`, 'blue')}
      ${metric('Exercise', state.exercise, 'min', state.exercise >= 30 ? 'Goal met' : '30m target', 'peach')}
    </section>

    <!-- Today's Meals Section -->
    <div class="section-title">
      <h2>Today's meals</h2>
      <button data-view="plan">View 5-meal plan →</button>
    </div>
    <div class="meal-list">
      ${activeMeals.slice(0, 3).map((m, idx) => mealCard(m, idx)).join('')}
    </div>

    <!-- Quick Snack Logger Trigger -->
    <div class="quick-log-row">
      <span>Ate something outside the plan?</span>
      <button data-action="log-snack">+ Quick Food / Snack</button>
    </div>

    <!-- Hydration & Score Cards -->
    <section class="split">
      <article class="small-card mint">
        <small>HYDRATION LOG</small>
        <strong>${state.water} <em>/ ${h.water} ml</em></strong>
        <div class="progress"><i style="width:${Math.min(100, (state.water / h.water) * 100)}%"></i></div>
        <div class="card-actions">
          <button data-action="water-sub" class="btn-sub" title="Remove 250 ml">− 250 ml</button>
          <button data-action="water" title="Add 250 ml">+ 250 ml</button>
        </div>
      </article>

      <article class="small-card peach">
        <small>DAILY MOMENTUM</small>
        <strong>${currentScore} / 100</strong>
        <span>${currentScore >= 75 ? '🔥 High consistency' : '🌱 Building steady momentum'}</span>
        <button class="btn-sub" style="margin-top:auto;padding:6px 10px;font-size:10px;font-weight:700;" data-view="track">View habit streak →</button>
      </article>
    </section>
  `;
}

// 2. PLAN VIEW
function renderPlan() {
  const h = health();
  const activeMeals = getActiveMeals();

  return `
    <p class="eyebrow">ADAPTIVE MEAL PLAN</p>
    <h1>Tuned to ${h.calories} kcal.</h1>
    <p class="subtle wide">Calculated for your ${esc(state.profile.preference.toLowerCase())} preference and ${esc(state.profile.goal.toLowerCase())} goal. Tap any meal to view recipes, ingredients, and alternatives.</p>

    <div class="meal-list full">
      ${activeMeals.map((meal, idx) => `
        <div style="display:flex;flex-direction:column;gap:6px;">
          ${mealCard(meal, idx)}
          <div style="display:flex;justify-content:flex-end;gap:8px;padding-right:4px;">
            <button class="chip-btn" data-swap-type="${esc(meal.type)}" style="font-size:10px;padding:4px 9px;">🔄 Swap meal alternative</button>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="section-title" style="margin-top:20px;">
      <h2>Dietary adjustments</h2>
    </div>
    <div class="chips">
      ${(state.profile.conditions || []).map((cond) => `<span>✓ ${esc(cond)}</span>`).join('')}
      <span>Preference: ${esc(state.profile.preference)}</span>
      <span>Target: ${esc(state.profile.goal)}</span>
    </div>

    <button class="primary" data-action="next-plan">Generate next-day plan variation →</button>
  `;
}

// 3. TRACK VIEW (With Routine Timeline & 7-Day Analytics)
function renderTrack() {
  const h = health();
  const currentScore = score();
  const routine = state.routineDone || {};

  return `
    <p class="eyebrow">HABIT & ROUTINE MOMENTUM</p>
    <h1>Small habits, visible progress.</h1>

    <!-- 7-Day History Analytics Chart -->
    <section class="chart-card">
      <div class="chart-header">
        <strong>7-Day Wellness Consistency</strong>
        <span>Score: ${currentScore}/100 Today</span>
      </div>
      <div class="chart-bars">
        ${(state.weeklyHistory || []).map((d, index) => {
          const isToday = index === (state.weeklyHistory.length - 1);
          const barHeight = Math.max(15, Math.min(100, d.score));
          return `
            <div class="chart-col ${isToday ? 'today' : ''}" title="${d.day}: ${d.score} pts">
              <div class="chart-bar-wrap">
                <div class="chart-bar-fill" style="height:${barHeight}%"></div>
              </div>
              <span class="chart-day">${d.day}</span>
            </div>
          `;
        }).join('')}
      </div>
    </section>

    <!-- Quick Increment / Decrement Steppers -->
    <div class="track-list">
      <article>
        <b>💧 Water Intake</b>
        <span>${state.water} / ${h.water} ml</span>
        <div class="track-actions">
          <button data-action="water-sub" class="btn-sub" title="Decrease water">− 250</button>
          <button data-action="water" title="Increase water">+ 250 ml</button>
        </div>
      </article>

      <article>
        <b>🏃 Exercise Activity</b>
        <span>${state.exercise} min</span>
        <div class="track-actions">
          <button data-action="exercise-sub" class="btn-sub" title="Decrease exercise">− 10</button>
          <button data-action="exercise" title="Increase exercise">+ 10 min</button>
        </div>
      </article>

      <article>
        <b>🌙 Sleep Duration</b>
        <span>${state.sleep} hrs</span>
        <div class="track-actions">
          <button data-action="sleep-sub" class="btn-sub" title="Decrease sleep">− 1 hr</button>
          <button data-action="sleep-add" title="Increase sleep">+ 1 hr</button>
        </div>
      </article>
    </div>

    <!-- Weight Tracking Progress Row -->
    <div class="weight-row">
      <div class="weight-row-left">
        <strong>Body Weight Progress</strong>
        <small>Current: ${state.profile.weight} kg · Target: ${state.profile.targetWeight || 65} kg</small>
      </div>
      <div class="weight-input-wrap">
        <input type="number" id="quickWeightInput" value="${state.profile.weight}" step="0.5" min="30" max="250" aria-label="Enter weight in kg" />
        <button data-action="update-weight">Save</button>
      </div>
    </div>

    <!-- Daily Routine Timeline (The "Daily Routine" half of PDDR) -->
    <section class="timeline-section">
      <div class="section-title">
        <h2>Daily Routine Schedule</h2>
        <span style="font-size:11px;color:var(--text-muted);">${Object.values(routine).filter(Boolean).length}/8 Completed</span>
      </div>
      <div class="timeline">
        <div class="timeline-item ${routine.wake ? 'done' : ''}">
          <span class="timeline-time">07:00 AM</span>
          <div class="timeline-content">
            <strong>Wake up & 500 ml Warm Water</strong>
            <small>Hydrate and kickstart digestion</small>
          </div>
          <label class="timeline-check">
            <input type="checkbox" data-routine="wake" ${routine.wake ? 'checked' : ''} />
          </label>
        </div>

        <div class="timeline-item ${routine.breakfast ? 'done' : ''}">
          <span class="timeline-time">08:00 AM</span>
          <div class="timeline-content">
            <strong>Nutritious Breakfast & Focus</strong>
            <small>Complex carbs and 20g+ protein</small>
          </div>
          <label class="timeline-check">
            <input type="checkbox" data-routine="breakfast" ${routine.breakfast ? 'checked' : ''} />
          </label>
        </div>

        <div class="timeline-item ${routine.midHydrate ? 'done' : ''}">
          <span class="timeline-time">11:00 AM</span>
          <div class="timeline-content">
            <strong>Mid-day Hydration & Light Stretch</strong>
            <small>Posture check, green tea or seasonal fruit</small>
          </div>
          <label class="timeline-check">
            <input type="checkbox" data-routine="midHydrate" ${routine.midHydrate ? 'checked' : ''} />
          </label>
        </div>

        <div class="timeline-item ${routine.lunch ? 'done' : ''}">
          <span class="timeline-time">01:30 PM</span>
          <div class="timeline-content">
            <strong>Balanced Lunch & 10-Min Walk</strong>
            <small>Fiber, greens, protein, and light movement</small>
          </div>
          <label class="timeline-check">
            <input type="checkbox" data-routine="lunch" ${routine.lunch ? 'checked' : ''} />
          </label>
        </div>

        <div class="timeline-item ${routine.workout ? 'done' : ''}">
          <span class="timeline-time">05:30 PM</span>
          <div class="timeline-content">
            <strong>30-Min Workout / Brisk Walk</strong>
            <small>Resistance training or aerobic exercise</small>
          </div>
          <label class="timeline-check">
            <input type="checkbox" data-routine="workout" ${routine.workout ? 'checked' : ''} />
          </label>
        </div>

        <div class="timeline-item ${routine.dinner ? 'done' : ''}">
          <span class="timeline-time">08:00 PM</span>
          <div class="timeline-content">
            <strong>Light Dinner (2+ hours before bed)</strong>
            <small>Gentle on digestion, whole grains & lentils</small>
          </div>
          <label class="timeline-check">
            <input type="checkbox" data-routine="dinner" ${routine.dinner ? 'checked' : ''} />
          </label>
        </div>

        <div class="timeline-item ${routine.sleepRoutine ? 'done' : ''}">
          <span class="timeline-time">10:30 PM</span>
          <div class="timeline-content">
            <strong>Screen-off & Restorative Sleep</strong>
            <small>Cool room temperature, target 7–8 hours</small>
          </div>
          <label class="timeline-check">
            <input type="checkbox" data-routine="sleepRoutine" ${routine.sleepRoutine ? 'checked' : ''} />
          </label>
        </div>
      </div>
    </section>

    <!-- Meal Adherence Checkboxes -->
    <h3 class="label">MAIN MEAL ADHERENCE</h3>
    ${['Breakfast', 'Lunch', 'Dinner'].map((meal) => `
      <label class="check">
        <input type="checkbox" data-meal-check="${meal}" ${state.mealsDone[meal] ? 'checked' : ''}>
        ${meal} completed (+15 wellness score)
      </label>
    `).join('')}
  `;
}

// 4. GROCERY VIEW (Categorized + Custom item + Share)
function renderGrocery() {
  const categories = ['All', 'Produce', 'Dairy & Protein', 'Grains & Pulses', 'Pantry'];
  const filteredGroceries = state.groceries.filter((item) => {
    if (selectedGroceryFilter === 'All') return true;
    if (selectedGroceryFilter === 'Produce') return (item.category || '').includes('Produce');
    if (selectedGroceryFilter === 'Dairy & Protein') return (item.category || '').includes('Dairy') || (item.category || '').includes('Protein');
    if (selectedGroceryFilter === 'Grains & Pulses') return (item.category || '').includes('Grains');
    if (selectedGroceryFilter === 'Pantry') return (item.category || '').includes('Pantry') || (item.category || '').includes('Snacks');
    return true;
  });

  return `
    <p class="eyebrow">PLAN TO KITCHEN</p>
    <h1>Smart Grocery List</h1>
    <p class="subtle">Automatically compiled from your planned meals and substitutions.</p>

    <!-- Category Filter Chips -->
    <div class="grocery-category-filter">
      ${categories.map((cat) => `
        <button class="filter-chip ${selectedGroceryFilter === cat ? 'active' : ''}" data-category-filter="${cat}">${cat}</button>
      `).join('')}
    </div>

    <!-- Add Custom Item Form -->
    <form class="grocery-add-form" id="groceryAddForm">
      <input type="text" name="itemName" placeholder="Add custom item (e.g. Almond milk)" required />
      <input type="text" name="itemQty" placeholder="Qty (e.g. 1 L)" style="max-width:100px;" />
      <button type="submit">+ Add</button>
    </form>

    <!-- Grocery Items List -->
    <div class="grocery-list">
      ${filteredGroceries.length === 0 ? `<p style="padding:20px;text-align:center;color:var(--text-muted);">No items in this category.</p>` : ''}
      ${filteredGroceries.map((item) => {
        const globalIndex = state.groceries.indexOf(item);
        return `
          <label class="grocery ${item.purchased ? 'purchased' : ''}">
            <input type="checkbox" data-grocery="${globalIndex}" ${item.purchased ? 'checked' : ''}>
            <span>
              <b>${esc(item.name)}</b>
              <small>${esc(item.quantity || '')}</small>
            </span>
            <span class="grocery-tag">${esc(item.category || 'Pantry')}</span>
          </label>
        `;
      }).join('')}
    </div>

    <!-- Grocery Actions -->
    <div class="grocery-actions-row">
      <button data-action="clear-purchased">Clear checked items</button>
      <button data-action="share-groceries">📋 Copy / Share List</button>
    </div>
  `;
}

// 5. PROFILE & SETTINGS VIEW (Auth, Notifications, Health Details, Theme)
function renderProfile() {
  const p = state.profile;
  const h = health();
  const u = state.user || {};

  return `
    <p class="eyebrow">ACCOUNT & HEALTH FOUNDATION</p>
    <h1>Personal Profile</h1>

    <!-- User Account Card -->
    <section class="profile-summary">
      <div class="avatar large">${p.name ? p.name.slice(0, 2).toUpperCase() : 'AS'}</div>
      <div>
        <strong>${esc(p.name)} · <span style="font-weight:400;color:var(--text-muted);font-size:12px;">${esc(u.email || 'offline@daylight.app')}</span></strong>
        <span>${esc(p.preference)} · ${esc(p.goal)} · ${esc(p.activity)} activity</span>
        <div class="profile-actions">
          <button data-action="edit">Edit health profile →</button>
          <button data-action="auth-modal">Account settings →</button>
        </div>
      </div>
    </section>

    <!-- Health Stats Metrics -->
    <section class="metrics">
      ${metric('Height', p.height, 'cm', 'Registered', 'mint')}
      ${metric('Weight', p.weight, 'kg', `Goal: ${p.targetWeight || 65}kg`, 'peach')}
      ${metric('BMI', h.bmi.toFixed(1), 'kg/m²', h.label, 'blue')}
    </section>

    <!-- Reminder Settings Toggles -->
    <div class="section-title">
      <h2>Preferences & System</h2>
    </div>
    <div class="settings-list">
      <div class="settings-item">
        <div>
          <strong>Hydration Alerts</strong>
          <small>Remind every 2 hours to drink water</small>
        </div>
        <label class="switch">
          <input type="checkbox" data-reminder="water" ${state.reminders?.water ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>

      <div class="settings-item">
        <div>
          <strong>Meal Schedule Prompts</strong>
          <small>Alert at 8:00 AM, 1:30 PM, and 8:00 PM</small>
        </div>
        <label class="switch">
          <input type="checkbox" data-reminder="meals" ${state.reminders?.meals ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>

      <div class="settings-item">
        <div>
          <strong>Dark Appearance</strong>
          <small>Switch between dark and light themes</small>
        </div>
        <label class="switch">
          <input type="checkbox" id="themeSwitch" ${state.theme === 'dark' ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>

      <div class="settings-item">
        <div>
          <strong>AI Coach API Key</strong>
          <small>${(state.customApiKey || AI_CONFIG.apiKey) ? '🟢 Key Configured' : '⚪ Demo / Local Mode'}</small>
        </div>
        <button class="chip-btn" data-action="config-ai-key">Configure Key</button>
      </div>
    </div>

    <!-- Data Management & Offline Notice -->
    <div style="display:flex;gap:10px;margin-top:16px;">
      <button class="secondary-btn" data-action="export-data">Export Data (JSON)</button>
      <button class="secondary-btn" data-action="reset-data" style="color:#d9534f;">Reset Demo Data</button>
    </div>

    <article class="notice" style="margin-top:20px;display:flex;flex-direction:column;gap:5px;padding:16px;border-radius:14px;background:var(--primary-soft);color:var(--primary-text);font-size:12px;">
      <b>🛡️ Offline-First Architecture</b>
      <span>Your diet plans, meal logs, and routine calculations stay secure on your local device.</span>
    </article>
  `;
}

// ----------------------------------------------------------------------------
// EVENT BINDINGS & ACTIONS
// ----------------------------------------------------------------------------
function bindActions() {
  // Navigation
  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      currentView = button.dataset.view;
      render();
    });
  });

  // Action Buttons
  document.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      handleAction(button.dataset.action);
    });
  });

  // Meal Detail Cards
  document.querySelectorAll('[data-meal]').forEach((button) => {
    button.addEventListener('click', () => {
      const activeMeals = getActiveMeals();
      const match = activeMeals.find((m) => m.type === button.dataset.meal);
      if (match) showMeal(match);
    });
  });

  // Meal Swap Trigger
  document.querySelectorAll('[data-swap-type]').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      swapMeal(button.dataset.swapType);
    });
  });

  // Routine Checkboxes
  document.querySelectorAll('[data-routine]').forEach((input) => {
    input.addEventListener('change', () => {
      state.routineDone = state.routineDone || {};
      state.routineDone[input.dataset.routine] = input.checked;
      save();
      render();
    });
  });

  // Meal Adherence Checkboxes
  document.querySelectorAll('[data-meal-check]').forEach((input) => {
    input.addEventListener('change', () => {
      state.mealsDone[input.dataset.mealCheck] = input.checked;
      save();
      render();
    });
  });

  // Grocery Checkboxes
  document.querySelectorAll('[data-grocery]').forEach((input) => {
    input.addEventListener('change', () => {
      const idx = Number(input.dataset.grocery);
      if (state.groceries[idx]) {
        state.groceries[idx].purchased = input.checked;
        save();
        render();
      }
    });
  });

  // Grocery Filter Chips
  document.querySelectorAll('[data-category-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedGroceryFilter = button.dataset.categoryFilter;
      render();
    });
  });

  // Grocery Add Form
  const groceryForm = document.querySelector('#groceryAddForm');
  if (groceryForm) {
    groceryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = new FormData(groceryForm);
      const name = form.get('itemName')?.toString().trim();
      const qty = form.get('itemQty')?.toString().trim() || '1 item';
      if (name) {
        state.groceries.unshift({
          name,
          quantity: qty,
          category: 'Pantry & Custom',
          purchased: false
        });
        save();
        render();
      }
    });
  }

  // Theme Toggle Switch
  const themeSwitch = document.querySelector('#themeSwitch');
  if (themeSwitch) {
    themeSwitch.addEventListener('change', () => {
      state.theme = themeSwitch.checked ? 'dark' : 'light';
      save();
      render();
    });
  }

  // Reminder Switches
  document.querySelectorAll('[data-reminder]').forEach((sw) => {
    sw.addEventListener('change', () => {
      state.reminders = state.reminders || {};
      state.reminders[sw.dataset.reminder] = sw.checked;
      save();
    });
  });
}

function handleAction(action) {
  const h = health();

  if (action === 'water') state.water = state.water + 250;
  if (action === 'water-sub') state.water = Math.max(0, state.water - 250);

  if (action === 'exercise') state.exercise += 10;
  if (action === 'exercise-sub') state.exercise = Math.max(0, state.exercise - 10);

  if (action === 'sleep-add') state.sleep = Math.min(24, Math.round((state.sleep + 1) * 10) / 10);
  if (action === 'sleep-sub') state.sleep = Math.max(0, Math.round((state.sleep - 1) * 10) / 10);

  if (action === 'open-ai') openAiChat();
  if (action === 'config-ai-key') showApiKeyModal();
  if (action === 'edit') showProfile();
  if (action === 'auth-modal') showAuthModal();
  if (action === 'log-snack') showSnackLogger();

  if (action === 'update-weight') {
    const input = document.querySelector('#quickWeightInput');
    if (input) {
      state.profile.weight = Number(input.value) || state.profile.weight;
      save();
      render();
    }
  }

  if (action === 'next-plan') {
    Object.keys(mealIndexMap).forEach((type) => {
      mealIndexMap[type] = (mealIndexMap[type] + 1) % (mealCatalog[type].length);
    });
    render();
  }

  if (action === 'clear-purchased') {
    state.groceries = state.groceries.filter((g) => !g.purchased);
    save();
    render();
  }

  if (action === 'share-groceries') {
    const text = state.groceries.map((g) => `${g.purchased ? '[x]' : '[ ]'} ${g.name} (${g.quantity})`).join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Grocery list copied to clipboard!');
    } else {
      prompt('Copy your grocery list:', text);
    }
  }

  if (action === 'export-data') {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `daylight_health_data_${new Date().toISOString().slice(0, 10)}.json`);
    dl.click();
  }

  if (action === 'reset-data') {
    if (confirm('Reset your logs and restore default health demo values?')) {
      state = structuredClone(defaultState);
      save();
      render();
    }
  }

  save();
  render();
}

function swapMeal(type) {
  if (mealCatalog[type]) {
    mealIndexMap[type] = (mealIndexMap[type] + 1) % mealCatalog[type].length;
    render();
  }
}

// ----------------------------------------------------------------------------
// MODALS & DIALOGS (Meal Details, Food Logger, Profile, Auth)
// ----------------------------------------------------------------------------
function showMeal(meal) {
  const dialog = document.querySelector('#profileDialog');
  dialog.innerHTML = `
    <form method="dialog" class="dialog-card">
      <button class="close">×</button>
      <p class="eyebrow">${esc(meal.type.toUpperCase())} · ${meal.time}</p>
      <h2>${esc(meal.name)}</h2>
      <b class="green-text">${meal.calories} kcal · ${meal.protein}g protein · ${meal.carbs || 45}g carbs</b>

      <h3>Ingredients</h3>
      <p>${(meal.ingredients || []).map(esc).join(' · ')}</p>

      <h3>Preparation Method</h3>
      <p>${esc(meal.recipe)}</p>

      <h3>Smart Substitutions & Variations</h3>
      <div class="chips">
        ${(meal.swaps || []).map((s) => `<span>🔄 ${esc(s)}</span>`).join('')}
      </div>

      <div style="display:flex;gap:10px;margin-top:16px;">
        <button type="button" class="primary" id="dialogSwapBtn" style="margin-top:0;">Swap to next variation</button>
      </div>
    </form>
  `;
  dialog.showModal();

  const swapBtn = dialog.querySelector('#dialogSwapBtn');
  if (swapBtn) {
    swapBtn.addEventListener('click', () => {
      swapMeal(meal.type);
      dialog.close();
    });
  }
}

function showSnackLogger() {
  const dialog = document.querySelector('#profileDialog');
  dialog.innerHTML = `
    <form method="dialog" class="dialog-card">
      <button class="close">×</button>
      <p class="eyebrow">QUICK FOOD LOGGING</p>
      <h2>Log Extra Food or Snack</h2>
      <p>Select a common whole food item to add to your daily calories and protein totals.</p>

      <div style="display:grid;gap:8px;margin:16px 0;">
        ${quickSnacks.map((snack, idx) => `
          <button type="button" class="chip-btn" data-snack-idx="${idx}" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-radius:12px;border:1px solid var(--border-card);text-align:left;">
            <span><strong>${esc(snack.name)}</strong></span>
            <span>${snack.calories} kcal · ${snack.protein}g P</span>
          </button>
        `).join('')}
      </div>
    </form>
  `;
  dialog.showModal();

  dialog.querySelectorAll('[data-snack-idx]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = quickSnacks[Number(btn.dataset.snackIdx)];
      if (item) {
        state.extraCalories = (state.extraCalories || 0) + item.calories;
        state.extraProtein = (state.extraProtein || 0) + item.protein;
        state.extraFoods = state.extraFoods || [];
        state.extraFoods.push(item);
        save();
        dialog.close();
        render();
      }
    });
  });
}

function showProfile() {
  const p = state.profile;
  const dialog = document.querySelector('#profileDialog');
  dialog.innerHTML = `
    <form method="dialog" class="dialog-card profile-form">
      <button class="close">×</button>
      <p class="eyebrow">HEALTH PROFILE</p>
      <h2>Keep your plan personal</h2>

      <label>Full Name
        <input name="name" value="${esc(p.name)}" required>
      </label>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <label>Age (years)
          <input name="age" type="number" value="${p.age}" required>
        </label>
        <label>Gender
          <select name="gender">
            <option ${p.gender === 'Male' ? 'selected' : ''}>Male</option>
            <option ${p.gender === 'Female' ? 'selected' : ''}>Female</option>
            <option ${p.gender === 'Other' ? 'selected' : ''}>Other</option>
          </select>
        </label>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <label>Height (cm)
          <input name="height" type="number" value="${p.height}" required>
        </label>
        <label>Current Weight (kg)
          <input name="weight" type="number" value="${p.weight}" required>
        </label>
      </div>

      <label>Target Goal Weight (kg)
        <input name="targetWeight" type="number" value="${p.targetWeight || 65}" required>
      </label>

      <label>Activity Level
        <select name="activity">
          <option ${p.activity === 'Low' ? 'selected' : ''}>Low (Sedentary)</option>
          <option ${p.activity === 'Moderate' ? 'selected' : ''}>Moderate (3-4 days/week)</option>
          <option ${p.activity === 'High' ? 'selected' : ''}>High (Athlete / intense daily)</option>
        </select>
      </label>

      <label>Fitness Goal
        <select name="goal">
          <option ${p.goal === 'Lose weight' ? 'selected' : ''}>Lose weight</option>
          <option ${p.goal === 'Maintain' ? 'selected' : ''}>Maintain</option>
          <option ${p.goal === 'Gain muscle' ? 'selected' : ''}>Gain muscle</option>
        </select>
      </label>

      <label>Food Preference
        <select name="preference">
          <option ${p.preference === 'Vegetarian' ? 'selected' : ''}>Vegetarian</option>
          <option ${p.preference === 'Vegan' ? 'selected' : ''}>Vegan</option>
          <option ${p.preference === 'Eggetarian' ? 'selected' : ''}>Eggetarian</option>
          <option ${p.preference === 'Non-Vegetarian' ? 'selected' : ''}>Non-Vegetarian</option>
        </select>
      </label>

      <label>Allergies & Restrictions
        <input name="allergies" value="${esc(p.allergies)}">
      </label>

      <button class="primary" type="submit">Update Health Profile & Plan</button>
    </form>
  `;
  dialog.showModal();

  dialog.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    Object.assign(p, {
      name: form.get('name'),
      age: Number(form.get('age')),
      gender: form.get('gender'),
      height: Number(form.get('height')),
      weight: Number(form.get('weight')),
      targetWeight: Number(form.get('targetWeight')),
      activity: form.get('activity')?.toString().split(' ')[0],
      goal: form.get('goal'),
      preference: form.get('preference'),
      allergies: form.get('allergies')
    });
    save();
    dialog.close();
    render();
  });
}

function showAuthModal() {
  const u = state.user || {};
  const dialog = document.querySelector('#profileDialog');
  dialog.innerHTML = `
    <form method="dialog" class="dialog-card profile-form">
      <button class="close">×</button>
      <p class="eyebrow">USER AUTHENTICATION</p>
      <h2>${u.isLoggedIn ? 'Account Session' : 'Sign in to Daylight'}</h2>

      ${u.isLoggedIn ? `
        <div style="padding:14px;background:var(--bg-app);border-radius:12px;margin:10px 0;">
          <strong>Logged in as:</strong> ${esc(u.name || state.profile.name)}
          <br><small style="color:var(--text-muted);">${esc(u.email || 'adarsh@daylight.app')}</small>
        </div>
        <button type="button" class="secondary-btn" id="logoutBtn" style="color:#d9534f;">Log out / Switch User</button>
      ` : `
        <label>Email address
          <input type="email" id="authEmail" placeholder="you@domain.com" value="user@daylight.app" required />
        </label>
        <label>Password
          <input type="password" id="authPass" placeholder="••••••••" value="demo1234" required />
        </label>
        <button type="button" class="primary" id="loginBtn">Sign In</button>
        <button type="button" class="secondary-btn" id="guestBtn">Continue as Guest</button>
      `}
    </form>
  `;
  dialog.showModal();

  const logoutBtn = dialog.querySelector('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      state.user = { isLoggedIn: false, name: 'Guest', email: '' };
      save();
      dialog.close();
      render();
    });
  }

  const loginBtn = dialog.querySelector('#loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const email = dialog.querySelector('#authEmail')?.value || 'user@daylight.app';
      const name = email.split('@')[0] || 'User';
      state.user = { isLoggedIn: true, name, email };
      state.profile.name = name;
      save();
      dialog.close();
      render();
    });
  }

  const guestBtn = dialog.querySelector('#guestBtn');
  if (guestBtn) {
    guestBtn.addEventListener('click', () => {
      state.user = { isLoggedIn: true, name: 'Guest User', email: 'guest@daylight.app' };
      save();
      dialog.close();
      render();
    });
  }
}

function showApiKeyModal() {
  const currentKey = state.customApiKey || AI_CONFIG.apiKey;
  const dialog = document.querySelector('#profileDialog');
  dialog.innerHTML = `
    <form method="dialog" class="dialog-card profile-form">
      <button class="close">×</button>
      <p class="eyebrow">AI CONFIGURATION</p>
      <h2>Connect Live AI Models</h2>
      <p>Enter your Google Gemini or OpenAI API key. Leave blank to run Daylight's fast local recommendation engine.</p>

      <label>Google Gemini / OpenAI API Key
        <input type="password" id="apiKeyInput" placeholder="AIzaSy..." value="${esc(currentKey)}" />
      </label>

      <button type="button" class="primary" id="saveKeyBtn">Save API Key</button>
      <button type="button" class="secondary-btn" id="clearKeyBtn">Revert to Demo Mode</button>
    </form>
  `;
  dialog.showModal();

  const saveKeyBtn = dialog.querySelector('#saveKeyBtn');
  if (saveKeyBtn) {
    saveKeyBtn.addEventListener('click', () => {
      const val = dialog.querySelector('#apiKeyInput')?.value.trim() || '';
      state.customApiKey = val;
      AI_CONFIG.apiKey = val;
      save();
      dialog.close();
      alert(val ? 'API Key saved successfully! Daylight will call live AI models.' : 'Running in local/demo mode.');
      render();
    });
  }

  const clearKeyBtn = dialog.querySelector('#clearKeyBtn');
  if (clearKeyBtn) {
    clearKeyBtn.addEventListener('click', () => {
      state.customApiKey = '';
      AI_CONFIG.apiKey = '';
      save();
      dialog.close();
      render();
    });
  }
}

// ----------------------------------------------------------------------------
// 🤖 AI WELLNESS CHAT ENGINE (Rule-based Fallback + Live Gemini/OpenAI API)
// ----------------------------------------------------------------------------
function openAiChat() {
  const aiDialog = document.querySelector('#aiDialog');
  if (!aiDialog) return;

  const keyToUse = state.customApiKey || AI_CONFIG.apiKey;
  const isLive = !!keyToUse;

  aiDialog.innerHTML = `
    <header class="ai-chat-header">
      <div class="ai-header-info">
        <div class="ai-avatar">✨</div>
        <div>
          <strong>Daylight AI Coach</strong>
          <small>${isLive ? '🟢 Live Gemini Model' : '⚡ Local Wellness Engine (Offline)'}</small>
        </div>
      </div>
      <button class="close" id="closeAiChat" style="color:#fff;background:rgba(255,255,255,0.2);">×</button>
    </header>

    ${!isLive ? `
      <div class="ai-api-notice">
        <span>Running in Local Mode. Want live Gemini responses?</span>
        <button id="addKeyFromChat">Add API Key</button>
      </div>
    ` : ''}

    <div class="ai-chat-messages" id="aiChatMessages">
      ${(state.chatMessages || []).map((m) => `
        <div class="ai-msg ${m.sender}">
          <div>${esc(m.text).replace(/\n/g, '<br>')}</div>
          <time>${m.time || ''}</time>
        </div>
      `).join('')}
    </div>

    <div class="ai-prompts" id="aiPromptsBar">
      <button class="prompt-chip" data-prompt="Suggest a high-protein vegetarian dinner">🥗 High-protein dinner</button>
      <button class="prompt-chip" data-prompt="How much water should I drink after a 30m workout?">💧 Post-workout hydration</button>
      <button class="prompt-chip" data-prompt="What can I swap paneer with for less fat?">🔄 Low-fat paneer swap</button>
      <button class="prompt-chip" data-prompt="Give me 3 tips for deeper restorative sleep">🌙 Sleep hygiene tips</button>
    </div>

    <div class="ai-chat-input-bar">
      <input type="text" id="aiChatInput" placeholder="Ask about meals, calories, routines..." autocomplete="off" />
      <button class="ai-send-btn" id="aiSendBtn" aria-label="Send message">➤</button>
    </div>
  `;

  aiDialog.showModal();

  const msgContainer = aiDialog.querySelector('#aiChatMessages');
  if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;

  // Close
  aiDialog.querySelector('#closeAiChat')?.addEventListener('click', () => aiDialog.close());

  // API Key link
  aiDialog.querySelector('#addKeyFromChat')?.addEventListener('click', () => {
    aiDialog.close();
    showApiKeyModal();
  });

  // Prompt chips
  aiDialog.querySelectorAll('[data-prompt]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const input = aiDialog.querySelector('#aiChatInput');
      if (input) {
        input.value = chip.dataset.prompt;
        submitAiChat();
      }
    });
  });

  // Send button & enter key
  aiDialog.querySelector('#aiSendBtn')?.addEventListener('click', submitAiChat);
  aiDialog.querySelector('#aiChatInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitAiChat();
  });
}

async function submitAiChat() {
  const input = document.querySelector('#aiChatInput');
  const msgContainer = document.querySelector('#aiChatMessages');
  if (!input || !msgContainer) return;

  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add User Message
  state.chatMessages = state.chatMessages || [];
  state.chatMessages.push({ sender: 'user', text, time: now });
  renderChatMessages();

  // Show Typing Indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'typing-indicator';
  typingDiv.id = 'typingBubble';
  typingDiv.innerHTML = `<span></span><span></span><span></span>`;
  msgContainer.appendChild(typingDiv);
  msgContainer.scrollTop = msgContainer.scrollHeight;

  // Decide between Live API or Intelligent Local Engine
  const keyToUse = state.customApiKey || AI_CONFIG.apiKey;

  try {
    let reply = '';
    if (keyToUse) {
      reply = await callLiveGeminiApi(text, keyToUse);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 600)); // natural latency
      reply = generateLocalAiResponse(text);
    }

    typingDiv.remove();
    state.chatMessages.push({ sender: 'assistant', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    save();
    renderChatMessages();
  } catch (err) {
    typingDiv.remove();
    const fallbackReply = generateLocalAiResponse(text);
    state.chatMessages.push({
      sender: 'assistant',
      text: `${fallbackReply}\n\n*(Note: Live API encountered a network issue; answered via Local Wellness Engine)*`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    save();
    renderChatMessages();
  }
}

function renderChatMessages() {
  const msgContainer = document.querySelector('#aiChatMessages');
  if (!msgContainer) return;

  msgContainer.innerHTML = (state.chatMessages || []).map((m) => `
    <div class="ai-msg ${m.sender}">
      <div>${esc(m.text).replace(/\n/g, '<br>')}</div>
      <time>${m.time || ''}</time>
    </div>
  `).join('');
  msgContainer.scrollTop = msgContainer.scrollHeight;
}

// ----------------------------------------------------------------------------
// LOCAL WELLNESS INTEL ENGINE (Context-Aware Q&A)
// ----------------------------------------------------------------------------
function generateLocalAiResponse(prompt) {
  const q = prompt.toLowerCase();
  const p = state.profile;
  const h = health();

  if (q.includes('protein') || q.includes('high protein')) {
    return `For your ${p.preference.toLowerCase()} target of ${h.protein}g protein daily:
• Paneer & Greek Yogurt: 18–22g protein per serving.
• Soya Chunks & Tofu: Up to 52g protein per 100g dry soya.
• Lentils & Moong Chilla: Easy on digestion with 20g+ protein.
• Post-workout: Add a plant protein or whey scoop with water for 24g immediate bioavailable protein.`;
  }

  if (q.includes('water') || q.includes('hydrate') || q.includes('hydration')) {
    return `Based on your body weight of ${p.weight} kg, your optimal baseline is ${h.water} ml (~${(h.water / 1000).toFixed(1)} Liters).
• Drink 500 ml warm water right after waking up.
• Sip 250 ml every 90–120 minutes.
• Add an extra 350–500 ml after your 30-minute workout to restore lost fluids.`;
  }

  if (q.includes('swap') || q.includes('alternative') || q.includes('paneer') || q.includes('replace')) {
    return `Great nutrition alternatives for your plan:
• Instead of Paneer: Firm Tofu (35% fewer calories, higher iron) or Boiled Chickpeas.
• Instead of White Rice: Fluffy Quinoa, Foxtail Millets, or Brown Basmati.
• Instead of Bread: Moong Dal Chilla or Whole Wheat Multigrain Roti.`;
  }

  if (q.includes('sleep') || q.includes('tired') || q.includes('insomnia')) {
    return `Top 3 evidence-based sleep habits for Daylight routine:
1. Digital Sunset: Turn off bright mobile screens 45 minutes before 10:30 PM.
2. Timing: Keep dinner light (e.g. Moong dal khichdi) at least 2.5 hours before lying down.
3. Temperature: Keep your bedroom cool (around 20–22°C) for deeper REM sleep cycles.`;
  }

  if (q.includes('workout') || q.includes('exercise') || q.includes('cardio')) {
    return `For your ${p.goal.toLowerCase()} goal:
• Recommended: 30 minutes of moderate activity daily (brisk walking, bodyweight squats, push-ups, or cycling).
• Pre-workout fuel: 1 banana or a handful of roasted makhana 30 mins prior.
• Current logged today: ${state.exercise} minutes.`;
  }

  if (q.includes('weight') || q.includes('lose') || q.includes('gain') || q.includes('calorie')) {
    return `Your calculated daily target is ${h.calories} kcal (BMR: ${h.bmr} kcal).
• To reach ${p.targetWeight || 65} kg safely, maintain a consistent 300–400 kcal deficit without skipping protein.
• Track your 5 scheduled meals and drink water before every meal to prevent accidental overeating.`;
  }

  return `Here is a personalized wellness tip for you, ${p.name}:
You are aiming for ${h.calories} kcal and ${h.protein}g protein today. Keep consistency across your hydration (${state.water}/${h.water} ml) and evening sleep schedule.
Feel free to ask me for specific recipe ideas, macro checks, or ingredient swaps!`;
}

// ----------------------------------------------------------------------------
// LIVE GEMINI REST API INTEGRATION
// ----------------------------------------------------------------------------
async function callLiveGeminiApi(promptText, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${AI_CONFIG.geminiModel}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: `${AI_CONFIG.systemInstruction}\nUser Profile: Name: ${state.profile.name}, Goal: ${state.profile.goal}, Preference: ${state.profile.preference}, Calories: ${health().calories} kcal.\nUser question: ${promptText}` }
        ]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const candidate = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return candidate || 'I have analyzed your request. Please maintain your daily meal and hydration schedule.';
}

// ----------------------------------------------------------------------------
// INITIALIZATION
// ----------------------------------------------------------------------------
document.querySelector('#profileButton')?.addEventListener('click', showProfile);
document.querySelector('#aiFab')?.addEventListener('click', openAiChat);
document.querySelector('#themeToggle')?.addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  save();
  render();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' });
  });
}

// Deep-link query parameters (?view=plan, ?view=track, etc.)
const urlParams = new URLSearchParams(window.location.search);
const viewParam = urlParams.get('view');
if (viewParam && ['today', 'plan', 'track', 'grocery', 'profile'].includes(viewParam)) {
  currentView = viewParam;
}

// Render Initial UI
render();
