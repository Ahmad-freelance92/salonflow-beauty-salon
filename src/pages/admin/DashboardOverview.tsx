import { useEffect, useMemo, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  CalendarDays, Clock, CheckCircle2, XCircle, DollarSign, TrendingUp,
} from 'lucide-react';
import type { AppointmentWithRelations } from '@/types';
import { fetchAppointments } from '@/lib/db';

interface Props {
  appointments: AppointmentWithRelations[];
  loading: boolean;
}

export default function DashboardOverview({ appointments, loading }: Props) {
  const today = new Date().toISOString().slice(0, 10);

  const stats = useMemo(() => {
    const todays = appointments.filter((a) => a.date === today);
    const pending = appointments.filter((a) => a.status === 'pending').length;
    const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
    const completed = appointments.filter((a) => a.status === 'completed').length;
    const revenue = appointments
      .filter((a) => a.status === 'completed' || a.status === 'confirmed')
      .reduce((sum, a) => sum + (a.service?.price ?? 0), 0);
    return {
      todayTotal: todays.length,
      pending,
      confirmed,
      completed,
      revenue,
    };
  }, [appointments, today]);

  const statusData = useMemo(() => [
    { name: 'Pending', value: stats.pending, color: '#C9A961' },
    { name: 'Confirmed', value: stats.confirmed, color: '#3A3530' },
    { name: 'Completed', value: stats.completed, color: '#10b981' },
    { name: 'Cancelled', value: appointments.filter((a) => a.status === 'cancelled').length, color: '#f43f5e' },
  ], [stats, appointments]);

  const last7 = useMemo(() => {
    const days: { label: string; date: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      days.push({ label: d.toLocaleDateString('en-US', { weekday: 'short' }), date: iso });
    }
    return days.map((d) => {
      const dayAppts = appointments.filter((a) => a.date === d.date);
      const revenue = dayAppts
        .filter((a) => a.status === 'completed' || a.status === 'confirmed')
        .reduce((sum, a) => sum + (a.service?.price ?? 0), 0);
      return { day: d.label, appointments: dayAppts.length, revenue };
    });
  }, [appointments]);

  const serviceMix = useMemo(() => {
    const map = new Map<string, number>();
    appointments.forEach((a) => {
      const name = a.service?.name ?? 'Unknown';
      map.set(name, (map.get(name) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [appointments]);

  const cards = [
    { label: "Today's Appointments", value: stats.todayTotal, icon: CalendarDays, tint: 'bg-charcoal-900 text-ivory' },
    { label: 'Pending', value: stats.pending, icon: Clock, tint: 'bg-gold-500 text-white' },
    { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle2, tint: 'bg-emerald-500 text-white' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, tint: 'bg-blush-300 text-charcoal-900' },
  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-pulse text-charcoal-900/40">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-charcoal-900">Dashboard</h1>
        <p className="text-sm text-charcoal-900/50">Overview of your salon performance</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card flex items-center gap-4 p-5">
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.tint}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-charcoal-900/50">{c.label}</p>
                <p className="font-serif text-3xl font-semibold text-charcoal-900">{c.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue card */}
      <div className="card flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <DollarSign className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-wider text-charcoal-900/50">Estimated Revenue (confirmed + completed)</p>
            <p className="font-serif text-3xl font-semibold text-charcoal-900">${stats.revenue.toLocaleString()}</p>
          </div>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 sm:flex">
          <TrendingUp className="h-3.5 w-3.5" /> Live demo data
        </span>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-serif text-xl font-semibold text-charcoal-900">Appointments & Revenue (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={280} className="mt-4">
            <AreaChart data={last7}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B8973F" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#B8973F" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="apt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2A2622" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2A2622" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EBE0CE" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#3A3530' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#3A3530' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #EBE0CE', fontSize: 12 }}
                labelStyle={{ color: '#2A2622', fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="appointments" stroke="#2A2622" strokeWidth={2} fill="url(#apt)" />
              <Area type="monotone" dataKey="revenue" stroke="#B8973F" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="font-serif text-xl font-semibold text-charcoal-900">Appointment Status</h3>
          <ResponsiveContainer width="100%" height={280} className="mt-4">
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #EBE0CE', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service mix */}
      <div className="card p-6">
        <h3 className="font-serif text-xl font-semibold text-charcoal-900">Appointments by Service</h3>
        <ResponsiveContainer width="100%" height={260} className="mt-4">
          <BarChart data={serviceMix} layout="vertical" margin={{ left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EBE0CE" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#3A3530' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#3A3530' }} axisLine={false} tickLine={false} width={90} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #EBE0CE', fontSize: 12 }} />
            <Bar dataKey="value" fill="#C9A961" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
