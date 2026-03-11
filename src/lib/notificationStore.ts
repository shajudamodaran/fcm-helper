const DB_NAME = 'fcm-helper-db'
const DB_VERSION = 1
const DB_STORE = 'notifications'

export interface Notification {
  id: string
  title: string
  body: string
  data: Record<string, string>
  timestamp: number
  read: boolean
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE, { keyPath: 'id' })
      }
    }
  })
}

export async function addNotification(notification: Notification): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite')
    const store = tx.objectStore(DB_STORE)
    store.put(notification)
    tx.oncomplete = () => {
      db.close()
      resolve()
    }
    tx.onerror = () => reject(tx.error)
  })
}

export async function getAllNotifications(): Promise<Notification[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readonly')
    const store = tx.objectStore(DB_STORE)
    const request = store.getAll()
    request.onsuccess = () => {
      db.close()
      resolve((request.result as Notification[]).sort((a, b) => b.timestamp - a.timestamp))
    }
    request.onerror = () => reject(request.error)
  })
}

export async function markAsRead(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite')
    const store = tx.objectStore(DB_STORE)
    const getRequest = store.get(id)
    getRequest.onsuccess = () => {
      const notification = getRequest.result as Notification | undefined
      if (notification) {
        notification.read = true
        store.put(notification)
      }
      tx.oncomplete = () => {
        db.close()
        resolve()
      }
    }
    tx.onerror = () => reject(tx.error)
  })
}
