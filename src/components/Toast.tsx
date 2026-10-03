'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useDoctorContext } from '@/context/DoctorContext';

export default function Toast() {
  const { toast } = useDoctorContext();

  if (!toast) return null;

  return (
    <div className={`toast-notification ${toast.type}`}>
      {toast.type === 'success' && <CheckCircle2 size={18} />}
      {toast.type === 'error' && <AlertCircle size={18} />}
      {toast.type === 'info' && <Info size={18} />}
      <span className="toast-message">{toast.message}</span>
    </div>
  );
}
