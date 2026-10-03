'use client';

import React from 'react';
import { Calendar, Clock, Video, Building2, FileText, CheckCircle2, AlertCircle, Phone, Stethoscope, ArrowRight } from 'lucide-react';
import { useDoctorContext } from '@/context/DoctorContext';

export default function PatientPortal() {
  const { 
    appointments, 
    patientUser, 
    openBooking, 
    openPrescriptionModal 
  } = useDoctorContext();

  return (
    <div className="patient-portal-container">
      {/* Header Info Banner */}
      <div className="patient-header-banner">
        <div className="patient-avatar-box">
          <span className="patient-initial">{patientUser.name.charAt(0)}</span>
        </div>
        <div className="patient-info">
          <span className="patient-portal-tag">Patient Medical Portal</span>
          <h1 className="patient-name-title">{patientUser.name}</h1>
          <p className="patient-contact-sub">
            Email: {patientUser.email} • Mobile: {patientUser.phone}
          </p>
        </div>

        <button
          type="button"
          className="book-new-cta"
          onClick={() => openBooking()}
        >
          <Calendar size={17} />
          <span>Book New Consultation</span>
        </button>
      </div>

      {/* Bookings List */}
      <div className="patient-bookings-section">
        <div className="bookings-section-header">
          <h3 className="section-title">My Appointments & Health Records</h3>
          <span className="records-count">{appointments.length} Consultations Recorded</span>
        </div>

        {appointments.length === 0 ? (
          <div className="no-bookings-card">
            <Stethoscope size={42} className="no-bookings-icon" />
            <h3>No appointments booked yet</h3>
            <p>Consult with India&apos;s leading medical specialists online or at our hospitals.</p>
            <button
              type="button"
              className="start-booking-btn"
              onClick={() => openBooking()}
            >
              Find a Doctor & Book Now
            </button>
          </div>
        ) : (
          <div className="bookings-cards-grid">
            {appointments.map((appt) => (
              <div key={appt.id} className="booking-record-card">
                <div className="card-top-strip">
                  <span className={`status-pill ${appt.status}`}>
                    {appt.status.toUpperCase()}
                  </span>
                  <span className="appt-id-text">ID: #{appt.id}</span>
                </div>

                <div className="booking-card-main">
                  <div className="booking-doc-row">
                    <img 
                      src={appt.doctorAvatar} 
                      alt={appt.doctorName}
                      className="booking-doc-img"
                    />
                    <div>
                      <span className="doc-specialty-label">{appt.doctorSpecialty}</span>
                      <h4 className="doc-name-heading">{appt.doctorName}</h4>
                      <p className="appt-datetime">
                        <Calendar size={13} /> {appt.appointmentDate} at {appt.appointmentTime}
                      </p>
                    </div>
                  </div>

                  <div className="consult-type-badge">
                    {appt.consultationType === 'video' ? (
                      <span className="mode-pill video"><Video size={13} /> Video Consultation</span>
                    ) : (
                      <span className="mode-pill clinic"><Building2 size={13} /> In-Hospital OPD Visit</span>
                    )}
                    <span className="fee-badge">₹{appt.fee}</span>
                  </div>

                  {appt.symptoms && (
                    <div className="symptoms-box">
                      <span className="box-label">Reported Symptoms:</span>
                      <p className="box-text">{appt.symptoms}</p>
                    </div>
                  )}

                  {/* Prescription Section if completed */}
                  {appt.prescription ? (
                    <div className="prescription-available-box">
                      <div className="rx-preview-header">
                        <CheckCircle2 size={16} className="rx-check-icon" />
                        <div>
                          <strong>Medical Prescription Issued</strong>
                          <p className="rx-diagnosis">Diagnosis: {appt.prescription.diagnosis}</p>
                        </div>
                      </div>

                      <div className="rx-meds-summary">
                        <span className="meds-count">
                          {appt.prescription.items.length} Medicines Prescribed
                        </span>
                        <button
                          type="button"
                          className="view-rx-full-btn"
                          onClick={() => openPrescriptionModal(appt)}
                        >
                          <FileText size={14} />
                          <span>View Full Prescription</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pending-status-note">
                      {appt.status === 'confirmed' && (
                        <span>✅ Your appointment is confirmed! Please arrive 15 minutes before your slot.</span>
                      )}
                      {appt.status === 'pending' && (
                        <span>⏳ Awaiting hospital scheduling confirmation. You will receive an SMS/WhatsApp update.</span>
                      )}
                      {appt.status === 'cancelled' && (
                        <span className="cancelled-text">❌ This appointment has been cancelled.</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
