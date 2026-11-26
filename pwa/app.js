const defaultState = {
  profile: { name: 'Adarsh', email: 'adarsh@example.com', age: 24, gender: 'Male', height: 174, weight: 68, targetWeight: 65, activity: 'Moderate', goal: 'Maintain', preference: 'Vegetarian', allergies: 'None', healthConditions: '' },
  water: 0, exercise: 0, sleep: 0, waterGoal: 3007, exerciseGoal: 30, sleepGoal: 480, caloriesConsumed: 0,
  mealPlan: [], mealPlanPreference: '', planHistory: [],
  mealCompletions: {}, mealCompletionTotals: {},
  mealsDone: { Breakfast: true, Lunch: false, Dinner: false, 'Evening snack': false },
  groceries: [['Oats', '500 g'], ['Paneer', '400 g'], ['Quinoa', '250 g'], ['Greek yogurt', '500 g'], ['Seasonal greens', '2 bunches'], ['Lentils', '500 g']].map(([name, quantity]) => ({ name, quantity, purchased: false })),
  weightHistory: [68.8, 68.5, 68.3, 68.1, 68, 67.8, 68]
};

const fallbackMeals = [
  { type: 'Breakfast', time: '08:00 AM', name: 'Masala oats & boiled eggs', calories: 420, protein: 24, carbs: 48, fat: 12, ingredients: ['Oats', 'Eggs', 'Onion', 'Tomato'], recipe: 'Cook oats with vegetables and spices. Serve with boiled eggs.', swaps: ['Tofu scramble', 'Moong chilla', 'Paneer bhurji'] },
  { type: 'Mid-morning', time: '11:00 AM', name: 'Greek yogurt with berries', calories: 180, protein: 12, carbs: 21, fat: 5, ingredients: ['Greek yogurt', 'Berries', 'Chia seeds'], recipe: 'Layer yogurt, berries and chia seeds. Chill for 10 minutes.', swaps: ['Curd', 'Soy yogurt', 'Buttermilk'] },
  { type: 'Lunch', time: '01:30 PM', name: 'Paneer quinoa power bowl', calories: 560, protein: 31, carbs: 55, fat: 21, ingredients: ['Paneer', 'Quinoa', 'Spinach', 'Cucumber'], recipe: 'Cook quinoa, pan-sear paneer and assemble with greens.', swaps: ['Tofu', 'Chickpeas', 'Brown rice'] },
  { type: 'Evening snack', time: '04:30 PM', name: 'Roasted makhana & chai', calories: 160, protein: 7, carbs: 24, fat: 5, ingredients: ['Makhana', 'Tea', 'Cardamom'], recipe: 'Dry roast makhana with a pinch of spices.', swaps: ['Roasted chickpeas', 'Popcorn', 'Peanuts'] },
  { type: 'Dinner', time: '08:00 PM', name: 'Dal, roti & seasonal greens', calories: 480, protein: 22, carbs: 68, fat: 13, ingredients: ['Lentils', 'Whole wheat flour', 'Greens'], recipe: 'Pressure cook dal, prepare rotis and saute seasonal greens.', swaps: ['Millets', 'Brown rice', 'Quinoa'] }
];
let meals = fallbackMeals;
let datasetStatus = 'Loading nutrition dataset…';
let datasetFoods = [];
let recipeCatalog = [];

function normalizeDishKey(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function getDishMatchKeys(str) {
  const raw = String(str || '').trim();
  if (!raw) return [];
  const ignoredAliases = new Set(['toasted', 'grilled', 'dry', 'curry', 'indianstyle', 'optional', 'withcoconut', 'withegg', 'withoutegg']);
  const keys = [];
  const pushKey = (val) => {
    const k = String(val || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    if (k && k.length >= 3 && !ignoredAliases.has(k) && !keys.includes(k)) keys.push(k);
  };
  pushKey(normalizeDishKey(raw));
  const parenMatches = raw.matchAll(/\(([^)]+)\)/g);
  for (const m of parenMatches) {
    const parts = m[1].split(/[;,]/);
    for (const part of parts) {
      if (part.includes('/')) {
        part.split('/').forEach((sub) => pushKey(sub));
      } else {
        pushKey(part);
      }
    }
  }
  return keys;
}

function findRecipe(foodName) {
  if (!foodName || !Array.isArray(recipeCatalog) || recipeCatalog.length === 0) return null;
  const target = String(foodName).trim().toLowerCase();
  const direct = recipeCatalog.find((r) => {
    const fName = String(r.food_name || r.foodName || '').trim().toLowerCase();
    const dTitle = String(r.dish_title || r.dishTitle || '').trim().toLowerCase();
    return fName === target || dTitle === target;
  });
  if (direct) return direct;

  const targetKeys = getDishMatchKeys(foodName);
  if (targetKeys.length === 0) return null;
  for (const tk of targetKeys) {
    const matched = recipeCatalog.find((r) => {
      const rKeys = new Set([
        ...getDishMatchKeys(r.food_name || r.foodName),
        ...getDishMatchKeys(r.dish_title || r.dishTitle)
      ]);
      return rKeys.has(tk);
    });
    if (matched) return matched;
  }
  return null;
}

async function loadRecipeCatalog() {
  if (recipeCatalog.length > 0) return recipeCatalog;
  try {
    const apiRecipes = await apiRequest('/recipes');
    if (Array.isArray(apiRecipes) && apiRecipes.length > 0) {
      recipeCatalog = apiRecipes;
      return recipeCatalog;
    }
  } catch (e) {}
  try {
    const staticRes = await fetch('./data/recipes.json');
    if (staticRes.ok) {
      recipeCatalog = await staticRes.json();
      return recipeCatalog;
    }
  } catch (e) {}
  return recipeCatalog;
}
let adminUsersData = [];
let adminPlansData = [];
let adminLoginActivityData = [];
let adminStats = null;
let adminDataLoading = false;
let adminDataLoaded = false;
let adminPollInterval = null;
let adminActivityFilter = 'all';
let adminPlanDraft = null;
let selectedPlanDay = 1;
let planViewMode = 'weekly';
let nextDayPlanData = null;
let nextDayPlanLoading = false;
let planHistoryDbData = null;
let activityRecords = { water: [], exercise: [], sleep: [] };
let activityLoaded = false;
let activityLoadingPromise = null;
let nutritionDatasetPromise = null;
let lastRenderedView = null;
let activeLoadingCount = 0;
let loadingWatchdogTimer = null;
let mealCompletionsLoadedDates = {};
let groceryLoaded = false;
let groceryLoading = false;
let groceryMeta = { daysCovered: 0, planName: '', manuallyEdited: false, planChanged: false, lastGeneratedAt: null };
let selectedGroceryKeys = new Set();
let grocerySelectionMessage = '';

const STORAGE = { state: 'daylight-state', userStates: 'daylight-user-states', users: 'daylight-users', session: 'daylight-session', theme: 'daylight-theme', adminData: 'daylight-admin-data', exchangeHistory: 'daylight-exchange-history' };
const app = document.querySelector('#app');
const dialog = document.querySelector('#profileDialog');
if (dialog) dialog.addEventListener('close', () => dialog.classList.remove('wide-dialog'));
const API_BASE = '/api';

async function apiRequest(path, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401 && session && path !== '/auth/login' && path !== '/auth/register') {
        console.warn('Session expired or unauthorized. Signing out.');
        signOut();
      }
      return { _failed: true, status: response.status, error: result.error || `API request failed (${response.status})` };
    }
    return result;
  } catch (error) {
    console.warn(`Database sync unavailable: ${error.message}`);
    return null;
  }
}

function getClientDeviceInfo() {
  const ua = navigator.userAgent || '';
  const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || (window.innerWidth <= 768 && 'ontouchstart' in window);
  const isTablet = /iPad|Tablet|PlayBook|Silk/i.test(ua) || (isMobile && window.innerWidth >= 600);
  const deviceType = isTablet ? 'Tablet' : (isMobile ? 'Mobile' : 'Desktop');
  let deviceName = '';
  if (/iPhone/i.test(ua)) deviceName = 'iPhone (iOS)';
  else if (/iPad/i.test(ua)) deviceName = 'iPad (iPadOS)';
  else if (/Android/i.test(ua)) {
    const match = ua.match(/Android\s+([0-9\.]+)/i);
    deviceName = match ? `Android ${match[1]}` : 'Android Device';
  } else if (/Windows/i.test(ua)) deviceName = 'Windows PC';
  else if (/Macintosh|Mac OS X/i.test(ua)) deviceName = 'Mac';
  else deviceName = `${deviceType} Web`;

  if (/Edg\//i.test(ua)) deviceName += ' · Edge';
  else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) deviceName += ' · Chrome';
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) deviceName += ' · Safari';
  else if (/Firefox\//i.test(ua)) deviceName += ' · Firefox';

  return { deviceType, deviceName };
}

async function useDatabaseSession(email, password, expectedRole = null) {
  const devInfo = getClientDeviceInfo();
  const loggedIn = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, deviceType: devInfo.deviceType, deviceName: devInfo.deviceName })
  });
  if (!loggedIn?.id) return null;
  if (expectedRole && loggedIn.role !== expectedRole) return null;
  const profile = await apiRequest('/me');
  session = { userId: loggedIn.id, role: loggedIn.role };
  writeSession(session);
  if (loggedIn.role === 'user') {
    state = loadUserState(loggedIn.id);
    if (profile) {
      state.profile = {
        ...state.profile,
        name: profile.name,
        email: profile.email,
        age: Number(profile.age),
        gender: profile.gender,
        height: Number(profile.height_cm),
        weight: Number(profile.weight_kg),
        targetWeight: Number(profile.target_weight_kg),
        activity: profile.activity_level,
        preference: profile.food_preference,
        goal: profile.weight_goal,
        allergies: profile.allergies,
        healthConditions: profile.health_conditions
      };
      state.conditionGuidance = profile.conditionGuidance || null;
    }
    save();
  }
  return loggedIn;
}

function read(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readSession() {
  try {
    const val = sessionStorage.getItem(STORAGE.session);
    if (val !== null) return JSON.parse(val);
    const localVal = localStorage.getItem(STORAGE.session);
    if (localVal !== null) {
      const parsed = JSON.parse(localVal);
      if (parsed && parsed.userId && parsed.userId !== 'demo-user') {
        sessionStorage.setItem(STORAGE.session, localVal);
        return parsed;
      }
    }
    return null;
  } catch {
    return null;
  }
}

function writeSession(value) {
  try {
    if (!value) {
      sessionStorage.removeItem(STORAGE.session);
      localStorage.removeItem(STORAGE.session);
    } else {
      sessionStorage.setItem(STORAGE.session, JSON.stringify(value));
      localStorage.setItem(STORAGE.session, JSON.stringify(value));
    }
  } catch {}
}

function esc(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function initials(name) {
  return String(name || 'A').split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'A';
}

function validPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{10,}$/.test(password);
}

async function hashPassword(password, salt = crypto.randomUUID()) {
  const bytes = new TextEncoder().encode(password);
  const key = await crypto.subtle.importKey('raw', bytes, 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 120000, hash: 'SHA-256' }, key, 256);
  return { salt, hash: [...new Uint8Array(bits)].map((byte) => byte.toString(16).padStart(2, '0')).join('') };
}

async function verifyPassword(password, record) {
  return (await hashPassword(password, record.salt)).hash === record.hash;
}

function loadState() {
  const stored = read(STORAGE.state, null);
  if (!stored) return structuredClone(defaultState);
  return {
    ...defaultState,
    ...stored,
    profile: { ...defaultState.profile, ...(stored.profile || {}) },
    mealsDone: { ...defaultState.mealsDone, ...(stored.mealsDone || {}) },
    groceries: Array.isArray(stored.groceries) && stored.groceries.length > 0 ? stored.groceries : structuredClone(defaultState.groceries),
    weightHistory: Array.isArray(stored.weightHistory) && stored.weightHistory.length > 0 ? stored.weightHistory : structuredClone(defaultState.weightHistory),
    caloriesConsumed: typeof stored.caloriesConsumed === 'number' ? stored.caloriesConsumed : defaultState.caloriesConsumed,
    water: typeof stored.water === 'number' ? stored.water : defaultState.water,
    exercise: typeof stored.exercise === 'number' ? stored.exercise : defaultState.exercise,
    sleep: typeof stored.sleep === 'number' ? stored.sleep : defaultState.sleep
  };
}

let users = read(STORAGE.users, []);
let adminData = read(STORAGE.adminData, { foods: ['Oats', 'Paneer', 'Quinoa', 'Lentils'], plans: ['Maintain · Vegetarian', 'Lose weight · High protein', 'Gain muscle · Balanced'] });

// Clean up legacy auto-login demo session from localStorage so login page opens first
try {
  const legacy = localStorage.getItem(STORAGE.session);
  if (legacy && JSON.parse(legacy)?.userId === 'demo-user') {
    localStorage.removeItem(STORAGE.session);
  }
} catch {}

// Default to no active session so the existing welcome page is displayed first on initial arrival
let session = readSession();
// App Lock defaults to locked on every fresh app open/restart whenever a user session is preserved
let appLocked = Boolean(session && session.role === 'user' && session.userId !== 'demo-user');
let appLockError = '';

function isAppLockRequired() {
  return Boolean(session && session.role === 'user' && session.userId !== 'demo-user');
}

function isAppLockActive() {
  return Boolean(appLocked && isAppLockRequired());
}

function lockApp(clearError = true) {
  if (!isAppLockRequired()) return;
  if (dialog) {
    if (dialog.open) dialog.close();
    dialog.innerHTML = '';
  }
  stopDashboardClock();
  appLocked = true;
  if (clearError) appLockError = '';
  render();
}

function loadUserState(userId) {
  const states = read(STORAGE.userStates, {});
  const saved = states[userId];
  if (saved) return loadStateFrom(saved);
  const legacy = userId === 'demo-user' ? read(STORAGE.state, null) : null;
  return legacy ? loadStateFrom(legacy) : structuredClone(defaultState);
}

function loadStateFrom(stored) {
  return {
    ...defaultState, ...stored,
    water: Math.max(0, Math.min(3007, Number(stored.water || 0))),
    exercise: Math.max(0, Math.min(30, Number(stored.exercise || 0))),
    sleep: Math.max(0, Math.min(8, Number(stored.sleep || 0))),
    waterGoal: 3007,
    exerciseGoal: 30,
    sleepGoal: 480,
    mealPlan: Array.isArray(stored.mealPlan) ? stored.mealPlan : [],
    planHistory: Array.isArray(stored.planHistory) ? stored.planHistory : [],
    profile: { ...defaultState.profile, ...(stored.profile || {}) },
    mealsDone: { ...defaultState.mealsDone, ...(stored.mealsDone || {}) },
    groceries: Array.isArray(stored.groceries) && stored.groceries.length > 0 ? stored.groceries : structuredClone(defaultState.groceries),
    weightHistory: Array.isArray(stored.weightHistory) && stored.weightHistory.length > 0 ? stored.weightHistory : structuredClone(defaultState.weightHistory),
    activityRecords: (stored.activityRecords && typeof stored.activityRecords === 'object') ? stored.activityRecords : { water: [], exercise: [], sleep: [] },
    mealCompletions: (stored.mealCompletions && typeof stored.mealCompletions === 'object') ? stored.mealCompletions : {},
    mealCompletionTotals: (stored.mealCompletionTotals && typeof stored.mealCompletionTotals === 'object') ? stored.mealCompletionTotals : {}
  };
}

let state = loadUserState(session?.userId || 'demo-user');
if (state.activityRecords) {
  activityRecords = {
    water: Array.isArray(state.activityRecords.water) ? state.activityRecords.water : [],
    exercise: Array.isArray(state.activityRecords.exercise) ? state.activityRecords.exercise : [],
    sleep: Array.isArray(state.activityRecords.sleep) ? state.activityRecords.sleep : []
  };
}
const urlParams = new URLSearchParams(window.location.search);
let currentView = urlParams.get('view') || 'today';
const resetTokenParam = urlParams.get('token') || urlParams.get('resetToken');
const isResetPath = window.location.pathname.includes('/reset-password');
const authParam = urlParams.get('auth') || urlParams.get('mode');
let authMode = (resetTokenParam || isResetPath)
  ? 'reset-password'
  : (['welcome', 'login', 'register', 'admin', 'forgot', 'reset-password', 'reset'].includes(authParam)
      ? (authParam === 'reset' ? 'forgot' : authParam)
      : 'welcome');
let chartRange = 'week';
let dashboardClockTimer = null;

function health() {
  const p = state.profile || defaultState.profile;
  const weight = Number(p.weight) || 68;
  const height = Number(p.height) || 174;
  const age = Number(p.age) || 24;
  const gender = p.gender || 'Male';
  const activity = p.activity || 'Moderate';
  const goal = p.goal || 'Maintain';
  const bmi = weight / ((height / 100) ** 2);
  const bmr = 10 * weight + 6.25 * height - 5 * age + (gender === 'Female' ? -161 : 5);
  const factors = { Sedentary: 1.2, Low: 1.2, Light: 1.375, Moderate: 1.45, Active: 1.7, High: 1.7 };
  const adjustments = { 'Lose weight': -300, Maintain: 0, 'Gain muscle': 250 };
  const factor = factors[activity] || 1.45;
  const safetyReview = age >= 65 || String(p.healthConditions || '').trim().length > 0;
  const adjustment = safetyReview ? 0 : (adjustments[goal] || 0);
  return {
    bmi: isFinite(bmi) ? bmi : 22.5,
    bmr: Math.round(bmr) || 1650,
    calories: Math.round(bmr * factor + adjustment) || 2090,
    water: Number(state.waterGoal) || 3007,
    label: bmi < 18.5 ? 'Below range' : bmi < 25 ? 'Healthy range' : bmi < 30 ? 'Above range' : 'High range',
    safetyReview,
    weightDifference: Number((weight - Number(p.targetWeight || weight)).toFixed(1))
  };
}

const animalFoodPattern = /\b(chicken|mutton|lamb|meat|beef|pork|fish|prawn|shrimp|crab|lobster|seafood|egg|anda|anchovy|sardine|tuna|salmon|mackerel|goat|liver|bacon|ham|sausage|gelatin|gelatine|mayonnaise|mayo)\b/i;
const dairyFoodPattern = /\b(milk|curd|yogurt|yoghurt|paneer|cheese|ghee|butter|cream|whey|khoa|khoya|malai|lassi|buttermilk|ice cream|icecream|honey)\b/i;
const plantFoodPattern = /\b(oat|wheat|flour|rice|roti|chapati|paratha|dal|dhal|lentil|chickpea|chana|rajma|bean|pea|peanut|groundnut|soy|tofu|tempeh|quinoa|millet|ragi|semolina|suji|rava|poha|flattened rice|corn|maize|barley|bread|pasta|noodle|cucumber|tomato|potato|spinach|mushroom|vegetable|fruit|banana|apple|mango|orange|guava|salad|sambar|rasam|idli|dosa|upma|khichdi|biryani|porridge|sprout|cabbage|carrot|beetroot|okra|brinjal|eggplant|cauliflower|broccoli|pumpkin|jackfruit|coconut|cashew|almond|walnut|sesame|chia|flax|sunflower|raisins?|date|fig)\b/i;
const drinkPattern = /\b(tea|coffee|water|soft drink|soda|juice|drink|punch|lemonade|gin|squash|syrup|sherbet|cocktail|cordial|cooler|cocoa|milkshake|lassi|buttermilk|egg nog)\b/i;

function classifyFood(name) {
  const lower = String(name || '').toLowerCase();
  if (animalFoodPattern.test(lower)) return 'Non-Vegetarian';
  if (dairyFoodPattern.test(lower)) return 'Vegetarian';
  if (plantFoodPattern.test(lower)) return 'Vegan';
  return 'Unknown';
}

function isFoodCompatible(name, preference) {
  const classification = classifyFood(name);
  return preference === 'Non-Vegetarian'
    ? classification === 'Non-Vegetarian'
    : preference === 'Vegan'
      ? classification === 'Vegan'
      : classification === 'Vegan' || classification === 'Vegetarian';
}

function parseCsv(text) {
  return text.trim().split(/\r?\n/).slice(1).map((line) => {
    const cells = []; let value = ''; let quoted = false;
    for (const char of line) {
      if (char === '"') quoted = !quoted;
      else if (char === ',' && !quoted) { cells.push(value.trim()); value = ''; }
      else value += char;
    }
    cells.push(value.trim());
    return cells;
  });
}

function getSlotBounds(type, targetCalories) {
  const calFactor = Math.max(1, Math.min(1.4, (targetCalories || 1800) / 1800));
  const bounds = {
    Breakfast: { min: 80, max: Math.round(350 * calFactor) },
    'Morning snack': { min: 50, max: Math.round(250 * calFactor) },
    Lunch: { min: 120, max: Math.round(450 * calFactor) },
    'Evening snack': { min: 50, max: Math.round(250 * calFactor) },
    Dinner: { min: 120, max: Math.round(420 * calFactor) }
  };
  return bounds[type] || { min: 50, max: Math.round(350 * calFactor) };
}

function datasetMeal(row, index, profile, targetCalories) {
  const name = row[0];
  const calories = Number(row[1]); const carbs = Number(row[2]); const protein = Number(row[3]); const fat = Number(row[4]);
  if (!name || !Number.isFinite(calories) || calories <= 0) return null;
  const lower = name.toLowerCase();
  if (drinkPattern.test(lower)) return null;
  const allergyWords = String(profile.allergies || '').toLowerCase().split(/[,;]+/).map((item) => item.trim()).filter((item) => item && item !== 'none');
  if (!isFoodCompatible(name, profile.preference || 'Vegetarian')) return null;
  if (allergyWords.some((allergen) => allergen && lower.includes(allergen))) return null;
  const types = ['Breakfast', 'Morning snack', 'Lunch', 'Evening snack', 'Dinner'];
  const type = types[index % types.length];
  const portions = { Breakfast: .24, 'Morning snack': .1, Lunch: .3, 'Evening snack': .1, Dinner: .26 };
  const bounds = getSlotBounds(type, targetCalories);
  const rawPortion = Math.round((targetCalories * portions[type]) / calories * 100);
  const portion = Math.min(bounds.max, Math.max(bounds.min, rawPortion));
  const scale = portion / 100;
  const rec = findRecipe(name);
  const instructions = rec?.instructions;
  const hasInstructions = Array.isArray(instructions) ? instructions.length > 0 : Boolean(instructions);
  const recipeDesc = hasInstructions
    ? (Array.isArray(instructions) ? instructions.join(' ') : String(instructions))
    : 'Recipe instructions are not available yet.';
  const ingredients = (rec?.ingredients && rec.ingredients.length > 0)
    ? rec.ingredients.map((i) => (typeof i === 'string' ? i : `${i.name || ''} – ${i.quantity || ''}`.trim()))
    : [name];
  const swaps = (rec?.swaps && rec.swaps.length > 0) ? rec.swaps : [];
  return {
    type,
    time: type === 'Breakfast' ? '08:00 AM' : type === 'Morning snack' ? '11:00 AM' : type === 'Lunch' ? '01:30 PM' : type === 'Evening snack' ? '04:30 PM' : '08:00 PM',
    name,
    dietaryType: classifyFood(name),
    calories: Math.round(calories * scale),
    protein: Number((protein * scale).toFixed(1)),
    carbs: Number((carbs * scale).toFixed(1)),
    fat: Number((fat * scale).toFixed(1)),
    portion,
    ingredients,
    recipe: recipeDesc,
    recipeDetails: rec,
    swaps
  };
}

function compatibleDatasetMeal(row, profile) {
  const meal = datasetMeal(row, 0, profile, health().calories);
  if (!meal) return null;
  return { ...meal, rawRow: row };
}

function createPlanMeal(food, slotIndex, profile, targetCalories, portionOverride = null) {
  if (food.rawRow) {
    const meal = datasetMeal(food.rawRow, slotIndex, profile, targetCalories);
    if (meal) {
      if (portionOverride && portionOverride > 0) {
        const bounds = getSlotBounds(meal.type, targetCalories);
        const portion = Math.min(bounds.max, Math.max(bounds.min, Math.round(portionOverride)));
        const baseCal = Number(food.rawRow[1]) || (meal.calories / (meal.portion / 100));
        const baseProtein = Number(food.rawRow[3]) || 0;
        const baseCarbs = Number(food.rawRow[2]) || 0;
        const baseFat = Number(food.rawRow[4]) || 0;
        const scale = portion / 100;
        return {
          ...meal,
          portion,
          calories: Math.round(baseCal * scale),
          protein: Number((baseProtein * scale).toFixed(1)),
          carbs: Number((baseCarbs * scale).toFixed(1)),
          fat: Number((baseFat * scale).toFixed(1))
        };
      }
      return meal;
    }
  }
  const types = ['Breakfast', 'Morning snack', 'Lunch', 'Evening snack', 'Dinner'];
  const type = types[slotIndex % types.length];
  const portions = { Breakfast: .24, 'Morning snack': .1, Lunch: .3, 'Evening snack': .1, Dinner: .26 };
  const bounds = getSlotBounds(type, targetCalories);
  const baseCalories = (food.calories / (food.portion || 100)) * 100 || 200;
  const baseProtein = (food.protein / (food.portion || 100)) * 100 || 0;
  const baseCarbs = (food.carbs / (food.portion || 100)) * 100 || 0;
  const baseFat = (food.fat / (food.portion || 100)) * 100 || 0;
  const rawPortion = portionOverride || Math.round((targetCalories * portions[type]) / baseCalories * 100);
  const portion = Math.min(bounds.max, Math.max(bounds.min, Math.round(rawPortion)));
  const scale = portion / 100;
  return {
    ...food,
    type,
    time: type === 'Breakfast' ? '08:00 AM' : type === 'Morning snack' ? '11:00 AM' : type === 'Lunch' ? '01:30 PM' : type === 'Evening snack' ? '04:30 PM' : '08:00 PM',
    portion,
    calories: Math.round(baseCalories * scale),
    protein: Number((baseProtein * scale).toFixed(1)),
    carbs: Number((baseCarbs * scale).toFixed(1)),
    fat: Number((baseFat * scale).toFixed(1))
  };
}

function setAppLoading(active, label = 'Updating…') {
  const bar = document.querySelector('#appLoadingBar');
  const textEl = document.querySelector('#appLoadingText');
  if (active) {
    activeLoadingCount += 1;
    if (textEl) textEl.textContent = label;
    if (bar) bar.hidden = false;
    if (loadingWatchdogTimer) clearTimeout(loadingWatchdogTimer);
    loadingWatchdogTimer = setTimeout(() => {
      activeLoadingCount = 0;
      if (bar) bar.hidden = true;
    }, 15000);
  } else {
    activeLoadingCount = Math.max(0, activeLoadingCount - 1);
    if (activeLoadingCount === 0) {
      if (loadingWatchdogTimer) {
        clearTimeout(loadingWatchdogTimer);
        loadingWatchdogTimer = null;
      }
      if (bar) bar.hidden = true;
    }
  }
}

let aiChatMessages = [];
let aiChatSessionId = null;
let aiChatLoading = false;
let aiChatInitialized = false;
let emailPrefsLoaded = false;
let userDailyReportEnabled = true;

const AI_SUGGESTIONS = [
  'Healthy high-protein dinner ideas',
  'Vegetarian iron sources',
  'Quick 15-minute breakfast recipe',
  'Healthy snack for weight loss',
  'Substitute for white rice'
];

const VIEW_ORDER = ['today', 'plan', 'track', 'grocery', 'ai', 'profile'];

function navigateToView(view, { pushHistory = true, swipeDir = null } = {}) {
  if (!VIEW_ORDER.includes(view)) return;
  if (isAppLockActive() || !session || session.role !== 'user') return;
  if (currentView === view) return;
  currentView = view;
  if (pushHistory && window.history?.pushState) {
    try {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('view', view);
      window.history.pushState({ view }, '', nextUrl.pathname + nextUrl.search);
    } catch {}
  }
  render();
  if (window.scrollTo) window.scrollTo(0, 0);
  if (swipeDir && app?.classList) {
    app.classList.remove('view-swipe-left', 'view-swipe-right');
    void app.offsetWidth;
    app.classList.add(swipeDir === 'left' ? 'view-swipe-left' : 'view-swipe-right');
  }
}

async function loadNutritionDataset() {
  if (isAppLockActive()) return;
  if (nutritionDatasetPromise) return nutritionDatasetPromise;
  nutritionDatasetPromise = (async () => {
    try {
      await loadRecipeCatalog();
      if (isAppLockActive()) return;
      const response = await fetch('./data/Indian_Food_Nutrition_Processed.csv');
      if (!response.ok) throw new Error(`Dataset request failed (${response.status})`);
      const rows = parseCsv(await response.text());
      const profile = state.profile || defaultState.profile;
      datasetFoods = rows.map((row) => compatibleDatasetMeal(row, profile)).filter(Boolean);
      const selected = rows.map((row, index) => datasetMeal(row, index, profile, health().calories)).filter(Boolean);
      if (selected.length < 5) throw new Error('Dataset has fewer than five compatible foods.');
      if (isAppLockActive()) return;
      await syncUserDietPlan();
      const initialPlanDate = getCurrentPlanDate();
      if (!mealCompletionsLoadedDates[initialPlanDate] && session && session.userId && session.userId !== 'demo-user' && session.role === 'user') {
        mealCompletionsLoadedDates[initialPlanDate] = true;
        await loadMealCompletionsFromDatabase(initialPlanDate);
      }
      if (!state.activeDietPlan) {
        const savedPlan = state.mealPlanPreference === profile.preference
          && state.mealPlan.length === 5
          && state.mealPlan.every((meal) => isFoodCompatible(meal.name, profile.preference))
          ? state.mealPlan
          : selected.slice(0, 5);
        meals = savedPlan;
        state.mealPlan = meals;
        state.mealPlanPreference = profile.preference;
        save();
        apiRequest('/plans', { method: 'POST', body: JSON.stringify({
          calorieTarget: health().calories,
          meals,
          totalCalories: meals.reduce((sum, meal) => sum + Number(meal?.calories || 0), 0),
          totalProtein: meals.reduce((sum, meal) => sum + Number(meal?.protein || 0), 0),
          totalCarbohydrates: meals.reduce((sum, meal) => sum + Number(meal?.carbs || 0), 0),
          totalFat: meals.reduce((sum, meal) => sum + Number(meal?.fat || 0), 0)
        }) });
      }
      datasetStatus = `Using ${rows.length} foods from the uploaded CSV`;
      render();
    } catch (error) {
      datasetStatus = state.activeDietPlan ? '' : `Nutrition dataset unavailable: ${error.message}`;
      render();
    } finally {
      nutritionDatasetPromise = null;
    }
  })();
  return nutritionDatasetPromise;
}

