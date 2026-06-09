import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon = '⚽', title, description, action }: EmptyStateProps) {
  return (
    <div className="card grid place-items-center p-10 text-center">
      <div className="text-4xl opacity-50">{icon}</div>
      <h3 className="mt-3 font-display text-lg font-bold text-ink">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
