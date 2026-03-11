import { useState, useEffect, useCallback } from 'react'
import {
  getAllNotifications,
  markAsRead,
  type Notification,
} from '../lib/notificationStore'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const list = await getAllNotifications()
    setNotifications(list)
  }, [])

  useEffect(() => {
    let mounted = true
    getAllNotifications()
      .then((list) => {
        if (mounted) setNotifications(list)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const handler = () => refresh()
    window.addEventListener('fcm-notification', handler)
    return () => window.removeEventListener('fcm-notification', handler)
  }, [refresh])

  const markRead = useCallback(async (id: string) => {
    await markAsRead(id)
    await refresh()
  }, [refresh])

  return { notifications, loading, refresh, markRead }
}
