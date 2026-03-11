import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Warehouse, 
  Package, 
  History, 
  Settings, 
  Menu, 
  X,
  Leaf,
  Building2,
  Calendar,
  ClipboardList,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'hub', label: 'Hub Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stores', label: 'Stores', icon: Warehouse },
    { id: 'items', label: 'Items Catalog', icon: Package },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'programs', label: 'Material Issues', icon: History },
    { id: 'purchases', label: 'Purchases', icon: ClipboardList },
    { id: 'transactions', label: 'Transactions', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md text-sage-600"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 ${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-sage-100 transform transition-all duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full relative">
          {/* Collapse Toggle (Desktop) */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-10 w-6 h-6 bg-white border border-sage-100 rounded-full items-center justify-center text-sage-400 hover:text-sage-600 shadow-sm z-50 transition-transform"
            style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <X size={12} className="rotate-45" />
          </button>

          <div className={`p-6 flex items-center gap-3 transition-all ${isCollapsed ? 'px-4' : ''}`}>
            <div className="w-10 h-10 bg-sage-100 rounded-xl flex-shrink-0 flex items-center justify-center text-sage-600">
              <Leaf size={24} />
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="font-bold text-sage-900 leading-tight">Ashram</h1>
                <p className="text-xs text-sage-500 font-medium uppercase tracking-wider">Inventory</p>
              </motion.div>
            )}
          </div>

          <nav className={`flex-1 space-y-1 transition-all ${isCollapsed ? 'px-2' : 'px-4'}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  title={isCollapsed ? item.label : ''}
                  className={`
                    w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all
                    ${isCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'}
                    ${isActive 
                      ? 'bg-sage-50 text-sage-700 shadow-sm' 
                      : 'text-sage-500 hover:bg-sage-50/50 hover:text-sage-600'}
                  `}
                >
                  <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-sage-600' : ''}`} />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className={`p-4 border-t border-sage-50 transition-all ${isCollapsed ? 'px-2' : ''}`}>
            <div className={`bg-sage-50 rounded-2xl transition-all ${isCollapsed ? 'p-2 flex justify-center' : 'p-4'}`}>
              {isCollapsed ? (
                <div className="w-8 h-8 bg-sage-200 rounded-full flex items-center justify-center text-[10px] font-bold text-sage-600">
                  SA
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-xs font-semibold text-sage-400 uppercase tracking-wider mb-1">Current User</p>
                  <p className="text-sm font-medium text-sage-700">Swami Anand</p>
                  <p className="text-xs text-sage-500">Admin Role</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-sage-900/20 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
