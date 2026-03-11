/// <reference types="vite/client" />

declare module 'firebase/app' {
  export function initializeApp(options: object): unknown
}

declare module 'firebase/messaging' {
  export function getMessaging(app?: unknown): unknown
  export function getToken(messaging: unknown, options: { vapidKey: string }): Promise<string>
  export function onMessage(messaging: unknown, nextOrObserver: (payload: unknown) => void): () => void
  export function isSupported(): Promise<boolean>
}
