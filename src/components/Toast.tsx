import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  notify: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, type: ToastType = 'success') => {
      const id = ++counter;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => remove(id), 4200);
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    // mount-only; timer handled by provider
  }, []);

  const styles: Record<ToastType, string> = {
    success: 'border-l-4 border-l-emerald-500 bg-white',
    error: 'border-l-4 border-l-rose-500 bg-white',
    info: 'border-l-4 border-l-gold-500 bg-white',
  };
  const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertCircle : Info;
  const iconColor =
    toast.type === 'success'
      ? 'text-emerald-500'
      : toast.type === 'error'
        ? 'text-rose-500'
        : 'text-gold-500';

  return (
    <div className={`animate-fade-in flex items-start gap-3 rounded-xl shadow-card ${styles[toast.type]} px-4 py-3 pr-3 min-w-[280px] max-w-sm`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} />
      <p className="flex-1 text-sm text-charcoal-900">{toast.message}</p>
      <button onClick={onClose} className="text-charcoal-900/40 hover:text-charcoal-900" aria-label="Dismiss">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
