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
const defaultAdminUsers = [
  { id: 1, name: 'Adarsh S', email: 'adarsh@daylight.app', role: 'Member', age: 24, gender: 'Male', weight: 68, height: 174, goal: 'Maintain', preference: 'Vegetarian', calories: 2050, water: 2380, score: 79, status: 'Active', allergies: 'None' },
  { id: 2, name: 'Priya Sharma', email: 'priya.s@example.com', role: 'Member', age: 28, gender: 'Female', weight: 58, height: 162, goal: 'Lose weight', preference: 'Eggetarian', calories: 1620, water: 2050, score: 84, status: 'Active', allergies: 'Lactose intolerant' },
  { id: 3, name: 'Rahul Verma', email: 'rahul.v@example.com', role: 'Member', age: 31, gender: 'Male', weight: 76, height: 178, goal: 'Gain muscle', preference: 'Non-Vegetarian', calories: 2450, water: 2650, score: 71, status: 'Active', allergies: 'None' },
  { id: 4, name: 'Ananya Patel', email: 'ananya.p@example.com', role: 'Member', age: 22, gender: 'Female', weight: 52, height: 159, goal: 'Maintain', preference: 'Vegan', calories: 1780, water: 1820, score: 92, status: 'Active', allergies: 'Peanuts' },
  { id: 5, name: 'Vikram Singh', email: 'vikram.s@example.com', role: 'Member', age: 35, gender: 'Male', weight: 82, height: 171, goal: 'Lose weight', preference: 'Vegetarian', calories: 1890, water: 2870, score: 68, status: 'Idle', allergies: 'Gluten sensitivity' }
];

const defaultState = {
  user: {
    isLoggedIn: true,
    name: 'Adarsh',
    email: 'adarsh@daylight.app',
    role: 'user'
  },
  adminUsers: defaultAdminUsers,
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
if (!state.adminUsers) state.adminUsers = structuredClone(defaultAdminUsers);
let currentView = state.user?.isLoggedIn ? 'today' : 'auth';
let authTab = 'signin';
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
    profile: renderProfile,
    admin: renderAdmin,
    auth: renderAuth
  };

  const adminNavBtn = document.querySelector('#adminNavBtn');
  const bottomNav = document.querySelector('#bottomNav');
  const aiFab = document.querySelector('#aiFab');

  if (bottomNav) {
    if (currentView === 'auth') {
      bottomNav.style.display = 'none';
      if (aiFab) aiFab.style.display = 'none';
    } else {
      bottomNav.style.display = 'grid';
      if (aiFab) aiFab.style.display = 'inline-flex';
    }
  }

  if (adminNavBtn && bottomNav) {
    if (state.user && state.user.role === 'admin') {
      adminNavBtn.style.display = 'block';
      bottomNav.classList.add('has-admin');
    } else {
      adminNavBtn.style.display = 'none';
      bottomNav.classList.remove('has-admin');
    }
  }

  app.innerHTML = views[currentView] ? views[currentView]() : renderToday();
  document.querySelectorAll('.nav-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === currentView);
  });
  bindActions();
}