function score() {
  ensureMealsValid();
  const h = health();
  const totals = meals.reduce((sum, meal) => ({ protein: sum.protein + Number(meal?.protein || 0), carbs: sum.carbs + Number(meal?.carbs || 0), fat: sum.fat + Number(meal?.fat || 0) }), { protein: 0, carbs: 0, fat: 0 });
  const consumed = typeof state.caloriesConsumed === 'number' ? state.caloriesConsumed : 0;
  const mealScore = Object.values(state.mealsDone || {}).filter(Boolean).length * 12;
  const calorieScore = Math.max(0, 20 - Math.abs(consumed - h.calories) / (h.calories || 2000) * 20);
  const act = activityTotals();
  const total = Math.round(
    mealScore +
    Math.min(20, (act.water || 0) / (act.waterGoal || 3007) * 20) +
    Math.min(10, (act.exercise || 0) / (act.exerciseGoal || 30) * 10) +
    Math.min(5, ((act.sleep / 60) || 0) / ((act.sleepGoal / 60) || 8) * 5) +
    calorieScore
  );
  return isNaN(total) ? 82 : total;
}

function save() {
  const states = read(STORAGE.userStates, {});
  states[session?.userId || 'demo-user'] = state;
  write(STORAGE.userStates, states);
  if (session?.userId === 'demo-user') write(STORAGE.state, state);
}
function ensureMealsValid() {
  if (!Array.isArray(meals) || meals.length === 0) {
    meals = fallbackMeals.map((m) => ({ ...m }));
    return;
  }
  const valid = meals.filter((m) => m && typeof m === 'object');
  if (valid.length === 0) {
    meals = fallbackMeals.map((m) => ({ ...m }));
  } else if (valid.length < 5) {
    for (let i = valid.length; i < 5; i++) {
      if (fallbackMeals[i]) valid.push({ ...fallbackMeals[i] });
    }
    meals = valid;
  } else {
    meals = valid;
  }
}

function metric(label, value, unit, detail, tone) { return `<article class="metric ${tone}"><small>${label}</small><strong>${value} <em>${unit}</em></strong><span>${detail}</span></article>`; }
function mealCard(meal, index, options = {}) {
  if (!meal || typeof meal !== 'object') return '';
  const readOnly = Boolean(options.readOnlyCompletion);
  const completed = readOnly ? false : isMealCompleted(index);
  const mName = esc(meal.name || 'Healthy meal');
  const mType = esc(meal.type || 'Meal');
  const mTime = esc(meal.time || '12:00 PM');
  const mCalories = Number(meal.calories) || 0;
  const mProtein = Number(meal.protein) || 0;
  const mPortion = parseFloat(meal.portion) || 100;
  const checkBtn = readOnly
    ? ''
    : `<button type="button" class="meal-check-btn ${completed ? 'checked' : ''}" data-meal-toggle="${index}" aria-label="${completed ? 'Mark ' + mName + ' incomplete' : 'Mark ' + mName + ' completed'}" title="${completed ? 'Completed (click to untick)' : 'Mark completed'}">${completed ? '✓' : ''}</button>`;
  const exchangeBtn = readOnly
    ? ''
    : `<button class="exchange-button" data-exchange-index="${index}">I don't have this ingredient · Exchange Food</button>`;
  return `<article class="meal-card ${completed ? 'meal-completed' : ''}">${checkBtn}<button class="meal-main" ${readOnly ? `data-nextday-meal-index="${index}"` : `data-meal-index="${index}"`}><span class="meal-icon" style="${completed ? 'background:#d8f0d5;color:#176b52;' : ''}">${meal.type === 'Breakfast' ? '☀' : meal.type === 'Morning Snack' || meal.type === 'Morning snack' ? '◔' : meal.type === 'Lunch' ? '◒' : meal.type === 'Evening Snack' || meal.type === 'Evening snack' ? '◕' : meal.type === 'Dinner' ? '☾' : '✦'}</span><span class="meal-content"><small>${mType} <time>${mTime}</time></small><strong style="${completed ? 'color:#176b52;' : ''}">${mName} ${completed ? '<span class="meal-done-badge">✓ Eaten</span>' : ''}</strong><span>${mCalories} kcal · ${mProtein}g protein · ${mPortion} g</span></span><b>›</b></button>${exchangeBtn}</article>`;
}

function render() {
  document.body.classList.remove('auth-bg-active');
  if ((isResetPath || resetTokenParam) && authMode === 'reset-password') { renderAuth(); return; }
  if (!session) { renderAuth(); return; }
  if (isAppLockActive()) { renderAppLock(); return; }
  const bottomNav = document.querySelector('.bottom-nav');
  if (bottomNav) bottomNav.hidden = session.role === 'admin';
  const signOutBtn = document.querySelector('#signOutButton');
  if (signOutBtn) signOutBtn.hidden = false;
  const profileBtn = document.querySelector('#profileButton');
  if (profileBtn) profileBtn.hidden = false;
  const sync = document.querySelector('.sync');
  if (sync) sync.textContent = session.role === 'admin' ? '● Admin workspace' : '● Offline ready';
  const topbar = document.querySelector('.topbar');
  if (topbar) topbar.classList.remove('auth-topbar');

  const views = { today: renderToday, plan: renderPlan, track: renderTrack, grocery: renderGrocery, ai: renderAiAssistant, profile: renderProfile };
  const renderFn = session.role === 'admin' ? renderAdmin : (views[currentView] || renderToday);
  const preserveScroll = session.role === 'user' && lastRenderedView === currentView;
  const savedScrollY = preserveScroll ? (window.scrollY || 0) : 0;
  try {
    app.innerHTML = renderFn();
    lastRenderedView = session.role === 'user' ? currentView : 'admin';
  } catch (renderError) {
    console.error('Render view error:', renderError);
    try {
      app.innerHTML = `<section class="auth-shell"><div class="auth-brand"><span class="brand-mark">P</span><span><b>DAYLIGHT</b><small>Personal wellness</small></span></div><p class="eyebrow">DASHBOARD</p><h1>Welcome to your wellness space</h1><p class="subtle">Syncing with your central profile. Click below if your data needs a quick refresh.</p><div class="auth-form" style="margin-top:20px;"><button class="primary" type="button" onclick="location.reload()">Refresh Dashboard</button></div></section>`;
    } catch {}
  }
  if (preserveScroll && savedScrollY > 0 && window.scrollTo) {
    window.scrollTo(0, savedScrollY);
  }
  document.querySelectorAll('.nav-button').forEach((button) => button.classList.toggle('active', button.dataset.view === currentView));
  try {
    bindActions();
  } catch (bindErr) {
    console.warn('bindActions error:', bindErr);
  }
  if (session.role === 'user' && document.querySelector('[data-ist-clock]')) startDashboardClock();
  else stopDashboardClock();
  if (session.role === 'admin') {
    startAdminPolling();
    loadAdminData();
  } else {
    stopAdminPolling();
  }
  if (session.role === 'user' && !activityLoaded) loadActivityData();
  if (session.role === 'user' && currentView === 'grocery' && !groceryLoaded && !groceryLoading) loadGroceriesFromDatabase();
}

function istTimeParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(date);
  return Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
}

function greetingForHour(hour) {
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
}

function updateDashboardClock() {
  const clock = document.querySelector('[data-ist-clock]');
  const greeting = document.querySelector('[data-ist-greeting]');
  if (!clock || !greeting) return;
  const parts = istTimeParts();
  const hour = Number(parts.hour);
  const hour12 = hour % 12 || 12;
  clock.textContent = `${String(hour12).padStart(2, '0')}:${parts.minute}:${parts.second} ${hour >= 12 ? 'PM' : 'AM'}`;
  greeting.textContent = `${greetingForHour(hour)}, ${greeting.dataset?.username || 'there'}!`;
}

function startDashboardClock() {
  stopDashboardClock();
  updateDashboardClock();
  dashboardClockTimer = window.setInterval(updateDashboardClock, 1000);
}

function stopDashboardClock() {
  if (dashboardClockTimer !== null) {
    window.clearInterval(dashboardClockTimer);
    dashboardClockTimer = null;
  }
}

function todayKey() {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  } catch {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

function normalizeDate(val) {
  if (!val) return '';
  if (typeof val === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    try {
      return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(val));
    } catch {}
    return val.slice(0, 10);
  }
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(val));
  } catch {
    return String(val).slice(0, 10);
  }
}

function getCurrentPlanDate() {
  if (state.activeDietPlan && state.activeDietPlan.start_date) {
    try {
      const baseStr = normalizeDate(state.activeDietPlan.start_date);
      const parts = baseStr.split('-').map(Number);
      if (parts.length === 3 && parts[0] > 2000) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        d.setDate(d.getDate() + Math.max(0, (selectedPlanDay || 1) - 1));
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      }
    } catch (e) {}
  }
  return todayKey();
}

function getActiveDateForView() {
  if (currentView === 'today') {
    return todayKey();
  }
  return getCurrentPlanDate();
}

function isMealCompleted(index, date = null) {
  const d = date || getActiveDateForView();
  return !!(state.mealCompletions && state.mealCompletions[d] && state.mealCompletions[d][index]);
}

function getCompletedTotalsForDate(date, currentMeals) {
  const dateMap = state.mealCompletions?.[date] || {};
  let calories = 0, protein = 0, carbs = 0, fat = 0;
  if (Array.isArray(currentMeals)) {
    currentMeals.forEach((meal, idx) => {
      if (meal && dateMap[idx]) {
        calories += Number(meal.calories || 0);
        protein += Number(meal.protein || 0);
        carbs += Number(meal.carbs || 0);
        fat += Number(meal.fat || 0);
      }
    });
  }
  return {
    calories: Math.max(0, Math.round(calories)),
    protein: Math.max(0, Math.round(protein * 10) / 10),
    carbs: Math.max(0, Math.round(carbs * 10) / 10),
    fat: Math.max(0, Math.round(fat * 10) / 10)
  };
}

async function loadMealCompletionsFromDatabase(date) {
  if (!session || !session.userId || session.userId === 'demo-user' || session.role !== 'user') return;
  try {
    const res = await apiRequest(`/meals/completions?date=${encodeURIComponent(date)}`);
    if (res && Array.isArray(res.completions)) {
      if (!state.mealCompletions) state.mealCompletions = {};
      state.mealCompletions[date] = {};
      res.completions.forEach((c) => {
        const idx = c.meal_index !== undefined ? c.meal_index : c.mealIndex;
        if (c.completed && idx !== undefined) {
          state.mealCompletions[date][idx] = true;
        }
      });
      if (!state.mealCompletionTotals) state.mealCompletionTotals = {};
      state.mealCompletionTotals[date] = res.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 };
      const todayDate = todayKey();
      if (date === todayDate && res.totals) {
        state.caloriesConsumed = res.totals.calories;
      }
      save();
      render();
    }
  } catch (err) {
    console.warn('Load meal completions error:', err.message);
  }
}

async function toggleMealCompletion(index) {
  const meal = meals[index];
  if (!meal) return;
  const date = getActiveDateForView();
  if (!state.mealCompletions) state.mealCompletions = {};
  if (!state.mealCompletions[date]) state.mealCompletions[date] = {};

  const currentStatus = !!state.mealCompletions[date][index];
  const newStatus = !currentStatus;

  if (newStatus) {
    state.mealCompletions[date][index] = true;
  } else {
    delete state.mealCompletions[date][index];
  }

  const localTotals = getCompletedTotalsForDate(date, meals);
  if (!state.mealCompletionTotals) state.mealCompletionTotals = {};
  state.mealCompletionTotals[date] = localTotals;

  const todayDate = todayKey();
  if (date === todayDate) {
    state.caloriesConsumed = localTotals.calories;
  }

  save();
  render();

  if (session && session.userId && session.userId !== 'demo-user' && session.role === 'user') {
    try {
      const payload = {
        diet_plan_id: state.activeDietPlan?.id || null,
        plan_date: date,
        meal_index: index,
        meal_type: meal.type || 'Meal',
        meal_name: meal.name,
        calories: Number(meal.calories || 0),
        protein: Number(meal.protein || 0),
        carbohydrates: Number(meal.carbs || 0),
        fat: Number(meal.fat || 0),
        completed: newStatus
      };
      const res = await apiRequest('/meals/complete', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res && res.totals) {
        state.mealCompletionTotals[date] = res.totals;
        if (date === todayDate) {
          state.caloriesConsumed = res.totals.calories;
        }
        save();
        render();
      }
    } catch (err) {
      console.warn('Sync meal completion error:', err.message);
    }
  }
}

function todayActivity() {
  const date = todayKey();
  return {
    water: (activityRecords.water || []).filter((item) => normalizeDate(item.record_date) === date),
    exercise: (activityRecords.exercise || []).filter((item) => normalizeDate(item.record_date) === date),
    sleep: (activityRecords.sleep || []).filter((item) => normalizeDate(item.record_date) === date)
  };
}

function activityTotals() {
  const today = todayActivity();
  const latest = (items) => (items && items.length ? items[0] : null);

  const latestWater = latest(today.water);
  const rawWater = latestWater ? Number(latestWater.consumed_ml || 0) : (Number(state.water) || 0);
  const water = Math.max(0, Math.min(3007, rawWater));
  const waterGoal = 3007;

  const latestSleep = latest(today.sleep);
  const rawSleep = latestSleep ? Number(latestSleep.minutes || 0) : Math.round((Number(state.sleep) || 0) * 60);
  const sleep = Math.max(0, Math.min(480, rawSleep));
  const sleepGoal = 480;

  const exerciseRecords = [];
  const seenActs = new Set();
  for (const item of (today.exercise || [])) {
    if (!item) continue;
    const key = item.activity ? `${item.activity}:${item.notes || ''}` : `act-${item.id}`;
    if (!seenActs.has(key)) {
      seenActs.add(key);
      exerciseRecords.push(item);
    }
  }
  const rawExercise = exerciseRecords.length
    ? exerciseRecords.reduce((sum, item) => sum + Number(item?.duration_minutes || 0), 0)
    : (Number(state.exercise) || 0);
  const exercise = Math.max(0, Math.min(30, rawExercise));
  const exerciseGoal = 30;

  return {
    water,
    waterGoal: 3007,
    exercise,
    exerciseGoal: 30,
    sleep,
    sleepGoal: 480
  };
}

async function loadActivityData() {
  if (activityLoadingPromise) return activityLoadingPromise;
  if (!session || session.userId === 'demo-user') {
    if (state.activityRecords) {
      activityRecords = {
        water: Array.isArray(state.activityRecords.water) ? state.activityRecords.water : [],
        exercise: Array.isArray(state.activityRecords.exercise) ? state.activityRecords.exercise : [],
        sleep: Array.isArray(state.activityRecords.sleep) ? state.activityRecords.sleep : []
      };
    }
    activityLoaded = true;
    render();
    return;
  }
  activityLoadingPromise = (async () => {
    try {
      const data = await apiRequest('/activity');
      activityLoaded = true;
      if (data && (Array.isArray(data.water) || Array.isArray(data.exercise) || Array.isArray(data.sleep))) {
        activityRecords = {
          water: Array.isArray(data.water) ? data.water : [],
          exercise: Array.isArray(data.exercise) ? data.exercise : [],
          sleep: Array.isArray(data.sleep) ? data.sleep : []
        };
        state.activityRecords = activityRecords;
        const totals = activityTotals();
        state.water = totals.water;
        state.exercise = totals.exercise;
        state.sleep = Math.round((totals.sleep / 60) * 10) / 10;
        save();
        render();
      }
    } finally {
      activityLoadingPromise = null;
    }
  })();
  return activityLoadingPromise;
}

const PASSWORD_EYE_OPEN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
const PASSWORD_EYE_OFF_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="m14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

function renderPasswordInput({ id, toggleId = '', name, autocomplete = 'current-password', placeholder = '', required = true }) {
  const safeId = esc(id);
  const toggleIdAttr = toggleId ? ` id="${esc(toggleId)}"` : '';
  return `<div class="password-input-wrap"><input id="${safeId}" name="${esc(name)}" type="password" autocomplete="${esc(autocomplete)}"${required ? ' required' : ''} placeholder="${esc(placeholder)}" /><button type="button"${toggleIdAttr} class="password-toggle-btn" data-toggle-password="${safeId}" aria-label="Show password" aria-pressed="false">${PASSWORD_EYE_OPEN_SVG}</button></div>`;
}

function bindPasswordToggles(root = document) {
  root?.querySelectorAll?.('[data-toggle-password]')?.forEach((btn) => {
    if (btn.dataset?.toggleBound === 'true') return;
    if (btn.dataset) btn.dataset.toggleBound = 'true';
    btn.addEventListener('click', (event) => {
      event?.preventDefault?.();
      const targetId = btn.dataset?.togglePassword;
      const input = targetId ? document.querySelector(`#${targetId}`) : null;
      if (!input) return;
      const shouldReveal = input.type === 'password';
      input.type = shouldReveal ? 'text' : 'password';
      btn.innerHTML = shouldReveal ? PASSWORD_EYE_OFF_SVG : PASSWORD_EYE_OPEN_SVG;
      btn.setAttribute('aria-label', shouldReveal ? 'Hide password' : 'Show password');
      btn.setAttribute('aria-pressed', String(shouldReveal));
      input.focus?.();
    });
  });
}

function renderAppLock() {
  stopDashboardClock();
  if (dialog) {
    if (dialog.open) dialog.close();
    dialog.innerHTML = '';
  }
  const bottomNav = document.querySelector('.bottom-nav');
  if (bottomNav) bottomNav.hidden = true;
  const signOutBtn = document.querySelector('#signOutButton');
  if (signOutBtn) signOutBtn.hidden = true;
  const profileBtn = document.querySelector('#profileButton');
  if (profileBtn) profileBtn.hidden = true;
  const sync = document.querySelector('.sync');
  if (sync) sync.textContent = '● Locked';
  const topbar = document.querySelector('.topbar');
  if (topbar) topbar.classList.add('auth-topbar');

  app.innerHTML = `<section class="auth-shell app-lock-shell" aria-label="App Lock"><div class="auth-brand"><span class="brand-mark">P</span><span><b>DAYLIGHT</b><small>Personal wellness</small></span></div><p class="eyebrow">APP LOCK</p><h1>Welcome Back</h1><p class="subtle">Enter your password to unlock your wellness dashboard.</p><form id="appLockForm" class="auth-form"><label>Password${renderPasswordInput({ id: 'appLockPassword', toggleId: 'toggleAppLockPassword', name: 'password', autocomplete: 'current-password', placeholder: 'Enter your account password' })}</label><button class="primary" id="appLockSubmit" type="submit">Unlock</button><p class="form-error" id="appLockError" role="alert">${esc(appLockError)}</p></form><div class="auth-links"><button type="button" id="appLockSignOutButton">Log out</button></div></section>`;

  const passwordInput = document.querySelector('#appLockPassword');
  const toggleBtn = document.querySelector('#toggleAppLockPassword');
  toggleBtn?.addEventListener('click', (event) => {
    event?.preventDefault?.();
    if (!passwordInput) return;
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    toggleBtn.innerHTML = isHidden ? PASSWORD_EYE_OFF_SVG : PASSWORD_EYE_OPEN_SVG;
    toggleBtn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    toggleBtn.setAttribute('aria-pressed', String(isHidden));
    passwordInput.focus?.();
  });

  document.querySelector('#appLockForm')?.addEventListener('submit', handleAppUnlock);
  document.querySelector('#appLockSignOutButton')?.addEventListener('click', signOut);
}

async function handleAppUnlock(event) {
  event.preventDefault();
  const formEl = event.target;
  const passwordInput = document.querySelector('#appLockPassword');
  const errorEl = document.querySelector('#appLockError');
  const submitBtn = document.querySelector('#appLockSubmit');
  const password = String(passwordInput?.value || '');

  if (!password) {
    appLockError = 'Please enter your password.';
    if (errorEl) errorEl.textContent = appLockError;
    return;
  }

  if (submitBtn) submitBtn.disabled = true;
  if (errorEl) errorEl.textContent = '';

  try {
    const res = await apiRequest('/auth/verify-lock', {
      method: 'POST',
      body: JSON.stringify({ password })
    });

    if (res && res.ok) {
      formEl.reset();
      appLocked = false;
      appLockError = '';
      render();
      if (!datasetFoods.length) loadNutritionDataset();
      return;
    }

    if (res && res._failed) {
      if (res.status === 401) return;
      appLockError = res.error || 'Incorrect password. Please try again.';
      if (passwordInput) passwordInput.value = '';
      if (errorEl) errorEl.textContent = appLockError;
      return;
    }

    // Offline fallback only for browser-local accounts stored in STORAGE.users
    const localUser = users.find((item) => item.id === session?.userId && item.role === 'user');
    if (localUser && localUser.status !== 'inactive' && localUser.password?.salt && localUser.password?.hash) {
      const valid = await verifyPassword(password, localUser.password);
      if (valid) {
        formEl.reset();
        appLocked = false;
        appLockError = '';
        render();
        if (!datasetFoods.length) loadNutritionDataset();
        return;
      }
      appLockError = 'Incorrect password. Please try again.';
    } else {
      appLockError = 'Unable to verify password while offline. Please reconnect or log out.';
    }
    if (passwordInput) passwordInput.value = '';
    if (errorEl) errorEl.textContent = appLockError;
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

function renderAuth() {
  stopDashboardClock();
  const bottomNav = document.querySelector('.bottom-nav');
  if (bottomNav) bottomNav.hidden = true;
  const signOutBtn = document.querySelector('#signOutButton');
  if (signOutBtn) signOutBtn.hidden = true;
  const profileBtn = document.querySelector('#profileButton');
  if (profileBtn) profileBtn.hidden = true;
  const topbar = document.querySelector('.topbar');
  if (topbar) topbar.classList.add('auth-topbar');

  if (authMode === 'login' || authMode === 'register') {
    document.body.classList.add('auth-bg-active');
  } else {
    document.body.classList.remove('auth-bg-active');
  }

  if (authMode === 'welcome') {
    app.innerHTML = `<section class="auth-shell"><div class="auth-brand"><span class="brand-mark">P</span><span><b>DAYLIGHT</b><small>Personal wellness</small></span></div><p class="eyebrow">WELCOME TO DAYLIGHT</p><h1>Personalized Diet &amp; Routine</h1><p class="subtle">Choose your login portal to continue to your dashboard or workspace.</p><div class="auth-form" style="margin-top:24px;"><button class="primary" type="button" data-auth="login" style="padding:13px;font-size:13px;font-weight:700;border-radius:11px;">User Login</button><button class="secondary" type="button" data-auth="admin" style="padding:13px;font-size:13px;font-weight:700;width:100%;border-radius:11px;">Admin Login</button></div><div class="auth-links" style="justify-content:center;margin-top:22px;"><button data-auth="register">Create an account</button><button data-auth="demo-user">Quick Demo Login</button></div><aside class="security-note"><b>Local-first security</b><span>Passwords are PBKDF2-hashed in this browser. A production deployment must enforce the same roles and authorization on the backend.</span></aside></section>`;
    bindAuth();
    return;
  }

  if (authMode === 'forgot') {
    app.innerHTML = `<section class="auth-shell"><div class="auth-brand"><span class="brand-mark">P</span><span><b>DAYLIGHT</b><small>Personal wellness</small></span></div><p class="eyebrow">PASSWORD RECOVERY</p><h1>Reset your password</h1><p class="subtle">Enter your registered email address and we'll send you a password reset link.</p><form id="forgotForm" class="auth-form"><label>Registered email<input name="email" id="forgotEmailInput" type="email" autocomplete="email" required placeholder="you@example.com"></label><button class="primary" id="sendResetLinkButton" type="submit">Send Reset Link</button><p class="form-error" id="forgotError" role="alert"></p><p class="form-success" id="forgotSuccess" style="color:#176b52;font-size:13px;font-weight:600;margin-top:8px;" role="status"></p></form><div class="auth-links"><button data-auth="login">Back to user login</button><button data-auth="welcome">Back to welcome</button></div><aside class="security-note"><b>Secure reset link</b><span>Password reset links expire in 15 minutes and can only be used once.</span></aside></section>`;
    bindAuth();
    return;
  }

  if (authMode === 'reset-password') {
    app.innerHTML = `<section class="auth-shell"><div class="auth-brand"><span class="brand-mark">P</span><span><b>DAYLIGHT</b><small>Personal wellness</small></span></div><p class="eyebrow">CHOOSE NEW PASSWORD</p><h1>Set new password</h1><p class="subtle">Enter and confirm a new password for your account.</p><form id="resetForm" class="auth-form"><input type="hidden" name="token" value="${esc(resetTokenParam || '')}"><label>New Password${renderPasswordInput({ id: 'resetNewPassword', name: 'password', autocomplete: 'new-password', placeholder: '10+ characters, upper/lowercase, number and symbol' })}</label><label>Confirm New Password${renderPasswordInput({ id: 'resetConfirmPassword', name: 'confirmPassword', autocomplete: 'new-password', placeholder: 'Re-enter your new password' })}</label><button class="primary" id="resetPasswordButton" type="submit">Reset Password</button><p class="form-error" id="resetError" role="alert"></p><p class="form-success" id="resetSuccess" style="color:#176b52;font-size:13px;font-weight:600;margin-top:8px;" role="status"></p></form><div class="auth-links"><button data-auth="login">Back to user login</button><button data-auth="welcome">Back to welcome</button></div><aside class="security-note"><b>Security requirements</b><span>Use at least 10 characters with uppercase, lowercase, a number and a symbol.</span></aside></section>`;
    bindAuth();
    if (!resetTokenParam) {
      const err = document.querySelector('#resetError');
      const btn = document.querySelector('#resetPasswordButton');
      if (err) err.textContent = 'Password reset token is missing from the link. Please request a new link.';
      if (btn) btn.disabled = true;
    } else {
      fetch(`/api/auth/verify-reset-token?token=${encodeURIComponent(resetTokenParam)}`)
        .then((r) => r.json().catch(() => ({})))
        .then((d) => {
          if (!d.valid) {
            const err = document.querySelector('#resetError');
            const btn = document.querySelector('#resetPasswordButton');
            const p1 = document.querySelector('#resetNewPassword');
            const p2 = document.querySelector('#resetConfirmPassword');
            if (err) err.textContent = d.error || 'This password reset link is invalid or has expired.';
            if (btn) btn.disabled = true;
            if (p1) p1.disabled = true;
            if (p2) p2.disabled = true;
          }
        })
        .catch(() => {});
    }
    return;
  }

  if (authMode === 'change-password') {
    const userEmailPrefill = (state.profile && state.profile.email) ? state.profile.email : '';
    app.innerHTML = `<section class="auth-shell"><div class="auth-brand"><span class="brand-mark">P</span><span><b>DAYLIGHT</b><small>Personal wellness</small></span></div><p class="eyebrow">ACCOUNT SECURITY</p><h1>Change password</h1><p class="subtle">Update your account password using your current password verification.</p><form id="changePasswordForm" class="auth-form"><label>Registered Email Address<input name="email" id="changePasswordEmail" type="email" autocomplete="email" required placeholder="you@example.com" value="${esc(userEmailPrefill)}"></label><label>Current Password${renderPasswordInput({ id: 'changeCurrentPassword', name: 'currentPassword', autocomplete: 'current-password', placeholder: 'Enter current password' })}</label><label>New Password${renderPasswordInput({ id: 'changeNewPassword', name: 'newPassword', autocomplete: 'new-password', placeholder: '10+ characters, upper/lowercase, number and symbol' })}</label><label>Confirm New Password${renderPasswordInput({ id: 'changeConfirmPassword', name: 'confirmPassword', autocomplete: 'new-password', placeholder: 'Re-enter your new password' })}</label><button class="primary" id="changePasswordButton" type="submit">Change Password</button><p class="form-error" id="changePasswordError" role="alert"></p><p class="form-success" id="changePasswordSuccess" style="color:#176b52;font-size:13px;font-weight:600;margin-top:8px;" role="status"></p></form><div class="auth-links"><button data-auth="login">Back to user login</button><button data-auth="welcome">Back to welcome</button></div><aside class="security-note"><b>Security requirements</b><span>Use at least 10 characters with uppercase, lowercase, a number and a symbol. New password cannot be identical to current password.</span></aside></section>`;
    bindAuth();
    return;
  }

  const registrationFields = authMode === 'register' ? '<label>Full name<input name="name" required placeholder="Your name"></label><label>Age<input name="age" type="number" min="13" max="120" required></label><label>Gender<select name="gender"><option>Male</option><option>Female</option><option>Other</option></select></label><label>Height (cm)<input name="height" type="number" min="100" max="250" required></label><label>Current weight (kg)<input name="weight" type="number" min="30" max="300" step=".1" required></label><label>Target weight (kg)<input name="targetWeight" type="number" min="30" max="300" step=".1" required></label><label>Activity<select name="activity"><option>Sedentary</option><option>Light</option><option>Moderate</option><option>Active</option></select></label><label>Food preference<select name="preference"><option>Vegetarian</option><option>Vegan</option><option>Non-Vegetarian</option></select></label><label>Weight goal<select name="goal"><option>Lose weight</option><option>Maintain</option><option>Gain muscle</option></select></label><label>Allergies / restrictions<input name="allergies" value="None"></label><label>Health conditions (optional)<input name="healthConditions" placeholder="e.g. diabetes, hypertension, thyroid"></label>' : '';
  const forgotPasswordLink = authMode === 'login' ? '<div style="display:flex;justify-content:space-between;margin-top:-6px;margin-bottom:8px;"><button type="button" data-auth="change-password" style="background:none;border:none;padding:0;font-size:12px;color:var(--accent,#176b52);cursor:pointer;text-decoration:underline;">Change Password</button><button type="button" data-auth="forgot" style="background:none;border:none;padding:0;font-size:12px;color:var(--accent,#176b52);cursor:pointer;text-decoration:underline;">Forgot Password?</button></div>' : '';
  const loginPanelClass = (authMode === 'login' || authMode === 'register') ? ' auth-login-panel' : '';
  // Exclude Show/Hide password toggle strictly from Admin Login (authMode === 'admin')
  const authPasswordField = authMode === 'admin'
    ? '<input name="password" type="password" autocomplete="current-password" required placeholder="10+ characters, upper/lowercase, number and symbol">'
    : renderPasswordInput({ id: 'authPassword', name: 'password', autocomplete: authMode === 'register' ? 'new-password' : 'current-password', placeholder: '10+ characters, upper/lowercase, number and symbol' });
  app.innerHTML = `<section class="auth-shell${loginPanelClass}"><div class="auth-brand"><span class="brand-mark">P</span><span><b>DAYLIGHT</b><small>Personal wellness</small></span></div><p class="eyebrow">PRIVATE WELLNESS SPACE</p><h1>${authMode === 'admin' ? 'Admin control, securely separated.' : authMode === 'register' ? 'Build a healthier rhythm.' : 'Your day, made personal.'}</h1><p class="subtle">${authMode === 'admin' ? 'Manage recipes, plans and members from a role-protected workspace.' : 'A practical plan that adapts to your body, habits and routine.'}</p><form id="authForm" class="auth-form"><label>Email<input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label>${registrationFields}<label>Password${authPasswordField}</label>${forgotPasswordLink}<button class="primary" type="submit">${authMode === 'register' ? 'Create account' : authMode === 'admin' ? 'Enter admin workspace' : 'Sign in'}</button><p class="form-error" id="authError" role="alert"></p></form><div class="auth-links">${authMode === 'login' ? '<button data-auth="welcome">Back to welcome</button><button data-auth="register">Create an account</button><button data-auth="change-password">Change Password</button><button data-auth="forgot">Forgot Password?</button><button data-auth="admin">Admin login</button><button data-auth="demo-user">Quick Demo Login</button>' : '<button data-auth="welcome">Back to welcome</button><button data-auth="login">Back to user login</button>'}</div><aside class="security-note"><b>Local-first security</b><span>Passwords are PBKDF2-hashed in this browser. A production deployment must enforce the same roles and authorization on the backend.</span></aside></section>`;
  bindAuth();
}

function bindAuth() {
  bindPasswordToggles(app);
  document.querySelectorAll('[data-auth]').forEach((button) => button.addEventListener('click', () => {
    if (button.dataset.auth === 'demo-user') {
      session = { userId: 'demo-user', role: 'user' };
      writeSession(session);
      currentView = 'today';
      render();
      return;
    }
    authMode = button.dataset.auth;
    render();
  }));
  document.querySelector('#authForm')?.addEventListener('submit', handleAuth);

  document.querySelector('#forgotForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.querySelector('#forgotError');
    const successEl = document.querySelector('#forgotSuccess');
    if (errorEl) errorEl.textContent = '';
    if (successEl) successEl.textContent = '';

    const form = new FormData(e.target);
    const email = String(form.get('email') || '').trim().toLowerCase();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        successEl.textContent = data.message || 'Password reset link has been sent to your registered email address. Please check your inbox.';
      } else {
        if (errorEl) errorEl.textContent = data.error || 'Failed to send password reset email. Please try again.';
      }
    } catch {
      if (errorEl) errorEl.textContent = 'Network error. Please try again.';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  document.querySelector('#resetForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.querySelector('#resetError');
    const successEl = document.querySelector('#resetSuccess');
    if (errorEl) errorEl.textContent = '';
    if (successEl) successEl.textContent = '';

    const form = new FormData(e.target);
    const token = String(form.get('token') || '').trim();
    const password = String(form.get('password') || '');
    const confirmPassword = String(form.get('confirmPassword') || '');

    if (!token) {
      if (errorEl) errorEl.textContent = 'Password reset token is missing from the link.';
      return;
    }
    if (password !== confirmPassword) {
      if (errorEl) errorEl.textContent = 'Passwords do not match.';
      return;
    }
    if (!validPassword(password)) {
      if (errorEl) errorEl.textContent = 'Use at least 10 characters with uppercase, lowercase, a number and a symbol.';
      return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        session = null;
        writeSession(null);
        appLocked = false;
        appLockError = '';
        if (successEl) successEl.textContent = 'Your password has been reset successfully. Redirecting to login...';
        setTimeout(() => {
          const url = new URL(window.location.href);
          url.searchParams.delete('token');
          url.searchParams.delete('resetToken');
          url.searchParams.delete('auth');
          const targetPath = url.pathname.includes('/reset-password') ? '/' : url.pathname;
          window.history.replaceState({}, document.title, targetPath);
          authMode = 'login';
          render();
        }, 1500);
      } else {
        if (errorEl) errorEl.textContent = data.error || 'Failed to reset password.';
      }
    } catch {
      if (errorEl) errorEl.textContent = 'Network error. Please try again.';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  document.querySelector('#changePasswordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.querySelector('#changePasswordError');
    const successEl = document.querySelector('#changePasswordSuccess');
    if (errorEl) errorEl.textContent = '';
    if (successEl) successEl.textContent = '';

    const form = new FormData(e.target);
    const email = String(form.get('email') || '').trim().toLowerCase();
    const currentPassword = String(form.get('currentPassword') || '');
    const newPassword = String(form.get('newPassword') || '');
    const confirmPassword = String(form.get('confirmPassword') || '');

    if (!email) {
      if (errorEl) errorEl.textContent = 'Registered email address is required.';
      return;
    }
    if (!currentPassword) {
      if (errorEl) errorEl.textContent = 'Current password is required.';
      return;
    }
    if (!newPassword || !confirmPassword) {
      if (errorEl) errorEl.textContent = 'New password and confirm password are required.';
      return;
    }
    if (newPassword !== confirmPassword) {
      if (errorEl) errorEl.textContent = 'New password and confirm password do not match.';
      return;
    }
    if (newPassword === currentPassword) {
      if (errorEl) errorEl.textContent = 'New password cannot be identical to current password.';
      return;
    }
    if (!validPassword(newPassword)) {
      if (errorEl) errorEl.textContent = 'Use at least 10 characters with uppercase, lowercase, a number and a symbol.';
      return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      const res = await apiRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ email, currentPassword, newPassword, confirmPassword })
      });
      if (res?.ok) {
        if (successEl) successEl.textContent = 'Your password has been changed successfully.';
        e.target.reset();
        setTimeout(() => {
          authMode = 'login';
          render();
        }, 1500);
      } else {
        if (errorEl) errorEl.textContent = res?.error || 'Current password is incorrect. Please try again.';
      }
    } catch {
      if (errorEl) errorEl.textContent = 'Network error. Please try again.';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

async function handleAuth(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const email = String(form.get('email')).trim().toLowerCase();
  const password = String(form.get('password') || '');
  const error = document.querySelector('#authError');
  if (authMode !== 'reset' && !validPassword(password)) {
    if (error) error.textContent = 'Use at least 10 characters with uppercase, lowercase, a number and a symbol.';
    return;
  }
  if (authMode === 'register') {
    const name = String(form.get('name')).trim();
    const profile = { ...defaultState.profile, name, email, age: Number(form.get('age')), gender: String(form.get('gender')), height: Number(form.get('height')), weight: Number(form.get('weight')), targetWeight: Number(form.get('targetWeight')), activity: String(form.get('activity')), preference: String(form.get('preference')), goal: String(form.get('goal')), allergies: String(form.get('allergies') || 'None'), healthConditions: String(form.get('healthConditions') || '') };
    const databaseRegistration = await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name, age: profile.age, gender: profile.gender, height: profile.height, weight: profile.weight, targetWeight: profile.targetWeight, activity: profile.activity, preference: profile.preference, goal: profile.goal, allergies: profile.allergies, healthConditions: profile.healthConditions }) });
    if (databaseRegistration?.id) {
      const loggedIn = await useDatabaseSession(email, password, 'user');
      if (loggedIn) {
        appLocked = false;
        appLockError = '';
        currentView = 'today';
        meals = fallbackMeals;
        render();
        loadNutritionDataset();
        return;
      }
    } else if (databaseRegistration?._failed || databaseRegistration?.error) {
      if (error) error.textContent = databaseRegistration.error || 'This email is already registered. Please log in using your existing account or use a different email address.';
      return;
    }
    if (users.some((user) => String(user.email).trim().toLowerCase() === email)) {
      if (error) error.textContent = 'This email is already registered. Please log in using your existing account or use a different email address.';
      return;
    }
    const id = crypto.randomUUID();
    users.push({ id, email, name, role: 'user', status: 'active', registeredAt: new Date().toISOString(), password: await hashPassword(password), profile });
    write(STORAGE.users, users);
    session = { userId: id, role: 'user' };
    writeSession(session);
    appLocked = false;
    appLockError = '';
    currentView = 'today';
    state = loadUserState(id);
    state.profile = profile;
    save();
    meals = fallbackMeals;
    render();
    loadNutritionDataset();
    return;
  }
  if (authMode === 'reset') {
    const user = users.find((item) => item.email === email);
    if (!user) { if (error) error.textContent = 'If an account exists, reset instructions are available.'; return; }
    if (!validPassword(password)) { if (error) error.textContent = 'The new password does not meet the strength rules.'; return; }
    user.password = await hashPassword(password);
    write(STORAGE.users, users);
    if (error) error.textContent = 'Password reset. You can now sign in.';
    authMode = 'login';
    return;
  }
  if (authMode === 'admin') await adminReady;
  const expectedRole = authMode === 'admin' ? 'admin' : 'user';
  const databaseUser = await useDatabaseSession(email, password, expectedRole);
  if (databaseUser) {
    appLocked = false;
    appLockError = '';
    if (databaseUser.role === 'user') currentView = 'today';
    render();
    if (databaseUser.role === 'user') loadNutritionDataset();
    return;
  }
  const user = users.find((item) => item.email === email && item.role === (authMode === 'admin' ? 'admin' : 'user'));
  if (!user || user.status === 'inactive' || !(await verifyPassword(password, user.password))) {
    if (error) error.textContent = 'Invalid email or password.';
    return;
  }
  session = { userId: user.id, role: user.role };
  writeSession(session);
  appLocked = false;
  appLockError = '';
  if (user.role === 'user') {
    currentView = 'today';
    state = loadUserState(user.id);
    state.profile = { ...state.profile, ...(user.profile || {}), name: user.name, email: user.email };
    save();
  }
  render();
  if (user.role === 'user') loadNutritionDataset();
}

