import { supabase } from './supabase';
import type {
  Appointment,
  AppointmentStatus,
  AppointmentWithRelations,
  Customer,
  Location,
  Service,
  Stylist,
} from '@/types';

const relations = `
  *,
  customer:customers(*),
  service:services(*),
  stylist:stylists(*),
  location:locations(*)
`;

export async function fetchLocations(): Promise<Location[]> {
  const { data, error } = await supabase.from('locations').select('*').order('name');
  if (error) throw error;
  return (data ?? []) as Location[];
}

export async function fetchServices(activeOnly = false): Promise<Service[]> {
  let q = supabase.from('services').select('*').order('name');
  if (activeOnly) q = q.eq('active', true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Service[];
}

export async function fetchStylists(): Promise<Stylist[]> {
  const { data, error } = await supabase.from('stylists').select('*').order('name');
  if (error) throw error;
  return (data ?? []) as Stylist[];
}

export async function fetchCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase.from('customers').select('*').order('full_name');
  if (error) throw error;
  return (data ?? []) as Customer[];
}

export async function fetchAppointments(): Promise<AppointmentWithRelations[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select(relations)
    .order('date', { ascending: false })
    .order('time', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as AppointmentWithRelations[];
}

export async function fetchAppointmentsByDateRange(
  start: string,
  end: string,
): Promise<AppointmentWithRelations[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select(relations)
    .gte('date', start)
    .lte('date', end)
    .order('date')
    .order('time');
  if (error) throw error;
  return (data ?? []) as unknown as AppointmentWithRelations[];
}

export async function fetchBookedSlots(
  stylistId: string,
  date: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('time')
    .eq('stylist_id', stylistId)
    .eq('date', date)
    .neq('status', 'cancelled');
  if (error) throw error;
  return (data ?? []).map((r) => r.time);
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<void> {
  const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function upsertService(service: Partial<Service> & { id?: string }): Promise<Service> {
  if (service.id) {
    const { data, error } = await supabase
      .from('services')
      .update({
        name: service.name,
        description: service.description,
        price: service.price,
        duration_minutes: service.duration_minutes,
        active: service.active,
        image_url: service.image_url,
      })
      .eq('id', service.id)
      .select()
      .single();
    if (error) throw error;
    return data as Service;
  }
  const { data, error } = await supabase
    .from('services')
    .insert({
      name: service.name,
      description: service.description,
      price: service.price,
      duration_minutes: service.duration_minutes,
      active: service.active ?? true,
      image_url: service.image_url ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Service;
}

export async function upsertStylist(stylist: Partial<Stylist> & { id?: string }): Promise<Stylist> {
  if (stylist.id) {
    const { data, error } = await supabase
      .from('stylists')
      .update({
        name: stylist.name,
        specialty: stylist.specialty,
        bio: stylist.bio,
        image_url: stylist.image_url,
        location_id: stylist.location_id,
        working_hours: stylist.working_hours,
        available: stylist.available,
      })
      .eq('id', stylist.id)
      .select()
      .single();
    if (error) throw error;
    return data as Stylist;
  }
  const { data, error } = await supabase
    .from('stylists')
    .insert({
      name: stylist.name,
      specialty: stylist.specialty,
      bio: stylist.bio ?? null,
      image_url: stylist.image_url ?? null,
      location_id: stylist.location_id ?? null,
      working_hours: stylist.working_hours ?? {},
      available: stylist.available ?? true,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Stylist;
}

export interface CreateBookingInput {
  customer: { full_name: string; email: string; phone: string; notes?: string };
  service_id: string;
  stylist_id: string;
  location_id: string;
  date: string;
  time: string;
  special_requests?: string;
}

export async function createBooking(input: CreateBookingInput): Promise<Appointment> {
  const bookingRef = `SF-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

  const { data: existing } = await supabase
    .from('appointments')
    .select('id')
    .eq('stylist_id', input.stylist_id)
    .eq('date', input.date)
    .eq('time', input.time)
    .neq('status', 'cancelled')
    .maybeSingle();
  if (existing) throw new Error('That time slot was just booked. Please choose another time.');

  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('email', input.customer.email)
    .maybeSingle();

  let customerId = customer?.id as string | undefined;

  if (!customerId) {
    const { data: newCustomer, error: cErr } = await supabase
      .from('customers')
      .insert({
        full_name: input.customer.full_name,
        email: input.customer.email,
        phone: input.customer.phone,
        notes: input.customer.notes ?? null,
      })
      .select('id')
      .single();
    if (cErr) throw cErr;
    customerId = newCustomer.id;
  } else {
    await supabase
      .from('customers')
      .update({ full_name: input.customer.full_name, phone: input.customer.phone })
      .eq('id', customerId);
  }

  const { data: appt, error: aErr } = await supabase
    .from('appointments')
    .insert({
      booking_ref: bookingRef,
      customer_id: customerId,
      service_id: input.service_id,
      stylist_id: input.stylist_id,
      location_id: input.location_id,
      date: input.date,
      time: input.time,
      status: 'pending',
      special_requests: input.special_requests ?? null,
    })
    .select()
    .single();
  if (aErr) {
    if (aErr.code === '23505') {
      throw new Error('That time slot is already booked for this stylist. Please choose another time.');
    }
    throw aErr;
  }
  return appt as Appointment;
}
