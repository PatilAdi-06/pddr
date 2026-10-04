import 'dart:convert';

class HealthProfile {
  String name;
  int age;
  String gender;
  double height;
  double weight;
  String activity;
  String goal;
  String preference;
  String allergies;

  HealthProfile({this.name = 'Adarsh', this.age = 24, this.gender = 'Male', this.height = 174, this.weight = 68, this.activity = 'Moderate', this.goal = 'Maintain', this.preference = 'Vegetarian', this.allergies = 'None'});

  double get bmi => weight / ((height / 100) * (height / 100));
  int get bmr => (10 * weight + 6.25 * height - 5 * age + (gender == 'Female' ? -161 : 5)).round();
  int get calories { final factor = {'Low': 1.2, 'Moderate': 1.45, 'High': 1.7}[activity] ?? 1.45; final adjustment = {'Lose weight': -300, 'Maintain': 0, 'Gain muscle': 250}[goal] ?? 0; return (bmr * factor + adjustment).round(); }
  int get waterTarget => (weight * 35).round();
  String get bmiLabel => bmi < 18.5 ? 'Below range' : bmi < 25 ? 'Healthy range' : bmi < 30 ? 'Above range' : 'High range';

  Map<String, dynamic> toJson() => {'name': name, 'age': age, 'gender': gender, 'height': height, 'weight': weight, 'activity': activity, 'goal': goal, 'preference': preference, 'allergies': allergies};
  factory HealthProfile.fromJson(Map<String, dynamic> json) => HealthProfile(name: json['name'] ?? 'Adarsh', age: json['age'] ?? 24, gender: json['gender'] ?? 'Male', height: (json['height'] ?? 174).toDouble(), weight: (json['weight'] ?? 68).toDouble(), activity: json['activity'] ?? 'Moderate', goal: json['goal'] ?? 'Maintain', preference: json['preference'] ?? 'Vegetarian', allergies: json['allergies'] ?? 'None');
}

class Meal { const Meal(this.type, this.time, this.name, this.calories, this.protein, this.ingredients, this.recipe); final String type, time, name, recipe; final int calories, protein; final List<String> ingredients; }

const meals = [
  Meal('Breakfast', '08:00 AM', 'Masala oats & boiled eggs', 420, 24, ['Oats', 'Eggs', 'Onion', 'Tomato'], 'Cook oats with vegetables and spices. Serve with boiled eggs.'),
  Meal('Mid-morning', '11:00 AM', 'Greek yogurt with berries', 180, 12, ['Greek yogurt', 'Berries', 'Chia seeds'], 'Layer yogurt, berries and chia seeds. Chill for 10 minutes.'),
  Meal('Lunch', '01:30 PM', 'Paneer quinoa power bowl', 560, 31, ['Paneer', 'Quinoa', 'Spinach', 'Cucumber'], 'Cook quinoa, pan-sear paneer and assemble with greens.'),
  Meal('Evening snack', '04:30 PM', 'Roasted makhana & chai', 160, 7, ['Makhana', 'Tea', 'Cardamom'], 'Dry roast makhana with a pinch of spices.'),
  Meal('Dinner', '08:00 PM', 'Dal, roti & seasonal greens', 480, 22, ['Lentils', 'Whole wheat flour', 'Greens'], 'Pressure cook dal, prepare rotis and saute seasonal greens.'),
];

class GroceryItem { GroceryItem(this.name, this.quantity, {this.purchased = false}); final String name; final String quantity; bool purchased; }
class ExerciseEntry { ExerciseEntry(this.name, this.minutes, this.date); final String name; final int minutes; final DateTime date; }
class SleepEntry { SleepEntry(this.date, this.hours); final DateTime date; final double hours; }
class WaterEntry { WaterEntry(this.date, this.ml); final DateTime date; final int ml; }

class DayLog {
  int water;
  int exerciseMinutes;
  double sleepHours;
  int calories;
  bool breakfast;
  bool lunch;
  bool dinner;
  DayLog({this.water = 1450, this.exerciseMinutes = 10, this.sleepHours = 7.2, this.calories = 1520, this.breakfast = true, this.lunch = false, this.dinner = false});
  int wellnessScore(HealthProfile profile) { final diet = (breakfast ? 15 : 0) + (lunch ? 15 : 0) + (dinner ? 15 : 0); final caloriesScore = (1 - ((calories - profile.calories).abs() / profile.calories)).clamp(0, 1) * 20; final waterScore = (water / profile.waterTarget).clamp(0, 1) * 20; final exerciseScore = (exerciseMinutes / 30).clamp(0, 1) * 10; final sleepScore = (sleepHours / 8).clamp(0, 1) * 5; return (diet + caloriesScore + waterScore + exerciseScore + sleepScore).round(); }
}

String encodeProfile(HealthProfile profile) => jsonEncode(profile.toJson());
