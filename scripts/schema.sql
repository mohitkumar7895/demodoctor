-- ==============================================================
-- Doctor Appointment & Patient Care Database Schema for MySQL
-- Database: doctor_db
-- ==============================================================

CREATE DATABASE IF NOT EXISTS doctor_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE doctor_db;

-- 1. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  experience_years INT NOT NULL DEFAULT 1,
  qualifications VARCHAR(255) NOT NULL,
  hospital VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  consultation_fee DECIMAL(10, 2) NOT NULL DEFAULT 500.00,
  rating DECIMAL(3, 2) NOT NULL DEFAULT 4.50,
  reviews_count INT NOT NULL DEFAULT 0,
  avatar VARCHAR(500) NOT NULL,
  about TEXT,
  available_days JSON,
  time_slots JSON,
  is_available_today BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Patients Table
CREATE TABLE IF NOT EXISTS patients (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  age INT,
  gender ENUM('Male', 'Female', 'Other') DEFAULT 'Male',
  blood_group VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(64) PRIMARY KEY,
  doctor_id VARCHAR(64) NOT NULL,
  patient_id VARCHAR(64) NOT NULL,
  patient_name VARCHAR(150) NOT NULL,
  patient_email VARCHAR(150) NOT NULL,
  patient_phone VARCHAR(50) NOT NULL,
  patient_age INT,
  patient_gender VARCHAR(20),
  appointment_date DATE NOT NULL,
  appointment_time VARCHAR(50) NOT NULL,
  consultation_type ENUM('in-clinic', 'video') DEFAULT 'in-clinic',
  symptoms TEXT,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  fee DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  INDEX idx_doctor (doctor_id),
  INDEX idx_patient (patient_id),
  INDEX idx_date (appointment_date)
);

-- 4. Prescriptions Table
CREATE TABLE IF NOT EXISTS prescriptions (
  id VARCHAR(64) PRIMARY KEY,
  appointment_id VARCHAR(64) NOT NULL,
  doctor_id VARCHAR(64) NOT NULL,
  patient_id VARCHAR(64) NOT NULL,
  diagnosis TEXT NOT NULL,
  items JSON NOT NULL, -- Array of { medicine, dosage, frequency, duration, instructions }
  advice TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  INDEX idx_appt (appointment_id)
);

-- ==============================================================
-- Initial Seed Data: Top Specialists
-- ==============================================================

INSERT INTO doctors (id, name, email, specialty, experience_years, qualifications, hospital, location, consultation_fee, rating, reviews_count, avatar, about, available_days, time_slots, is_available_today)
VALUES
(
  'doc-1',
  'Dr. Rajesh Sharma',
  'dr.rajesh@medisync.care',
  'Cardiology',
  14,
  'MBBS, MD (Medicine), DM (Cardiology), FACC',
  'Apollo Heart Institute',
  'New Delhi, Connaught Place',
  1200.00,
  4.9,
  142,
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
  'Senior Interventional Cardiologist specializing in preventive heart health, coronary angiographies, and hypertension management with over 14 years of clinical excellence.',
  '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]',
  '["09:00 AM", "10:30 AM", "11:45 AM", "02:00 PM", "04:30 PM", "06:00 PM"]',
  TRUE
),
(
  'doc-2',
  'Dr. Priya Nair',
  'dr.priya@medisync.care',
  'Dermatology',
  9,
  'MBBS, MD (Dermatology, Venereology & Leprosy)',
  'SkinCare & Laser Center',
  'Bangalore, Indiranagar',
  800.00,
  4.8,
  198,
  'https://images.unsplash.com/photo-1594824813583-7c5780516c95?w=400&auto=format&fit=crop&q=80',
  'Expert in aesthetic dermatology, acne scarring treatments, hair-fall therapy, and advanced laser skin rejuvenation.',
  '["Monday", "Wednesday", "Friday", "Saturday"]',
  '["10:00 AM", "11:15 AM", "01:00 PM", "03:30 PM", "05:15 PM"]',
  TRUE
),
(
  'doc-3',
  'Dr. Amitav Mukherjee',
  'dr.amitav@medisync.care',
  'Orthopedics',
  16,
  'MBBS, MS (Orthopedics), M.Ch (Joint Replacement)',
  'Fortis Bone & Joint Hospital',
  'Mumbai, Bandra West',
  1100.00,
  4.9,
  176,
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
  'Renowned orthopedic surgeon specializing in robotic knee and hip replacements, sports injury rehabilitation, and arthroscopic procedures.',
  '["Tuesday", "Thursday", "Saturday"]',
  '["09:30 AM", "11:00 AM", "02:30 PM", "04:00 PM"]',
  TRUE
),
(
  'doc-4',
  'Dr. Sneha Verma',
  'dr.sneha@medisync.care',
  'Pediatrics',
  11,
  'MBBS, DCH, DNB (Pediatrics)',
  'Rainbow Children Hospital',
  'Hyderabad, Banjara Hills',
  700.00,
  4.9,
  230,
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
  'Compassionate pediatrician devoted to child developmental milestones, immunization schedules, newborn care, and pediatric infections.',
  '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]',
  '["09:00 AM", "10:00 AM", "11:30 AM", "03:00 PM", "05:00 PM"]',
  TRUE
),
(
  'doc-5',
  'Dr. Vikram Sethi',
  'dr.vikram@medisync.care',
  'Neurology',
  18,
  'MBBS, MD, DM (Neurology)',
  'Max Neuro Sciences Center',
  'Gurugram, Sector 44',
  1500.00,
  4.8,
  115,
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80',
  'Distinguished neurologist with extensive expertise in stroke management, epilepsy, migraines, Parkinson disease, and neuro-electrophysiology.',
  '["Monday", "Wednesday", "Thursday"]',
  '["10:00 AM", "12:00 PM", "03:00 PM", "05:30 PM"]',
  FALSE
),
(
  'doc-6',
  'Dr. Ananya Roy',
  'dr.ananya@medisync.care',
  'General Medicine',
  8,
  'MBBS, MD (General Medicine)',
  'CarePlus Multispecialty Clinic',
  'Kolkata, Salt Lake',
  600.00,
  4.7,
  165,
  'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&auto=format&fit=crop&q=80',
  'Holistic internal medicine consultant focused on lifestyle disorders, diabetes management, infectious diseases, and preventive adult health checks.',
  '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]',
  '["08:30 AM", "10:00 AM", "11:30 AM", "04:00 PM", "06:00 PM"]',
  TRUE
)
ON DUPLICATE KEY UPDATE name=VALUES(name);
