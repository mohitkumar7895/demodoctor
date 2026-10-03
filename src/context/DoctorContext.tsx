'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Doctor, Appointment, AppointmentStatus, Prescription, DbStatusResponse } from '@/lib/types';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface DoctorContextType {
  doctors: Doctor[];
  appointments: Appointment[];
  loading: boolean;
  selectedDoctor: Doctor | null;
  activeAppointmentForPrescription: Appointment | null;
  isBookingOpen: boolean;
  isDetailsOpen: boolean;
  isPrescriptionOpen: boolean;
  isDbModalOpen: boolean;
  selectedSpecialty: string;
  searchQuery: string;
  selectedLocation: string;
  userRole: 'patient' | 'doctor';
  activeTab: 'home' | 'find-doctors' | 'specialities' | 'my-appointments' | 'doctor-portal' | 'blogs' | 'rare-cases';
  dbStatus: DbStatusResponse | null;
  toast: ToastState | null;
  patientUser: {
    name: string;
    email: string;
    phone: string;
  };
  // Actions
  setRole: (role: 'patient' | 'doctor') => void;
  setActiveTab: (tab: 'home' | 'find-doctors' | 'specialities' | 'my-appointments' | 'doctor-portal' | 'blogs' | 'rare-cases') => void;
  setSelectedSpecialty: (specialty: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedLocation: (loc: string) => void;
  openBooking: (doctor?: Doctor) => void;
  closeBooking: () => void;
  openDoctorDetails: (doctor: Doctor) => void;
  closeDoctorDetails: () => void;
  openPrescriptionModal: (appt: Appointment) => void;
  closePrescriptionModal: () => void;
  toggleDbModal: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  bookAppointment: (data: any) => Promise<boolean>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<boolean>;
  addPrescription: (data: any) => Promise<boolean>;
  refreshData: () => Promise<void>;
  initMysqlTables: () => Promise<void>;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export function DoctorProvider({ children }: { children: React.ReactNode }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [activeAppointmentForPrescription, setActiveAppointmentForPrescription] = useState<Appointment | null>(null);
  
  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  // Filters & Navigation
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  const [userRole, setUserRole] = useState<'patient' | 'doctor'>('patient');
  const [activeTab, setActiveTab] = useState<'home' | 'find-doctors' | 'specialities' | 'my-appointments' | 'doctor-portal' | 'blogs' | 'rare-cases'>('home');

  // DB Status
  const [dbStatus, setDbStatus] = useState<DbStatusResponse | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Default patient info
  const [patientUser] = useState({
    name: 'Rohan Gupta',
    email: 'rohan.gupta@example.com',
    phone: '+91 98765 43210',
  });

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Fetch initial data
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [docRes, apptRes, dbRes] = await Promise.all([
        fetch('/api/doctors').then(r => r.json()),
        fetch('/api/appointments').then(r => r.json()),
        fetch('/api/db/status').then(r => r.json()).catch(() => null),
      ]);

      if (docRes.success) {
        setDoctors(docRes.data);
      }
      if (apptRes.success) {
        setAppointments(apptRes.data);
      }
      if (dbRes?.status) {
        setDbStatus(dbRes.status);
      }
    } catch (err: any) {
      console.error('Failed to load doctor portal data', err);
      showToast('Loaded local fallback data', 'info');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Modal handlers
  const openBooking = (doctor?: Doctor) => {
    if (doctor) {
      setSelectedDoctor(doctor);
    } else if (doctors.length > 0) {
      setSelectedDoctor(doctors[0]);
    }
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
  };

  const openDoctorDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDetailsOpen(true);
  };

  const closeDoctorDetails = () => {
    setIsDetailsOpen(false);
  };

  const openPrescriptionModal = (appt: Appointment) => {
    setActiveAppointmentForPrescription(appt);
    setIsPrescriptionOpen(true);
  };

  const closePrescriptionModal = () => {
    setIsPrescriptionOpen(false);
    setActiveAppointmentForPrescription(null);
  };

  const toggleDbModal = () => {
    setIsDbModalOpen(prev => !prev);
  };

  // Actions
  const bookAppointment = async (formData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setAppointments(prev => [data.data, ...prev]);
        showToast('Appointment booked successfully! Our team will send confirmation.', 'success');
        closeBooking();
        return true;
      } else {
        showToast(data.error || 'Failed to book appointment', 'error');
        return false;
      }
    } catch (err: any) {
      showToast('Error booking appointment', 'error');
      return false;
    }
  };

  const updateAppointmentStatus = async (id: string, status: AppointmentStatus): Promise<boolean> => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (data.success) {
        setAppointments(prev =>
          prev.map(a => (a.id === id ? { ...a, status } : a))
        );
        showToast(`Appointment status updated to ${status}`, 'success');
        return true;
      } else {
        showToast(data.error || 'Update failed', 'error');
        return false;
      }
    } catch (err: any) {
      showToast('Error updating appointment status', 'error');
      return false;
    }
  };

  const addPrescription = async (prescData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescData),
      });

      const data = await res.json();
      if (data.success) {
        // Update appointment with prescription & completed status
        setAppointments(prev =>
          prev.map(a =>
            a.id === prescData.appointmentId
              ? { ...a, status: 'completed', prescription: data.data }
              : a
          )
        );
        showToast('Prescription saved & consultation completed!', 'success');
        closePrescriptionModal();
        return true;
      } else {
        showToast(data.error || 'Failed to save prescription', 'error');
        return false;
      }
    } catch (err: any) {
      showToast('Error saving prescription', 'error');
      return false;
    }
  };

  const initMysqlTables = async () => {
    try {
      showToast('Connecting & configuring MySQL tables...', 'info');
      const res = await fetch('/api/db/status', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        if (data.status) setDbStatus(data.status);
        await refreshData();
      } else {
        showToast(data.message || 'MySQL init failed', 'error');
      }
    } catch (err: any) {
      showToast('Could not initialize MySQL database', 'error');
    }
  };

  return (
    <DoctorContext.Provider
      value={{
        doctors,
        appointments,
        loading,
        selectedDoctor,
        activeAppointmentForPrescription,
        isBookingOpen,
        isDetailsOpen,
        isPrescriptionOpen,
        isDbModalOpen,
        selectedSpecialty,
        searchQuery,
        selectedLocation,
        userRole,
        activeTab,
        dbStatus,
        toast,
        patientUser,
        setRole: setUserRole,
        setActiveTab,
        setSelectedSpecialty,
        setSearchQuery,
        setSelectedLocation,
        openBooking,
        closeBooking,
        openDoctorDetails,
        closeDoctorDetails,
        openPrescriptionModal,
        closePrescriptionModal,
        toggleDbModal,
        showToast,
        bookAppointment,
        updateAppointmentStatus,
        addPrescription,
        refreshData,
        initMysqlTables,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
}

export function useDoctorContext() {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctorContext must be used within DoctorProvider');
  }
  return context;
}
