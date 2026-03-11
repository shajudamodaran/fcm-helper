import { useState } from 'react'
import { TokenPanel } from './components/TokenPanel'
import { NotificationList } from './components/NotificationList'
import { MessageView } from './components/MessageView'
import { useFCM } from './hooks/useFCM'
import { useNotifications } from './hooks/useNotifications'
import type { Notification } from './lib/notificationStore'
import './App.css'

function App() {
  const { token, error, isLoading, requestPermission } = useFCM()
  const { notifications, loading, markRead } = useNotifications()
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [tokenPanelOpen, setTokenPanelOpen] = useState(false)

  const filteredNotifications = searchQuery.trim()
    ? notifications.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.body.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notifications

  const handleSelectNotification = (notification: Notification) => {
    setSelectedNotification(notification)
  }

  const handleMarkRead = (id: string) => {
    markRead(id)
    setSelectedNotification((prev) =>
      prev?.id === id ? { ...prev, read: true } : prev
    )
  }

  return (
    <div className="app">
      <header className="global-header">
        <div className="header-left">
          <div className="app-avatar">
            <span className="avatar-initial">F</span>
          </div>
          <span className="app-title">FCM Helper</span>
        </div>
        <div className="header-right">
          <button
            type="button"
            className="header-icon-btn"
            onClick={() => setTokenPanelOpen(!tokenPanelOpen)}
            title="Token"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <button type="button" className="header-icon-btn" title="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
        </div>
      </header>

      {tokenPanelOpen && (
        <div className="token-panel-overlay">
          <TokenPanel
            token={token}
            error={error}
            isLoading={isLoading}
            onRequestPermission={requestPermission}
            onClose={() => setTokenPanelOpen(false)}
          />
        </div>
      )}

      <main className="app-main">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="search-wrapper">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search notifications"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <NotificationList
            notifications={filteredNotifications}
            selectedId={selectedNotification?.id ?? null}
            onSelect={handleSelectNotification}
            loading={loading}
          />
        </aside>

        <section className="content">
          <MessageView
            notification={selectedNotification}
            onMarkRead={handleMarkRead}
          />
        </section>
      </main>
    </div>
  )
}

export default App
