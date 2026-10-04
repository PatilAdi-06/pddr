# Presentation Generator Prompt

Copy the complete prompt below into PowerPoint Copilot, Gamma, Canva Docs, or another presentation generator.

---

## Master Prompt

Create a professional academic presentation for the project **Personalized Diet and Daily Routine Recommendation System**, developed by **Adarsh Sheetal Patil**, SRN **PES1PG25CA008**, under the guidance of **P. Sreenivas, Assistant Professor**, PES University, Department of MCA, Semester III, course **UQ25CA741A - Capstone Project - Phase 1**.

Create approximately 22 to 25 slides. Use a clean academic design with PES University-inspired navy blue, cyan, orange and white colours. Use readable fonts, limited text per slide, clear diagrams, tables and icons. Do not use marketing language. Do not claim clinical accuracy. Clearly distinguish between features currently demonstrated in the mobile prototype and components planned for backend integration.

Use the following slide structure and content.

---

## Slide 1: Project Title

**Personalized Diet and Daily Routine Recommendation System**

Subtitle:

**A Machine Learning-Based Mobile Wellness Application**

Include:

- PES University
- Department of MCA
- Semester III
- Capstone Project - Phase 1
- Student: Adarsh Sheetal Patil
- SRN: PES1PG25CA008
- Guide: P. Sreenivas, Assistant Professor
- Course: UQ25CA741A

Use a clean title slide with the PES University logo area at the top-right.

## Slide 2: Presentation Overview

Include these sections:

1. Abstract
2. Introduction and problem scenario
3. Literature survey
4. Proposed solution
5. Functional and non-functional requirements
6. System architecture
7. ML methodology and process flow
8. Database design
9. Mobile implementation demonstration
10. Security and offline support
11. Tools and technologies
12. Applications, future scope and conclusion
13. References

## Slide 3: Abstract

Maintaining a healthy diet and daily routine is difficult because users have different bodies, schedules, goals, food preferences and restrictions. Existing applications often provide generic plans or separate tracking features.

This project develops a Flutter-based Android mobile application that creates a personalized wellness plan using health profile information such as age, gender, height, weight, BMI, activity level, goal, food preference and allergies.

The application calculates BMI, BMR, calorie target and hydration target. It provides meal plans, recipes, ingredient substitutions, grocery planning, water tracking, exercise tracking, sleep tracking, meal adherence tracking, wellness scoring and offline access.

The current mobile prototype uses local data, local rules and device persistence. A Flask REST API, MySQL database and Scikit-learn recommendation engine are planned for the complete system.

Add a note:

**The application provides general wellness guidance and is not a substitute for medical or dietetic advice.**

## Slide 4: Introduction and Problem Scenario

Explain:

- People find it difficult to plan meals according to BMI, calorie requirements and health goals.
- Generic diet charts do not adapt to weight changes, activity levels, dislikes or allergies.
- Users may not know suitable substitutes when ingredients are unavailable.
- Grocery planning is usually a separate manual activity.
- Water, exercise, sleep and meal tracking are often spread across different applications.
- Users need one mobile application that combines planning, tracking and adaptive guidance.

Use a simple problem illustration showing separate diet, water, exercise, sleep and grocery applications being replaced by one integrated mobile application.

## Slide 5: Proposed Solution, Purpose and Scope

Proposed solution:

A mobile-first wellness application that converts a user's health profile and daily progress into a structured diet and routine plan.

Purpose:

- Improve personalization compared with static diet charts.
- Encourage consistent daily habits.
- Reduce the effort required to plan meals and groceries.
- Provide useful substitutes for unavailable or disliked foods.
- Keep previous plans and logs available offline.

Scope:

- Android mobile application using Flutter.
- Local-first prototype for profile, meals, recipes, grocery and tracking.
- Planned Flask API, MySQL database and ML engine.
- General wellness use for students, professionals and fitness-conscious users.

## Slide 6: Domain and Target Users

Domain areas:

