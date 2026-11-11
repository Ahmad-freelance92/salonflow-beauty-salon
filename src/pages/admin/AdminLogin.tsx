import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Lock, Mail, Sparkles, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';

interface Props {
  onLogin: () => void;
}

const DEMO_EMAIL = 'admin@salonflow.demo';
const DEMO_PASSWORD = 'SalonDemo123!';

export default function AdminLogin({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
        onLogin();
      } else {
        setError('Invalid credentials. Use the demo login shown below.');
        setLoading(false);
      }
    }, 600);
  }

  function fillDemo() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-beige-100 px-5">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-charcoal-900/60 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
        <div className="card overflow-hidden">
          <div className="bg-charcoal-900 px-8 py-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-charcoal-900">
              <Sparkles className="h-6 w-6" />
            </span>
            <h1 className="mt-4 font-serif text-3xl font-semibold text-ivory">SalonFlow Admin</h1>
            <p className="mt-1 text-sm text-ivory/60">Sign in to manage your salon</p>
          </div>

          <form onSubmit={submit} className="space-y-4 p-8">
            <div>
              <label htmlFor="email" className="label-field">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-900/40" />
                <input
                  id="email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10" placeholder="admin@salonflow.demo" required
                />
              </div>
            </div>
            <div>
              <label htmlFor="pw" className="label-field">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-900/40" />
                <input
                  id="pw" type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10" placeholder="••••••••" required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-gold w-full">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : <>Sign In</>}
            </button>
          </form>

          <div className="mx-8 mb-8 rounded-xl border border-gold-500/30 bg-gold-500/5 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-600">
              <ShieldCheck className="h-4 w-4" /> Demo Login
            </div>
            <p className="mt-2 text-sm text-charcoal-900/70">
              Email: <span className="font-medium text-charcoal-900">{DEMO_EMAIL}</span>
            </p>
            <p className="text-sm text-charcoal-900/70">
              Password: <span className="font-medium text-charcoal-900">{DEMO_PASSWORD}</span>
            </p>
            <button onClick={fillDemo} className="mt-3 text-xs font-medium text-gold-600 hover:text-gold-500">
              Click to fill demo credentials →
            </button>
            <p className="mt-3 text-xs text-charcoal-900/40">
              This is demo authentication for the prototype only — not production security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