function updateTopbar() {
  const avatar = document.querySelector('#profileButton');
  if (avatar) {
    const initials = state.user?.role === 'admin' ? 'AD' : (state.profile.name ? state.profile.name.slice(0, 2).toUpperCase() : 'AS');
    avatar.textContent = initials;
  }
  const themeBtn = document.querySelector('#themeToggle');
  if (themeBtn) {
    themeBtn.textContent = state.theme === 'dark' ? '☀️' : '🌙';
  }

  const logoutBtn = document.querySelector('#logoutBtnTopbar');
  if (logoutBtn) {
    logoutBtn.textContent = state.user?.isLoggedIn ? '🚪' : '🔑';
    logoutBtn.title = state.user?.isLoggedIn ? 'Log out / Switch account' : 'Sign in / Register';
  }

  const topbar = document.querySelector('.topbar');
  let adminPill = document.querySelector('#topbarAdminPill');
  if (state.user && state.user.role === 'admin') {
    if (!adminPill && topbar) {
      adminPill = document.createElement('button');
      adminPill.id = 'topbarAdminPill';
      adminPill.className = 'admin-pill';
      adminPill.textContent = '👑 Admin';
      adminPill.addEventListener('click', () => { currentView = 'admin'; render(); });
      topbar.insertBefore(adminPill, document.querySelector('#logoutBtnTopbar') || document.querySelector('#profileButton'));
    }
  } else if (adminPill) {
    adminPill.remove();
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

  const routineItems = [
    { key: 'wake', time: '07:00 AM', title: 'Wake up & 500 ml Warm Water', desc: 'Hydrate and kickstart digestion' },
    { key: 'breakfast', time: '08:00 AM', title: 'Nutritious Breakfast & Focus', desc: 'Complex carbs and 20g+ protein' },
    { key: 'midHydrate', time: '11:00 AM', title: 'Mid-day Hydration & Light Stretch', desc: 'Posture check, green tea or seasonal fruit' },
    { key: 'lunch', time: '01:30 PM', title: 'Balanced Lunch & 10-Min Walk', desc: 'Fiber, greens, protein, and light movement' },
    { key: 'workout', time: '05:30 PM', title: '30-Min Workout / Brisk Walk', desc: 'Resistance training or aerobic exercise' },
    { key: 'dinner', time: '08:00 PM', title: 'Light Dinner (2+ hours before bed)', desc: 'Gentle on digestion, whole grains & lentils' },
    { key: 'sleepRoutine', time: '10:30 PM', title: 'Screen-off & Restorative Sleep', desc: 'Cool room temperature, target 7–8 hours' }
  ];
  const completedRoutineCount = routineItems.filter((i) => !!routine[i.key]).length;
  const completedMealCount = ['Breakfast', 'Lunch', 'Dinner'].filter((m) => !!state.mealsDone[m]).length;

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
        <div>
          <h2>Daily Routine Schedule</h2>
          <p class="subtle" style="margin-bottom:0;font-size:12px;">Evidence-based circadian habits for energy, digestion & recovery.</p>
        </div>
        <span class="adherence-badge">${completedRoutineCount} / ${routineItems.length} Done</span>
      </div>
      <div class="timeline">
        ${routineItems.map((item) => {
          const isDone = !!routine[item.key];
          return `
            <div class="timeline-item ${isDone ? 'done' : ''}" data-routine-item="${item.key}">
              <span class="timeline-time">${item.time}</span>
              <div class="timeline-content">
                <strong>${item.title}</strong>
                <small>${item.desc}</small>
              </div>
              <label class="custom-checkbox timeline-check">
                <input type="checkbox" data-routine="${item.key}" ${isDone ? 'checked' : ''} aria-label="Mark ${item.title} completed" />
                <span class="custom-check-box">
                  <svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6.5-6.5"/></svg>
                </span>
              </label>
            </div>
          `;
        }).join('')}
      </div>
    </section>

    <!-- Main Meal Adherence Section -->
    <section class="meal-adherence-section">
      <div class="section-title">
        <div>
          <h2>Main Meal Adherence</h2>
          <p class="subtle" style="margin-bottom:0;font-size:12px;">Log scheduled meals to maintain metabolic rate and earn wellness points.</p>
        </div>
        <span class="adherence-badge">${completedMealCount} / 3 Logged</span>
      </div>

      <div class="meal-adherence-grid">
        ${[
          { key: 'Breakfast', name: 'Breakfast', icon: '🥣', desc: 'Kickstart metabolic energy & focus' },
          { key: 'Lunch', name: 'Lunch', icon: '🥗', desc: 'Midday fiber & sustained afternoon stamina' },
          { key: 'Dinner', name: 'Dinner', icon: '🍲', desc: 'Gentle on digestion, restorative rest' }
        ].map((item) => {
          const isDone = !!state.mealsDone[item.key];
          return `
            <div class="adherence-card ${isDone ? 'completed' : ''}" data-meal-card="${item.key}">
              <div class="adherence-card-left">
                <span class="adherence-icon">${item.icon}</span>
                <div class="adherence-info">
                  <strong>${item.name}</strong>
                  <small>${item.desc}</small>
                </div>
              </div>
              <div class="adherence-card-right">
                <span class="pts-pill ${isDone ? 'pts-active' : ''}">+15 pts</span>
                <label class="custom-checkbox">
                  <input type="checkbox" data-meal-check="${item.key}" ${isDone ? 'checked' : ''} aria-label="Mark ${item.name} completed" />
                  <span class="custom-check-box">
                    <svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6.5-6.5"/></svg>
                  </span>
                </label>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>
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
          <div class="grocery ${item.purchased ? 'purchased' : ''}" data-grocery-card="${globalIndex}">
            <label class="custom-checkbox">
              <input type="checkbox" data-grocery="${globalIndex}" ${item.purchased ? 'checked' : ''} aria-label="Mark ${esc(item.name)} purchased">
              <span class="custom-check-box">
                <svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6.5-6.5"/></svg>
              </span>
            </label>
            <span class="grocery-title">
              <b>${esc(item.name)}</b>
              <small>${esc(item.quantity || '')}</small>
            </span>
            <span class="grocery-tag">${esc(item.category || 'Pantry')}</span>
          </div>
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
          <button data-action="auth-modal">Switch account →</button>
          <button data-action="logout" style="color:#d9534f;font-weight:700;">🚪 Log out</button>
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

// 6. ADMIN CONSOLE VIEW (For Administrator role)
function renderAdmin() {
  const users = state.adminUsers || defaultAdminUsers;
  const activeCount = users.filter((u) => u.status === 'Active').length;
  const avgScore = Math.round(users.reduce((acc, u) => acc + (u.score || 75), 0) / users.length);
  const totalMeals = Object.values(mealCatalog).reduce((acc, list) => acc + list.length, 0);

  return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
      <p class="eyebrow" style="margin-bottom:0;">ADMINISTRATION CONSOLE</p>
      <span class="admin-badge">👑 Super Admin</span>
    </div>
    <h1>System Dashboard</h1>
    <p class="subtle">Monitor registered users, health analytics, and manage the nutrition catalog.</p>

    <!-- Admin Overview Stat Grid -->
    <div class="admin-stat-grid">
      <div class="admin-stat-card">
        <small>REGISTERED USERS</small>
        <strong>${users.length}</strong>
        <span>${activeCount} currently active</span>
      </div>
      <div class="admin-stat-card">
        <small>AVG WELLNESS SCORE</small>
        <strong>${avgScore}/100</strong>
        <span>High system adherence</span>
      </div>
      <div class="admin-stat-card">
        <small>FOOD CATALOG ITEMS</small>
        <strong>${totalMeals} Recipes</strong>
        <span>Across 5 daily meal slots</span>
      </div>
      <div class="admin-stat-card">
        <small>RECOMMENDATION ENGINE</small>
        <strong>Active</strong>
        <span>Scikit-learn rules online</span>
      </div>
    </div>

    <!-- Quick Role Switcher Bar -->
    <div style="display:flex;gap:10px;margin-bottom:24px;">
      <button class="chip-btn" data-action="switch-user-view" style="font-size:12px;padding:8px 14px;">👁️ View App as User</button>
      <button class="chip-btn" data-action="open-add-recipe-modal" style="font-size:12px;padding:8px 14px;background:var(--primary);color:#fff;">+ Add New Recipe</button>
      <button class="chip-btn" data-action="auth-modal" style="font-size:12px;padding:8px 14px;color:#d9534f;margin-left:auto;">🚪 Switch / Logout</button>
    </div>

    <!-- User Management Section -->
    <div class="section-title">
      <h2>Registered Users Directory (${users.length})</h2>
      <span style="font-size:11px;color:var(--text-muted);">Tap user to view audit</span>
    </div>

    <div class="user-list">
      ${users.map((u) => `
        <div class="user-card" data-admin-user="${u.id}" role="button" tabindex="0">
          <div class="user-card-header">
            <div>
              <strong>${esc(u.name)}</strong>
              <small style="display:block;color:var(--text-muted);">${esc(u.email)}</small>
            </div>
            <span class="${u.status === 'Active' ? 'user-status-active' : 'user-status-idle'}">${u.status}</span>
          </div>

          <div class="user-meta-grid">
            <div class="user-meta-item">
              <span>Goal</span>
              <b>${esc(u.goal)}</b>
            </div>
            <div class="user-meta-item">
              <span>Target Cal</span>
              <b>${u.calories} kcal</b>
            </div>
            <div class="user-meta-item">
              <span>Score</span>
              <b style="color:var(--primary);">${u.score}/100</b>
            </div>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;font-size:11px;color:var(--text-muted);">
            <span>${esc(u.gender)}, ${u.age}y · ${u.weight}kg · ${esc(u.preference)}</span>
            <span style="color:var(--primary);font-weight:700;font-size:10px;">Inspect Details →</span>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Recipe Catalog Management -->
    <div class="section-title" style="margin-top:28px;">
      <h2>Recipe Database Management</h2>
      <button data-action="open-add-recipe-modal">+ Add Recipe</button>
    </div>

    <div class="recipe-admin-list">
      ${Object.keys(mealCatalog).map((slot) => `
        <h3 style="margin-top:14px;font-size:13px;color:var(--primary);">${slot.toUpperCase()} (${mealCatalog[slot].length})</h3>
        ${mealCatalog[slot].map((recipe, rIdx) => `
          <div class="recipe-admin-item">
            <div>
              <strong>${esc(recipe.name)}</strong>
              <small>${recipe.calories} kcal · ${recipe.protein}g P · ${recipe.carbs || 45}g C · ${recipe.fats || 12}g F</small>
            </div>
            <button class="recipe-delete-btn" data-delete-slot="${slot}" data-delete-idx="${rIdx}" title="Delete recipe">✕ Delete</button>
          </div>
        `).join('')}
      `).join('')}
    </div>
  `;
}

// 7. SIGN IN / REGISTER FULL SCREEN VIEW
function renderAuth() {
  return `
    <div class="auth-view">
      <div class="auth-hero">
        <div class="brand-mark">P</div>
        <h1>Daylight Wellness</h1>
        <p class="subtle" style="margin-bottom:0;">Personalized Diet and Daily Routine Recommendation System (PDDR)</p>
      </div>

      <div class="auth-card">
        <div class="auth-tabs">
          <button class="auth-tab ${authTab === 'signin' ? 'active' : ''}" data-auth-tab="signin">Sign In</button>
          <button class="auth-tab ${authTab === 'register' ? 'active' : ''}" data-auth-tab="register">Register / Sign Up</button>
        </div>

        ${authTab === 'signin' ? `
          <div style="margin-bottom:14px;">
            <small style="display:block;color:var(--text-muted);margin-bottom:8px;font-size:11px;font-weight:700;">QUICK DEMO CREDENTIALS</small>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button type="button" class="chip-btn" id="quickFillUser">👤 Demo User</button>
              <button type="button" class="chip-btn" id="quickFillAdmin" style="background:#fbe8d5;color:#8e501b;">👑 Demo Admin (12345678)</button>
            </div>
          </div>

          <form id="pageSignInForm" class="profile-form">
            <label>Email address
              <input type="email" id="pageEmail" placeholder="you@domain.com" value="user@daylight.app" required />
            </label>

            <label>Password
              <input type="password" id="pagePassword" placeholder="••••••••" value="demo1234" required />
            </label>

            <button type="submit" class="primary" style="margin-top:14px;">Sign In to Daylight</button>
            <button type="button" class="secondary-btn" data-action="guest-login">Continue as Guest User</button>
          </form>
        ` : `
          <form id="pageRegisterForm" class="profile-form">
            <label>Full Name
              <input type="text" id="regName" placeholder="e.g. Adarsh Patil" required />
            </label>

            <label>Email Address
              <input type="email" id="regEmail" placeholder="you@example.com" required />
            </label>

            <label>Create Password
              <input type="password" id="regPassword" placeholder="At least 6 characters" minlength="6" required />
            </label>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <label>Age (years)
                <input type="number" id="regAge" placeholder="24" value="24" required />
              </label>
              <label>Gender
                <select id="regGender">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <label>Current Weight (kg)
                <input type="number" id="regWeight" placeholder="68" value="68" required />
              </label>
              <label>Height (cm)
                <input type="number" id="regHeight" placeholder="174" value="174" required />
              </label>
            </div>

            <label>Health & Fitness Goal
              <select id="regGoal">
                <option value="Maintain">Maintain current weight</option>
                <option value="Lose weight">Lose weight / Calorie deficit</option>
                <option value="Gain muscle">Gain muscle / High protein</option>
              </select>
            </label>

            <label>Dietary Preference
              <select id="regPref">
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Eggetarian">Eggetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
            </label>

            <button type="submit" class="primary" style="margin-top:14px;">Register & Create My Plan →</button>
            <button type="button" class="secondary-btn" data-auth-tab="signin">Already registered? Sign In</button>
          </form>
        `}
      </div>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// EVENT BINDINGS & ACTIONS
// ----------------------------------------------------------------------------
function bindActions() {
  // Navigation
  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      closeAiChat();
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

  // Auth Tab Toggles
  document.querySelectorAll('[data-auth-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      authTab = tab.dataset.authTab;
      render();
    });
  });

  // Quick Demo Autofill on Auth Page
  const quickUser = document.querySelector('#quickFillUser');
  if (quickUser) {
    quickUser.addEventListener('click', () => {
      const emailInput = document.querySelector('#pageEmail');
      const passInput = document.querySelector('#pagePassword');
      if (emailInput && passInput) {
        emailInput.value = 'user@daylight.app';
        passInput.value = 'demo1234';
      }
    });
  }

  const quickAdmin = document.querySelector('#quickFillAdmin');
  if (quickAdmin) {
    quickAdmin.addEventListener('click', () => {
      const emailInput = document.querySelector('#pageEmail');
      const passInput = document.querySelector('#pagePassword');
      if (emailInput && passInput) {
        emailInput.value = 'admin@daylight.com';
        passInput.value = '12345678';
      }
    });
  }

  // Page Sign In Form Submit
  const pageSignInForm = document.querySelector('#pageSignInForm');
  if (pageSignInForm) {
    pageSignInForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.querySelector('#pageEmail')?.value.trim() || '';
      const pass = document.querySelector('#pagePassword')?.value || '';

      if (email.toLowerCase() === 'admin@daylight.com') {
        if (pass === '12345678') {
          state.user = {
            isLoggedIn: true,
            name: 'System Administrator',
            email: 'admin@daylight.com',
            role: 'admin'
          };
          save();
          currentView = 'admin';
          alert('Welcome, System Administrator! Unlocked Admin Console.');
          render();
        } else {
          alert('Invalid admin credentials! Please enter password: 12345678');
        }
      } else {
        const name = email.split('@')[0] || 'Member';
        state.user = {
          isLoggedIn: true,
          name,
          email: email || 'user@daylight.app',
          role: 'user'
        };
        state.profile.name = name;
        save();
        currentView = 'today';
        render();
      }
    });
  }

  // Page Register Form Submit
  const pageRegisterForm = document.querySelector('#pageRegisterForm');
  if (pageRegisterForm) {
    pageRegisterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.querySelector('#regName')?.value.trim() || 'New Member';
      const email = document.querySelector('#regEmail')?.value.trim() || '';
      const age = Number(document.querySelector('#regAge')?.value) || 24;
      const gender = document.querySelector('#regGender')?.value || 'Male';
      const weight = Number(document.querySelector('#regWeight')?.value) || 68;
      const height = Number(document.querySelector('#regHeight')?.value) || 174;
      const goal = document.querySelector('#regGoal')?.value || 'Maintain';
      const preference = document.querySelector('#regPref')?.value || 'Vegetarian';

      // 1. Set current user session
      state.user = {
        isLoggedIn: true,
        name,
        email,
        role: 'user'
      };

      // 2. Update health profile
      Object.assign(state.profile, {
        name,
        age,
        gender,
        weight,
        height,
        goal,
        preference
      });

      // 3. Register user in admin directory
      state.adminUsers = state.adminUsers || defaultAdminUsers;
      state.adminUsers.unshift({
        id: Date.now(),
        name,
        email,
        role: 'Member',
        age,
        gender,
        weight,
        height,
        goal,
        preference,
        calories: health().calories,
        water: health().water,
        score: 78,
        status: 'Active',
        allergies: 'None'
      });

      save();
      currentView = 'today';
      alert(`Welcome to Daylight, ${name}! Your personalized nutrition and routine plan is ready.`);
      render();
    });
  }

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

  // Routine Checkboxes & Card Clicks
  document.querySelectorAll('[data-routine]').forEach((input) => {
    input.addEventListener('change', () => {
      state.routineDone = state.routineDone || {};
      state.routineDone[input.dataset.routine] = input.checked;
      save();
      render();
    });
  });
  document.querySelectorAll('[data-routine-item]').forEach((item) => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.custom-checkbox') || e.target.tagName === 'INPUT') return;
      const key = item.dataset.routineItem;
      state.routineDone = state.routineDone || {};
      state.routineDone[key] = !state.routineDone[key];
      save();
      render();
    });
  });

  // Meal Adherence Checkboxes & Card Clicks
  document.querySelectorAll('[data-meal-check]').forEach((input) => {
    input.addEventListener('change', () => {
      state.mealsDone[input.dataset.mealCheck] = input.checked;
      save();
      render();
    });
  });
  document.querySelectorAll('[data-meal-card]').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.custom-checkbox') || e.target.tagName === 'INPUT') return;
      const key = card.dataset.mealCard;
      state.mealsDone[key] = !state.mealsDone[key];
      save();
      render();
    });
  });

  // Grocery Checkboxes & Row Clicks
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
  document.querySelectorAll('[data-grocery-card]').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.custom-checkbox') || e.target.tagName === 'INPUT') return;
      const idx = Number(card.dataset.groceryCard);
      if (state.groceries[idx]) {
        state.groceries[idx].purchased = !state.groceries[idx].purchased;
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

  // Admin User Inspection Cards
  document.querySelectorAll('[data-admin-user]').forEach((card) => {
    card.addEventListener('click', () => {
      showAdminUserDetails(card.dataset.adminUser);
    });
  });

  // Admin Recipe Deletion
  document.querySelectorAll('[data-delete-slot]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const slot = btn.dataset.deleteSlot;
      const idx = Number(btn.dataset.deleteIdx);
      if (mealCatalog[slot] && mealCatalog[slot][idx]) {
        const item = mealCatalog[slot][idx];
        if (confirm(`Remove "${item.name}" from ${slot} catalog?`)) {
          mealCatalog[slot].splice(idx, 1);
          render();
        }
      }
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

  if (action === 'open-ai') {
    openAiChat();
    return;
  }
  if (action === 'config-ai-key') showApiKeyModal();
  if (action === 'edit') showProfile();
  if (action === 'auth-modal') showAuthModal();
  if (action === 'log-snack') showSnackLogger();
  if (action === 'switch-user-view') { currentView = 'today'; render(); }
  if (action === 'open-add-recipe-modal') { showAddRecipeModal(); }

  if (action === 'logout') {
    state.user = { isLoggedIn: false, name: 'Guest', email: '', role: 'user' };
    save();
    currentView = 'auth';
    authTab = 'signin';
    render();
  }

  if (action === 'guest-login') {
    state.user = { isLoggedIn: true, name: 'Guest User', email: 'guest@daylight.app', role: 'user' };
    save();
    currentView = 'today';
    render();
  }

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
      <button type="button" class="close" id="closeMealBtn" aria-label="Close dialog">×</button>
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

  dialog.querySelector('#closeMealBtn')?.addEventListener('click', () => dialog.close());
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
      <button type="button" class="close" id="closeSnackBtn" aria-label="Close dialog">×</button>
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

  dialog.querySelector('#closeSnackBtn')?.addEventListener('click', () => dialog.close());

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
      <button type="button" class="close" id="closeProfileBtn" aria-label="Close dialog">×</button>
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
      <button type="button" class="secondary-btn" id="cancelProfileBtn">Cancel</button>
    </form>
  `;
  dialog.showModal();

  dialog.querySelector('#closeProfileBtn')?.addEventListener('click', () => dialog.close());
  dialog.querySelector('#cancelProfileBtn')?.addEventListener('click', () => dialog.close());

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
      <button type="button" class="close" id="closeAuthBtn" aria-label="Close dialog">×</button>
      <p class="eyebrow">AUTHENTICATION & ACCESS</p>
      <h2>${u.isLoggedIn ? (u.role === 'admin' ? '👑 Admin Session' : '👤 User Session') : 'Sign in to Daylight'}</h2>

      ${u.isLoggedIn ? `
        <div style="padding:14px;background:var(--bg-app);border-radius:12px;margin:10px 0;">
          <strong>Logged in as:</strong> ${esc(u.name || state.profile.name)}
          <br><small style="color:var(--text-muted);">${esc(u.email)}</small>
          <br><span class="admin-badge" style="margin-top:6px;">Role: ${u.role === 'admin' ? '👑 System Administrator' : '👤 Member'}</span>
        </div>
        ${u.role === 'admin' ? `
          <button type="button" class="primary" id="openAdminFromAuth" style="margin-top:0;">Open Admin Console</button>
        ` : ''}
        <button type="button" class="secondary-btn" id="logoutBtn" style="color:#d9534f;">Log out / Switch Account</button>
      ` : `
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">Sign in as Member to track personal wellness, or as Administrator to manage system data.</p>
        
        <div style="display:flex;gap:6px;margin-bottom:12px;">
          <button type="button" class="chip-btn" id="fillUserDemoBtn">👤 User Demo</button>
          <button type="button" class="chip-btn" id="fillAdminDemoBtn" style="background:#fbe8d5;color:#8e501b;">👑 Admin Demo</button>
        </div>

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

  dialog.querySelector('#closeAuthBtn')?.addEventListener('click', () => dialog.close());

  const fillUserBtn = dialog.querySelector('#fillUserDemoBtn');
  if (fillUserBtn) {
    fillUserBtn.addEventListener('click', () => {
      dialog.querySelector('#authEmail').value = 'user@daylight.app';
      dialog.querySelector('#authPass').value = 'demo1234';
    });
  }

  const fillAdminBtn = dialog.querySelector('#fillAdminDemoBtn');
  if (fillAdminBtn) {
    fillAdminBtn.addEventListener('click', () => {
      dialog.querySelector('#authEmail').value = 'admin@daylight.com';
      dialog.querySelector('#authPass').value = '12345678';
    });
  }

  const openAdminBtn = dialog.querySelector('#openAdminFromAuth');
  if (openAdminBtn) {
    openAdminBtn.addEventListener('click', () => {
      currentView = 'admin';
      dialog.close();
      render();
    });
  }

  const logoutBtn = dialog.querySelector('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      state.user = { isLoggedIn: false, name: 'Guest', email: '', role: 'user' };
      save();
      dialog.close();
      currentView = 'today';
      render();
    });
  }

  const loginBtn = dialog.querySelector('#loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const email = dialog.querySelector('#authEmail')?.value.trim() || '';
      const pass = dialog.querySelector('#authPass')?.value || '';

      if (email.toLowerCase() === 'admin@daylight.com') {
        if (pass === '12345678') {
          state.user = {
            isLoggedIn: true,
            name: 'System Administrator',
            email: 'admin@daylight.com',
            role: 'admin'
          };
          save();
          dialog.close();
          currentView = 'admin';
          alert('Welcome, System Administrator! Unlocked Admin Console.');
          render();
        } else {
          alert('Invalid admin credentials! Please enter password: 12345678');
        }
      } else {
        const name = email.split('@')[0] || 'Member';
        state.user = {
          isLoggedIn: true,
          name,
          email: email || 'user@daylight.app',
          role: 'user'
        };
        state.profile.name = name;
        save();
        dialog.close();
        currentView = 'today';
        render();
      }
    });
  }

  const guestBtn = dialog.querySelector('#guestBtn');
  if (guestBtn) {
    guestBtn.addEventListener('click', () => {
      state.user = { isLoggedIn: true, name: 'Guest User', email: 'guest@daylight.app', role: 'user' };
      save();
      dialog.close();
      currentView = 'today';
      render();
    });
  }
}

