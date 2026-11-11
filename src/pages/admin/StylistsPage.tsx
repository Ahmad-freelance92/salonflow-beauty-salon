import { useEffect, useState } from 'react';
import { Plus, Pencil, X, Loader2, MapPin } from 'lucide-react';
import type { Location, Stylist } from '@/types';
import { fetchLocations, fetchStylists, upsertStylist } from '@/lib/db';
import { useToast } from '@/components/Toast';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function StylistsPage() {
  const { notify } = useToast();
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Stylist | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [s, l] = await Promise.all([fetchStylists(), fetchLocations()]);
      setStylists(s);
      setLocations(l);
    } catch {
      notify('Could not load stylists.', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function save(data: Partial<Stylist> & { id?: string }) {
    try {
      await upsertStylist(data);
      notify(data.id ? 'Stylist updated.' : 'Stylist added.', 'success');
      setShowForm(false);
      setEditing(null);
      load();
    } catch {
      notify('Could not save stylist.', 'error');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-charcoal-900">Stylists</h1>
          <p className="text-sm text-charcoal-900/50">Manage your team of stylists</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Stylist
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center text-charcoal-900/40"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stylists.map((st) => {
            const loc = locations.find((l) => l.id === st.location_id);
            return (
              <div key={st.id} className="card overflow-hidden">
                <div className="flex gap-4 p-5">
                  <img src={st.image_url ?? ''} alt={st.name} className="h-20 w-20 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-xl font-semibold text-charcoal-900">{st.name}</h3>
                      <button onClick={() => { setEditing(st); setShowForm(true); }}
                        className="text-charcoal-900/40 hover:text-gold-600"><Pencil className="h-4 w-4" /></button>
                    </div>
                    <p className="text-xs font-medium text-gold-600">{st.specialty}</p>
                    {st.bio && <p className="mt-1 line-clamp-2 text-xs text-charcoal-900/60">{st.bio}</p>}
                  </div>
                </div>
                <div className="border-t border-beige-100 px-5 py-3">
                  <p className="flex items-center gap-2 text-xs text-charcoal-900/60">
                    <MapPin className="h-3.5 w-3.5 text-gold-600" /> {loc?.name ?? 'Unassigned'}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {DAYS.map((d) => {
                      const off = st.working_hours?.[d] === 'off' || !st.working_hours?.[d];
                      return (
                        <span key={d} className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          off ? 'bg-beige-100 text-charcoal-900/30' : 'bg-emerald-50 text-emerald-600'
                        }`}>{d}</span>
                      );
                    })}
                  </div>
                </div>
                <div className="border-t border-beige-100 px-5 py-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    st.available ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${st.available ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {st.available ? 'Available' : 'On leave'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <StylistForm
          stylist={editing} locations={locations} onClose={() => { setShowForm(false); setEditing(null); }} onSave={save}
        />
      )}
    </div>
  );
}

function StylistForm({ stylist, locations, onClose, onSave }: {
  stylist: Stylist | null;
  locations: Location[];
  onClose: () => void;
  onSave: (data: Partial<Stylist> & { id?: string }) => void;
}) {
  const [name, setName] = useState(stylist?.name ?? '');
  const [specialty, setSpecialty] = useState(stylist?.specialty ?? '');
  const [bio, setBio] = useState(stylist?.bio ?? '');
  const [image_url, setImageUrl] = useState(stylist?.image_url ?? '');
  const [location_id, setLocationId] = useState(stylist?.location_id ?? locations[0]?.id ?? '');
  const [available, setAvailable] = useState(stylist?.available ?? true);
  const [hours, setHours] = useState<Record<string, string>>(
    stylist?.working_hours ?? Object.fromEntries(DAYS.map((d) => [d, d === 'Sun' ? 'off' : '9:00–17'])),
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !specialty.trim()) return;
    onSave({
      id: stylist?.id, name, specialty, bio, image_url: image_url || null,
      location_id: location_id || null, available, working_hours: hours,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-900/40" onClick={onClose} />
      <form onSubmit={submit} className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold text-charcoal-900">{stylist ? 'Edit Stylist' : 'Add Stylist'}</h2>
          <button type="button" onClick={onClose} className="text-charcoal-900/40 hover:text-charcoal-900"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><label className="label-field">Name</label><input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div><label className="label-field">Specialty</label><input className="input-field" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required /></div>
          <div className="sm:col-span-2"><label className="label-field">Bio</label><textarea rows={2} className="input-field resize-none" value={bio} onChange={(e) => setBio(e.target.value)} /></div>
          <div className="sm:col-span-2"><label className="label-field">Photo URL</label><input className="input-field" value={image_url} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" /></div>
          <div><label className="label-field">Assigned Location</label>
            <select className="input-field" value={location_id} onChange={(e) => setLocationId(e.target.value)}>
              <option value="">Unassigned</option>
              {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <div><label className="label-field">Availability</label>
            <select className="input-field" value={available ? 'yes' : 'no'} onChange={(e) => setAvailable(e.target.value === 'yes')}>
              <option value="yes">Available</option><option value="no">On leave</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="label-field">Working Hours</label>
          <div className="space-y-2">
            {DAYS.map((d) => (
              <div key={d} className="flex items-center gap-3">
                <span className="w-10 text-xs font-medium text-charcoal-900/60">{d}</span>
                <select className="input-field flex-1 py-1.5 text-xs" value={hours[d] ?? 'off'} onChange={(e) => setHours({ ...hours, [d]: e.target.value })}>
                  <option value="off">Day off</option>
                  <option value="9:00–17">9:00 AM – 5:00 PM</option>
                  <option value="10:00–18">10:00 AM – 6:00 PM</option>
                  <option value="9:00–19">9:00 AM – 7:00 PM</option>
                  <option value="10:00–20">10:00 AM – 8:00 PM</option>
                  <option value="9:00–16">9:00 AM – 4:00 PM</option>
                </select>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          <button type="submit" className="btn-gold">{stylist ? 'Save Changes' : 'Add Stylist'}</button>
        </div>
      </form>
    </div>
  );
}
