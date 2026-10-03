'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Video, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { useDoctorContext } from '@/context/DoctorContext';
import { Doctor } from '@/lib/types';

export default function BookingModal() {
  const { 
    isBookingOpen, 
    closeBooking, 
    selectedDoctor, 
    doctors, 
    patientUser, 
    bookAppointment 
  } = useDoctorContext();

  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(selectedDoctor || null);
  const [consultationType, setConsultationType] = useState<'in-clinic' | 'video'>('in-clinic');
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [appointmentTime, setAppointmentTime] = useState<string>('');
  
  // Patient details form
  const [patientName, setPatientName] = useState(patientUser.name);
  const [patientEmail, setPatientEmail] = useState(patientUser.email);
  const [patientPhone, setPatientPhone] = useState(patientUser.phone);
  const [patientAge, setPatientAge] = useState<number | ''>(35);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [symptoms, setSymptoms] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedDoctor) {
      setActiveDoctor(selectedDoctor);
      if (selectedDoctor.timeSlots.length > 0) {
        setAppointmentTime(selectedDoctor.timeSlots[0]);
      }
    } else if (doctors.length > 0) {
      setActiveDoctor(doctors[0]);
      if (doctors[0].timeSlots.length > 0) {
        setAppointmentTime(doctors[0].timeSlots[0]);
      }
    }

    // Default to tomorrow's date
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    setAppointmentDate(tomorrow);
  }, [selectedDoctor, doctors, isBookingOpen]);

  if (!isBookingOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDoctor) return;

    setSubmitting(true);
    const success = await bookAppointment({
      doctorId: activeDoctor.id,
      doctorName: activeDoctor.name,
      doctorSpecialty: activeDoctor.specialty,
      doctorAvatar: activeDoctor.avatar,
      patientName,
      patientEmail,
      patientPhone,
      patientAge: patientAge ? Number(patientAge) : undefined,
      patientGender,
      appointmentDate,
      appointmentTime,
      consultationType,
      symptoms,
      fee: activeDoctor.consultationFee,
    });
    setSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={closeBooking}>
      <div 
        className="modal-container booking-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="header-text-group">
            <span className="modal-pill-tag">Schedule Consultation</span>
            <h2 className="modal-title">Book an Appointment</h2>
          </div>
          <button 
            type="button" 
            className="modal-close-btn"
            onClick={closeBooking}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="booking-modal-body">
          {/* Doctor Selection Pill Card */}
          <div className="selected-doctor-banner">
            <img 
              src={activeDoctor?.avatar} 
              alt={activeDoctor?.name}
              className="doc-mini-avatar"
            />
            <div className="doc-mini-info">
              <span className="doc-specialty-mini">{activeDoctor?.specialty}</span>
              <h4 className="doc-name-mini">{activeDoctor?.name}</h4>
              <p className="doc-hospital-mini">{activeDoctor?.hospital}</p>
            </div>

            {/* Doctor Picker Dropdown */}
            <div className="doc-switch-select">
              <label htmlFor="doc-select" className="sr-only">Change Doctor</label>
              <select
                id="doc-select"
                value={activeDoctor?.id}
                onChange={(e) => {
                  const doc = doctors.find(d => d.id === e.target.value);
                  if (doc) {
                    setActiveDoctor(doc);
                    if (doc.timeSlots.length > 0) setAppointmentTime(doc.timeSlots[0]);
                  }
                }}
                className="doctor-picker-dropdown"
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialty})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Consultation Type Selector */}
          <div className="form-section">
            <label className="section-label">Select Consultation Mode</label>
            <div className="consult-type-toggle">
              <button
                type="button"
                className={`type-card ${consultationType === 'in-clinic' ? 'active' : ''}`}
                onClick={() => setConsultationType('in-clinic')}
              >
                <Building2 size={20} />
                <div className="type-meta">
                  <span className="type-title">In-Clinic OPD Visit</span>
                  <span className="type-sub">Physical exam at Hospital</span>
                </div>
              </button>

              <button
                type="button"
                className={`type-card ${consultationType === 'video' ? 'active' : ''}`}
                onClick={() => setConsultationType('video')}
              >
                <Video size={20} />
                <div className="type-meta">
                  <span className="type-title">Online Video Consult</span>
                  <span className="type-sub">HD consultation via app/link</span>
                </div>
              </button>
            </div>
          </div>

          {/* Date & Time Slot Picker */}
          <div className="form-section dual-grid">
            {/* Date Input */}
            <div className="form-field">
              <label className="field-label" htmlFor="appointment-date">
                <Calendar size={15} /> Appointment Date
              </label>
              <input
                id="appointment-date"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Time Slot Picker */}
            <div className="form-field">
              <label className="field-label">
                <Clock size={15} /> Available Time Slot
              </label>
              <div className="slots-select-grid">
                {activeDoctor?.timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={`time-slot-btn ${appointmentTime === slot ? 'active' : ''}`}
                    onClick={() => setAppointmentTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Patient Personal Details */}
          <div className="form-section">
            <label className="section-label">Patient Information</label>
            <div className="patient-fields-grid">
              <div className="form-field">
                <label className="field-label">Full Name *</label>
                <div className="input-with-icon">
                  <User size={16} />
                  <input
                    type="text"
                    required
                    placeholder="Patient full name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Phone Number *</label>
                <div className="input-with-icon">
                  <Phone size={16} />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Email Address *</label>
                <div className="input-with-icon">
                  <Mail size={16} />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-field age-gender-row">
                <div>
                  <label className="field-label">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    placeholder="35"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : '')}
                    className="form-input mini"
                  />
                </div>
                <div>
                  <label className="field-label">Gender</label>
                  <select
                    value={patientGender}
                    onChange={(e: any) => setPatientGender(e.target.value)}
                    className="form-input mini"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Symptoms and Medical Concerns */}
          <div className="form-field">
            <label className="field-label">
              <FileText size={15} /> Symptoms / Reason for Consultation
            </label>
            <textarea
              rows={2}
              placeholder="Describe your health problem, existing medical history or symptoms (e.g. fever for 3 days, knee stiffness, rash...)"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="form-textarea"
            ></textarea>
          </div>

          {/* Fee & Confirmation Bar */}
          <div className="booking-summary-bar">
            <div className="summary-left">
              <span className="summary-label">Total Consultation Fee</span>
              <span className="summary-fee">₹{activeDoctor?.consultationFee || 800}</span>
              <span className="summary-note">Pay at clinic or online after confirmation</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="confirm-booking-btn"
            >
              {submitting ? 'Confirming...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
