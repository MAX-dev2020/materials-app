import React from 'react';
import { 
  LayoutDashboard, 
  Warehouse, 
  Package, 
  Building2, 
  Calendar, 
  ClipboardList, 
  History, 
  Settings,
  ArrowRight,
  Leaf
} from 'lucide-react';
import { motion } from 'motion/react';
import { STORES, ITEMS, TRANSACTIONS } from '../constants';

interface HubProps {
  onSelectTab: (tab: string) => void;
}

export default function Hub({ onSelectTab }: HubProps) {
  const totalItems = ITEMS.length;
  const activeStores = STORES.length;
  const pendingOrders = TRANSACTIONS.filter(t => t.type === 'restock').length;

  const cards = [
    { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard, description: 'Overview of all Ashram inventory operations', color: 'bg-sage-600' },
    { id: 'stores', label: 'Inventory Stores', icon: Warehouse, description: 'Manage stock across different storage locations', color: 'bg-blue-600' },
    { id: 'items', label: 'Items Catalog', icon: Package, description: 'Master list of all items and specifications', color: 'bg-emerald-600' },
    { id: 'programs', label: 'Material Issues', icon: History, description: 'Track distribution and collection of materials', color: 'bg-indigo-600' },
    { id: 'departments', label: 'Departments', icon: Building2, description: 'Department-wise inventory tracking', color: 'bg-amber-600' },
    { id: 'purchases', label: 'Purchases', icon: ClipboardList, description: 'Track incoming stock and purchase orders', color: 'bg-violet-600' },
    { id: 'transactions', label: 'Transactions', icon: History, description: 'Complete history of all stock movements', color: 'bg-rose-600' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'System configuration and user roles', color: 'bg-slate-600' },
  ];

  return (
    <div className="min-h-screen bg-sage-50 p-8 md:p-12 lg:p-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-sage-900 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-sage-200">
              <Leaf size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-sage-900 tracking-tight">Ashram Inventory</h1>
              <p className="text-sage-500 font-medium uppercase tracking-widest text-sm mt-1">Command Center</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 bg-white p-2 rounded-2xl border border-sage-100 shadow-sm">
            <div className="w-10 h-10 bg-sage-100 rounded-xl flex items-center justify-center text-sage-600 font-bold">SA</div>
            <div className="pr-4">
              <p className="text-sm font-bold text-sage-900">Swami Anand</p>
              <p className="text-[10px] text-sage-400 uppercase tracking-widest">Administrator</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => onSelectTab(card.id)}
                className="group relative bg-white p-8 rounded-[2.5rem] border border-sage-100 hover:border-sage-300 transition-all text-left shadow-sm hover:shadow-2xl hover:shadow-sage-200/50 flex flex-col h-full"
              >
                <div className={`w-14 h-14 ${card.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-sage-900 mb-2 group-hover:text-sage-600 transition-colors">{card.label}</h3>
                <p className="text-sage-500 text-sm leading-relaxed mb-8 flex-1">{card.description}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-sage-400 group-hover:text-sage-900 transition-colors uppercase tracking-widest">
                  Open Module <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            );
          })}
        </div>

        <footer className="pt-12 border-t border-sage-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-sage-400 uppercase tracking-widest mb-1">Total Items</span>
              <span className="text-xl font-bold text-sage-900">{totalItems}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-sage-400 uppercase tracking-widest mb-1">Active Stores</span>
              <span className="text-xl font-bold text-sage-900">{activeStores}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-sage-400 uppercase tracking-widest mb-1">Recent Transactions</span>
              <span className="text-xl font-bold text-sage-900">{TRANSACTIONS.length}</span>
            </div>
          </div>
          <p className="text-xs text-sage-400 font-medium">© 2026 Ashram Inventory Management System</p>
        </footer>
      </div>
    </div>
  );
}
