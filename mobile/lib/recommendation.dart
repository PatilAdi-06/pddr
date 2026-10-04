import 'models.dart';

class LocalRecommendationEngine {
  Map<String, dynamic> generate(HealthProfile profile) => {'calorieTarget': profile.calories, 'waterTarget': profile.waterTarget, 'mealSplit': {'Breakfast': (profile.calories * .25).round(), 'Mid-morning': (profile.calories * .1).round(), 'Lunch': (profile.calories * .3).round(), 'Evening snack': (profile.calories * .1).round(), 'Dinner': (profile.calories * .25).round()}, 'exercise': profile.goal == 'Gain muscle' ? 'Strength training · 30 min' : 'Brisk walk · 30 min', 'source': 'Local rules; replace with Flask/Scikit-learn API'};

  List<String> substitutions(String food) { final options = {'Paneer': ['Tofu', 'Chickpeas', 'Low-fat cottage cheese'], 'Quinoa': ['Millets', 'Brown rice', 'Oats'], 'Eggs': ['Tofu scramble', 'Moong chilla', 'Paneer bhurji'], 'Greek yogurt': ['Curd', 'Soy yogurt', 'Buttermilk']}; return options[food] ?? ['Millets', 'Oats', 'Brown rice']; }
}
