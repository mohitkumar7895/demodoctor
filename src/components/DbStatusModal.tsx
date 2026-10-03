'use client';

import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertTriangle, RefreshCw, Server, ShieldAlert } from 'lucide-react';
import { useDoctorContext } from '@/context/DoctorContext';

export default function DbStatusModal() {
  const { isDbModalOpen, toggleDbModal, dbStatus, initMysqlTables, refreshData } = useDoctorContext();
  const [initializing, setInitializing] = useState(false);

  if (!isDbModalOpen) return null;

  const handleInit = async () => {
    setInitializing(true);
    await initMysqlTables();
    setInitializing(false);
  };

  return (
    <div className="modal-overlay" onClick={toggleDbModal}>
      <div 
        className="modal-container db-status-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="header-text-group">
            <span className="modal-pill-tag">Database & Backend Architecture</span>
            <h2 className="modal-title">MySQL Database Status</h2>
          </div>
          <button 
            type="button" 
            className="modal-close-btn"
            onClick={toggleDbModal}
          >
            <X size={20} />
          </button>
        </div>

        <div className="db-modal-body">
          {/* Status Alert Banner */}
          <div className={`db-status-banner-box ${dbStatus?.connected ? 'success' : 'warning'}`}>
            <div className="status-banner-icon">
              {dbStatus?.connected ? (
                <CheckCircle2 size={24} className="text-emerald" />
              ) : (
                <AlertTriangle size={24} className="text-amber" />
              )}
            </div>
            <div>
              <h4 className="banner-title">
                {dbStatus?.connected 
                  ? 'Connected to Active MySQL Database' 
                  : 'Interactive In-Memory Fallback Active'}
              </h4>
              <p className="banner-desc">{dbStatus?.message}</p>
            </div>
          </div>

          {/* Details Table */}
          <div className="db-details-grid">
            <div className="db-detail-item">
              <span className="detail-label">Active Mode</span>
              <span className="detail-value highlight">
                {dbStatus?.mode === 'mysql' ? 'MySQL Pool (mysql2/promise)' : 'In-Memory State Store'}
              </span>
            </div>
            <div className="db-detail-item">
              <span className="detail-label">Host</span>
              <span className="detail-value">{dbStatus?.host || 'localhost'}</span>
            </div>
            <div className="db-detail-item">
              <span className="detail-label">Target Database</span>
              <span className="detail-value">{dbStatus?.database || 'doctor_db'}</span>
            </div>
            <div className="db-detail-item">
              <span className="detail-label">Tables Detected</span>
              <span className="detail-value">{dbStatus?.tableCount ?? 0} Tables</span>
            </div>
          </div>

          {/* Actions */}
          <div className="db-actions-row">
            <button
              type="button"
              className="db-action-btn primary"
              disabled={initializing}
              onClick={handleInit}
            >
              <RefreshCw size={15} className={initializing ? 'spin' : ''} />
              <span>{initializing ? 'Running Migration...' : 'Initialize & Seed MySQL Tables'}</span>
            </button>

            <button
              type="button"
              className="db-action-btn secondary"
              onClick={() => refreshData()}
            >
              <Server size={15} />
              <span>Test Connection</span>
            </button>
          </div>

          {/* Configuration Guide for MySQL */}
          <div className="env-guide-box">
            <h5 className="guide-title">How to connect your Local MySQL (XAMPP / MySQL Server / Docker):</h5>
            <p className="guide-text">
              1. Make sure your MySQL service is running on port 3306.<br />
              2. Verify or update <code>.env.local</code> in the root directory:
            </p>
            <pre className="env-code-snippet">
{`DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=doctor_db
DB_PORT=3306`}
            </pre>
            <p className="guide-note">
              3. You can run <code>scripts/schema.sql</code> in phpMyAdmin / MySQL Workbench, or click the <strong>&quot;Initialize &amp; Seed MySQL Tables&quot;</strong> button above to auto-create all tables and seed data!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