- Digital health and mHealth
- Nutrition informatics
- Recommender systems
- Supervised machine learning
- Mobile computing
- Habit and wellness tracking

Target users:

- Students
- Working professionals
- Fitness-conscious users
- Gym members and trainers
- Sports departments in educational institutions
- Workplace wellness programmes

Clarify that medical professionals and dietitians remain important for condition-specific advice.

## Slide 7: Literature Survey Background

Explain the background areas studied:

- Mobile health applications for lifestyle monitoring.
- Food and recipe recommender systems.
- Nutrient-based content recommendation.
- Machine learning for calorie and dietary prediction.
- Behaviour change and habit tracking applications.
- Offline-first mobile health applications.

State that the final presentation must include at least ten verified papers from IEEE Xplore, Scopus-indexed journals or recognised academic conferences, preferably published during the last five years.

Do not invent paper details. Use verified papers from the student's university library or IEEE/Scopus access.

## Slide 8: Literature Survey Summary Table

Create a table with ten rows and these columns:

1. No.
2. Paper title
3. Author(s)
4. Publication year
5. Journal or conference
6. Main method
7. Main finding
8. Relevance to this project

Use these research themes to select papers:

- Personalised nutrition recommendation
- Food recommendation using machine learning
- Mobile health and lifestyle tracking
- Nutrient-aware recommender systems
- Exercise and diet adherence prediction
- Behaviour change through mobile applications
- Privacy and security in digital health
- Offline or edge-based health applications
- Food substitution or ingredient recommendation
- Explainable recommendation systems

Insert only verified bibliographic information.

## Slide 9: Comparative Study of Existing Applications

Create a comparison table with columns:

- Feature
- Generic diet chart
- Calorie counter
- Recipe application
- Fitness tracker
- Proposed application

Rows:

- BMI and BMR calculation
- Personalized calorie target
- Adaptive meal plan
- Recipe recommendation
- Food substitution
- Grocery list generation
- Water tracking
- Exercise tracking
- Sleep tracking
- Wellness score
- Reminders
- Offline access
- Progress analytics
- One integrated workflow

Use checkmarks and short notes. Explain that the proposed application combines these capabilities into one flow.

## Slide 10: Functional Requirements

Present the following functional requirements:

1. User registration and sign-in.
2. Health profile creation and editing.
3. BMI and BMR calculation.
4. Daily calorie and water target calculation.
5. Meal plan generation.
6. Recipe and ingredient display.
7. Smart food substitutions.
8. Grocery list generation and purchase tracking.
9. Water intake tracking.
10. Exercise duration tracking.
11. Sleep duration tracking.
12. Meal adherence tracking.
13. Daily Wellness Score calculation.
14. Next-day plan preview.
15. Reminder preference management.
16. Offline access to saved plans and logs.
17. Progress analytics.
18. Adaptive recommendation update when profile or progress changes.

## Slide 11: Functional Requirement Details

Use a table with these columns:

- Requirement
- Input
- Processing
- Output

Examples:

- Health profile: age, height, weight, activity and goal -> calculate BMI, BMR and calorie target -> health summary.
- Meal plan: profile and target calories -> split calories across five meals -> daily meal plan.
- Substitution: selected food -> compare nutrition and category -> alternative food suggestions.
- Grocery list: weekly meals and ingredients -> aggregate quantities -> shopping checklist.
- Wellness score: meal, calorie, water, exercise and sleep logs -> weighted calculation -> score from 0 to 100.

## Slide 12: Non-Functional Requirements

Include:

- Usability: simple mobile interface with clear navigation.
- Performance: common local actions should respond immediately.
- Availability: saved plans and logs should be available offline.
- Security: passwords must be hashed and API calls authenticated.
- Privacy: only necessary health data should be collected and returned.
- Maintainability: separate UI, model, persistence and recommendation layers.
- Scalability: backend should support more users, foods and recipes.
- Reliability: invalid values must be rejected and allergen violations must be prevented.
- Portability: Flutter allows future iOS support.
- Explainability: calorie and wellness results should be understandable to users.

