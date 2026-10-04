const defaultState = {
  profile: { name: 'Adarsh', age: 24, gender: 'Male', height: 174, weight: 68, activity: 'Moderate', goal: 'Maintain', preference: 'Vegetarian', allergies: 'None' },
  water: 1450,
  exercise: 10,
  sleep: 7.2,
  mealsDone: { Breakfast: true, Lunch: false, Dinner: false },
  groceries: [
    ['Oats', '500 g'], ['Paneer', '400 g'], ['Quinoa', '250 g'], ['Greek yogurt', '500 g'], ['Seasonal greens', '2 bunches'], ['Lentils', '500 g']
  ].map(([name, quantity]) => ({ name, quantity, purchased: false }))
};

const meals = [
  { type: 'Breakfast', time: '08:00 AM', name: 'Masala oats & boiled eggs', calories: 420, protein: 24, ingredients: ['Oats', 'Eggs', 'Onion', 'Tomato'], recipe: 'Cook oats with vegetables and spices. Serve with boiled eggs.', swaps: ['Tofu scramble', 'Moong chilla', 'Paneer bhurji'] },
  { type: 'Mid-morning', time: '11:00 AM', name: 'Greek yogurt with berries', calories: 180, protein: 12, ingredients: ['Greek yogurt', 'Berries', 'Chia seeds'], recipe: 'Layer yogurt, berries and chia seeds. Chill for 10 minutes.', swaps: ['Curd', 'Soy yogurt', 'Buttermilk'] },
  { type: 'Lunch', time: '01:30 PM', name: 'Paneer quinoa power bowl', calories: 560, protein: 31, ingredients: ['Paneer', 'Quinoa', 'Spinach', 'Cucumber'], recipe: 'Cook quinoa, pan-sear paneer and assemble with greens.', swaps: ['Tofu', 'Chickpeas', 'Brown rice'] },
  { type: 'Evening snack', time: '04:30 PM', name: 'Roasted makhana & chai', calories: 160, protein: 7, ingredients: ['Makhana', 'Tea', 'Cardamom'], recipe: 'Dry roast makhana with a pinch of spices.', swaps: ['Roasted chickpeas', 'Popcorn', 'Peanuts'] },
  { type: 'Dinner', time: '08:00 PM', name: 'Dal, roti & seasonal greens', calories: 480, protein: 22, ingredients: ['Lentils', 'Whole wheat flour', 'Greens'], recipe: 'Pressure cook dal, prepare rotis and saute seasonal greens.', swaps: ['Millets', 'Brown rice', 'Quinoa'] }
];

let state = JSON.parse(localStorage.getItem('daylight-state') || 'null') || structuredClone(defaultState);
let currentView = 'today';
const app = document.querySelector('#app');

function health() {
  const p = state.profile;
  const bmi = p.weight / ((p.height / 100) ** 2);
  const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.gender === 'Female' ? -161 : 5);
  const factors = { Low: 1.2, Moderate: 1.45, High: 1.7 };
  const adjustments = { 'Lose weight': -300, Maintain: 0, 'Gain muscle': 250 };
  return { bmi, bmr: Math.round(bmr), calories: Math.round(bmr * factors[p.activity] + adjustments[p.goal]), water: Math.round(p.weight * 35), label: bmi < 18.5 ? 'Below range' : bmi < 25 ? 'Healthy range' : bmi < 30 ? 'Above range' : 'High range' };
}

function score() {
  const h = health();
  const mealScore = Object.values(state.mealsDone).filter(Boolean).length * 15;
  const calorieScore = Math.max(0, 20 - Math.abs(1520 - h.calories) / h.calories * 20);
  return Math.round(mealScore + Math.min(20, state.water / h.water * 20) + Math.min(10, state.exercise / 30 * 10) + Math.min(5, state.sleep / 8 * 5) + calorieScore);
}

function save() { localStorage.setItem('daylight-state', JSON.stringify(state)); }
function esc(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }
function metric(label, value, unit, detail, tone) { return `<article class="metric ${tone}"><small>${label}</small><strong>${value} <em>${unit}</em></strong><span>${detail}</span></article>`; }
function mealCard(meal) { return `<button class="meal-card" data-meal="${esc(meal.type)}"><span class="meal-index">${meals.indexOf(meal) + 1}</span><span class="meal-content"><small>${esc(meal.type)} <time>${meal.time}</time></small><strong>${esc(meal.name)}</strong><span>${meal.calories} kcal · ${meal.protein}g protein</span></span><b>›</b></button>`; }

