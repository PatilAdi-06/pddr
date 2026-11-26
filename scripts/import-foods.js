const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Client } = require('pg');

const animal = /\b(chicken|mutton|lamb|meat|beef|pork|fish|prawn|shrimp|crab|lobster|seafood|egg|anda|anchovy|sardine|tuna|salmon|mackerel|goat|liver|bacon|ham|sausage|gelatin|gelatine|mayonnaise|mayo)\b/i;
const dairy = /\b(milk|curd|yogurt|yoghurt|paneer|cheese|ghee|butter|cream|whey|khoa|khoya|malai|lassi|buttermilk|ice cream|icecream|honey)\b/i;
const plant = /\b(oat|wheat|flour|rice|roti|chapati|paratha|dal|dhal|lentil|chickpea|chana|rajma|bean|pea|peanut|soy|tofu|tempeh|quinoa|millet|ragi|semolina|suji|rava|poha|corn|maize|barley|bread|pasta|noodle|cucumber|tomato|potato|spinach|mushroom|vegetable|fruit|banana|apple|mango|orange|guava|salad|sambar|rasam|idli|dosa|upma|khichdi|biryani|porridge|sprout|cabbage|carrot|beetroot|okra|brinjal|eggplant|cauliflower|broccoli|pumpkin|jackfruit|coconut|cashew|almond|walnut|sesame|chia|flax|sunflower|raisins?|date|fig)\b/i;

function csv(text) {
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

function dietaryType(name) {
  if (animal.test(name)) return 'Non-Vegetarian';
  if (dairy.test(name)) return 'Vegetarian';
  if (plant.test(name)) return 'Vegan';
  return null;
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const rows = csv(fs.readFileSync(path.join(__dirname, '..', 'data', 'Indian_Food_Nutrition_Processed.csv'), 'utf8'));
  let imported = 0;
  for (const row of rows) {
    const type = dietaryType(row[0]);
    if (!type) continue;
    const freeSugar = row[5] !== undefined && row[5] !== '' && Number.isFinite(Number(row[5])) ? Number(row[5]) : null;
    const sodiumMg = row[7] !== undefined && row[7] !== '' && Number.isFinite(Number(row[7])) ? Number(row[7]) : null;
    await client.query(`INSERT INTO foods (name, calories, carbohydrates, protein, fat, free_sugar_g, fibre, sodium_mg, dietary_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (name) DO UPDATE SET calories = EXCLUDED.calories, carbohydrates = EXCLUDED.carbohydrates,
      protein = EXCLUDED.protein, fat = EXCLUDED.fat, free_sugar_g = EXCLUDED.free_sugar_g,
      fibre = EXCLUDED.fibre, sodium_mg = EXCLUDED.sodium_mg, dietary_type = EXCLUDED.dietary_type`,
    [row[0].replace(/^"|"$/g, ''), Number(row[1]), Number(row[2]), Number(row[3]), Number(row[4]), freeSugar, Number(row[6]) || 0, sodiumMg, type]);
    imported++;
  }
  await client.end();
  console.log(`Imported ${imported} classified foods.`);
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
