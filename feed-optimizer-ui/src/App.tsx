import React, { useState } from 'react';
import { LanguageProvider } from './components/LanguageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './views/Home';
import { About } from './views/About';
import { Product } from './views/Product';
import { Dashboard } from './views/Dashboard';
import OptimizePage from './views/OptimizePage';
import AnalyzePage from './views/AnalyzePage';
import MaterialListPage from './views/MaterialListPage';
import MaterialDetailPage from './views/MaterialDetailPage';
import AnimalListPage from './views/AnimalListPage';
import AnimalDetailPage from './views/AnimalDetailPage';
import AnimalRequirementPage from './views/AnimalRequirementPage';
import AnimalFeedLimitPage from './views/AnimalFeedLimitPage';
import { CalculatorModal } from './components/CalculatorModal';
import { AnimatePresence, motion } from 'motion/react';

const AppContent = () => {
  const [view, setView] = useState('home');
  const [activeSubView, setActiveSubView] = useState('calculate');

  // Selection states for detail views
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [selectedAnimalId, setSelectedAnimalId] = useState(null);
  const [animalConfigMode, setAnimalConfigMode] = useState(null); // 'requirements' | 'limits' | null

  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetSelections = () => {
    setSelectedMaterialId(null);
    setSelectedAnimalId(null);
    setAnimalConfigMode(null);
  };

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
          if (selectedMaterialId) {
            return <MaterialDetailPage
              materialId={selectedMaterialId}
              onBack={() => setSelectedMaterialId(null)}
            />;
          }
          return <MaterialListPage onSelectMaterial={setSelectedMaterialId} />;
        }
        if (activeSubView === 'animals') {
          if (selectedAnimalId) {
            if (animalConfigMode === 'requirements') {
              return <AnimalRequirementPage
                animalId={selectedAnimalId}
                onBack={() => setAnimalConfigMode(null)}
              />;
            }
            if (animalConfigMode === 'limits') {
              return <AnimalFeedLimitPage
                animalId={selectedAnimalId}
                onBack={() => setAnimalConfigMode(null)}
              />;
            }
            return <AnimalDetailPage
              animalId={selectedAnimalId}
              onBack={() => setSelectedAnimalId(null)}
              onSelectMode={setAnimalConfigMode}
            />;
          }
          return <AnimalListPage onSelectAnimal={setSelectedAnimalId} />;
        }
        return <Dashboard activeSubView={activeSubView} onOpenCalculator={() => setIsModalOpen(true)} />;
      default: return <Home setView={setView} />;
    }
  };

  const handleNavView = (v) => {
    setView(v);
    resetSelections();
  };

  const handleSubNav = (sv) => {
    setActiveSubView(sv);
    resetSelections();
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-[#12171D] selection:bg-[#2E7D32]/20">
      <Header
        currentView={view}
        setView={handleNavView}
        activeSubView={activeSubView}
        setActiveSubView={handleSubNav}
      />

      <main className="pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${view}-${activeSubView}-${selectedMaterialId}-${selectedAnimalId}-${animalConfigMode}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer
        setView={handleNavView}
        setActiveSubView={handleSubNav}
      />

      <AnimatePresence>
        {isModalOpen && (
          <CalculatorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
