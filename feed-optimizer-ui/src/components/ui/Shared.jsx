import React from 'react';
import { motion } from 'motion/react';

export const Button = ({ variant = 'primary', size = 'md', className = '', ...props }) => {
  const variants = {
    primary: 'bg-[#2E7D32] text-white hover:bg-[#1B5E20] shadow-sm',
    secondary: 'bg-[#C8A951] text-white hover:bg-[#B69640] shadow-sm',
    outline: 'border-2 border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9]',
    ghost: 'text-[#2E7D32] hover:bg-[#E8F5E9]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-full font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
};

export const Card = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' } : {}}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl border border-gray-100 p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const Input = ({ label, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all"
        {...props}
      />
    </div>
  );
};
