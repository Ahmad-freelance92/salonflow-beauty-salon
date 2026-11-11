import type { AppointmentStatus } from '@/types';
import { Clock, CheckCircle2, Check, XCircle } from 'lucide-react';

const MAP: Record<AppointmentStatus, { label: string; icon: typeof Clock; classes: string; dot: string }> = {
  pending: { label: 'Pending', icon: Clock, classes: 'bg-gold-500/10 text-gold-600', dot: 'bg-gold-500' },
  confirmed: { label: 'Confirmed', icon: Check, classes: 'bg-charcoal-900/10 text-charcoal-900', dot: 'bg-charcoal-900' },
  completed: { label: 'Completed', icon: CheckCircle2, classes: 'bg-emerald-500/10 text-emerald-600', dot: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', icon: XCircle, classes: 'bg-rose-500/10 text-rose-500', dot: 'bg-rose-500' },
};

export default function StatusBadge({ status }: { status: AppointmentStatus }) {
  const m = MAP[status];
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${m.classes}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
      <Icon className="h-3 w-3 opacity-50" />
    </span>
  );
}
