'use client';

import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, HeartPulse, ChevronRight, MessageCircle } from 'lucide-react';
import { useDoctorContext } from '@/context/DoctorContext';

export default function Footer() {
  const { setActiveTab, setSelectedSpecialty, openBooking } = useDoctorContext();

  const handleSpecialtyClick = (specialty: string) => {
    setSelectedSpecialty(specialty);
    setActiveTab('find-doctors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      {/* 24x7 Emergency Help Bar */}
      <div className="emergency-contact-strip">
        <div className="strip-container">
          <div className="strip-left">
            <span className="emergency-icon-pulse">🚨</span>
            <div>
              <strong className="emergency-title">24x7 Emergency Ambulance &amp; Trauma Care</strong>
              <p className="emergency-desc">Immediate medical response across all hospital units</p>
            </div>
          </div>
          <div className="strip-right">
            <a href="tel:+918650559698" className="emergency-call-btn">
              <Phone size={16} /> Call +91 8650559698
            </a>
            <a href="https://wa.me/918650559698" target="_blank" rel="noreferrer" className="emergency-wa-btn">
              <MessageCircle size={16} /> WhatsApp Care
            </a>
          </div>
        </div>
      </div>

      <div className="footer-main-container">
        <div className="footer-cols-grid">
          {/* Col 1: Brand Info */}
          <div className="footer-col brand-col">
            <div className="brand-logo-footer">
              <div className="logo-symbol mini">
                <div className="cross-core">
                  <span className="cross-bar-h"></span>
                  <span className="cross-bar-v"></span>
                </div>
              </div>
              <span className="brand-name">DOCTOR <span className="brand-highlight">DEMO</span></span>
            </div>
            <p className="footer-about">
              DOCTOR DEMO Healthcare is a state-of-the-art medical network delivering advanced robotic surgeries, organ transplants, emergency triage, and seamless digital consultations with world-class clinicians.
            </p>
            <div className="accreditation-badge">
              <ShieldCheck size={20} className="shield-icon" />
              <span>JCI &amp; NABH Accredited Multi-speciality Centers</span>
            </div>
          </div>

          {/* Col 2: Super Specialities */}
          <div className="footer-col">
            <h4 className="footer-col-title">Super Specialities</h4>
            <ul className="footer-links-list">
              <li><button type="button" onClick={() => handleSpecialtyClick('Cardiology')}>Cardiac Sciences &amp; LVAD</button></li>
              <li><button type="button" onClick={() => handleSpecialtyClick('Cardiology')}>Cancer Care / Oncology (CAR-T)</button></li>
              <li><button type="button" onClick={() => handleSpecialtyClick('Neurology')}>Neurosciences &amp; Spine Surgery</button></li>
              <li><button type="button" onClick={() => handleSpecialtyClick('Orthopedics')}>Orthopaedics &amp; Joint Replacement</button></li>
              <li><button type="button" onClick={() => handleSpecialtyClick('Pediatrics')}>Pediatrics &amp; Neonatology</button></li>
              <li><button type="button" onClick={() => handleSpecialtyClick('Dermatology')}>Dermatology &amp; Cosmetology</button></li>
              <li><button type="button" onClick={() => handleSpecialtyClick('General Medicine')}>Internal Medicine &amp; Diabetes</button></li>
            </ul>
          </div>

          {/* Col 3: Network Hospitals */}
          <div className="footer-col">
            <h4 className="footer-col-title">Our Hospitals</h4>
            <ul className="footer-links-list">
              <li><span>Doctor Demo Hospital Network, Delhi / NCR</span></li>
              <li><span>Doctor Demo Super Speciality Hospital, Mohali</span></li>
              <li><span>Doctor Demo Hospital, Mumbai</span></li>
              <li><span>Doctor Demo Super Speciality Hospital, Lucknow</span></li>
              <li><span>Doctor Demo Multi Speciality Hospital, Dehradun</span></li>
              <li><span>Doctor Demo Hospital, Ghaziabad</span></li>
            </ul>
          </div>

          {/* Col 4: For Patients & Quick Actions */}
          <div className="footer-col">
            <h4 className="footer-col-title">For Patients</h4>
            <ul className="footer-links-list">
              <li><button type="button" onClick={() => { setActiveTab('find-doctors'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Find a Doctor</button></li>
              <li><button type="button" onClick={() => openBooking()}>Book an Appointment</button></li>
              <li><button type="button" onClick={() => { setActiveTab('my-appointments'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>View My Prescriptions</button></li>
              <li><button type="button" onClick={() => { setActiveTab('blogs'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Health Blogs &amp; Guides</button></li>
              <li><button type="button" onClick={() => { setActiveTab('rare-cases'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Rare Clinical Cases</button></li>
            </ul>
          </div>
        </div>

        {/* Advisory and Compliance Notice */}
        <div className="footer-advisory-box">
          <p className="advisory-text">
            <strong>Advisory Notice:</strong> DOCTOR DEMO Healthcare never charges any fees for employment opportunities. Beware of fraudulent agents claiming to represent our hospitals. Always book consultations directly via our official platform or verified hospital desks.
          </p>
          <p className="disclaimer-text">
            <strong>Medical Disclaimer:</strong> The content provided on this portal is for informative purposes only and does not constitute formal medical diagnosis or treatment advice without a physician consultation.
          </p>
        </div>

        {/* Bottom copyright line */}
        <div className="footer-bottom-bar">
          <p>© 2026 DOCTOR DEMO Healthcare Network. All Rights Reserved.</p>
          <div className="footer-legal-links">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Bio-Medical Compliance</span>
            <span>Stent &amp; Knee Implant Pricing</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
