import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import type { AppointmentStatus, AppointmentWithRelations } from '@/types';
import { fetchAppointmentsByDateRange } from '@/lib/db';
import { useToast } from '@/components/Toast';

const STATUS_COLOR: Record<AppointmentStatus, string> = {
  pending: 'bg-gold-500/20 text-gold-600 border-gold-500/30',
  confirmed: 'bg-charcoal-900/15 text-charcoal-900 border-charcoal-900/20',
  completed: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
  cancelled: 'bg-rose-500/15 text-rose-500 border-rose-500/30 line-through',
};

export default function CalendarPage() {
  const { notify } = useToast();
  const [view, setView] = useState<'week' | 'month'>('week');
  const [cursor, setCursor] = useState(new Date());
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const start = view === 'week' ? weekStart(cursor) : monthStart(cursor);
    const end = view === 'week' ? addDays(start, 6) : monthEnd(cursor);
    fetchAppointmentsByDateRange(start, end)
      .then(setAppointments)
      .catch(() => notify('Could not load calendar data.', 'error'))
      .finally(() => setLoading(false));
  }, [cursor, view, notify]);

  const days = useMemo(() => {
    if (view === 'week') {
      const start = weekStart(cursor);
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }
    const start = monthStart(cursor);
    const end = monthEnd(cursor);
    const gridStart = weekStart(start);
    const gridEnd = weekEnd(end);
    const arr: Date[] = [];
    for (let d = new Date(gridStart); d <= gridEnd; d = addDays(d, 1)) arr.push(new Date(d));
    return arr;
  }, [cursor, view]);

  const apptsByDate = useMemo(() => {
    const m = new Map<string, AppointmentWithRelations[]>();
    appointments.forEach((a) => {
      const list = m.get(a.date) ?? [];
      list.push(a);
      m.set(a.date, list);
    });
    return m;
  }, [appointments]);

  const title = view === 'week'
    ? `${weekStart(cursor).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${addDays(weekStart(cursor), 6).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-charcoal-900">Calendar</h1>
          <p className="text-sm text-charcoal-900/50">Weekly and monthly appointment view</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full bg-beige-100 p-1">
            <button
              onClick={() => setView('week')}
              className={`rounded-full px-4 py-1.5 text-xs font-medium ${view === 'week' ? 'bg-charcoal-900 text-ivory' : 'text-charcoal-900/60'}`}
            >Week</button>
            <button
              onClick={() => setView('month')}
              className={`rounded-full px-4 py-1.5 text-xs font-medium ${view === 'month' ? 'bg-charcoal-900 text-ivory' : 'text-charcoal-900/60'}`}
            >Month</button>
          </div>
        </div>
      </div>

      <div className="card p-4 lg:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-charcoal-900">{title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCursor((c) => shift(c, view, -1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-beige-200 text-charcoal-900 hover:bg-beige-100"
            ><ChevronLeft className="h-4 w-4" /></button>
            <button
              onClick={() => setCursor(new Date())}
              className="rounded-lg border border-beige-200 px-3 py-1.5 text-xs font-medium text-charcoal-900 hover:bg-beige-100"
            >Today</button>
            <button
              onClick={() => setCursor((c) => shift(c, view, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-beige-200 text-charcoal-900 hover:bg-beige-100"
            ><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-4 flex flex-wrap gap-3 text-xs">
          {(['pending', 'confirmed', 'completed', 'cancelled'] as AppointmentStatus[]).map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 capitalize text-charcoal-900/60">
              <span className={`h-2.5 w-2.5 rounded-sm border ${STATUS_COLOR[s]}`} /> {s}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center text-charcoal-900/40">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            {/* Day headers */}
            <div className={`grid gap-2 ${view === 'week' ? 'grid-cols-7' : 'grid-cols-7'}`}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="pb-2 text-center text-xs font-medium uppercase tracking-wider text-charcoal-900/40">{d}</div>
              ))}
              {days.map((d) => {
                const iso = toISO(d);
                const inMonth = view === 'week' || d.getMonth() === cursor.getMonth();
                const isToday = iso === new Date().toISOString().slice(0, 10);
                const dayAppts = apptsByDate.get(iso) ?? [];
                return (
                  <div
                    key={iso}
                    className={`min-h-[80px] rounded-xl border p-2 lg:min-h-[110px] ${
                      inMonth ? 'border-beige-200 bg-white' : 'border-beige-100 bg-beige-50/50'
                    } ${isToday ? 'ring-2 ring-gold-500/40' : ''}`}
                  >
                    <p className={`text-xs font-medium ${inMonth ? 'text-charcoal-900' : 'text-charcoal-900/30'} ${isToday ? 'text-gold-600' : ''}`}>
                      {d.getDate()}
                    </p>
                    <div className="mt-1 space-y-1">
                      {dayAppts.slice(0, view === 'week' ? 6 : 2).map((a) => (
                        <div
                          key={a.id}
                          className={`truncate rounded border px-1.5 py-0.5 text-[10px] font-medium ${STATUS_COLOR[a.status]}`}
                          title={`${a.time} — ${a.customer?.full_name} — ${a.service?.name}`}
                        >
                          <span className="hidden sm:inline">{a.time} </span>{a.customer?.full_name}
                        </div>
                      ))}
                      {dayAppts.length > (view === 'week' ? 6 : 2) && (
                        <p className="text-[10px] text-charcoal-900/40">+{dayAppts.length - (view === 'week' ? 6 : 2)} more</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function weekStart(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  r.setDate(r.getDate() - r.getDay());
  return r;
}
function weekEnd(d: Date): Date {
  const r = weekStart(d);
  r.setDate(r.getDate() + 6);
  return r;
}
function monthStart(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function monthEnd(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function shift(d: Date, view: 'week' | 'month', dir: number): Date {
  const r = new Date(d);
  if (view === 'week') r.setDate(r.getDate() + dir * 7);
  else r.setMonth(r.getMonth() + dir);
  return r;
}
function toISO(d: Date): string {
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}
