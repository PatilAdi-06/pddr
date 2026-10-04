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

## Deploy with GitHub Pages

1. Push the repository to GitHub.
2. Open repository **Settings -> Pages**.
3. Select **Deploy from a branch**.
4. Select `main` and the folder containing the PWA files.
5. If GitHub Pages serves the repository root, move or copy the contents of `pwa/` to the root or configure a Pages workflow.
6. Wait for the HTTPS URL, for example:

```text
https://YOUR_USERNAME.github.io/pddr/
```

The URL must use HTTPS for installation and PWABuilder.

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

## Current data boundary

The PWA stores the profile, tracking values and grocery state in browser `localStorage`. The Flask API, MySQL database, JWT authentication and Scikit-learn service can be connected later through the same UI workflows.
