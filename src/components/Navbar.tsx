'use client';

import React, { useState } from 'react';
import { Calendar, Search, Stethoscope, ChevronDown, Menu, X, ShieldCheck, HeartPulse, Building2 } from 'lucide-react';
import { useDoctorContext } from '@/context/DoctorContext';

export default function Navbar() {
  const { activeTab, setActiveTab, openBooking, appointments, userRole, setRole } = useDoctorContext();
  const [isHospitalsOpen, setIsHospitalsOpen] = useState(false);
  const [isTreatmentsOpen, setIsTreatmentsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pendingCount = appointments.filter(a => a.status === 'pending').length;

  const handleNavClick = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="main-navbar" aria-label="Main Navigation">
      <div className="navbar-container">
        {/* Brand Logo - Short & Compact */}
        <div 
          className="brand-logo brand-logo-short" 
          onClick={() => handleNavClick('home')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleNavClick('home')}
        >
          <div className="logo-symbol mini">
            <div className="cross-core mini">
              <span className="cross-bar-h"></span>
              <span className="cross-bar-v"></span>
            </div>
          </div>
          <span className="brand-name-short">
            Dr.<span className="brand-highlight">Demo</span>
          </span>
        </div>

        {/* Desktop Navigation Menus */}
        <div className="nav-menu-links desktop-nav">
          <button 
            type="button"
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Home
          </button>

          {/* Hospitals Dropdown */}
          <div className="nav-dropdown-wrapper">
            <button 
              type="button" 
              className="nav-item has-dropdown"
              onClick={() => setIsHospitalsOpen(!isHospitalsOpen)}
              onMouseEnter={() => setIsHospitalsOpen(true)}
              onMouseLeave={() => setIsHospitalsOpen(false)}
            >
              <span>Hospitals</span>
              <ChevronDown size={14} />
            </button>
            {isHospitalsOpen && (
              <div 
                className="dropdown-menu"
                onMouseEnter={() => setIsHospitalsOpen(true)}
                onMouseLeave={() => setIsHospitalsOpen(false)}
              >
                <button type="button" onClick={() => handleNavClick('find-doctors')}>Delhi / NCR Hospital Network</button>
                <button type="button" onClick={() => handleNavClick('find-doctors')}>Mohali Super Speciality Unit</button>
                <button type="button" onClick={() => handleNavClick('find-doctors')}>Doctor Demo Hospital, Mumbai</button>
                <button type="button" onClick={() => handleNavClick('find-doctors')}>Lucknow Trauma &amp; Medical Centre</button>
                <button type="button" onClick={() => handleNavClick('find-doctors')}>Bangalore Care Center</button>
              </div>
            )}
          </div>

          <button 
            type="button"
            className={`nav-item ${activeTab === 'specialities' ? 'active' : ''}`}
            onClick={() => handleNavClick('specialities')}
          >
            Specialities
          </button>

          <button 
            type="button"
            className={`nav-item ${activeTab === 'find-doctors' ? 'active' : ''}`}
            onClick={() => handleNavClick('find-doctors')}
          >
            Doctors
          </button>

          <button 
            type="button"
            className={`nav-item ${activeTab === 'blogs' ? 'active' : ''}`}
            onClick={() => handleNavClick('blogs')}
          >
            Health Blogs
          </button>

          <button 
            type="button"
            className={`nav-item ${activeTab === 'my-appointments' ? 'active' : ''}`}
            onClick={() => handleNavClick('my-appointments')}
          >
            <span>My Bookings</span>
            {appointments.length > 0 && (
              <span className="nav-badge-pill">{appointments.length}</span>
            )}
          </button>

          {/* Doctor Portal Quick Tab */}
          <button 
            type="button"
            className={`nav-item doctor-tab-link ${activeTab === 'doctor-portal' ? 'active' : ''}`}
            onClick={() => {
              setRole('doctor');
              handleNavClick('doctor-portal');
            }}
          >
            <Stethoscope size={16} />
            <span>Doctor Portal</span>
            {pendingCount > 0 && (
              <span className="nav-badge-pill alert">{pendingCount}</span>
            )}
          </button>
        </div>

        {/* Right CTA Area & Mobile Hamburger */}
        <div className="navbar-actions">
          <a href="tel:+918650559698" className="nav-phone-chip" title="24/7 Helpline">
            <span>📞 8650559698</span>
          </a>

          <button 
            type="button" 
            className="book-appointment-cta compact"
            onClick={() => openBooking()}
          >
            <Calendar size={14} />
            <span className="cta-btn-text">Book Appointment</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-inner">
            <button 
              type="button" 
              className={`mobile-nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              Home
            </button>
            <button 
              type="button" 
              className={`mobile-nav-link ${activeTab === 'find-doctors' ? 'active' : ''}`}
              onClick={() => handleNavClick('find-doctors')}
            >
              Find a Doctor
            </button>
            <button 
              type="button" 
              className={`mobile-nav-link ${activeTab === 'specialities' ? 'active' : ''}`}
              onClick={() => handleNavClick('specialities')}
            >
              Specialities &amp; Procedures
            </button>
            <button 
              type="button" 
              className={`mobile-nav-link ${activeTab === 'my-appointments' ? 'active' : ''}`}
              onClick={() => handleNavClick('my-appointments')}
            >
              My Appointments ({appointments.length})
            </button>
            <button 
              type="button" 
              className={`mobile-nav-link ${activeTab === 'blogs' ? 'active' : ''}`}
              onClick={() => handleNavClick('blogs')}
            >
              Health Blogs &amp; Updates
            </button>
            <button 
              type="button" 
              className={`mobile-nav-link highlight ${activeTab === 'doctor-portal' ? 'active' : ''}`}
              onClick={() => {
                setRole('doctor');
                handleNavClick('doctor-portal');
              }}
            >
              Doctor Clinical Portal {pendingCount > 0 ? `(${pendingCount} Pending)` : ''}
            </button>

            <button 
              type="button"
              className="mobile-book-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openBooking();
              }}
            >
              <Calendar size={18} />
              <span>Book Doctor Appointment</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