function renderHeader() {
  const name = String(state.profile?.name || '').trim();
  const displayName = name || 'there';
  const date = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'long', year: 'numeric' }).format(new Date()).toUpperCase();
  return `<header class="dashboard-header"><div class="dashboard-welcome"><div class="ist-clock" aria-label="Current time in Indian Standard Time"><span class="clock-label">IST</span><strong data-ist-clock>--:--:-- --</strong></div><div><p class="eyebrow">TODAY · ${date}</p><h1 data-ist-greeting data-username="${esc(displayName)}">Good Morning, ${esc(displayName)}!</h1><p class="subtle">Your adaptive nutrition and movement plan is ready.</p></div></div><div class="header-actions"><button class="icon-button" data-action="notifications" aria-label="Notifications">⌁</button><button class="avatar" data-action="edit">${esc(initials(name))}</button></div></header>`;
}

function renderSafetyConditionNotice() {
  const h = health();
  if (!h.safetyReview) return '';
  const rawCond = String(state.profile?.healthConditions || '').trim();
  const guidance = state.conditionGuidance;
  if (!rawCond) {
    return `<article class="notice safety"><b>Professional assessment recommended</b><span>Because of age (${Number(state.profile?.age) || 65}+), no automatic calorie deficit was applied.</span></article>`;
  }
  const focusText = guidance?.combinedGuidance
    ? `${guidance.combinedGuidance}`
    : `Condition-aware selection applied for: ${rawCond}.`;
  const limitText = Array.isArray(guidance?.datasetLimitations) && guidance.datasetLimitations.length
    ? ` Dataset note: ${guidance.datasetLimitations.join(' ')}`
    : '';
  const consultText = guidance?.disclaimer
    ? ` ${guidance.disclaimer}`
    : ' No automatic calorie deficit was applied; please consult a qualified dietitian or clinician for medical nutrition advice.';
  return `<article class="notice safety"><b>Health-condition guidance (${esc(rawCond)})</b><span>${esc(focusText + limitText + consultText)}</span></article>`;
}

function renderToday() {
  ensureMealsValid();
  const h = health();
  const totals = meals.reduce((sum, meal) => ({ protein: sum.protein + Number(meal?.protein || 0), carbs: sum.carbs + Number(meal?.carbs || 0), fat: sum.fat + Number(meal?.fat || 0) }), { protein: 0, carbs: 0, fat: 0 });
  const todayDate = todayKey();
  if (!mealCompletionsLoadedDates[todayDate] && session && session.userId && session.userId !== 'demo-user' && session.role === 'user') {
    mealCompletionsLoadedDates[todayDate] = true;
    loadMealCompletionsFromDatabase(todayDate);
  }
  const todayMealTotals = getCompletedTotalsForDate(todayDate, meals);
  const hasTodayCompletions = !!(state.mealCompletions && state.mealCompletions[todayDate] && Object.keys(state.mealCompletions[todayDate]).length > 0);
  const consumed = Number(todayMealTotals.calories) || 0;
  state.caloriesConsumed = consumed;
  const targetCalories = (state.activeDietPlan && Number(state.activeDietPlan.calorie_target) > 0) ? Number(state.activeDietPlan.calorie_target) : h.calories;
  const completedCount = meals.filter((_, idx) => isMealCompleted(idx, todayDate)).length;
  const totalMealsCount = meals.length > 0 ? meals.length : 5;
  const caloriePercent = totalMealsCount > 0 ? Math.round((completedCount / totalMealsCount) * 100) : 0;
  const currentWeight = Number(state.profile?.weight) || 68;
  const targetWeight = Number(state.profile?.targetWeight) || 65;
  const weightPercent = Math.min(100, Math.max(0, currentWeight / Math.max(currentWeight, targetWeight) * 100));
  const name = state.profile?.name || 'Adarsh';
  const goal = state.profile?.goal || 'Maintain';
  const activity = activityTotals();
  const water = Number(activity.water) || 0;
  const exercise = Number(activity.exercise) || 0;
  const sleep = (Number(activity.sleep) || 0) / 60;
  const waterGoal = Number(activity.waterGoal) || 3007;
  const exerciseGoal = Number(activity.exerciseGoal) || 30;
  const sleepGoal = Number(activity.sleepGoal) || 480;
  const activePlan = state.activeDietPlan;
  const activePlanBanner = activePlan
    ? `<div class="active-plan-banner" style="display:flex;justify-content:space-between;align-items:center;background:#e5f1df;padding:12px 16px;border-radius:14px;margin:12px 0 16px;font-size:12px;color:#176b52;border:1px solid #c9e3c1;"><span>📋 <strong>Active Diet Plan:</strong> ${esc(activePlan.plan_name)} · <b>Day ${selectedPlanDay}</b> of ${activePlan.number_of_days}</span><button type="button" data-view="plan" style="padding:0;border:0;color:#176b52;background:transparent;font-size:11px;font-weight:700;cursor:pointer;">View full plan →</button></div>`
    : '';

  return `${renderHeader()}<section class="hero-grid"><section class="target"><div><small>RECOMMENDED DAILY INTAKE</small><strong>${targetCalories} <em>kcal</em></strong><span>${esc(goal)} goal · BMR ${h.bmr} kcal · ${caloriePercent}% completed</span></div><div class="score"><b>${caloriePercent}%</b><small>progress</small></div><div class="bar"><i style="width:${caloriePercent}%"></i></div><footer><span>${consumed.toLocaleString()} consumed</span><span>${Math.max(0, targetCalories - consumed).toLocaleString()} remaining</span></footer></section><section class="profile-card"><div class="avatar large">${esc(initials(name))}</div><div><small>BODY COMPOSITION</small><strong>${currentWeight} kg</strong><span>Target ${targetWeight} kg · Difference ${h.weightDifference} kg</span><div class="weight-line"><i style="width:${weightPercent}%"></i></div></div></section></section>${renderSafetyConditionNotice()}<section class="metrics">${metric('BMI', h.bmi.toFixed(1), 'kg/m²', h.label, 'mint')}${metric('Protein', hasTodayCompletions ? `${todayMealTotals.protein.toFixed(1)} / ${totals.protein.toFixed(1)}` : totals.protein.toFixed(1), 'g', hasTodayCompletions ? 'Consumed today' : 'From daily plan', 'peach')}${metric('Carbs', hasTodayCompletions ? `${todayMealTotals.carbs.toFixed(1)} / ${totals.carbs.toFixed(1)}` : totals.carbs.toFixed(1), 'g', hasTodayCompletions ? 'Consumed today' : 'From daily plan', 'blue')}${metric('Fat', hasTodayCompletions ? `${todayMealTotals.fat.toFixed(1)} / ${totals.fat.toFixed(1)}` : totals.fat.toFixed(1), 'g', hasTodayCompletions ? 'Consumed today' : 'From daily plan', 'lilac')}</section>${activePlanBanner}<section class="section-title"><h2>Today's meals</h2><button data-view="plan">View full plan →</button></section><p class="dataset-status">${esc(datasetStatus)}</p><div class="meal-list">${meals.map(mealCard).join('')}</div><section class="dashboard-grid"><article class="info-card water-card"><div class="card-heading"><span>💧</span><small>HYDRATION</small></div><strong>${water.toLocaleString()} <em>/ ${waterGoal.toLocaleString()} ml</em></strong><div class="progress"><i style="width:${Math.min(100, Math.max(0, water / (waterGoal || 3007) * 100))}%"></i></div><div class="card-buttons"><button data-action="water"${water >= 3007 ? ' disabled' : ''}>+ 250 ml</button><button data-action="water-minus"${water <= 0 ? ' disabled' : ''}>− 100 ml</button><button data-activity-editor="water">Custom</button></div></article><article class="info-card activity-card"><div class="card-heading"><span>🏃</span><small>TODAY'S ACTIVITY</small></div><strong>${exercise} <em>of ${exerciseGoal} min</em></strong><div class="progress"><i style="width:${Math.min(100, Math.max(0, exercise / (exerciseGoal || 30) * 100))}%"></i></div><div class="card-buttons"><button data-action="exercise"${exercise >= 30 ? ' disabled' : ''}>+ 10 min</button><button data-action="exercise-minus"${exercise <= 0 ? ' disabled' : ''}>− 5 min</button><button data-activity-editor="exercise">Log</button></div></article><article class="info-card sleep-card"><div class="card-heading"><span>🌙</span><small>SLEEP & REST</small></div><strong>${sleep.toFixed(1)} <em>of ${(sleepGoal / 60).toFixed(1)} hrs</em></strong><div class="progress"><i style="width:${Math.min(100, Math.max(0, (Number(activity.sleep) || 0) / (sleepGoal || 480) * 100))}%"></i></div><div class="card-buttons"><button data-action="sleep"${Number(activity.sleep) >= 480 ? ' disabled' : ''}>+ 1 hr</button><button data-action="sleep-minus"${Number(activity.sleep) <= 0 ? ' disabled' : ''}>− 30 min</button><button data-activity-editor="sleep">Log</button></div></article></section>`;
}

