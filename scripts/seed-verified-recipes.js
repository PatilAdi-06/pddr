const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Client } = require('pg');

const existingRecipesPath = path.join(__dirname, '..', 'pwa', 'data', 'recipes.json');
const existingRecipes = JSON.parse(fs.readFileSync(existingRecipesPath, 'utf8'));

function ing(name, quantity, baseGrams, unit) {
  return { name, quantity, baseGrams, unit };
}

function makeRecipe({
  foodName,
  dishTitle,
  category,
  dietaryType,
  prepTimeMinutes,
  cookTimeMinutes,
  cookingMethod,
  difficulty = 'Easy',
  servingSize = '1 portion',
  baseServingGrams = 100,
  cookingTips = '',
  ingredients,
  instructions,
  swaps = [],
  allergens = []
}) {
  const total = (prepTimeMinutes || 0) + (cookTimeMinutes || 0);
  const cookingTimeDesc = cookTimeMinutes > 0 ? `${cookTimeMinutes} minutes` : 'No cooking required';
  return {
    foodName,
    dishTitle: dishTitle || foodName,
    category,
    dietaryType,
    prepTimeMinutes,
    cookTimeMinutes,
    totalTimeMinutes: total,
    cookingTimeDesc,
    cookingMethod,
    difficulty,
    servingSize,
    baseServingGrams,
    cookingTips,
    ingredients,
    instructions,
    swaps,
    allergens
  };
}

