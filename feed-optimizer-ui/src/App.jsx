import React, { useState } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Home } from './Home';
import { About } from './About';
import { Product } from './Product';
import { Dashboard } from './Dashboard';
import OptimizePage from './OptimizePage';
import AnalyzePage from './AnalyzePage';
import MaterialListPage from './MaterialListPage';
import AnimalListPage from './AnimalListPage';
import { CalculatorModal } from '../components/CalculatorModal';
import { AnimatePresence, motion } from 'motion/react';

export const AppContent = () => {
  const [view, setView] = useState('home');
  const [activeSubView, setActiveSubView] = useState('calculate');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderView = () => {
    switch (view) {
      case 'home': return <Home setView={setView} />;
      case 'about': return <About />;
      case 'product': return <Product />;
      case 'program': 
        if (activeSubView === 'calculate') {
          return <OptimizePage />;
        }
        if (activeSubView === 'analyze') {
          return <AnalyzePage />;
        }
        if (activeSubView === 'materials') {
          return <MaterialListPage onSelectMaterial={(id) => console.log('Material selected:', id)} />;
        }
        if (activeSubView === 'animals') {
          return <AnimalListPage onSelectAnimal={(id) => console.log('Animal selected:', id)} />;
        }
        return <Dashboard activeSubView={activeSubView} onOpenCalculator={() => setIsModalOpen(true)} />;
      default: return <Home setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-[#12171D] selection:bg-[#2E7D32]/20">
      <Header 
        currentView={view} 
        setView={setView} 
        activeSubView={activeSubView}
        setActiveSubView={setActiveSubView}
      />
      
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${view}-${activeSubView}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer setView={setView} />
      
      <AnimatePresence>
        {isModalOpen && (
          <CalculatorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

import { LanguageProvider } from '../components/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}