function renderPlan() {
  if (planViewMode === 'next-day') {
    const h = health();
    const tomorrowPlan = nextDayPlanData?.plan || null;
    const tomorrowDate = String(nextDayPlanData?.date || tomorrowPlan?.day_date || '').slice(0, 10);
    const tomorrowMeals = tomorrowPlan ? (loadPlanDayMeals(tomorrowPlan, 1) || []) : [];
    const tTotals = tomorrowMeals.reduce((sum, meal) => ({
      calories: sum.calories + Number(meal?.calories || 0),
      protein: sum.protein + Number(meal?.protein || 0),
      carbs: sum.carbs + Number(meal?.carbs || 0),
      fat: sum.fat + Number(meal?.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    const tParts = tomorrowDate.split('-').map(Number);
    const tomorrowFormatted = (tParts.length === 3 && tParts[0] > 2000)
      ? new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(tParts[0], tParts[1] - 1, tParts[2])).toUpperCase()
      : 'TOMORROW';
    const calTarget = Number(tomorrowPlan?.calorie_target || h.calories);
    return `<p class="eyebrow">NEXT DAY MEAL PLAN · ${esc(tomorrowFormatted)}</p><h1>Tomorrow's meal plan</h1><p class="subtle wide">${esc(tomorrowPlan?.description || `Generated for ${tomorrowDate} using your latest health profile and dataset.`)}</p><div class="plan-actions"><button type="button" class="secondary" data-action="back-weekly-plan">← Back to Weekly Plan</button><button type="button" class="primary" data-action="regenerate-next-day">${nextDayPlanLoading ? 'Regenerating…' : '↻ Regenerate Next Day Plan'}</button><button type="button" class="secondary" data-action="plan-history">View plan history</button></div>${nextDayPlanLoading ? '<p class="subtle">Loading next day meal plan…</p>' : tomorrowMeals.length ? `<section class="target" style="margin:16px 0;background:linear-gradient(135deg, #185843, #22765c);box-shadow:0 10px 22px rgba(24,88,67,0.15);"><div><small>NEXT DAY TARGET · ${esc(tomorrowFormatted)}</small><strong>${tTotals.calories.toLocaleString()} <em>/ ${calTarget.toLocaleString()} kcal</em></strong><span>${tomorrowMeals.length} planned meals · Tap any meal for ingredients &amp; recipe</span></div></section><section class="metrics">${metric('Calories', tTotals.calories, 'kcal', `Target ${calTarget} kcal`, 'mint')}${metric('Protein', tTotals.protein.toFixed(1), 'g', 'Planned tomorrow', 'peach')}${metric('Carbs', tTotals.carbs.toFixed(1), 'g', 'Planned tomorrow', 'blue')}${metric('Fat', tTotals.fat.toFixed(1), 'g', 'Planned tomorrow', 'lilac')}</section><div class="meal-list full">${tomorrowMeals.map((m, idx) => mealCard(m, idx, { readOnlyCompletion: true })).join('')}</div>` : '<article class="notice"><b>Next day plan unavailable</b><span>Click Regenerate Next Day Plan to generate tomorrow\'s meals.</span></article>'}`;
  }

  ensureMealsValid();
  const h = health();
  const totals = meals.reduce((sum, meal) => ({ calories: sum.calories + Number(meal?.calories || 0), protein: sum.protein + Number(meal?.protein || 0), carbs: sum.carbs + Number(meal?.carbs || 0), fat: sum.fat + Number(meal?.fat || 0) }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  const activePlan = state.activeDietPlan;
  const planTitle = activePlan ? esc(activePlan.plan_name) : `Built around ${h.calories} kcal.`;
  const planEyebrow = activePlan ? 'PERSONALIZED DIET PLAN' : 'ADAPTIVE MEAL PLAN';
  const planSubtle = activePlan
    ? `${esc(activePlan.description || 'Assigned personalized wellness plan.')} · ${activePlan.number_of_days} days (${esc(String(activePlan.start_date).slice(0, 10))} to ${esc(String(activePlan.end_date).slice(0, 10))})`
    : `Five CSV-backed meals filtered for ${esc(state.profile.preference)} preference and allergies. Portions are calculated per 100 g.`;
  const dayTabs = activePlan && activePlan.number_of_days > 1
    ? `<div class="plan-days-nav" style="display:flex;gap:6px;overflow-x:auto;padding-bottom:10px;margin:12px 0;"><span style="align-self:center;font-weight:700;color:#71817c;font-size:11px;margin-right:4px;">Days:</span>${Array.from({ length: activePlan.number_of_days }, (_, i) => i + 1).map((d) => `<button type="button" class="plan-day-chip ${d === selectedPlanDay ? 'active' : ''}" data-select-day="${d}" style="padding:6px 12px;border:1px solid ${d === selectedPlanDay ? '#176b52' : '#dce7df'};border-radius:8px;background:${d === selectedPlanDay ? '#176b52' : '#fffdf7'};color:${d === selectedPlanDay ? '#fff' : '#21342f'};font-weight:700;font-size:11px;cursor:pointer;white-space:nowrap;">Day ${d}</button>`).join('')}</div>`
    : '';

  const planDate = getCurrentPlanDate();
  if (!mealCompletionsLoadedDates[planDate] && session && session.userId && session.userId !== 'demo-user' && session.role === 'user') {
    mealCompletionsLoadedDates[planDate] = true;
    loadMealCompletionsFromDatabase(planDate);
  }

  const consumedTotals = getCompletedTotalsForDate(planDate, meals);
  const calTarget = (activePlan && Number(activePlan.calorie_target) > 0) ? Number(activePlan.calorie_target) : (totals.calories > 0 ? totals.calories : h.calories);
  const completedCount = meals.filter((_, idx) => isMealCompleted(idx, planDate)).length;
  const totalMealsCount = meals.length > 0 ? meals.length : 5;
  const calPercent = totalMealsCount > 0 ? Math.round((completedCount / totalMealsCount) * 100) : 0;
  const calBarPercent = Math.min(100, Math.max(0, calPercent));

  const protTarget = totals.protein > 0 ? totals.protein : 1;
  const protPercent = Math.round((consumedTotals.protein / protTarget) * 100);

  const carbTarget = totals.carbs > 0 ? totals.carbs : 1;
  const carbPercent = Math.round((consumedTotals.carbs / carbTarget) * 100);

  const fatTarget = totals.fat > 0 ? totals.fat : 1;
  const fatPercent = Math.round((consumedTotals.fat / fatTarget) * 100);

  const dateParts = planDate.split('-').map(Number);
  const planDateFormatted = (dateParts.length === 3 && dateParts[0] > 2000)
    ? new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateParts[0], dateParts[1] - 1, dateParts[2])).toUpperCase()
    : planDate;

  return `<p class="eyebrow">${planEyebrow}</p><h1>${planTitle}</h1><p class="subtle wide">${planSubtle}</p>${renderSafetyConditionNotice()}${dayTabs}<div class="plan-actions"><button class="primary" data-action="next-plan">Generate next day plan</button><button type="button" class="secondary" data-action="view-next-day">Next Day Meal Plan</button><button class="secondary" data-action="plan-history">View plan history (${planHistoryDbData ? planHistoryDbData.length : (state.planHistory ? state.planHistory.length : 0)})</button></div><section class="target" style="margin:16px 0;background:linear-gradient(135deg, #185843, #22765c);box-shadow:0 10px 22px rgba(24,88,67,0.15);"><div><small>CALORIE CONSUMPTION PROGRESS · ${planDateFormatted} ${activePlan ? `· DAY ${selectedPlanDay} OF ${activePlan.number_of_days}` : ''}</small><strong>${consumedTotals.calories.toLocaleString()} <em>/ ${calTarget.toLocaleString()} kcal</em></strong><span>${calPercent}% completed · ${completedCount} of ${meals.length} meals completed</span></div><div class="score" style="border-color:#84b7a4;"><b>${calPercent}%</b><small>progress</small></div><div class="bar"><i style="width:${calBarPercent}%;"></i></div><footer><span>${consumedTotals.calories.toLocaleString()} kcal consumed</span><span>${Math.max(0, calTarget - consumedTotals.calories).toLocaleString()} kcal remaining</span></footer></section><section class="metrics">${metric('Calories', `${consumedTotals.calories} / ${totals.calories}`, 'kcal', `${calPercent}% completed · Day ${selectedPlanDay}`, 'mint')}${metric('Protein', `${consumedTotals.protein.toFixed(1)} / ${totals.protein.toFixed(1)}`, 'g', `${protPercent}% · Target ${totals.protein.toFixed(1)} g`, 'peach')}${metric('Carbs', `${consumedTotals.carbs.toFixed(1)} / ${totals.carbs.toFixed(1)}`, 'g', `${carbPercent}% · Target ${totals.carbs.toFixed(1)} g`, 'blue')}${metric('Fat', `${consumedTotals.fat.toFixed(1)} / ${totals.fat.toFixed(1)}`, 'g', `${fatPercent}% · Target ${totals.fat.toFixed(1)} g`, 'lilac')}</section><div class="meal-list full">${meals.map(mealCard).join('')}</div>`;
}

function renderTrack() {
  const h = health();
  const history = Array.isArray(state.weightHistory) && state.weightHistory.length > 0 ? state.weightHistory : defaultState.weightHistory;
  const maxWeight = Math.max(...history);
  const currentWeight = Number(state.profile?.weight) || 68;
  const activity = activityTotals();
  const water = activity.water;
  const exercise = activity.exercise;
  const sleep = activity.sleep / 60;
  const mealsDone = state.mealsDone || {};

  const historyRows = (activityRecords.exercise || []).map((item) => ({ ...item, kind: 'exercise' }))
    .concat(
      (activityRecords.water || []).map((item) => ({ ...item, kind: 'water' })),
      (activityRecords.sleep || []).map((item) => ({ ...item, kind: 'sleep' }))
    )
    .sort((a, b) => String(b.record_date || '').localeCompare(String(a.record_date || '')));

  return `${renderHeader()}<div class="section-title"><div><p class="eyebrow">YOUR MOMENTUM</p><h1>Today's activity.</h1></div></div><section class="chart-card"><div class="chart-summary"><span><small>CURRENT WEIGHT</small><strong>${currentWeight} kg</strong></span></div><div class="chart">${history.map((weight, index) => `<div class="chart-point" style="height:${Math.max(15, 30 + (maxWeight - weight) * 55)}px"><i></i><small>${index + 1}</small></div>`).join('')}</div></section><section class="metrics">${metric('Water', (water / 1000).toFixed(2), 'L', `${water.toLocaleString()} / ${activity.waterGoal.toLocaleString()} ml`, 'mint')}${metric('Exercise', exercise, 'min', `Goal ${activity.exerciseGoal} min`, 'peach')}${metric('Sleep', sleep.toFixed(1), 'hrs', `Goal ${(activity.sleepGoal / 60).toFixed(1)} hrs`, 'blue')}</section><div class="track-list"><article><b>💧 Water / Hydration</b><span>${water.toLocaleString()} ml / ${activity.waterGoal.toLocaleString()} ml</span><div class="progress"><i style="width:${Math.min(100, Math.max(0, water / (activity.waterGoal || 3007) * 100))}%"></i></div><div class="card-buttons"><button data-action="water"${water >= 3007 ? ' disabled' : ''}>+ 250 ml</button><button data-action="water-minus"${water <= 0 ? ' disabled' : ''}>− 100 ml</button><button data-activity-editor="water">Custom entry / goal</button></div></article><article><b>🏃 Exercise</b><span>${exercise} / ${activity.exerciseGoal} minutes</span><div class="progress"><i style="width:${Math.min(100, Math.max(0, exercise / (activity.exerciseGoal || 30) * 100))}%"></i></div><div class="card-buttons"><button data-action="exercise"${exercise >= 30 ? ' disabled' : ''}>+ 10 min</button><button data-action="exercise-minus"${exercise <= 0 ? ' disabled' : ''}>− 5 min</button><button data-activity-editor="exercise">Add exercise</button></div></article><article><b>🌙 Sleep</b><span>${sleep.toFixed(1)} / ${(activity.sleepGoal / 60).toFixed(1)} hours</span><div class="progress"><i style="width:${Math.min(100, Math.max(0, (activity.sleep / (activity.sleepGoal || 480)) * 100))}%"></i></div><div class="card-buttons"><button data-action="sleep"${activity.sleep >= 480 ? ' disabled' : ''}>+ 1 hr</button><button data-action="sleep-minus"${activity.sleep <= 0 ? ' disabled' : ''}>− 30 min</button><button data-activity-editor="sleep">Add / edit sleep</button></div></article></div><h3 class="label">HISTORY</h3><div class="activity-history">${historyRows.slice(0, 20).map((item) => `<div><small>${esc(String(item.record_date).slice(0, 10))} · ${item.activity ? esc(item.activity) + ' ' + item.duration_minutes + ' min' : item.consumed_ml !== undefined ? item.consumed_ml + ' ml water' : (Number(item.minutes || 0) / 60).toFixed(1) + ' hr sleep'}</small><button data-edit-activity="${item.kind}:${item.id}">Edit</button><button data-delete-activity="${item.kind}:${item.id}">Delete</button></div>`).join('') || '<p class="subtle">No activity records yet.</p>'}</div><h3 class="label">MEAL ADHERENCE</h3>${['Breakfast', 'Lunch', 'Dinner', 'Evening snack'].map((meal) => `<label class="check"><input type="checkbox" data-meal-check="${meal}" ${mealsDone[meal] ? 'checked' : ''}> ${meal} completed</label>`).join('')}`;
}

function showActivityEditor(kind, record) {
  const isExercise = kind === 'exercise';
  const isSleep = kind === 'sleep';
  if (!dialog) return;
  const existingToday = todayActivity()[kind]?.[0] || null;
  const targetRecord = record || existingToday;
  const sleepMinutes = targetRecord ? Number(targetRecord.minutes || 0) : Math.round((Number(state.sleep) || 0) * 60);
  const exerciseDuration = targetRecord ? Number(targetRecord.duration_minutes || 0) : (Number(state.exercise) || 0);
  const waterConsumed = targetRecord ? Number(targetRecord.consumed_ml || 0) : (Number(state.water) || 0);

  dialog.innerHTML = `<form method="dialog" class="dialog-card profile-form"><button class="close">×</button><p class="eyebrow">ACTIVITY TRACKER</p><h2>${targetRecord ? 'Edit' : 'Add'} ${kind}</h2><label>Date<input name="date" type="date" required value="${esc(String(targetRecord?.record_date || todayKey()).slice(0, 10))}"></label>${isExercise ? `<label>Exercise type<select name="activity">${['Walking', 'Running', 'Cycling', 'Gym', 'Yoga', 'Swimming', 'Other'].map((item) => `<option ${targetRecord?.activity === item ? 'selected' : ''}>${item}</option>`).join('')}</select></label><label>Duration (minutes, max 30)<input name="durationMinutes" type="number" min="0" max="30" required value="${exerciseDuration}"></label><label>Daily goal (minutes)<input name="goalMinutes" type="number" min="0" max="30" required value="30"></label><label>Notes (optional)<input name="notes" value="${esc(targetRecord?.notes || '')}"></label>` : isSleep ? `<label>Hours (max 8)<input name="hours" type="number" min="0" max="8" step="1" required value="${Math.floor(sleepMinutes / 60)}"></label><label>Minutes<input name="minutes" type="number" min="0" max="59" required value="${sleepMinutes % 60}"></label><label>Daily goal (minutes)<input name="goalMinutes" type="number" min="0" max="480" required value="480"></label>` : `<label>Water quantity (ml, max 3,007)<input name="consumedMl" type="number" min="0" max="3007" required value="${waterConsumed}"></label><label>Daily goal (litres)<input name="goalLitres" type="number" min="0" max="3.007" step=".001" required value="${((targetRecord?.goal_ml || 3007) / 1000).toFixed(3)}"></label>`}<button class="primary" value="save">Save</button></form>`;
  dialog.showModal();
  dialog.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const recDate = data.date || todayKey();
    const localId = 'local-' + Date.now();
    let createdItem = null;

    if (isExercise) {
      const dur = Math.max(0, Math.min(30, Number(data.durationMinutes) || 0));
      const goal = 30;
      const act = data.activity || 'Walking';
      const notes = data.notes || '';
      if (targetRecord) {
        targetRecord.record_date = recDate;
        targetRecord.activity = act;
        targetRecord.duration_minutes = dur;
        targetRecord.goal_minutes = goal;
        targetRecord.notes = notes;
      } else {
        createdItem = { id: localId, record_date: recDate, activity: act, duration_minutes: dur, goal_minutes: goal, notes, kind: 'exercise' };
        if (!activityRecords.exercise) activityRecords.exercise = [];
        activityRecords.exercise.unshift(createdItem);
      }
      if (recDate === todayKey()) state.exercise = dur;
    } else if (isSleep) {
      const mins = Math.max(0, Math.min(480, (Number(data.hours) || 0) * 60 + (Number(data.minutes) || 0)));
      const goal = 480;
      if (targetRecord) {
        targetRecord.record_date = recDate;
        targetRecord.minutes = mins;
        targetRecord.goal_minutes = goal;
      } else {
        createdItem = { id: localId, record_date: recDate, minutes: mins, goal_minutes: goal, kind: 'sleep' };
        if (!activityRecords.sleep) activityRecords.sleep = [];
        activityRecords.sleep.unshift(createdItem);
      }
      if (recDate === todayKey()) state.sleep = Math.round((mins / 60) * 10) / 10;
    } else {
      const ml = Math.max(0, Math.min(3007, Number(data.consumedMl) || 0));
      const goal = 3007;
      if (targetRecord) {
        targetRecord.record_date = recDate;
        targetRecord.consumed_ml = ml;
        targetRecord.goal_ml = goal;
      } else {
        createdItem = { id: localId, record_date: recDate, consumed_ml: ml, goal_ml: goal, kind: 'water' };
        if (!activityRecords.water) activityRecords.water = [];
        activityRecords.water.unshift(createdItem);
      }
      if (recDate === todayKey()) state.water = ml;
    }

    state.activityRecords = activityRecords;
    save();
    dialog.close();
    render();
    showNotice(`${kind.charAt(0).toUpperCase() + kind.slice(1)} record saved.`);

    if (session && session.userId && session.userId !== 'demo-user') {
      try {
        const payload = isExercise
          ? { date: recDate, activity: data.activity, durationMinutes: Number(data.durationMinutes), goalMinutes: Number(data.goalMinutes), notes: data.notes || '' }
          : isSleep
            ? { date: recDate, minutes: Number(data.hours) * 60 + Number(data.minutes), goalMinutes: Number(data.goalMinutes) }
            : { date: recDate, consumedMl: Number(data.consumedMl), goalMl: Math.round(Number(data.goalLitres) * 1000) };

        if (targetRecord && targetRecord.id && !String(targetRecord.id).startsWith('local-')) {
          await apiRequest(`/activity/${kind}/${targetRecord.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
        } else {
          const created = await apiRequest(`/activity/${kind}`, { method: 'POST', body: JSON.stringify(payload) });
          if (created?.id) {
            const activeItem = targetRecord || createdItem;
            if (activeItem) {
              activeItem.id = created.id;
              save();
            }
          }
        }
      } catch (err) {
        console.warn('Backend activity sync:', err.message);
      }
    }
  });
}

async function loadGroceriesFromDatabase() {
  if (!session || !session.userId || session.userId === 'demo-user' || session.role !== 'user') {
    groceryLoaded = true;
    return;
  }
  if (groceryLoading) return;
  groceryLoading = true;
  setAppLoading(true, 'Loading weekly groceries…');
  try {
    const res = await apiRequest('/groceries');
    groceryLoaded = true;
    if (res && Array.isArray(res.items)) {
      state.groceries = res.items;
      groceryMeta = res.meta || groceryMeta;
      save();
      if (currentView === 'grocery') render();
    } else if (res?._failed) {
      showNotice(res.error || 'Could not load groceries right now.');
    }
  } finally {
    groceryLoading = false;
    setAppLoading(false);
    if (currentView === 'grocery') render();
  }
}

async function regenerateGroceriesFromPlan() {
  if (!session || !session.userId || session.userId === 'demo-user' || session.role !== 'user') {
    showNotice('Please sign in with your account to generate groceries from your PostgreSQL diet plan.');
    return;
  }
  if (groceryLoading) return;
  const hasPurchased = Array.isArray(state.groceries) && state.groceries.some((i) => i.purchased);
  if ((groceryMeta?.manuallyEdited || hasPurchased) && !confirm('You have edited or checked items in your current grocery list. Regenerate from your latest weekly diet plan? Your previous list will be saved in shopping history.')) {
    return;
  }
  groceryLoading = true;
  setAppLoading(true, 'Refreshing grocery list…');
  if (currentView === 'grocery') render();
  try {
    const res = await apiRequest('/groceries/generate', {
      method: 'POST',
      body: JSON.stringify({ force: true })
    });
    if (res && Array.isArray(res.items)) {
      state.groceries = res.items;
      groceryMeta = res.meta || groceryMeta;
      groceryLoaded = true;
      save();
      render();
    } else {
      showNotice(res?.error || 'Could not regenerate grocery list right now.');
    }
  } finally {
    groceryLoading = false;
    setAppLoading(false);
    if (currentView === 'grocery') render();
  }
}

async function toggleGroceryItem(index, checked) {
  const item = state.groceries?.[index];
  if (!item) return;
  const previous = Boolean(item.purchased);
  item.purchased = Boolean(checked);
  if (groceryMeta) groceryMeta.manuallyEdited = true;
  save();
  render();

  if (session && session.userId && session.userId !== 'demo-user' && item.id) {
    const res = await apiRequest(`/groceries/${encodeURIComponent(item.id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ purchased: Boolean(checked) })
    });
    if (res && res._failed) {
      item.purchased = previous;
      save();
      render();
      showNotice(res.error || 'Could not save grocery status.');
    }
  }
}

const GROCERY_CATEGORY_EMOJI = {
  'Fruits': '🍎',
  'Vegetables': '🥬',
  'Grains and cereals': '🌾',
  'Pulses and lentils': '🫘',
  'Dairy products': '🥛',
  'Protein sources': '🥚',
  'Nuts and seeds': '🥜',
  'Spices and seasonings': '🧂',
  'Oils and cooking essentials': '🫒',
  'Other ingredients': '🧺'
};

function getGrocerySelectionKey(item, index) {
  if (item?.id) return `id:${item.id}`;
  if (item?.itemKey || item?.item_key) return `key:${item.itemKey || item.item_key}`;
  const cleanName = String(item?.name || '').trim().toLowerCase().replace(/\s+/g, ' ');
  return cleanName ? `name:${cleanName}:${index}` : `idx:${index}`;
}

function getSelectedGroceryEntries() {
  const groceries = Array.isArray(state.groceries) ? state.groceries : [];
  return groceries
    .map((item, index) => ({ item, index, key: getGrocerySelectionKey(item, index) }))
    .filter((entry) => selectedGroceryKeys.has(entry.key));
}

function pruneSelectedGroceryKeys() {
  const groceries = Array.isArray(state.groceries) ? state.groceries : [];
  const validKeys = new Set(groceries.map((item, index) => getGrocerySelectionKey(item, index)));
  for (const k of Array.from(selectedGroceryKeys)) {
    if (!validKeys.has(k)) selectedGroceryKeys.delete(k);
  }
}

function parseGroceryQtyParts(item) {
  const unitHint = String(item?.unit || '').trim();
  const valHint = item?.quantityValue;
  const rawDisplay = String(item?.quantity || item?.quantityDisplay || '').trim();

  if (valHint !== null && valHint !== undefined && valHint !== '' && Number.isFinite(Number(valHint)) && unitHint) {
    return { value: Number(valHint), unit: unitHint, display: rawDisplay || `${Number(valHint)} ${unitHint}`.trim() };
  }

  const m = rawDisplay.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+.*)$/);
  if (m) {
    return { value: Number(m[1]), unit: m[2].trim(), display: rawDisplay };
  }
  if (/^\d+(?:\.\d+)?$/.test(rawDisplay) && unitHint) {
    return { value: Number(rawDisplay), unit: unitHint, display: `${rawDisplay} ${unitHint}` };
  }
  return { value: null, unit: unitHint, display: rawDisplay || 'Quantity unavailable' };
}

function normalizeUnitFamily(unitRaw) {
  const u = String(unitRaw || '').trim().toLowerCase();
  if (!u) return { family: 'none', unit: '', factor: 1 };
  if (u === 'mg' || u === 'milligram' || u === 'milligrams') return { family: 'mass', unit: 'g', factor: 0.001 };
  if (u === 'g' || u === 'gm' || u === 'gms' || u === 'gram' || u === 'grams') return { family: 'mass', unit: 'g', factor: 1 };
  if (u === 'kg' || u === 'kgs' || u === 'kilogram' || u === 'kilograms') return { family: 'mass', unit: 'g', factor: 1000 };
  if (u === 'ml' || u === 'millilitre' || u === 'milliliter' || u === 'millilitres' || u === 'milliliters') return { family: 'volume', unit: 'ml', factor: 1 };
  if (u === 'l' || u === 'lt' || u === 'ltr' || u === 'litre' || u === 'liter' || u === 'litres' || u === 'liters') return { family: 'volume', unit: 'ml', factor: 1000 };
  return { family: `exact:${u}`, unit: u, factor: 1 };
}

function formatCombinedUnitValue(baseValue, unitFamily) {
  const roundClean = (n) => Number(n.toFixed(2)).toString();
  if (unitFamily.family === 'mass') {
    if (baseValue >= 1000) return `${roundClean(baseValue / 1000)} kg`;
    return `${roundClean(baseValue)} g`;
  }
  if (unitFamily.family === 'volume') {
    if (baseValue >= 1000) return `${roundClean(baseValue / 1000)} l`;
    return `${roundClean(baseValue)} ml`;
  }
  return unitFamily.unit ? `${roundClean(baseValue)} ${unitFamily.unit}` : roundClean(baseValue);
}

function combineSelectedGroceriesForShare(selectedItems) {
  const byIngredient = new Map();
  for (const item of selectedItems) {
    const cleanName = String(item?.name || '').trim();
    if (!cleanName) continue;
    const normName = cleanName.toLowerCase().replace(/\s+/g, ' ');
    const qtyParts = parseGroceryQtyParts(item);
    const unitFam = normalizeUnitFamily(qtyParts.unit);

    if (!byIngredient.has(normName)) {
      byIngredient.set(normName, {
        name: cleanName,
        category: item.category || 'Other ingredients',
        purchased: Boolean(item.purchased),
        price: Number(item.price || 0),
        parts: []
      });
    } else {
      const existing = byIngredient.get(normName);
      existing.purchased = existing.purchased && Boolean(item.purchased);
      existing.price += Number(item.price || 0);
    }

    const bucket = byIngredient.get(normName);
    if (qtyParts.value !== null && Number.isFinite(qtyParts.value)) {
      const matching = bucket.parts.find((p) => p.numeric && p.unitFamily.family === unitFam.family);
      if (matching) {
        matching.baseValue += qtyParts.value * unitFam.factor;
      } else {
        bucket.parts.push({
          numeric: true,
          baseValue: qtyParts.value * unitFam.factor,
          unitFamily: unitFam
        });
      }
    } else if (qtyParts.display && !bucket.parts.some((p) => !p.numeric && p.text.toLowerCase() === qtyParts.display.toLowerCase())) {
      bucket.parts.push({ numeric: false, text: qtyParts.display });
    }
  }

  return Array.from(byIngredient.values()).map((entry) => {
    const qtyStrings = entry.parts.map((p) => (p.numeric ? formatCombinedUnitValue(p.baseValue, p.unitFamily) : p.text));
    return {
      name: entry.name,
      category: entry.category,
      purchased: entry.purchased,
      price: entry.price,
      quantity: qtyStrings.length > 0 ? qtyStrings.join(' + ') : 'Quantity unavailable'
    };
  });
}

function buildGroceryShareText(selectedItems = null) {
  const sourceItems = Array.isArray(selectedItems)
    ? selectedItems
    : getSelectedGroceryEntries().map((e) => e.item);
  const groceries = combineSelectedGroceriesForShare(sourceItems);
  const grouped = new Map();
  for (const item of groceries) {
    const cat = item.category || 'Other ingredients';
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat).push(item);
  }
  const lines = ['🛒 DAYLIGHT – WEEKLY GROCERY LIST', ''];
  let totalCost = 0;
  let hasCost = false;
  for (const [cat, items] of grouped.entries()) {
    lines.push(cat.toUpperCase());
    for (const item of items) {
      const mark = item.purchased ? '✓' : '○';
      const qty = String(item.quantity || 'Quantity unavailable');
      if (Number.isFinite(Number(item.price)) && Number(item.price) > 0) {
        hasCost = true;
        totalCost += Number(item.price);
      }
      lines.push(`${mark} ${item.name} – ${qty}`);
    }
    lines.push('');
  }
  const purchasedCount = groceries.filter((i) => i.purchased).length;
  const pendingCount = groceries.length - purchasedCount;
  lines.push(`Selected items: ${groceries.length} (${purchasedCount} purchased, ${pendingCount} pending).`);
  if (hasCost) {
    lines.push(`Estimated total cost: ₹${totalCost.toFixed(2)}`);
  }
  lines.push('Generated from my weekly Daylight Wellness diet plan.');
  return lines.join('\n');
}

async function copyGroceryTextToClipboard(text) {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

function showGroceryShareMenu(shareText, selectedCount = null) {
  if (!dialog) return;
  const encodedText = encodeURIComponent(shareText);
  const encodedSubject = encodeURIComponent('DAYLIGHT – Weekly Grocery List');
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodedText}`;
  const mailtoUrl = `mailto:?subject=${encodedSubject}&body=${encodedText}`;
  const smsUrl = `sms:?body=${encodedText}`;
  const hasNativeShare = Boolean(navigator.share && typeof navigator.share === 'function');
  const shareSubtitle = Number.isInteger(selectedCount)
    ? `Choose where to share your ${selectedCount} selected grocery ${selectedCount === 1 ? 'item' : 'items'}.`
    : 'Choose where to share your selected grocery items.';

  const whatsappSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.49 0 .16 5.33.16 11.9c0 2.1.55 4.15 1.6 5.95L0 24l6.31-1.65a11.87 11.87 0 0 0 5.75 1.47h.01c6.57 0 11.9-5.33 11.9-11.9 0-3.18-1.24-6.17-3.45-8.44zM12.07 21.8h-.01a9.87 9.87 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.27c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.13 1.03 7 2.9a9.83 9.83 0 0 1 2.89 7c0 5.46-4.44 9.89-9.89 9.89zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.2 5.07 4.48.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/></svg>`;

  dialog.innerHTML = `<form method="dialog" class="dialog-card"><button class="close" aria-label="Close sharing menu">×</button><p class="eyebrow">SHARE GROCERY LIST</p><h2>Send your shopping list</h2><p class="subtle">${esc(shareSubtitle)}</p><div class="grocery-share-options"><a class="grocery-share-option grocery-share-whatsapp" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" data-share-channel="whatsapp"><span class="grocery-share-label"><span class="grocery-share-icon-badge whatsapp-badge">${whatsappSvg}</span><span><strong>WhatsApp</strong><small>Open WhatsApp or WhatsApp Web</small></span></span><b>↗</b></a><a class="grocery-share-option" href="${telegramUrl}" target="_blank" rel="noopener noreferrer" data-share-channel="telegram"><span class="grocery-share-label"><span class="grocery-share-icon-badge">✈️</span><span><strong>Telegram</strong><small>Share via Telegram</small></span></span><b>↗</b></a><a class="grocery-share-option" href="${mailtoUrl}" data-share-channel="email"><span class="grocery-share-label"><span class="grocery-share-icon-badge">✉️</span><span><strong>Email</strong><small>Open default email app</small></span></span><b>↗</b></a><a class="grocery-share-option" href="${smsUrl}" data-share-channel="sms"><span class="grocery-share-label"><span class="grocery-share-icon-badge">💬</span><span><strong>SMS / Messages</strong><small>Send via text message</small></span></span><b>↗</b></a><button type="button" class="grocery-share-option" id="copyGroceryListBtn"><span class="grocery-share-label"><span class="grocery-share-icon-badge">📋</span><span><strong>Copy Grocery List</strong><small>Copy formatted text to clipboard</small></span></span><b>Copy</b></button>${hasNativeShare ? `<button type="button" class="grocery-share-option" id="nativeShareMoreBtn"><span class="grocery-share-label"><span class="grocery-share-icon-badge">⋯</span><span><strong>More sharing options</strong><small>Open device native share menu</small></span></span><b>↗</b></button>` : ''}</div><p id="groceryCopyStatus" class="green-text" role="status" style="min-height:18px;"></p><pre class="grocery-share-preview">${esc(shareText)}</pre></form>`;

  dialog.querySelector('#copyGroceryListBtn')?.addEventListener('click', async () => {
    const ok = await copyGroceryTextToClipboard(shareText);
    const status = dialog.querySelector('#groceryCopyStatus');
    if (status) {
      status.textContent = ok ? '✓ Grocery list copied to clipboard!' : 'Unable to copy automatically. Please copy from the preview below.';
    }
  });

  dialog.querySelector('#nativeShareMoreBtn')?.addEventListener('click', async () => {
    try {
      await navigator.share({
        title: 'DAYLIGHT – Weekly Grocery List',
        text: shareText
      });
    } catch (err) {
      if (err && err.name !== 'AbortError') {
        const status = dialog.querySelector('#groceryCopyStatus');
        if (status) status.textContent = 'Native share menu unavailable. Use WhatsApp, Telegram, Email, or Copy above.';
      }
    }
  });

  if (!dialog.open) dialog.showModal();
}

function updateGrocerySelectionUi() {
  const groceries = Array.isArray(state.groceries) ? state.groceries : [];
  pruneSelectedGroceryKeys();
  const selectedCount = getSelectedGroceryEntries().length;
  const summaryEl = document.querySelector('#grocerySelectionSummary');
  const clearBtn = document.querySelector('#clearGrocerySelectionBtn');
  const selectAllBtn = document.querySelector('#selectAllGroceriesBtn');
  const msgEl = document.querySelector('#grocerySelectionMsg');

  if (summaryEl) {
    summaryEl.textContent = `${selectedCount} of ${groceries.length} selected to share`;
  }
  if (clearBtn) clearBtn.disabled = selectedCount === 0;
  if (selectAllBtn) selectAllBtn.disabled = groceries.length === 0 || selectedCount === groceries.length;
  if (msgEl) msgEl.textContent = grocerySelectionMessage || '';

  document.querySelectorAll('[data-share-select]').forEach((input) => {
    const key = input.dataset.shareKey || '';
    const checked = selectedGroceryKeys.has(key);
    input.checked = checked;
    const row = input.closest?.('.grocery');
    if (row && row.classList) row.classList.toggle('is-selected', checked);
  });
}

function toggleShareSelectionItem(index, checked) {
  const item = state.groceries?.[index];
  if (!item) return;
  const key = getGrocerySelectionKey(item, index);
  if (checked) {
    selectedGroceryKeys.add(key);
  } else {
    selectedGroceryKeys.delete(key);
  }
  grocerySelectionMessage = '';
  updateGrocerySelectionUi();
}

function selectAllGroceriesForShare() {
  const groceries = Array.isArray(state.groceries) ? state.groceries : [];
  groceries.forEach((item, index) => {
    selectedGroceryKeys.add(getGrocerySelectionKey(item, index));
  });
  grocerySelectionMessage = '';
  updateGrocerySelectionUi();
}

function clearGroceryShareSelection() {
  selectedGroceryKeys.clear();
  grocerySelectionMessage = '';
  updateGrocerySelectionUi();
}

function shareGroceryList() {
  const groceries = Array.isArray(state.groceries) ? state.groceries : [];
  if (groceries.length === 0) {
    showNotice('Generate your grocery list from a weekly diet plan before sharing.');
    return;
  }
  pruneSelectedGroceryKeys();
  const selectedEntries = getSelectedGroceryEntries();
  if (selectedEntries.length === 0) {
    grocerySelectionMessage = 'Please select at least one grocery item to share.';
    updateGrocerySelectionUi();
    showNotice('Please select at least one grocery item to share.');
    return;
  }
  grocerySelectionMessage = '';
  updateGrocerySelectionUi();
  const combinedItems = combineSelectedGroceriesForShare(selectedEntries.map((e) => e.item));
  const shareText = buildGroceryShareText(selectedEntries.map((e) => e.item));
  showGroceryShareMenu(shareText, combinedItems.length);
}

async function showGroceryHistoryDialog() {
  if (!dialog) return;
  const history = await apiRequest('/groceries/history');
  const rows = Array.isArray(history) ? history : [];
  dialog.innerHTML = `<form method="dialog" class="dialog-card"><button class="close">×</button><p class="eyebrow">SHOPPING HISTORY</p><h2>Saved grocery snapshots</h2>${rows.length ? rows.map((h) => {
    const dt = new Date(h.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
    const items = Array.isArray(h.snapshot_items) ? h.snapshot_items : [];
    return `<div class="admin-row" style="align-items:flex-start;"><span><b>${esc(dt)}</b><small>${Number(h.purchased_count || 0)} of ${Number(h.total_count || items.length)} items purchased</small><small>${esc(items.slice(0, 5).map((i) => `${i.name} (${i.quantity})`).join(', '))}${items.length > 5 ? '…' : ''}</small></span></div>`;
  }).join('') : '<p class="subtle">No previous shopping history snapshots yet.</p>'}<button class="primary" style="margin-top:16px;">Close</button></form>`;
  if (!dialog.open) dialog.showModal();
}

function renderGrocery() {
  const isDbUser = Boolean(session && session.userId && session.userId !== 'demo-user' && session.role === 'user');
  const hasDbSyncedItems = Array.isArray(state.groceries) && state.groceries.some((i) => Boolean(i?.id));
  const groceries = isDbUser
    ? (groceryLoaded || hasDbSyncedItems ? (Array.isArray(state.groceries) ? state.groceries : []) : [])
    : (Array.isArray(state.groceries) && state.groceries.length > 0 ? state.groceries : []);

  pruneSelectedGroceryKeys();
  const totalCount = groceries.length;
  const purchasedCount = groceries.filter((i) => i.purchased).length;
  const pendingCount = totalCount - purchasedCount;
  const selectedCount = groceries.filter((item, index) => selectedGroceryKeys.has(getGrocerySelectionKey(item, index))).length;
  const subtitle = groceryMeta?.daysCovered
    ? `Generated from your ${groceryMeta.daysCovered}-day diet plan (${esc(groceryMeta.planName || 'Weekly Plan')}).`
    : 'Automatically generated from your weekly diet plan and recipe dataset.';

  const grouped = new Map();
  groceries.forEach((item, index) => {
    const cat = item.category || 'Other ingredients';
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat).push({ item, index });
  });

  const planChangedBanner = groceryMeta?.planChanged
    ? `<div class="grocery-plan-notice"><span>Your weekly diet plan was updated since this grocery list was generated.</span><button type="button" class="secondary" id="groceryPlanChangedRefresh">Refresh from latest plan</button></div>`
    : '';

  const selectionBar = totalCount > 0
    ? `<div class="grocery-selection-bar"><span class="grocery-selection-count" id="grocerySelectionSummary">${selectedCount} of ${totalCount} selected to share</span><div class="grocery-selection-actions"><button type="button" class="grocery-selection-btn" id="selectAllGroceriesBtn"${selectedCount === totalCount ? ' disabled' : ''}>Select All</button><button type="button" class="grocery-selection-btn" id="clearGrocerySelectionBtn"${selectedCount === 0 ? ' disabled' : ''}>Clear Selection</button></div></div><p id="grocerySelectionMsg" class="grocery-selection-msg" role="status">${esc(grocerySelectionMessage || '')}</p>`
    : '';

  const listMarkup = groceryLoading && !groceryLoaded
    ? '<p class="subtle" style="margin-top:18px;">Generating weekly groceries from your diet plan…</p>'
    : totalCount === 0
      ? '<article class="notice" style="margin-top:18px;"><b>No grocery items yet</b><span>Create or view a diet plan in the Plan tab, then click Refresh Grocery List.</span></article>'
      : Array.from(grouped.entries()).map(([category, entries]) => `
          <section class="grocery-category-group">
            <h3 class="grocery-category-header"><span>${esc(category)}</span><span class="grocery-category-count">${entries.length}</span></h3>
            <div class="grocery-list">
              ${entries.map(({ item, index }) => {
                const qtyText = String(item.quantity || 'Quantity unavailable');
                const isUnavailable = /unavailable/i.test(qtyText);
                const selKey = getGrocerySelectionKey(item, index);
                const isSelected = selectedGroceryKeys.has(selKey);
                return `<div class="grocery ${item.purchased ? 'is-purchased' : ''}${isSelected ? ' is-selected' : ''}"><label class="grocery-purchase-label"><input class="grocery-native-check" type="checkbox" data-grocery="${index}" data-grocery-id="${esc(item.id || '')}" ${item.purchased ? 'checked' : ''}><span class="grocery-tick" aria-hidden="true">${item.purchased ? '✓' : ''}</span><span><b>${esc(item.name)}</b><small class="${isUnavailable ? 'grocery-qty-unavailable' : ''}">${esc(qtyText)}</small></span></label><label class="grocery-share-select" title="Select ${esc(item.name)} to share"><input class="grocery-share-checkbox" type="checkbox" data-share-select="${index}" data-share-key="${esc(selKey)}" aria-label="Select ${esc(item.name)} to share" ${isSelected ? 'checked' : ''}><span class="grocery-share-check-label">Share</span></label></div>`;
              }).join('')}
            </div>
          </section>
        `).join('');

  return `<div class="grocery-header-row"><div><p class="eyebrow">PLAN TO KITCHEN</p><h1>Smart grocery list</h1><p class="subtle">${subtitle}</p></div><button type="button" class="grocery-share-btn" id="groceryShareButton" aria-label="Share selected grocery items" title="Share selected grocery items"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></button></div><div class="grocery-toolbar"><span class="grocery-summary-pill">${purchasedCount} purchased · ${pendingCount} pending (${totalCount} total)</span><div class="grocery-toolbar-actions"><button type="button" class="secondary" id="refreshGroceryButton">${groceryLoading ? 'Refreshing…' : '↻ Refresh Grocery List'}</button>${isDbUser ? '<button type="button" class="secondary" id="groceryHistoryButton">History</button>' : ''}</div></div>${selectionBar}${planChangedBanner}${listMarkup}`;
}