function showAdminUserDetails(userId) {
  const user = (state.adminUsers || defaultAdminUsers).find((u) => u.id === Number(userId));
  if (!user) return;
  const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);
  const dialog = document.querySelector('#profileDialog');
  dialog.innerHTML = `
    <form method="dialog" class="dialog-card">
      <button type="button" class="close" id="closeAuditXBtn" aria-label="Close dialog">×</button>
      <p class="eyebrow">USER AUDIT · ID #${user.id}</p>
      <h2>${esc(user.name)}</h2>
      <p style="color:var(--text-muted);">${esc(user.email)} · ${user.status}</p>

      <div class="metrics" style="margin:14px 0;">
        <article class="metric mint"><small>WEIGHT</small><strong>${user.weight} <em>kg</em></strong><span>Height: ${user.height} cm</span></article>
        <article class="metric peach"><small>CALORIES</small><strong>${user.calories} <em>kcal</em></strong><span>Goal: ${esc(user.goal)}</span></article>
        <article class="metric blue"><small>BMI</small><strong>${bmi} <em>kg/m²</em></strong><span>Score: ${user.score}/100</span></article>
      </div>

      <h3>Diet & Routine Profile</h3>
      <p>
        <strong>Food Preference:</strong> ${esc(user.preference)}<br>
        <strong>Allergies / Restrictions:</strong> ${esc(user.allergies || 'None')}<br>
        <strong>Water Target:</strong> ${user.water} ml / day<br>
        <strong>Habit Compliance Score:</strong> ${user.score}/100
      </p>

      <button type="button" class="secondary-btn" id="closeAuditBtn">Close Audit</button>
    </form>
  `;
  dialog.showModal();

  dialog.querySelector('#closeAuditXBtn')?.addEventListener('click', () => dialog.close());
  dialog.querySelector('#closeAuditBtn')?.addEventListener('click', () => dialog.close());
}

