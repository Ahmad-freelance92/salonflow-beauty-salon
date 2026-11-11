import { useEffect, useMemo, useState } from 'react';
import {
  Search, Check, X, CheckCircle2, Clock, Loader2, Filter, CalendarDays,
} from 'lucide-react';
import type { AppointmentStatus, AppointmentWithRelations, Location } from '@/types';
import { fetchAppointments, fetchLocations, updateAppointmentStatus } from '@/lib/db';
import { useToast } from '@/components/Toast';
import { formatDateDisplay } from '@/lib/time';
import StatusBadge from '@/components/admin/StatusBadge';

const STATUS_OPTIONS: (AppointmentStatus | 'all')[] = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

export default function AppointmentsPage() {
  const { notify } = useToast();
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [updatingId, setUpdatingId] = useState('');

  async function load() {
    setLoading(true);
    try {
      const [a, l] = await Promise.all([fetchAppointments(), fetchLocations()]);
      setAppointments(a);
      setLocations(l);
    } catch {
      notify('Could not load appointments.', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function changeStatus(id: string, status: AppointmentStatus) {
    setUpdatingId(id);
    try {
      await updateAppointmentStatus(id, status);
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      notify(`Appointment marked as ${status}.`, 'success');
    } catch {
      notify('Could not update appointment status.', 'error');
    } finally {
      setUpdatingId('');
    }
  }

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (locationFilter !== 'all' && a.location_id !== locationFilter) return false;
      if (dateFilter && a.date !== dateFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const matches =
          a.customer?.full_name.toLowerCase().includes(q) ||
          a.booking_ref.toLowerCase().includes(q) ||
          a.service?.name.toLowerCase().includes(q) ||
          a.stylist?.name.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [appointments, statusFilter, locationFilter, dateFilter, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-charcoal-900">Appointments</h1>
        <p className="text-sm text-charcoal-900/50">Manage and track all bookings</p>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="grid gap-3 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-900/40" />
            <input
              className="input-field pl-10" placeholder="Search by customer, ref, service, stylist"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="input-field" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
            <option value="all">All Locations</option>
            {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-900/40" />
            <input type="date" className="input-field pl-10" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition ${
                statusFilter === s ? 'bg-charcoal-900 text-ivory' : 'bg-beige-100 text-charcoal-900/60 hover:bg-beige-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center text-charcoal-900/40">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-charcoal-900/40">
            <Filter className="mb-2 h-8 w-8" />
            <p>No appointments match these filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-beige-200 bg-beige-50 text-left text-xs uppercase tracking-wider text-charcoal-900/50">
                  <th className="px-4 py-3 font-medium">Ref</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Stylist</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-100">
                {filtered.map((a) => (
                  <tr key={a.id} className="transition hover:bg-beige-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-gold-600">{a.booking_ref}</td>
                    <td className="px-4 py-3 font-medium text-charcoal-900">{a.customer?.full_name}</td>
                    <td className="px-4 py-3 text-charcoal-900/70">{a.service?.name}</td>
                    <td className="px-4 py-3 text-charcoal-900/70">{a.stylist?.name}</td>
                    <td className="px-4 py-3 text-charcoal-900/70">{a.location?.name.split('—')[1]?.trim() ?? a.location?.name}</td>
                    <td className="px-4 py-3 text-charcoal-900/70">{formatDateDisplay(a.date)}</td>
                    <td className="px-4 py-3 text-charcoal-900/70">{a.time}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {a.status === 'pending' && (
                          <ActionBtn
                            title="Confirm" onClick={() => changeStatus(a.id, 'confirmed')} disabled={updatingId === a.id}
                            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          >
                            {updatingId === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                          </ActionBtn>
                        )}
                        {(a.status === 'confirmed' || a.status === 'pending') && (
                          <ActionBtn
                            title="Mark completed" onClick={() => changeStatus(a.id, 'completed')} disabled={updatingId === a.id}
                            className="bg-charcoal-900/10 text-charcoal-900 hover:bg-charcoal-900/20"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </ActionBtn>
                        )}
                        {a.status !== 'cancelled' && a.status !== 'completed' && (
                          <ActionBtn
                            title="Cancel" onClick={() => changeStatus(a.id, 'cancelled')} disabled={updatingId === a.id}
                            className="bg-rose-50 text-rose-500 hover:bg-rose-100"
                          >
                            <X className="h-3.5 w-3.5" />
                          </ActionBtn>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-xs text-charcoal-900/40">{filtered.length} appointment(s) shown.</p>
    </div>
  );
}

function ActionBtn({ title, onClick, disabled, className, children }: {
  title: string; onClick: () => void; disabled?: boolean; className: string; children: React.ReactNode;
}) {
  return (
    <button
      title={title} onClick={onClick} disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
