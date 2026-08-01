import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="mac-toast">
          {toast.type === 'error' ? (
            <AlertCircle size={16} style={{ color: '#ef4444' }} />
          ) : (
            <CheckCircle2 size={16} style={{ color: '#34c759' }} />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
