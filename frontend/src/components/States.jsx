import { AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

/** Empty and error screens: say what happened, then what to do next. */
export function StateBlock({ title, body, action }) {
  return (
    <div className="state">
      <h3>{title}</h3>
      {body ? <p>{body}</p> : null}
      {action}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  const { t } = useStore();
  return (
    <div className="state">
      <AlertCircle size={20} aria-hidden="true" />
      <h3>{t('loadFailedTitle')}</h3>
      <p>{error?.message || t('retry')}</p>
      {onRetry ? (
        <button type="button" className="btn btn--ghost" onClick={onRetry}>
          {t('retry')}
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="state">
      <h3>{title}</h3>
      {body ? <p>{body}</p> : null}
      {action}
    </div>
  );
}

/** Placeholder tiles keep the grid from jumping while products load. */
export function SkeletonGrid({ count = 8 }) {
  const { t } = useStore();
  return (
    <div className="grid-products" aria-busy="true">
      <span className="sr-only">{t('loading')}</span>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton skeleton-tile" />
      ))}
    </div>
  );
}

export function InlineNotice({ tone = 'info', children }) {
  return <div className={`notice notice--${tone}`}>{children}</div>;
}
