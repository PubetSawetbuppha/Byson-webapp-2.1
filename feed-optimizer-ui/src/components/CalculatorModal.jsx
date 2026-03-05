import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Calculator, Info, CheckCircle2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { Button, Card } from './ui/Shared';

export const CalculatorModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-lg bg-white rounded-3xl p-10 shadow-2xl text-center"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400">
          <X size={24} />
        </button>
        <div className="w-20 h-20 bg-[#2E7D32]/10 rounded-full flex items-center justify-center text-[#2E7D32] mx-auto mb-6">
          <Calculator size={40} />
        </div>
        <h3 className="text-2xl font-bold mb-4">Start New Formula</h3>
        <p className="text-gray-600 mb-8">Go to the Program section to use our advanced optimization tools.</p>
        <Button onClick={onClose} className="w-full">Continue to Dashboard</Button>
      </motion.div>
    </div>
  );
};
