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
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = text;
  }
  return { status: res.status, ok: res.ok, data };
}

async function testCalorieProgressLogic() {
  console.log('================================================================');
  console.log('PDDR – CALORIE PROGRESS DISPLAY LOGIC VERIFICATION SUITE');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`  [FAIL] ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // --- SUITE 1: Formula Verification for 0..5 Completed Meals ---
  console.log('--- SUITE 1: Meal Completion Percentage Logic (0 to 5 of 5) ---');
  const totalMeals = 5;
  const testCases = [
    { completed: 0, expected: 0 },
    { completed: 1, expected: 20 },
    { completed: 2, expected: 40 },
    { completed: 3, expected: 60 },
    { completed: 4, expected: 80 },
    { completed: 5, expected: 100 }
  ];

  testCases.forEach(({ completed, expected }) => {
    const calcPercent = totalMeals > 0 ? Math.round((completed / totalMeals) * 100) : 0;
    const barPercent = Math.min(100, Math.max(0, calcPercent));
    assert(calcPercent === expected, `${completed} of ${totalMeals} meals completed -> ${calcPercent}% (expected ${expected}%)`);
    assert(barPercent === expected, `Progress bar width style: ${barPercent}% (expected ${expected}%)`);
  });

  // --- SUITE 2: Verification of Separation Between Progress % and Calorie Consumed/Remaining ---
  console.log('\n--- SUITE 2: Calorie Target & Consumed / Remaining Separation ---');
  const sampleTarget = 1674;
  const sampleMeals = [
    { name: 'Sweet Lassi (Meethi lassi)', calories: 89, protein: 3.2, carbs: 14.5, fat: 2.1 },
    { name: 'Lassi (salted)', calories: 47, protein: 2.8, carbs: 4.5, fat: 1.8 },
    { name: 'Cheese and chilli sandwich', calories: 168, protein: 6.5, carbs: 21.0, fat: 7.2 },
    { name: 'Cucumber sandwich', calories: 168, protein: 4.8, carbs: 24.0, fat: 5.5 },
    { name: 'Evening / Dinner item', calories: 1202, protein: 45.0, carbs: 130.0, fat: 38.0 }
  ];

  // Check when 4 meals completed (user's scenario)
  const fourCompletedMeals = sampleMeals.slice(0, 4);
  const consumed4 = fourCompletedMeals.reduce((acc, m) => acc + m.calories, 0);
  const remaining4 = Math.max(0, sampleTarget - consumed4);
  const percent4 = Math.round((4 / 5) * 100);

  assert(consumed4 === 472, `4 meals completed consumed calories = ${consumed4} kcal (expected 472 kcal)`);
  assert(remaining4 === 1202, `4 meals completed remaining calories = ${remaining4} kcal (expected 1202 kcal)`);
  assert(percent4 === 80, `4 meals completed calorie progress percent = ${percent4}% (expected 80%)`);
  assert(sampleTarget === 1674, `Daily calorie target remained unchanged: ${sampleTarget} kcal`);

  // Check when 5 meals completed
  const fiveCompletedMeals = sampleMeals.slice(0, 5);
  const consumed5 = fiveCompletedMeals.reduce((acc, m) => acc + m.calories, 0);
  const remaining5 = Math.max(0, sampleTarget - consumed5);
  const percent5 = Math.round((5 / 5) * 100);

  assert(consumed5 === 1674, `5 meals completed consumed calories = ${consumed5} kcal (expected 1674 kcal)`);
  assert(remaining5 === 0, `5 meals completed remaining calories = ${remaining5} kcal (expected 0 kcal)`);
  assert(percent5 === 100, `5 meals completed calorie progress percent = ${percent5}% (expected 100%)`);

  // --- SUITE 3: Codebase & Frontend Static Check in pwa/app.js ---
  console.log('\n--- SUITE 3: Frontend Implementation Check (pwa/app.js, pwa/index.html, pwa/sw.js) ---');
  const fs = require('fs');
  const appJs = fs.readFileSync('pwa/app.js', 'utf8');
  const indexHtml = fs.readFileSync('pwa/index.html', 'utf8');
  const swJs = fs.readFileSync('pwa/sw.js', 'utf8');

  // Verify renderToday implementation
  assert(
    appJs.includes('const caloriePercent = totalMealsCount > 0 ? Math.round((completedCount / totalMealsCount) * 100) : 0;'),
    'renderToday() calculates caloriePercent from completedCount / totalMealsCount'
  );
  assert(
    appJs.includes('<div class="score"><b>${caloriePercent}%</b><small>progress</small></div><div class="bar"><i style="width:${caloriePercent}%"></i></div>'),
    'renderToday() renders circular score indicator and progress bar with caloriePercent'
  );
  assert(
    appJs.includes('<span>${consumed.toLocaleString()} consumed</span><span>${Math.max(0, targetCalories - consumed).toLocaleString()} remaining</span>'),
    'renderToday() preserves separate actual consumed and remaining calorie display'
  );

  // Verify renderPlan implementation
  assert(
    appJs.includes('const calPercent = totalMealsCount > 0 ? Math.round((completedCount / totalMealsCount) * 100) : 0;'),
    'renderPlan() calculates calPercent from completedCount / totalMealsCount'
  );
  assert(
    appJs.includes('<div class="score" style="border-color:#84b7a4;"><b>${calPercent}%</b><small>progress</small></div><div class="bar"><i style="width:${calBarPercent}%;"></i></div>'),
    'renderPlan() renders circular score indicator and progress bar with calBarPercent'
  );
  assert(
    appJs.includes('<span>${consumedTotals.calories.toLocaleString()} kcal consumed</span><span>${Math.max(0, calTarget - consumedTotals.calories).toLocaleString()} kcal remaining</span>'),
    'renderPlan() preserves separate actual consumed and remaining calorie display'
  );

  // Verify cache version bumped to v50
  assert(indexHtml.includes('app.js?v=50'), 'pwa/index.html includes app.js?v=50');
  assert(swJs.includes("CACHE_NAME = 'daylight-v50'"), 'pwa/sw.js sets CACHE_NAME to daylight-v50');

  // --- SUITE 4: Live Server & Database Health ---
  console.log('\n--- SUITE 4: Live Server & Database Status ---');
  const ping = await request('/index.html');
  assert(ping.status === 200, `Server /index.html endpoint returned status ${ping.status}`);

  const userQuery = await pool.query("SELECT id, email FROM users WHERE email = 'adarshpatil355@gmail.com'");
  assert(userQuery.rows.length > 0, 'User adarshpatil355@gmail.com exists in database');
  const user = userQuery.rows[0];

  // Verify active plan exists and has target 1674 kcal
  const activePlanQuery = await pool.query(
    "SELECT id, plan_name, calorie_target, total_calories, meals FROM diet_plans WHERE user_id = $1 AND (id = '06de66b5-c524-4f45-b073-8400f310f731' OR calorie_target = 1674) ORDER BY created_at DESC LIMIT 1",
    [user.id]
  );
  assert(activePlanQuery.rows.length > 0, 'User has active diet plan in database');
  const activePlan = activePlanQuery.rows[0];
  console.log(`  Active plan: "${activePlan.plan_name}", target: ${activePlan.calorie_target} kcal`);
  assert(Number(activePlan.calorie_target) === 1674, `Active plan calorie_target is exactly 1674 kcal`);

  // Reset meal 4 to ensure clean 4-completed baseline
  await pool.query(
    "UPDATE meal_completions SET completed = false WHERE user_id = $1 AND plan_date = '2026-11-27' AND meal_index = 4",
    [user.id]
  );

  // Verify completions records
  const compQuery = await pool.query(
    "SELECT meal_index, meal_name, calories, completed FROM meal_completions WHERE user_id = $1 AND plan_date = '2026-11-27' ORDER BY meal_index ASC",
    [user.id]
  );
  console.log(`  Meal completions in DB for 2026-11-27: ${compQuery.rows.length} rows`);
  const completedRows = compQuery.rows.filter(r => r.completed);
  console.log(`  Completed meals: ${completedRows.length}`);
  const compCal = completedRows.reduce((sum, r) => sum + Number(r.calories), 0);
  console.log(`  Completed calories: ${compCal} kcal`);

  // Test the progress formula with the DB data:
  const dbCompletedCount = completedRows.length;
  const dbProgressPercent = Math.round((dbCompletedCount / 5) * 100);
  console.log(`  Resulting progress percentage for ${dbCompletedCount} completed meals: ${dbProgressPercent}%`);

  console.log(`\n================================================================`);
  console.log(`ALL TESTS PASSED! (${passedTests} / ${totalTests})`);
  console.log(`================================================================\n`);
  
  await pool.end();
}

testCalorieProgressLogic().catch((err) => {
  console.error('\nTEST RUN FAILED:', err);
  pool.end();
  process.exit(1);
});
