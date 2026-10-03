'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  Brain, 
  Bone, 
  ShieldAlert, 
  Baby, 
  Eye, 
  Syringe, 
  Stethoscope, 
  ArrowRight,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useDoctorContext } from '@/context/DoctorContext';

interface SpecialtyItem {
  id: string;
  name: string;
  count: string;
  description: string;
  icon: React.ReactNode;
}

const SPECIALITIES_LIST: SpecialtyItem[] = [
  {
    id: 'robotic-surgery',
    name: 'Robotic Surgery',
    count: '35+ Surgeons',
    description: 'Da Vinci Xi 4th Gen robotic system for ultra-precise minimally invasive surgery',
    icon: <Activity className="spec-icon" size={28} />,
  },
  {
    id: 'cancer-care',
    name: 'Cancer Care / Oncology',
    count: '42+ Specialists',
    description: 'Comprehensive CAR-T cell therapy, precision radiation and medical oncology',
    icon: <ShieldAlert className="spec-icon" size={28} />,
  },
  {
    id: 'cardiac-sciences',
    name: 'Cardiac Sciences',
    count: '50+ Cardiologists',
    description: 'Heart bypass (CABG), TAVI, LVAD, angioplasty and advanced cardiac care',
    icon: <Heart className="spec-icon" size={28} />,
  },
  {
    id: 'orthopaedics',
    name: 'Orthopaedics & Joint Replacement',
    count: '38+ Surgeons',
    description: 'World-first same-day discharge robotic knee and hip replacements',
    icon: <Bone className="spec-icon" size={28} />,
  },
  {
    id: 'neurosciences',
    name: 'Neurosciences',
    count: '29+ Neurologists',
    description: 'Microsurgical spine, stroke management, brain aneurysm and deep brain stimulation',
    icon: <Brain className="spec-icon" size={28} />,
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics & Neonatology',
    count: '32+ Specialists',
    description: 'Advanced PICU/NICU, pediatric cardiology, child immunology and surgery',
    icon: <Baby className="spec-icon" size={28} />,
  },
  {
    id: 'internal-medicine',
    name: 'Internal Medicine',
    count: '60+ Physicians',
    description: 'Chronic diabetes care, geriatric health, autoimmune and infectious diseases',
    icon: <Stethoscope className="spec-icon" size={28} />,
  },
  {
    id: 'dermatology',
    name: 'Dermatology & Cosmetology',
    count: '24+ Specialists',
    description: 'Advanced laser therapy, clinical dermatology, hair and aesthetic skin care',
    icon: <Syringe className="spec-icon" size={28} />,
  },
];

const PROCEDURES_LIST = [
  { name: 'CAR T-Cell Therapy', category: 'Cancer Care', badge: 'Groundbreaking' },
  { name: 'Robotic Heart Surgery', category: 'Cardiac', badge: 'Minimally Invasive' },
  { name: 'The Da Vinci Xi Robotic Surgery', category: 'General & Uro', badge: 'State-of-art' },
  { name: 'Bilateral Knee Replacement', category: 'Orthopaedics', badge: 'Same-day Discharge' },
  { name: 'Coronary Artery Bypass Grafting (CABG)', category: 'Heart Institute', badge: 'Gold Standard' },
  { name: 'Frozen Elephant Trunk Aortic Repair', category: 'Vascular', badge: 'Rare Surgery' },
  { name: 'Kidney & Liver Transplant', category: 'Transplant Institute', badge: '98% Success' },
  { name: 'Focal One Robotic HIFU', category: 'Prostate Care', badge: 'North India 1st' },
];

export default function SpecialtiesSection() {
  const [activeSubTab, setActiveSubTab] = useState<'specialities' | 'procedures'>('specialities');
  const { setSelectedSpecialty, setActiveTab } = useDoctorContext();

  const handleSelectSpecialty = (specName: string) => {
    // Map to known category
    if (specName.includes('Cardiac')) setSelectedSpecialty('Cardiology');
    else if (specName.includes('Orthopaedics')) setSelectedSpecialty('Orthopedics');
    else if (specName.includes('Neurosciences')) setSelectedSpecialty('Neurology');
    else if (specName.includes('Pediatrics')) setSelectedSpecialty('Pediatrics');
    else if (specName.includes('Dermatology')) setSelectedSpecialty('Dermatology');
    else if (specName.includes('Internal Medicine')) setSelectedSpecialty('General Medicine');
    else setSelectedSpecialty('All');

    setActiveTab('find-doctors');
  };

  return (
    <section className="specialties-section" id="specialities-hub">
      <div className="specialties-container">
        {/* Header Tabs */}
        <div className="section-title-wrap">
          <h2 className="section-main-title">Specialities & Procedures</h2>
          <div className="subtabs-toggle">
            <button
              type="button"
              className={`subtab-btn ${activeSubTab === 'specialities' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('specialities')}
            >
              Specialities
            </button>
            <button
              type="button"
              className={`subtab-btn ${activeSubTab === 'procedures' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('procedures')}
            >
              Procedures
            </button>
          </div>
        </div>

        {/* Content Layout: 2 Columns (Grid + Expert Callout) */}
        <div className="specialties-dual-layout">
          {/* Left Column: Interactive Grid */}
          <div className="specialties-grid-col">
            {activeSubTab === 'specialities' ? (
              <div className="specs-items-grid">
                {SPECIALITIES_LIST.map((spec) => (
                  <div
                    key={spec.id}
                    className="spec-item-card"
                    onClick={() => handleSelectSpecialty(spec.name)}
                  >
                    <div className="spec-icon-box">{spec.icon}</div>
                    <div className="spec-info-box">
                      <h4 className="spec-name">{spec.name}</h4>
                      <p className="spec-desc">{spec.description}</p>
                      <span className="spec-count-tag">{spec.count}</span>
                    </div>
                    <ChevronRight size={18} className="spec-arrow" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="procedures-grid">
                {PROCEDURES_LIST.map((proc, idx) => (
                  <div 
                    key={idx} 
                    className="procedure-card"
                    onClick={() => setActiveTab('find-doctors')}
                  >
                    <div className="procedure-badge">{proc.badge}</div>
                    <h4 className="procedure-title">{proc.name}</h4>
                    <span className="procedure-cat">{proc.category}</span>
                    <button type="button" className="procedure-link">
                      Learn more & Consult <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Teal Expert Callout Box (Exact match to screenshot 3) */}
          <div className="expert-callout-card">
            <div className="expert-callout-content">
              <span className="callout-pill">Super Specialists</span>
              <h3 className="callout-title">Looking for an Expert?</h3>
              <p className="callout-desc">
                Doctor Demo is home to some of the most eminent doctors, Padma awardees, and clinical researchers in the world.
              </p>

              <button
                type="button"
                className="expert-action-btn"
                onClick={() => setActiveTab('find-doctors')}
              >
                <span>Find a Doctor</span>
                <ChevronRight size={18} />
              </button>

              <ul className="expert-benefits-list">
                <li><CheckCircle2 size={15} /> Instant digital appointment confirmations</li>
                <li><CheckCircle2 size={15} /> Tele-consultation & second opinions</li>
                <li><CheckCircle2 size={15} /> Verified credentials & clinical outcomes</li>
              </ul>
            </div>

            {/* Doctor Illustration / Avatar Stack */}
            <div className="expert-card-illustration">
              <div className="doctor-badge-stack">
                <span className="badge-stat">100%</span>
                <span className="badge-label">Verified Medical Staff</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
