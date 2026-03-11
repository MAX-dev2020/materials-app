import React from 'react';
import { 
  Package, 
  Warehouse, 
  AlertTriangle, 
  ArrowUpRight,
  TrendingUp,
  CircleDot,
  ArrowLeft,
  Calendar,
  History
} from 'lucide-react';
import { STORES, ITEMS, TRANSACTIONS, PROGRAM_ISSUES, PROGRAMS } from '../constants';

export default function Dashboard({ 
  onSelectStore, 
  setActiveTab,
  onSelectItem,
  onBack
}: { 
  onSelectStore: (id: string) => void,
  setActiveTab: (tab: string) => void,
  onSelectItem: (id: string) => void,
  onBack: () => void
}) {
  const pendingReturns = PROGRAM_ISSUES.filter(pi => pi.pending > 0);
  
  const stats = [
    { label: 'Total Items', value: ITEMS.length, icon: Package, color: 'text-sage-600', bg: 'bg-sage-100', tab: 'items' },
    { label: 'Low Stock', value: ITEMS.filter(i => i.totalStock <= i.minThreshold).length, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100', tab: 'items' },
    { label: 'Pending Returns', value: pendingReturns.length, icon: History, color: 'text-blue-600', bg: 'bg-blue-100', tab: 'programs' },
    { label: 'Active Programs', value: PROGRAMS.length, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-100', tab: 'programs' },
  ];

  const recentTransactions = [...TRANSACTIONS].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="w-12 h-12 bg-white border border-sage-100 rounded-2xl flex items-center justify-center text-sage-400 hover:text-sage-900 hover:border-sage-300 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-sage-900">Peaceful Morning, Swami</h2>
            <p className="text-sage-500">Here's what's happening in the Ashram inventory today.</p>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="card-zen p-6 flex items-start justify-between transition-all cursor-pointer hover:border-sage-300 hover:shadow-md"
            onClick={() => {
              if (stat.tab === 'stores') onSelectStore('');
              else setActiveTab(stat.tab);
            }}
          >
            <div>
              <p className="text-sm font-medium text-sage-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-sage-900">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Pending Returns & Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Pending Returns Table */}
          <section className="card-zen overflow-hidden">
            <div className="p-6 border-b border-sage-50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-sage-900">Material Due for Return</h3>
              <button 
                onClick={() => setActiveTab('programs')}
                className="text-sm font-semibold text-sage-600 hover:text-sage-700"
              >
                View All Issues
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sage-50/50 border-b border-sage-100">
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Material</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Program</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Pending</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Due Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-50">
                  {pendingReturns.length > 0 ? pendingReturns.slice(0, 5).map((pi) => {
                    const program = PROGRAMS.find(p => p.id === pi.programId);
                    return (
                      <tr key={pi.id} className="hover:bg-sage-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-sage-50 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                              {ITEMS.find(i => i.id === pi.itemId)?.imageUrl ? (
                                <img src={ITEMS.find(i => i.id === pi.itemId)?.imageUrl} alt={pi.itemName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <Package size={16} className="text-sage-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-sage-900">{pi.itemName}</p>
                              <p className="text-[10px] text-sage-400 uppercase tracking-widest">{pi.unit}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-sage-700">
                          {program?.name || pi.programId}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-sage-900">
                          {pi.pending}
                        </td>
                        <td className="px-6 py-4 text-xs text-sage-400">
                          {pi.expectedReturnDate || pi.date}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                            {pi.status}
                          </span>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sage-400 italic">
                        No pending returns at the moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="card-zen p-6">
            <h3 className="text-xl font-bold text-sage-900 mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {recentTransactions.length > 0 ? recentTransactions.map((t) => (
                <div key={t.id} className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    t.type === 'restock' ? 'bg-emerald-50 text-emerald-500' : 
                    t.type === 'transfer' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'
                  }`}>
                    {t.quantity > 0 ? <TrendingUp size={18} /> : <CircleDot size={18} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-sage-900">
                      <span className="font-bold">{t.user}</span> {t.type === 'transfer' ? 'transferred' : t.type === 'restock' ? 'restocked' : 'adjusted'}{' '}
                      <button 
                        onClick={() => onSelectItem(t.itemId)}
                        className="font-bold text-sage-900 hover:text-sage-600 underline decoration-sage-200 underline-offset-2"
                      >
                        {Math.abs(t.quantity)} {t.itemName}
                      </button>
                      {t.fromStoreId && ` from ${STORES.find(r => r.id === t.fromStoreId)?.name || t.fromStoreId}`}
                      {t.toStoreId && ` to ${STORES.find(r => r.id === t.toStoreId)?.name || t.toStoreId}`}
                    </p>
                    <p className="text-xs text-sage-400 mt-1">
                      {new Date(t.timestamp).toLocaleDateString()} • {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-center text-sage-400 italic py-4">No recent activity recorded.</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Store Status & Quick Actions */}
        <div className="space-y-8">
          <section className="card-zen p-6">
            <h3 className="text-lg font-bold text-sage-900 mb-4">Store Overview</h3>
            <div className="space-y-4">
              {STORES.map((store) => (
                <div 
                  key={store.id} 
                  className="flex items-center justify-between p-3 hover:bg-sage-50 rounded-xl transition-colors cursor-pointer"
                  onClick={() => onSelectStore(store.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white border border-sage-100 rounded-lg flex items-center justify-center text-sage-400">
                      <Warehouse size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-sage-900">{store.name}</p>
                      <p className="text-[10px] text-sage-400 uppercase tracking-widest">{store.type}</p>
                    </div>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${
                    store.status === 'healthy' ? 'bg-emerald-400' : 
                    store.status === 'low' ? 'bg-amber-400' : 'bg-red-400'
                  }`} />
                </div>
              ))}
            </div>
            <button 
              onClick={() => onSelectStore('')}
              className="w-full mt-6 py-3 text-sm font-bold text-sage-600 border border-sage-100 rounded-xl hover:bg-sage-50 transition-colors"
            >
              Manage All Stores
            </button>
          </section>

          <section className="card-zen p-6 bg-sage-900 text-white">
            <h3 className="text-lg font-bold mb-2">Quick Actions</h3>
            <p className="text-sage-400 text-sm mb-6">Common operations for daily inventory management.</p>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => setActiveTab('items')}
                className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm font-medium"
              >
                <Package size={18} /> Add New Item
              </button>
              <button 
                onClick={() => setActiveTab('purchases')}
                className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm font-medium"
              >
                <TrendingUp size={18} /> Record Purchase
              </button>
              <button 
                onClick={() => setActiveTab('programs')}
                className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm font-medium"
              >
                <History size={18} /> Issue Material
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
