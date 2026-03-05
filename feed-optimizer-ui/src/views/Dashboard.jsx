import React from 'react';
import { useLanguage } from '../components/LanguageContext';
import { Button } from '../components/ui/Shared';
import { 
  LayoutDashboard, 
  History, 
  Settings
} from 'lucide-react';

export const Dashboard = ({ onOpenCalculator, activeSubView }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F5F7FA] flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 p-6 space-y-2">
        <div className="p-4 bg-gray-50 rounded-xl mb-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active View</div>
          <div className="text-sm font-bold text-[#2E7D32]">{t(activeSubView === 'calculate' ? 'calculateFormula' : activeSubView)}</div>
        </div>
        {[
          { id: 'overview', icon: <LayoutDashboard size={20} />, label: 'Overview' },
          { id: 'history', icon: <History size={20} />, label: 'History' },
          { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
        ].map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-gray-500 hover:bg-[#F5F7FA] hover:text-[#2E7D32]"
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </aside>

      <main className="flex-1 p-6 md:p-10 text-center flex flex-col items-center justify-center text-left">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6">
          <Settings size={40} />
        </div>
        <h1 className="text-2xl font-bold text-gray-400">Section Under Construction</h1>
        <p className="text-gray-500 mt-2 max-w-sm">
          We are currently working on the <b>{t(activeSubView)}</b> module. Please check back later or use the <b>{t('calculateFormula')}</b> tool.
        </p>
        <Button className="mt-8" onClick={() => window.location.reload()}>
          Refresh Dashboard
        </Button>
      </main>
    </div>
  );
};
