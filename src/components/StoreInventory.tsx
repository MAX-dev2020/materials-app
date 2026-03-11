import React, { useState, useMemo } from 'react';
import { ArrowUpRight, ArrowLeft, Search, ArrowRightLeft, Settings2, MoreHorizontal, Info, Package, History, List, ClipboardCheck, Plus, Trash2, User, CheckCircle2, AlertTriangle, X, LayoutDashboard, ShoppingBag, TrendingUp, Activity, Home } from 'lucide-react';
import { STORES, STORE_INVENTORY, ITEMS, DEPARTMENTS, TRANSACTIONS, PROGRAMS } from '../constants';
import Modal from './Modal';
import { motion, AnimatePresence } from 'motion/react';

interface BulkIssueItem {
  itemId: string;
  quantity: number;
}

export default function StoreInventory({ storeId, onBack, onSelectItem, onSelectStore, onGoToHub }: { storeId: string, onBack: () => void, onSelectItem: (id: string) => void, onSelectStore: (id: string) => void, onGoToHub: () => void }) {
  const store = STORES.find(r => r.id === storeId);
  const inventory = STORE_INVENTORY.filter(i => i.storeId === storeId);
  const storeTransactions = TRANSACTIONS.filter(t => t.fromStoreId === storeId || t.toStoreId === storeId);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'program-issues' | 'transfers' | 'purchases' | 'audit'>('overview');
  const [isStoreSwitcherOpen, setIsStoreSwitcherOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<{ programId: string, timestamp: string } | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isBulkIssueModalOpen, setIsBulkIssueModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isQuickEntryMode, setIsQuickEntryMode] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [quickQuantities, setQuickQuantities] = useState<Record<string, number>>({});
  const [quickActionType, setQuickActionType] = useState<'issue' | 'transfer' | 'adjust' | null>(null);

  // Bulk Issue State
  const [issueProgramId, setIssueProgramId] = useState('');
  const [issuePOC, setIssuePOC] = useState({ name: '', contact: '' });
  const [issueItems, setIssueItems] = useState<BulkIssueItem[]>([{ itemId: '', quantity: 0 }]);
  const [itemSearch, setItemSearch] = useState('');

  const filteredItemsForSearch = useMemo(() => {
    if (!itemSearch) return [];
    return ITEMS.filter(item => 
      item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(itemSearch.toLowerCase())
    ).slice(0, 5);
  }, [itemSearch]);

  if (!store) return null;

  const addIssueItem = () => {
    setIssueItems([...issueItems, { itemId: '', quantity: 0 }]);
  };

  const removeIssueItem = (index: number) => {
    setIssueItems(issueItems.filter((_, i) => i !== index));
  };

  const updateIssueItem = (index: number, field: keyof BulkIssueItem, value: any) => {
    const newItems = [...issueItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setIssueItems(newItems);
  };

  const resetBulkIssue = () => {
    setIsBulkIssueModalOpen(false);
    setIssueProgramId('');
    setIssuePOC({ name: '', contact: '' });
    setIssueItems([{ itemId: '', quantity: 0 }]);
  };

  const handleQuickQuantityChange = (itemId: string, value: string) => {
    const qty = parseInt(value) || 0;
    setQuickQuantities(prev => ({ ...prev, [itemId]: qty }));
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItemIds(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    if (selectedItemIds.length === inventory.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(inventory.map(i => i.itemId));
    }
  };

  const hasQuickEntries = (Object.values(quickQuantities) as number[]).some(q => q > 0);

  const clearQuickEntries = () => {
    setQuickQuantities({});
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Store Sidebar */}
      <aside className="w-72 border-r border-sage-100 flex flex-col bg-white shrink-0">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-sage-50">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-xs font-bold text-sage-400 hover:text-sage-600 transition-colors uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <div className="h-3 w-px bg-sage-100" />
            <button 
              onClick={onGoToHub}
              className="flex items-center gap-2 text-xs font-bold text-sage-400 hover:text-sage-900 transition-colors uppercase tracking-widest"
            >
              <Home size={14} /> Hub
            </button>
          </div>

          <div className="relative">
            <div 
              className="flex items-center justify-between p-3 bg-sage-50 rounded-2xl cursor-pointer group hover:bg-sage-100 transition-all border border-transparent hover:border-sage-200"
              onClick={() => setIsStoreSwitcherOpen(!isStoreSwitcherOpen)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 bg-sage-900 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <LayoutDashboard size={20} />
                </div>
                <div className="overflow-hidden">
                  <h2 className="font-bold text-sage-900 truncate">{store.name}</h2>
                  <p className="text-[10px] text-sage-400 uppercase tracking-widest truncate">{store.type}</p>
                </div>
              </div>
              <MoreHorizontal size={18} className="text-sage-300 group-hover:text-sage-600 transition-colors shrink-0" />
            </div>
            
            <AnimatePresence>
              {isStoreSwitcherOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsStoreSwitcherOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-sage-100 z-50 overflow-hidden"
                  >
                    <div className="p-3 bg-sage-50 border-b border-sage-100">
                      <p className="text-[10px] font-bold text-sage-400 uppercase tracking-widest">Switch Store</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto py-2">
                      {STORES.map(r => (
                        <button
                          key={r.id}
                          onClick={() => {
                            onSelectStore(r.id);
                            setIsStoreSwitcherOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-sage-50 transition-colors ${r.id === storeId ? 'bg-sage-50' : ''}`}
                        >
                          <div className="overflow-hidden">
                            <p className={`text-sm font-bold truncate ${r.id === storeId ? 'text-sage-900' : 'text-sage-600'}`}>{r.name}</p>
                            <p className="text-[10px] text-sage-400 capitalize">{r.type}</p>
                          </div>
                          {r.id === storeId && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-1">
            <p className="px-4 text-[10px] font-bold text-sage-400 uppercase tracking-widest mb-2">Main</p>
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all relative group ${
                activeTab === 'overview' 
                ? 'bg-sage-900 text-white shadow-lg shadow-sage-200' 
                : 'text-sage-500 hover:bg-sage-50 hover:text-sage-900'
              }`}
            >
              <LayoutDashboard size={18} /> Overview
              {activeTab === 'overview' && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all relative group ${
                activeTab === 'inventory' 
                ? 'bg-sage-900 text-white shadow-lg shadow-sage-200' 
                : 'text-sage-500 hover:bg-sage-50 hover:text-sage-900'
              }`}
            >
              <List size={18} /> Inventory
              {activeTab === 'inventory' && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                />
              )}
            </button>
          </div>

          <div className="space-y-1">
            <p className="px-4 text-[10px] font-bold text-sage-400 uppercase tracking-widest mb-2">Operations</p>
            <button 
              onClick={() => setActiveTab('program-issues')}
              className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all relative group ${
                activeTab === 'program-issues' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                : 'text-sage-500 hover:bg-sage-50 hover:text-sage-900'
              }`}
            >
              <ClipboardCheck size={18} /> Program Issues
              {activeTab === 'program-issues' && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('transfers')}
              className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all relative group ${
                activeTab === 'transfers' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                : 'text-sage-500 hover:bg-sage-50 hover:text-sage-900'
              }`}
            >
              <ArrowRightLeft size={18} /> Transfers
              {activeTab === 'transfers' && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('purchases')}
              className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all relative group ${
                activeTab === 'purchases' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'text-sage-500 hover:bg-sage-50 hover:text-sage-900'
              }`}
            >
              <Plus size={18} /> Purchases
              {activeTab === 'purchases' && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                />
              )}
            </button>
          </div>

          <div className="space-y-1">
            <p className="px-4 text-[10px] font-bold text-sage-400 uppercase tracking-widest mb-2">History</p>
            <button 
              onClick={() => setActiveTab('audit')}
              className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all relative group ${
                activeTab === 'audit' 
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-100' 
                : 'text-sage-500 hover:bg-sage-50 hover:text-sage-900'
              }`}
            >
              <History size={18} /> Audit Trail
              {activeTab === 'audit' && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                />
              )}
            </button>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-sage-50 bg-sage-50/30">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
              store.status === 'healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {store.status} Status
            </span>
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full border-2 border-white bg-sage-200 flex items-center justify-center text-[8px] font-bold">JD</div>
              <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-200 flex items-center justify-center text-[8px] font-bold">AS</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-sage-400">Items Tracked</span>
              <span className="font-bold text-sage-900">{store.itemCount}</span>
            </div>
            <div className="w-full h-1.5 bg-sage-100 rounded-full overflow-hidden">
              <div className="h-full bg-sage-900 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Stage */}
      <main className="flex-1 flex flex-col min-w-0 bg-sage-50/30">
        {/* Stage Header */}
        <header className="h-20 border-b border-sage-100 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold text-sage-900 capitalize">{activeTab.replace('-', ' ')}</h1>
            <p className="text-xs text-sage-400">Managing {store.name} Workspace</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsQuickEntryMode(!isQuickEntryMode)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${
                isQuickEntryMode 
                ? 'bg-sage-900 text-white border-sage-900' 
                : 'bg-white text-sage-600 border-sage-100 hover:border-sage-300'
              }`}
            >
              <Settings2 size={16} /> {isQuickEntryMode ? 'Exit Quick Entry' : 'Quick Entry Mode'}
            </button>
            {!isQuickEntryMode && (
              <>
                <button 
                  onClick={() => setIsTransferModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-sage-600 border border-sage-100 hover:border-sage-300 flex items-center gap-2 transition-all"
                >
                  <ArrowRightLeft size={16} /> Transfer
                </button>
                <button 
                  onClick={() => setIsBulkIssueModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 transition-all shadow-lg shadow-blue-100"
                >
                  <ClipboardCheck size={16} /> Bulk Issue
                </button>
              </>
            )}
          </div>
        </header>

        {/* Stage Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className={`grid grid-cols-1 ${activeTab === 'overview' || !selectedItem ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-8`}>
            {/* Main Content Area */}
            <div className={`${activeTab === 'overview' || !selectedItem ? 'lg:col-span-1' : 'lg:col-span-2'} space-y-4`}>
              {activeTab !== 'overview' && (
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-400" size={18} />
                  <input 
                    type="text" 
                    placeholder={activeTab === 'inventory' ? "Search items in this store..." : "Search transactions..."}
                    className="w-full bg-white border border-sage-100 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sage-900/5 focus:border-sage-900 transition-all shadow-sm"
                  />
                </div>
              )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'overview' ? (
            <div className="space-y-8">
              {/* Store Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-zen p-6 bg-white border-sage-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-sage-50 text-sage-600 rounded-2xl flex items-center justify-center">
                      <Package size={24} />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Active</span>
                  </div>
                  <p className="text-sm font-bold text-sage-400 uppercase tracking-widest mb-1">Total Items</p>
                  <h3 className="text-3xl font-bold text-sage-900">{inventory.length}</h3>
                  <p className="text-xs text-sage-500 mt-2">Unique items in stock</p>
                </div>

                <div className="card-zen p-6 bg-white border-sage-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                      <AlertTriangle size={24} />
                    </div>
                    {inventory.filter(inv => inv.quantity <= (ITEMS.find(i => i.id === inv.itemId)?.minThreshold || 0)).length > 0 && (
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg animate-pulse">Attention</span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-sage-400 uppercase tracking-widest mb-1">Low Stock</p>
                  <h3 className="text-3xl font-bold text-sage-900">
                    {inventory.filter(inv => inv.quantity <= (ITEMS.find(i => i.id === inv.itemId)?.minThreshold || 0)).length}
                  </h3>
                  <p className="text-xs text-sage-500 mt-2">Items below threshold</p>
                </div>

                <div className="card-zen p-6 bg-white border-sage-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                      <TrendingUp size={24} />
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Monthly</span>
                  </div>
                  <p className="text-sm font-bold text-sage-400 uppercase tracking-widest mb-1">Total Issues</p>
                  <h3 className="text-3xl font-bold text-sage-900">
                    {storeTransactions.filter(t => t.type === 'checkout' || (t.type === 'transfer' && t.toStoreId?.startsWith('p'))).length}
                  </h3>
                  <p className="text-xs text-sage-500 mt-2">Distributions to programs</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions Card */}
                <div className="card-zen p-8 bg-sage-900 text-white border-none shadow-xl">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-sage-400" /> Quick Management
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => { setActiveTab('inventory'); setIsQuickEntryMode(true); }}
                      className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl text-left transition-all group"
                    >
                      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <ClipboardCheck size={20} />
                      </div>
                      <p className="font-bold text-sm">Issue Items</p>
                      <p className="text-[10px] text-sage-400 mt-1">Distribute to programs</p>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('inventory'); setIsQuickEntryMode(true); }}
                      className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl text-left transition-all group"
                    >
                      <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <ArrowRightLeft size={20} />
                      </div>
                      <p className="font-bold text-sm">Transfer Stock</p>
                      <p className="text-[10px] text-sage-400 mt-1">Move to another store</p>
                    </button>
                    <button 
                      onClick={() => setIsAdjustModalOpen(true)}
                      className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl text-left transition-all group"
                    >
                      <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Settings2 size={20} />
                      </div>
                      <p className="font-bold text-sm">Audit Adjust</p>
                      <p className="text-[10px] text-sage-400 mt-1">Correct stock levels</p>
                    </button>
                    <button 
                      onClick={() => setIsBulkIssueModalOpen(true)}
                      className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl text-left transition-all group"
                    >
                      <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <ShoppingBag size={20} />
                      </div>
                      <p className="font-bold text-sm">New Purchase</p>
                      <p className="text-[10px] text-sage-400 mt-1">Add incoming stock</p>
                    </button>
                  </div>
                </div>

                {/* Recent Activity Mini Feed */}
                <div className="card-zen p-6 bg-white border-sage-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-sage-900">Recent Activity</h3>
                    <button 
                      onClick={() => setActiveTab('audit')}
                      className="text-xs font-bold text-sage-400 hover:text-sage-600 uppercase tracking-widest"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {storeTransactions.slice(0, 5).map((t) => (
                      <div key={t.id} className="flex items-start gap-4 p-3 hover:bg-sage-50 rounded-xl transition-colors cursor-pointer group">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          t.type === 'transfer' ? 'bg-blue-50 text-blue-600' :
                          t.type === 'restock' ? 'bg-indigo-50 text-indigo-600' :
                          t.type === 'adjustment' ? 'bg-amber-50 text-amber-600' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                          {t.type === 'transfer' ? <ArrowRightLeft size={18} /> :
                           t.type === 'restock' ? <ShoppingBag size={18} /> :
                           t.type === 'adjustment' ? <Settings2 size={18} /> :
                           <ClipboardCheck size={18} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-bold text-sage-900 truncate group-hover:text-sage-600 transition-colors">
                              {t.itemName}
                            </p>
                            <span className="text-[10px] text-sage-400 whitespace-nowrap ml-2">
                              {new Date(t.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-sage-500 mt-0.5">
                            {t.type === 'restock' ? 'Purchased' : t.type === 'checkout' ? 'Issued' : t.type.charAt(0).toUpperCase() + t.type.slice(1)} 
                            {' '}{Math.abs(t.quantity)} units
                          </p>
                        </div>
                      </div>
                    ))}
                    {storeTransactions.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-sm text-sage-400 italic">No recent activity</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Low Stock Warning Section */}
              {inventory.filter(inv => inv.quantity <= (ITEMS.find(i => i.id === inv.itemId)?.minThreshold || 0)).length > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-900">Low Stock Alerts</h3>
                      <p className="text-xs text-amber-700">The following items are below their minimum threshold.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inventory
                      .filter(inv => inv.quantity <= (ITEMS.find(i => i.id === inv.itemId)?.minThreshold || 0))
                      .slice(0, 6)
                      .map(inv => {
                        const item = ITEMS.find(i => i.id === inv.itemId);
                        return (
                          <div key={inv.itemId} className="bg-white p-4 rounded-xl border border-amber-100 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-sage-900">{item?.name}</p>
                              <p className="text-xs text-sage-400">Current: {inv.quantity} / Min: {item?.minThreshold}</p>
                            </div>
                            <button 
                              onClick={() => onSelectItem(inv.itemId)}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            >
                              <ArrowUpRight size={16} />
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'inventory' ? (
            <div className="card-zen overflow-hidden relative">
              {isQuickEntryMode && (
                <div className="bg-sage-900 text-white p-4 flex items-center justify-between sticky top-0 z-20">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold">Quick Entry Mode Active</span>
                    <div className="h-4 w-px bg-white/20" />
                    <p className="text-xs text-sage-300">Enter quantities directly in the table to perform bulk actions.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={clearQuickEntries}
                      className="px-3 py-2 text-sage-400 hover:text-white text-xs font-bold transition-colors"
                    >
                      Clear All
                    </button>
                    <button 
                      disabled={!hasQuickEntries}
                      onClick={() => setQuickActionType('issue')}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
                    >
                      <ClipboardCheck size={14} /> Bulk Issue ({(Object.values(quickQuantities) as number[]).filter(q => q > 0).length})
                    </button>
                    <button 
                      disabled={!hasQuickEntries}
                      onClick={() => setQuickActionType('transfer')}
                      className="px-4 py-2 bg-sage-700 hover:bg-sage-800 disabled:opacity-50 rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
                    >
                      <ArrowRightLeft size={14} /> Bulk Transfer
                    </button>
                    <button 
                      disabled={!hasQuickEntries}
                      onClick={() => setQuickActionType('adjust')}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
                    >
                      <Settings2 size={14} /> Bulk Adjust
                    </button>
                  </div>
                </div>
              )}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sage-50/50 border-b border-sage-100">
                    <th className="px-6 py-4 w-10">
                      <input 
                        type="checkbox" 
                        className="rounded border-sage-300 text-sage-600 focus:ring-sage-500"
                        checked={selectedItemIds.length === inventory.length && inventory.length > 0}
                        onChange={selectAllItems}
                      />
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Item Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Dept</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Current Stock</th>
                    {isQuickEntryMode && (
                      <th className="px-6 py-4 text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50/50">Qty to Action</th>
                    )}
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-50">
                  {inventory.map((inv) => {
                    const item = ITEMS.find(i => i.id === inv.itemId);
                    if (!item) return null;
                    const dept = DEPARTMENTS.find(d => d.id === item.departmentId);
                    const isLow = inv.quantity <= item.minThreshold;
                    const isSelected = selectedItemIds.includes(inv.itemId);
                    
                    return (
                      <tr 
                        key={inv.itemId} 
                        className={`hover:bg-sage-50/30 transition-colors cursor-pointer ${isSelected || selectedItem?.id === item.id ? 'bg-sage-50' : ''}`}
                        onClick={() => !isQuickEntryMode && onSelectItem(item.id)}
                      >
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            className="rounded border-sage-300 text-sage-600 focus:ring-sage-500"
                            checked={isSelected}
                            onChange={() => toggleItemSelection(inv.itemId)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-sage-50 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <Package size={16} className="text-sage-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-sage-900">{item.name}</p>
                              <p className="text-xs text-sage-400">{item.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-sage-500">{dept?.name || '-'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-sage-700">{inv.quantity}</span>
                          <span className="text-xs text-sage-400 ml-1">{item.unit}</span>
                        </td>
                        {isQuickEntryMode && (
                          <td className="px-6 py-4 bg-blue-50/30" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="number"
                              className="w-24 px-3 py-1.5 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-bold text-sage-900"
                              placeholder="0"
                              value={quickQuantities[inv.itemId] || ''}
                              onChange={(e) => handleQuickQuantityChange(inv.itemId, e.target.value)}
                            />
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isLow ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {isLow ? 'Low' : 'Healthy'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-sage-300 hover:text-sage-600">
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'program-issues' ? (
            <div className="space-y-4">
              {selectedBatch ? (
                <div className="space-y-4">
                  <button 
                    onClick={() => setSelectedBatch(null)}
                    className="flex items-center gap-2 text-sm font-bold text-sage-400 hover:text-sage-600 transition-colors"
                  >
                    <ArrowLeft size={16} /> Back to All Program Issues
                  </button>
                  
                  <div className="card-zen p-6 bg-blue-50/30 border-blue-100">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-sage-900">
                          {PROGRAMS.find(p => p.id === selectedBatch.programId)?.name || 'Program Issue'}
                        </h3>
                        <p className="text-sm text-sage-500">
                          Issued on {new Date(selectedBatch.timestamp).toLocaleDateString()} at {new Date(selectedBatch.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-sage-400 uppercase tracking-widest mb-1">Issued By</p>
                        <p className="text-sm font-bold text-sage-700">{storeTransactions.find(t => t.timestamp === selectedBatch.timestamp)?.user}</p>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-blue-100 bg-white">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-blue-50/50 border-b border-blue-100">
                            <th className="px-6 py-3 text-xs font-bold text-blue-400 uppercase tracking-widest">Item</th>
                            <th className="px-6 py-3 text-xs font-bold text-blue-400 uppercase tracking-widest text-center">Quantity</th>
                            <th className="px-6 py-3 text-xs font-bold text-blue-400 uppercase tracking-widest">Unit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                          {storeTransactions
                            .filter(t => {
                              const tDate = new Date(t.timestamp).toLocaleDateString();
                              const sDate = new Date(selectedBatch.timestamp).toLocaleDateString();
                              return t.toStoreId === selectedBatch.programId && tDate === sDate && t.user === storeTransactions.find(st => st.timestamp === selectedBatch.timestamp)?.user;
                            })
                            .map((t) => (
                              <tr key={t.id} className="hover:bg-blue-50/20 transition-colors">
                                <td className="px-6 py-4">
                                  <button 
                                    onClick={() => onSelectItem(t.itemId)}
                                    className="font-bold text-sage-900 hover:text-blue-600 text-left"
                                  >
                                    {t.itemName}
                                  </button>
                                </td>
                                <td className="px-6 py-4 text-center font-mono font-bold text-blue-700">
                                  {t.quantity}
                                </td>
                                <td className="px-6 py-4 text-sm text-sage-500">
                                  {ITEMS.find(i => i.id === t.itemId)?.unit || 'Nos'}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-zen overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-sage-50/50 border-b border-sage-100">
                        <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Program</th>
                        <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest text-center">Items</th>
                        <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Date</th>
                        <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">User</th>
                        <th className="px-6 py-4 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sage-50">
                      {(() => {
                        const issues = storeTransactions.filter(t => t.type === 'checkout' || (t.type === 'transfer' && t.toStoreId?.startsWith('p')));
                        const grouped: Record<string, any> = {};
                        issues.forEach(t => {
                          const date = new Date(t.timestamp).toLocaleDateString();
                          const key = `${t.toStoreId}-${date}-${t.user}`;
                          if (!grouped[key]) {
                            grouped[key] = {
                              programId: t.toStoreId,
                              timestamp: t.timestamp, // Keep the first timestamp for sorting
                              date: date,
                              user: t.user,
                              count: 0
                            };
                          }
                          grouped[key].count++;
                        });
                        const sortedGroups = Object.values(grouped).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                        
                        return sortedGroups.length > 0 ? sortedGroups.map((group: any) => (
                          <tr 
                            key={`${group.programId}-${group.timestamp}`} 
                            className="hover:bg-sage-50/30 transition-colors cursor-pointer"
                            onClick={() => setSelectedBatch({ programId: group.programId, timestamp: group.timestamp })}
                          >
                            <td className="px-6 py-4">
                              <span className="font-bold text-blue-600">
                                {PROGRAMS.find(p => p.id === group.programId)?.name || 'Program Issue'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
                                {group.count} items
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-sage-400">
                              {group.date}
                            </td>
                            <td className="px-6 py-4 text-sm text-sage-500">
                              {group.user}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <ArrowUpRight size={18} className="text-sage-300 ml-auto" />
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-sage-400 italic">
                              No program issues recorded for this store.
                            </td>
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activeTab === 'transfers' ? (
            <div className="card-zen overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sage-50/50 border-b border-sage-100">
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Direction</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Item</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Quantity</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Store</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-50">
                  {storeTransactions.filter(t => t.type === 'transfer' && !t.toStoreId?.startsWith('p')).length > 0 ? 
                    storeTransactions.filter(t => t.type === 'transfer' && !t.toStoreId?.startsWith('p')).map((t) => {
                    const isIncoming = t.toStoreId === storeId;
                    return (
                      <tr key={t.id} className="hover:bg-sage-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isIncoming ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {isIncoming ? 'Incoming' : 'Outgoing'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-sage-900">{t.itemName}</p>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-sage-700">
                          {isIncoming ? `+${t.quantity}` : `-${t.quantity}`}
                        </td>
                        <td className="px-6 py-4 text-sm text-sage-500">
                          {isIncoming ? STORES.find(r => r.id === t.fromStoreId)?.name : STORES.find(r => r.id === t.toStoreId)?.name}
                        </td>
                        <td className="px-6 py-4 text-xs text-sage-400">
                          {new Date(t.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sage-400 italic">
                        No internal transfers recorded for this store.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'purchases' ? (
            <div className="card-zen overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sage-50/50 border-b border-sage-100">
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Item</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Quantity</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Note / Ref</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-50">
                  {storeTransactions.filter(t => t.type === 'restock').length > 0 ? 
                    storeTransactions.filter(t => t.type === 'restock').map((t) => (
                    <tr key={t.id} className="hover:bg-sage-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-sage-900">{t.itemName}</p>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-emerald-600">
                        +{t.quantity}
                      </td>
                      <td className="px-6 py-4 text-xs text-sage-400">
                        {new Date(t.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-sage-500 italic">
                        {t.note || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-sage-500">
                        {t.user}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sage-400 italic">
                        No purchase records for this store.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card-zen overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sage-50/50 border-b border-sage-100">
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Item</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Change</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-50">
                  {storeTransactions.filter(t => t.type === 'adjustment').length > 0 ? 
                    storeTransactions.filter(t => t.type === 'adjustment').map((t) => (
                    <tr key={t.id} className="hover:bg-sage-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700`}>
                          Adjustment
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-sage-900">{t.itemName}</p>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-sage-700">
                        {t.quantity > 0 ? `+${t.quantity}` : t.quantity}
                      </td>
                      <td className="px-6 py-4 text-xs text-sage-400">
                        {new Date(t.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-sage-500 italic">
                        {t.note || '-'}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sage-400 italic">
                        No audit logs recorded for this store.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          </motion.div>
          </AnimatePresence>
        </div>

        {/* Side Panel */}
        {activeTab !== 'overview' && selectedItem && (
          <div className="space-y-6">
            <div className="card-zen p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-sage-900">Item Details</h3>
                <button onClick={() => setSelectedItem(null)} className="text-sage-300 hover:text-sage-600">
                  <ArrowLeft size={18} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="aspect-square bg-sage-50 rounded-2xl flex items-center justify-center text-sage-200">
                  <Package size={64} />
                </div>
                
                <div>
                  <p className="text-xs font-bold text-sage-400 uppercase tracking-widest mb-1">Item Name</p>
                  <p className="text-lg font-bold text-sage-900">{selectedItem.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-sage-400 uppercase tracking-widest mb-1">Category</p>
                    <p className="text-sm font-medium text-sage-700">{selectedItem.category}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-sage-400 uppercase tracking-widest mb-1">Unit</p>
                    <p className="text-sm font-medium text-sage-700">{selectedItem.unit}</p>
                  </div>
                </div>

                <div className="p-4 bg-sage-50 rounded-2xl">
                  <div className="flex items-center gap-2 text-sage-600 mb-2">
                    <Info size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Stock Alert Info</span>
                  </div>
                  <p className="text-sm text-sage-600">Minimum threshold for this item is <span className="font-bold">{selectedItem.minThreshold} {selectedItem.unit}</span>. Current store stock is {inventory.find(i => i.itemId === selectedItem.id)?.quantity} {selectedItem.unit}.</p>
                </div>

                <button 
                  onClick={() => onSelectItem(selectedItem.id)}
                  className="w-full btn-secondary justify-center gap-2"
                >
                  <ArrowUpRight size={18} /> View Full Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Confirmation Modals */}
      <Modal 
        isOpen={!!quickActionType} 
        onClose={() => setQuickActionType(null)}
        title={
          quickActionType === 'issue' ? 'Confirm Bulk Issue' : 
          quickActionType === 'transfer' ? 'Confirm Bulk Transfer' : 'Confirm Bulk Adjustment'
        }
      >
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-sm text-blue-700">
              You are about to {quickActionType} <strong>{(Object.values(quickQuantities) as number[]).filter(q => q > 0).length} items</strong> from {store.name}.
            </p>
          </div>

          {quickActionType === 'issue' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-sage-700 mb-1">Program</label>
                <select 
                  className="input-zen"
                  value={issueProgramId}
                  onChange={(e) => setIssueProgramId(e.target.value)}
                >
                  <option value="">Select program...</option>
                  {PROGRAMS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({new Date(p.startDate).toLocaleDateString()} - {new Date(p.endDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-sage-700 mb-1">POC Name</label>
                <input 
                  type="text" 
                  className="input-zen" 
                  placeholder="Name"
                  value={issuePOC.name}
                  onChange={(e) => setIssuePOC({ ...issuePOC, name: e.target.value })}
                />
              </div>
            </div>
          )}

          {quickActionType === 'transfer' && (
            <div>
              <label className="block text-sm font-semibold text-sage-700 mb-1">Destination Store</label>
              <select className="input-zen">
                <option value="">Select destination...</option>
                {STORES.filter(r => r.id !== storeId).map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          )}

          {quickActionType === 'adjust' && (
            <div>
              <label className="block text-sm font-semibold text-sage-700 mb-1">Adjustment Reason</label>
              <textarea className="input-zen min-h-[80px]" placeholder="e.g. Audit correction"></textarea>
            </div>
          )}

          <div className="max-h-48 overflow-y-auto border border-sage-100 rounded-xl divide-y divide-sage-50">
            {(Object.entries(quickQuantities) as [string, number][]).filter(([_, q]) => q > 0).map(([itemId, qty]) => {
              const item = ITEMS.find(i => i.id === itemId);
              return (
                <div key={itemId} className="p-3 flex justify-between items-center text-sm">
                  <span className="font-medium text-sage-700">{item?.name}</span>
                  <span className="font-mono font-bold text-sage-900">{qty} {item?.unit}</span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={() => setQuickActionType(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button 
              onClick={() => {
                setQuickActionType(null);
                setQuickQuantities({});
                setIsQuickEntryMode(false);
              }}
              className="btn-primary flex-1 justify-center"
            >
              Confirm & Process
            </button>
          </div>
        </div>
      </Modal>

      {/* Bulk Issue Modal */}
      <Modal 
        isOpen={isBulkIssueModalOpen} 
        onClose={resetBulkIssue} 
        title={`Bulk Issue from ${store.name}`}
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-sage-700 mb-1">Program</label>
              <select 
                className="input-zen"
                value={issueProgramId}
                onChange={(e) => setIssueProgramId(e.target.value)}
              >
                <option value="">Select program...</option>
                {PROGRAMS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({new Date(p.startDate).toLocaleDateString()} - {new Date(p.endDate).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-sage-700 mb-1">POC Name</label>
                <input 
                  type="text" 
                  className="input-zen" 
                  placeholder="Name"
                  value={issuePOC.name}
                  onChange={(e) => setIssuePOC({ ...issuePOC, name: e.target.value })}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-sage-700 mb-1">POC Contact</label>
                <input 
                  type="text" 
                  className="input-zen" 
                  placeholder="Contact"
                  value={issuePOC.contact}
                  onChange={(e) => setIssuePOC({ ...issuePOC, contact: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sage-900">Items to Issue</h4>
              <button 
                onClick={addIssueItem}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus size={14} /> Add Another Item
              </button>
            </div>

            {issueItems.map((issueItem, index) => {
              const currentItem = ITEMS.find(i => i.id === issueItem.itemId);
              const storeStock = inventory.find(ri => ri.itemId === issueItem.itemId)?.quantity || 0;
              
              return (
                <div key={index} className="p-4 bg-sage-50 rounded-2xl border border-sage-100 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-1">
                      <label className="block text-[10px] font-bold text-sage-400 uppercase tracking-widest">Item</label>
                      <div className="relative">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" size={14} />
                            <input 
                              type="text"
                              placeholder="Search item..."
                              className="input-zen pl-9 text-sm py-2"
                              onChange={(e) => setItemSearch(e.target.value)}
                            />
                            {itemSearch && (
                              <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-sage-100 rounded-xl shadow-lg overflow-hidden">
                                {filteredItemsForSearch.map(item => (
                                  <button
                                    key={item.id}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-sage-50 transition-colors flex justify-between items-center"
                                    onClick={() => {
                                      updateIssueItem(index, 'itemId', item.id);
                                      setItemSearch('');
                                    }}
                                  >
                                    <span>{item.name}</span>
                                    <span className="text-[10px] font-bold text-sage-400">{inventory.find(ri => ri.itemId === item.id)?.quantity || 0} in stock</span>
                                  </button>
                                ))}
                                {filteredItemsForSearch.length === 0 && (
                                  <div className="px-4 py-2 text-xs text-sage-400 italic">No items found</div>
                                )}
                              </div>
                            )}
                          </div>
                          {issueItem.itemId && (
                            <div className="flex-1 bg-white border border-sage-100 rounded-xl px-4 py-2 text-sm font-bold text-sage-900 flex items-center justify-between">
                              {currentItem?.name}
                              <button onClick={() => updateIssueItem(index, 'itemId', '')} className="text-sage-300 hover:text-sage-600">
                                <X size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-32 space-y-1">
                      <label className="block text-[10px] font-bold text-sage-400 uppercase tracking-widest">Quantity</label>
                      <input 
                        type="number" 
                        className="input-zen py-2" 
                        placeholder="0"
                        value={issueItem.quantity || ''}
                        onChange={(e) => updateIssueItem(index, 'quantity', Number(e.target.value))}
                      />
                    </div>
                    {issueItems.length > 1 && (
                      <button 
                        onClick={() => removeIssueItem(index)}
                        className="mt-6 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  
                  {issueItem.itemId && (
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          {storeStock >= issueItem.quantity ? (
                            <span className="text-emerald-600 flex items-center gap-1 font-medium">
                              <CheckCircle2 size={12} /> Stock Available
                            </span>
                          ) : (
                            <span className="text-amber-600 flex items-center gap-1 font-medium">
                              <AlertTriangle size={12} /> Shortfall: {issueItem.quantity - storeStock} {currentItem?.unit}
                            </span>
                          )}
                        </div>
                        <span className="text-sage-400">Current Store Stock: {storeStock} {currentItem?.unit}</span>
                      </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-sage-100 flex gap-3">
            <button onClick={resetBulkIssue} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button 
              disabled={!issueProgramId || issueItems.some(i => !i.itemId || !i.quantity)}
              onClick={resetBulkIssue}
              className="btn-primary flex-1 justify-center disabled:opacity-50"
            >
              Confirm Bulk Issue
            </button>
          </div>
        </div>
      </Modal>

      {/* Modals */}
      <Modal isOpen={isAdjustModalOpen} onClose={() => setIsAdjustModalOpen(false)} title="Stock Adjustment">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAdjustModalOpen(false); }}>
          <div>
            <label className="block text-sm font-semibold text-sage-700 mb-1">Select Item</label>
            <select className="input-zen">
              {inventory.map(inv => {
                const item = ITEMS.find(i => i.id === inv.itemId);
                return <option key={inv.itemId}>{item?.name}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-sage-700 mb-1">Adjustment Type</label>
            <div className="flex gap-2">
              <button type="button" className="flex-1 py-2 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-emerald-700 font-bold text-sm">Add Stock</button>
              <button type="button" className="flex-1 py-2 rounded-xl border-2 border-transparent bg-sage-50 text-sage-500 font-bold text-sm">Remove Stock</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-sage-700 mb-1">Quantity</label>
            <input type="number" className="input-zen" placeholder="0" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-sage-700 mb-1">Reason / Note</label>
            <textarea className="input-zen min-h-[80px]" placeholder="e.g. Monthly restock"></textarea>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsAdjustModalOpen(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Update Stock</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} title="Stock Transfer">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsTransferModalOpen(false); }}>
          <div>
            <label className="block text-sm font-semibold text-sage-700 mb-1">Item to Transfer</label>
            <select className="input-zen">
              {inventory.map(inv => {
                const item = ITEMS.find(i => i.id === inv.itemId);
                return <option key={inv.itemId}>{item?.name}</option>;
              })}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-sage-700 mb-1">From</label>
              <input type="text" className="input-zen bg-sage-50" value={store.name} disabled />
            </div>
            <div>
              <label className="block text-sm font-semibold text-sage-700 mb-1">To Store</label>
              <select className="input-zen">
                {STORES.filter(r => r.id !== storeId).map(r => (
                  <option key={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-sage-700 mb-1">Quantity</label>
            <input type="number" className="input-zen" placeholder="0" required />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsTransferModalOpen(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Complete Transfer</button>
          </div>
        </form>
      </Modal>
        </div>
      </main>
    </div>
  );
}
