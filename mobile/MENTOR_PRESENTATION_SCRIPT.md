# Personalized Diet and Daily Routine Recommendation System

## 1. Project Introduction

Good morning/afternoon, sir/madam.

My project is called **Personalized Diet and Daily Routine Recommendation System**.

It is a mobile wellness application designed to help users manage their diet, daily routine and healthy habits in one place.

The application uses the user's health details, food preferences, goals and daily progress to provide a personalized wellness plan.

The application is intended to provide general wellness guidance. It is not a replacement for a doctor or professional dietitian.

## 2. Problem Statement

Many people follow generic diet plans that do not consider their age, weight, height, activity level, health goal, food preferences or allergies.

Users also use separate applications for meals, water, exercise, sleep and progress tracking.

This makes it difficult to follow a consistent routine.

This project solves the problem by combining personalized diet planning, routine planning and habit tracking in a single mobile application.

## 3. Main Objective

The main objective is to create a mobile application that can:

- Calculate BMI, BMR and daily calorie requirements.
- Recommend suitable meals and recipes.
- Suggest alternatives when a food is unavailable or disliked.
- Create a daily routine for meals, water, exercise and sleep.
- Track water, exercise, sleep and meal completion.
- Generate a Daily Wellness Score.
- Create a grocery list from the meal plan.
- Work with previously saved information when the device is offline.

## 4. Technology Used

The user-facing application is being developed using **Flutter and Dart** for Android mobile devices.

The planned complete system contains these layers:

1. Flutter mobile application for the user interface.
2. Flask REST API for backend communication.
3. Scikit-learn for recommendation models.
4. MySQL for server-side data storage.
5. SQLite or local device storage for offline access.
6. JWT and password hashing for security.

The current mobile prototype uses local data and local persistence so that the main user workflow can be demonstrated without depending on a server.

## 5. Application Flow

The basic application flow is:

1. The user signs in or creates an account.
2. The user enters health details such as age, height, weight, activity level, goal and food preferences.
3. The application calculates BMI, BMR, calorie target and water target.
4. The application displays a personalized dashboard.
5. The user views meals, recipes and ingredient substitutions.
6. The user checks the grocery list created from the meal plan.
7. The user records water, exercise, sleep and meal completion.
8. The application calculates a Daily Wellness Score.
9. The user's updated information can be used to create an improved plan.

## 6. Features Currently Available in the Mobile Application

### Authentication Screen

The application begins with a sign-in and account creation screen.

This is currently a local prototype flow. Server-based JWT authentication will be connected through the backend API.

### Health Profile

The user can enter and edit:

- Name
- Age
- Height
- Weight
- Activity level
- Health goal
- Food preference
- Allergies or restrictions

### Health Calculations

The application calculates:

- BMI using height and weight.
- BMR using the Mifflin-St Jeor equation.
- Daily calorie target using BMR, activity level and goal adjustment.
- Daily water target using body weight.

When profile information changes, these values are recalculated.

### Dashboard

The dashboard displays:

- Daily calorie target.
- Current wellness score.
- BMI and BMI category.
- BMR.
- Sleep information.
- Today's meals.
- Hydration progress.
- Offline availability.

### Meal Plan

The meal plan contains five meal slots:

- Breakfast
- Mid-morning snack
- Lunch
- Evening snack
- Dinner

Each meal includes calories, protein, ingredients and a simple preparation method.

### Recipe and Food Substitution

The user can open a meal to view its ingredients and recipe instructions.

The application also provides nutritionally suitable local alternatives. For example, paneer can be replaced with tofu or chickpeas, and quinoa can be replaced with millets or brown rice.

The current substitutions use local recommendation rules. These rules can later be replaced by the Scikit-learn recommendation service.

### Grocery List

The grocery list is created from the planned meals.

The user can mark ingredients as purchased while shopping.

The grocery state is saved locally on the device.

### Water Tracking

The user can add water in 250 ml units.

The application displays the amount consumed compared with the daily target.

### Exercise Tracking

The user can record exercise minutes.

