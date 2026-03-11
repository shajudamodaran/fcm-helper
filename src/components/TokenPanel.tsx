import { useState } from 'react'

interface TokenPanelProps {
  token: string | null
  error: string | null
  isLoading: boolean
  onRequestPermission: () => void
  onClose?: () => void
}

export function TokenPanel({
  token,
  error,
  isLoading,
  onRequestPermission,
  onClose,
}: TokenPanelProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!token) return
    await navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="token-panel">
      <div className="token-panel-header">
        <h2>FCM Token</h2>
        {onClose && (
          <button type="button" className="token-panel-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        )}
      </div>
      <div className="token-actions">
        <button
          type="button"
          onClick={onRequestPermission}
          disabled={isLoading}
          className="btn-primary"
        >
          {isLoading ? 'Generating...' : token ? 'Refresh Token' : 'Generate Token'}
        </button>
      </div>
      {error && <p className="token-error">{error}</p>}
      {token && (
        <div className="token-display">
          <code className="token-value">{token}</code>
          <button
            type="button"
            onClick={handleCopy}
            className="btn-copy"
            title="Copy token"
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