function renderProfile() {
  const p = state.profile || defaultState.profile;
  const h = health();
  const name = p.name || 'Adarsh';
  if (!emailPrefsLoaded && session?.role === 'user') {
    emailPrefsLoaded = true;
    apiRequest('/profile/email-preferences').then((res) => {
      if (res && typeof res.daily_report_enabled === 'boolean') {
        userDailyReportEnabled = res.daily_report_enabled;
        const toggle = document.querySelector('#dailyReportToggle');
        if (toggle) toggle.checked = userDailyReportEnabled;
      }
    }).catch(() => { });
  }
  return `${renderHeader()}<p class="eyebrow">YOUR FOUNDATION</p><h1>${esc(name)}'s profile</h1><section class="profile-summary"><div class="avatar large">${esc(initials(name))}</div><div><strong>${esc(p.preference || 'Vegetarian')}</strong><span>${esc(p.goal || 'Maintain')} · ${esc(p.activity || 'Moderate')} activity</span><button data-action="edit">Edit health details →</button></div></section><section class="metrics">${metric('Height', p.height || 174, 'cm', 'Current', 'mint')}${metric('Weight', p.weight || 68, 'kg', `Target ${p.targetWeight || 65} kg`, 'peach')}${metric('BMI', h.bmi.toFixed(1), 'kg/m²', h.label, 'blue')}</section><section class="email-preferences-card"><div class="section-title-row"><div><p class="eyebrow">COMMUNICATION</p><h3>Email Preferences</h3></div></div><p class="muted-small" style="margin-bottom:12px;">Manage automated progress reports sent to your registered email address.</p><div class="pref-row"><div class="pref-info"><strong>Daily Progress Report (9:00 PM IST)</strong><p class="muted-small">Receive an evening summary of nutrition, completed meals, water intake, and physical activity.</p></div><label class="switch-toggle" aria-label="Toggle daily progress report email"><input type="checkbox" id="dailyReportToggle" ${userDailyReportEnabled ? 'checked' : ''}><span class="slider"></span></label></div><div class="pref-row"><div class="pref-info"><strong>Welcome &amp; Security Alerts</strong><p class="muted-small">Registration confirmations, plan generation notices, and password reset links.</p></div><span class="badge-always-on">Always active</span></div><div class="pref-actions-row"><button type="button" class="btn-ghost-small" id="sendTestDailyReportBtn">Send Test Report to My Email</button><span id="emailPrefFeedback" class="inline-feedback"></span></div></section><article class="notice"><b>Your data, your pace.</b><span>Plans and tracking stay available offline on this device.</span><button data-action="logout">Sign out securely</button></article>`;
}

