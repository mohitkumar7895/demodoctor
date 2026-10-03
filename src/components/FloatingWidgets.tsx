'use client';

import React, { useState } from 'react';
import { Phone, ArrowUp, PhoneCall, X, CheckCircle2 } from 'lucide-react';
import { useDoctorContext } from '@/context/DoctorContext';

export default function FloatingWidgets() {
  const { openBooking, showToast } = useDoctorContext();
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone.trim()) return;
    setCallbackSubmitted(true);
    showToast('Call back request received! Our medical desk will call you at ' + callbackPhone + ' in 5 minutes.', 'success');
    setTimeout(() => {
      setIsCallbackOpen(false);
      setCallbackSubmitted(false);
      setCallbackPhone('');
    }, 2500);
  };

  return (
    <>
      {/* Right Vertical Emergency Banner (Moved from left to right side) */}
      <div 
        className="vertical-emergency-tab right-side"
        onClick={() => openBooking()}
        title="24/7 Emergency & Trauma Helpline: +91 8650559698"
      >
        <span className="emergency-letter">E</span>
        <span className="emergency-letter">M</span>
        <span className="emergency-letter">E</span>
        <span className="emergency-letter">R</span>
        <span className="emergency-letter">G</span>
        <span className="emergency-letter">E</span>
        <span className="emergency-letter">N</span>
        <span className="emergency-letter">C</span>
        <span className="emergency-letter">Y</span>
      </div>

      {/* Bottom Right Floating Contact Box */}
      <aside aria-label="Floating emergency phone and quick call back actions" className="floating-action-cluster">
        {/* Scroll to Top */}
        <button
          type="button"
          className="scroll-top-btn"
          onClick={handleScrollToTop}
          title="Scroll to Top"
        >
          <ArrowUp size={16} />
          <span className="sr-only">Top</span>
        </button>

        {/* 24/7 Phone Widget with updated number: 8650559698 */}
        <a 
          href="tel:+918650559698" 
          className="floating-phone-badge"
          title="Call 24/7 Emergency Support"
        >
          <div className="phone-clock-icon">
            <span className="badge-247">24/7</span>
          </div>
          <span className="phone-number-text">+91 8650559698</span>
        </a>

        {/* Call Back Button */}
        <button
          type="button"
          className="floating-callback-btn"
          onClick={() => setIsCallbackOpen(true)}
        >
          <PhoneCall size={15} />
          <span>Call Back</span>
        </button>
      </aside>

      {/* Call Back Modal */}
      {isCallbackOpen && (
        <div className="modal-overlay" onClick={() => setIsCallbackOpen(false)}>
          <div className="modal-container callback-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="header-text-group">
                <span className="modal-pill-tag">Instant Callback</span>
                <h3 className="modal-title">Request a Medical Callback</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setIsCallbackOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {callbackSubmitted ? (
              <div className="callback-success-box">
                <CheckCircle2 size={40} className="success-icon" />
                <h4>Thank you!</h4>
                <p>Our hospital care representative is connecting with you right now at {callbackPhone}.</p>
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit} className="callback-form">
                <p className="callback-help-text">
                  Leave your contact number. Our patient assistance coordinator will call you back within 5 minutes or call us directly at <strong>+91 8650559698</strong>.
                </p>
                <div className="form-field">
                  <label className="field-label">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 8650559698"
                    value={callbackPhone}
                    onChange={(e) => setCallbackPhone(e.target.value)}
                    className="form-input"
                    autoFocus
                  />
                </div>
                <button type="submit" className="submit-callback-btn">
                  Connect Me Now
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
