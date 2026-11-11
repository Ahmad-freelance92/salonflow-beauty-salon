import { useEffect, useState } from 'react';
import { Plus, Pencil, X, Clock, Loader2, DollarSign } from 'lucide-react';
import type { Service } from '@/types';
import { fetchServices, upsertService } from '@/lib/db';
import { useToast } from '@/components/Toast';

export default function ServicesPage() {
  const { notify } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setServices(await fetchServices());
    } catch {
      notify('Could not load services.', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggleActive(s: Service) {
    try {
      await upsertService({ ...s, active: !s.active });
      setServices((prev) => prev.map((x) => (x.id === s.id ? { ...x, active: !x.active } : x)));
      notify(`Service ${s.active ? 'deactivated' : 'activated'}.`, 'success');
    } catch {
      notify('Could not update service.', 'error');
    }
  }

  async function save(data: Partial<Service> & { id?: string }) {
    try {
      await upsertService(data);
      notify(data.id ? 'Service updated.' : 'Service added.', 'success');
      setShowForm(false);
      setEditing(null);
      load();
    } catch {
      notify('Could not save service.', 'error');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-charcoal-900">Services</h1>
          <p className="text-sm text-charcoal-900/50">Manage services, pricing, and availability</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center text-charcoal-900/40"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-beige-200 bg-beige-50 text-left text-xs uppercase tracking-wider text-charcoal-900/50">
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Duration</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-100">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-beige-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={s.image_url ?? ''} alt={s.name} className="h-10 w-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium text-charcoal-900">{s.name}</p>
                          <p className="line-clamp-1 max-w-xs text-xs text-charcoal-900/50">{s.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 text-charcoal-900/70"><Clock className="h-3.5 w-3.5" /> {s.duration_minutes} min</span></td>
                    <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 font-medium text-gold-600"><DollarSign className="h-3.5 w-3.5" />{s.price}</span></td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(s)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          s.active ? 'bg-emerald-50 text-emerald-600' : 'bg-beige-100 text-charcoal-900/50'
                        }`}>
                        {s.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => { setEditing(s); setShowForm(true); }}
                        className="text-charcoal-900/40 hover:text-gold-600"><Pencil className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <ServiceForm service={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSave={save} />
      )}
    </div>
  );
}

function ServiceForm({ service, onClose, onSave }: {
  service: Service | null;
  onClose: () => void;
  onSave: (data: Partial<Service> & { id?: string }) => void;
}) {
  const [name, setName] = useState(service?.name ?? '');
  const [description, setDescription] = useState(service?.description ?? '');
  const [price, setPrice] = useState(String(service?.price ?? ''));
  const [duration, setDuration] = useState(String(service?.duration_minutes ?? '60'));
  const [image_url, setImageUrl] = useState(service?.image_url ?? '');
  const [active, setActive] = useState(service?.active ?? true);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    onSave({
      id: service?.id, name, description,
      price: Number(price) || 0,
      duration_minutes: Number(duration) || 60,
      image_url: image_url || null,
      active,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-900/40" onClick={onClose} />
      <form onSubmit={submit} className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold text-charcoal-900">{service ? 'Edit Service' : 'Add Service'}</h2>
          <button type="button" onClick={onClose} className="text-charcoal-900/40 hover:text-charcoal-900"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-4 grid gap-4">
          <div><label className="label-field">Service Name</label><input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div><label className="label-field">Description</label><textarea rows={3} className="input-field resize-none" value={description} onChange={(e) => setDescription(e.target.value)} required /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label-field">Price ($)</label><input type="number" min="0" step="1" className="input-field" value={price} onChange={(e) => setPrice(e.target.value)} required /></div>
            <div><label className="label-field">Duration (minutes)</label><input type="number" min="5" step="5" className="input-field" value={duration} onChange={(e) => setDuration(e.target.value)} required /></div>
          </div>
          <div><label className="label-field">Image URL</label><input className="input-field" value={image_url} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" /></div>
          <div><label className="label-field">Status</label>
            <select className="input-field" value={active ? 'yes' : 'no'} onChange={(e) => setActive(e.target.value === 'yes')}>
              <option value="yes">Active</option><option value="no">Inactive</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          <button type="submit" className="btn-gold">{service ? 'Save Changes' : 'Add Service'}</button>
        </div>
      </form>
    </div>
  );
}
