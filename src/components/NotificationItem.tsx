import type { Notification } from '../lib/notificationStore'

interface NotificationItemProps {
  notification: Notification
  selected: boolean
  onClick: () => void
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
  if (diff < 86400000) return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export function NotificationItem({
  notification,
  selected,
  onClick,
}: NotificationItemProps) {
  const preview = notification.body.slice(0, 45) + (notification.body.length > 45 ? '...' : '')
  const initial = notification.title.charAt(0).toUpperCase()

  return (
    <button
      type="button"
      className={`notification-item ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="notification-avatar">
        <span className="avatar-initial">{initial}</span>
      </div>
      <div className="notification-content">
        <div className="notification-header">
          <span className="notification-title">{notification.title}</span>
          <span className="notification-time">{formatTime(notification.timestamp)}</span>
        </div>
        <p className="notification-preview">{preview || 'No message'}</p>
      </div>
      {!notification.read && <span className="unread-badge" />}
    </button>
  )
}
