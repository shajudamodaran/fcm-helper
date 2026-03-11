# FCM Helper

A tool to generate Firebase Cloud Messaging (FCM) tokens and display push notifications in a WhatsApp Web-style UI.

## Features

- **FCM Token Generation**: Request notification permission and generate a registration token
- **Token Display**: Copy your token with one click
- **Notification Inbox**: Receive and display push notifications in a chat-style list
- **Message View**: View notification details in a WhatsApp Web-like layout

## Prerequisites

- Node.js 18+
- A Firebase project with Cloud Messaging enabled
- HTTPS (required for FCM; use `localhost` for local development)

## Setup

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/) and select your project
2. Go to **Project Settings** (gear icon) → **General** → **Your apps**
3. Add a web app if you haven't already, and copy the config values
4. Go to **Project Settings** → **Cloud Messaging** → **Web Push certificates**
5. Generate or copy your VAPID key

### 2. Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase config:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_VAPID_KEY=your-vapid-key
```

### 3. Install and Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Testing with Firebase Console

1. **Generate Token**: Click "Generate Token" in the app and allow notifications
2. **Copy Token**: Click "Copy" to copy the FCM token
3. **Send Test Message**:
   - Go to [Firebase Console](https://console.firebase.google.com/) → **Engage** → **Messaging**
   - Click **Create your first campaign** or **New campaign**
   - Choose **Firebase Notification messages**
   - Click **Send test message**
   - Paste your FCM token in **Add an FCM registration token**
   - Click **Test**

4. **View notifications**: Sent notifications appear in the left panel when the app is in foreground, or in the browser when in background.

## Build

```bash
npm run build
```

The `firebase-messaging-sw.js` service worker is auto-generated in `public/` from your `.env` when you run `dev` or `build`.

## Project Structure

```
fcm-helper/
├── public/
│   └── firebase-messaging-sw.js   # Auto-generated service worker
├── src/
│   ├── components/               # UI components
│   ├── hooks/                    # useFCM, useNotifications
│   ├── lib/                      # notificationStore (IndexedDB)
│   └── firebase.ts               # Firebase config
└── vite-plugin-fcm-sw.ts        # Injects config into SW
```