function formatAiResponse(text) {
  if (!text) return '';
  const escaped = esc(text);
  return escaped
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

function renderAiAssistant() {
  const p = state.profile || defaultState.profile;
  const name = p.name || 'Friend';

  return `${renderHeader()}<p class="eyebrow">DAYLIGHT AI</p>
<section class="ai-assistant-container">
  <div class="ai-header">
    <div class="ai-header-info">
      <div class="ai-avatar">🌿</div>
      <div>
        <h2>Daylight AI</h2>
        <p class="ai-subtitle">Your Personal Food &amp; Nutrition Guide</p>
      </div>
    </div>
    <button type="button" class="ai-clear-btn" id="aiClearChatBtn" title="Clear conversation">🗑️ Clear</button>
  </div>

  <div class="ai-topic-notice">
    💡 <b>Daylight AI</b> specializes exclusively in food, nutrition, healthy eating, recipes, and dietary guidance tailored to your profile.
  </div>

  <div class="ai-messages" id="aiMessagesContainer" role="log" aria-live="polite">
    ${aiChatMessages.length === 0 ? `
      <div class="ai-welcome-box">
        <div class="ai-welcome-icon">🥗</div>
        <h3>Hello, ${esc(name)}!</h3>
        <p>I am your Daylight Food &amp; Nutrition Assistant. Ask me about personalized meals, recipes, calorie &amp; macro breakdowns, healthy swaps, or nutritional advice based on your health profile.</p>
        <p class="ai-welcome-tip">Pick a suggestion below or type your question!</p>
      </div>
    ` : aiChatMessages.map((m) => `
      <div class="ai-bubble ${m.role === 'user' ? 'ai-bubble-user' : 'ai-bubble-assistant'}">
        <div class="ai-bubble-content">${formatAiResponse(m.content)}</div>
        <span class="ai-bubble-time">${esc(m.time || '')}</span>
      </div>
    `).join('')}
    ${aiChatLoading ? `
      <div class="ai-bubble ai-bubble-assistant ai-typing">
        <div class="typing-indicator"><span></span><span></span><span></span></div>
      </div>
    ` : ''}
  </div>

  <div class="ai-suggestions-row" id="aiSuggestionsRow">
    ${AI_SUGGESTIONS.map((s) => `<button type="button" class="ai-chip" data-ai-prompt="${esc(s)}">${esc(s)}</button>`).join('')}
  </div>

  <form class="ai-input-form" id="aiChatForm">
    <input type="text" id="aiChatInput" class="ai-input" placeholder="Ask about meals, recipes, nutrition..." autocomplete="off" ${aiChatLoading ? 'disabled' : ''} />
    <button type="submit" id="aiSendBtn" class="ai-send-button" aria-label="Send message" ${aiChatLoading ? 'disabled' : ''}>
      <span class="send-icon">➤</span>
    </button>
  </form>
</section>`;
}

const STANDARD_MEALS = ['Breakfast', 'Morning Snack', 'Lunch', 'Evening Snack', 'Dinner'];

function emptyAdminDay(number) {
  return {
    day: number,
    meals: STANDARD_MEALS.map((type) => ({
      type,
      foods: []
    }))
  };
}

function loadPlanDayMeals(plan, dayNum = 1) {
  if (!plan || !plan.meals) return null;
  const mealTimes = {
    'Breakfast': '08:00 AM',
    'Morning Snack': '11:00 AM',
    'Lunch': '01:00 PM',
    'Evening Snack': '05:00 PM',
    'Dinner': '08:00 PM'
  };

  if (Array.isArray(plan.meals) && plan.meals.length > 0 && plan.meals[0].meals) {
    const dayObj = plan.meals.find((d) => Number(d.day) === Number(dayNum)) || plan.meals[0];
    const result = [];
    (dayObj.meals || []).forEach((m) => {
      const foods = m.foods || m.items || [];
      foods.forEach((food) => {
        if (!food || !food.name) return;
        result.push({
          type: m.type || 'Meal',
          time: mealTimes[m.type] || '12:00 PM',
          name: food.name,
          calories: Number(food.calories || 0),
          protein: Number(food.protein || 0),
          carbs: Number(food.carbohydrates || food.carbs || 0),
          fat: Number(food.fats || food.fat || 0),
          portion: parseFloat(food.portion ?? food.quantity ?? food.servingSize) || 100,
          ingredients: food.ingredients || [food.name],
          instructions: Array.isArray(food.instructions) ? food.instructions : [],
          recipe: food.recipe || 'Recipe instructions are not available yet.',
          swaps: food.swaps || [],
          recipeDetails: food.recipeDetails || null
        });
      });
    });
    return result.length > 0 ? result : null;
  }

  if (Array.isArray(plan.meals) && plan.meals.length > 0) {
    return plan.meals;
  }
  return null;
}

function currentPlanDay(plan) {
  if (!plan || !plan.start_date || !plan.number_of_days || plan.number_of_days <= 1) return 1;
  const start = new Date(plan.start_date);
  start.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;
  if (diffDays >= 1 && diffDays <= plan.number_of_days) return diffDays;
  return 1;
}

async function syncUserDietPlan() {
  if (!session || !session.userId || session.userId === 'demo-user' || session.role !== 'user') return;
  try {
    const plans = await apiRequest('/plans');
    if (Array.isArray(plans) && plans.length > 0) {
      planHistoryDbData = plans;
      state.activeDietPlan = plans[0];
      selectedPlanDay = currentPlanDay(state.activeDietPlan);
      const dayMeals = loadPlanDayMeals(state.activeDietPlan, selectedPlanDay);
      if (dayMeals && dayMeals.length > 0) {
        meals = dayMeals;
        state.mealPlan = meals;
      }
    } else {
      state.activeDietPlan = null;
    }
  } catch (err) {
    console.warn('Sync user diet plan:', err.message);
  }
}

function renderAdmin() {
  const adminUsers = adminUsersData.length ? adminUsersData : users.filter((user) => user.role === 'user');
  const membersCount = typeof adminStats?.members === 'number' ? adminStats.members : adminUsers.length;
  const activeCount = typeof adminStats?.active === 'number' ? adminStats.active : adminUsers.filter((user) => user.status !== 'inactive').length;
  const activeSessionsCount = typeof adminStats?.activeSessions === 'number' ? adminStats.activeSessions : adminUsers.reduce((sum, u) => sum + (Number(u.active_sessions_count) || 0), 0);
  const planCount = typeof adminStats?.dietPlans === 'number' ? adminStats.dietPlans : adminPlansData.length;
  const foodCount = typeof adminStats?.foodItems === 'number' && adminStats.foodItems > 0 ? adminStats.foodItems : datasetFoods.length;

  const recentLogins = Array.isArray(adminLoginActivityData) ? adminLoginActivityData : [];

  return `
    <section class="admin-heading">
      <div>
        <p class="eyebrow">DAYLIGHT ADMIN</p>
        <h1>Operations at a glance.</h1>
        <p class="subtle">Real-time registered users, multi-device login activity, and wellness catalogue.</p>
      </div>
      <button class="secondary" data-admin-refresh style="height:fit-content;display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;">
        <span>🔄</span> Refresh Data
      </button>
    </section>

    <section class="admin-stats">
      ${metric('Total Members', membersCount, 'users', 'Registered accounts', 'mint')}
      ${metric('Active Users', activeCount, 'users', 'Active account status', 'peach')}
      ${metric('Active Sessions', activeSessionsCount, 'devices', 'Live connected devices', 'blue')}
      ${metric('Diet Plans', planCount, 'plans', 'Database plans', 'lilac')}
    </section>

    <section class="admin-grid">
      <!-- 1. Registered Users Management Card -->
      <article class="admin-card wide-card">
        <div class="card-heading" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
          <div style="display:flex;gap:10px;align-items:center;">
            <span style="font-size:22px;">👥</span>
            <div>
              <h2 style="margin:0;">Registered Users Directory</h2>
              <small style="color:#71817c;">All registered user accounts saved in the central PostgreSQL database</small>
            </div>
          </div>
          <span style="font-size:11px;font-weight:700;color:#176b52;background:#e5f1df;padding:4px 10px;border-radius:12px;">${adminUsers.length} total registered</span>
        </div>
        <input class="admin-search" id="adminUserSearch" placeholder="Search by name, email, or user ID...">
        <div id="adminUsers">
          ${adminUsers.length ? adminUsers.map((user) => {
            const regDate = user.registered_at ? new Date(user.registered_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unknown';
            const lastLogin = (user.last_login_at || user.last_activity_at) ? new Date(user.last_login_at || user.last_activity_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Never';
            const isInactive = user.status === 'inactive';
            const activeSessions = Number(user.active_sessions_count || 0);

            return `
              <div class="admin-row" data-user-row="${esc(`${user.name} ${user.email} ${user.id}`.toLowerCase())}" style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #edf1ed;gap:12px;">
                <span style="flex:1;min-width:0;">
                  <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:3px;">
                    <b style="font-size:13px;color:#18372c;">${esc(user.name)}</b>
                    <code style="background:#e5f1df;color:#176b52;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:700;">ID: ${esc(user.id.slice(0, 8))}...</code>
                    <span style="padding:2px 8px;border-radius:12px;font-size:10px;font-weight:700;background:${isInactive ? '#fbeae8' : '#e5f1df'};color:${isInactive ? '#a33e3e' : '#176b52'};">
                      ${isInactive ? '● Inactive' : '● Active'}
                    </span>
                    ${activeSessions > 0 ? `<span style="padding:2px 8px;border-radius:12px;font-size:10px;font-weight:700;background:#d4edda;color:#155724;">🟢 ${activeSessions} Device${activeSessions > 1 ? 's' : ''} Online</span>` : ''}
                  </div>
                  <small style="color:#71817c;font-size:11px;display:flex;flex-wrap:wrap;gap:10px;">
                    <span>✉ ${esc(user.email)}</span>
                    <span>📅 Registered: ${esc(regDate)}</span>
                    <span>⏱ Last Login: ${esc(lastLogin)}</span>
                    ${user.last_device_type ? `<span>📱 Device: ${esc(user.last_device_name || user.last_device_type)}</span>` : ''}
                  </small>
                </span>
                <button data-admin-user="${user.id}" style="padding:6px 12px;border:1px solid #9acb99;border-radius:8px;color:#176b52;background:transparent;font-size:11px;font-weight:700;cursor:pointer;">View</button>
              </div>
            `;
          }).join('') : '<p class="subtle">No user accounts yet.</p>'}
        </div>
      </article>

      <!-- 2. Real-Time Login Activity & Device Tracking Card -->
      <article class="admin-card wide-card">
        <div class="card-heading" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:10px;">
          <div style="display:flex;gap:10px;align-items:center;">
            <span style="font-size:22px;">📱</span>
            <div>
              <h2 style="margin:0;">Real-Time User Login Activity & Devices</h2>
              <small style="color:#71817c;">Multi-device independent sessions and login history across phones, tablets, and computers</small>
            </div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <div class="range-tabs" style="display:flex;gap:4px;padding:3px;border-radius:9px;background:#e5f1df;">
              <button type="button" data-login-filter="all" class="${adminActivityFilter === 'all' ? 'active' : ''}" style="padding:5px 9px;border:0;border-radius:7px;font-size:10px;font-weight:700;cursor:pointer;background:${adminActivityFilter === 'all' ? '#176b52' : 'transparent'};color:${adminActivityFilter === 'all' ? '#fff' : '#548465'};">All Logins</button>
              <button type="button" data-login-filter="active" class="${adminActivityFilter === 'active' ? 'active' : ''}" style="padding:5px 9px;border:0;border-radius:7px;font-size:10px;font-weight:700;cursor:pointer;background:${adminActivityFilter === 'active' ? '#176b52' : 'transparent'};color:${adminActivityFilter === 'active' ? '#fff' : '#548465'};">🟢 Active Sessions</button>
              <button type="button" data-login-filter="logged_out" class="${adminActivityFilter === 'logged_out' ? 'active' : ''}" style="padding:5px 9px;border:0;border-radius:7px;font-size:10px;font-weight:700;cursor:pointer;background:${adminActivityFilter === 'logged_out' ? '#176b52' : 'transparent'};color:${adminActivityFilter === 'logged_out' ? '#fff' : '#548465'};">⚪ Logged Out</button>
            </div>
          </div>
        </div>

        <input class="admin-search" id="adminLoginSearch" placeholder="Filter activity by user name, email, or device type..." style="margin-bottom:12px;">

        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">
            <thead>
              <tr style="border-bottom:2px solid #dce7df;color:#176b52;font-size:11px;letter-spacing:.05em;text-transform:uppercase;">
                <th style="padding:10px 8px;">User</th>
                <th style="padding:10px 8px;">Device Type</th>
                <th style="padding:10px 8px;">Login Date & Time</th>
                <th style="padding:10px 8px;">Session Status</th>
                <th style="padding:10px 8px;text-align:right;">Client IP</th>
              </tr>
            </thead>
            <tbody id="adminLoginTableBody">
              ${recentLogins.length ? recentLogins.map((entry) => {
                const isMobile = entry.device_type === 'Mobile';
                const isTablet = entry.device_type === 'Tablet';
                const devBadge = isMobile
                  ? `<span style="background:#e5f1df;color:#176b52;padding:3px 8px;border-radius:12px;font-size:10px;font-weight:700;display:inline-flex;align-items:center;gap:4px;">📱 Mobile</span>`
                  : isTablet
                    ? `<span style="background:#e8f0fe;color:#1a73e8;padding:3px 8px;border-radius:12px;font-size:10px;font-weight:700;display:inline-flex;align-items:center;gap:4px;">📟 Tablet</span>`
                    : `<span style="background:#f3f7f4;color:#435b52;padding:3px 8px;border-radius:12px;font-size:10px;font-weight:700;display:inline-flex;align-items:center;gap:4px;">💻 Desktop</span>`;

                const statusBadge = entry.session_status === 'active'
                  ? `<span style="padding:2px 8px;border-radius:12px;font-size:10px;font-weight:700;background:#d4edda;color:#155724;display:inline-flex;align-items:center;gap:4px;"><span style="display:inline-block;width:6px;height:6px;background:#28a745;border-radius:50%;"></span> Active Session</span>`
                  : entry.session_status === 'logged_out'
                    ? `<span style="padding:2px 8px;border-radius:12px;font-size:10px;font-weight:700;background:#f1f3f4;color:#5f6368;">⚪ Logged Out</span>`
                    : `<span style="padding:2px 8px;border-radius:12px;font-size:10px;font-weight:700;background:#fff3cd;color:#856404;">⏱ Expired</span>`;

                const loginTime = entry.logged_in_at ? new Date(entry.logged_in_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Unknown';
                const lastActivity = entry.last_activity_at ? new Date(entry.last_activity_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'None';
                const logoutTime = entry.logged_out_at ? new Date(entry.logged_out_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : null;

                const isHiddenByFilter = (adminActivityFilter === 'active' && entry.session_status !== 'active') || (adminActivityFilter === 'logged_out' && entry.session_status !== 'logged_out');

                return `
                  <tr class="admin-login-row" data-login-status="${esc(entry.session_status)}" data-login-row="${esc(`${entry.user_name} ${entry.user_email} ${entry.device_type} ${entry.device_name}`.toLowerCase())}" style="border-bottom:1px solid #edf1ed;${isHiddenByFilter ? 'display:none;' : ''}">
                    <td style="padding:10px 8px;">
                      <strong style="color:#18372c;font-size:12px;">${esc(entry.user_name)}</strong><br>
                      <small style="color:#71817c;font-size:11px;">✉ ${esc(entry.user_email)}</small>
                    </td>
                    <td style="padding:10px 8px;">
                      ${devBadge}<br>
                      <small style="color:#71817c;font-size:10px;display:block;margin-top:2px;">${esc(entry.device_name || 'Browser')}</small>
                    </td>
                    <td style="padding:10px 8px;">
                      <span style="font-size:11px;color:#21342f;font-weight:600;">${esc(loginTime)}</span><br>
                      <small style="color:#71817c;font-size:10px;">Activity: ${esc(lastActivity)}${logoutTime ? ` · Out: ${esc(logoutTime)}` : ''}</small>
                    </td>
                    <td style="padding:10px 8px;">
                      ${statusBadge}
                    </td>
                    <td style="padding:10px 8px;text-align:right;">
                      <code style="background:#f3f7f4;color:#556b62;padding:2px 6px;border-radius:4px;font-size:10px;">${esc(entry.ip_address || '127.0.0.1')}</code>
                    </td>
                  </tr>
                `;
              }).join('') : `<tr><td colspan="5" style="padding:18px;text-align:center;color:#71817c;font-size:12px;">No login activity recorded yet.</td></tr>`}
            </tbody>
          </table>
        </div>
      </article>

      <!-- 3. Diet Plans Management Card -->
      <article class="admin-card wide-card">
        <div class="card-heading" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <div style="display:flex;gap:10px;align-items:center;">
            <span style="font-size:22px;">📋</span>
            <div>
              <h2 style="margin:0;">Manage Diet Plans</h2>
              <small style="color:#71817c;">Create, edit, view, and delete user diet plans</small>
            </div>
          </div>
          <button class="primary" data-admin-create-plan style="width:auto;margin:0;padding:9px 18px;font-size:12px;font-weight:700;">+ Add New Diet Plan</button>
        </div>
        <div class="plan-filters" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:16px;">
          <input class="admin-search" id="adminPlanSearch" placeholder="Search by plan name, assigned user, email, or plan ID..." style="flex:1;min-width:220px;margin:0;">
          <div style="display:flex;gap:6px;align-items:center;"><label style="font-size:11px;font-weight:700;color:#71817c;">From:</label><input type="date" id="adminPlanFrom" style="padding:9px;border:1px solid #dce7df;border-radius:9px;background:#fffdf7;font-size:12px;"></div>
          <div style="display:flex;gap:6px;align-items:center;"><label style="font-size:11px;font-weight:700;color:#71817c;">To:</label><input type="date" id="adminPlanTo" style="padding:9px;border:1px solid #dce7df;border-radius:9px;background:#fffdf7;font-size:12px;"></div>
        </div>
        <div class="admin-plan-table" style="overflow-x:auto;">
          ${adminPlansData.length ? `<table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;"><thead><tr style="border-bottom:2px solid #dce7df;color:#176b52;font-size:11px;letter-spacing:.05em;text-transform:uppercase;"><th style="padding:10px 8px;">Plan ID</th><th style="padding:10px 8px;">Plan Name</th><th style="padding:10px 8px;">Assigned User</th><th style="padding:10px 8px;">Days</th><th style="padding:10px 8px;">Start Date</th><th style="padding:10px 8px;">End Date</th><th style="padding:10px 8px;text-align:right;">Actions</th></tr></thead><tbody>${adminPlansData.map((plan) => `<tr class="admin-plan-table-row" data-plan-row="${esc(`${plan.plan_name} ${plan.name} ${plan.email} ${plan.id}`.toLowerCase())}" style="border-bottom:1px solid #edf1ed;"><td style="padding:10px 8px;"><code style="background:#e5f1df;padding:3px 7px;border-radius:5px;font-size:11px;color:#176b52;font-weight:700;" title="${esc(plan.id)}">${esc(plan.id.slice(0, 8))}...</code></td><td style="padding:10px 8px;"><strong>${esc(plan.plan_name)}</strong><br><small style="color:#71817c;">${esc(plan.weight_goal || 'Maintain')} · ${esc(plan.food_preference || 'Vegetarian')}</small></td><td style="padding:10px 8px;"><b>${esc(plan.name || 'User')}</b><br><small style="color:#71817c;">${esc(plan.email || '')}</small></td><td style="padding:10px 8px;"><span style="background:#f3f7f4;padding:3px 8px;border-radius:12px;font-weight:600;">${plan.number_of_days} days</span></td><td style="padding:10px 8px;">${esc(String(plan.start_date || '').slice(0, 10))}</td><td style="padding:10px 8px;">${esc(String(plan.end_date || '').slice(0, 10))}</td><td style="padding:10px 8px;text-align:right;white-space:nowrap;"><button data-admin-view-plan="${plan.id}" style="padding:5px 9px;border:1px solid #9acb99;border-radius:7px;color:#176b52;background:transparent;font-size:11px;font-weight:700;cursor:pointer;margin-right:4px;">View</button><button data-admin-edit-plan="${plan.id}" style="padding:5px 9px;border:1px solid #9acb99;border-radius:7px;color:#176b52;background:transparent;font-size:11px;font-weight:700;cursor:pointer;margin-right:4px;">Edit</button><button data-admin-delete-plan="${plan.id}" style="padding:5px 9px;border:1px solid #e5b3b3;border-radius:7px;color:#a33e3e;background:transparent;font-size:11px;font-weight:700;cursor:pointer;">Delete</button></td></tr>`).join('')}</tbody></table>` : '<p class="subtle" style="padding:16px 0;">No database diet plans yet. Click "+ Add New Diet Plan" to assign a plan to a user.</p>'}
        </div>
      </article>

      <!-- 4. Access Control Card -->
      <article class="admin-card wide-card">
        <div class="card-heading"><span>🔐</span><h2>Access Control & Data Isolation</h2></div>
        <p class="subtle">Only authenticated Admin sessions can render this workspace. Passwords and password hashes are never shown. User data and device sessions are isolated by authenticated user ID.</p>
        <div class="security-pill">✓ Central PostgreSQL Database · ✓ Independent Multi-Device Sessions · ✓ Real-Time Activity Tracking · ✓ Admin Role Protection</div>
      </article>
    </section>
  `;
}

async function loadAdminData(force = false) {
  if (adminDataLoading || session?.role !== 'admin' || (adminDataLoaded && !force)) return;
  adminDataLoading = true;
  try {
    const [stats, loadedUsers, loadedPlans, loadedLogins] = await Promise.all([
      apiRequest('/admin/stats'),
      apiRequest('/admin/users'),
      apiRequest('/admin/plans'),
      apiRequest('/admin/login-activity')
    ]);
    if (stats) adminStats = stats;
    adminUsersData = Array.isArray(loadedUsers) ? loadedUsers : [];
    adminPlansData = Array.isArray(loadedPlans) ? loadedPlans : [];
    adminLoginActivityData = Array.isArray(loadedLogins) ? loadedLogins : [];
    adminDataLoaded = true;
  } catch (err) {
    console.warn('Failed to load admin data:', err);
  } finally {
    adminDataLoading = false;
    if (session?.role === 'admin') render();
  }
}

function startAdminPolling() {
  if (adminPollInterval) return;
  adminPollInterval = window.setInterval(() => {
    if (session?.role === 'admin' && !document.hidden && !adminDataLoading) {
      loadAdminData(true);
    }
  }, 8000);
}

function stopAdminPolling() {
  if (adminPollInterval !== null) {
    window.clearInterval(adminPollInterval);
    adminPollInterval = null;
  }
}

async function loadAdminPlansWithFilters() {
  const query = new URLSearchParams();
  const search = document.querySelector('#adminPlanSearch')?.value.trim();
  const from = document.querySelector('#adminPlanFrom')?.value;
  const to = document.querySelector('#adminPlanTo')?.value;
  if (search) query.set('q', search);
  if (from) query.set('from', from);
  if (to) query.set('to', to);
  const plans = await apiRequest(`/admin/plans?${query.toString()}`);
  if (Array.isArray(plans)) {
    adminPlansData = plans;
    render();
  }
}

function showAdminPlanEditor(plan = null) {
  if (!dialog) return;
  dialog.classList.add('wide-dialog');
  const isEditing = Boolean(plan);
  const todayStr = new Date().toISOString().slice(0, 10);
  const defaultEnd = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  let initialMeals = [];
  if (plan && Array.isArray(plan.meals) && plan.meals.length > 0) {
    if (plan.meals[0]?.meals) {
      initialMeals = JSON.parse(JSON.stringify(plan.meals));
    } else {
      initialMeals = [{ day: 1, meals: JSON.parse(JSON.stringify(plan.meals)) }];
    }
  } else {
    initialMeals = Array.from({ length: 7 }, (_, i) => emptyAdminDay(i + 1));
  }

  adminPlanDraft = {
    id: plan?.id || null,
    userId: plan?.user_id || (adminUsersData[0]?.id || ''),
    planName: plan?.plan_name || '',
    startDate: plan?.start_date ? String(plan.start_date).slice(0, 10) : todayStr,
    endDate: plan?.end_date ? String(plan.end_date).slice(0, 10) : defaultEnd,
    numberOfDays: Number(plan?.number_of_days) || initialMeals.length || 7,
    weightGoal: plan?.weight_goal || 'Lose weight',
    foodPreference: plan?.food_preference || 'Vegetarian',
    calorieTarget: Number(plan?.calorie_target) || 2000,
    description: plan?.description || '',
    meals: initialMeals
  };

  const usersOptions = adminUsersData.map((u) => 
    `<option value="${esc(u.id)}" ${u.id === adminPlanDraft.userId ? 'selected' : ''}>${esc(u.name)} (${esc(u.email)}) - ${esc(u.food_preference || 'No preference')}</option>`
  ).join('');

  dialog.innerHTML = `
    <form method="dialog" class="dialog-card profile-form admin-plan-editor" style="max-width:100%;">
      <button type="button" class="close" data-close-dialog>×</button>
      <p class="eyebrow">DIET PLAN MANAGEMENT</p>
      <h2>${isEditing ? 'Edit Diet Plan' : 'Add New Diet Plan'}</h2>
      <p class="subtle" style="margin-bottom:16px;">Configure a personalized multi-day diet plan assigned to a user.</p>

      <div class="form-grid-2">
        <label>Assigned User *
          <select name="userId" required style="font-size:12px;">
            ${usersOptions || '<option value="">No registered users found</option>'}
          </select>
        </label>
        <label>Plan Name *
          <input name="planName" required value="${esc(adminPlanDraft.planName)}" placeholder="e.g. 7-Day Weight Loss Nutrition Plan">
        </label>
      </div>

      <div class="form-grid-3">
        <label>Start Date *
          <input name="startDate" type="date" required value="${adminPlanDraft.startDate}">
        </label>
        <label>End Date *
          <input name="endDate" type="date" required value="${adminPlanDraft.endDate}">
        </label>
        <label>Number of Days *
          <input name="numberOfDays" type="number" min="1" max="365" required value="${adminPlanDraft.numberOfDays}">
        </label>
      </div>

      <div style="display:flex;gap:8px;align-items:center;margin:-4px 0 12px;flex-wrap:wrap;">
        <small style="font-weight:700;color:#71817c;">Quick Duration:</small>
        <button type="button" class="secondary" data-set-days="7" style="padding:4px 10px;font-size:11px;">7 Days</button>
        <button type="button" class="secondary" data-set-days="15" style="padding:4px 10px;font-size:11px;">15 Days</button>
        <button type="button" class="secondary" data-set-days="30" style="padding:4px 10px;font-size:11px;">30 Days</button>
      </div>

      <div class="form-grid-3">
        <label>Weight Goal *
          <select name="weightGoal" required>
            <option value="Lose weight" ${adminPlanDraft.weightGoal === 'Lose weight' ? 'selected' : ''}>Weight Loss</option>
            <option value="Gain muscle" ${adminPlanDraft.weightGoal === 'Gain muscle' ? 'selected' : ''}>Weight Gain</option>
            <option value="Maintain" ${adminPlanDraft.weightGoal === 'Maintain' ? 'selected' : ''}>Maintain Weight</option>
          </select>
        </label>
        <label>Daily Calorie Target (kcal) *
          <input name="calorieTarget" type="number" min="500" max="10000" required value="${adminPlanDraft.calorieTarget}">
        </label>
        <label>Food Preference *
          <select name="foodPreference" required>
            <option value="Vegetarian" ${adminPlanDraft.foodPreference === 'Vegetarian' ? 'selected' : ''}>Vegetarian</option>
            <option value="Vegan" ${adminPlanDraft.foodPreference === 'Vegan' ? 'selected' : ''}>Vegan</option>
            <option value="Non-Vegetarian" ${adminPlanDraft.foodPreference === 'Non-Vegetarian' ? 'selected' : ''}>Non-Vegetarian</option>
          </select>
        </label>
      </div>

      <label>Plan Description & Instructions
        <textarea name="description" rows="2" placeholder="Specific dietary recommendations, hydration advice, or routine notes...">${esc(adminPlanDraft.description)}</textarea>
      </label>

      <div style="display:flex;justify-content:space-between;align-items:center;margin:16px 0 10px;flex-wrap:wrap;gap:10px;">
        <h3 style="margin:0;font-size:16px;color:#176b52;">Daily Meals & Food Items</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" class="secondary" data-copy-day1 style="padding:6px 12px;font-size:11px;font-weight:700;">📋 Duplicate Day 1 to All Days</button>
          <button type="button" class="secondary" data-add-day style="padding:6px 12px;font-size:11px;font-weight:700;">+ Add Day</button>
        </div>
      </div>

      <div id="adminPlanDaysContainer" style="display:grid;gap:14px;max-height:50vh;overflow-y:auto;padding-right:4px;"></div>

      <div id="adminPlanTotalsSummary" style="margin-top:14px;padding:12px 14px;border-radius:12px;background:#e5f1df;color:#176b52;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;font-size:12px;"></div>

      <div style="display:flex;gap:10px;margin-top:16px;">
        <button type="button" class="secondary" data-close-dialog style="flex:1;">Cancel</button>
        <button type="submit" class="primary" style="flex:2;margin:0;">${isEditing ? 'Save Changes' : 'Create Diet Plan'}</button>
      </div>

      <datalist id="adminFoodDatalist">
        ${datasetFoods.map((f) => `<option value="${esc(f.name)}">${f.calories} kcal · ${f.portion || 100}g</option>`).join('')}
      </datalist>
    </form>
  `;

  const form = dialog.querySelector('form');
  const container = dialog.querySelector('#adminPlanDaysContainer');
  const summaryBox = dialog.querySelector('#adminPlanTotalsSummary');
  const startDateInput = dialog.querySelector('input[name="startDate"]');
  const endDateInput = dialog.querySelector('input[name="endDate"]');
  const daysInput = dialog.querySelector('input[name="numberOfDays"]');

  function calcPlanTotals() {
    let cals = 0, prot = 0, carbs = 0, fat = 0;
    let totalFoods = 0;
    (adminPlanDraft.meals || []).forEach((day) => {
      (day.meals || []).forEach((meal) => {
        (meal.foods || []).forEach((food) => {
          cals += Number(food.calories || 0);
          prot += Number(food.protein || 0);
          carbs += Number(food.carbohydrates || food.carbs || 0);
          fat += Number(food.fats || food.fat || 0);
          if (food.name) totalFoods++;
        });
      });
    });
    const days = Math.max(1, adminPlanDraft.meals.length);
    return {
      totalCalories: Math.round(cals),
      totalProtein: Math.round(prot * 10) / 10,
      totalCarbohydrates: Math.round(carbs * 10) / 10,
      totalFat: Math.round(fat * 10) / 10,
      dailyCalories: Math.round(cals / days),
      dailyProtein: Math.round((prot / days) * 10) / 10,
      dailyCarbs: Math.round((carbs / days) * 10) / 10,
      dailyFat: Math.round((fat / days) * 10) / 10,
      totalFoods
    };
  }

  function updatePlanSummary() {
    if (!summaryBox) return;
    const totals = calcPlanTotals();
    summaryBox.innerHTML = `
      <span><strong>Plan Totals:</strong> ${totals.totalCalories} kcal · P: ${totals.totalProtein}g · C: ${totals.totalCarbohydrates}g · F: ${totals.totalFat}g</span>
      <span><strong>Daily Avg:</strong> ${totals.dailyCalories} kcal · P: ${totals.dailyProtein}g · C: ${totals.dailyCarbs}g · F: ${totals.dailyFat}g (${totals.totalFoods} items across ${adminPlanDraft.meals.length} days)</span>
    `;
  }

  function redrawPlanDays() {
    if (!container) return;
    container.innerHTML = adminPlanDraft.meals.map((day, dIdx) => `
      <article class="admin-day-card" data-day-index="${dIdx}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;border-bottom:1px solid #dce7df;padding-bottom:8px;">
          <div>
            <strong style="font-size:14px;color:#176b52;">Day ${day.day || dIdx + 1}</strong>
            <small style="color:#71817c;margin-left:8px;">(${(day.meals || []).reduce((n, m) => n + (m.foods || []).length, 0)} food items)</small>
          </div>
          <div style="display:flex;gap:6px;">
            ${adminPlanDraft.meals.length > 1 ? `<button type="button" data-remove-day="${dIdx}" style="padding:4px 8px;border:1px solid #e5b3b3;border-radius:6px;color:#a33e3e;background:transparent;cursor:pointer;font-size:11px;">Delete Day</button>` : ''}
          </div>
        </div>

        <div class="day-meals-list" style="display:grid;gap:10px;">
          ${(day.meals || []).map((meal, mIdx) => `
            <div class="admin-meal-section">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span style="font-weight:700;font-size:12px;color:#21342f;">
                  ${meal.type === 'Breakfast' ? '☀️' : meal.type === 'Morning Snack' ? '🍏' : meal.type === 'Lunch' ? '🍲' : meal.type === 'Evening Snack' ? '☕' : meal.type === 'Dinner' ? '🌙' : '🍽️'}
                  ${esc(meal.type)}
                </span>
                <div style="display:flex;gap:6px;">
                  <button type="button" data-add-food-item="${dIdx}:${mIdx}" style="padding:4px 8px;border:1px solid #9acb99;border-radius:6px;color:#176b52;background:transparent;cursor:pointer;font-size:11px;font-weight:700;">+ Add Food</button>
                  ${!STANDARD_MEALS.includes(meal.type) ? `<button type="button" data-remove-meal="${dIdx}:${mIdx}" style="padding:3px 6px;border:0;color:#a33e3e;background:transparent;cursor:pointer;font-size:11px;">Delete Meal</button>` : ''}
                </div>
              </div>

              ${(meal.foods && meal.foods.length > 0) ? `
                <div style="overflow-x:auto;">
                  <div style="display:grid;grid-template-columns:1.8fr 1fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 34px;gap:6px;font-size:10px;font-weight:700;color:#71817c;text-transform:uppercase;margin-bottom:4px;padding:0 4px;">
                    <span>Food Item</span><span>Quantity</span><span>Serving</span><span>Kcal</span><span>Prot(g)</span><span>Carb(g)</span><span>Fat(g)</span><span></span>
                  </div>
                  ${meal.foods.map((food, fIdx) => `
                    <div class="admin-food-row">
                      <input data-food-path="${dIdx}:${mIdx}:${fIdx}:name" list="adminFoodDatalist" placeholder="Food name" value="${esc(food.name || '')}" style="font-size:11px;">
                      <input data-food-path="${dIdx}:${mIdx}:${fIdx}:quantity" placeholder="e.g. 1 bowl" value="${esc(food.quantity || '')}" style="font-size:11px;">
                      <input data-food-path="${dIdx}:${mIdx}:${fIdx}:servingSize" placeholder="100 g" value="${esc(food.servingSize || '')}" style="font-size:11px;">
                      <input type="number" step="1" min="0" data-food-path="${dIdx}:${mIdx}:${fIdx}:calories" placeholder="Kcal" value="${food.calories ?? 0}" style="font-size:11px;">
                      <input type="number" step="0.1" min="0" data-food-path="${dIdx}:${mIdx}:${fIdx}:protein" placeholder="Prot" value="${food.protein ?? 0}" style="font-size:11px;">
                      <input type="number" step="0.1" min="0" data-food-path="${dIdx}:${mIdx}:${fIdx}:carbohydrates" placeholder="Carb" value="${food.carbohydrates ?? food.carbs ?? 0}" style="font-size:11px;">
                      <input type="number" step="0.1" min="0" data-food-path="${dIdx}:${mIdx}:${fIdx}:fats" placeholder="Fat" value="${food.fats ?? food.fat ?? 0}" style="font-size:11px;">
                      <button type="button" data-remove-food="${dIdx}:${mIdx}:${fIdx}" style="padding:0;border:0;color:#a33e3e;background:transparent;cursor:pointer;font-size:18px;line-height:1;display:grid;place-items:center;" title="Remove this food item">×</button>
                    </div>
                  `).join('')}
                </div>
              ` : '<p class="subtle" style="font-size:11px;margin:2px 0 6px;color:#7e8c86;">No food items yet. Click "+ Add Food" to add food.</p>'}
            </div>
          `).join('')}
        </div>

        <div style="margin-top:8px;">
          <button type="button" class="secondary" data-add-custom-meal="${dIdx}" style="padding:4px 10px;font-size:11px;">+ Add Custom Meal</button>
        </div>
      </article>
    `).join('');

    updatePlanSummary();

    container.querySelectorAll('[data-add-food-item]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const [d, m] = btn.dataset.addFoodItem.split(':').map(Number);
        if (!adminPlanDraft.meals[d].meals[m].foods) adminPlanDraft.meals[d].meals[m].foods = [];
        adminPlanDraft.meals[d].meals[m].foods.push({
          name: '',
          quantity: '1 portion',
          servingSize: '100 g',
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fats: 0,
          fibre: 0
        });
        redrawPlanDays();
      });
    });

    container.querySelectorAll('[data-remove-food]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const [d, m, f] = btn.dataset.removeFood.split(':').map(Number);
        adminPlanDraft.meals[d].meals[m].foods.splice(f, 1);
        redrawPlanDays();
      });
    });

    container.querySelectorAll('[data-remove-day]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const d = Number(btn.dataset.removeDay);
        adminPlanDraft.meals.splice(d, 1);
        adminPlanDraft.meals.forEach((dayObj, i) => { dayObj.day = i + 1; });
        adminPlanDraft.numberOfDays = adminPlanDraft.meals.length;
        daysInput.value = adminPlanDraft.numberOfDays;
        const start = new Date(startDateInput.value || todayStr);
        const end = new Date(start.getTime() + (adminPlanDraft.numberOfDays - 1) * 24 * 60 * 60 * 1000);
        endDateInput.value = end.toISOString().slice(0, 10);
        adminPlanDraft.endDate = endDateInput.value;
        redrawPlanDays();
      });
    });

    container.querySelectorAll('[data-remove-meal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const [d, m] = btn.dataset.removeMeal.split(':').map(Number);
        adminPlanDraft.meals[d].meals.splice(m, 1);
        redrawPlanDays();
      });
    });

    container.querySelectorAll('[data-add-custom-meal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const d = Number(btn.dataset.addCustomMeal);
        const mealName = prompt('Enter custom meal category name (e.g. Afternoon Snack, Pre-Workout):');
        if (mealName && mealName.trim()) {
          adminPlanDraft.meals[d].meals.push({
            type: mealName.trim(),
            foods: []
          });
          redrawPlanDays();
        }
      });
    });
  }

  container.addEventListener('input', (e) => {
    const input = e.target;
    if (!input.dataset.foodPath) return;
    const [d, m, f, key] = input.dataset.foodPath.split(':');
    const dIdx = Number(d), mIdx = Number(m), fIdx = Number(f);
    const targetFood = adminPlanDraft.meals[dIdx]?.meals[mIdx]?.foods[fIdx];
    if (!targetFood) return;

    if (key === 'name') {
      targetFood.name = input.value.trim();
      const matched = datasetFoods.find((candidate) => candidate.name.toLowerCase() === input.value.trim().toLowerCase());
      if (matched) {
        targetFood.quantity = targetFood.quantity || '1 portion';
        targetFood.servingSize = matched.portion ? `${matched.portion} g` : '100 g';
        targetFood.calories = matched.calories || 0;
        targetFood.protein = matched.protein || 0;
        targetFood.carbohydrates = matched.carbs || 0;
        targetFood.fats = matched.fat || 0;
        targetFood.fibre = matched.fibre || 0;
        redrawPlanDays();
        return;
      }
    } else if (input.type === 'number') {
      targetFood[key] = Number(input.value || 0);
    } else {
      targetFood[key] = input.value;
    }
    updatePlanSummary();
  });

  const syncDatesFromDays = () => {
    const days = Math.max(1, parseInt(daysInput.value, 10) || 1);
    adminPlanDraft.numberOfDays = days;
    const start = new Date(startDateInput.value || todayStr);
    const end = new Date(start.getTime() + (days - 1) * 24 * 60 * 60 * 1000);
    endDateInput.value = end.toISOString().slice(0, 10);
    adminPlanDraft.startDate = startDateInput.value;
    adminPlanDraft.endDate = endDateInput.value;
    while (adminPlanDraft.meals.length < days) {
      adminPlanDraft.meals.push(emptyAdminDay(adminPlanDraft.meals.length + 1));
    }
    redrawPlanDays();
  };

  daysInput.addEventListener('input', syncDatesFromDays);
  startDateInput.addEventListener('change', syncDatesFromDays);

  endDateInput.addEventListener('change', () => {
    const start = new Date(startDateInput.value);
    const end = new Date(endDateInput.value);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
      const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      daysInput.value = diff;
      adminPlanDraft.numberOfDays = diff;
      adminPlanDraft.startDate = startDateInput.value;
      adminPlanDraft.endDate = endDateInput.value;
      while (adminPlanDraft.meals.length < diff) {
        adminPlanDraft.meals.push(emptyAdminDay(adminPlanDraft.meals.length + 1));
      }
      redrawPlanDays();
    }
  });

  dialog.querySelectorAll('[data-set-days]').forEach((btn) => {
    btn.addEventListener('click', () => {
      daysInput.value = btn.dataset.setDays;
      syncDatesFromDays();
    });
  });

  dialog.querySelector('[data-add-day]')?.addEventListener('click', () => {
    adminPlanDraft.meals.push(emptyAdminDay(adminPlanDraft.meals.length + 1));
    adminPlanDraft.numberOfDays = adminPlanDraft.meals.length;
    daysInput.value = adminPlanDraft.numberOfDays;
    const start = new Date(startDateInput.value || todayStr);
    const end = new Date(start.getTime() + (adminPlanDraft.numberOfDays - 1) * 24 * 60 * 60 * 1000);
    endDateInput.value = end.toISOString().slice(0, 10);
    adminPlanDraft.endDate = endDateInput.value;
    redrawPlanDays();
  });

  dialog.querySelector('[data-copy-day1]')?.addEventListener('click', () => {
    if (!adminPlanDraft.meals[0]) return;
    const day1Meals = JSON.parse(JSON.stringify(adminPlanDraft.meals[0].meals));
    for (let i = 1; i < adminPlanDraft.meals.length; i++) {
      adminPlanDraft.meals[i].meals = JSON.parse(JSON.stringify(day1Meals));
    }
    redrawPlanDays();
    showNotice(`Day 1 meals and food items copied to all ${adminPlanDraft.meals.length} days.`);
  });

  dialog.querySelectorAll('[data-close-dialog]').forEach((btn) => {
    btn.addEventListener('click', () => {
      dialog.close();
      dialog.classList.remove('wide-dialog');
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    container.querySelectorAll('[data-food-path]').forEach((input) => {
      const [d, m, f, key] = input.dataset.foodPath.split(':');
      const targetFood = adminPlanDraft.meals[Number(d)]?.meals[Number(m)]?.foods[Number(f)];
      if (targetFood) {
        targetFood[key] = input.type === 'number' ? Number(input.value || 0) : input.value;
      }
    });

    const formData = new FormData(form);
    const totals = calcPlanTotals();

    const payload = {
      userId: formData.get('userId'),
      planName: String(formData.get('planName') || '').trim(),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      numberOfDays: Number(formData.get('numberOfDays')),
      weightGoal: formData.get('weightGoal'),
      foodPreference: formData.get('foodPreference'),
      calorieTarget: Number(formData.get('calorieTarget')),
      description: String(formData.get('description') || '').trim(),
      meals: adminPlanDraft.meals,
      totalCalories: totals.totalCalories,
      totalProtein: totals.totalProtein,
      totalCarbohydrates: totals.totalCarbohydrates,
      totalFat: totals.totalFat
    };

    if (!payload.userId) return alert('Please select a user to assign this plan to.');
    if (!payload.planName) return alert('Please enter a plan name.');

    try {
      const res = await apiRequest(isEditing ? `/admin/plans/${adminPlanDraft.id}` : '/admin/plans', {
        method: isEditing ? 'PATCH' : 'POST',
        body: JSON.stringify(payload)
      });

      if (res && !res.error) {
        dialog.close();
        dialog.classList.remove('wide-dialog');
        await loadAdminData(true);
        showNotice(isEditing ? `Diet plan "${payload.planName}" updated successfully.` : `Diet plan "${payload.planName}" created successfully.`);
      } else {
        alert('Error saving plan: ' + (res?.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to save plan: ' + err.message);
    }
  });

  redrawPlanDays();
  dialog.showModal();
}

function showAdminPlanViewer(plan) {
  if (!dialog || !plan) return;
  dialog.classList.add('wide-dialog');
  const days = Array.isArray(plan.meals) && plan.meals[0]?.meals ? plan.meals : [{ day: 1, meals: Array.isArray(plan.meals) ? plan.meals : [] }];
  
  dialog.innerHTML = `
    <article class="dialog-card profile-form" style="max-width:100%;">
      <button type="button" class="close" data-close-dialog>×</button>
      <p class="eyebrow">DIET PLAN DETAILS</p>
      <h2>${esc(plan.plan_name)}</h2>
      <p class="subtle">Plan ID: <code style="background:#e5f1df;padding:2px 6px;border-radius:4px;color:#176b52;font-size:12px;">${esc(plan.id)}</code></p>

      <div class="metrics" style="margin:16px 0;">
        ${metric('Assigned User', esc(plan.name || 'User'), '', esc(plan.email || ''), 'mint')}
        ${metric('Duration', plan.number_of_days, 'days', `${esc(String(plan.start_date).slice(0, 10))} to ${esc(String(plan.end_date).slice(0, 10))}`, 'peach')}
        ${metric('Calorie Target', plan.calorie_target, 'kcal', `${esc(plan.weight_goal || 'Maintain')} · ${esc(plan.food_preference || 'Vegetarian')}`, 'blue')}
        ${metric('Nutrition Total', Math.round(Number(plan.total_calories || 0)), 'kcal', `P: ${plan.total_protein || 0}g · C: ${plan.total_carbohydrates || 0}g · F: ${plan.total_fat || 0}g`, 'lilac')}
      </div>

      ${plan.description ? `<p style="padding:10px 14px;border-radius:10px;background:#f3f7f4;color:#355346;font-size:13px;line-height:1.5;">${esc(plan.description)}</p>` : ''}

      <h3 style="margin:18px 0 10px;color:#176b52;">Daily Meal Plan Breakdown</h3>
      <div style="display:grid;gap:12px;max-height:55vh;overflow-y:auto;padding-right:4px;">
        ${days.map((day, dIdx) => `
          <div class="admin-day-card">
            <h4 style="margin:0 0 10px;font-size:14px;color:#176b52;">Day ${day.day || dIdx + 1}</h4>
            <div style="display:grid;gap:8px;">
              ${(day.meals || []).map((meal) => {
                const foods = meal.foods || meal.items || [];
                return `
                  <div class="admin-meal-section">
                    <strong style="display:block;margin-bottom:6px;font-size:12px;color:#21342f;">
                      ${meal.type === 'Breakfast' ? '☀️' : meal.type === 'Morning Snack' ? '🍏' : meal.type === 'Lunch' ? '🍲' : meal.type === 'Evening Snack' ? '☕' : meal.type === 'Dinner' ? '🌙' : '🍽️'}
                      ${esc(meal.type)}
                    </strong>
                    ${foods.length > 0 ? `
                      <table style="width:100%;border-collapse:collapse;font-size:11px;">
                        <thead>
                          <tr style="border-bottom:1px solid #dce7df;color:#71817c;text-align:left;">
                            <th style="padding:4px 6px;">Food Item</th>
                            <th style="padding:4px 6px;">Quantity / Serving</th>
                            <th style="padding:4px 6px;">Calories</th>
                            <th style="padding:4px 6px;">Protein</th>
                            <th style="padding:4px 6px;">Carbs</th>
                            <th style="padding:4px 6px;">Fat</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${foods.map((food) => `
                            <tr style="border-bottom:1px solid #f0f4f1;">
                              <td style="padding:5px 6px;"><b>${esc(food.name)}</b></td>
                              <td style="padding:5px 6px;">${esc(food.quantity || food.servingSize || '1 portion')}</td>
                              <td style="padding:5px 6px;">${food.calories || 0} kcal</td>
                              <td style="padding:5px 6px;">${food.protein || 0} g</td>
                              <td style="padding:5px 6px;">${food.carbohydrates || food.carbs || 0} g</td>
                              <td style="padding:5px 6px;">${food.fats || food.fat || 0} g</td>
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>
                    ` : '<p class="subtle" style="font-size:11px;margin:2px 0;">No foods listed for this meal.</p>'}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <div style="display:flex;gap:10px;margin-top:16px;">
        <button type="button" class="secondary" data-close-dialog style="flex:1;">Close</button>
        <button type="button" class="primary" data-open-edit="${plan.id}" style="flex:2;margin:0;">Edit Plan</button>
      </div>
    </article>
  `;

  dialog.querySelectorAll('[data-close-dialog]').forEach((btn) => btn.addEventListener('click', () => {
    dialog.close();
    dialog.classList.remove('wide-dialog');
  }));
  dialog.querySelector('[data-open-edit]')?.addEventListener('click', () => {
    showAdminPlanEditor(plan);
  });
  dialog.showModal();
}

function bindActions() {
  document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => navigateToView(button.dataset.view)));
  document.querySelectorAll('[data-meal-index]').forEach((button) => button.addEventListener('click', () => showMeal(meals[Number(button.dataset.mealIndex)])));
  document.querySelectorAll('[data-exchange-index]').forEach((button) => button.addEventListener('click', () => showExchange(Number(button.dataset.exchangeIndex))));
  document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => handleAction(button.dataset.action)));
  document.querySelectorAll('[data-activity-editor]').forEach((button) => button.addEventListener('click', () => showActivityEditor(button.dataset.activityEditor)));
  document.querySelectorAll('[data-edit-activity]').forEach((button) => button.addEventListener('click', () => {
    const [kind, id] = button.dataset.editActivity.split(':');
    showActivityEditor(kind, activityRecords[kind].find((item) => String(item.id) === id));
  }));
  document.querySelectorAll('[data-delete-activity]').forEach((button) => button.addEventListener('click', async () => {
    if (!confirm('Delete this activity record?')) return;
    const [kind, id] = button.dataset.deleteActivity.split(':');
    if (activityRecords[kind]) {
      activityRecords[kind] = activityRecords[kind].filter((item) => String(item.id) !== id);
      state.activityRecords = activityRecords;
      const act = activityTotals();
      state.water = act.water;
      state.exercise = act.exercise;
      state.sleep = Math.round((act.sleep / 60) * 10) / 10;
      save();
      render();
    }
    if (session && session.userId && session.userId !== 'demo-user' && !String(id).startsWith('local-')) {
      try {
        await apiRequest(`/activity/${kind}/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('Backend delete sync:', err.message);
      }
    }
    showNotice('Activity record deleted.');
  }));
  document.querySelectorAll('[data-range]').forEach((button) => button.addEventListener('click', () => { chartRange = button.dataset.range; render(); }));
  document.querySelectorAll('[data-nextday-meal-index]').forEach((btn) => btn.addEventListener('click', () => {
    const tomorrowPlan = nextDayPlanData?.plan || null;
    const tomorrowMeals = tomorrowPlan ? (loadPlanDayMeals(tomorrowPlan, 1) || []) : [];
    const targetMeal = tomorrowMeals[Number(btn.dataset.nextdayMealIndex)];
    if (targetMeal) showMeal(targetMeal);
  }));
  document.querySelectorAll('[data-meal-check]').forEach((input) => input.addEventListener('change', () => {
    if (!state.mealsDone) state.mealsDone = {};
    state.mealsDone[input.dataset.mealCheck] = input.checked;
    save();
    render();
  }));
  document.querySelectorAll('[data-grocery]').forEach((input) => input.addEventListener('change', () => {
    toggleGroceryItem(Number(input.dataset.grocery), input.checked);
  }));
  document.querySelectorAll('[data-share-select]').forEach((input) => input.addEventListener('change', () => {
    toggleShareSelectionItem(Number(input.dataset.shareSelect), input.checked);
  }));
  document.querySelector('#selectAllGroceriesBtn')?.addEventListener('click', selectAllGroceriesForShare);
  document.querySelector('#clearGrocerySelectionBtn')?.addEventListener('click', clearGroceryShareSelection);
  document.querySelector('#refreshGroceryButton')?.addEventListener('click', regenerateGroceriesFromPlan);
  document.querySelector('#groceryPlanChangedRefresh')?.addEventListener('click', regenerateGroceriesFromPlan);
  document.querySelector('#groceryShareButton')?.addEventListener('click', shareGroceryList);
  document.querySelector('#groceryHistoryButton')?.addEventListener('click', showGroceryHistoryDialog);
  document.querySelectorAll('[data-admin-user]').forEach((button) => button.addEventListener('click', () => showAdminUser(button.dataset.adminUser)));
  document.querySelectorAll('[data-admin-recipe]').forEach((button) => button.addEventListener('click', () => showAdminRecipe(button.dataset.adminRecipe)));
  document.querySelectorAll('[data-admin-food]').forEach((button) => button.addEventListener('click', () => { adminData.foods.splice(Number(button.dataset.adminFood), 1); write(STORAGE.adminData, adminData); render(); }));
  document.querySelectorAll('[data-admin-plan]').forEach((button) => button.addEventListener('click', () => { adminData.plans.splice(Number(button.dataset.adminPlan), 1); write(STORAGE.adminData, adminData); render(); }));
  document.querySelector('[data-admin-create-plan]')?.addEventListener('click', () => showAdminPlanEditor());
  document.querySelectorAll('[data-admin-view-plan]').forEach((button) => button.addEventListener('click', () => {
    const plan = adminPlansData.find((p) => p.id === button.dataset.adminViewPlan);
    if (plan) showAdminPlanViewer(plan);
  }));
  document.querySelectorAll('[data-admin-edit-plan]').forEach((button) => button.addEventListener('click', () => {
    const plan = adminPlansData.find((p) => p.id === button.dataset.adminEditPlan);
    if (plan) showAdminPlanEditor(plan);
  }));
  document.querySelectorAll('[data-admin-delete-plan]').forEach((button) => button.addEventListener('click', async () => {
    const planId = button.dataset.adminDeletePlan;
    const plan = adminPlansData.find((p) => p.id === planId);
    const planName = plan?.plan_name || 'this diet plan';
    const userName = plan?.name || 'the assigned user';
    if (!confirm(`Are you sure you want to permanently delete diet plan "${planName}" assigned to ${userName}?\n\nThis will safely remove the plan and all its associated meal records from PostgreSQL.`)) return;
    const res = await apiRequest(`/admin/plans/${planId}`, { method: 'DELETE' });
    if (res?.ok) {
      showNotice(`Diet plan "${planName}" was successfully deleted.`);
      await loadAdminData(true);
    } else {
      showNotice('Failed to delete diet plan.');
    }
  }));
  document.querySelectorAll('[data-meal-toggle]').forEach((button) => button.addEventListener('click', (e) => {
    e.stopPropagation();
    const index = Number(button.dataset.mealToggle);
    toggleMealCompletion(index);
  }));
  document.querySelectorAll('[data-select-day]').forEach((button) => button.addEventListener('click', async () => {
    selectedPlanDay = Number(button.dataset.selectDay);
    if (state.activeDietPlan) {
      const dayMeals = loadPlanDayMeals(state.activeDietPlan, selectedPlanDay);
      if (dayMeals) {
        meals = dayMeals;
        state.mealPlan = meals;
        save();
        const newPlanDate = getCurrentPlanDate();
        if (!mealCompletionsLoadedDates[newPlanDate] && session && session.userId && session.userId !== 'demo-user' && session.role === 'user') {
          mealCompletionsLoadedDates[newPlanDate] = true;
          await loadMealCompletionsFromDatabase(newPlanDate);
        }
        render();
      }
    }
  }));
  document.querySelector('#adminUserSearch')?.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    document.querySelectorAll('[data-user-row]').forEach((row) => { row.hidden = !row.dataset.userRow.includes(query); });
  });
  document.querySelector('#adminPlanSearch')?.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase().trim();
    document.querySelectorAll('.admin-plan-table-row').forEach((row) => { row.hidden = !row.dataset.planRow.includes(query); });
  });
  document.querySelector('#adminPlanFrom')?.addEventListener('change', loadAdminPlansWithFilters);
  document.querySelector('#adminPlanTo')?.addEventListener('change', loadAdminPlansWithFilters);
  document.querySelector('[data-admin-refresh]')?.addEventListener('click', () => {
    loadAdminData(true);
  });
  document.querySelector('#adminLoginSearch')?.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase().trim();
    document.querySelectorAll('.admin-login-row').forEach((row) => {
      row.hidden = !row.dataset.loginRow.includes(query);
    });
  });
  document.querySelectorAll('[data-login-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      adminActivityFilter = button.dataset.loginFilter;
      render();
    });
  });

  // ─── Email Preferences Listeners ───
  const reportToggle = document.querySelector('#dailyReportToggle');
  if (reportToggle) {
    reportToggle.addEventListener('change', async (e) => {
      userDailyReportEnabled = e.target.checked;
      const feedback = document.querySelector('#emailPrefFeedback');
      if (feedback) feedback.textContent = 'Saving…';
      const res = await apiRequest('/profile/email-preferences', {
        method: 'PUT',
        body: JSON.stringify({ daily_report_enabled: userDailyReportEnabled })
      });
      if (feedback) {
        feedback.textContent = res?._failed ? 'Failed to update' : (userDailyReportEnabled ? 'Daily report enabled' : 'Daily report disabled');
        setTimeout(() => { if (feedback) feedback.textContent = ''; }, 3000);
      }
    });
  }

  const testReportBtn = document.querySelector('#sendTestDailyReportBtn');
  if (testReportBtn) {
    testReportBtn.addEventListener('click', async () => {
      const feedback = document.querySelector('#emailPrefFeedback');
      testReportBtn.disabled = true;
      if (feedback) feedback.textContent = 'Sending report…';
      const res = await apiRequest('/email/send-daily-report-now', { method: 'POST' });
      testReportBtn.disabled = false;
      if (feedback) {
        if (res && res.ok) {
          feedback.textContent = 'Report sent! Check your inbox.';
        } else {
          feedback.textContent = res?.error || 'Failed to send report.';
        }
        setTimeout(() => { if (feedback) feedback.textContent = ''; }, 5000);
      }
    });
  }

  // ─── AI Chat Listeners ───
  if (currentView === 'ai') {
    bindAiChatActions();
  }
}

function bindAiChatActions() {
  const container = document.querySelector('#aiMessagesContainer');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }

  if (!aiChatInitialized && session?.role === 'user') {
    aiChatInitialized = true;
    apiRequest('/ai/sessions').then(async (res) => {
      if (res && Array.isArray(res.sessions) && res.sessions.length > 0) {
        const latest = res.sessions[0];
        aiChatSessionId = latest.id;
        const hist = await apiRequest(`/ai/chat/history?sessionId=${aiChatSessionId}`);
        if (hist && Array.isArray(hist.messages) && hist.messages.length > 0) {
          aiChatMessages = hist.messages.map((m) => ({
            role: m.role,
            content: m.content,
            time: new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }).format(new Date(m.created_at))
          }));
          render();
        }
      }
    }).catch(() => { });
  }

  document.querySelectorAll('[data-ai-prompt]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const prompt = chip.dataset.aiPrompt;
      sendAiMessage(prompt);
    });
  });

  const form = document.querySelector('#aiChatForm');
  const input = document.querySelector('#aiChatInput');
  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text || aiChatLoading) return;
      input.value = '';
      sendAiMessage(text);
    });
  }

  const clearBtn = document.querySelector('#aiClearChatBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      if (aiChatSessionId) {
        await apiRequest('/ai/chat', {
          method: 'DELETE',
          body: JSON.stringify({ sessionId: aiChatSessionId })
        }).catch(() => { });
      }
      aiChatMessages = [];
      aiChatSessionId = null;
      render();
    });
  }
}

async function sendAiMessage(userText) {
  if (!userText || aiChatLoading) return;
  const timeNow = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }).format(new Date());
  aiChatMessages.push({ role: 'user', content: userText, time: timeNow });
  aiChatLoading = true;
  render();

  try {
    const res = await apiRequest('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message: userText, sessionId: aiChatSessionId })
    });
    aiChatLoading = false;
    const replyTime = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }).format(new Date());
    if (res && res.ok) {
      aiChatSessionId = res.sessionId;
      aiChatMessages.push({ role: 'assistant', content: res.reply, time: replyTime });
    } else {
      const errText = res?.error || 'Sorry! I am unable to connect right now. Please verify your internet connection or try again shortly.';
      aiChatMessages.push({ role: 'assistant', content: errText, time: replyTime });
    }
  } catch (err) {
    aiChatLoading = false;
    aiChatMessages.push({ role: 'assistant', content: 'Connection error. Please try again.', time: timeNow });
  }
  render();
}

function showExchange(index) {
  const meal = meals[index];
  if (!dialog || !meal) return;
  const alternatives = datasetFoods
    .filter((candidate) => candidate.name !== meal.name && isFoodCompatible(candidate.name, state.profile.preference))
    .map((candidate) => ({ candidate, distance: Math.abs(candidate.calories - meal.calories) + Math.abs(candidate.protein - meal.protein) * 4 + Math.abs(candidate.carbs - meal.carbs) * 2 + Math.abs(candidate.fat - meal.fat) * 3 }))
    .sort((a, b) => a.distance - b.distance).slice(0, 6).map((item) => item.candidate);
  if (!alternatives.length) { showNotice('No compatible alternatives were found in the uploaded dataset.'); return; }
  dialog.innerHTML = `<form method="dialog" class="dialog-card"><button class="close">×</button><p class="eyebrow">FOOD EXCHANGE</p><h2>Replace ${esc(meal.name)}</h2><p>Select one compatible alternative, then confirm replacement.</p><div class="exchange-list">${alternatives.map((candidate, candidateIndex) => `<button type="button" class="exchange-option" data-replacement-index="${candidateIndex}"><b>${esc(candidate.name)}</b><span>${candidate.calories} kcal · ${candidate.protein}g protein · ${candidate.carbs}g carbs · ${candidate.fat}g fat · ${candidate.portion} g · ${candidate.dietaryType}</span></button>`).join('')}</div><button type="button" class="primary" data-replace disabled>Replace food</button></form>`;
  dialog.showModal();
  let selectedIndex = -1;
  dialog.querySelectorAll('[data-replacement-index]').forEach((button) => button.addEventListener('click', () => {
    selectedIndex = Number(button.dataset.replacementIndex);
    dialog.querySelectorAll('[data-replacement-index]').forEach((option) => option.classList.toggle('selected', option === button));
    dialog.querySelector('[data-replace]').disabled = false;
  }));
  dialog.querySelector('[data-replace]').addEventListener('click', () => {
    const replacement = alternatives[selectedIndex];
    if (!replacement) return;
    meals[index] = { ...replacement, type: meal.type, time: meal.time };
    state.mealPlan = meals;
    state.mealPlanPreference = state.profile.preference;
    const history = read(STORAGE.exchangeHistory, []);
    history.push({ userId: session.userId, from: meal.name, to: replacement.name, at: new Date().toISOString() });
    write(STORAGE.exchangeHistory, history);
    save();
    apiRequest('/plans', { method: 'POST', body: JSON.stringify({
      calorieTarget: health().calories,
      meals,
      totalCalories: meals.reduce((sum, item) => sum + Number(item.calories || 0), 0),
      totalProtein: meals.reduce((sum, item) => sum + Number(item.protein || 0), 0),
      totalCarbohydrates: meals.reduce((sum, item) => sum + Number(item.carbs || 0), 0),
      totalFat: meals.reduce((sum, item) => sum + Number(item.fat || 0), 0)
    }) });
    dialog.close();
    render();
    showNotice(`${replacement.name} replaced ${meal.name}. Daily nutrition totals were recalculated.`);
  });
}

let activitySyncQueue = Promise.resolve();

async function adjustActivity(kind, amount) {
  const tKey = todayKey();
  const act = activityTotals();
  const today = todayActivity()[kind];
  const record = today.length ? today[0] : null;
  const localId = 'local-' + Date.now();
  let createdItem = null;

  if (kind === 'water') {
    const currentVal = act.water;
    if (amount > 0 && currentVal >= 3007) return;
    if (amount < 0 && currentVal <= 0) return;
    const newVal = Math.max(0, Math.min(3007, currentVal + amount));
    if (newVal === currentVal) return;
    state.water = newVal;
    const goal = 3007;
    if (record) {
      record.consumed_ml = newVal;
      record.goal_ml = goal;
    } else {
      createdItem = { id: localId, record_date: tKey, consumed_ml: newVal, goal_ml: goal, kind: 'water' };
      if (!activityRecords.water) activityRecords.water = [];
      activityRecords.water.unshift(createdItem);
    }
  } else if (kind === 'exercise') {
    const currentVal = act.exercise;
    if (amount > 0 && currentVal >= 30) return;
    if (amount < 0 && currentVal <= 0) return;
    const newVal = Math.max(0, Math.min(30, currentVal + amount));
    if (newVal === currentVal) return;
    state.exercise = newVal;
    const goal = 30;
    if (record) {
      record.duration_minutes = newVal;
      record.goal_minutes = goal;
    } else {
      createdItem = { id: localId, record_date: tKey, activity: 'General movement', duration_minutes: newVal, goal_minutes: goal, notes: '', kind: 'exercise' };
      if (!activityRecords.exercise) activityRecords.exercise = [];
      activityRecords.exercise.unshift(createdItem);
    }
  } else if (kind === 'sleep') {
    const currentVal = act.sleep;
    if (amount > 0 && currentVal >= 480) return;
    if (amount < 0 && currentVal <= 0) return;
    const newVal = Math.max(0, Math.min(480, currentVal + amount));
    if (newVal === currentVal) return;
    state.sleep = Math.round((newVal / 60) * 10) / 10;
    const goal = 480;
    if (record) {
      record.minutes = newVal;
      record.goal_minutes = goal;
    } else {
      createdItem = { id: localId, record_date: tKey, minutes: newVal, goal_minutes: goal, kind: 'sleep' };
      if (!activityRecords.sleep) activityRecords.sleep = [];
      activityRecords.sleep.unshift(createdItem);
    }
  }

  state.activityRecords = activityRecords;
  save();
  render();

  if (session && session.userId && session.userId !== 'demo-user') {
    const target = record || createdItem;
    const payload = kind === 'water'
      ? { date: tKey, consumedMl: target ? Number(target.consumed_ml) : Number(state.water), goalMl: 3007 }
      : kind === 'exercise'
        ? { date: tKey, durationMinutes: target ? Number(target.duration_minutes) : Number(state.exercise), activity: target?.activity || 'General movement', goalMinutes: 30, notes: target?.notes || '' }
        : { date: tKey, minutes: target ? Number(target.minutes) : Math.round(Number(state.sleep) * 60), goalMinutes: 480 };

    activitySyncQueue = activitySyncQueue.catch(() => {}).then(async () => {
      try {
        if (target && target.id && !String(target.id).startsWith('local-')) {
          await apiRequest(`/activity/${kind}/${target.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
        } else {
          const created = await apiRequest(`/activity/${kind}`, { method: 'POST', body: JSON.stringify(payload) });
          if (created?.id && target) {
            target.id = created.id;
            save();
          }
        }
      } catch (err) {
        console.warn('Backend activity sync:', err.message);
      }
    });
  }
}

function handleAction(action) {
  if (action === 'water' || action === 'water-minus') { adjustActivity('water', action === 'water' ? 250 : -100); return; }
  if (action === 'exercise' || action === 'exercise-minus') { adjustActivity('exercise', action === 'exercise' ? 10 : -5); return; }
  if (action === 'sleep' || action === 'sleep-minus') { adjustActivity('sleep', action === 'sleep' ? 60 : -30); return; }
  if (action === 'edit') showProfile();
  if (action === 'logout') signOut();
  if (action === 'notifications') showRemindersPopup();
  if (action === 'next-plan') generateNextPlan();
  if (action === 'view-next-day') openNextDayMealPlan(false);
  if (action === 'regenerate-next-day') openNextDayMealPlan(true);
  if (action === 'back-weekly-plan') { planViewMode = 'weekly'; render(); }
  if (action === 'plan-history') showPlanHistory();
  if (action === 'add-food') showAdminInput('Add food item', 'food');
  if (action === 'add-plan') showAdminInput('Add diet plan', 'plan');
  if (action === 'add-user') showAdminInput('Add member name', 'user');
  if (action === 'add-recipe') showAdminInput('Add recipe title', 'recipe');
}

async function openNextDayMealPlan(regenerate = false) {
  if (nextDayPlanLoading) return;
  planViewMode = 'next-day';
  if (!session || !session.userId || session.userId === 'demo-user' || session.role !== 'user') {
    generateNextPlan();
    return;
  }
  nextDayPlanLoading = true;
  setAppLoading(true, regenerate ? 'Regenerating next day meal plan…' : 'Loading next day meal plan…');
  render();
  try {
    const res = regenerate
      ? await apiRequest('/plans/next-day', { method: 'POST', body: JSON.stringify({ regenerate: true }) })
      : await apiRequest('/plans/next-day');
    if (res && res.plan) {
      nextDayPlanData = res;
      if (res.regenerated) planHistoryDbData = null;
    } else {
      showNotice(res?.error || 'Unable to load next day meal plan.');
    }
  } finally {
    nextDayPlanLoading = false;
    setAppLoading(false);
    render();
  }
}

function generateNextPlan() {
  if (session && session.userId && session.userId !== 'demo-user' && session.role === 'user') {
    openNextDayMealPlan(true);
    return;
  }
  if (datasetFoods.length < 5) return showNotice('The nutrition dataset is not ready yet.');
  const profile = state.profile || defaultState.profile;
  const targetCalories = health().calories;

  state.planHistory = [...(state.planHistory || []), { createdAt: new Date().toISOString(), meals: state.mealPlan || meals }];

  const currentNames = new Set((state.mealPlan || meals || []).map((m) => m.name));
  const seenNames = new Set();
  const pool = [];
  for (const item of datasetFoods) {
    if (item && item.name && !seenNames.has(item.name)) {
      seenNames.add(item.name);
      if (!currentNames.has(item.name)) {
        pool.push(item);
      }
    }
  }

  const candidatePool = pool.length >= 5 ? pool : Array.from(seenNames).map((name) => datasetFoods.find((f) => f.name === name));
  const shuffled = candidatePool.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  meals = shuffled.slice(0, 5).map((food, index) => createPlanMeal(food, index, profile, targetCalories));
  let clientDayTotal = meals.reduce((sum, m) => sum + Number(m.calories || 0), 0);
  if (clientDayTotal > 0 && Math.abs(targetCalories - clientDayTotal) > 35) {
    const ratio = targetCalories / clientDayTotal;
    meals = meals.map((m, idx) => createPlanMeal(shuffled[idx], idx, profile, targetCalories, Math.round(m.portion * ratio)));
  }
  state.mealPlan = meals;
  state.mealPlanPreference = profile.preference;
  save();
  apiRequest('/plans', {
    method: 'POST',
    body: JSON.stringify({
      calorieTarget: targetCalories,
      meals,
      totalCalories: meals.reduce((sum, meal) => sum + Number(meal.calories || 0), 0),
      totalProtein: meals.reduce((sum, meal) => sum + Number(meal.protein || 0), 0),
      totalCarbohydrates: meals.reduce((sum, meal) => sum + Number(meal.carbs || 0), 0),
      totalFat: meals.reduce((sum, meal) => sum + Number(meal.fat || 0), 0)
    })
  });
  render();
  showNotice('Next day plan generated from compatible dataset foods.');
}

async function showPlanHistory() {
  if (!dialog) return;
  if (session && session.userId && session.userId !== 'demo-user' && session.role === 'user') {
    const dbPlans = await apiRequest('/plans/history');
    if (Array.isArray(dbPlans)) {
      planHistoryDbData = dbPlans;
      dialog.innerHTML = `<form method="dialog" class="dialog-card"><button class="close">×</button><p class="eyebrow">DIET PLAN HISTORY</p><h2>Saved plan versions</h2>${dbPlans.length ? dbPlans.map((plan) => {
        const dt = new Date(plan.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
        const dayMeals = loadPlanDayMeals(plan, 1) || [];
        return `<div style="margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #edf1ed;"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;"><b>${esc(plan.plan_name || 'Diet Plan')} (${Number(plan.number_of_days || 1)} day${Number(plan.number_of_days || 1) > 1 ? 's' : ''})</b><small style="color:#71817c;">${esc(dt)}</small></div><small style="display:block;color:#176b52;margin-top:3px;">${esc(plan.description || `${plan.weight_goal || ''} · ${plan.food_preference || ''} · ${plan.calorie_target || 0} kcal`)}</small><p style="margin:4px 0 0;color:#71817c;font-size:12px;line-height:1.5;">Day 1: ${dayMeals.map((m) => esc(m.name)).join(' · ')}</p></div>`;
      }).join('') : '<p>No previous plans have been generated.</p>'}<button class="primary">Done</button></form>`;
      if (!dialog.open) dialog.showModal();
      return;
    }
  }
  const history = state.planHistory || [];
  const items = history.map((entry, index) => ({ entry, index })).reverse();
  dialog.innerHTML = `<form method="dialog" class="dialog-card"><button class="close">×</button><p class="eyebrow">DIET PLAN HISTORY</p><h2>Saved plans</h2>${items.length ? items.map(({ entry, index }) => `<div style="margin-bottom:14px;"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;"><b>${new Date(entry.createdAt).toLocaleString()}</b><button type="button" data-delete-plan="${index}" style="padding:3px 8px;border:1px solid #dce7df;border-radius:6px;color:#a33e3e;background:transparent;font-size:11px;cursor:pointer;flex-shrink:0;">Delete</button></div><p style="margin:4px 0 0;color:#71817c;font-size:13px;line-height:1.5;">${entry.meals.map((meal) => esc(meal.name)).join(' · ')}</p></div>`).join('') : '<p>No previous plans have been generated.</p>'}<button class="primary">Done</button></form>`;
  dialog.querySelectorAll('[data-delete-plan]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = Number(btn.dataset.deletePlan);
      if (!Number.isNaN(idx) && idx >= 0 && idx < state.planHistory.length) {
        state.planHistory.splice(idx, 1);
        save();
        render();
        showPlanHistory();
      }
    });
  });
  if (!dialog.open) dialog.showModal();
}

function signOut() {
  stopAdminPolling();
  apiRequest('/auth/logout', { method: 'POST' });
  session = null;
  appLocked = false;
  appLockError = '';
  const sync = document.querySelector('.sync');
  if (sync) sync.textContent = '● Offline ready';
  activityLoaded = false;
  mealCompletionsLoadedDates = {};
  groceryLoaded = false;
  groceryLoading = false;
  groceryMeta = { daysCovered: 0, planName: '', manuallyEdited: false, planChanged: false, lastGeneratedAt: null };
  planViewMode = 'weekly';
  nextDayPlanData = null;
  planHistoryDbData = null;
  aiChatMessages = [];
  aiChatSessionId = null;
  aiChatLoading = false;
  aiChatInitialized = false;
  emailPrefsLoaded = false;
  writeSession(null);
  authMode = 'welcome';
  render();
}

function showNotice(message = 'You are all caught up.') {
  if (!dialog) return;
  dialog.innerHTML = `<form method="dialog" class="dialog-card"><button class="close">×</button><p class="eyebrow">DAYLIGHT UPDATE</p><h2>Stay in rhythm.</h2><p>${esc(message)}</p><button class="primary">Done</button></form>`;
  dialog.showModal();
}

function formatReminderTime(timeStr) {
  if (!timeStr) return '';
  const parts = timeStr.split(':').map(Number);
  const h = parts[0] || 0;
  const m = parts[1] || 0;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function formatScheduledDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(d);
}

function reminderIcon(type) {
  if (type === 'Hydration') return '💧';
  if (type === 'Exercise') return '🏃';
  if (type === 'Sleep') return '🌙';
  if (type === 'Diet') return '🥗';
  return '🌿';
}

function defaultNextReminderTime() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    hourCycle: 'h23'
  }).formatToParts(new Date(Date.now() + 30 * 60 * 1000));
  const rawHour = Number(parts.find((p) => p.type === 'hour')?.value || 10);
  const rawMin = Number(parts.find((p) => p.type === 'minute')?.value || 0);
  const h = String((Number.isFinite(rawHour) ? rawHour : 10) % 24).padStart(2, '0');
  const m = String((Number.isFinite(rawMin) ? rawMin : 0) % 60).padStart(2, '0');
  return `${h}:${m}`;
}

async function showRemindersPopup(initialFeedback = null) {
  if (!dialog) return;

  if (!session || session.userId === 'demo-user') {
    dialog.innerHTML = `<form method="dialog" class="dialog-card"><button class="close">×</button><p class="eyebrow">DAYLIGHT UPDATE</p><h2>Stay in rhythm.</h2><p>Sign in to your account to configure personalized email reminders for hydration, exercise, sleep, and wellness.</p><button class="primary" data-auth="login">Sign In</button></form>`;
    dialog.querySelector('[data-auth="login"]')?.addEventListener('click', () => {
      dialog.close();
      authMode = 'login';
      session = null;
      writeSession(null);
      render();
    });
    if (!dialog.open) dialog.showModal();
    return;
  }

  dialog.innerHTML = `<form method="dialog" class="dialog-card"><button class="close">×</button><p class="eyebrow">DAYLIGHT UPDATE</p><h2>Stay in rhythm.</h2><p>Loading your reminder schedule…</p><button class="primary">Done</button></form>`;
  if (!dialog.open) dialog.showModal();

  const data = await apiRequest('/reminders');
  if (!data || data._failed) {
    dialog.innerHTML = `<form method="dialog" class="dialog-card"><button class="close">×</button><p class="eyebrow">DAYLIGHT UPDATE</p><h2>Stay in rhythm.</h2><p>Could not connect to the reminder service. Please check your connection.</p><button class="primary">Done</button></form>`;
    return;
  }

  renderRemindersDialog(data, initialFeedback);
}

function renderRemindersDialog(data, initialFeedback = null) {
  if (!dialog) return;

  const remindersList = Array.isArray(data.reminders) ? data.reminders : [];
  let editingReminderId = null;
  let isSavingReminder = false;
  let isSendingTest = false;

  const next = data.nextReminder;
  let statusBanner = '';
  if (next && next.enabled) {
    statusBanner = `
      <div style="background:#eef6f0; border:1px solid #dce7df; border-radius:12px; padding:12px 14px; margin:10px 0 14px;">
        <p style="margin:0; font-size:13.5px; color:#176b52; font-weight:600;">
          Next reminder: <strong>${esc(next.reminder_type)}</strong> at <strong>${formatReminderTime(next.reminder_time)} IST</strong>
        </p>
        <small style="display:block; margin-top:4px; color:#548465; font-size:11.5px;">
          Scheduled for ${formatScheduledDate(next.next_scheduled_at)} · Recalculates automatically after delivery.
        </small>
      </div>
    `;
  } else {
    statusBanner = `
      <div style="background:#fffdf7; border:1px solid #dce7df; border-radius:12px; padding:12px 14px; margin:10px 0 14px;">
        <p style="margin:0; font-size:13px; color:#71817c;">
          You are all caught up. No active reminders are currently scheduled.
        </p>
        <small style="display:block; margin-top:4px; color:#95a59e; font-size:11px;">
          Choose a reminder schedule below to receive notifications at your preferred times.
        </small>
      </div>
    `;
  }

  const emailInfo = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; font-size:11.5px; color:#548465;">
      <span>📧 Recipient: <strong>${esc(data.userEmail || '')}</strong></span>
      <span id="smtpStatusBadge">${data.smtpConfigured ? '<b style="color:#176b52;">● SMTP Active</b>' : '<b style="color:#a33e3e;">● SMTP Not Configured</b>'}</span>
    </div>
  `;

  const rows = remindersList.map((r) => `
    <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; padding:9px 12px; border:1px solid #dce7df; border-radius:10px; background:#fffdf7; margin-bottom:6px;">
      <div style="display:flex; align-items:center; gap:9px; min-width:0;">
        <span style="font-size:18px;">${reminderIcon(r.reminder_type)}</span>
        <div style="min-width:0;">
          <div style="display:flex; align-items:center; gap:6px;">
            <strong style="font-size:12.5px; color:#21342f;">${esc(r.reminder_type)}</strong>
            <span style="font-size:11.5px; color:#176b52; font-weight:700;">${formatReminderTime(r.reminder_time)} IST</span>
          </div>
          <small style="display:block; color:#71817c; font-size:10.5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
            ${r.enabled ? `Next: ${formatScheduledDate(r.next_scheduled_at)}` : 'Paused'}${r.last_sent_at ? ` · Last: ${formatScheduledDate(r.last_sent_at)}` : ''}${r.delivery_status === 'failed' ? ' · Last attempt failed' : ''}
          </small>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:6px; flex-shrink:0;">
        <button type="button" data-edit-reminder="${r.id}" style="padding:4px 8px; border:1px solid #dce7df; border-radius:6px; color:#176b52; background:transparent; font-size:10px; font-weight:700; cursor:pointer;">
          Edit
        </button>
        <button type="button" data-toggle-reminder="${r.id}" data-enabled="${r.enabled}" style="padding:4px 8px; border:1px solid ${r.enabled ? '#9acb99' : '#dce7df'}; border-radius:6px; color:${r.enabled ? '#2c754d' : '#888'}; background:${r.enabled ? '#e5f1df' : 'transparent'}; font-size:10px; font-weight:700; cursor:pointer;">
          ${r.enabled ? 'Enabled' : 'Paused'}
        </button>
        <button type="button" data-delete-reminder="${r.id}" style="padding:4px 8px; border:1px solid #dce7df; border-radius:6px; color:#a33e3e; background:transparent; font-size:10px; cursor:pointer;">
          Delete
        </button>
      </div>
    </div>
  `).join('');

  const listHtml = rows || '<p style="color:#71817c; font-size:12px; margin:0 0 10px; font-style:italic;">No reminder schedules created yet. Add one below.</p>';
  const initialMsgText = initialFeedback?.text ? esc(initialFeedback.text) : '';
  const initialMsgColor = initialFeedback?.error ? '#a33e3e' : '#176b52';

  dialog.innerHTML = `
    <form method="dialog" class="dialog-card" id="remindersForm">
      <button class="close" type="button" data-dialog-close>×</button>
      <p class="eyebrow">DAYLIGHT UPDATE</p>
      <h2>Stay in rhythm.</h2>
      ${statusBanner}
      ${emailInfo}
      <h4 style="margin:14px 0 6px; font-size:12px; font-weight:700; color:#176b52;">Your Reminder Schedules</h4>
      <div style="margin-bottom:12px;">${listHtml}</div>

      <div style="border:1px solid #dce7df; border-radius:12px; padding:12px; background:#fbfdfb; margin-bottom:14px;">
        <h4 id="reminderFormHeading" style="margin:0 0 8px; font-size:11.5px; font-weight:700; color:#3b574b;">+ Schedule New Reminder</h4>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:10px;">
          <label style="font-size:11px; color:#6d7f77; font-weight:700;">Reminder Type
            <select id="newReminderType" style="width:100%; padding:7px; border:1px solid #dce7df; border-radius:8px; font-size:11.5px; margin-top:4px; background:#fff;">
              <option value="Hydration">Hydration reminder</option>
              <option value="Exercise">Exercise reminder</option>
              <option value="Sleep">Sleep reminder</option>
              <option value="Diet">Diet reminder</option>
              <option value="General wellness">General wellness</option>
            </select>
          </label>
          <label style="font-size:11px; color:#6d7f77; font-weight:700;">Preferred Time (IST)
            <input type="time" id="newReminderTime" value="${defaultNextReminderTime()}" required style="width:100%; padding:6px 8px; border:1px solid #dce7df; border-radius:8px; font-size:11.5px; margin-top:4px; background:#fff;">
          </label>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:6px;">
            <button type="button" id="addReminderBtn" style="padding:7px 14px; border:0; border-radius:8px; color:#fff; background:#176b52; font-size:11px; font-weight:700; cursor:pointer;">
              Save Schedule
            </button>
            <button type="button" id="cancelEditReminderBtn" hidden style="padding:7px 10px; border:1px solid #dce7df; border-radius:8px; color:#71817c; background:transparent; font-size:11px; font-weight:700; cursor:pointer;">
              Cancel
            </button>
          </div>
          <button type="button" id="sendTestEmailBtn" style="padding:7px 12px; border:1px solid #9acb99; border-radius:8px; color:#2c754d; background:transparent; font-size:11px; font-weight:700; cursor:pointer;">
            Send Test Email
          </button>
        </div>
        <p id="reminderActionMsg" style="margin:6px 0 0; font-size:11px; min-height:14px; color:${initialMsgColor};" role="status">${initialMsgText}</p>
      </div>

      <button class="primary" type="button" data-dialog-close>Done</button>
    </form>
  `;

  const resetFormMode = () => {
    editingReminderId = null;
    const heading = dialog.querySelector('#reminderFormHeading');
    const addBtn = dialog.querySelector('#addReminderBtn');
    const cancelBtn = dialog.querySelector('#cancelEditReminderBtn');
    const timeInput = dialog.querySelector('#newReminderTime');
    if (heading) heading.textContent = '+ Schedule New Reminder';
    if (addBtn) addBtn.textContent = 'Save Schedule';
    if (cancelBtn) cancelBtn.hidden = true;
    if (timeInput) timeInput.value = defaultNextReminderTime();
  };

  dialog.querySelectorAll('[data-dialog-close]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      dialog.close();
    });
  });

  dialog.querySelectorAll('[data-edit-reminder]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.editReminder;
      const target = remindersList.find((item) => String(item.id) === String(id));
      if (!target) return;
      editingReminderId = target.id;
      const typeSelect = dialog.querySelector('#newReminderType');
      const timeInput = dialog.querySelector('#newReminderTime');
      const heading = dialog.querySelector('#reminderFormHeading');
      const addBtn = dialog.querySelector('#addReminderBtn');
      const cancelBtn = dialog.querySelector('#cancelEditReminderBtn');
      const msg = dialog.querySelector('#reminderActionMsg');
      if (typeSelect) typeSelect.value = target.reminder_type;
      if (timeInput) timeInput.value = String(target.reminder_time || '').slice(0, 5);
      if (heading) heading.textContent = 'Edit Reminder Schedule';
      if (addBtn) addBtn.textContent = 'Update Schedule';
      if (cancelBtn) cancelBtn.hidden = false;
      if (msg) {
        msg.textContent = `Editing ${target.reminder_type} reminder (${formatReminderTime(target.reminder_time)} IST).`;
        msg.style.color = '#176b52';
      }
    });
  });

  dialog.querySelector('#cancelEditReminderBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    resetFormMode();
    const msg = dialog.querySelector('#reminderActionMsg');
    if (msg) msg.textContent = '';
  });

  dialog.querySelectorAll('[data-toggle-reminder]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const id = btn.dataset.toggleReminder;
      const current = btn.dataset.enabled === 'true';
      btn.disabled = true;
      const res = await apiRequest(`/reminders/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ enabled: !current })
      });
      if (res?.reminder) {
        showRemindersPopup({ text: `${res.reminder.reminder_type} reminder ${res.reminder.enabled ? 'enabled' : 'paused'}.` });
      } else {
        btn.disabled = false;
        const msg = dialog.querySelector('#reminderActionMsg');
        if (msg) { msg.textContent = res?.error || 'Could not update reminder status.'; msg.style.color = '#a33e3e'; }
      }
    });
  });

  dialog.querySelectorAll('[data-delete-reminder]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const id = btn.dataset.deleteReminder;
      btn.disabled = true;
      const res = await apiRequest(`/reminders/${id}`, { method: 'DELETE' });
      if (res?.ok) {
        showRemindersPopup({ text: 'Reminder schedule deleted.' });
      } else {
        btn.disabled = false;
        const msg = dialog.querySelector('#reminderActionMsg');
        if (msg) { msg.textContent = res?.error || 'Could not delete reminder.'; msg.style.color = '#a33e3e'; }
      }
    });
  });

  dialog.querySelector('#addReminderBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (isSavingReminder) return;
    const typeSelect = dialog.querySelector('#newReminderType');
    const timeInput = dialog.querySelector('#newReminderTime');
    const msg = dialog.querySelector('#reminderActionMsg');
    const reminderType = typeSelect?.value || 'Hydration';
    const reminderTime = String(timeInput?.value || '').trim();

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(reminderTime)) {
      if (msg) { msg.textContent = 'Please select a valid reminder time (HH:MM).'; msg.style.color = '#a33e3e'; }
      return;
    }

    isSavingReminder = true;
    const addBtn = dialog.querySelector('#addReminderBtn');
    const isEdit = Boolean(editingReminderId);
    if (addBtn) addBtn.disabled = true;
    if (msg) { msg.textContent = isEdit ? 'Updating reminder schedule…' : 'Saving reminder schedule…'; msg.style.color = '#176b52'; }

    try {
      const res = await apiRequest(isEdit ? `/reminders/${editingReminderId}` : '/reminders', {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify({ reminderType, reminderTime })
      });

      if (res?.reminder) {
        showRemindersPopup({
          text: isEdit
            ? `✓ Updated ${reminderType} reminder to ${formatReminderTime(reminderTime)} IST.`
            : `✓ Saved ${reminderType} reminder for ${formatReminderTime(reminderTime)} IST.`
        });
      } else {
        if (addBtn) addBtn.disabled = false;
        if (msg) { msg.textContent = res?.error || 'Failed to save reminder. Please try again.'; msg.style.color = '#a33e3e'; }
      }
    } finally {
      isSavingReminder = false;
    }
  });

  dialog.querySelector('#sendTestEmailBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (isSendingTest) return;
    const typeSelect = dialog.querySelector('#newReminderType');
    const reminderType = typeSelect?.value || 'Hydration';
    const msg = dialog.querySelector('#reminderActionMsg');
    const testBtn = dialog.querySelector('#sendTestEmailBtn');
    const origLabel = testBtn ? testBtn.textContent : 'Send Test Email';
    isSendingTest = true;
    if (testBtn) {
      testBtn.disabled = true;
      testBtn.textContent = 'Sending…';
    }
    if (msg) { msg.textContent = 'Sending test reminder email…'; msg.style.color = '#176b52'; }

    try {
      const res = await apiRequest('/reminders/send-test', {
        method: 'POST',
        body: JSON.stringify({ reminderType })
      });

      if (res?.ok) {
        const smtpBadge = dialog.querySelector('#smtpStatusBadge');
        if (smtpBadge) smtpBadge.innerHTML = '<b style="color:#176b52;">● SMTP Active</b>';
        if (msg) {
          msg.textContent = `✓ ${reminderType} test email sent successfully to ${res.recipientEmail}! Check your inbox.`;
          msg.style.color = '#176b52';
        }
      } else {
        if (msg) {
          msg.textContent = `❌ ${res?.error || 'Email delivery failed. Please check SMTP configuration in .env.'}`;
          msg.style.color = '#a33e3e';
        }
      }
    } finally {
      isSendingTest = false;
      if (testBtn) {
        testBtn.disabled = false;
        testBtn.textContent = origLabel;
      }
    }
  });
}

function renderMealDialog(meal, resolvedRecipe = null) {
  if (!dialog || !meal) return;
  const recipe = resolvedRecipe || findRecipe(meal.name) || meal.recipeDetails || null;
  const portion = parseFloat(meal.portion) || 100;
  const baseGrams = Number(recipe?.base_serving_grams ?? recipe?.baseServingGrams) || 100;
  const scale = portion / (baseGrams || 100);

  let servingSizeText = recipe?.serving_size || recipe?.servingSize || '1 portion';
  if (!servingSizeText.includes('g') && baseGrams) {
    servingSizeText += ` (${baseGrams} g)`;
  }

  // Section 4: Ingredients
  let ingredientsHtml = '';
  const rawIngs = (recipe && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0)
    ? recipe.ingredients
    : (Array.isArray(meal.ingredients) && meal.ingredients.length > 0 && meal.ingredients[0] !== meal.name && normalizeDishKey(meal.ingredients[0]) !== normalizeDishKey(meal.name) ? meal.ingredients : null);

  if (rawIngs && rawIngs.length > 0) {
    const listItems = rawIngs.map((ing) => {
      let line = '';
      if (typeof ing === 'string') {
        line = esc(ing);
      } else {
        const name = esc(ing.name || '');
        if (Math.abs(scale - 1) < 0.05) {
          line = `${name} – ${esc(ing.quantity || '')}`;
        } else if (ing.baseGrams && (ing.unit === 'g' || ing.unit === 'ml')) {
          const scaledVal = Math.round(ing.baseGrams * scale);
          line = `${name} – ${scaledVal} ${ing.unit}`;
        } else if (ing.quantity && (ing.quantity.includes('as required') || ing.quantity.includes('to taste') || ing.quantity.includes('optional') || ing.quantity.includes('pinch'))) {
          line = `${name} – ${esc(ing.quantity)}`;
        } else if (ing.baseGrams) {
          const scaledGrams = Math.round(ing.baseGrams * scale);
          const rawNum = parseFloat(ing.quantity);
          if (!Number.isNaN(rawNum) && ing.unit) {
            const scaledCount = (rawNum * scale).toFixed(1).replace(/\.0$/, '');
            line = `${name} – ${scaledCount} ${esc(ing.unit)} (${scaledGrams} g)`;
          } else {
            line = `${name} – ${scaledGrams} g (${esc(ing.quantity || '')})`;
          }
        } else {
          line = `${name} – ${esc(ing.quantity || '')}`;
        }
      }
      return `<li>${line}</li>`;
    }).join('');

    ingredientsHtml = `
      <div class="recipe-serving-meta">
        <p><strong>Serving size:</strong> ${esc(servingSizeText)}</p>
        <p><strong>Quantity required for selected serving:</strong> ${portion} g</p>
      </div>
      <ul class="recipe-ingredient-list">${listItems}</ul>
    `;
  } else {
    ingredientsHtml = `
      <div class="recipe-serving-meta">
        <p><strong>Serving size:</strong> ${esc(servingSizeText)}</p>
        <p><strong>Quantity required for selected serving:</strong> ${portion} g</p>
      </div>
      <p>Ingredients are not available yet.</p>
    `;
  }

  // Section 5: Recipe
  let recipeHtml = '';
  const instructions = (recipe && Array.isArray(recipe.instructions) && recipe.instructions.length > 0)
    ? recipe.instructions
    : (Array.isArray(meal.instructions) && meal.instructions.length > 0 ? meal.instructions : null);

  if (instructions && instructions.length > 0) {
    const prepMins = Number(recipe?.prep_time_minutes ?? recipe?.prepTimeMinutes ?? 10);
    const cookMins = Number(recipe?.cook_time_minutes ?? recipe?.cookTimeMinutes ?? 0);
    const totalMins = Number(recipe?.total_time_minutes ?? recipe?.totalTimeMinutes ?? (prepMins + cookMins));
    const prep = `${prepMins} minutes`;
    const cook = recipe?.cooking_time_desc || recipe?.cookingTimeDesc || (cookMins > 0 ? `${cookMins} minutes` : 'No cooking required');
    const totalTime = `${totalMins} minutes`;
    const method = recipe?.cooking_method || recipe?.cookingMethod || 'Assembly';
    const diff = recipe?.difficulty || 'Easy';
    const serving = recipe?.serving_size || recipe?.servingSize || '1 portion';
    const tips = String(recipe?.cooking_tips ?? recipe?.cookingTips ?? '').trim();

    recipeHtml = `
      <div class="recipe-cooking-info">
        <p><strong>Preparation time:</strong> ${esc(prep)}</p>
        <p><strong>Cooking time:</strong> ${esc(cook)}</p>
        <p><strong>Total time:</strong> ${esc(totalTime)}</p>
        <p><strong>Cooking method:</strong> ${esc(method)}</p>
        <p><strong>Serving size:</strong> ${esc(serving)}</p>
        <p><strong>Difficulty:</strong> ${esc(diff)}</p>
      </div>
      ${tips ? `<div class="recipe-tips-box"><strong>Cooking tips:</strong> ${esc(tips)}</div>` : ''}
      <h4>Preparation</h4>
      <ol class="recipe-step-list">
        ${instructions.map((step) => `<li>${esc(step)}</li>`).join('')}
      </ol>
    `;
  } else if (meal.recipe && !meal.recipe.includes('calculated from the uploaded dataset') && meal.recipe !== 'Recipe instructions are not available yet.' && meal.recipe !== 'Freshly prepared nutrient-dense meal.') {
    recipeHtml = `<p>${esc(meal.recipe)}</p>`;
  } else {
    recipeHtml = `<p>Recipe instructions are not available yet.</p>`;
  }

  // Section 6: Smart Substitutions
  const rawSwaps = (recipe?.swaps && recipe.swaps.length) ? recipe.swaps : (meal.swaps && meal.swaps.length ? meal.swaps : ['Sprouted moong salad', 'Roasted makhana', 'Cucumber raita']);
  const swaps = Array.isArray(rawSwaps) ? rawSwaps : [];

  dialog.innerHTML = `<form method="dialog" class="dialog-card">
    <button type="button" class="close" data-dialog-close>×</button>
    <p class="eyebrow">${esc(String(meal.type || 'MEAL').toUpperCase())}</p>
    <h2>${esc(recipe?.dish_title || recipe?.dishTitle || meal.name)}</h2>
    <b class="green-text">${meal.calories} kcal · ${meal.protein}g protein · ${meal.carbs}g carbs · ${meal.fat || 0}g fat</b>
    <h3>Ingredients</h3>
    ${ingredientsHtml}
    <h3>Recipe</h3>
    ${recipeHtml}
    <h3>Smart substitutions</h3>
    <div class="chips">${swaps.map((swap) => `<span>${esc(swap)}</span>`).join('')}</div>
  </form>`;

  dialog.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog.close());
  if (!dialog.open) dialog.showModal();
}

async function showMeal(meal) {
  if (!dialog || !meal) return;
  const cachedRecipe = findRecipe(meal.name) || meal.recipeDetails || null;
  renderMealDialog(meal, cachedRecipe);
  if (!cachedRecipe) {
    try {
      await loadRecipeCatalog();
      let fresh = findRecipe(meal.name);
      if (!fresh) {
        const fetched = await apiRequest(`/recipes/${encodeURIComponent(meal.name)}`);
        if (fetched && !fetched._failed && fetched.food_name) {
          fresh = fetched;
          recipeCatalog.push(fetched);
        }
      }
      if (fresh && dialog.open) {
        renderMealDialog(meal, fresh);
      }
    } catch {}
  }
}

function showProfile() {
  if (!dialog) return;
  const p = state.profile || defaultState.profile;
  const beforeProfile = {
    name: String(p.name || '').trim(),
    age: Number(p.age || 24),
    gender: String(p.gender || 'Male'),
    height: Number(p.height || 174),
    weight: Number(p.weight || 68),
    targetWeight: Number(p.targetWeight || 65),
    activity: String(p.activity || 'Moderate'),
    preference: String(p.preference || 'Vegetarian'),
    goal: String(p.goal || 'Maintain'),
    allergies: String(p.allergies || 'None').trim(),
    healthConditions: String(p.healthConditions || '').trim()
  };

  dialog.innerHTML = `<form method="dialog" class="dialog-card profile-form"><button class="close">×</button><p class="eyebrow">HEALTH PROFILE</p><h2>Keep your plan personal</h2><label>Name<input name="name" value="${esc(p.name)}" required></label><label>Age<input name="age" type="number" min="13" max="120" value="${p.age || 24}" required></label><label>Gender<select name="gender"><option ${p.gender === 'Male' ? 'selected' : ''}>Male</option><option ${p.gender === 'Female' ? 'selected' : ''}>Female</option></select></label><label>Height (cm)<input name="height" type="number" min="100" max="250" value="${p.height || 174}" required></label><label>Current weight (kg)<input name="weight" type="number" min="30" max="300" step=".1" value="${p.weight || 68}" required></label><label>Target weight (kg)<input name="targetWeight" type="number" min="30" max="300" step=".1" value="${p.targetWeight || 65}" required></label><label>Activity<select name="activity"><option ${p.activity === 'Sedentary' ? 'selected' : ''}>Sedentary</option><option ${p.activity === 'Light' ? 'selected' : ''}>Light</option><option ${p.activity === 'Moderate' || !p.activity ? 'selected' : ''}>Moderate</option><option ${p.activity === 'Active' ? 'selected' : ''}>Active</option></select></label><label>Food preference<select name="preference"><option ${p.preference === 'Vegetarian' ? 'selected' : ''}>Vegetarian</option><option ${p.preference === 'Vegan' ? 'selected' : ''}>Vegan</option><option ${p.preference === 'Non-Vegetarian' ? 'selected' : ''}>Non-Vegetarian</option></select></label><label>Goal<select name="goal"><option ${p.goal === 'Lose weight' ? 'selected' : ''}>Lose weight</option><option ${p.goal === 'Maintain' || !p.goal ? 'selected' : ''}>Maintain</option><option ${p.goal === 'Gain muscle' ? 'selected' : ''}>Gain muscle</option></select></label><label>Allergies / restrictions<input name="allergies" value="${esc(p.allergies || 'None')}"></label><label>Health conditions (optional)<input name="healthConditions" value="${esc(p.healthConditions || '')}" placeholder="e.g. diabetes, hypertension"></label><p class="form-error" id="profileFormStatus" role="status" style="margin:2px 0 0;"></p><button class="primary" id="saveProfileBtn" value="save">Update my plan</button><div style="display:flex;justify-content:center;margin-top:10px;"><button type="button" data-action="open-change-password" style="background:none;border:none;padding:0;color:#176b52;font-size:11.5px;font-weight:600;cursor:pointer;text-decoration:underline;">Change Password</button></div></form>`;
  dialog.showModal();
  dialog.querySelector('[data-action="open-change-password"]')?.addEventListener('click', () => {
    dialog.close();
    authMode = 'change-password';
    render();
  });
  dialog.querySelector('form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const nextProfile = {
      name: String(form.get('name')).trim(),
      age: Number(form.get('age')),
      gender: String(form.get('gender')),
      height: Number(form.get('height')),
      weight: Number(form.get('weight')),
      targetWeight: Number(form.get('targetWeight')),
      activity: String(form.get('activity')),
      goal: String(form.get('goal')),
      preference: String(form.get('preference')),
      allergies: String(form.get('allergies') || 'None').trim() || 'None',
      healthConditions: String(form.get('healthConditions') || '').trim()
    };

    const changed = Object.keys(beforeProfile).some((k) => beforeProfile[k] !== nextProfile[k]);
    if (!changed) {
      dialog.close();
      showNotice('No changes were made to your health profile. Your current diet plan was kept.');
      return;
    }

    const saveBtn = dialog.querySelector('#saveProfileBtn');
    const statusEl = dialog.querySelector('#profileFormStatus');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving profile & generating 7-day plan…';
    }
    if (statusEl) {
      statusEl.style.color = '#176b52';
      statusEl.textContent = 'Recalculating nutrition targets and updating your meal plan…';
    }

    const isDbUser = Boolean(session && session.userId && session.userId !== 'demo-user' && session.role === 'user');
    if (isDbUser) {
      setAppLoading(true, 'Updating profile & generating diet plan…');
      let res = null;
      try {
        res = await apiRequest('/profile', {
          method: 'PUT',
          body: JSON.stringify(nextProfile)
        });
      } finally {
        setAppLoading(false);
      }

      if (!res || res._failed) {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Update my plan';
        }
        if (statusEl) {
          statusEl.style.color = '#a33e3e';
          statusEl.textContent = res?.error || 'Could not save profile. Please try again.';
        }
        return;
      }

      Object.assign(p, nextProfile);
      const user = users.find((item) => item.id === session?.userId);
      if (user) {
        user.name = p.name;
        user.profile = { ...p };
        write(STORAGE.users, users);
      }

      if (res.conditionGuidance !== undefined) {
        state.conditionGuidance = res.conditionGuidance;
      }
      if (res.plan) {
        state.activeDietPlan = res.plan;
        selectedPlanDay = 1;
        planViewMode = 'weekly';
        nextDayPlanData = null;
        planHistoryDbData = null;
        groceryLoaded = false;
        const day1Meals = loadPlanDayMeals(res.plan, 1);
        if (day1Meals && day1Meals.length > 0) {
          meals = day1Meals;
          state.mealPlan = meals;
          state.mealPlanPreference = p.preference;
        }
      }
      save();
      dialog.close();
      render();

      if (res.planError) {
        showNotice(`Profile saved, but automatic plan generation failed: ${res.planError}. Your previous diet plan was preserved.`);
      } else if (res.planGenerated) {
        showNotice('Health profile updated and your new 7-day personalized diet plan is ready.');
      } else {
        showNotice('Health profile saved.');
      }
      return;
    }

    // Local/demo offline fallback
    Object.assign(p, nextProfile);
    const user = users.find((item) => item.id === session?.userId);
    if (user) {
      user.name = p.name;
      user.profile = { ...p };
      write(STORAGE.users, users);
    }
    state.activeDietPlan = null;
    save();
    dialog.close();
    render();
    loadNutritionDataset();
  });
}

async function showAdminUser(id) {
  if (!dialog) return;
  const user = adminUsersData.find((item) => item.id === id) || users.find((item) => item.id === id);
  if (!user) return;
  const profile = user.profile || { age: user.age, gender: user.gender, height: user.height_cm, weight: user.weight_kg, targetWeight: user.target_weight_kg, preference: user.food_preference, goal: user.weight_goal, activity: user.activity_level };
  const regDate = user.registered_at ? new Date(user.registered_at).toLocaleString('en-IN') : 'Unknown';
  const lastLogin = (user.last_login_at || user.last_activity_at) ? new Date(user.last_login_at || user.last_activity_at).toLocaleString('en-IN') : 'Never';
  const isInactive = user.status === 'inactive';

  const userSessions = await apiRequest(`/admin/users/${id}/sessions`);
  const sessionsList = Array.isArray(userSessions) && userSessions.length ? userSessions.map((s) => {
    const isMobile = s.device_type === 'Mobile';
    const isTablet = s.device_type === 'Tablet';
    const devBadge = isMobile
      ? `<span style="background:#e5f1df;color:#176b52;padding:2px 6px;border-radius:10px;font-size:10px;font-weight:700;">📱 Mobile</span>`
      : isTablet
        ? `<span style="background:#e8f0fe;color:#1a73e8;padding:2px 6px;border-radius:10px;font-size:10px;font-weight:700;">📟 Tablet</span>`
        : `<span style="background:#f3f7f4;color:#435b52;padding:2px 6px;border-radius:10px;font-size:10px;font-weight:700;">💻 Desktop</span>`;

    const statusBadge = s.session_status === 'active'
      ? `<span style="color:#155724;background:#d4edda;padding:2px 6px;border-radius:8px;font-weight:700;font-size:10px;">🟢 Active Session</span>`
      : s.session_status === 'logged_out'
        ? `<span style="color:#5f6368;background:#f1f3f4;padding:2px 6px;border-radius:8px;font-size:10px;">⚪ Logged Out</span>`
        : `<span style="color:#856404;background:#fff3cd;padding:2px 6px;border-radius:8px;font-size:10px;">⏱ Expired</span>`;

    const timeStr = s.logged_in_at ? new Date(s.logged_in_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #edf1ed;font-size:11px;">
      <div>${devBadge} <strong>${esc(s.device_name || 'Browser')}</strong><br><small style="color:#71817c;">Login: ${esc(timeStr)}</small></div>
      <div>${statusBadge}</div>
    </div>`;
  }).join('') : '<p class="subtle" style="font-size:11px;margin:4px 0;">No device sessions recorded yet.</p>';

  dialog.innerHTML = `
    <form method="dialog" class="dialog-card profile-form" style="max-height:85vh;overflow-y:auto;">
      <button type="button" class="close" data-close-dialog>x</button>
      <p class="eyebrow">USER MANAGEMENT</p>
      <h2 style="margin:0 0 6px;">${esc(user.name)}</h2>
      <div style="background:#f3f7f4;padding:12px 14px;border-radius:10px;font-size:12px;margin:8px 0 14px;display:grid;gap:6px;">
        <p style="margin:0;"><strong>User ID:</strong> <code style="color:#176b52;font-size:11px;">${esc(user.id)}</code></p>
        <p style="margin:0;"><strong>Email:</strong> ${esc(user.email)}</p>
        <p style="margin:0;"><strong>Account Status:</strong> <span style="font-weight:700;color:${isInactive ? '#a33e3e' : '#176b52'};">${isInactive ? 'Inactive' : 'Active'}</span></p>
        <p style="margin:0;"><strong>Registration Date:</strong> ${esc(regDate)}</p>
        <p style="margin:0;"><strong>Last Login:</strong> ${esc(lastLogin)}</p>
        <p style="margin:0;"><strong>Saved Diet Plans:</strong> ${user.plan_count || 0}</p>
      </div>

      <div style="margin:0 0 12px;padding:10px 12px;border:1px solid #dce7df;border-radius:10px;background:#fffdf7;">
        <strong style="font-size:12px;color:#176b52;display:block;margin-bottom:6px;">📱 Connected Devices & Sessions (${Array.isArray(userSessions) ? userSessions.length : 0})</strong>
        <div style="max-height:160px;overflow-y:auto;">
          ${sessionsList}
        </div>
      </div>

      <p style="margin:0 0 10px;font-size:12px;color:#435b52;line-height:1.5;">
        <strong>Profile Details:</strong><br>
        Age: ${esc(profile.age || 'N/A')} · Gender: ${esc(profile.gender || 'N/A')} · Height: ${esc(profile.height || 'N/A')} cm · Weight: ${esc(profile.weight || 'N/A')} kg<br>
        Goal: ${esc(profile.goal || 'N/A')} · Preference: ${esc(profile.preference || 'N/A')} · Activity: ${esc(profile.activity || 'N/A')}
      </p>
      <div style="display:flex;gap:8px;margin-top:10px;">
        <button type="button" class="secondary" data-toggle-user style="flex:1;">${isInactive ? 'Activate account' : 'Deactivate account'}</button>
        <button type="button" class="secondary" data-delete-user style="flex:1;border-color:#e5b3b3;color:#a33e3e;">Delete account</button>
      </div>
    </form>
  `;
  dialog.showModal();
  dialog.querySelector('[data-close-dialog]')?.addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-toggle-user]')?.addEventListener('click', () => {
    if (adminUsersData.some((item) => item.id === id)) {
      apiRequest(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify({ status: user.status === 'inactive' ? 'active' : 'inactive' }) }).then(() => { dialog.close(); loadAdminData(true); });
      return;
    }
    user.status = user.status === 'inactive' ? 'active' : 'inactive';
    write(STORAGE.users, users);
    dialog.close();
    render();
  });
  dialog.querySelector('[data-delete-user]')?.addEventListener('click', () => {
    if (!confirm(`Delete ${user.name}'s account? This cannot be undone.`)) return;
    if (adminUsersData.some((item) => item.id === id)) {
      apiRequest(`/admin/users/${id}`, { method: 'DELETE' }).then(() => { dialog.close(); loadAdminData(true); });
      return;
    }
    users = users.filter((item) => item.id !== id);
    const states = read(STORAGE.userStates, {});
    delete states[id];
    write(STORAGE.userStates, states);
    write(STORAGE.users, users);
    dialog.close();
    render();
  });
}

