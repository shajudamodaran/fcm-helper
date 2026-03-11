import { useState, useEffect, useCallback } from 'react'
import { getToken, onMessage } from 'firebase/messaging'
import { getMessagingInstance, vapidKey } from '../firebase'
import { addNotification } from '../lib/notificationStore'
import type { Notification } from '../lib/notificationStore'

const BROADCAST_CHANNEL = 'fcm-notifications'

interface MessagePayload {
  messageId?: string
  notification?: { title?: string; body?: string }
  data?: Record<string, string>
}

function payloadToNotification(payload: MessagePayload): Notification {
  return {
    id: payload.messageId ?? `msg-${Date.now()}`,
    title: payload.notification?.title ?? 'Notification',
    body: payload.notification?.body ?? '',
    data: payload.data ?? {},
    timestamp: Date.now(),
    read: false,
  }
}

export function useFCM() {
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const requestPermission = useCallback(async () => {
    if (!vapidKey) {
      setError('VITE_VAPID_KEY is not configured in .env')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setError('Notification permission denied')
        setIsLoading(false)
        return
      }

      const messaging = await getMessagingInstance()
      const currentToken = await getToken(messaging, { vapidKey })
      if (currentToken) {
        setToken(currentToken)
      } else {
        setError('No registration token available')
      }

      onMessage(messaging, async (payload) => {
        const notification = payloadToNotification(payload as MessagePayload)
        await addNotification(notification)
        window.dispatchEvent(new CustomEvent('fcm-notification', { detail: notification }))
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get token')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const channel = new BroadcastChannel(BROADCAST_CHANNEL)
    channel.onmessage = async (event: MessageEvent<Notification>) => {
      await addNotification(event.data)
      window.dispatchEvent(new CustomEvent('fcm-notification', { detail: event.data }))
    }
    return () => channel.close()
  }, [])

  return { token, error, isLoading, requestPermission }
}
