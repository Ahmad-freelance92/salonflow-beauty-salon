import { useEffect, useMemo, useState } from 'react';
import { Search, X, Mail, Phone, Calendar, Clock, Loader2 } from 'lucide-react';
import type { AppointmentWithRelations, Customer } from '@/types';
import { fetchAppointments, fetchCustomers } from '@/lib/db';
import { useToast } from '@/components/Toast';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatDateDisplay } from '@/lib/time';

export default function CustomersPage() {
  const { notify } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Customer | null>(null);

  useEffect(() => {
    Promise.all([fetchCustomers(), fetchAppointments()])
      .then(([c, a]) => { setCustomers(c); setAppointments(a); })
      .catch(() => notify('Could not load customers.', 'error'))
      .finally(() => setLoading(false));
  }, [notify]);

  const enriched = useMemo(() => {
    return customers.map((c) => {
      const appts = appointments.filter((a) => a.customer_id === c.id);
      const completed = appts.filter((a) => a.status === 'completed');
      const last = appts.sort((a, b) => (a.date < b.date ? 1 : -1))[0];
      return {
        ...c,
        totalVisits: completed.length,
        totalAppointments: appts.length,
        lastAppointment: last,
      };
    });
  }, [customers, appointments]);

  const filtered = useMemo(() => {
    if (!search) return enriched;
    const q = search.toLowerCase();
    return enriched.filter((c) => c.full_name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }, [enriched, search]);

  const selectedAppts = useMemo(
    () => appointments.filter((a) => a.customer_id === selected?.id).sort((a, b) => (a.date < b.date ? 1 : -1)),
    [appointments, selected],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-charcoal-900">Customers</h1>
        <p className="text-sm text-charcoal-900/50">View customer profiles and booking history</p>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-900/40" />
          <input className="input-field pl-10" placeholder="Search by name or email"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-charcoal-900/40"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-beige-200 bg-beige-50 text-left text-xs uppercase tracking-wider text-charcoal-900/50">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Visits</th>
                  <th className="px-4 py-3 font-medium">Last Appointment</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-beige-50/50">
                    <td className="px-4 py-3 font-medium text-charcoal-900">{c.full_name}</td>
                    <td className="px-4 py-3 text-charcoal-900/70">{c.email}</td>
                    <td className="px-4 py-3 text-charcoal-900/70">{c.phone}</td>
                    <td className="px-4 py-3 text-charcoal-900/70">{c.totalVisits}</td>
                    <td className="px-4 py-3 text-charcoal-900/70">
                      {c.lastAppointment ? formatDateDisplay(c.lastAppointment.date) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelected(c)}
                        className="rounded-lg bg-charcoal-900/10 px-3 py-1.5 text-xs font-medium text-charcoal-900 hover:bg-charcoal-900/20">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-charcoal-900/40" onClick={() => setSelected(null)} />
          <div className="relative h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-beige-200 px-6 py-4">
              <h2 className="font-serif text-2xl font-semibold text-charcoal-900">Customer Details</h2>
              <button onClick={() => setSelected(null)} className="text-charcoal-900/40 hover:text-charcoal-900">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blush-100 font-serif text-xl font-semibold text-charcoal-900">
                  {selected.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </span>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-charcoal-900">{selected.full_name}</h3>
                  <p className="text-xs text-charcoal-900/50">Customer since {new Date(selected.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <p className="flex items-center gap-3 text-charcoal-900/70"><Mail className="h-4 w-4 text-gold-600" /> {selected.email}</p>
                <p className="flex items-center gap-3 text-charcoal-900/70"><Phone className="h-4 w-4 text-gold-600" /> {selected.phone}</p>
                {selected.notes && <p className="rounded-xl bg-beige-100 p-3 text-charcoal-900/70">{selected.notes}</p>}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-beige-100 p-4 text-center">
                  <p className="font-serif text-2xl font-semibold text-charcoal-900">{selectedAppts.length}</p>
                  <p className="text-xs text-charcoal-900/50">Total Appointments</p>
                </div>
                <div className="rounded-xl bg-beige-100 p-4 text-center">
                  <p className="font-serif text-2xl font-semibold text-charcoal-900">{selectedAppts.filter((a) => a.status === 'completed').length}</p>
                  <p className="text-xs text-charcoal-900/50">Completed Visits</p>
                </div>
              </div>

              <h4 className="mt-6 mb-3 text-xs font-medium uppercase tracking-wider text-charcoal-900/50">Booking History</h4>
              <div className="space-y-2">
                {selectedAppts.length === 0 ? (
                  <p className="text-sm text-charcoal-900/40">No appointments yet.</p>
                ) : selectedAppts.map((a) => (
                  <div key={a.id} className="rounded-xl border border-beige-200 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-charcoal-900">{a.service?.name}</p>
                      <StatusBadge status={a.status} />
                    </div>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-charcoal-900/50">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDateDisplay(a.date)}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.time}</span>
                    </div>
                    <p className="mt-1 text-xs text-charcoal-900/50">with {a.stylist?.name} · {a.location?.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
