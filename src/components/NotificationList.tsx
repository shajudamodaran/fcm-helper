import type { Notification } from '../lib/notificationStore'
import { NotificationItem } from './NotificationItem'

interface NotificationListProps {
  notifications: Notification[]
  selectedId: string | null
  onSelect: (notification: Notification) => void
  loading?: boolean
}

export function NotificationList({
  notifications,
  selectedId,
  onSelect,
  loading = false,
}: NotificationListProps) {
  if (loading) {
    return (
      <div className="notification-list-loading">
        <div className="loading-dots">
          <span />
          <span />
          <span />
        </div>
        <p>Loading notifications...</p>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="notification-list-empty">
        <div className="empty-icon">🔔</div>
        <p>No notifications yet</p>
        <p className="hint">Send a test message from Firebase Console to see it here</p>
      </div>
    )
  }

  return (
    <div className="notification-list">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          selected={notification.id === selectedId}
          onClick={() => onSelect(notification)}
        />
      ))}
    </div>
  )
}
