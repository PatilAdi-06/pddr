# Daylight Wellness Flutter App

This is the native mobile implementation of the PDDR prototype. It contains the first 50% milestone as a local-first Android workflow: sign-in prototype, health profile input, BMI/BMR and calorie calculations, adaptive meal plan, recipes, smart food substitutions, hydration logging, exercise and sleep logging, meal adherence, wellness score, grocery list, reminder controls, profile editing, offline persistence, and bottom navigation.

## Setup

1. Install Flutter from https://docs.flutter.dev/get-started/install/windows.
2. Verify the Android toolchain:

```powershell
flutter doctor
```

3. Generate the Android and iOS platform folders inside this directory:

```powershell
cd mobile
flutter create . --platforms=android,ios
```

4. Fetch packages and run the app on an emulator or connected phone:

```powershell
flutter pub get
flutter devices
flutter run
```

For Android Studio, start an Android emulator first, then run `flutter run` from this folder.

## Build an APK

```powershell
flutter build apk --release
```

The APK will be at `build/app/outputs/flutter-apk/app-release.apk`.

For a Play Store bundle:

```powershell
flutter build appbundle --release
```

The AAB will be at `build/app/outputs/bundle/release/app-release.aab`.

## Next implementation slice

Connect the local `Profile` model to the Flask REST API, persist plans and trackers in SQLite, add JWT authentication, then replace the local meal fixtures with the Scikit-learn recommendation endpoint.

## Current boundary

The app intentionally uses local rules and `shared_preferences` for this milestone. The next backend milestone will add the Flask API, MySQL, real JWT sessions, server-side validation, Scikit-learn models, real notification scheduling, historical analytics, and the admin module described in the project proposal.