function render() {
  const views = { today: renderToday, plan: renderPlan, track: renderTrack, grocery: renderGrocery, profile: renderProfile };
  app.innerHTML = views[currentView]();
  document.querySelectorAll('.nav-button').forEach((button) => button.classList.toggle('active', button.dataset.view === currentView));
  bindActions();
}

function renderToday() {
  const h = health();
  return `<p class="eyebrow">TODAY · 04 OCTOBER 2026</p><h1>Good morning, ${esc(state.profile.name)}.</h1><p class="subtle">A calm plan for a stronger day.</p><section class="target"><div><small>YOUR DAILY TARGET</small><strong>${h.calories} <em>kcal</em></strong><span>Adaptive target for ${esc(state.profile.goal.toLowerCase())}</span></div><div class="score"><b>${score()}</b><small>wellness</small></div><div class="bar"><i style="width:68%"></i></div><footer><span>1,520 consumed</span><span>480 remaining</span></footer></section><section class="metrics">${metric('BMI', h.bmi.toFixed(1), 'kg/m²', h.label, 'mint')}${metric('BMR', h.bmr, 'kcal', 'Resting burn', 'peach')}${metric('Water', (state.water / 1000).toFixed(1), 'L', `${Math.round(state.water / h.water * 100)}% target`, 'blue')}</section><div class="section-title"><h2>Today's meals</h2><button data-view="plan">View full plan →</button></div><div class="meal-list">${meals.slice(0, 3).map(mealCard).join('')}</div><section class="split"><article class="small-card mint"><small>HYDRATION</small><strong>${state.water} <em>/ ${h.water} ml</em></strong><div class="progress"><i style="width:${Math.min(100, state.water / h.water * 100)}%"></i></div><button data-action="water">+ Add 250 ml</button></article><article class="small-card peach"><small>WELLNESS SCORE</small><strong>${score()} / 100</strong><span>${score() >= 75 ? 'Good momentum' : 'Keep building'}</span></article></section>`;
}

function renderPlan() { return `<p class="eyebrow">ADAPTIVE MEAL PLAN</p><h1>Built around ${health().calories} kcal.</h1><p class="subtle wide">Five balanced moments tuned to your goal and preference. Tap a meal for its recipe and substitutions.</p><div class="meal-list full">${meals.map(mealCard).join('')}</div><button class="primary" data-action="next-plan">Generate next-day plan →</button>`; }
function renderTrack() { return `<p class="eyebrow">YOUR MOMENTUM</p><h1>Small habits, visible progress.</h1><section class="streak"><small>DAILY WELLNESS SCORE</small><strong>${score()} / 100</strong><span>Diet · calories · water · exercise · sleep</span></section><div class="track-list"><article><b>💧 Water</b><span>${state.water} / ${health().water} ml</span><button data-action="water">Add 250 ml</button></article><article><b>🏃 Exercise</b><span>${state.exercise} minutes</span><button data-action="exercise">Add 10 min</button></article><article><b>🌙 Sleep</b><span>${state.sleep} hours</span><button data-action="sleep">Log 8 hours</button></article></div><h3 class="label">MEAL ADHERENCE</h3>${['Breakfast', 'Lunch', 'Dinner'].map((meal) => `<label class="check"><input type="checkbox" data-meal-check="${meal}" ${state.mealsDone[meal] ? 'checked' : ''}> ${meal} completed</label>`).join('')}`; }
function renderGrocery() { return `<p class="eyebrow">PLAN TO KITCHEN</p><h1>Smart grocery list</h1><p class="subtle">Generated from this week's meal plan.</p><div class="grocery-list">${state.groceries.map((item, index) => `<label class="grocery"><input type="checkbox" data-grocery="${index}" ${item.purchased ? 'checked' : ''}><span><b>${esc(item.name)}</b><small>${esc(item.quantity)}</small></span></label>`).join('')}</div>`; }
function renderProfile() { const p = state.profile; const h = health(); return `<p class="eyebrow">YOUR FOUNDATION</p><h1>${esc(p.name)}'s profile</h1><section class="profile-summary"><div class="avatar large">AS</div><div><strong>${esc(p.preference)}</strong><span>${esc(p.goal)} · ${esc(p.activity)} activity</span><button data-action="edit">Edit health details →</button></div></section><section class="metrics">${metric('Height', p.height, 'cm', 'Current', 'mint')}${metric('Weight', p.weight, 'kg', 'Current', 'peach')}${metric('BMI', h.bmi.toFixed(1), 'kg/m²', h.label, 'blue')}</section><article class="notice"><b>Your data, your pace.</b><span>Plans and tracking stay available offline on this device.</span></article>`; }

