'use client';

import React from 'react';
import { useDoctorContext } from '@/context/DoctorContext';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SpecialtiesSection from '@/components/SpecialtiesSection';
import DoctorListingSection from '@/components/DoctorListingSection';
import DoctorDashboard from '@/components/DoctorDashboard';
import PatientPortal from '@/components/PatientPortal';
import HealthBlogs from '@/components/HealthBlogs';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import DoctorDetailsModal from '@/components/DoctorDetailsModal';
import PrescriptionModal from '@/components/PrescriptionModal';
import DbStatusModal from '@/components/DbStatusModal';
import FloatingWidgets from '@/components/FloatingWidgets';
import Toast from '@/components/Toast';

export default function Home() {
  const { activeTab } = useDoctorContext();

  return (
    <div className="doctor-portal-app">
      {/* Clean Main Navigation */}
      <Navbar />

      {/* Main Content Rendered by Active Tab */}
      <main className="main-content-flow">
        {activeTab === 'home' && (
          <>
            <HeroSection />
            <SpecialtiesSection />
            <DoctorListingSection />
            <HealthBlogs />
          </>
        )}

        {activeTab === 'find-doctors' && (
          <div className="page-view-wrapper">
            <DoctorListingSection />
          </div>
        )}

        {activeTab === 'specialities' && (
          <div className="page-view-wrapper">
            <SpecialtiesSection />
            <DoctorListingSection />
          </div>
        )}

        {activeTab === 'my-appointments' && (
          <div className="page-view-wrapper">
            <PatientPortal />
          </div>
        )}

        {activeTab === 'doctor-portal' && (
          <div className="page-view-wrapper">
            <DoctorDashboard />
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="page-view-wrapper">
            <HealthBlogs />
          </div>
        )}

        {activeTab === 'rare-cases' && (
          <div className="page-view-wrapper">
            <HealthBlogs />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Global Modals */}
      <BookingModal />
      <DoctorDetailsModal />
      <PrescriptionModal />
      <DbStatusModal />
      <FloatingWidgets />
      <Toast />
    </div>
  );
}
