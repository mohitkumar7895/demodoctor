import { executeQuery, inMemoryStore } from '@/lib/db';
import { Prescription, PrescriptionItem } from '@/lib/types';

export class PrescriptionModel {
  private static mapRow(row: any): Prescription {
    return {
      id: row.id,
      appointmentId: row.appointment_id || row.appointmentId,
      doctorId: row.doctor_id || row.doctorId,
      doctorName: row.doctor_name || row.doctorName || 'Doctor',
      doctorSpecialty: row.doctor_specialty || row.doctorSpecialty || 'General',
      patientId: row.patient_id || row.patientId,
      patientName: row.patient_name || row.patientName || 'Patient',
      diagnosis: row.diagnosis,
      items: typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []),
      advice: row.advice || '',
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : (row.createdAt || new Date().toISOString()),
    };
  }

  // Get prescription for a specific appointment
  static async getByAppointmentId(appointmentId: string): Promise<Prescription | null> {
    const res = await executeQuery(
      `SELECT p.*, d.name as doctor_name, d.specialty as doctor_specialty 
       FROM prescriptions p
       LEFT JOIN doctors d ON p.doctor_id = d.id
       WHERE p.appointment_id = ? LIMIT 1`,
      [appointmentId]
    );

    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      return PrescriptionModel.mapRow(res.data[0]);
    }

    const item = inMemoryStore.prescriptions.find(p => p.appointmentId === appointmentId);
    return item || null;
  }

  // Get all prescriptions for a patient
  static async getByPatientId(patientId: string): Promise<Prescription[]> {
    const res = await executeQuery(
      `SELECT p.*, d.name as doctor_name, d.specialty as doctor_specialty 
       FROM prescriptions p
       LEFT JOIN doctors d ON p.doctor_id = d.id
       WHERE p.patient_id = ? ORDER BY p.created_at DESC`,
      [patientId]
    );

    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      return res.data.map(PrescriptionModel.mapRow);
    }

    return inMemoryStore.prescriptions.filter(p => p.patientId === patientId);
  }

  // Create a new prescription
  static async create(data: {
    appointmentId: string;
    doctorId: string;
    doctorName: string;
    doctorSpecialty: string;
    patientId: string;
    patientName: string;
    diagnosis: string;
    items: PrescriptionItem[];
    advice: string;
  }): Promise<Prescription> {
    const newId = `presc-${Date.now()}`;
    const newPrescription: Prescription = {
      id: newId,
      appointmentId: data.appointmentId,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      doctorSpecialty: data.doctorSpecialty,
      patientId: data.patientId,
      patientName: data.patientName,
      diagnosis: data.diagnosis,
      items: data.items,
      advice: data.advice,
      createdAt: new Date().toISOString(),
    };

    // Save to MySQL
    await executeQuery(
      `INSERT INTO prescriptions (
        id, appointment_id, doctor_id, patient_id, diagnosis, items, advice, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        newPrescription.id,
        newPrescription.appointmentId,
        newPrescription.doctorId,
        newPrescription.patientId,
        newPrescription.diagnosis,
        JSON.stringify(newPrescription.items),
        newPrescription.advice,
      ]
    );

    // Save in-memory
    inMemoryStore.prescriptions = [newPrescription, ...inMemoryStore.prescriptions];

    // Mark appointment as completed
    const appt = inMemoryStore.appointments.find(a => a.id === data.appointmentId);
    if (appt) {
      appt.status = 'completed';
      appt.prescription = newPrescription;
    }
    await executeQuery('UPDATE appointments SET status = "completed" WHERE id = ?', [data.appointmentId]);

    return newPrescription;
  }
}
