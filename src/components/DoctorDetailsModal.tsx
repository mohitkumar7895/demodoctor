'use client';

import React from 'react';
import { X, Star, Award, Building, MapPin, Calendar, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useDoctorContext } from '@/context/DoctorContext';

export default function DoctorDetailsModal() {
  const { isDetailsOpen, closeDoctorDetails, selectedDoctor, openBooking } = useDoctorContext();

  if (!isDetailsOpen || !selectedDoctor) return null;

  return (
    <div className="modal-overlay" onClick={closeDoctorDetails}>
      <div 
        className="modal-container doctor-details-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <span className="modal-pill-tag">Doctor Profile & Credentials</span>
          <button 
            type="button"
            className="modal-close-btn"
            onClick={closeDoctorDetails}
          >
            <X size={20} />
          </button>
        </div>

        <div className="details-body">
          {/* Header Profile Info */}
          <div className="profile-header-card">
            <div className="profile-avatar-wrap">
              <img 
                src={selectedDoctor.avatar} 
                alt={selectedDoctor.name} 
                className="profile-img"
              />
              <span className="verified-badge-large">
                <CheckCircle2 size={20} />
              </span>
            </div>

            <div className="profile-meta">
              <span className="profile-specialty">{selectedDoctor.specialty}</span>
              <h2 className="profile-name">{selectedDoctor.name}</h2>
              <p className="profile-degrees">{selectedDoctor.qualifications}</p>

              <div className="profile-stats-strip">
                <div className="stat-pill">
                  <Star size={15} className="star-filled" />
                  <span className="stat-val">{selectedDoctor.rating}</span>
                  <span className="stat-sub">({selectedDoctor.reviewsCount} reviews)</span>
                </div>

                <div className="stat-pill">
                  <Award size={15} />
                  <span className="stat-val">{selectedDoctor.experienceYears}+ Yrs</span>
                  <span className="stat-sub">Experience</span>
                </div>

                <div className="stat-pill">
                  <Building size={15} />
                  <span className="stat-val">{selectedDoctor.hospital}</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Doctor */}
          <div className="profile-section">
            <h4 className="section-heading">About Specialist</h4>
            <p className="section-body-text">{selectedDoctor.about}</p>
          </div>

          {/* Clinical Focus & Hospital Address */}
          <div className="profile-section">
            <h4 className="section-heading">Hospital & OPD Location</h4>
            <div className="location-box">
              <MapPin size={18} className="loc-pin" />
              <div>
                <p className="loc-name">{selectedDoctor.hospital}</p>
                <p className="loc-address">{selectedDoctor.location}</p>
              </div>
            </div>
          </div>

          {/* Available Days & Timing */}
          <div className="profile-section">
            <h4 className="section-heading">Consultation Timings</h4>
            <div className="days-chips-wrap">
              {selectedDoctor.availableDays.map((day) => (
                <span key={day} className="day-chip active">
                  <Calendar size={13} /> {day}
                </span>
              ))}
            </div>

            <div className="slots-chips-wrap">
              {selectedDoctor.timeSlots.map((slot) => (
                <span key={slot} className="time-chip">
                  <Clock size={13} /> {slot}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="profile-footer-bar">
            <div className="footer-fee-block">
              <span className="footer-fee-label">Consultation Fee</span>
              <span className="footer-fee-value">₹{selectedDoctor.consultationFee}</span>
            </div>

            <button
              type="button"
              className="book-now-large-btn"
              onClick={() => {
                closeDoctorDetails();
                openBooking(selectedDoctor);
              }}
            >
              <Calendar size={18} />
              <span>Book Appointment with {selectedDoctor.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
