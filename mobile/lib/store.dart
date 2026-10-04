import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'models.dart';

class LocalStore {
  static const profileKey = 'health_profile';
  static const waterKey = 'water_ml';
  static const logKey = 'day_log';
  static const groceryKey = 'grocery_items';

  Future<HealthProfile> loadProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(profileKey);
    return raw == null ? HealthProfile() : HealthProfile.fromJson(jsonDecode(raw));
  }

  Future<void> saveProfile(HealthProfile profile) async { final prefs = await SharedPreferences.getInstance(); await prefs.setString(profileKey, encodeProfile(profile)); }
  Future<DayLog> loadLog() async { final prefs = await SharedPreferences.getInstance(); final raw = prefs.getString(logKey); if (raw == null) return DayLog(); final data = jsonDecode(raw); return DayLog(water: data['water'] ?? 1450, exerciseMinutes: data['exercise'] ?? 10, sleepHours: (data['sleep'] ?? 7.2).toDouble(), calories: data['calories'] ?? 1520, breakfast: data['breakfast'] ?? true, lunch: data['lunch'] ?? false, dinner: data['dinner'] ?? false); }
  Future<void> saveLog(DayLog log) async { final prefs = await SharedPreferences.getInstance(); await prefs.setString(logKey, jsonEncode({'water': log.water, 'exercise': log.exerciseMinutes, 'sleep': log.sleepHours, 'calories': log.calories, 'breakfast': log.breakfast, 'lunch': log.lunch, 'dinner': log.dinner})); }
  Future<List<GroceryItem>> loadGroceries() async { final prefs = await SharedPreferences.getInstance(); final raw = prefs.getString(groceryKey); if (raw == null) return defaultGroceries(); return (jsonDecode(raw) as List).map((item) => GroceryItem(item['name'], item['quantity'], purchased: item['purchased'] ?? false)).toList(); }
  Future<void> saveGroceries(List<GroceryItem> items) async { final prefs = await SharedPreferences.getInstance(); await prefs.setString(groceryKey, jsonEncode(items.map((item) => {'name': item.name, 'quantity': item.quantity, 'purchased': item.purchased}).toList())); }
  List<GroceryItem> defaultGroceries() => [GroceryItem('Oats', '500 g'), GroceryItem('Paneer', '400 g'), GroceryItem('Quinoa', '250 g'), GroceryItem('Greek yogurt', '500 g'), GroceryItem('Seasonal greens', '2 bunches'), GroceryItem('Lentils', '500 g')];
}
