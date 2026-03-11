// Auto-generated - do not edit. Config injected from .env
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js');

firebase.initializeApp({"apiKey":"AIzaSyBmCrcn5EfMVFO4Kf7vB7fkdZTOO5aImyQ","authDomain":"athercreations.firebaseapp.com","projectId":"athercreations","storageBucket":"athercreations.appspot.com","messagingSenderId":"49258493061","appId":"1:49258493061:web:a741586d7d868d1ce3e5ec"});

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
