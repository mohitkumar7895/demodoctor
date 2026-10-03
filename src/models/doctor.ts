import { executeQuery, inMemoryStore } from '@/lib/db';
import { Doctor, Specialty } from '@/lib/types';

export class DoctorModel {
  // Map MySQL snake_case row to Doctor interface
  private static mapRow(row: any): Doctor {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      specialty: row.specialty as Specialty,
      experienceYears: Number(row.experience_years ?? row.experienceYears ?? 0),
      qualifications: row.qualifications,
      hospital: row.hospital,
      location: row.location,
      consultationFee: Number(row.consultation_fee ?? row.consultationFee ?? 500),
      rating: Number(row.rating ?? 4.5),
      reviewsCount: Number(row.reviews_count ?? row.reviewsCount ?? 0),
      avatar: row.avatar,
      about: row.about,
      availableDays: typeof row.available_days === 'string' ? JSON.parse(row.available_days) : (row.available_days || row.availableDays || []),
      timeSlots: typeof row.time_slots === 'string' ? JSON.parse(row.time_slots) : (row.time_slots || row.timeSlots || []),
      isAvailableToday: Boolean(row.is_available_today ?? row.isAvailableToday),
    };
  }

  // Get all doctors with optional filters
  static async getAll(filters?: { specialty?: string; search?: string }): Promise<Doctor[]> {
    const res = await executeQuery('SELECT * FROM doctors ORDER BY rating DESC');
    let doctors: Doctor[] = [];

    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      doctors = res.data.map(DoctorModel.mapRow);
    } else {
      doctors = [...inMemoryStore.doctors];
    }

    if (filters?.specialty && filters.specialty !== 'All') {
      doctors = doctors.filter(
        d => d.specialty.toLowerCase() === filters.specialty!.toLowerCase()
      );
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      doctors = doctors.filter(
        d =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.hospital.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q)
      );
    }

    return doctors;
  }

  // Get doctor by ID
  static async getById(id: string): Promise<Doctor | null> {
    const res = await executeQuery('SELECT * FROM doctors WHERE id = ? LIMIT 1', [id]);
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      return DoctorModel.mapRow(res.data[0]);
    }

    const doc = inMemoryStore.doctors.find(d => d.id === id);
    return doc || null;
  }

  // Create a new doctor profile
  static async create(doctor: Omit<Doctor, 'id'>): Promise<Doctor> {
    const newId = `doc-${Date.now()}`;
    const newDoc: Doctor = {
      ...doctor,
      id: newId,
      rating: doctor.rating || 4.8,
      reviewsCount: doctor.reviewsCount || 0,
    };

    // Try inserting into MySQL
    await executeQuery(
      `INSERT INTO doctors (
        id, name, email, specialty, experience_years, qualifications,
        hospital, location, consultation_fee, rating, reviews_count,
        avatar, about, available_days, time_slots, is_available_today
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newDoc.id,
        newDoc.name,
        newDoc.email,
        newDoc.specialty,
        newDoc.experienceYears,
        newDoc.qualifications,
        newDoc.hospital,
        newDoc.location,
        newDoc.consultationFee,
        newDoc.rating,
        newDoc.reviewsCount,
        newDoc.avatar,
        newDoc.about,
        JSON.stringify(newDoc.availableDays),
        JSON.stringify(newDoc.timeSlots),
        newDoc.isAvailableToday ? 1 : 0,
      ]
    );

    // Keep in-memory store in sync
    inMemoryStore.doctors = [newDoc, ...inMemoryStore.doctors];
    return newDoc;
  }
}
