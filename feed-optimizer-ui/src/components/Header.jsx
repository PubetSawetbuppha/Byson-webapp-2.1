import React, { useState } from 'react';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { Button } from './ui/Shared';
import { motion, AnimatePresence } from 'motion/react';
import logo from '../assets/images/Byson_Logo.png';

export const Header = ({ currentView, setView, activeSubView, setActiveSubView }) => {
  const { lang, setLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'home' },
    { id: 'about', label: 'about' },
    { id: 'product', label: 'product' },
    { id: 'program', label: 'program' },
  ];

  const programOptions = [
    { id: 'calculate', label: 'calculateFormula' },
    { id: 'analyze', label: 'analyzeFormula' },
    { id: 'materials', label: 'rawMaterials' },
    { id: 'animals', label: 'animals' },
  ];

  const handleNav = (id) => {
    setView(id);
    setIsOpen(false);
    setIsSubMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav('home')}>
          <img 
            src={logo}
            alt="Byson Logo"
            className="w-12 h-12 object-contain"
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <div key={item.id} className="relative">
              {item.id === 'program' ? (
                <div className="flex items-center gap-1 group">
                  <button
                    onClick={() => handleNav(item.id)}
                    className={`text-sm font-medium transition-colors hover:text-[#2E7D32] flex items-center gap-1 ${
                      currentView === item.id ? 'text-[#2E7D32]' : 'text-gray-600'
                    }`}
                  >
                    {t(item.label)}
                  </button>
                  <button 
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                  >
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isSubMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isSubMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2"
                      >
                        {programOptions.map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setView('program');
                              setActiveSubView(opt.id);
                              setIsSubMenuOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-[#F5F7FA] ${
                              activeSubView === opt.id && currentView === 'program' ? 'text-[#2E7D32] bg-[#E8F5E9] font-bold' : 'text-gray-600'
                            }`}
                          >
                            {t(opt.label)}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => handleNav(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-[#2E7D32] ${
                    currentView === item.id ? 'text-[#2E7D32]' : 'text-gray-600'
                  }`}
                >
                  {t(item.label)}
                </button>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setLang(lang === 'TH' ? 'EN' : 'TH')}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#2E7D32] transition-colors"
          >
            <Globe size={18} />
            {lang}
          </button>
          <Button size="sm" onClick={() => handleNav('program')}>
            {t('openProgram')}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {navItems.map((item) => (
                <div key={item.id} className="flex flex-col gap-2">
                  <button
                    onClick={() => handleNav(item.id)}
                    className={`text-left text-lg font-medium ${currentView === item.id ? 'text-[#2E7D32]' : 'text-gray-600'}`}
                  >
                    {t(item.label)}
                  </button>
                  {item.id === 'program' && (
                    <div className="pl-4 flex flex-col gap-3 mt-2 border-l-2 border-gray-100">
                      {programOptions.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            handleNav('program');
                            setActiveSubView(opt.id);
                          }}
                          className={`text-left text-sm ${activeSubView === opt.id ? 'text-[#2E7D32] font-bold' : 'text-gray-500'}`}
                        >
                          {t(opt.label)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex items-center justify-between border-t pt-6">
                <button
                  onClick={() => setLang(lang === 'TH' ? 'EN' : 'TH')}
                  className="flex items-center gap-2 text-base font-medium text-gray-600"
                >
                  <Globe size={20} />
                  {lang === 'TH' ? 'ภาษาไทย' : 'English'}
                </button>
                <Button onClick={() => handleNav('program')}>
                  {t('openProgram')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};