function showAdminRecipe(type) {
  showNotice(`Recipe editor selected: ${type}. Use the connected recipe API for full ingredient and nutrition updates.`);
}

function showAdminInput(title, type) {
  if (!dialog) return;
  dialog.innerHTML = `<form method="dialog" class="dialog-card profile-form"><button class="close">×</button><p class="eyebrow">ADMIN MANAGEMENT</p><h2>${esc(title)}</h2><label>Name<input name="name" required autofocus></label><button class="primary" value="save">Save</button></form>`;
  dialog.showModal();
  dialog.querySelector('form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = new FormData(event.target).get('name').toString().trim();
    if (type === 'food') adminData.foods.push(value);
    if (type === 'plan') adminData.plans.push(value);
    if (type === 'recipe') showNotice(`${value} can be connected to the recipe catalogue API.`);
    if (type === 'user') showNotice(`${value} requires an email and server-backed invitation before activation.`);
    write(STORAGE.adminData, adminData);
    dialog.close();
    render();
  });
}

function ensureDemoAccounts() {
  const promises = [];
  if (!users.some((user) => user.role === 'admin')) {
    promises.push(hashPassword('Admin@12345').then((password) => {
      users.push({ id: crypto.randomUUID(), email: 'admin@daylight.local', name: 'Daylight Admin', role: 'admin', password });
      write(STORAGE.users, users);
    }));
  }
  return Promise.all(promises);
}

