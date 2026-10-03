'use client';

import React from 'react';
import { 
  Search, 
  MapPin, 
  Globe, 
  FileCheck, 
  Stethoscope, 
  FlaskConical, 
  Home, 
  ArrowRight, 
  ShieldCheck, 
  Calendar 
} from 'lucide-react';
import { useDoctorContext } from '@/context/DoctorContext';

const LOCATIONS = [
  'Select Location',
  'Delhi / NCR (Saket & Patparganj)',
  'Mohali, Punjab',
  'Doctor Demo Hospital, Mumbai',
  'Bangalore, Indiranagar',
  'Hyderabad, Banjara Hills',
  'Kolkata, Salt Lake',
  'Gurugram, Sector 44',
  'Lucknow, Uttar Pradesh',
];

export default function HeroSection() {
  const {
    searchQuery,
    setSearchQuery,
    selectedLocation,
    setSelectedLocation,
    setActiveTab,
    openBooking,
  } = useDoctorContext();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('find-doctors');
    window.scrollTo({ top: 700, behavior: 'smooth' });
  };

  return (
    <section className="hero-section-wrapper">
      {/* 1. Grand Hospital Visual Banner (Matches Screenshot 1) */}
      <div className="hospital-hero-banner-container">
        <div className="hospital-banner-img-wrap">
          <img 
            src="/images/hero-banner.jpg" 
            alt="Doctor Demo Advanced Multi-Speciality Hospital & Medical Team" 
            className="hospital-banner-img"
          />
          {/* Subtle gradient overlay */}
          <div className="banner-overlay-gradient"></div>
        </div>
      </div>

      {/* 2. Schedule Your Appointment Online Area (Matches Screenshot 2) */}
      <div className="schedule-section-container">
        <h2 className="schedule-main-heading">Schedule Your Appointment Online</h2>

        {/* Central Search Card */}
        <div className="search-appointment-card">
          <form onSubmit={handleSearchSubmit} className="search-card-form">
            {/* Search Input */}
            <div className="search-field-group">
              <Search className="field-icon" size={20} />
              <input
                type="text"
                placeholder="Search for Doctor or Speciality"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Location Selector */}
            <div className="search-field-group location-group">
              <MapPin className="field-icon" size={20} />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="location-select"
                aria-label="Select Location"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Book Appointment Button */}
            <button type="submit" className="search-submit-btn compact">
              <span>Book Appointment</span>
            </button>
          </form>
        </div>

        {/* 3. Five Quick Service Cards (Matches Screenshot 2) */}
        <div className="service-cards-grid">
          <div 
            className="service-card"
            onClick={() => {
              setSearchQuery('International');
              setActiveTab('find-doctors');
            }}
          >
            <div className="service-card-icon-wrap blue">
              <Globe size={26} />
            </div>
            <h3 className="service-card-title">International Patients</h3>
            <p className="service-card-desc">Visit International Website</p>
          </div>

          <div 
            className="service-card"
            onClick={() => {
              setSearchQuery('Immigration');
              setActiveTab('find-doctors');
            }}
          >
            <div className="service-card-icon-wrap indigo">
              <FileCheck size={26} />
            </div>
            <h3 className="service-card-title">Immigration</h3>
            <p className="service-card-desc">Visa Medical Appointment</p>
          </div>

          <div 
            className="service-card"
            onClick={() => openBooking()}
          >
            <div className="service-card-icon-wrap teal">
              <Stethoscope size={26} />
            </div>
            <h3 className="service-card-title">Health Checkup</h3>
            <p className="service-card-desc">Comprehensive Packages</p>
          </div>

          <div 
            className="service-card"
            onClick={() => {
              setSearchQuery('Lab');
              setActiveTab('find-doctors');
            }}
          >
            <div className="service-card-icon-wrap violet">
              <FlaskConical size={26} />
            </div>
            <h3 className="service-card-title">Care Diagnostics Lab</h3>
            <p className="service-card-desc">Diagnostic Blood Tests</p>
          </div>

          <div 
            className="service-card"
            onClick={() => openBooking()}
          >
            <div className="service-card-icon-wrap orange">
              <Home size={26} />
            </div>
            <h3 className="service-card-title">Care@Home</h3>
            <p className="service-card-desc">Nursing &amp; Care at Home</p>
          </div>
        </div>
      </div>
    </section>
  );
}
