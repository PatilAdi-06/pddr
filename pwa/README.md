# Daylight Wellness PWA

This folder is the PWA version of the mobile wellness prototype. It can be installed on Android as an app-like experience and submitted to PWABuilder for packaging.

## Local test

Serve the folder over HTTP. A service worker will not work correctly from `file://`.

With Python:

```powershell
cd pwa
py -m http.server 8080
```

Open `http://localhost:8080` in Chrome or Edge.

## Nutrition dataset

The PWA reads `data/Indian_Food_Nutrition_Processed.csv` at runtime. The current
dataset contains 1,014 rows with `Dish Name`, `Calories (kcal)`,
`Carbohydrates (g)`, `Protein (g)`, and `Fats (g)`, interpreted as values per
100 g. The recommendation engine detects these columns, calculates portions,
filters vegetarian/vegan choices and allergy text, and totals the daily plan.

The source file does not provide serving size, food category, dietary type, or
allergen columns. Dietary filtering therefore uses a conservative, manually
maintained ingredient classification: explicit animal terms are
Non-Vegetarian, explicit dairy terms are Vegetarian, and explicit plant-food
terms are Vegan. Unknown foods are excluded rather than being assumed safe.
If the CSV is missing or has fewer than five compatible foods, the app shows an
explicit dataset status message instead of falling back to foods from another
dietary category.

Calorie estimates use the Mifflin-St Jeor BMR equation and an activity
multiplier. Users aged 65 or older, or users who enter a health condition, are
shown a professional-assessment warning and do not receive an automatic
calorie deficit.

## Deploy with GitHub Pages

1. Push the repository to GitHub.
2. Open repository **Settings -> Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the `gh-pages` branch and the `/ (root)` folder, then save.
5. Open the **Actions** tab and run **Deploy Daylight PWA**.
6. Wait for the HTTPS URL, for example:

```text
https://YOUR_USERNAME.github.io/pddr/
```

The URL must use HTTPS for installation and PWABuilder.

## Profile, exchange and admin flows

Registration collects the health profile used by the calorie engine. Profiles,
plans and exchange history are stored per local user ID, so switching between
accounts does not reuse another user's dashboard. Each generated meal has an
`I don't have this ingredient · Exchange Food` action; alternatives are ranked
from compatible CSV foods by calorie and macro similarity, then the plan is
saved with recalculated totals.

The local Admin workspace supports user search, profile details, activation,
deactivation and confirmed deletion. These controls are browser-local demos,
not server-side authorization; a production deployment must move them behind
authenticated backend APIs.

## Use PWABuilder

1. Open https://www.pwabuilder.com/.
2. Paste the deployed HTTPS URL.
3. Select **Start** or **Build My PWA**.
4. Review the manifest, service worker and installability checks.
5. Choose **Android**.
6. Download the generated Android package or trusted web activity project.
7. For Google Play, create or connect a Play Console account, configure signing, review permissions and upload the generated `.aab` file.

## Before submitting

- Replace the placeholder PWA icon artwork with final branded PNG icons if PWABuilder requests PNG maskable icons.
- Test offline mode after the first load.
- Test install from Chrome on Android.
- Test profile, meal, water, exercise, sleep and grocery interactions.
- Add a privacy policy URL before publishing.
- Do not present the application as medical diagnosis or treatment.

## Current data boundary and authentication

The PWA stores the profile, tracking values, grocery state and local demo accounts in browser
`localStorage`. Passwords in the demo are derived with PBKDF2-SHA-256 (120,000 iterations);
the raw password is never persisted. User and Admin screens are separated by a local session
role, and logout clears that session.

The original browser-local authentication remains available for demos, but is **not a
production security boundary** unless the PostgreSQL API is configured. The backend must:

- stores password hashes using a modern password-hashing library such as Argon2id or bcrypt;
- issues short-lived, revocable sessions (preferably secure, HttpOnly cookies);
- authorizes every user-owned resource by authenticated user ID;
- checks the Admin role in backend middleware for every recipe, food, plan and user-management API;
- rate-limits login and reset attempts and provides an audited password-reset token flow.

For the local demo, an Admin account is provisioned for testing:
`admin@daylight.local` / `Admin@12345`. Replace this with a server-provisioned account before
sharing or publishing the app.

## PostgreSQL API (additive)

The repository now includes an additive PostgreSQL API in `pwa/api.js`; the existing
browser-local PWA continues to work when PostgreSQL is not configured. To enable the
database-backed features:

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install dependencies with `npm install`.
3. Run `npm run db:migrate`.
4. Run `npm run db:import-foods`.
5. Start with `npm start`.

Provision an administrator from a server terminal; there is no public admin
promotion endpoint:

```powershell
npm run db:create-admin -- admin@example.com "Use-a-strong-password" "PDDR Admin"
```

The API stores profiles, classified CSV foods, diet-plan history, exchanges, activity
records, weight progress, sessions, login activity, and admin logs. User-owned routes
resolve the authenticated user from an HttpOnly session cookie; admin routes require the
database `admin` role. Do not expose `DATABASE_URL` or commit `.env`.
