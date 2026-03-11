import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StoreList from './components/StoreList';
import StoreInventory from './components/StoreInventory';
import ItemCatalog from './components/ItemCatalog';
import DepartmentMaster from './components/DepartmentMaster';
import ProgramIssues from './components/ProgramIssues';
import Transactions from './components/Transactions';
import Purchases from './components/Purchases';
import ItemDetail from './components/ItemDetail';
import Hub from './components/Hub';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Home } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('hub');
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderContent = () => {
    if (activeTab === 'hub') {
      return <Hub onSelectTab={(tab) => setActiveTab(tab)} />;
    }

    if (selectedItemId) {
      return (
        <ItemDetail 
          itemId={selectedItemId} 
          onBack={() => setSelectedItemId(null)} 
          onGoToHub={() => {
            setSelectedItemId(null);
            setSelectedStoreId(null);
            setActiveTab('hub');
          }}
        />
      );
    }

    if (selectedStoreId && activeTab === 'stores') {
      return (
        <StoreInventory 
          storeId={selectedStoreId} 
          onBack={() => setSelectedStoreId(null)} 
          onSelectItem={(id) => setSelectedItemId(id)}
          onSelectStore={(id) => setSelectedStoreId(id)}
          onGoToHub={() => {
            setSelectedStoreId(null);
            setActiveTab('hub');
          }}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            setActiveTab={setActiveTab}
            onSelectStore={(id) => {
              setActiveTab('stores');
              setSelectedStoreId(id || null);
            }} 
            onSelectItem={(id) => setSelectedItemId(id)}
            onBack={() => setActiveTab('hub')}
          />
        );
      case 'stores':
        return <StoreList onSelectStore={(id) => setSelectedStoreId(id)} onBack={() => setActiveTab('hub')} />;
      case 'items':
        return <ItemCatalog onSelectItem={(id) => setSelectedItemId(id)} onBack={() => setActiveTab('hub')} />;
      case 'departments':
        return <DepartmentMaster onBack={() => setActiveTab('hub')} />;
      case 'programs':
        return <ProgramIssues onBack={() => setActiveTab('hub')} />;
      case 'transactions':
        return <Transactions onBack={() => setActiveTab('hub')} />;
      case 'purchases':
        return <Purchases onBack={() => setActiveTab('hub')} />;
      case 'settings':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <button 
              onClick={() => setActiveTab('hub')}
              className="mb-8 flex items-center gap-2 text-xs font-bold text-sage-400 hover:text-sage-900 transition-colors uppercase tracking-widest"
            >
              <Home size={14} /> Back to Hub
            </button>
            <div className="w-20 h-20 bg-sage-100 rounded-3xl flex items-center justify-center text-sage-400">
              <Leaf size={40} className="opacity-50" />
            </div>
            <h2 className="text-2xl font-bold text-sage-900">Settings</h2>
            <p className="text-sage-500 max-w-md">System configuration and user management options will appear here.</p>
          </div>
        );
      default:
        return <Hub onSelectTab={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-sage-50 flex">
      {activeTab !== 'hub' && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      )}
      <main className={`flex-1 transition-all duration-300 ${activeTab === 'hub' ? '' : `p-4 md:p-8 lg:p-12 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}`}>
        <div className={activeTab === 'hub' ? 'h-screen' : 'max-w-7xl mx-auto'}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (selectedStoreId || '') + (selectedItemId || '')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