document.querySelector('#profileButton')?.addEventListener('click', () => {
  if (isAppLockActive()) { render(); return; }
  session && session.role === 'user' ? showProfile() : showNotice('Admin profile settings are managed by the server administrator.');
});
document.querySelector('#signOutButton')?.addEventListener('click', signOut);
document.querySelectorAll('.nav-button').forEach((button) => {
  button.addEventListener('click', () => {
    if (isAppLockActive()) { render(); return; }
    navigateToView(button.dataset.view);
  });
});

window.addEventListener('popstate', (event) => {
  if (isAppLockActive() || !session || session.role !== 'user') return;
  const params = new URLSearchParams(window.location.search);
  const target = event.state?.view || params.get('view') || 'today';
  if (VIEW_ORDER.includes(target) && target !== currentView) {
    navigateToView(target, { pushHistory: false });
  }
});

// Smooth horizontal touch swipe navigation between dashboard sections (never blocks normal scrolling)
(function attachSwipeNavigation() {
  if (!app || !app.addEventListener) return;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let ignoreSwipe = false;

  const isHorizontalScrollableAncestor = (el) => {
    let cur = el;
    while (cur && cur !== app && cur !== document.body) {
      if (['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'].includes(cur.tagName)) return true;
      if (cur.scrollWidth > cur.clientWidth + 4) return true;
      cur = cur.parentElement;
    }
    return false;
  };

  app.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length !== 1 || isAppLockActive() || !session || session.role !== 'user' || dialog?.open) {
      ignoreSwipe = true;
      return;
    }
    ignoreSwipe = isHorizontalScrollableAncestor(e.target);
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  app.addEventListener('touchend', (e) => {
    if (ignoreSwipe || !e.changedTouches || e.changedTouches.length !== 1) return;
    if (isAppLockActive() || !session || session.role !== 'user' || dialog?.open) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const dt = Date.now() - touchStartTime;
    if (dt > 550 || Math.abs(dx) < 75 || Math.abs(dx) < Math.abs(dy) * 1.8) return;

    const idx = VIEW_ORDER.indexOf(currentView);
    if (idx === -1) return;
    const nextIdx = dx < 0 ? idx + 1 : idx - 1;
    if (nextIdx >= 0 && nextIdx < VIEW_ORDER.length) {
      navigateToView(VIEW_ORDER[nextIdx], { swipeDir: dx < 0 ? 'left' : 'right' });
    }
  }, { passive: true });
}());
document.querySelector('#themeButton')?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem(STORAGE.theme, document.body.classList.contains('dark') ? 'dark' : 'light');
});

if (localStorage.getItem(STORAGE.theme) === 'dark') {
  document.body.classList.add('dark');
}

const adminReady = ensureDemoAccounts();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' }).then((registration) => {
      registration.update().catch(() => {});
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
              console.log('Daylight updated to latest version.');
            }
          });
        }
      });
    }).catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
  navigator.serviceWorker?.addEventListener?.('controllerchange', () => {
    console.log('Service worker controller changed.');
  });
}

window.addEventListener('error', (event) => {
  console.warn('Daylight handled window error:', event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.warn('Daylight handled promise rejection:', event.reason);
});

// Handle PWA shortcut deep-links via ?view= query param
const viewParam = urlParams.get('view');
if (viewParam && ['today', 'plan', 'track', 'grocery', 'profile'].includes(viewParam)) {
  currentView = viewParam;
}

window.addEventListener('focus', () => {
  if (session?.role === 'admin') loadAdminData(true);
});

// Automatic App Lock on mobile/PWA backgrounding, app switching, freezing, or BFCache restore
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    lockApp();
  } else if (isAppLockActive()) {
    render();
  }
});
window.addEventListener('pagehide', () => lockApp());
window.addEventListener('pageshow', (event) => {
  if (event.persisted) lockApp();
  else if (isAppLockActive()) render();
});
document.addEventListener('freeze', () => lockApp());
document.addEventListener('resume', () => lockApp());

render();
if (session?.role === 'admin') {
  loadAdminData(true);
}
loadRecipeCatalog();
if (!isAppLockActive()) {
  loadNutritionDataset();
}
