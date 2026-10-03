import { executeQuery, inMemoryStore } from '@/lib/db';
import { Appointment, AppointmentStatus, Specialty } from '@/lib/types';
import { PrescriptionModel } from './prescription';

export class AppointmentModel {
  // Map MySQL row to Appointment object
  private static async mapRow(row: any): Promise<Appointment> {
    const appt: Appointment = {
      id: row.id,
      doctorId: row.doctor_id || row.doctorId,
      doctorName: row.doctor_name || row.doctorName || 'Doctor',
      doctorSpecialty: (row.doctor_specialty || row.doctorSpecialty || 'General Medicine') as Specialty,
      doctorAvatar: row.doctor_avatar || row.doctorAvatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
      patientId: row.patient_id || row.patientId,
      patientName: row.patient_name || row.patientName,
      patientEmail: row.patient_email || row.patientEmail,
      patientPhone: row.patient_phone || row.patientPhone,
      patientAge: row.patient_age || row.patientAge,
      patientGender: row.patient_gender || row.patientGender,
      appointmentDate: typeof row.appointment_date === 'string' 
        ? row.appointment_date.split('T')[0] 
        : (row.appointmentDate || ''),
      appointmentTime: row.appointment_time || row.appointmentTime,
      consultationType: row.consultation_type || row.consultationType || 'in-clinic',
      symptoms: row.symptoms || '',
      status: (row.status as AppointmentStatus) || 'pending',
      fee: Number(row.fee || 500),
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : (row.createdAt || new Date().toISOString()),
    };

    // Attach prescription if available
    const presc = await PrescriptionModel.getByAppointmentId(appt.id);
    if (presc) {
      appt.prescription = presc;
    }

    return appt;
  }

  // Get all appointments with optional filters
  static async getAll(filters?: {
    doctorId?: string;
    patientEmail?: string;
    status?: string;
  }): Promise<Appointment[]> {
    let sql = `
      SELECT a.*, d.name as doctor_name, d.specialty as doctor_specialty, d.avatar as doctor_avatar 
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters?.doctorId) {
      sql += ' AND a.doctor_id = ?';
      params.push(filters.doctorId);
    }
    if (filters?.patientEmail) {
      sql += ' AND a.patient_email = ?';
      params.push(filters.patientEmail);
    }
    if (filters?.status && filters.status !== 'all') {
      sql += ' AND a.status = ?';
      params.push(filters.status);
    }

    sql += ' ORDER BY a.created_at DESC';

    const res = await executeQuery(sql, params);

    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      return Promise.all(res.data.map(AppointmentModel.mapRow));
    }

    // In-memory fallback
    let list = [...inMemoryStore.appointments];
    if (filters?.doctorId) {
      list = list.filter(a => a.doctorId === filters.doctorId);
    }
    if (filters?.patientEmail) {
      list = list.filter(a => a.patientEmail.toLowerCase() === filters.patientEmail!.toLowerCase());
    }
    if (filters?.status && filters.status !== 'all') {
      list = list.filter(a => a.status === filters.status);
    }

    // Also enrich with prescription if any
    for (const appt of list) {
      const presc = inMemoryStore.prescriptions.find(p => p.appointmentId === appt.id);
      if (presc) appt.prescription = presc;
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Get appointment by ID
  static async getById(id: string): Promise<Appointment | null> {
    const res = await executeQuery(
      `SELECT a.*, d.name as doctor_name, d.specialty as doctor_specialty, d.avatar as doctor_avatar 
       FROM appointments a
       LEFT JOIN doctors d ON a.doctor_id = d.id
       WHERE a.id = ? LIMIT 1`,
      [id]
    );

    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      return AppointmentModel.mapRow(res.data[0]);
    }

    const appt = inMemoryStore.appointments.find(a => a.id === id);
    if (appt) {
      const presc = inMemoryStore.prescriptions.find(p => p.appointmentId === appt.id);
      if (presc) appt.prescription = presc;
      return appt;
    }

    return null;
  }

  // Create new appointment
  static async create(data: {
    doctorId: string;
    doctorName: string;
    doctorSpecialty: Specialty;
    doctorAvatar: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientAge?: number;
    patientGender?: string;
    appointmentDate: string;
    appointmentTime: string;
    consultationType: 'in-clinic' | 'video';
    symptoms: string;
    fee: number;
  }): Promise<Appointment> {
    const newId = `appt-${Date.now()}`;
    const patientId = `pat-${data.patientEmail.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10)}`;

    const newAppt: Appointment = {
      id: newId,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      doctorSpecialty: data.doctorSpecialty,
      doctorAvatar: data.doctorAvatar,
      patientId,
      patientName: data.patientName,
      patientEmail: data.patientEmail,
      patientPhone: data.patientPhone,
      patientAge: data.patientAge,
      patientGender: data.patientGender,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      consultationType: data.consultationType,
      symptoms: data.symptoms || '',
      status: 'pending',
      fee: data.fee,
      createdAt: new Date().toISOString(),
    };

    // Insert into MySQL
    await executeQuery(
      `INSERT INTO appointments (
        id, doctor_id, patient_id, patient_name, patient_email, patient_phone,
        patient_age, patient_gender, appointment_date, appointment_time,
        consultation_type, symptoms, status, fee, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        newAppt.id,
        newAppt.doctorId,
        newAppt.patientId,
        newAppt.patientName,
        newAppt.patientEmail,
        newAppt.patientPhone,
        newAppt.patientAge || null,
        newAppt.patientGender || null,
        newAppt.appointmentDate,
        newAppt.appointmentTime,
        newAppt.consultationType,
        newAppt.symptoms,
        newAppt.status,
        newAppt.fee,
      ]
    );

    // Save in-memory
    inMemoryStore.appointments = [newAppt, ...inMemoryStore.appointments];

    return newAppt;
  }

  // Update appointment status
  static async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment | null> {
    await executeQuery('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);

    // Update in-memory
    const idx = inMemoryStore.appointments.findIndex(a => a.id === id);
    if (idx !== -1) {
      inMemoryStore.appointments[idx].status = status;
      return inMemoryStore.appointments[idx];
    }

    return AppointmentModel.getById(id);
  }

  // Get statistics for Doctor dashboard
  static async getStats(doctorId?: string) {
    const appointments = await AppointmentModel.getAll(doctorId ? { doctorId } : undefined);

    const total = appointments.length;
    const pending = appointments.filter(a => a.status === 'pending').length;
    const confirmed = appointments.filter(a => a.status === 'confirmed').length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;

    const todayDate = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => a.appointmentDate === todayDate);

    const totalRevenue = appointments
      .filter(a => a.status === 'completed' || a.status === 'confirmed')
      .reduce((sum, a) => sum + (Number(a.fee) || 0), 0);

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      todayCount: todayAppointments.length,
      totalRevenue,
    };
  }
}
