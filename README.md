<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/336e0c17-f0ff-4452-ad21-c5475ad6c5c5

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and fill in the Firebase Web configuration.
3. In Firebase Console, enable Authentication > Sign-in method > Email/Password and create a Firestore database.
4. From this project, run `firebase login`, then `firebase use --add` to select your project, and deploy the included rules with `firebase deploy --only firestore:rules`.
5. Optionally set `VITE_GEMINI_API_KEY` for the assistant. Use an API key restricted to the required APIs and domains.
6. Run the app:
   `npm run dev`