The current prototype supports quick logging for activities such as a walk or workout.

### Sleep Tracking

The user can record sleep duration.

The sleep value contributes to the Daily Wellness Score.

### Meal Adherence

The user can mark breakfast, lunch and dinner as completed.

This information contributes to the wellness score.

### Daily Wellness Score

The score is calculated from:

- Meal adherence.
- Calorie adherence.
- Water intake.
- Exercise duration.
- Sleep duration.

The score gives the user a simple view of their daily consistency.

### Reminder Settings

The application includes controls for:

- Meal reminders.
- Water reminders.
- Exercise reminders.
- Sleep reminders.

The current screen stores the user's choices locally. Native scheduled notification integration is part of the next development stage.

### Offline Support

The profile, daily log and grocery list are saved locally using device storage.

This allows important information to remain available when the user is offline.

## 7. Recommendation Logic

The current application includes a local recommendation layer.

It calculates calorie and water targets from the profile and provides rule-based meal substitutions.

The recommendation layer has been kept separate from the user interface so that it can later call the Flask API and Scikit-learn models without changing the mobile screens.

In the complete system, the recommendation flow will be:

User profile -> calculated features -> calorie target -> diet category -> meal selection -> recipe selection -> substitutions -> grocery list.

## 8. Work Remaining

The following modules remain to complete the full system:

### Backend API

- Create the Flask REST API.
- Add versioned routes such as `/api/v1`.
- Connect the mobile application to the API.
- Add request validation and standard JSON responses.

### Database

- Create the MySQL database.
- Add tables for users, profiles, food, nutrition, recipes, plans, groceries, notifications and progress.
- Add authenticated user ownership checks to every query.

### Security

- Add real user registration and login.
- Hash passwords using bcrypt or Werkzeug.
- Add JWT token authentication.
- Protect user health information.
- Store secrets in environment variables.

### Machine Learning

- Prepare food and nutrition datasets.
- Generate the user-profile training data.
- Train calorie regression models.
- Train diet-category classification models.
- Add content-based recipe ranking.
- Add KNN-based food substitution.
- Evaluate the models using MAE, RMSE, R-squared, accuracy, precision, recall and F1 score.

### Synchronisation

- Sync offline logs with the server when the network returns.
- Resolve conflicts between local and server data.
- Cache previous plans and recipes.

### Notifications

- Schedule real Android local notifications.
- Add meal, water, exercise and sleep reminders.
- Add next-day plan notifications.
- Add progress milestone notifications.

### Analytics

- Store historical weight and BMI records.
- Add daily, weekly and monthly charts.
- Compare actual progress with targets.

### Admin Module

- Add secured backend APIs for managing users, foods, recipes and nutrition data.
- Add content management for diet plans and recommendation data.

## 9. Project Limitations

The recommendation labels are initially based on standard formulas and guideline rules.

They are not clinical predictions and should not be treated as medical advice.

The current local prototype does not yet learn continuously from user data.

The final models will be retrained offline when enough reliable data is available.

## 10. Demonstration Sequence

During the demonstration, I will show the following flow:

1. Open the Daylight Wellness mobile application.
2. Sign in using the prototype authentication screen.
3. Open the profile and show the health details.
4. Show the BMI, BMR, calorie target and water target.
5. Open the daily meal plan.
6. Open a meal to show its recipe and ingredients.
7. Show food substitution suggestions.
8. Open the grocery list and mark an item as purchased.
9. Add water intake.
10. Add exercise minutes and sleep duration.
11. Mark meals as completed.
12. Show the updated Daily Wellness Score.
13. Open reminder settings.
14. Explain how the local recommendation layer will later connect to the Flask API and ML engine.

## 11. Conclusion

This project combines nutrition planning, daily routine management and habit tracking in one mobile application.

The application uses a user's health profile and progress to provide more useful guidance than a static diet chart.

The mobile foundation, user flow, calculations, meal planning, tracking and offline data handling are implemented locally.

The next stage will connect the mobile application to the Flask backend, MySQL database, authentication system and Scikit-learn recommendation engine.

Thank you.
