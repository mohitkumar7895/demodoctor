'use client';

import React from 'react';
import Image from 'next/image';
import { Star, MapPin, Building, Award, Calendar, Clock, Video, CheckCircle2 } from 'lucide-react';
import { Doctor } from '@/lib/types';
import { useDoctorContext } from '@/context/DoctorContext';

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const { openBooking, openDoctorDetails } = useDoctorContext();

  return (
    <div className="doctor-card">
      {/* Top Banner / Today Availability */}
      {doctor.isAvailableToday ? (
        <div className="doctor-avail-ribbon available">
          <span className="dot-pulse"></span>
          <span>Available Today</span>
        </div>
      ) : (
        <div className="doctor-avail-ribbon next-slot">
          <span>Next Slot: Tomorrow</span>
        </div>
      )}

      <div className="doctor-card-body">
        {/* Doctor Photo & Info Header */}
        <div className="doctor-header-row">
          <div className="doctor-avatar-wrapper">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="doctor-avatar-img"
              loading="lazy"
              onError={(e) => {
                // Fallback avatar
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400';
              }}
            />
            <span className="verified-check" title="Verified Medical License">
              <CheckCircle2 size={16} />
            </span>
          </div>

          <div className="doctor-primary-info">
            <span className="doctor-specialty-badge">{doctor.specialty}</span>
            <h3 className="doctor-name" onClick={() => openDoctorDetails(doctor)}>
              {doctor.name}
            </h3>
            <p className="doctor-quals">{doctor.qualifications}</p>

            <div className="doctor-rating-row">
              <div className="rating-pill">
                <Star size={13} className="star-filled" />
                <span className="rating-val">{doctor.rating}</span>
              </div>
              <span className="reviews-text">({doctor.reviewsCount} verified reviews)</span>
            </div>
          </div>
        </div>

        {/* Clinical Experience & Affiliation */}
        <div className="doctor-meta-grid">
          <div className="meta-item">
            <Award size={15} className="meta-icon" />
            <span className="meta-text">{doctor.experienceYears}+ Years Clinical Experience</span>
          </div>
          <div className="meta-item">
            <Building size={15} className="meta-icon" />
            <span className="meta-text">{doctor.hospital}</span>
          </div>
          <div className="meta-item">
            <MapPin size={15} className="meta-icon" />
            <span className="meta-text">{doctor.location}</span>
          </div>
        </div>

        {/* About Snippet */}
        <p className="doctor-about-snippet">{doctor.about}</p>

        {/* Slot chips */}
        <div className="slots-preview-row">
          <span className="slots-label">
            <Clock size={13} /> Slots:
          </span>
          <div className="slot-chips-list">
            {doctor.timeSlots.slice(0, 3).map((slot, i) => (
              <span key={i} className="slot-chip">
                {slot}
              </span>
            ))}
            {doctor.timeSlots.length > 3 && (
              <span className="slot-chip more">+{doctor.timeSlots.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Bottom Price & Action Footer */}
        <div className="doctor-card-footer">
          <div className="fee-box">
            <span className="fee-label">Consultation Fee</span>
            <span className="fee-amount">₹{doctor.consultationFee}</span>
          </div>

          <div className="action-buttons-group">
            <button
              type="button"
              className="view-profile-btn"
              onClick={() => openDoctorDetails(doctor)}
            >
              View Profile
            </button>
            <button
              type="button"
              className="book-slot-btn"
              onClick={() => openBooking(doctor)}
            >
              <Calendar size={13} />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
