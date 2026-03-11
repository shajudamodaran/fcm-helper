// Auto-generated - do not edit. Config injected from .env
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
});

const messaging = firebase.messaging();

const NOTIFICATION_CHANNEL = 'fcm-notifications';
const DB_NAME = 'fcm-helper-db';
const DB_STORE = 'notifications';

function addToStore(notification) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(DB_STORE, 'readwrite');
      const store = tx.objectStore(DB_STORE);
      store.put(notification);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    };
  });
}

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notification = {
    id: payload.messageId || 'bg-' + Date.now(),
    title: payload.notification?.title || 'Notification',
    body: payload.notification?.body || '',
    data: payload.data || {},
    timestamp: Date.now(),
    read: false,
  };
  addToStore(notification).then(() => {
    try {
      const channel = new BroadcastChannel(NOTIFICATION_CHANNEL);
      channel.postMessage(notification);
      channel.close();
    } catch (_) {}
  });
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/vite.svg',
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
