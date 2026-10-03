'use client';

import React from 'react';
import { Phone, MessageCircle, AlertCircle, Database } from 'lucide-react';
import { useDoctorContext } from '@/context/DoctorContext';

export default function TopHeader() {
  const { setActiveTab, userRole, setRole, dbStatus, toggleDbModal } = useDoctorContext();

  return (
    <aside aria-label="Hospital announcement and emergency contact header" className="top-banner-wrapper">
      {/* Top Announcement Ticker */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <span className="announcement-item">
            ✨ Introducing the New State-of-the-art Tower at Nanavati Max Hospital, Mumbai
          </span>
          <span className="announcement-divider">|</span>
          <span className="announcement-item">
            🏥 Max Hospital, Mohali has Upgraded to Redefine Healthcare Excellence
          </span>
        </div>
      </div>

      {/* Utility Quick Links Bar */}
      <div className="utility-bar">
        <div className="utility-container">
          <div className="utility-left-links">
            <button 
              type="button"
              onClick={() => setActiveTab('find-doctors')} 
              className="utility-link"
            >
              Find a Doctor
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('blogs')} 
              className="utility-link"
            >
              Blogs
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('my-appointments')} 
              className="utility-link"
            >
              My Appointments & Reports
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('rare-cases')} 
              className="utility-link"
            >
              Rare Cases
            </button>
          </div>

          <div className="utility-right-contact">
            {/* Database Status Pill */}
            <button 
              type="button"
              onClick={toggleDbModal}
              className={`db-status-pill ${dbStatus?.connected ? 'connected' : 'mock'}`}
              title="Click to check MySQL Connection Details"
            >
              <Database size={13} />
              <span>{dbStatus?.connected ? 'MySQL Connected' : 'MySQL Config / Demo'}</span>
            </button>

            {/* Role Switcher */}
            <div className="role-switch-container">
              <span className="role-switch-label">View:</span>
              <button 
                type="button"
                className={`role-btn ${userRole === 'patient' ? 'active' : ''}`}
                onClick={() => {
                  setRole('patient');
                  setActiveTab('home');
                }}
              >
                Patient
              </button>
              <button 
                type="button"
                className={`role-btn ${userRole === 'doctor' ? 'active' : ''}`}
                onClick={() => {
                  setRole('doctor');
                  setActiveTab('doctor-portal');
                }}
              >
                Doctor Portal
              </button>
            </div>

            <a href="https://wa.me/918650559698" target="_blank" rel="noreferrer" className="contact-link whatsapp">
              <MessageCircle size={14} />
              <span>WhatsApp Us (24/7)</span>
            </a>
            <a href="tel:+918650559698" className="contact-link phone">
              <Phone size={14} />
              <span>+91 8650559698 (24/7)</span>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
