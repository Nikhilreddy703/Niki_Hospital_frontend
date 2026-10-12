export function ErrorNotice({ children, onRetry }) { return <div className="notice notice-error" role="alert"><p>{children}</p>{onRetry && <button className="text-button" onClick={onRetry}>Try again</button>}</div> }
export function Loading({ children = 'Loading...' }) { return <div className="loading-state" role="status"><span className="spinner"/>{children}</div> }
export function EmptyState({ title, text }) { return <div className="empty-state"><span className="empty-icon">✦</span><h3>{title}</h3><p>{text}</p></div> }