## Slide 13: System Architecture

Create this architecture diagram:

```text
Flutter Android Mobile App
        |
        | HTTPS / JSON REST API
        v
Flask Backend API
        |
        +--> Authentication and validation
        +--> Profile and health calculations
        +--> Plan, recipe, grocery and tracker services
        |
        v
Recommendation Engine
        |
        +--> Calorie regression
        +--> Diet category classification
        +--> Content-based recipe ranking
        +--> KNN food substitution
        |
        v
MySQL Database
```

Also show local device storage beside the Flutter app for cached plans, grocery items and offline logs.

## Slide 14: Mobile Application Architecture

Show the mobile layers:

```text
Presentation Layer
  Dashboard, Plan, Track, Grocery, Profile, Settings

Application Layer
  Wellness score, target calculations, meal actions, tracker actions

Domain Layer
  HealthProfile, Meal, GroceryItem, DayLog, RecommendationEngine

Persistence Layer
  SharedPreferences now; SQLite sync queue in the backend phase

Remote Layer
  Flask REST API planned for server synchronization
```

Explain that this separation makes the local recommendation engine replaceable by a server ML service later.

## Slide 15: Implementation Demonstration

Show screenshots from the Flutter application and explain these working flows:

1. Sign-in or account creation screen.
2. Dashboard with calorie target, BMI, BMR, sleep and wellness score.
3. Editable health profile.
4. Meal plan with five meal slots.
5. Recipe details and ingredients.
6. Smart food substitutions.
7. Grocery checklist.
8. Water intake quick-add.
9. Exercise and sleep logging.
10. Meal adherence checkboxes.
11. Updated Wellness Score.
12. Reminder settings.
13. Offline-ready local storage state.

Use screenshots from the Android emulator or phone. Do not use browser screenshots because the project is a mobile application.

## Slide 16: Health Calculation Methodology

Show the following formulas:

BMI:

```text
BMI = weight in kilograms / (height in metres)^2
```

Mifflin-St Jeor BMR:

```text
Male BMR = 10W + 6.25H - 5A + 5
Female BMR = 10W + 6.25H - 5A - 161
```

Daily calorie target:

```text
Daily target = BMR x activity factor + goal adjustment
```

Hydration target:

```text
Water target = body weight in kilograms x 35 ml
```

Explain:

- W is weight in kilograms.
- H is height in centimetres.
- A is age in years.
- Activity factor depends on the user's activity level.
- Goal adjustment changes for weight loss, maintenance or muscle gain.

## Slide 17: ML and Recommendation Process Flow

Create this process flow:

```text
Collect user profile
        |
Validate values and restrictions
        |
Calculate BMI, BMR and base calorie target
        |
Create feature vector
        |
Predict calorie target and diet category
        |
Split calories across five meals
        |
Filter foods by preference and allergies
        |
Rank foods and recipes by nutrient similarity
        |
Generate substitutions
        |
Create routine, hydration target and grocery list
        |
Store plan and track user feedback
        |
Regenerate plan when profile or progress changes
```

Clarify:

- The current mobile prototype uses local rules and sample meal data.
- The planned backend will load trained Scikit-learn models.
- Models will be retrained offline rather than learning directly from every request.

## Slide 18: Pseudocode

Include this simple pseudocode:

```text
INPUT profile

bmi = weight / height_metre^2
bmr = calculate_mifflin_st_jeor(profile)
calorie_target = bmr * activity_factor(profile.activity)
calorie_target = calorie_target + goal_adjustment(profile.goal)
water_target = weight * 35

meal_targets = split_into_five_meals(calorie_target)

FOR each meal_target:
    candidates = foods_matching_preference(profile.preference)
    candidates = remove_allergens(candidates, profile.allergies)
    selected_food = rank_by_nutrient_similarity(candidates, meal_target)
    attach_recipe(selected_food)

score = calculate_wellness_score(meal_logs, water, exercise, sleep)
grocery_list = aggregate_recipe_ingredients(meal_plan)

OUTPUT plan, recipes, substitutions, grocery_list, score
```

