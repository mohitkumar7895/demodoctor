'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Stethoscope, SlidersHorizontal, CheckCircle2, RotateCcw } from 'lucide-react';
import { useDoctorContext } from '@/context/DoctorContext';
import DoctorCard from './DoctorCard';

const SPECIALTIES = [
  'All',
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics',
  'Neurology',
  'General Medicine',
];

export default function DoctorListingSection() {
  const {
    doctors,
    searchQuery,
    setSearchQuery,
    selectedSpecialty,
    setSelectedSpecialty,
    selectedLocation,
    setSelectedLocation,
  } = useDoctorContext();

  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'fee-low' | 'fee-high' | 'experience'>('rating');

  // Filter & sort doctors
  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doc) => {
        // Specialty filter
        if (selectedSpecialty !== 'All' && doc.specialty !== selectedSpecialty) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = doc.name.toLowerCase().includes(q);
          const matchSpec = doc.specialty.toLowerCase().includes(q);
          const matchHosp = doc.hospital.toLowerCase().includes(q);
          const matchLoc = doc.location.toLowerCase().includes(q);
          if (!matchName && !matchSpec && !matchHosp && !matchLoc) {
            return false;
          }
        }

        // Location filter
        if (selectedLocation !== 'All Locations') {
          const cleanLoc = selectedLocation.split('(')[0].trim().toLowerCase();
          if (!doc.location.toLowerCase().includes(cleanLoc)) {
            // Check if matches partial
            const words = cleanLoc.split(/[\s,]+/);
            const matchesWord = words.some(w => w.length > 3 && doc.location.toLowerCase().includes(w));
            if (!matchesWord) return false;
          }
        }

        // Available today filter
        if (availableTodayOnly && !doc.isAvailableToday) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'fee-low') return a.consultationFee - b.consultationFee;
        if (sortBy === 'fee-high') return b.consultationFee - a.consultationFee;
        if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
        return 0;
      });
  }, [doctors, searchQuery, selectedSpecialty, selectedLocation, availableTodayOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('All');
    setSelectedLocation('All Locations');
    setAvailableTodayOnly(false);
    setSortBy('rating');
  };

  return (
    <section className="doctor-listing-section" id="doctors-list">
      <div className="listing-container">
        {/* Section Heading */}
        <div className="listing-header">
          <div>
            <span className="listing-eyebrow">Expert Medical Specialists</span>
            <h2 className="listing-main-title">Find & Consult Top Doctors</h2>
            <p className="listing-subtext">
              Book confirmed in-person hospital visits or online video consultations with India&apos;s leading practitioners.
            </p>
          </div>

          <div className="doctors-count-badge">
            <Stethoscope size={18} />
            <span>Showing <strong>{filteredDoctors.length}</strong> Specialists</span>
          </div>
        </div>

        {/* Filter & Search Controls Bar */}
        <div className="filter-controls-bar">
          {/* Search Input */}
          <div className="search-filter-box">
            <Search size={18} className="search-box-icon" />
            <input
              type="text"
              placeholder="Search doctor, condition, or hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-box-input"
            />
          </div>

          {/* Quick Specialty Pills */}
          <div className="specialty-pills-row">
            {SPECIALTIES.map((spec) => (
              <button
                key={spec}
                type="button"
                className={`spec-pill-btn ${selectedSpecialty === spec ? 'active' : ''}`}
                onClick={() => setSelectedSpecialty(spec)}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Secondary Controls: Available Today toggle & Sort */}
          <div className="secondary-filters-row">
            <label className="available-today-checkbox">
              <input
                type="checkbox"
                checked={availableTodayOnly}
                onChange={(e) => setAvailableTodayOnly(e.target.checked)}
              />
              <span className="chk-label">Available Today</span>
            </label>

            <div className="sort-dropdown-wrap">
              <span className="sort-label">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="fee-low">Fee: Low to High</option>
                <option value="fee-high">Fee: High to Low</option>
              </select>
            </div>

            {(selectedSpecialty !== 'All' || searchQuery || availableTodayOnly || selectedLocation !== 'All Locations') && (
              <button
                type="button"
                className="reset-filters-btn"
                onClick={handleResetFilters}
              >
                <RotateCcw size={14} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="no-doctors-card">
            <Stethoscope size={44} className="no-doc-icon" />
            <h3>No doctors found matching your criteria</h3>
            <p>Try searching for a different condition, removing filters, or resetting your search.</p>
            <button
              type="button"
              className="reset-action-btn"
              onClick={handleResetFilters}
            >
              Show All Available Doctors
            </button>
          </div>
        ) : (
          <div className="doctors-cards-grid">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