const additionalRecipes = [
  // ================= BREAKFAST =================
  makeRecipe({
    foodName: 'Vegetable poha',
    dishTitle: 'Vegetable Poha',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    cookingMethod: 'Tempering & Steaming',
    servingSize: '1 bowl (180 g)',
    baseServingGrams: 100,
    cookingTips: 'Rinse thick poha gently in a colander and let it rest for 5 minutes so the grains stay fluffy and never turn mushy.',
    ingredients: [
      ing('Thick poha (flattened rice)', '100 g', 100, 'g'),
      ing('Onion (finely chopped)', '30 g', 30, 'g'),
      ing('Green peas', '25 g', 25, 'g'),
      ing('Carrot (finely diced)', '25 g', 25, 'g'),
      ing('Green chilli (slit)', '1 piece', 3, 'piece'),
      ing('Mustard seeds', '½ teaspoon', 2, 'tsp'),
      ing('Curry leaves', '6 leaves', 2, 'leaves'),
      ing('Turmeric powder', '¼ teaspoon', 1, 'tsp'),
      ing('Cold-pressed oil', '1 teaspoon', 5, 'tsp'),
      ing('Lemon juice', '1 teaspoon', 5, 'tsp'),
      ing('Fresh coriander leaves', '1 tablespoon', 5, 'tbsp'),
      ing('Salt', 'as required', 1, 'pinch')
    ],
    instructions: [
      'Wash the thick poha gently in a strainer under running water and drain excess water completely.',
      'Heat oil in a kadai or wide pan over medium heat and add mustard seeds; allow them to splutter.',
      'Add curry leaves and slit green chilli, then sauté chopped onion for 2 minutes until translucent.',
      'Add finely diced carrot and green peas; sauté for 4 minutes until tender.',
      'Stir in turmeric powder and salt, then add the drained poha and mix gently without breaking the flakes.',
      'Cover and cook on low heat for 2–3 minutes until heated through.',
      'Turn off heat, drizzle lemon juice, garnish with fresh coriander leaves, and serve warm.'
    ],
    swaps: ['Sprouted moong poha', 'Vegetable upma', 'Semolina upma (Suji/Rava upma)']
  }),
  makeRecipe({
    foodName: 'Poha',
    dishTitle: 'Kanda Poha (Classic Flattened Rice)',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 8,
    cookTimeMinutes: 10,
    cookingMethod: 'Tempering & Steaming',
    servingSize: '1 bowl (160 g)',
    cookingTips: 'Add a sprinkle of water while steaming on low flame if poha feels dry.',
    ingredients: [
      ing('Thick poha (flattened rice)', '90 g', 90, 'g'),
      ing('Onion (finely chopped)', '35 g', 35, 'g'),
      ing('Roasted peanuts', '15 g', 15, 'g'),
      ing('Green chilli (chopped)', '1 piece', 3, 'piece'),
      ing('Mustard seeds', '½ teaspoon', 2, 'tsp'),
      ing('Curry leaves', '6 leaves', 2, 'leaves'),
      ing('Turmeric powder', '¼ teaspoon', 1, 'tsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Lemon juice', '1 teaspoon', 5, 'tsp'),
      ing('Fresh coriander leaves', '1 tablespoon', 5, 'tbsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Rinse poha in a sieve and set aside for 5 minutes to soften evenly.',
      'Heat oil in a pan, add mustard seeds and let them crackle.',
      'Add curry leaves, green chilli, and chopped onion; sauté until soft.',
      'Add turmeric powder, salt, and drained poha; toss gently to coat.',
      'Cover and steam on low heat for 2 minutes.',
      'Fold in roasted peanuts, lemon juice, and fresh coriander before serving.'
    ],
    swaps: ['Vegetable poha', 'Sprouted moong poha'],
    allergens: ['Peanuts']
  }),
  makeRecipe({
    foodName: 'Poha with curd (Poha aur dahi)',
    dishTitle: 'Poha with Fresh Curd (Dahi Poha)',
    category: 'Breakfast',
    dietaryType: 'Vegetarian',
    prepTimeMinutes: 8,
    cookTimeMinutes: 0,
    cookingMethod: 'Soaking & Mixing',
    servingSize: '1 bowl (180 g)',
    cookingTips: 'Use room-temperature or lightly chilled fresh curd for a smooth, soothing texture.',
    ingredients: [
      ing('Thick poha (flattened rice)', '60 g', 60, 'g'),
      ing('Fresh curd (yogurt)', '120 g', 120, 'g'),
      ing('Roasted cumin powder', '¼ teaspoon', 1, 'tsp'),
      ing('Fresh coriander leaves', '1 tablespoon', 5, 'tbsp'),
      ing('Black salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Rinse poha twice in clean water and soak in a little water for 3 minutes until soft, then drain.',
      'Whisk fresh curd in a bowl until creamy and lump-free.',
      'Fold the softened poha into the whisked curd.',
      'Season with roasted cumin powder and black salt, garnish with coriander, and serve fresh.'
    ],
    swaps: ['Cucumber and yogurt salad (Kheere aur dahi ka salad)', 'Vegetable poha'],
    allergens: ['Dairy']
  }),
  makeRecipe({
    foodName: 'Sprouted moong poha',
    dishTitle: 'Sprouted Moong Poha',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    cookingMethod: 'Tempering & Steaming',
    servingSize: '1 bowl (190 g)',
    cookingTips: 'Steam or lightly sauté moong sprouts for 3 minutes before adding poha for easier digestion.',
    ingredients: [
      ing('Thick poha (flattened rice)', '75 g', 75, 'g'),
      ing('Sprouted green moong beans', '50 g', 50, 'g'),
      ing('Onion (chopped)', '30 g', 30, 'g'),
      ing('Green chilli', '1 piece', 3, 'piece'),
      ing('Mustard seeds', '½ teaspoon', 2, 'tsp'),
      ing('Turmeric powder', '¼ teaspoon', 1, 'tsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Lemon juice', '1 teaspoon', 5, 'tsp'),
      ing('Fresh coriander', '1 tablespoon', 5, 'tbsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Rinse poha in a strainer and drain well.',
      'Heat oil in a pan, crackle mustard seeds, and sauté onion and green chilli for 2 minutes.',
      'Add sprouted moong beans, turmeric, and salt; sauté for 3–4 minutes until tender.',
      'Add drained poha, mix gently, and steam covered on low heat for 2 minutes.',
      'Finish with lemon juice and fresh coriander.'
    ],
    swaps: ['Vegetable poha', 'Sprouted moong dal chat']
  }),
  makeRecipe({
    foodName: 'Vegetable upma',
    dishTitle: 'Vegetable Semolina Upma',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    cookingMethod: 'Dry Roasting & Simmering',
    servingSize: '1 bowl (180 g)',
    cookingTips: 'Dry roast semolina on low flame until aromatic without browning to prevent lumps when adding hot water.',
    ingredients: [
      ing('Semolina (Suji/Rava)', '75 g', 75, 'g'),
      ing('Onion (finely chopped)', '30 g', 30, 'g'),
      ing('Carrot (finely diced)', '25 g', 25, 'g'),
      ing('Green peas', '25 g', 25, 'g'),
      ing('Mustard seeds', '½ teaspoon', 2, 'tsp'),
      ing('Urad dal (for tempering)', '½ teaspoon', 2, 'tsp'),
      ing('Curry leaves', '6 leaves', 2, 'leaves'),
      ing('Green chilli (slit)', '1 piece', 3, 'piece'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Hot water', '200 ml', 200, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Dry roast semolina in a pan over low heat for 3–4 minutes until fragrant; transfer to a plate.',
      'Heat oil in the same pan; add mustard seeds and urad dal until golden and crackling.',
      'Add curry leaves, green chilli, and onion; sauté for 2 minutes.',
      'Add carrot and green peas and cook for 3 minutes.',
      'Pour hot water and salt; bring to a gentle boil.',
      'Slowly pour in roasted semolina while stirring continuously to avoid lumps.',
      'Cover and simmer on low heat for 3 minutes until fluffy; serve warm.'
    ],
    swaps: ['Semolina upma (Suji/Rava upma)', 'Vegetable poha', 'Sprouts upma']
  }),
  makeRecipe({
    foodName: 'Semolina upma (Suji/Rava upma)',
    dishTitle: 'Classic Semolina Upma (Suji/Rava Upma)',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 8,
    cookTimeMinutes: 12,
    cookingMethod: 'Dry Roasting & Simmering',
    servingSize: '1 bowl (160 g)',
    cookingTips: 'Use a 1:2.5 ratio of roasted suji to boiling water for soft, non-sticky upma.',
    ingredients: [
      ing('Semolina (Suji/Rava)', '80 g', 80, 'g'),
      ing('Onion (chopped)', '30 g', 30, 'g'),
      ing('Mustard seeds', '½ teaspoon', 2, 'tsp'),
      ing('Curry leaves', '6 leaves', 2, 'leaves'),
      ing('Green chilli', '1 piece', 3, 'piece'),
      ing('Ginger (finely grated)', '½ teaspoon', 2, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Hot water', '200 ml', 200, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Dry roast semolina on low flame for 4 minutes until aromatic and set aside.',
      'Heat oil, crackle mustard seeds, and sauté curry leaves, green chilli, ginger, and onion for 2 minutes.',
      'Add hot water and salt and bring to a boil.',
      'Add roasted semolina gradually while stirring continuously.',
      'Cover and cook on low flame for 2–3 minutes until water is absorbed; fluff and serve.'
    ],
    swaps: ['Vegetable upma', 'Vermicelli upma (Semiya/Seviyan upma)']
  }),
  makeRecipe({
    foodName: 'Bread upma',
    dishTitle: 'Spiced Whole Wheat Bread Upma',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 8,
    cookTimeMinutes: 10,
    cookingMethod: 'Sautéing',
    servingSize: '1 plate (150 g)',
    cookingTips: 'Toast bread cubes lightly before tossing in masala so they stay crisp outside and soft inside.',
    ingredients: [
      ing('Whole wheat bread slices', '4 slices', 100, 'slices'),
      ing('Onion (chopped)', '35 g', 35, 'g'),
      ing('Tomato (chopped)', '45 g', 45, 'g'),
      ing('Mustard seeds', '½ teaspoon', 2, 'tsp'),
      ing('Curry leaves', '5 leaves', 2, 'leaves'),
      ing('Turmeric powder', '¼ teaspoon', 1, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Fresh coriander', '1 tablespoon', 5, 'tbsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Cut bread slices into bite-sized cubes and lightly toast on a dry tawa for 2 minutes.',
      'Heat oil in a pan, crackle mustard seeds, and add curry leaves.',
      'Sauté chopped onion for 2 minutes, then add tomato, turmeric, and salt; cook until soft.',
      'Add bread cubes and toss well for 2–3 minutes so the masala coats evenly.',
      'Garnish with fresh coriander and serve hot.'
    ],
    swaps: ['Vegetable poha', 'Semolina upma (Suji/Rava upma)']
  }),
  makeRecipe({
    foodName: 'Sprouts upma',
    dishTitle: 'Moong Sprouts Upma',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 8,
    cookTimeMinutes: 14,
    cookingMethod: 'Simmering',
    servingSize: '1 bowl (180 g)',
    cookingTips: 'Simmer sprouts in the spiced water for 3 minutes before adding suji so they cook through.',
    ingredients: [
      ing('Semolina (Suji/Rava)', '65 g', 65, 'g'),
      ing('Sprouted green moong beans', '50 g', 50, 'g'),
      ing('Onion (chopped)', '25 g', 25, 'g'),
      ing('Mustard seeds', '½ teaspoon', 2, 'tsp'),
      ing('Green chilli', '1 piece', 3, 'piece'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Water', '180 ml', 180, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Dry roast semolina for 3–4 minutes on low heat and set aside.',
      'Heat oil, crackle mustard seeds, and sauté onion and green chilli.',
      'Add sprouts, water, and salt; simmer for 3 minutes.',
      'Stir in roasted semolina gradually, cover, and cook on low heat for 3 minutes.'
    ],
    swaps: ['Sprouted moong poha', 'Vegetable upma']
  }),
  makeRecipe({
    foodName: 'Vermicelli upma (Semiya/Seviyan upma)',
    dishTitle: 'Vegetable Vermicelli Upma (Semiya Upma)',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    cookingMethod: 'Roasting & Simmering',
    servingSize: '1 bowl (170 g)',
    cookingTips: 'Do not over-boil vermicelli; drain or steam until just tender so strands remain separate.',
    ingredients: [
      ing('Whole wheat vermicelli (Semiya)', '75 g', 75, 'g'),
      ing('Onion (sliced)', '25 g', 25, 'g'),
      ing('Carrot & green peas', '40 g', 40, 'g'),
      ing('Mustard seeds', '½ teaspoon', 2, 'tsp'),
      ing('Curry leaves', '6 leaves', 2, 'leaves'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Hot water', '160 ml', 160, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Dry roast vermicelli in a pan for 3 minutes until light golden; transfer out.',
      'Heat oil, crackle mustard seeds, add curry leaves, onion, carrot, and peas; sauté for 3 minutes.',
      'Add hot water and salt and bring to a boil.',
      'Add roasted vermicelli, stir gently, cover and cook on low heat for 4–5 minutes until absorbed.'
    ],
    swaps: ['Vegetable upma', 'Vegetable poha']
  }),
  makeRecipe({
    foodName: 'Idli',
    dishTitle: 'Steamed South Indian Idli',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    cookingMethod: 'Steaming',
    servingSize: '3 idlis (150 g)',
    cookingTips: 'Grease idli moulds lightly and let idlis rest 2 minutes after steaming before unmoulding cleanly.',
    ingredients: [
      ing('Idli batter (fermented rice & urad dal)', '150 g', 150, 'g'),
      ing('Cold-pressed oil (for greasing)', '½ teaspoon', 2, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Stir the fermented idli batter gently without deflating the air pockets; check salt.',
      'Lightly grease idli moulds and pour batter three-quarters full into each cavity.',
      'Bring water to a boil in an idli steamer and place the stand inside.',
      'Steam covered on medium-high heat for 10–12 minutes until a toothpick comes out clean.',
      'Rest for 2 minutes, unmould with a wet spoon, and serve warm with sambar or chutney.'
    ],
    swaps: ['Semolina idli (Suji/Rava idli)', 'Plain dosa']
  }),
  makeRecipe({
    foodName: 'Semolina idli (Suji/Rava idli)',
    dishTitle: 'Steamed Rava Idli (Suji Idli)',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 15,
    cookTimeMinutes: 12,
    cookingMethod: 'Steaming',
    servingSize: '3 idlis (150 g)',
    cookingTips: 'Rest the roasted rava batter for 10 minutes so the semolina absorbs liquid before steaming.',
    ingredients: [
      ing('Semolina (Suji/Rava)', '80 g', 80, 'g'),
      ing('Water or plant curd', '100 ml', 100, 'ml'),
      ing('Carrot (finely grated)', '20 g', 20, 'g'),
      ing('Mustard seeds', '½ teaspoon', 2, 'tsp'),
      ing('Curry leaves', '5 leaves', 2, 'leaves'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Fruit salt / baking soda', '¼ teaspoon', 1, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil in a pan, crackle mustard seeds and curry leaves, then roast semolina for 3 minutes.',
      'Cool slightly, mix with water/plant curd, grated carrot, and salt; rest 10 minutes.',
      'Stir in fruit salt gently just before steaming and spoon into greased idli moulds.',
      'Steam covered for 10–12 minutes until fluffy and cooked through.'
    ],
    swaps: ['Idli', 'Semolina upma (Suji/Rava upma)']
  }),
  makeRecipe({
    foodName: 'Plain dosa',
    dishTitle: 'Crisp Fermented Plain Dosa',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 5,
    cookTimeMinutes: 8,
    cookingMethod: 'Pan Roasting (Tawa)',
    servingSize: '2 dosas (120 g)',
    cookingTips: 'Spread batter on a medium-hot tawa starting from the center outward in smooth spirals.',
    ingredients: [
      ing('Fermented dosa batter (rice & urad dal)', '140 g', 140, 'g'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Whisk dosa batter to a smooth pouring consistency.',
      'Heat a cast-iron or non-stick tawa over medium heat and lightly brush with oil.',
      'Pour a ladleful of batter in the center and spread outward in thin circular motions.',
      'Drizzle a few drops of oil around the edges and cook until golden crisp underneath.',
      'Fold neatly and serve hot with sambar or chutney.'
    ],
    swaps: ['Masala dosa', 'Moong bean dosa (Pesarattu)', 'Idli']
  }),
  makeRecipe({
    foodName: 'Masala dosa',
    dishTitle: 'Masala Dosa with Potato Filling',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    cookingMethod: 'Boiling & Tawa Roasting',
    servingSize: '1 large dosa (180 g)',
    cookingTips: 'Keep the potato masala slightly moist so it spreads easily inside the crisp dosa.',
    ingredients: [
      ing('Dosa batter (fermented rice & urad dal)', '110 g', 110, 'g'),
      ing('Boiled potato (mashed)', '70 g', 70, 'g'),
      ing('Onion (sliced)', '25 g', 25, 'g'),
      ing('Mustard seeds', '½ teaspoon', 2, 'tsp'),
      ing('Curry leaves', '5 leaves', 2, 'leaves'),
      ing('Turmeric powder', '¼ teaspoon', 1, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat 1 tsp oil, crackle mustard seeds, add curry leaves and sliced onion; sauté 2 minutes.',
      'Add turmeric, salt, and mashed potato with 2 tbsp water; simmer 3 minutes to make potato masala.',
      'Heat a tawa, spread a ladleful of dosa batter into a thin disc, and drizzle remaining oil.',
      'Cook until crisp and golden, place potato masala in the center, fold, and serve hot.'
    ],
    swaps: ['Plain dosa', 'Onion tomato uttapam']
  }),
  makeRecipe({
    foodName: 'Moong bean dosa (Pesarattu)',
    dishTitle: 'Protein-Rich Green Moong Dosa (Pesarattu)',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    cookingMethod: 'Grinding & Tawa Roasting',
    servingSize: '2 dosas (140 g)',
    cookingTips: 'Soak whole green moong for 4–6 hours and grind with ginger and green chilli for instant batter.',
    ingredients: [
      ing('Whole green moong (soaked)', '80 g', 80, 'g'),
      ing('Ginger (chopped)', '1 teaspoon', 5, 'tsp'),
      ing('Green chilli', '1 piece', 3, 'piece'),
      ing('Onion (finely chopped)', '25 g', 25, 'g'),
      ing('Cumin seeds', '½ teaspoon', 2, 'tsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Grind soaked green moong with ginger, green chilli, cumin seeds, salt, and water into a smooth batter.',
      'Heat a tawa, pour a ladle of batter, and spread thinly in circles.',
      'Scatter chopped onion on top, drizzle oil around edges, and cook until crisp.',
      'Fold and serve warm with ginger or tomato chutney.'
    ],
    swaps: ['Moong dal stuffed cheela/chilla (Moong dal ka cheela/chilla)', 'Plain dosa']
  }),
  makeRecipe({
    foodName: 'Onion tomato uttapam',
    dishTitle: 'Onion Tomato Uttapam',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    cookingMethod: 'Tawa Cooking',
    servingSize: '2 uttapams (160 g)',
    cookingTips: 'Press chopped toppings gently with a spatula so they stick to the batter when flipped.',
    ingredients: [
      ing('Idli/dosa batter', '130 g', 130, 'g'),
      ing('Onion (finely chopped)', '30 g', 30, 'g'),
      ing('Tomato (finely chopped)', '30 g', 30, 'g'),
      ing('Green chilli (minced)', '1 piece', 3, 'piece'),
      ing('Fresh coriander', '1 tablespoon', 5, 'tbsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat a tawa and pour a ladleful of thick batter without spreading too thin.',
      'Immediately top with chopped onion, tomato, green chilli, and coriander.',
      'Press toppings lightly, drizzle oil around edges, and cover for 2 minutes.',
      'Flip and cook the other side for 1–2 minutes until golden; serve warm.'
    ],
    swaps: ['Vegetable pancake', 'Moong bean dosa (Pesarattu)']
  }),
  makeRecipe({
    foodName: 'Gram flour chilla/cheela (Besan chilla/cheela)',
    dishTitle: 'Savory Besan Chilla (Gram Flour Pancake)',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 8,
    cookTimeMinutes: 10,
    cookingMethod: 'Pan Roasting',
    servingSize: '2 chillas (140 g)',
    cookingTips: 'Rest besan batter for 10 minutes before cooking for soft, pliable chillas.',
    ingredients: [
      ing('Besan (gram flour)', '60 g', 60, 'g'),
      ing('Onion (finely chopped)', '25 g', 25, 'g'),
      ing('Tomato (finely chopped)', '25 g', 25, 'g'),
      ing('Ajwain (carom seeds)', '¼ teaspoon', 1, 'tsp'),
      ing('Turmeric powder', '¼ teaspoon', 1, 'tsp'),
      ing('Fresh coriander', '1 tablespoon', 5, 'tbsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Water', '90 ml', 90, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Whisk besan, turmeric, ajwain, salt, and water into a smooth lump-free batter.',
      'Fold in chopped onion, tomato, and fresh coriander.',
      'Heat a greased tawa, pour half the batter, and spread into a thin circle.',
      'Cook on medium heat for 2 minutes per side until lightly browned; repeat and serve hot.'
    ],
    swaps: ['Gram flour and semolina chilla/cheela/savory pancake (Besan suji chilla/cheela)', 'Moong dal stuffed cheela/chilla (Moong dal ka cheela/chilla)']
  }),
  makeRecipe({
    foodName: 'Gram flour and semolina chilla/cheela/savory pancake (Besan suji chilla/cheela)',
    dishTitle: 'Besan Suji Chilla (Savory Pancake)',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    cookingMethod: 'Pan Roasting',
    servingSize: '2 chillas (150 g)',
    cookingTips: 'Adding semolina gives crisp edges while gram flour keeps the center protein-rich.',
    ingredients: [
      ing('Besan (gram flour)', '45 g', 45, 'g'),
      ing('Semolina (Suji/Rava)', '25 g', 25, 'g'),
      ing('Grated carrot & chopped spinach', '35 g', 35, 'g'),
      ing('Ajwain & turmeric', '½ teaspoon', 2, 'tsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Water', '100 ml', 100, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Mix besan, semolina, spices, salt, and water; rest 10 minutes.',
      'Stir in grated carrot and chopped spinach.',
      'Spread onto a hot lightly greased tawa and cook 2–3 minutes per side until crisp and golden.'
    ],
    swaps: ['Gram flour chilla/cheela (Besan chilla/cheela)', 'Vegetable pancake']
  }),
  makeRecipe({
    foodName: 'Moong dal stuffed cheela/chilla (Moong dal ka cheela/chilla)',
    dishTitle: 'Moong Dal Chilla',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    cookingMethod: 'Grinding & Pan Roasting',
    servingSize: '2 chillas (150 g)',
    cookingTips: 'Grind soaked yellow moong dal with ginger and minimal water for a smooth spreadable batter.',
    ingredients: [
      ing('Yellow split moong dal (soaked)', '70 g', 70, 'g'),
      ing('Onion (finely chopped)', '25 g', 25, 'g'),
      ing('Tomato (finely chopped)', '25 g', 25, 'g'),
      ing('Ginger & green chilli', '1 teaspoon', 5, 'tsp'),
      ing('Cumin seeds', '½ teaspoon', 2, 'tsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Blend soaked moong dal with ginger, green chilli, cumin, and water until smooth.',
      'Heat a non-stick tawa and spread a ladleful of batter into a thin crepe.',
      'Top with onion and tomato, drizzle oil, and cook 2 minutes per side until golden.'
    ],
    swaps: ['Moong bean dosa (Pesarattu)', 'Gram flour chilla/cheela (Besan chilla/cheela)']
  }),
  makeRecipe({
    foodName: 'Paneer stuffed cheela/chilla',
    dishTitle: 'Paneer Stuffed Besan Chilla',
    category: 'Breakfast',
    dietaryType: 'Vegetarian',
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    cookingMethod: 'Pan Roasting',
    servingSize: '2 stuffed chillas (170 g)',
    cookingTips: 'Season grated paneer stuffing just before filling so it stays crumbly and does not release water.',
    ingredients: [
      ing('Besan (gram flour)', '55 g', 55, 'g'),
      ing('Paneer (crumbled)', '60 g', 60, 'g'),
      ing('Onion & coriander (chopped)', '25 g', 25, 'g'),
      ing('Turmeric & roasted cumin powder', '½ teaspoon', 2, 'tsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Water', '80 ml', 80, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Whisk besan, turmeric, salt, and water into a smooth batter.',
      'Toss crumbled paneer with chopped onion, coriander, cumin powder, and a pinch of salt.',
      'Spread batter on a hot tawa, cook 2 minutes, flip, and cook 1 minute.',
      'Place paneer stuffing in the center, fold over, and serve warm.'
    ],
    swaps: ['Gram flour chilla/cheela (Besan chilla/cheela)', 'Paneer parantha/paratha'],
    allergens: ['Dairy']
  }),
  makeRecipe({
    foodName: 'Tomato and cucumber sandwich (Tamatar aur kheere ka sandwich)',
    dishTitle: 'Tomato and Cucumber Sandwich',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 8,
    cookTimeMinutes: 0,
    cookingMethod: 'Assembling',
    servingSize: '1 sandwich (130 g)',
    cookingTips: 'Pat sliced cucumber and tomato dry with a clean towel so the bread stays crisp.',
    ingredients: [
      ing('Whole wheat bread slices', '2 slices', 60, 'slices'),
      ing('Ripe tomato (thinly sliced)', '40 g', 40, 'g'),
      ing('Cucumber (thinly sliced)', '40 g', 40, 'g'),
      ing('Mint coriander green chutney (vegan)', '1 tablespoon', 15, 'tbsp'),
      ing('Black pepper & chaat masala', '1 pinch', 1, 'pinch')
    ],
    instructions: [
      'Spread mint coriander chutney evenly on two whole wheat bread slices.',
      'Layer thinly sliced cucumber and ripe tomato over one slice.',
      'Sprinkle black pepper and chaat masala.',
      'Cover with the second slice, cut diagonally, and serve fresh.'
    ],
    swaps: ['Cucumber sandwich (Kheere ka sandwich)', 'Tomato sandwich (grilled)']
  }),
  makeRecipe({
    foodName: 'Tomato sandwich (grilled)',
    dishTitle: 'Grilled Herb Tomato Sandwich',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 5,
    cookTimeMinutes: 6,
    cookingMethod: 'Grilling',
    servingSize: '1 sandwich (120 g)',
    cookingTips: 'Use firm ripe tomatoes and grill on medium heat for crisp golden bread.',
    ingredients: [
      ing('Whole wheat bread slices', '2 slices', 60, 'slices'),
      ing('Firm ripe tomato (sliced)', '55 g', 55, 'g'),
      ing('Olive oil', '1 teaspoon', 5, 'tsp'),
      ing('Oregano & black pepper', '½ teaspoon', 2, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Layer sliced tomatoes on a bread slice and season with oregano, pepper, and salt.',
      'Close the sandwich and brush the outer surfaces lightly with olive oil.',
      'Grill in a sandwich maker or pan for 3 minutes per side until golden and crisp.'
    ],
    swaps: ['Tomato and cucumber sandwich (Tamatar aur kheere ka sandwich)', 'Sesame toast']
  }),
  makeRecipe({
    foodName: 'Sweet wheat porridge (Sweet dalia)',
    dishTitle: 'Sweet Broken Wheat Porridge (Meetha Daliya)',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 5,
    cookTimeMinutes: 15,
    cookingMethod: 'Simmering',
    servingSize: '1 bowl (180 g)',
    cookingTips: 'Roast broken wheat lightly before simmering for a nutty aroma.',
    ingredients: [
      ing('Broken wheat (Daliya)', '50 g', 50, 'g'),
      ing('Water or almond milk', '200 ml', 200, 'ml'),
      ing('Jaggery powder', '1 tablespoon', 12, 'tbsp'),
      ing('Cardamom powder', '¼ teaspoon', 1, 'tsp'),
      ing('Chopped almonds', '6 g', 6, 'g')
    ],
    instructions: [
      'Dry roast broken wheat in a saucepan for 3 minutes until fragrant.',
      'Add water or almond milk and simmer for 12 minutes until grains are soft.',
      'Stir in jaggery powder and cardamom powder until dissolved.',
      'Top with chopped almonds and serve warm.'
    ],
    swaps: ['Cracked wheat porridge (Meetha daliya)', 'Oatmeal Porridge'],
    allergens: ['Tree nuts']
  }),
  makeRecipe({
    foodName: 'Vermicelli porridge (Semiya/Seviyan porridge)',
    dishTitle: 'Light Semiya Porridge',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 5,
    cookTimeMinutes: 12,
    cookingMethod: 'Simmering',
    servingSize: '1 bowl (180 g)',
    cookingTips: 'Keep simmer gentle after adding jaggery so plant milk does not split.',
    ingredients: [
      ing('Whole wheat vermicelli (Semiya)', '45 g', 45, 'g'),
      ing('Water or soy milk', '200 ml', 200, 'ml'),
      ing('Jaggery or date paste', '1 tablespoon', 12, 'tbsp'),
      ing('Cardamom powder', '¼ teaspoon', 1, 'tsp')
    ],
    instructions: [
      'Dry roast vermicelli for 2–3 minutes until lightly golden.',
      'Add water or soy milk and cook for 7–8 minutes until tender.',
      'Stir in jaggery and cardamom powder, simmer 1 minute, and serve warm.'
    ],
    swaps: ['Sweet wheat porridge (Sweet dalia)', 'Semolina porridge (Suji/Rava daliya)']
  }),
  makeRecipe({
    foodName: 'Indian style egg bhujia (Anda bhujia (Indian style))',
    dishTitle: 'Anda Bhurji (Indian Style Spiced Scrambled Eggs)',
    category: 'Breakfast',
    dietaryType: 'Non-Vegetarian',
    prepTimeMinutes: 8,
    cookTimeMinutes: 8,
    cookingMethod: 'Pan Scrambling',
    servingSize: '2 eggs (140 g)',
    cookingTips: 'Remove from heat while eggs are just set and moist; residual heat finishes cooking.',
    ingredients: [
      ing('Whole eggs', '2 eggs', 100, 'eggs'),
      ing('Onion (finely chopped)', '30 g', 30, 'g'),
      ing('Tomato (finely chopped)', '30 g', 30, 'g'),
      ing('Green chilli (minced)', '1 piece', 3, 'piece'),
      ing('Turmeric powder', '¼ teaspoon', 1, 'tsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Fresh coriander', '1 tablespoon', 5, 'tbsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil in a pan and sauté chopped onion and green chilli for 2 minutes.',
      'Add tomato, turmeric, and salt; cook for 2 minutes until soft.',
      'Crack eggs directly into the pan or pour beaten eggs in and stir gently on medium-low heat.',
      'Scramble until soft curds form, garnish with coriander, and serve hot.'
    ],
    swaps: ['Scrambled egg (Ande ki bhurji)', 'Stuffed egg omelette/omlet'],
    allergens: ['Eggs']
  }),
  makeRecipe({
    foodName: 'Cheese and mushroom omelette/omlet',
    dishTitle: 'Cheese and Mushroom Omelette',
    category: 'Breakfast',
    dietaryType: 'Vegetarian',
    prepTimeMinutes: 8,
    cookTimeMinutes: 8,
    cookingMethod: 'Pan Cooking',
    servingSize: '1 omelette (150 g)',
    cookingTips: 'Sauté mushrooms first so excess moisture evaporates before adding cheese.',
    ingredients: [
      ing('Button mushrooms (sliced)', '50 g', 50, 'g'),
      ing('Grated cheese', '25 g', 25, 'g'),
      ing('Besan or eggless omelette batter / whole eggs', '70 g', 70, 'g'),
      ing('Olive oil or butter', '1 teaspoon', 5, 'tsp'),
      ing('Black pepper & salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Sauté sliced mushrooms in a little oil for 3 minutes until golden and dry.',
      'Pour whisked batter or eggs over the mushrooms on medium-low heat.',
      'Sprinkle grated cheese, black pepper, and salt when nearly set.',
      'Fold in half, cook 1 minute until cheese melts, and serve warm.'
    ],
    swaps: ['Stuffed egg omelette/omlet', 'Cheese toast'],
    allergens: ['Dairy']
  }),
  makeRecipe({
    foodName: 'Cornflakes with milk',
    dishTitle: 'Cornflakes with Warm or Chilled Milk',
    category: 'Breakfast',
    dietaryType: 'Vegetarian',
    prepTimeMinutes: 3,
    cookTimeMinutes: 0,
    cookingMethod: 'Mixing',
    servingSize: '1 bowl (230 g)',
    cookingTips: 'Pour milk just before eating so cornflakes stay crunchy.',
    ingredients: [
      ing('Unsweetened cornflakes', '40 g', 40, 'g'),
      ing('Toned milk', '200 ml', 200, 'ml'),
      ing('Sliced banana or apple (optional)', '40 g', 40, 'g')
    ],
    instructions: [
      'Place cornflakes in a breakfast bowl.',
      'Pour toned milk over the cornflakes.',
      'Top with fresh sliced fruit if desired and serve immediately.'
    ],
    swaps: ['Oatmeal Porridge', 'Cracked wheat porridge (Meetha daliya)'],
    allergens: ['Dairy']
  }),

  // ================= SNACKS, SALADS, SOUPS & RAITAS =================
  makeRecipe({
    foodName: 'Fruit salad (Phalon ka salaad)',
    dishTitle: 'Fresh Seasonal Fruit Salad',
    category: 'Snack',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    cookingMethod: 'Chopping & Tossing',
    servingSize: '1 bowl (150 g)',
    cookingTips: 'Toss apples and bananas in fresh lemon juice right after cutting to prevent browning.',
    ingredients: [
      ing('Apple (cubed)', '50 g', 50, 'g'),
      ing('Banana (sliced)', '50 g', 50, 'g'),
      ing('Papaya or pomegranate', '50 g', 50, 'g'),
      ing('Lemon juice', '1 teaspoon', 5, 'tsp'),
      ing('Chaat masala', '¼ teaspoon', 1, 'tsp')
    ],
    instructions: [
      'Wash, peel, and cube all fresh fruits into bite-sized pieces.',
      'Place fruits in a chilled bowl and drizzle with fresh lemon juice.',
      'Sprinkle chaat masala lightly, toss gently, and serve fresh.'
    ],
    swaps: ['Stewed apple', 'Sprouted moong dal chat']
  }),
  makeRecipe({
    foodName: 'Sprouted moong dal chat',
    dishTitle: 'Sprouted Moong Dal Chaat',
    category: 'Snack',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    cookingMethod: 'Mixing',
    servingSize: '1 bowl (150 g)',
    cookingTips: 'Steam sprouts for 3 minutes if you prefer a softer texture.',
    ingredients: [
      ing('Sprouted green moong beans', '80 g', 80, 'g'),
      ing('Tomato (finely diced)', '30 g', 30, 'g'),
      ing('Onion (finely diced)', '25 g', 25, 'g'),
      ing('Cucumber (diced)', '25 g', 25, 'g'),
      ing('Lemon juice', '1 tablespoon', 15, 'tbsp'),
      ing('Roasted cumin powder & black salt', '½ teaspoon', 2, 'tsp'),
      ing('Fresh coriander', '1 tablespoon', 5, 'tbsp')
    ],
    instructions: [
      'Rinse sprouted green moong beans thoroughly and drain.',
      'Combine sprouts, diced tomato, onion, and cucumber in a mixing bowl.',
      'Add lemon juice, roasted cumin powder, black salt, and fresh coriander.',
      'Toss well and serve immediately.'
    ],
    swaps: ['Sprouted moong salad', 'Spicy corn chaat']
  }),
  makeRecipe({
    foodName: 'Spicy corn chaat',
    dishTitle: 'Steamed Spicy Sweet Corn Chaat',
    category: 'Snack',
    dietaryType: 'Vegan',
    prepTimeMinutes: 5,
    cookTimeMinutes: 6,
    cookingMethod: 'Boiling & Tossing',
    servingSize: '1 bowl (140 g)',
    cookingTips: 'Toss spices with hot boiled corn kernels so flavors coat evenly.',
    ingredients: [
      ing('Sweet corn kernels', '100 g', 100, 'g'),
      ing('Onion (finely chopped)', '20 g', 20, 'g'),
      ing('Tomato (finely chopped)', '20 g', 20, 'g'),
      ing('Lemon juice', '1 teaspoon', 5, 'tsp'),
      ing('Chaat masala & red chilli powder', '½ teaspoon', 2, 'tsp'),
      ing('Fresh coriander', '1 tablespoon', 5, 'tbsp')
    ],
    instructions: [
      'Boil or steam sweet corn kernels for 5 minutes until plump and tender; drain well.',
      'Transfer warm corn to a bowl and add chopped onion, tomato, chaat masala, and chilli powder.',
      'Drizzle lemon juice, garnish with coriander, toss, and serve warm.'
    ],
    swaps: ['Sprouted moong dal chat', 'Mixed pulse and vegetable salad']
  }),
  makeRecipe({
    foodName: 'Stewed apple',
    dishTitle: 'Warm Cinnamon Stewed Apples',
    category: 'Snack',
    dietaryType: 'Vegan',
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    cookingMethod: 'Simmering',
    servingSize: '1 bowl (140 g)',
    cookingTips: 'Simmer covered on low flame so apples soften in their natural juices.',
    ingredients: [
      ing('Crisp apples (peeled & sliced)', '140 g', 140, 'g'),
      ing('Water', '40 ml', 40, 'ml'),
      ing('Cinnamon powder', '¼ teaspoon', 1, 'tsp'),
      ing('Lemon juice', '½ teaspoon', 2, 'tsp')
    ],
    instructions: [
      'Core, peel, and slice apples evenly.',
      'Place apples, water, and cinnamon in a small saucepan.',
      'Cover and simmer on low heat for 8–10 minutes until tender.',
      'Finish with a splash of lemon juice and serve warm.'
    ],
    swaps: ['Fruit salad (Phalon ka salaad)', 'Apple oats chia seed smoothie']
  }),
  makeRecipe({
    foodName: 'Apple oats chia seed smoothie',
    dishTitle: 'Apple Oats Chia Seed Smoothie',
    category: 'Snack',
    dietaryType: 'Vegan',
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    cookingMethod: 'Blending',
    servingSize: '1 glass (250 ml)',
    cookingTips: 'Soak rolled oats and chia seeds in water or plant milk for 10 minutes for a creamier blend.',
    ingredients: [
      ing('Apple (cored & chopped)', '100 g', 100, 'g'),
      ing('Rolled oats', '25 g', 25, 'g'),
      ing('Chia seeds', '1 teaspoon (5 g)', 5, 'g'),
      ing('Water or almond milk', '180 ml', 180, 'ml'),
      ing('Cinnamon powder', '¼ teaspoon', 1, 'tsp')
    ],
    instructions: [
      'Add chopped apple, rolled oats, chia seeds, cinnamon, and water/almond milk into a blender.',
      'Blend on high speed for 45 seconds until completely smooth.',
      'Pour into a chilled glass and serve immediately.'
    ],
    swaps: ['Oatmeal Porridge', 'Fruit salad (Phalon ka salaad)'],
    allergens: ['Tree nuts']
  }),
  makeRecipe({
    foodName: 'Clear tomato soup (Tamatar ka soup)',
    dishTitle: 'Clear Spiced Tomato Soup',
    category: 'Soup',
    dietaryType: 'Vegan',
    prepTimeMinutes: 8,
    cookTimeMinutes: 15,
    cookingMethod: 'Boiling & Straining',
    servingSize: '1 bowl (220 ml)',
    cookingTips: 'Use ripe red tomatoes for natural sweetness without added sugar.',
    ingredients: [
      ing('Ripe tomatoes (quartered)', '180 g', 180, 'g'),
      ing('Garlic (crushed)', '2 cloves', 6, 'cloves'),
      ing('Black pepper (crushed)', '¼ teaspoon', 1, 'tsp'),
      ing('Water', '150 ml', 150, 'ml'),
      ing('Fresh coriander leaves', '1 tablespoon', 5, 'tbsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Boil tomatoes and crushed garlic with water for 10 minutes until skins peel easily.',
      'Blend briefly and strain through a fine mesh strainer to obtain a clear broth.',
      'Return to heat, season with salt and crushed black pepper, and simmer 3 minutes.',
      'Garnish with coriander leaves and serve hot.'
    ],
    swaps: ['Vegetable soup', 'Spinach soup (Palak ka soup)']
  }),
  makeRecipe({
    foodName: 'Spinach soup (Palak ka soup)',
    dishTitle: 'Warm Garlic Spinach Soup (Palak Soup)',
    category: 'Soup',
    dietaryType: 'Vegan',
    prepTimeMinutes: 8,
    cookTimeMinutes: 12,
    cookingMethod: 'Sautéing & Pureeing',
    servingSize: '1 bowl (220 ml)',
    cookingTips: 'Do not over-boil spinach so the soup keeps its vibrant green color and nutrients.',
    ingredients: [
      ing('Fresh spinach leaves (Palak)', '120 g', 120, 'g'),
      ing('Onion (chopped)', '25 g', 25, 'g'),
      ing('Garlic (chopped)', '2 cloves', 6, 'cloves'),
      ing('Olive oil', '1 teaspoon', 5, 'tsp'),
      ing('Water or vegetable stock', '150 ml', 150, 'ml'),
      ing('Black pepper & salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat olive oil in a pot and sauté garlic and onion for 2 minutes.',
      'Add washed spinach leaves and wilt for 2 minutes.',
      'Pour in water, simmer 3 minutes, then blend smooth.',
      'Return to pan, season with black pepper and salt, heat through, and serve.'
    ],
    swaps: ['Vegetable soup', 'Clear tomato soup (Tamatar ka soup)']
  }),
  makeRecipe({
    foodName: 'Vegetable soup',
    dishTitle: 'Light Mixed Vegetable Soup',
    category: 'Soup',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    cookingMethod: 'Simmering',
    servingSize: '1 bowl (220 ml)',
    cookingTips: 'Cut vegetables into small uniform dice so they cook evenly in 10 minutes.',
    ingredients: [
      ing('Carrot, beans & cabbage (finely diced)', '100 g', 100, 'g'),
      ing('Sweet corn kernels', '25 g', 25, 'g'),
      ing('Garlic & ginger (minced)', '1 teaspoon', 5, 'tsp'),
      ing('Olive oil', '1 teaspoon', 5, 'tsp'),
      ing('Water', '220 ml', 220, 'ml'),
      ing('Black pepper & salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil in a saucepan and sauté minced ginger and garlic for 30 seconds.',
      'Add diced vegetables and corn; toss for 2 minutes.',
      'Pour water and simmer covered for 10 minutes until vegetables are tender.',
      'Season with black pepper and salt and serve hot.'
    ],
    swaps: ['Clear tomato soup (Tamatar ka soup)', 'Sweet corn soup']
  }),
  makeRecipe({
    foodName: 'Sweet corn soup',
    dishTitle: 'Homestyle Sweet Corn Vegetable Soup',
    category: 'Soup',
    dietaryType: 'Vegan',
    prepTimeMinutes: 8,
    cookTimeMinutes: 12,
    cookingMethod: 'Simmering',
    servingSize: '1 bowl (220 ml)',
    cookingTips: 'Blend half the corn into a creamy base and leave the other half whole for texture.',
    ingredients: [
      ing('Sweet corn kernels', '80 g', 80, 'g'),
      ing('Carrot & French beans (finely diced)', '30 g', 30, 'g'),
      ing('Cornstarch (mixed in 2 tbsp water)', '1 teaspoon', 5, 'tsp'),
      ing('Water', '200 ml', 200, 'ml'),
      ing('White pepper & salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Coarsely blend half of the sweet corn with 3 tbsp water.',
      'Bring water to a boil in a pan, add blended corn, whole corn, and diced vegetables; simmer 6 minutes.',
      'Stir in dissolved cornstarch and simmer 2 minutes until lightly thickened.',
      'Season with white pepper and salt and serve hot.'
    ],
    swaps: ['Vegetable soup', 'Chicken sweet corn soup']
  }),
  makeRecipe({
    foodName: 'Lentil soup',
    dishTitle: 'Spiced Red & Yellow Lentil Soup',
    category: 'Soup',
    dietaryType: 'Vegan',
    prepTimeMinutes: 8,
    cookTimeMinutes: 18,
    cookingMethod: 'Simmering',
    servingSize: '1 bowl (220 ml)',
    cookingTips: 'A squeeze of lemon at the end brightens the earthy flavor of lentils.',
    ingredients: [
      ing('Red lentils (Masoor dal)', '50 g', 50, 'g'),
      ing('Onion & carrot (chopped)', '40 g', 40, 'g'),
      ing('Garlic (minced)', '2 cloves', 6, 'cloves'),
      ing('Cumin powder & turmeric', '½ teaspoon', 2, 'tsp'),
      ing('Olive oil', '1 teaspoon', 5, 'tsp'),
      ing('Water', '250 ml', 250, 'ml'),
      ing('Lemon juice & salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil, sauté onion, carrot, and garlic for 3 minutes.',
      'Add rinsed lentils, cumin, turmeric, water, and salt; simmer 15 minutes until soft.',
      'Blend partially or fully until creamy, finish with lemon juice, and serve warm.'
    ],
    swaps: ['Moong dal', 'Vegetable soup']
  }),
  makeRecipe({
    foodName: 'Pumpkin soup',
    dishTitle: 'Roasted Garlic Pumpkin Soup',
    category: 'Soup',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    cookingMethod: 'Simmering & Pureeing',
    servingSize: '1 bowl (220 ml)',
    cookingTips: 'Simmer pumpkin until fork-tender before pureeing for a velvety texture without cream.',
    ingredients: [
      ing('Yellow pumpkin (peeled & cubed)', '140 g', 140, 'g'),
      ing('Onion (chopped)', '25 g', 25, 'g'),
      ing('Garlic (chopped)', '2 cloves', 6, 'cloves'),
      ing('Olive oil', '1 teaspoon', 5, 'tsp'),
      ing('Water', '180 ml', 180, 'ml'),
      ing('Black pepper & salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat olive oil and sauté onion and garlic for 2 minutes.',
      'Add cubed pumpkin, water, and salt; simmer covered for 12 minutes until soft.',
      'Blend until silky smooth, season with black pepper, and serve warm.'
    ],
    swaps: ['Clear tomato soup (Tamatar ka soup)', 'Vegetable soup']
  }),
  makeRecipe({
    foodName: 'Gram flour and semolina dhokla (Besan suji dhokla)',
    dishTitle: 'Steamed Besan Suji Dhokla',
    category: 'Snack',
    dietaryType: 'Vegan',
    prepTimeMinutes: 12,
    cookTimeMinutes: 15,
    cookingMethod: 'Steaming & Tempering',
    servingSize: '3 pieces (140 g)',
    cookingTips: 'Steam immediately after whisking in fruit salt so the dhokla rises light and spongy.',
    ingredients: [
      ing('Besan (gram flour)', '50 g', 50, 'g'),
      ing('Semolina (Suji/Rava)', '25 g', 25, 'g'),
      ing('Ginger-green chilli paste', '1 teaspoon', 5, 'tsp'),
      ing('Mustard seeds & curry leaves', '½ teaspoon', 2, 'tsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Water', '100 ml', 100, 'ml'),
      ing('Lemon juice & fruit salt', '1 teaspoon', 5, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Whisk besan, semolina, ginger-chilli paste, lemon juice, salt, and water into a smooth batter; rest 10 minutes.',
      'Stir in fruit salt gently until frothy and pour into a greased steaming tin.',
      'Steam covered for 12–15 minutes until a toothpick comes out clean.',
      'Prepare tempering with heated oil, mustard seeds, and curry leaves; spoon over cut dhokla squares and serve.'
    ],
    swaps: ['Gram flour chilla/cheela (Besan chilla/cheela)', 'Idli']
  }),
  makeRecipe({
    foodName: 'Carrot and spinach raita (Gajar aur palak ka raita)',
    dishTitle: 'Carrot and Spinach Raita',
    category: 'Snack',
    dietaryType: 'Vegetarian',
    prepTimeMinutes: 10,
    cookTimeMinutes: 3,
    cookingMethod: 'Blanching & Mixing',
    servingSize: '1 bowl (150 g)',
    cookingTips: 'Squeeze excess water from blanched spinach so the raita stays thick and creamy.',
    ingredients: [
      ing('Fresh plain yogurt (curd)', '110 g', 110, 'g'),
      ing('Carrot (finely grated)', '30 g', 30, 'g'),
      ing('Spinach leaves (blanched & chopped)', '30 g', 30, 'g'),
      ing('Roasted cumin powder', '½ teaspoon', 2, 'tsp'),
      ing('Black salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Blanch spinach leaves in hot water for 2 minutes, cool, squeeze dry, and finely chop.',
      'Whisk fresh yogurt until smooth.',
      'Fold in grated carrot, chopped spinach, roasted cumin powder, and black salt.',
      'Serve chilled.'
    ],
    swaps: ['Cucumber raita (Kheere ka raita)', 'Tomato onion raita (Tamatar aur pyaaz ka raita)'],
    allergens: ['Dairy']
  }),

  // ================= LUNCH & DINNER: ROTIS, RICE, KHICHDI & DALS =================
  makeRecipe({
    foodName: 'Chapati/Roti',
    dishTitle: 'Whole Wheat Phulka / Chapati',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    cookingMethod: 'Tawa Roasting',
    servingSize: '2 rotis (80 g)',
    cookingTips: 'Rest kneaded dough covered for 15 minutes so chapatis stay soft for hours.',
    ingredients: [
      ing('Whole wheat flour (Atta)', '70 g', 70, 'g'),
      ing('Warm water', '45 ml', 45, 'ml'),
      ing('Salt', 'a pinch', 1, 'pinch')
    ],
    instructions: [
      'Knead whole wheat flour with warm water and salt for 5 minutes into a smooth, pliable dough; rest 15 minutes.',
      'Divide into 2 equal balls and roll each into a thin 6-inch circle using dry flour.',
      'Place on a hot tawa; when small bubbles appear, flip and cook the second side.',
      'Press gently with a clean folded cloth or puff directly over flame until soft spots appear; serve warm.'
    ],
    swaps: ['Plain parantha/paratha', 'Boiled rice (Uble chawal)']
  }),
  makeRecipe({
    foodName: 'Plain parantha/paratha',
    dishTitle: 'Layered Whole Wheat Paratha',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 12,
    cookTimeMinutes: 10,
    cookingMethod: 'Pan Roasting',
    servingSize: '1 paratha (80 g)',
    cookingTips: 'Fold rolled dough with a light brush of oil to create flaky layers.',
    ingredients: [
      ing('Whole wheat flour (Atta)', '65 g', 65, 'g'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Water', '40 ml', 40, 'ml'),
      ing('Salt', 'a pinch', 1, 'pinch')
    ],
    instructions: [
      'Knead whole wheat flour, salt, and water into a soft dough; rest 10 minutes.',
      'Roll into a disc, brush with oil, fold into a triangle, and roll again evenly.',
      'Cook on a hot tawa for 2 minutes per side with a light brush of oil until golden brown.'
    ],
    swaps: ['Chapati/Roti', 'Methi parantha/paratha']
  }),
  makeRecipe({
    foodName: 'Potato parantha/paratha (Aloo ka parantha/paratha)',
    dishTitle: 'Stuffed Aloo Paratha',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 15,
    cookTimeMinutes: 12,
    cookingMethod: 'Stuffing & Tawa Roasting',
    servingSize: '1 stuffed paratha (140 g)',
    cookingTips: 'Cool boiled potatoes completely before mashing so the stuffing stays dry and easy to roll.',
    ingredients: [
      ing('Whole wheat flour (Atta)', '60 g', 60, 'g'),
      ing('Boiled potato (mashed)', '70 g', 70, 'g'),
      ing('Green chilli & fresh coriander', '1 tablespoon', 8, 'tbsp'),
      ing('Cumin powder & amchur', '½ teaspoon', 2, 'tsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Knead whole wheat flour with water and salt into a soft dough.',
      'Mix mashed potato with green chilli, coriander, cumin powder, amchur, and salt.',
      'Stuff spiced potato filling inside a dough ball, seal edges, and roll gently.',
      'Roast on a hot tawa with a brush of oil for 2–3 minutes per side until crisp and golden.'
    ],
    swaps: ['Paneer parantha/paratha', 'Cauliflower parantha/paratha (Phoolgobhi ka parantha/paratha)']
  }),
  makeRecipe({
    foodName: 'Cauliflower parantha/paratha (Phoolgobhi ka parantha/paratha)',
    dishTitle: 'Gobhi Paratha (Cauliflower Stuffed Flatbread)',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 15,
    cookTimeMinutes: 12,
    cookingMethod: 'Stuffing & Tawa Roasting',
    servingSize: '1 paratha (140 g)',
    cookingTips: 'Add salt to grated cauliflower just before stuffing to prevent moisture release.',
    ingredients: [
      ing('Whole wheat flour (Atta)', '60 g', 60, 'g'),
      ing('Cauliflower (finely grated)', '70 g', 70, 'g'),
      ing('Ginger & green chilli (minced)', '1 teaspoon', 5, 'tsp'),
      ing('Ajwain & coriander powder', '½ teaspoon', 2, 'tsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Knead a soft whole wheat dough and rest 10 minutes.',
      'Combine grated cauliflower, ginger, green chilli, ajwain, coriander powder, and salt.',
      'Stuff mixture inside rolled dough, seal, and roll gently.',
      'Cook on a hot tawa with oil until golden spots appear on both sides.'
    ],
    swaps: ['Potato parantha/paratha (Aloo ka parantha/paratha)', 'Methi parantha/paratha']
  }),
  makeRecipe({
    foodName: 'Paneer parantha/paratha',
    dishTitle: 'Protein-Rich Paneer Paratha',
    category: 'Breakfast',
    dietaryType: 'Vegetarian',
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    cookingMethod: 'Stuffing & Tawa Roasting',
    servingSize: '1 paratha (140 g)',
    cookingTips: 'Grate fresh paneer finely so it rolls evenly without tearing the dough.',
    ingredients: [
      ing('Whole wheat flour (Atta)', '60 g', 60, 'g'),
      ing('Paneer (finely grated)', '65 g', 65, 'g'),
      ing('Onion & coriander (finely chopped)', '20 g', 20, 'g'),
      ing('Cumin powder & garam masala', '½ teaspoon', 2, 'tsp'),
      ing('Ghee or oil', '1 teaspoon', 5, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Prepare soft whole wheat dough and rest 10 minutes.',
      'Mix grated paneer, onion, coriander, cumin, garam masala, and salt.',
      'Fill dough ball with paneer stuffing, seal, and roll out gently.',
      'Roast on a hot tawa with ghee/oil for 2–3 minutes per side until golden.'
    ],
    swaps: ['Paneer stuffed cheela/chilla', 'Methi parantha/paratha'],
    allergens: ['Dairy']
  }),
  makeRecipe({
    foodName: 'Methi parantha/paratha',
    dishTitle: 'Fresh Fenugreek Paratha (Methi Paratha)',
    category: 'Breakfast',
    dietaryType: 'Vegan',
    prepTimeMinutes: 12,
    cookTimeMinutes: 10,
    cookingMethod: 'Tawa Roasting',
    servingSize: '2 parathas (120 g)',
    cookingTips: 'Wash and chop only tender methi leaves to avoid bitterness.',
    ingredients: [
      ing('Whole wheat flour (Atta)', '70 g', 70, 'g'),
      ing('Fresh fenugreek leaves (Methi, chopped)', '40 g', 40, 'g'),
      ing('Turmeric & cumin powder', '½ teaspoon', 2, 'tsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Water', '40 ml', 40, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Combine wheat flour, chopped methi leaves, turmeric, cumin, salt, and water into a firm dough.',
      'Divide into 2 portions and roll out evenly.',
      'Roast on a hot tawa brushing lightly with oil until cooked through.'
    ],
    swaps: ['Chapati/Roti', 'Besan and spinach parantha/paratha (Besan aur palak ka parantha/paratha)']
  }),
  makeRecipe({
    foodName: 'Boiled rice (Uble chawal)',
    dishTitle: 'Steamed Rice (Uble Chawal)',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    cookingMethod: 'Boiling & Steaming',
    servingSize: '1 bowl (150 g cooked)',
    cookingTips: 'Rinse rice twice until water runs mostly clear and soak 15 minutes for fluffy separate grains.',
    ingredients: [
      ing('Rice (rinsed)', '65 g', 65, 'g'),
      ing('Water', '160 ml', 160, 'ml'),
      ing('Salt (optional)', 'a pinch', 1, 'pinch')
    ],
    instructions: [
      'Rinse rice thoroughly and soak for 15 minutes; drain.',
      'Bring water to a boil in a saucepan, add rice, and stir once.',
      'Reduce heat to low, cover tightly, and simmer 12 minutes until water is absorbed.',
      'Let rest covered 5 minutes, fluff gently with a fork, and serve.'
    ],
    swaps: ['Lemon rice (Pulihora, Elumichai sadam, Chitranna)', 'Mixed vegetable pulao']
  }),
  makeRecipe({
    foodName: 'Lemon rice (Pulihora, Elumichai sadam, Chitranna)',
    dishTitle: 'South Indian Lemon Rice (Chitranna)',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 8,
    cookTimeMinutes: 10,
    cookingMethod: 'Tempering & Tossing',
    servingSize: '1 bowl (180 g)',
    cookingTips: 'Add lemon juice off the heat so it stays bright and never turns bitter.',
    ingredients: [
      ing('Cooked rice (cooled slightly)', '150 g', 150, 'g'),
      ing('Roasted peanuts', '15 g', 15, 'g'),
      ing('Mustard seeds & chana dal', '1 teaspoon', 4, 'tsp'),
      ing('Curry leaves & green chilli', '6 leaves', 4, 'leaves'),
      ing('Turmeric powder', '¼ teaspoon', 1, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Fresh lemon juice', '1 tablespoon', 15, 'tbsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil in a pan, crackle mustard seeds, and toast chana dal and peanuts until crisp.',
      'Add curry leaves, green chilli, and turmeric powder.',
      'Turn off heat, fold in cooked rice and salt gently.',
      'Drizzle fresh lemon juice, toss evenly, and serve.'
    ],
    swaps: ['Tamarind rice (Chintapandu pulihora/Puliyodharai/Puli sadam/Huli anna)', 'Curd rice (Dahi bhaat/Dahi chawal/ Perugu annam/Daddojanam/Thayir saadam)'],
    allergens: ['Peanuts']
  }),
  makeRecipe({
    foodName: 'Curd rice (Dahi bhaat/Dahi chawal/ Perugu annam/Daddojanam/Thayir saadam)',
    dishTitle: 'Tempered Curd Rice (Thayir Sadam)',
    category: 'Main',
    dietaryType: 'Vegetarian',
    prepTimeMinutes: 8,
    cookTimeMinutes: 4,
    cookingMethod: 'Mixing & Tempering',
    servingSize: '1 bowl (190 g)',
    cookingTips: 'Mash warm cooked rice slightly before mixing curd so it absorbs smoothly.',
    ingredients: [
      ing('Cooked soft rice', '120 g', 120, 'g'),
      ing('Fresh curd (yogurt)', '100 g', 100, 'g'),
      ing('Mustard seeds & urad dal', '½ teaspoon', 2, 'tsp'),
      ing('Curry leaves & grated ginger', '5 leaves', 3, 'leaves'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Lightly mash warm cooked rice and allow it to cool to lukewarm.',
      'Mix in whisked curd and salt until creamy.',
      'Heat oil in a small tadka pan; crackle mustard seeds, urad dal, curry leaves, and ginger.',
      'Pour tempering over the curd rice, mix well, and serve.'
    ],
    swaps: ['Lemon rice (Pulihora, Elumichai sadam, Chitranna)', 'Boiled rice (Uble chawal)'],
    allergens: ['Dairy']
  }),
  makeRecipe({
    foodName: 'Mixed vegetable pulao',
    dishTitle: 'Mixed Vegetable Pulao',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 15,
    cookTimeMinutes: 18,
    cookingMethod: 'One-Pot Simmering',
    servingSize: '1 bowl (200 g)',
    cookingTips: 'Soak basmati rice for 20 minutes and use a 1:2 rice-to-water ratio for long fluffy grains.',
    ingredients: [
      ing('Basmati rice (soaked 20 mins)', '70 g', 70, 'g'),
      ing('Mixed vegetables (carrots, peas, beans)', '75 g', 75, 'g'),
      ing('Onion (thinly sliced)', '30 g', 30, 'g'),
      ing('Whole spices (bay leaf, cumin, clove)', '1 teaspoon', 3, 'tsp'),
      ing('Ginger-garlic paste', '1 teaspoon', 5, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Water', '150 ml', 150, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil in a pot, add whole spices, and sauté sliced onion and ginger-garlic paste for 3 minutes.',
      'Add mixed vegetables and sauté for 2 minutes.',
      'Stir in drained basmati rice gently for 1 minute.',
      'Add water and salt, bring to a boil, cover, and simmer on low heat for 12–14 minutes.',
      'Rest 5 minutes before fluffing with a fork.'
    ],
    swaps: ['Vegetable pulao', 'Vegetable biryani/biriyani']
  }),
  makeRecipe({
    foodName: 'Vegetable biryani/biriyani',
    dishTitle: 'Aromatic Vegetable Biryani',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    cookingMethod: 'Layering & Dum Steaming',
    servingSize: '1 plate (220 g)',
    cookingTips: 'Cook rice to 80% doneness before layering with spiced vegetables for distinct biryani grains.',
    ingredients: [
      ing('Basmati rice (soaked)', '75 g', 75, 'g'),
      ing('Mixed vegetables (cauliflower, carrot, peas, beans)', '90 g', 90, 'g'),
      ing('Onion (thinly sliced)', '40 g', 40, 'g'),
      ing('Tomato (chopped)', '35 g', 35, 'g'),
      ing('Mint & coriander leaves', '2 tablespoons', 10, 'tbsp'),
      ing('Biryani masala & turmeric', '1 teaspoon', 4, 'tsp'),
      ing('Oil', '2 teaspoons', 10, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Boil soaked basmati rice with a pinch of salt until 80% cooked; drain and set aside.',
      'Heat oil in a heavy pot; sauté onions until golden, then add tomato, vegetables, biryani masala, and salt.',
      'Cook covered for 6 minutes until vegetables are tender-crisp.',
      'Layer par-cooked rice, mint, and coriander over the vegetable masala.',
      'Seal tightly and steam on very low heat for 10 minutes; fluff gently and serve.'
    ],
    swaps: ['Mixed vegetable pulao', 'Vegetable khichdi/khichri']
  }),
  makeRecipe({
    foodName: 'Vegetable khichdi/khichri',
    dishTitle: 'Comforting Vegetable Moong Dal Khichdi',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 18,
    cookingMethod: 'Pressure Cooking / Simmering',
    servingSize: '1 bowl (210 g)',
    cookingTips: 'Use equal parts rice and split yellow moong dal for balanced protein and easy digestion.',
    ingredients: [
      ing('Rice (rinsed)', '45 g', 45, 'g'),
      ing('Yellow split moong dal (rinsed)', '45 g', 45, 'g'),
      ing('Mixed vegetables (carrot, peas, beans)', '60 g', 60, 'g'),
      ing('Cumin seeds & turmeric', '½ teaspoon', 2, 'tsp'),
      ing('Ginger (grated)', '1 teaspoon', 5, 'tsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Water', '280 ml', 280, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil in a pressure cooker or pot; crackle cumin seeds and sauté grated ginger.',
      'Add chopped vegetables, rice, moong dal, turmeric, salt, and water.',
      'Pressure cook for 3 whistles (or simmer covered 18 minutes) until soft and creamy.',
      'Adjust consistency with warm water if needed and serve hot.'
    ],
    swaps: ['Quinoa khichdi/khichri', 'Spinach khichri (Palak khichri/khichdi)']
  }),
  makeRecipe({
    foodName: 'Quinoa khichdi/khichri',
    dishTitle: 'High-Protein Quinoa Moong Khichdi',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 18,
    cookingMethod: 'Pressure Cooking / Simmering',
    servingSize: '1 bowl (200 g)',
    cookingTips: 'Rinse quinoa thoroughly under running water to remove natural bitter saponins.',
    ingredients: [
      ing('Quinoa (rinsed)', '45 g', 45, 'g'),
      ing('Yellow moong dal (rinsed)', '40 g', 40, 'g'),
      ing('Carrot & green peas', '50 g', 50, 'g'),
      ing('Cumin seeds & turmeric', '½ teaspoon', 2, 'tsp'),
      ing('Olive oil', '1 teaspoon', 5, 'tsp'),
      ing('Water', '260 ml', 260, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat olive oil in a pot and crackle cumin seeds.',
      'Add rinsed quinoa, moong dal, carrot, peas, turmeric, salt, and water.',
      'Simmer covered for 15–18 minutes until quinoa and dal are soft and creamy; serve warm.'
    ],
    swaps: ['Vegetable khichdi/khichri', 'Paneer quinoa power bowl']
  }),
  makeRecipe({
    foodName: 'Spinach khichri (Palak khichri/khichdi)',
    dishTitle: 'Palak Khichdi (Spinach Lentil Rice)',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 18,
    cookingMethod: 'Simmering',
    servingSize: '1 bowl (210 g)',
    cookingTips: 'Fold chopped spinach in during the last 4 minutes to preserve bright color.',
    ingredients: [
      ing('Rice (rinsed)', '40 g', 40, 'g'),
      ing('Yellow moong dal', '40 g', 40, 'g'),
      ing('Fresh spinach leaves (chopped)', '75 g', 75, 'g'),
      ing('Garlic (minced) & cumin seeds', '1 teaspoon', 5, 'tsp'),
      ing('Turmeric powder', '¼ teaspoon', 1, 'tsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Water', '260 ml', 260, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil, crackle cumin seeds, and sauté minced garlic for 30 seconds.',
      'Add rice, moong dal, turmeric, salt, and water; cook until nearly soft.',
      'Stir in chopped spinach and simmer 4 minutes until wilted and blended; serve warm.'
    ],
    swaps: ['Vegetable khichdi/khichri', 'Arhar with spinach (Arhar dal aur palak)']
  }),
  makeRecipe({
    foodName: 'Cracked wheat khichri/khichdi (Dalia khichri/khichdi)',
    dishTitle: 'Savory Vegetable Daliya Khichdi',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 18,
    cookingMethod: 'Pressure Cooking / Simmering',
    servingSize: '1 bowl (210 g)',
    cookingTips: 'Dry roast daliya for 2 minutes first so each grain cooks fluffy yet comforting.',
    ingredients: [
      ing('Broken wheat (Daliya)', '50 g', 50, 'g'),
      ing('Yellow moong dal', '35 g', 35, 'g'),
      ing('Mixed vegetables (carrot, peas, tomato)', '60 g', 60, 'g'),
      ing('Cumin seeds & turmeric', '½ teaspoon', 2, 'tsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Water', '280 ml', 280, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil in a pressure cooker; crackle cumin seeds and sauté vegetables for 2 minutes.',
      'Add daliya, moong dal, turmeric, salt, and water.',
      'Cook for 3 whistles or simmer covered 18 minutes until soft and serve hot.'
    ],
    swaps: ['Vegetable khichdi/khichri', 'Quinoa khichdi/khichri']
  }),
  makeRecipe({
    foodName: 'Sambar',
    dishTitle: 'Traditional South Indian Vegetable Sambar',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    cookingMethod: 'Boiling & Tempering',
    servingSize: '1 bowl (200 ml)',
    cookingTips: 'Simmer sambar gently for 5 minutes after adding tamarind and sambar powder so flavors meld.',
    ingredients: [
      ing('Toor dal (cooked & mashed)', '50 g', 50, 'g'),
      ing('Mixed vegetables (drumstick, carrot, pumpkin, onion)', '80 g', 80, 'g'),
      ing('Tamarind pulp', '1 tablespoon', 15, 'tbsp'),
      ing('Sambar powder', '1.5 teaspoons', 6, 'tsp'),
      ing('Mustard seeds & curry leaves', '½ teaspoon', 2, 'tsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Water', '220 ml', 220, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Simmer chopped vegetables in tamarind water with salt and sambar powder for 10 minutes until tender.',
      'Stir in mashed cooked toor dal and water; simmer 5 minutes.',
      'Prepare tempering by crackling mustard seeds and curry leaves in hot oil.',
      'Pour tempering over sambar, garnish with coriander, and serve hot.'
    ],
    swaps: ['Rasam with tamarind (Puli rasam/ Chintapandu rasam/ Charu/Saaru)', 'Dal moong']
  }),

  // ================= PANEER, DAL & VEGETABLE CURRIES =================
  makeRecipe({
    foodName: 'Spinach paneer (Palak paneer)',
    dishTitle: 'Palak Paneer (Spinach & Cottage Cheese Curry)',
    category: 'Main',
    dietaryType: 'Vegetarian',
    prepTimeMinutes: 12,
    cookTimeMinutes: 15,
    cookingMethod: 'Blanching & Simmering',
    servingSize: '1 bowl (200 g)',
    cookingTips: 'Plunge blanched spinach immediately into cold water to lock in bright green color.',
    ingredients: [
      ing('Fresh spinach leaves (Palak)', '150 g', 150, 'g'),
      ing('Paneer (cubed)', '80 g', 80, 'g'),
      ing('Onion (finely chopped)', '35 g', 35, 'g'),
      ing('Tomato (pureed)', '40 g', 40, 'g'),
      ing('Ginger-garlic paste', '1 teaspoon', 5, 'tsp'),
      ing('Cumin seeds & garam masala', '½ teaspoon', 2, 'tsp'),
      ing('Oil or ghee', '1.5 teaspoons', 7, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Blanch spinach leaves in boiling water for 2 minutes, transfer to cold water, and blend into a smooth puree.',
      'Heat oil/ghee in a pan, crackle cumin seeds, and sauté onion and ginger-garlic paste until golden.',
      'Add tomato puree and cook 3 minutes until thickened.',
      'Stir in spinach puree, garam masala, and salt; simmer 3 minutes.',
      'Fold in paneer cubes, simmer 2 minutes, and serve warm.'
    ],
    swaps: ['Kadhai Paneer', 'Pea paneer curry (Matar paneer)'],
    allergens: ['Dairy']
  }),
  makeRecipe({
    foodName: 'Kadhai Paneer',
    dishTitle: 'Kadhai Paneer with Bell Peppers',
    category: 'Main',
    dietaryType: 'Vegetarian',
    prepTimeMinutes: 12,
    cookTimeMinutes: 15,
    cookingMethod: 'Stir-Frying & Simmering',
    servingSize: '1 bowl (190 g)',
    cookingTips: 'Keep capsicum and onion cubes slightly crunchy for authentic kadhai texture.',
    ingredients: [
      ing('Paneer (cubed)', '90 g', 90, 'g'),
      ing('Bell pepper / capsicum (cubed)', '45 g', 45, 'g'),
      ing('Onion (cubed & chopped)', '45 g', 45, 'g'),
      ing('Tomato (pureed)', '60 g', 60, 'g'),
      ing('Ginger-garlic paste', '1 teaspoon', 5, 'tsp'),
      ing('Crushed coriander seeds & red chilli', '1 teaspoon', 4, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil in a kadai; sauté chopped onion and ginger-garlic paste for 2 minutes.',
      'Add tomato puree, crushed coriander seeds, chilli, and salt; cook 4 minutes.',
      'Toss in capsicum and onion cubes; sauté 2 minutes.',
      'Add paneer cubes, mix gently, cook 2 minutes, and serve hot.'
    ],
    swaps: ['Spinach paneer (Palak paneer)', 'Pea paneer curry (Matar paneer)'],
    allergens: ['Dairy']
  }),
  makeRecipe({
    foodName: 'Pea paneer curry (Matar paneer)',
    dishTitle: 'Homestyle Matar Paneer',
    category: 'Main',
    dietaryType: 'Vegetarian',
    prepTimeMinutes: 12,
    cookTimeMinutes: 18,
    cookingMethod: 'Simmering',
    servingSize: '1 bowl (200 g)',
    cookingTips: 'Simmer paneer cubes gently at the end so they stay soft and soak up the gravy.',
    ingredients: [
      ing('Paneer (cubed)', '80 g', 80, 'g'),
      ing('Green peas', '50 g', 50, 'g'),
      ing('Tomato (pureed)', '65 g', 65, 'g'),
      ing('Onion (finely chopped)', '35 g', 35, 'g'),
      ing('Ginger-garlic paste', '1 teaspoon', 5, 'tsp'),
      ing('Turmeric, coriander & garam masala', '1 teaspoon', 4, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Water', '100 ml', 100, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil, sauté onion and ginger-garlic paste until golden.',
      'Add tomato puree, spices, and salt; cook 4 minutes.',
      'Add green peas and water; simmer 6 minutes until peas are tender.',
      'Add paneer cubes, simmer 3 minutes, garnish with coriander, and serve.'
    ],
    swaps: ['Spinach paneer (Palak paneer)', 'Kadhai Paneer'],
    allergens: ['Dairy']
  }),
  makeRecipe({
    foodName: 'Shahi paneer',
    dishTitle: 'Light Shahi Paneer',
    category: 'Main',
    dietaryType: 'Vegetarian',
    prepTimeMinutes: 12,
    cookTimeMinutes: 18,
    cookingMethod: 'Simmering',
    servingSize: '1 bowl (190 g)',
    cookingTips: 'Use low-fat milk or whisked yogurt with cashew paste for a rich yet balanced gravy.',
    ingredients: [
      ing('Paneer (cubed)', '90 g', 90, 'g'),
      ing('Tomato (pureed)', '70 g', 70, 'g'),
      ing('Onion (boiled & pureed)', '40 g', 40, 'g'),
      ing('Cashews (soaked & ground)', '10 g', 10, 'g'),
      ing('Low-fat milk', '40 ml', 40, 'ml'),
      ing('Cardamom & garam masala', '½ teaspoon', 2, 'tsp'),
      ing('Ghee or oil', '1 teaspoon', 5, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat ghee in a pan; sauté onion puree and tomato puree for 5 minutes.',
      'Stir in cashew paste, cardamom, garam masala, and salt; cook 2 minutes.',
      'Lower heat, whisk in milk gradually, add paneer cubes, and simmer 3 minutes.'
    ],
    swaps: ['Kadhai Paneer', 'Pea paneer curry (Matar paneer)'],
    allergens: ['Dairy', 'Tree nuts']
  }),
  makeRecipe({
    foodName: 'Chilli paneer',
    dishTitle: 'Healthy Stir-Fried Chilli Paneer',
    category: 'Main',
    dietaryType: 'Vegetarian',
    prepTimeMinutes: 12,
    cookTimeMinutes: 12,
    cookingMethod: 'Stir-Frying',
    servingSize: '1 bowl (170 g)',
    cookingTips: 'Pan-sear paneer cubes instead of deep frying to keep calories controlled.',
    ingredients: [
      ing('Paneer (cubed)', '90 g', 90, 'g'),
      ing('Bell pepper & onion (cubed)', '60 g', 60, 'g'),
      ing('Garlic & ginger (minced)', '1 teaspoon', 5, 'tsp'),
      ing('Soy sauce & vinegar', '1.5 teaspoons', 7, 'tsp'),
      ing('Green chilli (slit)', '1 piece', 3, 'piece'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Black pepper & salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Pan-sear paneer cubes in 1 tsp oil until lightly golden; set aside.',
      'In the same pan, sauté garlic, ginger, green chilli, onion, and bell pepper on high heat for 2 minutes.',
      'Toss in soy sauce, vinegar, pepper, salt, and seared paneer for 1 minute; serve hot.'
    ],
    swaps: ['Kadhai Paneer', 'Paneer shaslik/tikka'],
    allergens: ['Dairy', 'Soy']
  }),
  makeRecipe({
    foodName: 'Split bengal gram dal (Channa dal)',
    dishTitle: 'Tempered Chana Dal (Split Bengal Gram)',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    cookingMethod: 'Pressure Cooking & Tempering',
    servingSize: '1 bowl (180 g)',
    cookingTips: 'Soak chana dal for 30 minutes so the lentils cook tender while keeping their shape.',
    ingredients: [
      ing('Chana dal (split Bengal gram, soaked)', '65 g', 65, 'g'),
      ing('Onion & tomato (chopped)', '55 g', 55, 'g'),
      ing('Cumin seeds & turmeric', '½ teaspoon', 2, 'tsp'),
      ing('Ginger-garlic (minced)', '1 teaspoon', 5, 'tsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Water', '220 ml', 220, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Pressure cook soaked chana dal with turmeric, salt, and water for 3–4 whistles until soft.',
      'Heat oil in a pan, crackle cumin seeds, and sauté ginger-garlic, onion, and tomato until soft.',
      'Pour cooked chana dal into the tadka, simmer 4 minutes, garnish with coriander, and serve.'
    ],
    swaps: ['Washed moong dal (Dhuli moong ki dal)', 'Whole masoor (Masoor ki dal)']
  }),
  makeRecipe({
    foodName: 'Washed moong dal (Dhuli moong ki dal)',
    dishTitle: 'Light Dhuli Moong Dal Tadka',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    cookingMethod: 'Simmering & Tempering',
    servingSize: '1 bowl (180 g)',
    cookingTips: 'Skim any surface foam while boiling moong dal for a clean, light broth.',
    ingredients: [
      ing('Yellow split moong dal (rinsed)', '60 g', 60, 'g'),
      ing('Tomato (chopped)', '35 g', 35, 'g'),
      ing('Cumin seeds & turmeric', '½ teaspoon', 2, 'tsp'),
      ing('Garlic (sliced)', '2 cloves', 6, 'cloves'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Water', '220 ml', 220, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Simmer rinsed moong dal with turmeric, salt, and water for 12–15 minutes until soft.',
      'Heat oil in a small pan; sizzle cumin seeds and garlic, then cook chopped tomato for 2 minutes.',
      'Pour tempering into the dal, simmer 2 minutes, and serve hot.'
    ],
    swaps: ['Whole masoor (Masoor ki dal)', 'Moong dal']
  }),
  makeRecipe({
    foodName: 'Whole masoor (Masoor ki dal)',
    dishTitle: 'Whole Brown Masoor Dal',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    cookingMethod: 'Pressure Cooking & Tempering',
    servingSize: '1 bowl (180 g)',
    cookingTips: 'Whole masoor cooks quickly without lengthy soaking.',
    ingredients: [
      ing('Whole brown masoor dal', '60 g', 60, 'g'),
      ing('Onion & tomato (chopped)', '55 g', 55, 'g'),
      ing('Ginger-garlic paste', '1 teaspoon', 5, 'tsp'),
      ing('Cumin seeds & garam masala', '½ teaspoon', 2, 'tsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Water', '220 ml', 220, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Boil or pressure cook rinsed masoor dal with water and salt for 15 minutes until tender.',
      'Heat oil, crackle cumin seeds, and sauté onion, ginger-garlic, and tomato with garam masala.',
      'Combine with cooked dal, simmer 4 minutes, and serve.'
    ],
    swaps: ['Washed moong dal (Dhuli moong ki dal)', 'Kidney bean curry (Rajmah curry)']
  }),
  makeRecipe({
    foodName: 'Arhar with spinach (Arhar dal aur palak)',
    dishTitle: 'Toor Dal Palak (Lentils with Spinach)',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    cookingMethod: 'Pressure Cooking & Tempering',
    servingSize: '1 bowl (190 g)',
    cookingTips: 'Adding spinach to cooked toor dal preserves iron absorption and fresh flavor.',
    ingredients: [
      ing('Toor / Arhar dal (rinsed)', '55 g', 55, 'g'),
      ing('Fresh spinach leaves (chopped)', '80 g', 80, 'g'),
      ing('Tomato (chopped)', '35 g', 35, 'g'),
      ing('Garlic (chopped) & cumin seeds', '1 teaspoon', 5, 'tsp'),
      ing('Turmeric powder', '¼ teaspoon', 1, 'tsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Water', '220 ml', 220, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Cook toor dal with turmeric, salt, and water until soft.',
      'Heat oil, crackle cumin seeds, sauté garlic and tomato, then wilt chopped spinach for 2 minutes.',
      'Pour cooked dal in, simmer together 4 minutes, and serve hot.'
    ],
    swaps: ['Washed moong dal (Dhuli moong ki dal)', 'Spinach khichri (Palak khichri/khichdi)']
  }),
  makeRecipe({
    foodName: 'Kidney bean curry (Rajmah curry)',
    dishTitle: 'Homestyle Rajma Masala',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    cookingMethod: 'Pressure Cooking & Simmering',
    servingSize: '1 bowl (200 g)',
    cookingTips: 'Soak kidney beans overnight and mash a few cooked beans into the gravy for natural thickness.',
    ingredients: [
      ing('Red kidney beans (Rajma, soaked overnight)', '65 g', 65, 'g'),
      ing('Onion (finely chopped)', '40 g', 40, 'g'),
      ing('Tomato (pureed)', '60 g', 60, 'g'),
      ing('Ginger-garlic paste', '1 teaspoon', 5, 'tsp'),
      ing('Cumin, coriander & garam masala', '1 teaspoon', 4, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Water', '240 ml', 240, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Pressure cook soaked rajma with water and salt for 5–6 whistles until tender.',
      'Heat oil, sauté onion and ginger-garlic paste until golden brown.',
      'Add tomato puree and spices; cook 4 minutes.',
      'Add cooked rajma with its broth, mash a few beans, and simmer 8 minutes before serving.'
    ],
    swaps: ['Whole masoor (Masoor ki dal)', 'Split bengal gram dal (Channa dal)']
  }),
  makeRecipe({
    foodName: 'Dal makhani',
    dishTitle: 'Light Homestyle Dal Makhani',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    cookingMethod: 'Slow Simmering',
    servingSize: '1 bowl (190 g)',
    cookingTips: 'Simmer slowly on low heat after mashing a portion of lentils for creamy body.',
    ingredients: [
      ing('Whole black urad dal (soaked overnight)', '55 g', 55, 'g'),
      ing('Red kidney beans (soaked)', '15 g', 15, 'g'),
      ing('Tomato (pureed)', '65 g', 65, 'g'),
      ing('Ginger-garlic paste', '1 teaspoon', 5, 'tsp'),
      ing('Cumin & Kashmiri chilli powder', '½ teaspoon', 2, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Water', '250 ml', 250, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Pressure cook soaked urad dal and rajma with water and salt until completely soft.',
      'Heat oil, sauté ginger-garlic paste and tomato puree with spices for 5 minutes.',
      'Add cooked lentils, mash lightly, and simmer on low heat 12–15 minutes until rich and creamy.'
    ],
    swaps: ['Whole masoor (Masoor ki dal)', 'Kidney bean curry (Rajmah curry)']
  }),
  makeRecipe({
    foodName: 'Brinjal bhartha (Baingan ka bhartha)',
    dishTitle: 'Roasted Baingan Bharta',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    cookingMethod: 'Roasting & Sautéing',
    servingSize: '1 bowl (170 g)',
    cookingTips: 'Roast brinjal until skin chars and flesh is completely soft for authentic smoky flavor.',
    ingredients: [
      ing('Large brinjal / eggplant', '150 g', 150, 'g'),
      ing('Onion (finely chopped)', '35 g', 35, 'g'),
      ing('Tomato (finely chopped)', '45 g', 45, 'g'),
      ing('Green peas (optional)', '20 g', 20, 'g'),
      ing('Garlic & green chilli (minced)', '1 teaspoon', 5, 'tsp'),
      ing('Mustard oil or vegetable oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Fresh coriander & salt', '1 tablespoon', 5, 'tbsp')
    ],
    instructions: [
      'Roast whole brinjal over direct flame or oven until soft and charred; cool, peel, and mash pulp.',
      'Heat oil, sauté garlic, green chilli, and onion for 3 minutes.',
      'Add tomato, peas, and salt; cook 4 minutes until soft.',
      'Stir in mashed brinjal, cook 5 minutes, garnish with coriander, and serve.'
    ],
    swaps: ['Stuffed brinjal (Bharwa baingan)', 'Potato cauliflower (Aloo gobhi)']
  }),
  makeRecipe({
    foodName: 'Okra/Lady\'s fingers fry (Bhindi sabzi/sabji/subji)',
    dishTitle: 'Stir-Fried Bhindi Sabzi',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 12,
    cookTimeMinutes: 12,
    cookingMethod: 'Stir-Frying',
    servingSize: '1 bowl (150 g)',
    cookingTips: 'Wipe washed okra completely dry before slicing to prevent sliminess.',
    ingredients: [
      ing('Okra / Lady\'s fingers (dried & sliced)', '140 g', 140, 'g'),
      ing('Onion (sliced)', '35 g', 35, 'g'),
      ing('Cumin seeds, turmeric & coriander powder', '1 teaspoon', 4, 'tsp'),
      ing('Amchur (dry mango powder)', '¼ teaspoon', 1, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil in a wide pan, crackle cumin seeds, and sauté sliced onion for 2 minutes.',
      'Add sliced okra and turmeric; cook uncovered on medium heat for 8 minutes stirring gently.',
      'Add coriander powder, amchur, and salt; cook 2 more minutes and serve.'
    ],
    swaps: ['Crispy okra/Crispy lady\'s fingers (Karare bhindi)', 'Stuffed okra (Bharwa bhindi)']
  }),
  makeRecipe({
    foodName: 'Potato cauliflower (Aloo gobhi)',
    dishTitle: 'Homestyle Aloo Gobhi Sabzi',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 12,
    cookTimeMinutes: 18,
    cookingMethod: 'Sautéing & Steaming',
    servingSize: '1 bowl (170 g)',
    cookingTips: 'Cook covered on low heat without adding water so cauliflower stays firm and flavorful.',
    ingredients: [
      ing('Cauliflower florets', '90 g', 90, 'g'),
      ing('Potato (cubed)', '60 g', 60, 'g'),
      ing('Tomato & ginger (chopped)', '35 g', 35, 'g'),
      ing('Cumin, turmeric & coriander powder', '1 teaspoon', 4, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil, crackle cumin seeds, and sauté ginger for 30 seconds.',
      'Add potato cubes, cauliflower florets, turmeric, coriander powder, and salt; toss well.',
      'Cover and cook on low heat for 12–14 minutes until tender, stirring occasionally.',
      'Stir in chopped tomato for 2 minutes, garnish with coriander, and serve.'
    ],
    swaps: ['Pea potato curry (Aloo matar)', 'Spinach and potato (Palak aloo)']
  }),
  makeRecipe({
    foodName: 'Pea potato curry (Aloo matar)',
    dishTitle: 'Aloo Matar Curry',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 18,
    cookingMethod: 'Simmering',
    servingSize: '1 bowl (190 g)',
    cookingTips: 'Simmer potatoes and peas together until potatoes lightly thicken the tomato gravy.',
    ingredients: [
      ing('Potato (cubed)', '80 g', 80, 'g'),
      ing('Green peas', '50 g', 50, 'g'),
      ing('Onion & tomato (chopped)', '65 g', 65, 'g'),
      ing('Ginger-garlic paste & cumin', '1 teaspoon', 5, 'tsp'),
      ing('Turmeric, coriander & garam masala', '1 teaspoon', 4, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Water', '120 ml', 120, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil, crackle cumin, and sauté onion and ginger-garlic paste until soft.',
      'Add tomato and spices; cook 3 minutes.',
      'Add potato cubes, peas, water, and salt; cover and simmer 12 minutes until tender.'
    ],
    swaps: ['Potato cauliflower (Aloo gobhi)', 'Pea paneer curry (Matar paneer)']
  }),
  makeRecipe({
    foodName: 'Spinach and potato (Palak aloo)',
    dishTitle: 'Aloo Palak Dry Sabzi',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    cookingMethod: 'Sautéing',
    servingSize: '1 bowl (170 g)',
    cookingTips: 'Cook potatoes 80% before adding chopped spinach so greens stay vibrant.',
    ingredients: [
      ing('Fresh spinach (chopped)', '100 g', 100, 'g'),
      ing('Potato (small cubes)', '70 g', 70, 'g'),
      ing('Garlic (chopped) & cumin seeds', '1 teaspoon', 5, 'tsp'),
      ing('Turmeric & red chilli powder', '½ teaspoon', 2, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil, crackle cumin seeds, and sauté garlic for 30 seconds.',
      'Add cubed potatoes, turmeric, and salt; cover and cook 8 minutes until almost tender.',
      'Add chopped spinach and chilli powder; toss uncovered for 4–5 minutes until wilted and dry.'
    ],
    swaps: ['Spinach mushroom (Palak mushroom)', 'Potato cauliflower (Aloo gobhi)']
  }),
  makeRecipe({
    foodName: 'Beans with coconut (Nariyal aur sem/phali; Beans thoran)',
    dishTitle: 'South Indian Beans Thoran',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    cookingMethod: 'Stir-Steaming',
    servingSize: '1 bowl (150 g)',
    cookingTips: 'Finish with fresh grated coconut off the heat to keep it sweet and tender.',
    ingredients: [
      ing('French beans (finely chopped)', '120 g', 120, 'g'),
      ing('Fresh grated coconut', '20 g', 20, 'g'),
      ing('Mustard seeds & curry leaves', '½ teaspoon', 2, 'tsp'),
      ing('Turmeric & green chilli', '½ teaspoon', 2, 'tsp'),
      ing('Coconut oil', '1 teaspoon', 5, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat coconut oil, crackle mustard seeds, and add curry leaves and green chilli.',
      'Add chopped beans, turmeric, salt, and 2 tbsp water; cover and steam 6 minutes.',
      'Fold in grated coconut, toss 1 minute, and serve warm.'
    ],
    swaps: ['Cabbage and peas (Pattagobhi aur matar)', 'Okra/Lady\'s fingers fry (Bhindi sabzi/sabji/subji)']
  }),
  makeRecipe({
    foodName: 'Mushroom matar',
    dishTitle: 'Mushroom Matar Masala',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    cookingMethod: 'Simmering',
    servingSize: '1 bowl (180 g)',
    cookingTips: 'Cook sliced mushrooms on medium-high briefly so they brown instead of steaming.',
    ingredients: [
      ing('Button mushrooms (quartered)', '90 g', 90, 'g'),
      ing('Green peas', '45 g', 45, 'g'),
      ing('Onion & tomato (chopped)', '60 g', 60, 'g'),
      ing('Ginger-garlic paste & garam masala', '1 teaspoon', 5, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil, sauté onion and ginger-garlic paste until soft.',
      'Add tomato and spices; cook 3 minutes.',
      'Add mushrooms, green peas, and salt; cook 8 minutes until tender and serve.'
    ],
    swaps: ['Spinach mushroom (Palak mushroom)', 'Pea paneer curry (Matar paneer)']
  }),
  makeRecipe({
    foodName: 'Spinach mushroom (Palak mushroom)',
    dishTitle: 'Garlic Spinach & Mushroom Stir-Fry',
    category: 'Main',
    dietaryType: 'Vegan',
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    cookingMethod: 'Sautéing',
    servingSize: '1 bowl (160 g)',
    cookingTips: 'Sear mushrooms first until moisture evaporates before wilting spinach.',
    ingredients: [
      ing('Button mushrooms (sliced)', '80 g', 80, 'g'),
      ing('Fresh spinach leaves', '80 g', 80, 'g'),
      ing('Garlic (minced)', '2 cloves', 6, 'cloves'),
      ing('Olive oil', '1 teaspoon', 5, 'tsp'),
      ing('Black pepper & salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat olive oil, sauté garlic and mushrooms for 5 minutes until browned.',
      'Toss in spinach, black pepper, and salt; cook 2 minutes until wilted and serve.'
    ],
    swaps: ['Mushroom matar', 'Spinach and potato (Palak aloo)']
  }),

  // ================= NON-VEGETARIAN MAINS & EXISTING PLAN ITEMS =================
  makeRecipe({
    foodName: 'Bengal fish curry (Bengali machli curry)',
    dishTitle: 'Bengali Macher Jhol (Light Fish Curry)',
    category: 'Main',
    dietaryType: 'Non-Vegetarian',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    cookingMethod: 'Pan Searing & Simmering',
    servingSize: '1 bowl (200 g)',
    cookingTips: 'Lightly sear turmeric-rubbed fish pieces before simmering so they stay intact in the mustard-tomato gravy.',
    ingredients: [
      ing('Rohu or firm white fish fillets', '120 g', 120, 'g'),
      ing('Tomato (chopped)', '45 g', 45, 'g'),
      ing('Onion (sliced)', '30 g', 30, 'g'),
      ing('Mustard oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Turmeric, cumin & nigella seeds (kalonji)', '1 teaspoon', 4, 'tsp'),
      ing('Green chilli (slit)', '1 piece', 3, 'piece'),
      ing('Water', '150 ml', 150, 'ml'),
      ing('Fresh coriander & salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Rub fish fillets with a pinch of turmeric and salt; set aside 10 minutes.',
      'Heat mustard oil in a pan and sear fish 2 minutes per side; transfer to a plate.',
      'In the same pan, temper kalonji and green chilli, then sauté onion and tomato with cumin and turmeric.',
      'Pour water and salt, bring to a simmer, gently slide seared fish in, and cook 6 minutes.',
      'Garnish with fresh coriander and serve warm with steamed rice.'
    ],
    swaps: ['Fish curry (Machli curry)', 'Fish tikka'],
    allergens: ['Fish']
  }),
  makeRecipe({
    foodName: 'Handi chicken',
    dishTitle: 'Slow-Simmered Handi Chicken',
    category: 'Main',
    dietaryType: 'Non-Vegetarian',
    prepTimeMinutes: 15,
    cookTimeMinutes: 28,
    cookingMethod: 'Slow Simmering',
    servingSize: '1 bowl (200 g)',
    cookingTips: 'Cook on low flame with a tight lid so chicken stays succulent in its own juices.',
    ingredients: [
      ing('Skinless chicken (cut into pieces)', '130 g', 130, 'g'),
      ing('Onion (finely chopped)', '40 g', 40, 'g'),
      ing('Tomato (pureed)', '50 g', 50, 'g'),
      ing('Plain yogurt (whisked)', '25 g', 25, 'g'),
      ing('Ginger-garlic paste', '1.5 teaspoons', 7, 'tsp'),
      ing('Coriander, cumin & garam masala', '1 teaspoon', 4, 'tsp'),
      ing('Oil or ghee', '1.5 teaspoons', 7, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil in a heavy pot; sauté onion and ginger-garlic paste until golden.',
      'Add tomato puree and spices; cook 4 minutes.',
      'Lower heat, stir in whisked yogurt and chicken pieces, and sear for 4 minutes.',
      'Cover tightly and simmer on low heat 18–20 minutes until chicken is tender; garnish with coriander.'
    ],
    swaps: ['Chicken curry', 'Chicken korma'],
    allergens: ['Dairy']
  }),
  makeRecipe({
    foodName: 'Mutton do piaza',
    dishTitle: 'Mutton Do Pyaza',
    category: 'Main',
    dietaryType: 'Non-Vegetarian',
    prepTimeMinutes: 15,
    cookTimeMinutes: 35,
    cookingMethod: 'Pressure Cooking & Simmering',
    servingSize: '1 bowl (200 g)',
    cookingTips: 'Add half the onions at the start for gravy body and crisp onion petals near the end for classic Do Pyaza sweetness.',
    ingredients: [
      ing('Lean mutton pieces', '125 g', 125, 'g'),
      ing('Onion (half chopped, half petals)', '70 g', 70, 'g'),
      ing('Tomato (chopped)', '40 g', 40, 'g'),
      ing('Ginger-garlic paste', '1.5 teaspoons', 7, 'tsp'),
      ing('Whole spices & garam masala', '1 teaspoon', 4, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Water', '160 ml', 160, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil in a pressure cooker; sauté whole spices, chopped onion, and ginger-garlic paste until browned.',
      'Add mutton, tomato, spices, and salt; sear 5 minutes.',
      'Add water and pressure cook for 4–5 whistles until mutton is tender.',
      'Stir in remaining onion petals and simmer uncovered 4 minutes until gravy thickens.'
    ],
    swaps: ['Mutton korma', 'Spinach mutton (Palak mutton)']
  }),
  makeRecipe({
    foodName: 'Butter chicken',
    dishTitle: 'Light Homestyle Butter Chicken',
    category: 'Main',
    dietaryType: 'Non-Vegetarian',
    prepTimeMinutes: 20,
    cookTimeMinutes: 22,
    cookingMethod: 'Grilling & Simmering',
    servingSize: '1 bowl (200 g)',
    cookingTips: 'Marinate chicken in spiced yogurt for 20 minutes before pan-searing for tender bites.',
    ingredients: [
      ing('Boneless chicken breast (cubed)', '120 g', 120, 'g'),
      ing('Tomato (pureed)', '90 g', 90, 'g'),
      ing('Plain yogurt (for marinade)', '25 g', 25, 'g'),
      ing('Ginger-garlic paste & garam masala', '1.5 teaspoons', 7, 'tsp'),
      ing('Butter or olive oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Kasuri methi (dried fenugreek)', '½ teaspoon', 1, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Marinate chicken cubes with yogurt, half the ginger-garlic paste, and salt; pan-sear until cooked.',
      'Heat butter in a pan, sauté remaining ginger-garlic paste and tomato puree 6 minutes.',
      'Add garam masala, kasuri methi, and seared chicken; simmer 5 minutes and serve warm.'
    ],
    swaps: ['Chicken curry', 'Tandoori chicken'],
    allergens: ['Dairy']
  }),
  makeRecipe({
    foodName: 'Tandoori chicken',
    dishTitle: 'Oven / Pan Roasted Tandoori Chicken',
    category: 'Main',
    dietaryType: 'Non-Vegetarian',
    prepTimeMinutes: 20,
    cookTimeMinutes: 22,
    cookingMethod: 'Roasting / Grilling',
    servingSize: '2 pieces (160 g)',
    cookingTips: 'Make shallow slashes on chicken pieces so yogurt-spice marinade penetrates deeply.',
    ingredients: [
      ing('Skinless chicken pieces', '140 g', 140, 'g'),
      ing('Hung curd / thick yogurt', '35 g', 35, 'g'),
      ing('Ginger-garlic paste', '1.5 teaspoons', 7, 'tsp'),
      ing('Kashmiri chilli, turmeric & garam masala', '1 teaspoon', 4, 'tsp'),
      ing('Lemon juice', '1 tablespoon', 15, 'tbsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Score chicken pieces and coat in lemon juice, salt, yogurt, ginger-garlic paste, and spices; rest 20 minutes.',
      'Brush lightly with oil and roast in a preheated oven (200°C) or covered grill pan for 20–22 minutes, turning once.',
      'Serve hot with onion rings and lemon wedges.'
    ],
    swaps: ['Roast chicken', 'Chicken kebab'],
    allergens: ['Dairy']
  }),
  makeRecipe({
    foodName: 'Chicken korma',
    dishTitle: 'Aromatic Chicken Korma',
    category: 'Main',
    dietaryType: 'Non-Vegetarian',
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    cookingMethod: 'Simmering',
    servingSize: '1 bowl (200 g)',
    cookingTips: 'Whisk yogurt well and add on low heat to keep the korma sauce silky.',
    ingredients: [
      ing('Skinless chicken pieces', '125 g', 125, 'g'),
      ing('Onion (thinly sliced & browned)', '40 g', 40, 'g'),
      ing('Plain yogurt', '35 g', 35, 'g'),
      ing('Ginger-garlic paste', '1 teaspoon', 5, 'tsp'),
      ing('Cardamom, cloves & coriander powder', '1 teaspoon', 4, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Sauté sliced onion in oil until crisp golden; crush finely.',
      'Add chicken, ginger-garlic paste, spices, and salt; sear 5 minutes.',
      'Stir in yogurt and crushed browned onions; cover and simmer 15 minutes until tender.'
    ],
    swaps: ['Handi chicken', 'Chicken curry'],
    allergens: ['Dairy']
  }),
  makeRecipe({
    foodName: 'Chicken pulao',
    dishTitle: 'One-Pot Chicken Pulao',
    category: 'Main',
    dietaryType: 'Non-Vegetarian',
    prepTimeMinutes: 15,
    cookTimeMinutes: 22,
    cookingMethod: 'One-Pot Simmering',
    servingSize: '1 plate (220 g)',
    cookingTips: 'Sauté chicken briefly with whole spices before adding soaked rice for aromatic stock.',
    ingredients: [
      ing('Basmati rice (soaked)', '65 g', 65, 'g'),
      ing('Boneless chicken pieces', '100 g', 100, 'g'),
      ing('Onion (sliced)', '35 g', 35, 'g'),
      ing('Ginger-garlic paste & whole spices', '1.5 teaspoons', 7, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Water', '150 ml', 150, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil, sauté whole spices, sliced onion, and ginger-garlic paste 3 minutes.',
      'Add chicken and salt; cook 5 minutes until seared.',
      'Add drained rice and water; cover and simmer 14 minutes until rice and chicken are cooked through.'
    ],
    swaps: ['Mutton pulao', 'Mixed vegetable pulao']
  }),
  makeRecipe({
    foodName: 'Egg curry (Anda curry)',
    dishTitle: 'Spiced Boiled Egg Curry',
    category: 'Main',
    dietaryType: 'Non-Vegetarian',
    prepTimeMinutes: 10,
    cookTimeMinutes: 18,
    cookingMethod: 'Boiling & Simmering',
    servingSize: '2 eggs with gravy (180 g)',
    cookingTips: 'Prick boiled eggs lightly with a fork before simmering so spices infuse evenly.',
    ingredients: [
      ing('Boiled eggs (peeled)', '2 eggs', 100, 'eggs'),
      ing('Onion (chopped)', '35 g', 35, 'g'),
      ing('Tomato (pureed)', '55 g', 55, 'g'),
      ing('Ginger-garlic paste', '1 teaspoon', 5, 'tsp'),
      ing('Turmeric, coriander & garam masala', '1 teaspoon', 4, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Water', '100 ml', 100, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Prick boiled eggs gently and pan-sear with a pinch of turmeric for 2 minutes.',
      'Sauté onion and ginger-garlic paste in oil until golden, then add tomato puree and spices.',
      'Add water and salt, simmer 5 minutes, add eggs, and cook 3 more minutes.'
    ],
    swaps: ['Indian style egg bhujia (Anda bhujia (Indian style))', 'Chicken curry'],
    allergens: ['Eggs']
  }),
  makeRecipe({
    foodName: 'Fish curry (Machli curry)',
    dishTitle: 'Homestyle Spiced Fish Curry',
    category: 'Main',
    dietaryType: 'Non-Vegetarian',
    prepTimeMinutes: 15,
    cookTimeMinutes: 18,
    cookingMethod: 'Simmering',
    servingSize: '1 bowl (190 g)',
    cookingTips: 'Avoid stirring vigorously once fish is in the curry; gently swirl the pan instead.',
    ingredients: [
      ing('Firm fish fillets (cubed)', '120 g', 120, 'g'),
      ing('Onion & tomato (pureed)', '75 g', 75, 'g'),
      ing('Ginger-garlic paste', '1 teaspoon', 5, 'tsp'),
      ing('Turmeric, coriander & chilli powder', '1 teaspoon', 4, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Water', '120 ml', 120, 'ml'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Heat oil and sauté ginger-garlic paste and onion-tomato puree with spices for 5 minutes.',
      'Add water and salt; bring to a gentle simmer.',
      'Slide fish pieces in carefully and simmer covered 7–8 minutes until flaky and cooked.'
    ],
    swaps: ['Bengal fish curry (Bengali machli curry)', 'Fish tikka'],
    allergens: ['Fish']
  }),
  makeRecipe({
    foodName: 'Fish tikka',
    dishTitle: 'Grilled Spiced Fish Tikka',
    category: 'Main',
    dietaryType: 'Non-Vegetarian',
    prepTimeMinutes: 15,
    cookTimeMinutes: 12,
    cookingMethod: 'Grilling',
    servingSize: '4 pieces (140 g)',
    cookingTips: 'Pat fish dry before marinating so spices cling well during grilling.',
    ingredients: [
      ing('Boneless fish cubes', '130 g', 130, 'g'),
      ing('Thick yogurt', '25 g', 25, 'g'),
      ing('Ginger-garlic paste & ajwain', '1 teaspoon', 5, 'tsp'),
      ing('Lemon juice', '1 tablespoon', 15, 'tbsp'),
      ing('Oil', '1 teaspoon', 5, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Marinate fish cubes in lemon juice, yogurt, ginger-garlic paste, ajwain, and salt for 15 minutes.',
      'Grill or pan-sear with oil for 3–4 minutes per side until lightly charred and flaky.'
    ],
    swaps: ['Hariyali Fish Tikka', 'Tandoori fish'],
    allergens: ['Fish', 'Dairy']
  }),
  makeRecipe({
    foodName: 'Vegeterian scotch egg',
    dishTitle: 'Baked Vegetable-Crusted Scotch Egg',
    category: 'Snack',
    dietaryType: 'Non-Vegetarian',
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    cookingMethod: 'Boiling & Baking',
    servingSize: '1 scotch egg (120 g)',
    cookingTips: 'Chill boiled eggs before wrapping in mashed potato-pea coating so the shell holds cleanly.',
    ingredients: [
      ing('Boiled egg (peeled)', '1 egg', 50, 'eggs'),
      ing('Boiled mashed potato & green peas', '65 g', 65, 'g'),
      ing('Whole wheat breadcrumbs', '15 g', 15, 'g'),
      ing('Garam masala & black pepper', '½ teaspoon', 2, 'tsp'),
      ing('Oil (for brushing)', '1 teaspoon', 5, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Season mashed potato and crushed peas with garam masala, black pepper, and salt.',
      'Wrap the spiced potato mixture evenly around a peeled boiled egg.',
      'Roll lightly in whole wheat breadcrumbs, brush with oil, and bake/air-fry at 190°C for 14 minutes until crisp.'
    ],
    swaps: ['Scotch egg', 'Boiled egg (Ubla anda)'],
    allergens: ['Eggs']
  }),
  makeRecipe({
    foodName: 'Vegetarian egg kofta curry',
    dishTitle: 'Egg Kofta Curry',
    category: 'Main',
    dietaryType: 'Non-Vegetarian',
    prepTimeMinutes: 15,
    cookTimeMinutes: 18,
    cookingMethod: 'Boiling & Simmering',
    servingSize: '1 bowl (180 g)',
    cookingTips: 'Place pan-seared koftas into the warm gravy right before serving.',
    ingredients: [
      ing('Boiled egg (wrapped in spiced potato/besan)', '1 egg', 50, 'eggs'),
      ing('Potato & besan binding', '40 g', 40, 'g'),
      ing('Onion & tomato puree', '75 g', 75, 'g'),
      ing('Ginger-garlic paste & garam masala', '1 teaspoon', 5, 'tsp'),
      ing('Oil', '1.5 teaspoons', 7, 'tsp'),
      ing('Salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Coat boiled egg in seasoned potato-besan mix and pan-sear until golden.',
      'Sauté ginger-garlic paste and onion-tomato puree with garam masala and salt for 5 minutes.',
      'Add a splash of water to form a smooth gravy, halve the kofta, place in gravy, and serve warm.'
    ],
    swaps: ['Egg curry (Anda curry)', 'Vegeterian scotch egg'],
    allergens: ['Eggs']
  }),
  makeRecipe({
    foodName: 'Low calorie quick mayonnaise',
    dishTitle: 'Light Yogurt & Egg Quick Mayonnaise Dip',
    category: 'Condiment',
    dietaryType: 'Non-Vegetarian',
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    cookingMethod: 'Whisking',
    servingSize: '2 tablespoons (30 g)',
    cookingTips: 'Use pasteurized egg or thick hung yogurt base and whisk steadily while drizzling oil.',
    ingredients: [
      ing('Hung yogurt (low-fat curd)', '40 g', 40, 'g'),
      ing('Pasteurized egg yolk', '1 yolk', 18, 'yolk'),
      ing('Olive oil', '1 tablespoon', 15, 'tbsp'),
      ing('Mustard powder & white vinegar', '½ teaspoon', 3, 'tsp'),
      ing('Black pepper & salt', 'to taste', 1, 'pinch')
    ],
    instructions: [
      'Whisk egg yolk, mustard powder, vinegar, and salt in a clean bowl.',
      'Drizzle olive oil drop by drop while whisking continuously until emulsified.',
      'Fold in hung yogurt and black pepper until light and creamy; chill until ready to use.'
    ],
    swaps: ['Mint coriander green chutney', 'Curd dip'],
    allergens: ['Eggs', 'Dairy']
  })
];

async function run() {
  const byKey = new Map();
  const merged = [];

  for (const r of existingRecipes) {
    const key = String(r.foodName || '').trim().toLowerCase();
    if (!key || byKey.has(key)) continue;
    const enriched = {
      ...r,
      totalTimeMinutes: (Number(r.prepTimeMinutes) || 0) + (Number(r.cookTimeMinutes) || 0),
      cookingTips: r.cookingTips || ''
    };
    byKey.set(key, enriched);
    merged.push(enriched);
  }

  for (const r of additionalRecipes) {
    const key = String(r.foodName || '').trim().toLowerCase();
    if (!key) continue;
    if (byKey.has(key)) {
      const idx = merged.findIndex((m) => String(m.foodName).trim().toLowerCase() === key);
      if (idx !== -1) merged[idx] = r;
    } else {
      merged.push(r);
    }
    byKey.set(key, r);
  }

  fs.writeFileSync(existingRecipesPath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
  console.log(`Updated pwa/data/recipes.json with ${merged.length} total verified recipes.`);

  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL not set; skipping PostgreSQL sync.');
    return;
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query(`ALTER TABLE recipes ADD COLUMN IF NOT EXISTS cooking_tips TEXT NOT NULL DEFAULT ''`);

  let upserted = 0;
  for (const r of merged) {
    await client.query(
      `INSERT INTO recipes (
        food_name, dish_title, category, dietary_type,
        prep_time_minutes, cook_time_minutes, cooking_time_desc,
        cooking_method, difficulty, serving_size, base_serving_grams,
        ingredients, instructions, swaps, allergens, cooking_tips
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      ON CONFLICT (food_name) DO UPDATE SET
        dish_title = EXCLUDED.dish_title,
        category = EXCLUDED.category,
        dietary_type = EXCLUDED.dietary_type,
        prep_time_minutes = EXCLUDED.prep_time_minutes,
        cook_time_minutes = EXCLUDED.cook_time_minutes,
        cooking_time_desc = EXCLUDED.cooking_time_desc,
        cooking_method = EXCLUDED.cooking_method,
        difficulty = EXCLUDED.difficulty,
        serving_size = EXCLUDED.serving_size,
        base_serving_grams = EXCLUDED.base_serving_grams,
        ingredients = EXCLUDED.ingredients,
        instructions = EXCLUDED.instructions,
        swaps = EXCLUDED.swaps,
        allergens = EXCLUDED.allergens,
        cooking_tips = EXCLUDED.cooking_tips`,
      [
        r.foodName,
        r.dishTitle,
        r.category,
        r.dietaryType,
        Number(r.prepTimeMinutes || 10),
        Number(r.cookTimeMinutes || 0),
        r.cookingTimeDesc || 'No cooking required',
        r.cookingMethod || 'Mixing',
        r.difficulty || 'Easy',
        r.servingSize || '1 portion',
        Number(r.baseServingGrams || 100),
        JSON.stringify(r.ingredients || []),
        JSON.stringify(r.instructions || []),
        JSON.stringify(r.swaps || []),
        JSON.stringify(r.allergens || []),
        r.cookingTips || ''
      ]
    );
    upserted++;
  }
  await client.end();
  console.log(`Synced ${upserted} verified recipes into PostgreSQL.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
