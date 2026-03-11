import React from 'react';
import { Search, Filter, Plus, ShoppingBag, ArrowLeft, TrendingUp, Package } from 'lucide-react';
import { TRANSACTIONS, STORES, ITEMS } from '../constants';

export default function Purchases({ onBack }: { onBack: () => void }) {
  const purchaseTransactions = TRANSACTIONS.filter(t => t.type === 'restock');

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
            <h2 className="text-3xl font-bold text-sage-900">Purchases & Restocks</h2>
            <p className="text-sage-500">Global log of all items purchased and added to inventory.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-violet-600 p-6 rounded-[2rem] text-white shadow-xl shadow-violet-100">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
            <ShoppingBag size={20} />
          </div>
          <p className="text-violet-100 text-xs font-bold uppercase tracking-widest mb-1">Total Spent</p>
          <h3 className="text-3xl font-bold">₹ 42,500</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-sage-100 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp size={20} />
          </div>
          <p className="text-sage-400 text-xs font-bold uppercase tracking-widest mb-1">Restocks</p>
          <h3 className="text-3xl font-bold text-sage-900">24 Orders</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-sage-100 shadow-sm">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <Plus size={20} />
          </div>
          <p className="text-sage-400 text-xs font-bold uppercase tracking-widest mb-1">Pending</p>
          <h3 className="text-3xl font-bold text-sage-900">3 Items</h3>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by item, reference, or user..." 
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
              <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Item Name</th>
              <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest text-center">Count</th>
              <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Purchase Date</th>
              <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Purchase Code</th>
              <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Remarks</th>
              <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest text-center">Store</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-50">
            {purchaseTransactions.length > 0 ? purchaseTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-sage-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sage-50 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                      {ITEMS.find(i => i.id === t.itemId)?.imageUrl ? (
                        <img src={ITEMS.find(i => i.id === t.itemId)?.imageUrl} alt={t.itemName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Package size={16} className="text-sage-400" />
                      )}
                    </div>
                    <span className="font-bold text-sage-900">{t.itemName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-mono font-bold text-emerald-600">
                  +{t.quantity}
                </td>
                <td className="px-6 py-4 text-xs text-sage-400">
                  {new Date(t.timestamp).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-mono text-sage-700">
                  {t.purchaseCode || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-sage-500 italic">
                  {t.note || '-'}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600 bg-sage-50 px-2 py-1 rounded-full">
                    {STORES.find(s => s.id === t.toStoreId)?.name || t.toStoreId}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sage-400 italic">
                  No purchase records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
