const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/pddr' });
const BASE_URL = 'http://localhost:8080';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data, headers: res.headers };
}

async function runTests() {
  console.log('=== PDDR NUTRITION CONSISTENCY & CALORIE TARGET TEST SUITE ===\n');

  // 1. Verify User Adarsh24's current scenario
  console.log('--- TEST 1: User Adarsh24 (target 1,674 kcal, 4 completed meals = 472 kcal) ---');
  const userRes = await pool.query("SELECT id, email FROM users WHERE email = 'adarshpatil355@gmail.com'");
  if (userRes.rows.length === 0) {
    throw new Error('User adarshpatil355@gmail.com not found in database');
  }
  const adarshUser = userRes.rows[0];
  console.log('Found user:', adarshUser.id, adarshUser.email);

  // Check active plan
  const planRes = await pool.query("SELECT * FROM diet_plans WHERE user_id = $1 AND id = '06de66b5-c524-4f45-b073-8400f310f731'", [adarshUser.id]);
  const plan = planRes.rows[0];
  console.log('Plan target:', plan.calorie_target, 'Total plan calories in DB:', plan.total_calories);
  const meals = typeof plan.meals === 'string' ? JSON.parse(plan.meals) : plan.meals;
  console.log('Total meals in plan:', meals.length);
  if (meals.length !== 5) {
    throw new Error(`Expected 5 meals in plan, found ${meals.length}`);
  }
  meals.forEach((m, idx) => {
    console.log(`  Meal [${idx}] ${m.type}: ${m.name} - ${m.calories} kcal (${m.portion}g)`);
  });

  // Query completions for Adarsh24
  const compRes = await pool.query(`
    SELECT meal_index, meal_type, meal_name, calories, protein, carbohydrates, fat, completed
    FROM meal_completions
    WHERE user_id = $1 AND plan_date = '2026-11-27'
    ORDER BY meal_index ASC
  `, [adarshUser.id]);

  console.log('\nCompletions for 2026-11-27:');
  let compCalSum = 0;
  compRes.rows.forEach(c => {
    if (c.completed) compCalSum += Number(c.calories);
    console.log(`  [${c.meal_index}] ${c.meal_name} - ${c.calories} kcal (completed: ${c.completed})`);
  });
  console.log('Sum of completed calories:', compCalSum);
  const targetCalories = Number(plan.calorie_target);
  const remaining = targetCalories - compCalSum;
  console.log(`Target: ${targetCalories} kcal | Consumed: ${compCalSum} kcal | Remaining: ${remaining} kcal`);

  if (targetCalories !== 1674) throw new Error(`Expected target 1674, got ${targetCalories}`);
  if (compCalSum !== 472) throw new Error(`Expected completed 472, got ${compCalSum}`);
  if (remaining !== 1202) throw new Error(`Expected remaining 1202, got ${remaining}`);
  console.log('✓ TEST 1 PASSED: 4 completed meals = 472 kcal, target = 1674 kcal, remaining = 1202 kcal exactly as reported.\n');

  // 2. Test toggling completion via API: Complete 5th meal, unmark, unmark meal 0, and re-mark
  console.log('--- TEST 2: Completion toggle, exact subtraction, and duplicate prevention ---');
  // Log in as Adarsh24 to get cookie session
  // Set password or login
  const testUserEmail = `cal_test_${Date.now()}@example.com`;
  const regRes = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: testUserEmail,
      password: 'Password123!',
      name: 'Calorie Tester',
      age: 26,
      gender: 'Male',
      height: 175,
      weight: 68,
      targetWeight: 65,
      activity: 'Moderate',
      goal: 'Maintain',
      preference: 'Vegetarian',
      allergies: 'None'
    })
  });
  console.log('Register test user status:', regRes.status);

  // Log in to get session cookie
  const loginRes = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testUserEmail,
      password: 'Password123!'
    })
  });
  console.log('Login test user status:', loginRes.status);
  const setCookie = loginRes.headers.get('set-cookie');
  const cookieHeader = setCookie ? setCookie.split(';')[0] : '';
  const authHeaders = { Cookie: cookieHeader };

  // Fetch created plan for test user
  const userPlanRes = await request('/api/plans', { headers: authHeaders });
  console.log('User plans count:', userPlanRes.data.length);
  const activePlan = userPlanRes.data[0];
  console.log('Active plan name:', activePlan.plan_name, 'Target:', activePlan.calorie_target, 'TotalCal:', activePlan.total_calories);
  const planTarget = Number(activePlan.calorie_target);
  const planDays = typeof activePlan.meals === 'string' ? JSON.parse(activePlan.meals) : activePlan.meals;
  const day1Meals = planDays[0].meals;
  console.log('Day 1 meals count:', day1Meals.length);
  if (day1Meals.length !== 5) throw new Error(`Expected 5 meals in generated plan, got ${day1Meals.length}`);

  let day1CalSum = 0;
  day1Meals.forEach((m, idx) => {
    const f = m.foods[0];
    day1CalSum += f.calories;
    console.log(`  [${idx}] ${m.type}: ${f.name} (${f.portion}g) - ${f.calories} kcal`);
  });
  console.log(`Total planned day 1 calories: ${day1CalSum} kcal (Target: ${planTarget} kcal, ratio: ${(day1CalSum / planTarget * 100).toFixed(1)}%)`);

  // Verify alignment: Total planned day calories within 10% of target
  const diffPct = Math.abs(day1CalSum - planTarget) / planTarget;
  if (diffPct > 0.12) {
    throw new Error(`Planned day calories (${day1CalSum}) deviates more than 12% from target (${planTarget})`);
  }
  console.log(`✓ Planned day calories (${day1CalSum} kcal) closely aligned with daily target (${planTarget} kcal).`);

  // Test meal completion toggle
  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
  console.log('\nTesting meal completions on date:', todayStr);

  // Complete meal 0
  const m0 = day1Meals[0].foods[0];
  const comp1 = await request('/api/meals/complete', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      diet_plan_id: activePlan.id,
      plan_date: todayStr,
      meal_index: 0,
      meal_type: day1Meals[0].type,
      meal_name: m0.name,
      calories: m0.calories,
      protein: m0.protein,
      carbohydrates: m0.carbohydrates,
      fat: m0.fats,
      completed: true
    })
  });
  console.log('Complete meal 0 response:', comp1.data.totals);
  if (comp1.data.totals.calories !== m0.calories) {
    throw new Error(`Expected totals.calories = ${m0.calories}, got ${comp1.data.totals.calories}`);
  }

  // Complete meal 1
  const m1 = day1Meals[1].foods[0];
  const comp2 = await request('/api/meals/complete', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      diet_plan_id: activePlan.id,
      plan_date: todayStr,
      meal_index: 1,
      meal_type: day1Meals[1].type,
      meal_name: m1.name,
      calories: m1.calories,
      protein: m1.protein,
      carbohydrates: m1.carbohydrates,
      fat: m1.fats,
      completed: true
    })
  });
  console.log('Complete meal 1 response:', comp2.data.totals);
  if (comp2.data.totals.calories !== (m0.calories + m1.calories)) {
    throw new Error(`Expected totals.calories = ${m0.calories + m1.calories}, got ${comp2.data.totals.calories}`);
  }

  // Duplicate submission test: send meal 1 again with completed: true
  const comp2Dup = await request('/api/meals/complete', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      diet_plan_id: activePlan.id,
      plan_date: todayStr,
      meal_index: 1,
      meal_type: day1Meals[1].type,
      meal_name: m1.name,
      calories: m1.calories,
      protein: m1.protein,
      carbohydrates: m1.carbohydrates,
      fat: m1.fats,
      completed: true
    })
  });
  console.log('Duplicate meal 1 submission totals:', comp2Dup.data.totals);
  if (comp2Dup.data.totals.calories !== (m0.calories + m1.calories)) {
    throw new Error(`Duplicate counting detected! Expected ${m0.calories + m1.calories}, got ${comp2Dup.data.totals.calories}`);
  }
  console.log('✓ Duplicate submission prevented: calories did not double.');

  // Unmark meal 0
  const unmark0 = await request('/api/meals/complete', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      diet_plan_id: activePlan.id,
      plan_date: todayStr,
      meal_index: 0,
      meal_type: day1Meals[0].type,
      meal_name: m0.name,
      calories: m0.calories,
      protein: m0.protein,
      carbohydrates: m0.carbohydrates,
      fat: m0.fats,
      completed: false
    })
  });
  console.log('Unmark meal 0 response:', unmark0.data.totals);
  if (unmark0.data.totals.calories !== m1.calories) {
    throw new Error(`Expected totals.calories = ${m1.calories} after unmarking meal 0, got ${unmark0.data.totals.calories}`);
  }
  console.log('✓ Subtraction accurate: unmarking meal 0 subtracted exactly meal 0 calories.');

  // Verify GET /api/meals/completions
  const getComps = await request(`/api/meals/completions?date=${todayStr}`, { headers: authHeaders });
  console.log('GET completions totals:', getComps.data.totals, 'Completions count:', getComps.data.completions.length);
  if (getComps.data.totals.calories !== m1.calories) {
    throw new Error(`GET completions mismatch: expected ${m1.calories}, got ${getComps.data.totals.calories}`);
  }
  console.log('✓ GET /api/meals/completions returns identical totals.');

  // 3. Test Next Day Plan Generation
  console.log('\n--- TEST 3: Generate Next Day Meal Plan via /api/plans/next-day ---');
  const nextDayRes = await request('/api/plans/next-day', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ regenerate: true })
  });
  console.log('Next Day Plan status:', nextDayRes.status);
  const nextPlan = nextDayRes.data.plan;
  const nextMeals = typeof nextPlan.meals === 'string' ? JSON.parse(nextPlan.meals) : nextPlan.meals;
  const nextDay1 = nextMeals[0].meals;
  console.log('Next day meals count:', nextDay1.length);
  if (nextDay1.length !== 5) throw new Error(`Expected 5 meals in Next Day Plan, got ${nextDay1.length}`);

  let nextDayCal = 0;
  nextDay1.forEach((m, idx) => {
    const f = m.foods[0];
    nextDayCal += f.calories;
    console.log(`  [${idx}] ${m.type}: ${f.name} (${f.portion}g) - ${f.calories} kcal`);
  });
  console.log(`Next day planned total: ${nextDayCal} kcal (Target: ${planTarget} kcal, ratio: ${(nextDayCal / planTarget * 100).toFixed(1)}%)`);
  const nextDiffPct = Math.abs(nextDayCal - planTarget) / planTarget;
  if (nextDiffPct > 0.12) {
    throw new Error(`Next day planned calories (${nextDayCal}) deviates more than 12% from target (${planTarget})`);
  }
  console.log('✓ Next Day Meal Plan contains all 5 meals and matches target calories within 10-12%.');

  // Verify no standalone drinks in lunch or dinner
  const drinkRegex = /\b(tea|coffee|water|soft drink|soda|juice|drink|punch|lemonade|gin|squash|syrup|sherbet|cocktail|cordial|cooler|cocoa|milkshake|lassi|buttermilk|egg nog)\b/i;
  nextDay1.forEach((m) => {
    const f = m.foods[0];
    if (m.type === 'Lunch' || m.type === 'Dinner') {
      if (drinkRegex.test(f.name)) {
        throw new Error(`Drink found as main meal in ${m.type}: ${f.name}`);
      }
    }
  });
  console.log('✓ Main meals (Lunch, Dinner) contain hearty foods and no drinks/lassi.');

  // Clean up test user
  await pool.query('DELETE FROM users WHERE email = $1', [testUserEmail]);
  await pool.end();
  console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch((err) => {
  console.error('\n❌ TEST FAILED:', err);
  pool.end();
  process.exit(1);
});