function bindActions() {
  document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => { currentView = button.dataset.view; render(); }));
  document.querySelectorAll('[data-meal]').forEach((button) => button.addEventListener('click', () => showMeal(meals.find((meal) => meal.type === button.dataset.meal))));
  document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => handleAction(button.dataset.action)));
  document.querySelectorAll('[data-meal-check]').forEach((input) => input.addEventListener('change', () => { state.mealsDone[input.dataset.mealCheck] = input.checked; save(); render(); }));
  document.querySelectorAll('[data-grocery]').forEach((input) => input.addEventListener('change', () => { state.groceries[input.dataset.grocery].purchased = input.checked; save(); render(); }));
}

function handleAction(action) { if (action === 'water') state.water = Math.min(health().water, state.water + 250); if (action === 'exercise') state.exercise += 10; if (action === 'sleep') state.sleep = 8; if (action === 'edit') showProfile(); save(); render(); }
function showMeal(meal) { document.querySelector('#profileDialog').innerHTML = `<form method="dialog" class="dialog-card"><button class="close">×</button><p class="eyebrow">${meal.type.toUpperCase()}</p><h2>${meal.name}</h2><b class="green-text">${meal.calories} kcal · ${meal.protein}g protein</b><h3>Ingredients</h3><p>${meal.ingredients.join(' · ')}</p><h3>Recipe</h3><p>${meal.recipe}</p><h3>Smart substitutions</h3><div class="chips">${meal.swaps.map((swap) => `<span>${swap}</span>`).join('')}</div></form>`; document.querySelector('#profileDialog').showModal(); }
function showProfile() { const p = state.profile; const dialog = document.querySelector('#profileDialog'); dialog.innerHTML = `<form method="dialog" class="dialog-card profile-form"><button class="close">×</button><p class="eyebrow">HEALTH PROFILE</p><h2>Keep your plan personal</h2><label>Name<input name="name" value="${esc(p.name)}"></label><label>Age<input name="age" type="number" value="${p.age}"></label><label>Height (cm)<input name="height" type="number" value="${p.height}"></label><label>Weight (kg)<input name="weight" type="number" value="${p.weight}"></label><label>Activity<select name="activity"><option ${p.activity === 'Low' ? 'selected' : ''}>Low</option><option ${p.activity === 'Moderate' ? 'selected' : ''}>Moderate</option><option ${p.activity === 'High' ? 'selected' : ''}>High</option></select></label><label>Goal<select name="goal"><option ${p.goal === 'Lose weight' ? 'selected' : ''}>Lose weight</option><option ${p.goal === 'Maintain' ? 'selected' : ''}>Maintain</option><option ${p.goal === 'Gain muscle' ? 'selected' : ''}>Gain muscle</option></select></label><label>Allergies / restrictions<input name="allergies" value="${esc(p.allergies)}"></label><button class="primary" value="save">Update my plan</button></form>`; dialog.showModal(); dialog.querySelector('form').addEventListener('submit', (event) => { event.preventDefault(); const form = new FormData(event.target); Object.assign(p, { name: form.get('name'), age: Number(form.get('age')), height: Number(form.get('height')), weight: Number(form.get('weight')), activity: form.get('activity'), goal: form.get('goal'), allergies: form.get('allergies') }); save(); dialog.close(); render(); }); }

document.querySelectorAll('.nav-button').forEach((button) => button.addEventListener('click', () => { currentView = button.dataset.view; render(); }));
document.querySelector('#profileButton').addEventListener('click', showProfile);
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js', { scope: './' }));
}
// Handle PWA shortcut deep-links via ?view= query param
const urlParams = new URLSearchParams(window.location.search);
const viewParam = urlParams.get('view');
if (viewParam && ['today', 'plan', 'track', 'grocery', 'profile'].includes(viewParam)) {
  currentView = viewParam;
}
render();
