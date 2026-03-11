import type { Notification } from '../lib/notificationStore'

interface MessageViewProps {
  notification: Notification | null
  onMarkRead: (id: string) => void
}

function formatTime(timestamp: number): string {
  const opts = { hour: 'numeric' as const, minute: '2-digit' as const }
  return new Date(timestamp).toLocaleTimeString([], opts)
}

function formatDate(timestamp: number): string {
  const opts: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }
  return new Date(timestamp).toLocaleDateString([], opts)
}

export function MessageView({ notification, onMarkRead }: MessageViewProps) {
  if (!notification) {
    return (
      <div className="message-view-empty">
        <div className="empty-pattern" />
        <div className="empty-content">
          <div className="empty-icon-large">🔔</div>
          <p>FCM Helper</p>
          <p className="hint">Select a notification to view its content</p>
        </div>
      </div>
    )
  }

  const initial = notification.title.charAt(0).toUpperCase()

  return (
    <div className="message-view">
      <div className="message-header">
        <div className="message-header-left">
          <div className="message-avatar">
            <span className="avatar-initial">{initial}</span>
          </div>
          <div className="message-header-info">
            <h3>{notification.title}</h3>
            <span className="message-meta">{formatDate(notification.timestamp)}</span>
          </div>
        </div>
        <div className="message-header-right">
          {!notification.read && (
            <button
              type="button"
              className="btn-mark-read"
              onClick={() => onMarkRead(notification.id)}
            >
              Mark as read
            </button>
          )}
        </div>
      </div>

      <div className="message-area">
        <div className="empty-pattern" />
        <div className="message-bubbles">
          <div className="bubble incoming">
            <p>{notification.body || 'No content'}</p>
            <span className="bubble-time">{formatTime(notification.timestamp)}</span>
          </div>
          {Object.keys(notification.data).length > 0 ? (
            <div className="bubble incoming data-payload">
              <p className="data-label">Custom data</p>
              <pre>{JSON.stringify(notification.data, undefined, 2)}</pre>
              <span className="bubble-time">{formatTime(notification.timestamp)}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