## Slide 19: Database Design

Show the conceptual relational schema:

```text
Users
  |
  +-- HealthProfiles
  +-- UserPreferences
  +-- Notifications
  +-- DietPlans
          |
          +-- MealPlans
          +-- GroceryItems
  +-- DailyRoutine
  +-- WaterTracking
  +-- ExerciseTracking
  +-- SleepTracking
  +-- Progress

FoodItems -- NutritionData
Recipes -- RecipeIngredients -- FoodItems
```

Explain important relationships:

- One user has one health profile.
- One user can have many diet plans.
- One diet plan contains many meal plans.
- Recipes contain multiple food ingredients.
- User-owned records are filtered using authenticated user ID.

## Slide 20: Security, Privacy and Offline Support

Security plan:

- Salted password hashes using bcrypt or Werkzeug.
- JWT authentication for API requests.
- HTTPS communication.
- Server-side validation.
- SQLAlchemy parameterised queries.
- User-specific query filtering.
- Secrets stored in environment variables.

Offline support:

- Store profile, meal plan, grocery list and logs locally.
- Queue unsynchronised logs.
- Synchronise when the network returns.
- Require the server only for a new ML-generated plan.

Privacy:

- Collect only required health information.
- Do not present the output as a diagnosis.
- Explain the limitations of guideline-derived recommendations.

## Slide 21: Tools and Technologies

Create a technology table:

- Flutter and Dart: Android mobile application.
- Python and Flask: REST API backend.
- Scikit-learn: machine learning models.
- Pandas and NumPy: dataset preparation.
- MySQL: relational database.
- SQLite or SharedPreferences: local mobile persistence.
- JWT and bcrypt: authentication and password security.
- fl_chart: mobile analytics charts.
- GitHub Actions: cloud Android build.
- Postman: API testing.
- VS Code and Android Studio: development tools.

## Slide 22: Project Applications and Future Scope

Applications:

- Personal diet and routine planning.
- College and workplace wellness programmes.
- Gym and fitness trainer support.
- Sports student hydration and nutrition planning.
- Preventive wellness support alongside professional medical advice.

Future scope:

- Health Connect and wearable integration.
- Google Fit integration.
- Barcode scanning.
- Food recognition from images.
- Regional Indian food datasets.
- Multilingual support.
- Dietitian review workflow.
- Condition-aware plans under professional supervision.
- Collaborative filtering after collecting enough real user data.
- iOS support using the Flutter codebase.

## Slide 23: References

Use IEEE reference formatting.

Divide references into:

1. Verified research papers from IEEE Xplore or Scopus-indexed publications.
2. Food and nutrition datasets such as IFCT or USDA FoodData Central.
3. Official Flutter documentation.
4. Official Flask documentation.
5. Official Scikit-learn documentation.
6. Official MySQL and SQLAlchemy documentation.

Do not invent authors, years, paper titles or publication details. Verify every research-paper reference before including it.

## Slide 24: Conclusion

This project develops a mobile wellness application that combines personalized diet planning, routine planning and daily habit tracking.

The mobile application provides health calculations, meal plans, recipes, food substitutions, grocery planning, hydration tracking, exercise logging, sleep logging, meal adherence, wellness scoring, reminder preferences and offline storage.

The architecture separates the mobile interface from the recommendation logic and persistence layer, making it ready for integration with a Flask API, MySQL database and Scikit-learn models.

The system is designed as general wellness guidance and should be used together with professional medical or dietetic advice where required.

## Slide 25: Thank You

**Thank You**

Questions and discussion.

---

## Speaker Style Instructions

Use simple language while presenting. Explain one feature at a time using the mobile demonstration. Avoid claiming that the application gives medical advice or that the machine learning model has clinical accuracy. When discussing planned backend components, clearly say they are the next development stage rather than pretending they are already connected.