function showAddRecipeModal() {
  const dialog = document.querySelector('#profileDialog');
  dialog.innerHTML = `
    <form method="dialog" class="dialog-card profile-form" id="adminAddRecipeForm">
      <button type="button" class="close" id="closeAddRecipeBtn" aria-label="Close dialog">×</button>
      <p class="eyebrow">ADMIN RECIPE CATALOG</p>
      <h2>Add New Recipe</h2>
      <p>Publish a nutritionally balanced meal to the Daylight recommendation catalog.</p>

      <label>Meal Slot
        <select name="mealSlot" required>
          <option value="Breakfast">Breakfast</option>
          <option value="Mid-morning">Mid-morning</option>
          <option value="Lunch">Lunch</option>
          <option value="Evening snack">Evening snack</option>
          <option value="Dinner">Dinner</option>
        </select>
      </label>

      <label>Recipe Name
        <input name="recipeName" placeholder="e.g. Sautéed Paneer & Broccoli Salad" required />
      </label>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <label>Calories (kcal)
          <input name="calories" type="number" placeholder="450" required />
        </label>
        <label>Protein (g)
          <input name="protein" type="number" placeholder="25" required />
        </label>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <label>Carbs (g)
          <input name="carbs" type="number" placeholder="45" value="45" />
        </label>
        <label>Fats (g)
          <input name="fats" type="number" placeholder="14" value="14" />
        </label>
      </div>

      <label>Ingredients (comma separated)
        <input name="ingredients" placeholder="Paneer, Broccoli, Olive oil, Pepper" required />
      </label>

      <label>Preparation Method
        <textarea name="recipe" rows="3" style="padding:10px;border:1px solid var(--border-card);border-radius:8px;background:var(--bg-app);font-family:inherit;font-size:12px;" placeholder="Brief cooking instructions..." required></textarea>
      </label>

      <button class="primary" type="submit">+ Publish Recipe to Catalog</button>
      <button type="button" class="secondary-btn" id="cancelAddRecipeBtn">Cancel / Discard</button>
    </form>
  `;
  dialog.showModal();

  dialog.querySelector('#closeAddRecipeBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    dialog.close();
  });
  dialog.querySelector('#cancelAddRecipeBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    dialog.close();
  });

  dialog.querySelector('#adminAddRecipeForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const slot = form.get('mealSlot');
    const name = form.get('recipeName')?.toString().trim();
    const calories = Number(form.get('calories'));
    const protein = Number(form.get('protein'));
    const carbs = Number(form.get('carbs')) || 40;
    const fats = Number(form.get('fats')) || 12;
    const ingredients = form.get('ingredients')?.toString().split(',').map((s) => s.trim()).filter(Boolean) || [];
    const recipe = form.get('recipe')?.toString().trim();

    if (slot && name && calories && mealCatalog[slot]) {
      mealCatalog[slot].push({
        name,
        calories,
        protein,
        carbs,
        fats,
        ingredients,
        recipe,
        swaps: ['Standard nutrition swap', 'Balanced dietary choice']
      });
      dialog.close();
      alert(`Success! "${name}" added to ${slot} catalog.`);
      render();
    }
  });
}

