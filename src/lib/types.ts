export type Specialty =
  | 'Cardiology'
  | 'Dermatology'
  | 'Pediatrics'
  | 'Orthopedics'
  | 'Neurology'
  | 'General Medicine'
  | 'Gynecology'
  | 'Ophthalmology'
  | 'Psychiatry';

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: Specialty;
  experienceYears: number;
  qualifications: string;
  hospital: string;
  location: string;
  consultationFee: number;
  rating: number;
  reviewsCount: number;
  avatar: string;
  about: string;
  availableDays: string[];
  timeSlots: string[];
  isAvailableToday: boolean;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type ConsultationType = 'in-clinic' | 'video';

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
}

export interface PrescriptionItem {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  patientId: string;
  patientName: string;
  diagnosis: string;
  items: PrescriptionItem[];
  advice: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: Specialty;
  doctorAvatar: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // e.g. "10:30 AM"
  consultationType: ConsultationType;
  symptoms: string;
  status: AppointmentStatus;
  fee: number;
  createdAt: string;
  prescription?: Prescription;
}

export interface DbStatusResponse {
  connected: boolean;
  mode: 'mysql' | 'mock-memory';
  host?: string;
  database?: string;
  tableCount?: number;
  message: string;
}
