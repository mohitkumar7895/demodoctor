import mysql from 'mysql2/promise';
import { INITIAL_DOCTORS, INITIAL_APPOINTMENTS } from './mock-data';
import { Doctor, Appointment, Prescription, DbStatusResponse } from './types';

// MySQL Pool Configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'doctor_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Global in-memory storage fallback for seamless testing
declare global {
  var _mockDoctors: Doctor[] | undefined;
  var _mockAppointments: Appointment[] | undefined;
  var _mockPrescriptions: Prescription[] | undefined;
  var _mysqlPool: mysql.Pool | undefined;
}

if (!global._mockDoctors) {
  global._mockDoctors = [...INITIAL_DOCTORS];
}
if (!global._mockAppointments) {
  global._mockAppointments = [...INITIAL_APPOINTMENTS];
}
if (!global._mockPrescriptions) {
  global._mockPrescriptions = INITIAL_APPOINTMENTS
    .filter(a => a.prescription)
    .map(a => a.prescription as Prescription);
}

export const inMemoryStore = {
  get doctors() {
    return global._mockDoctors!;
  },
  set doctors(val: Doctor[]) {
    global._mockDoctors = val;
  },
  get appointments() {
    return global._mockAppointments!;
  },
  set appointments(val: Appointment[]) {
    global._mockAppointments = val;
  },
  get prescriptions() {
    return global._mockPrescriptions!;
  },
  set prescriptions(val: Prescription[]) {
    global._mockPrescriptions = val;
  },
};

// Get or initialize MySQL pool
export function getPool(): mysql.Pool {
  if (!global._mysqlPool) {
    global._mysqlPool = mysql.createPool(dbConfig);
  }
  return global._mysqlPool;
}

// Check database connectivity
export async function checkDbConnection(): Promise<DbStatusResponse> {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT 1 as test');
    if (Array.isArray(rows)) {
      const [tableRows]: any = await pool.query(
        "SELECT COUNT(*) as cnt FROM information_schema.tables WHERE table_schema = ?",
        [dbConfig.database]
      );
      const count = tableRows?.[0]?.cnt || 0;
      return {
        connected: true,
        mode: 'mysql',
        host: dbConfig.host,
        database: dbConfig.database,
        tableCount: count,
        message: `Successfully connected to MySQL database '${dbConfig.database}' on ${dbConfig.host}:${dbConfig.port}`,
      };
    }
  } catch (err: any) {
    // MySQL not reachable or not created yet
    return {
      connected: false,
      mode: 'mock-memory',
      host: dbConfig.host,
      database: dbConfig.database,
      tableCount: 0,
      message: `MySQL not reachable (${err.message || 'connection failed'}). Running in interactive In-Memory Mode. Data is live & fully functional!`,
    };
  }

  return {
    connected: false,
    mode: 'mock-memory',
    message: 'Using in-memory data store',
  };
}

// Execute query on MySQL with automatic fallback to mock store if DB is down
export async function executeQuery<T = any>(
  sql: string,
  params: any[] = []
): Promise<{ success: boolean; data?: T; isMock: boolean; error?: string }> {
  try {
    const pool = getPool();
    const [results] = await pool.query(sql, params);
    return { success: true, data: results as T, isMock: false };
  } catch (err: any) {
    // If MySQL connection fails, we log and indicate mock mode
    return {
      success: false,
      isMock: true,
      error: err.message,
    };
  }
}

// Auto Initialize MySQL schema & tables
export async function initializeMysqlTables(): Promise<{ success: boolean; message: string }> {
  try {
    // First connect without specifying database to create database if not exists
    const rootConn = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
    });

    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await rootConn.end();

    const pool = getPool();

    // 1. Doctors table
    await pool.query(`
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
      ) ENGINE=InnoDB;
    `);

    // 2. Patients table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        phone VARCHAR(50) NOT NULL,
        age INT,
        gender ENUM('Male', 'Female', 'Other') DEFAULT 'Male',
        blood_group VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // 3. Appointments table
    await pool.query(`
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
        INDEX idx_doctor (doctor_id),
        INDEX idx_patient (patient_id)
      ) ENGINE=InnoDB;
    `);

    // 4. Prescriptions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id VARCHAR(64) PRIMARY KEY,
        appointment_id VARCHAR(64) NOT NULL,
        doctor_id VARCHAR(64) NOT NULL,
        patient_id VARCHAR(64) NOT NULL,
        diagnosis TEXT NOT NULL,
        items JSON NOT NULL,
        advice TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_appt (appointment_id)
      ) ENGINE=InnoDB;
    `);

    // Seed doctors if table is empty
    const [existing]: any = await pool.query('SELECT COUNT(*) as count FROM doctors');
    if (existing[0]?.count === 0) {
      for (const doc of INITIAL_DOCTORS) {
        await pool.query(
          `INSERT INTO doctors (
            id, name, email, specialty, experience_years, qualifications,
            hospital, location, consultation_fee, rating, reviews_count,
            avatar, about, available_days, time_slots, is_available_today
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            doc.id,
            doc.name,
            doc.email,
            doc.specialty,
            doc.experienceYears,
            doc.qualifications,
            doc.hospital,
            doc.location,
            doc.consultationFee,
            doc.rating,
            doc.reviewsCount,
            doc.avatar,
            doc.about,
            JSON.stringify(doc.availableDays),
            JSON.stringify(doc.timeSlots),
            doc.isAvailableToday ? 1 : 0,
          ]
        );
      }
    }

    return {
      success: true,
      message: `MySQL tables initialized and seeded successfully in database '${dbConfig.database}'!`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to initialize MySQL tables: ${err.message}`,
    };
  }
}