function showApiKeyModal() {
  const currentKey = state.customApiKey || AI_CONFIG.apiKey;
  const dialog = document.querySelector('#profileDialog');
  dialog.innerHTML = `
    <form method="dialog" class="dialog-card profile-form">
      <button type="button" class="close" id="closeKeyXBtn" aria-label="Close dialog">×</button>
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

  dialog.querySelector('#closeKeyXBtn')?.addEventListener('click', () => dialog.close());
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
  const modal = document.querySelector('#aiModal');
  if (!modal) return;

  const container = modal.querySelector('.ai-modal-container');
  if (!container) return;

  const keyToUse = state.customApiKey || AI_CONFIG.apiKey;
  const isLive = !!keyToUse;

  // Build/Render modal content with full preserved chat history
  container.innerHTML = `
    <header class="ai-chat-header">
      <div class="ai-header-info">
        <div class="ai-avatar">✨</div>
        <div>
          <strong id="aiModalTitle">Daylight AI Coach</strong>
          <small>${isLive ? '🟢 Live Gemini Model' : '⚡ Local Wellness Engine (Offline)'}</small>
        </div>
      </div>
      <button class="close" id="closeAiChat" aria-label="Close AI Chat" style="color:#fff;background:rgba(255,255,255,0.2);">×</button>
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

  // Display overlay
  modal.style.display = 'flex';
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');

  const msgContainer = modal.querySelector('#aiChatMessages');
  if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;

  // Close actions
  modal.querySelector('#closeAiChat')?.addEventListener('click', closeAiChat);
  modal.querySelector('#aiModalBackdrop')?.addEventListener('click', closeAiChat);

  // API Key modal
  modal.querySelector('#addKeyFromChat')?.addEventListener('click', () => {
    closeAiChat();
    showApiKeyModal();
  });

  // Prompt chips
  modal.querySelectorAll('[data-prompt]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const input = modal.querySelector('#aiChatInput');
      if (input) {
        input.value = chip.dataset.prompt;
        submitAiChat();
      }
    });
  });

  // Send button & enter key
  modal.querySelector('#aiSendBtn')?.addEventListener('click', submitAiChat);
  modal.querySelector('#aiChatInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitAiChat();
  });

  setTimeout(() => {
    modal.querySelector('#aiChatInput')?.focus();
  }, 80);
}

function closeAiChat() {
  const modal = document.querySelector('#aiModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
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

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAiChat();
    document.querySelector('#profileDialog')?.close();
  }
});

// Close profileDialog when clicking the backdrop
document.querySelector('#profileDialog')?.addEventListener('click', (e) => {
  if (e.target.id === 'profileDialog') {
    document.querySelector('#profileDialog')?.close();
  }
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
