'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, FileText, CheckCircle2, AlertCircle, Stethoscope, Printer } from 'lucide-react';
import { useDoctorContext } from '@/context/DoctorContext';
import { PrescriptionItem } from '@/lib/types';

export default function PrescriptionModal() {
  const { 
    isPrescriptionOpen, 
    closePrescriptionModal, 
    activeAppointmentForPrescription, 
    addPrescription 
  } = useDoctorContext();

  const [diagnosis, setDiagnosis] = useState('');
  const [items, setItems] = useState<PrescriptionItem[]>([
    {
      medicine: 'Paracetamol 650mg',
      dosage: '1 Tablet',
      frequency: 'SOS (When needed for fever)',
      duration: '3 Days',
      instructions: 'After meals with warm water',
    },
    {
      medicine: 'Amoxicillin + Clavulanic Acid 625mg',
      dosage: '1 Tablet',
      frequency: 'Twice daily',
      duration: '5 Days',
      instructions: 'After breakfast and dinner',
    },
  ]);
  const [advice, setAdvice] = useState('Maintain proper hydration (3L water/day). Avoid cold drinks and oily food. Revisit clinic if fever exceeds 101°F.');
  const [saving, setSaving] = useState(false);

  if (!isPrescriptionOpen || !activeAppointmentForPrescription) return null;

  const appt = activeAppointmentForPrescription;

  const handleAddItem = () => {
    setItems([
      ...items,
      { medicine: '', dosage: '1 Tablet', frequency: 'Twice daily', duration: '5 Days', instructions: 'After food' }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof PrescriptionItem, value: string) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      alert('Please enter a clinical diagnosis');
      return;
    }

    setSaving(true);
    await addPrescription({
      appointmentId: appt.id,
      doctorId: appt.doctorId,
      doctorName: appt.doctorName,
      doctorSpecialty: appt.doctorSpecialty,
      patientId: appt.patientId,
      patientName: appt.patientName,
      diagnosis,
      items: items.filter(it => it.medicine.trim() !== ''),
      advice,
    });
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={closePrescriptionModal}>
      <div 
        className="modal-container prescription-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="header-text-group">
            <span className="modal-pill-tag">Digital Health Rx</span>
            <h2 className="modal-title">Write Medical Prescription</h2>
          </div>
          <button 
            type="button"
            className="modal-close-btn"
            onClick={closePrescriptionModal}
          >
            <X size={20} />
          </button>
        </div>

        {/* Prescription Header / Doctor & Patient Details */}
        <div className="rx-sheet-header">
          <div className="rx-doctor-info">
            <div className="rx-doctor-avatar">
              <Stethoscope size={22} />
            </div>
            <div>
              <h3 className="rx-doctor-name">{appt.doctorName}</h3>
              <p className="rx-doctor-sub">{appt.doctorSpecialty} Specialist</p>
            </div>
          </div>

          <div className="rx-patient-info">
            <p><strong>Patient:</strong> {appt.patientName} ({appt.patientAge || '35'} Yrs, {appt.patientGender || 'Male'})</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            <p><strong>Appt ID:</strong> {appt.id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="prescription-form">
          {/* Diagnosis */}
          <div className="form-field">
            <label className="field-label">Clinical Diagnosis *</label>
            <input
              type="text"
              required
              placeholder="e.g. Acute Upper Respiratory Tract Infection / Seasonal Rhinitis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="form-input bold"
            />
          </div>

          {/* Medicines List */}
          <div className="presc-medicines-section">
            <div className="section-title-between">
              <label className="field-label rx-symbol">℞ Prescribed Medications</label>
              <button 
                type="button" 
                className="add-med-btn"
                onClick={handleAddItem}
              >
                <Plus size={15} /> Add Medication
              </button>
            </div>

            <div className="medicine-rows-list">
              {items.map((item, idx) => (
                <div key={idx} className="medicine-row-card">
                  <div className="med-row-top">
                    <span className="med-index">#{idx + 1}</span>
                    <input
                      type="text"
                      placeholder="Medicine Name (e.g. Paracetamol 650mg)"
                      value={item.medicine}
                      onChange={(e) => handleItemChange(idx, 'medicine', e.target.value)}
                      className="form-input med-name-input"
                      required
                    />
                    <button
                      type="button"
                      className="med-delete-btn"
                      onClick={() => handleRemoveItem(idx)}
                      title="Remove medicine"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="med-details-grid">
                    <div>
                      <label className="sub-label">Dosage</label>
                      <input
                        type="text"
                        placeholder="1 Tablet / 5ml"
                        value={item.dosage}
                        onChange={(e) => handleItemChange(idx, 'dosage', e.target.value)}
                        className="form-input mini"
                      />
                    </div>
                    <div>
                      <label className="sub-label">Frequency</label>
                      <input
                        type="text"
                        placeholder="Twice daily / SOS"
                        value={item.frequency}
                        onChange={(e) => handleItemChange(idx, 'frequency', e.target.value)}
                        className="form-input mini"
                      />
                    </div>
                    <div>
                      <label className="sub-label">Duration</label>
                      <input
                        type="text"
                        placeholder="5 Days"
                        value={item.duration}
                        onChange={(e) => handleItemChange(idx, 'duration', e.target.value)}
                        className="form-input mini"
                      />
                    </div>
                    <div>
                      <label className="sub-label">Instructions</label>
                      <input
                        type="text"
                        placeholder="After food / Before bed"
                        value={item.instructions}
                        onChange={(e) => handleItemChange(idx, 'instructions', e.target.value)}
                        className="form-input mini"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Advice & Dietary Guidelines */}
          <div className="form-field">
            <label className="field-label">General Advice & Lifestyle Guidelines</label>
            <textarea
              rows={2}
              placeholder="Advice regarding rest, diet, fluid intake, and warning signs to watch for..."
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              className="form-textarea"
            ></textarea>
          </div>

          {/* Footer Save & Print */}
          <div className="prescription-footer-bar">
            <button
              type="button"
              className="rx-print-preview-btn"
              onClick={() => window.print()}
            >
              <Printer size={16} />
              <span>Print Prescription</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rx-save-complete-btn"
            >
              <CheckCircle2 size={17} />
              <span>{saving ? 'Saving...' : 'Save & Mark Consultation Complete'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
