import React, { useState } from 'react';
import { TRANSACTIONS, STORES, ITEMS } from '../constants';
import { Search, Filter, History, ArrowRight, ShoppingBag, Settings2, ShoppingCart, Warehouse, ArrowLeft, Package } from 'lucide-react';

export default function Transactions({ onBack }: { onBack: () => void }) {
  const [selectedStoreId, setSelectedStoreId] = useState<string | 'all'>('all');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transfer': return <ArrowRight size={16} />;
      case 'restock': return <ShoppingBag size={16} />;
      case 'adjustment': return <Settings2 size={16} />;
      case 'checkout': return <ShoppingCart size={16} />;
      case 'return': return <ArrowLeft size={16} />;
      default: return <History size={16} />;
    }
  };

  const getStoreName = (id?: string) => {
    if (!id) return '-';
    return STORES.find(s => s.id === id)?.name || id;
  };

  const filteredTransactions = selectedStoreId === 'all' 
    ? TRANSACTIONS 
    : TRANSACTIONS.filter(t => t.fromStoreId === selectedStoreId || t.toStoreId === selectedStoreId);

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
            <h2 className="text-3xl font-bold text-sage-900">Transactions</h2>
            <p className="text-sage-500">Full audit trail of all inventory movements and adjustments.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Store Filter Sidebar */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-sage-400 uppercase tracking-widest px-2">Filter by Store</h3>
          <div className="space-y-1">
            <button 
              onClick={() => setSelectedStoreId('all')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedStoreId === 'all' ? 'bg-sage-600 text-white shadow-md' : 'text-sage-500 hover:bg-sage-50'
              }`}
            >
              <History size={18} /> All Activity
            </button>
            {STORES.map(store => (
              <button 
                key={store.id}
                onClick={() => setSelectedStoreId(store.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedStoreId === store.id ? 'bg-sage-600 text-white shadow-md' : 'text-sage-500 hover:bg-sage-50'
                }`}
              >
                <Warehouse size={18} /> {store.name}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by user, item, or store..." 
                className="input-zen pl-12"
              />
            </div>
            <button className="btn-secondary">
              <Filter size={18} /> Filter
            </button>
          </div>

          <div className="card-zen overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sage-50/50 border-b border-sage-100">
                  <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Item</th>
                  <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Movement</th>
                  <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-50">
                {filteredTransactions.length > 0 ? filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-sage-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          t.type === 'transfer' ? 'bg-blue-50 text-blue-600' :
                          t.type === 'adjustment' ? 'bg-amber-50 text-amber-600' :
                          t.type === 'return' ? 'bg-purple-50 text-purple-600' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                          {getTypeIcon(t.type)}
                        </div>
                        <span className="text-sm font-bold text-sage-700 capitalize">{t.type === 'restock' ? 'Purchase' : t.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sage-50 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                          {ITEMS.find(i => i.id === t.itemId)?.imageUrl ? (
                            <img src={ITEMS.find(i => i.id === t.itemId)?.imageUrl} alt={t.itemName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <Package size={16} className="text-sage-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sage-900">{t.itemName}</p>
                          <p className="text-xs text-sage-400">{t.quantity > 0 ? '+' : ''}{t.quantity} units</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-sage-500">
                        <span className="font-medium">{getStoreName(t.fromStoreId)}</span>
                        {t.toStoreId && (
                          <>
                            <ArrowRight size={14} className="text-sage-300" />
                            <span className="font-medium">{getStoreName(t.toStoreId)}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-sage-700">{t.user}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-sage-400">{new Date(t.timestamp).toLocaleDateString()}</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sage-400 italic">
                      No transactions found for the selected store.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
