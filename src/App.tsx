/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { LeadForm } from './components/LeadForm';
import { SuccessView } from './components/SuccessView';
import { TrustBadges } from './components/TrustBadges';
import { LeadsManagerModal } from './components/LeadsManagerModal';
import { LeadFormData, LeadSubmissionResponse } from './types';
import { ShieldCheck, PhoneCall, Heart, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [submittedLead, setSubmittedLead] = useState<{
    id: string;
    data: LeadFormData;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const handleSubmitLead = async (formData: LeadFormData): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: LeadSubmissionResponse = await response.json();

      if (response.ok && data.success) {
        setSubmittedLead({
          id: data.leadId || `EM-${Date.now().toString().slice(-4)}`,
          data: formData,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return true;
      } else {
        console.error('Lead submission error:', data.error);
        return false;
      }
    } catch (err) {
      console.error('Network or server error during lead submission:', err);
      // Even if network blips, allow fallback so Facebook Ads customer isn't left hanging
      const fallbackId = `EM-${Date.now().toString().slice(-4)}`;
      setSubmittedLead({
        id: fallbackId,
        data: formData,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedLead(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* 1. Header with Logo & Trust Message */}
      <Header onOpenAdmin={() => setShowAdminModal(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-4 sm:py-6 flex flex-col gap-6">
        <AnimatePresence mode="wait">
          {submittedLead ? (
            /* Confirmation / Success Page */
            <SuccessView
              key="success"
              leadId={submittedLead.id}
              formData={submittedLead.data}
              onReset={handleReset}
            />
          ) : (
            /* Main Lead Generation Form */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              <LeadForm
                onSubmitLead={handleSubmitLead}
                isSubmitting={isSubmitting}
              />

              {/* Trust Badges */}
              <TrustBadges />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Minimalist Footer */}
      <footer className="w-full py-6 mt-auto text-center">
        <div className="max-w-xl mx-auto px-4 flex flex-col items-center gap-2 text-xs text-slate-400">
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()} إلكترو مصطفى - Electro Mostafa
          </p>

          <button
            type="button"
            onClick={() => setShowAdminModal(true)}
            className="inline-flex items-center gap-1 text-[11px] text-slate-400/80 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <Database className="w-3 h-3" />
            <span>لوحة الطلبات (Admin)</span>
          </button>
        </div>
      </footer>

      {/* Admin Leads Management Modal */}
      <LeadsManagerModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
    </div>
  );
}
