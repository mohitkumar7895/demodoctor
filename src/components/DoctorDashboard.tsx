'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Phone, 
  Mail, 
  Video, 
  Building2, 
  DollarSign, 
  Filter,
  Stethoscope
} from 'lucide-react';
import { useDoctorContext } from '@/context/DoctorContext';
import { AppointmentStatus, Appointment } from '@/lib/types';

export default function DoctorDashboard() {
  const { 
    doctors, 
    appointments, 
    updateAppointmentStatus, 
    openPrescriptionModal 
  } = useDoctorContext();

  // Active doctor profile filter (defaults to first doctor)
  const [activeDoctorId, setActiveDoctorId] = useState<string>(doctors[0]?.id || 'doc-1');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const currentDoctor = doctors.find(d => d.id === activeDoctorId) || doctors[0];

  // Filter appointments for this doctor
  const doctorAppointments = appointments.filter(a => a.doctorId === activeDoctorId);
  const filteredAppointments = doctorAppointments.filter(a => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  // Calculate statistics
  const total = doctorAppointments.length;
  const pending = doctorAppointments.filter(a => a.status === 'pending').length;
  const confirmed = doctorAppointments.filter(a => a.status === 'confirmed').length;
  const completed = doctorAppointments.filter(a => a.status === 'completed').length;
  const totalEarnings = doctorAppointments
    .filter(a => a.status === 'completed' || a.status === 'confirmed')
    .reduce((sum, a) => sum + (Number(a.fee) || 0), 0);

  return (
    <div className="doctor-dashboard-container">
      {/* Top Banner with Doctor Selector */}
      <div className="dashboard-header-card">
        <div className="doc-dash-profile">
          <img 
            src={currentDoctor?.avatar} 
            alt={currentDoctor?.name}
            className="doc-dash-avatar"
          />
          <div>
            <div className="dash-role-tag">
              <Stethoscope size={14} /> Doctor Clinical Portal
            </div>
            <h1 className="dash-doctor-name">{currentDoctor?.name}</h1>
            <p className="dash-doctor-sub">
              {currentDoctor?.specialty} | {currentDoctor?.hospital}
            </p>
          </div>
        </div>

        {/* Switch Doctor Dropdown */}
        <div className="switch-doctor-wrap">
          <label className="switch-label">Switch Logged-in Doctor:</label>
          <select
            value={activeDoctorId}
            onChange={(e) => setActiveDoctorId(e.target.value)}
            className="doc-select-dropdown"
          >
            {doctors.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.specialty})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon blue">
            <Calendar size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-num">{total}</span>
            <span className="metric-label">Total Consultations</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon amber">
            <Clock size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-num">{pending}</span>
            <span className="metric-label">Pending Requests</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon teal">
            <CheckCircle2 size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-num">{confirmed}</span>
            <span className="metric-label">Confirmed Slots</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon green">
            <FileText size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-num">{completed}</span>
            <span className="metric-label">Completed & Prescribed</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon purple">
            <DollarSign size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-num">₹{totalEarnings.toLocaleString('en-IN')}</span>
            <span className="metric-label">OPD Revenue</span>
          </div>
        </div>
      </div>

      {/* Appointments Management Table */}
      <div className="appointments-management-card">
        <div className="card-top-bar">
          <div className="bar-left">
            <h3 className="section-title">Patient Consultations & Queue</h3>
            <span className="count-pill">{filteredAppointments.length} Appointments</span>
          </div>

          {/* Status Filter Tabs */}
          <div className="status-filter-tabs">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                type="button"
                className={`tab-filter-btn ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st.charAt(0).toUpperCase() + st.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="empty-appointments-state">
            <Clock size={40} className="empty-icon" />
            <h4>No appointments in this category</h4>
            <p>New patient bookings will appear here automatically.</p>
          </div>
        ) : (
          <div className="appointments-table-wrapper">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Patient Details</th>
                  <th>Schedule</th>
                  <th>Mode</th>
                  <th>Symptoms</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appt) => (
                  <tr key={appt.id}>
                    <td>
                      <div className="patient-cell">
                        <div className="patient-avatar-letter">
                          {appt.patientName.charAt(0)}
                        </div>
                        <div>
                          <strong className="patient-name">{appt.patientName}</strong>
                          <div className="patient-sub-details">
                            <span>{appt.patientAge || '35'} Yrs • {appt.patientGender || 'Male'}</span>
                            <span className="contact-phone"><Phone size={11} /> {appt.patientPhone}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="schedule-cell">
                        <span className="appt-date">{appt.appointmentDate}</span>
                        <span className="appt-time">{appt.appointmentTime}</span>
                      </div>
                    </td>

                    <td>
                      <span className={`consult-mode-tag ${appt.consultationType}`}>
                        {appt.consultationType === 'video' ? (
                          <>
                            <Video size={13} /> Video
                          </>
                        ) : (
                          <>
                            <Building2 size={13} /> In-Clinic
                          </>
                        )}
                      </span>
                    </td>

                    <td>
                      <p className="symptoms-excerpt" title={appt.symptoms}>
                        {appt.symptoms || 'General Checkup'}
                      </p>
                    </td>

                    <td>
                      <span className={`status-badge ${appt.status}`}>
                        {appt.status.toUpperCase()}
                      </span>
                    </td>

                    <td>
                      <div className="row-actions-group">
                        {appt.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              className="action-btn-confirm"
                              onClick={() => updateAppointmentStatus(appt.id, 'confirmed')}
                              title="Confirm appointment"
                            >
                              <CheckCircle2 size={14} /> Confirm
                            </button>
                            <button
                              type="button"
                              className="action-btn-cancel"
                              onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                              title="Cancel appointment"
                            >
                              <XCircle size={14} /> Cancel
                            </button>
                          </>
                        )}

                        {appt.status === 'confirmed' && (
                          <button
                            type="button"
                            className="action-btn-prescribe"
                            onClick={() => openPrescriptionModal(appt)}
                            title="Complete Consultation & Write Prescription"
                          >
                            <FileText size={14} /> Write Prescription
                          </button>
                        )}

                        {appt.status === 'completed' && appt.prescription && (
                          <button
                            type="button"
                            className="action-btn-view-rx"
                            onClick={() => openPrescriptionModal(appt)}
                            title="View / Edit Prescription"
                          >
                            <FileText size={14} /> View Rx
                          </button>
                        )}

                        {appt.status === 'cancelled' && (
                          <span className="cancelled-note">Cancelled</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
