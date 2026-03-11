import React, { useState } from 'react';
import { Plus, Search, Filter, Package, ArrowUpRight, ArrowLeft, Layers } from 'lucide-react';
import { ITEMS } from '../constants';
import Modal from './Modal';

export default function ItemCatalog({ onSelectItem, onBack }: { onSelectItem: (id: string) => void, onBack: () => void }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
            <h2 className="text-3xl font-bold text-sage-900">Items Catalog</h2>
            <p className="text-sage-500">Master list of all materials and goods tracked in the Ashram.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
        >
          <Plus size={20} /> Add Item
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-600 p-6 rounded-[2rem] text-white shadow-xl shadow-emerald-100">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
            <Package size={20} />
          </div>
          <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">Total Catalog</p>
          <h3 className="text-3xl font-bold">{ITEMS.length} Items</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-sage-100 shadow-sm">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <Layers size={20} />
          </div>
          <p className="text-sage-400 text-xs font-bold uppercase tracking-widest mb-1">Categories</p>
          <h3 className="text-3xl font-bold text-sage-900">8 Types</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-sage-100 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Filter size={20} />
          </div>
          <p className="text-sage-400 text-xs font-bold uppercase tracking-widest mb-1">Low Stock</p>
          <h3 className="text-3xl font-bold text-sage-900">12 Alerts</h3>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-400" size={18} />
          <input 
            type="text" 
            placeholder="Search items by name, category..." 
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
              <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Item</th>
              <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Total Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest">Min Threshold</th>
              <th className="px-6 py-4 text-xs font-bold text-sage-400 uppercase tracking-widest"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-50">
            {ITEMS.map((item) => (
              <tr 
                key={item.id} 
                className="hover:bg-sage-50/30 transition-colors group cursor-pointer"
                onClick={() => onSelectItem(item.id)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-sage-50 rounded-xl overflow-hidden flex items-center justify-center group-hover:bg-sage-100 transition-colors shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Package size={20} className="text-sage-400" />
                      )}
                    </div>
                    <span className="font-bold text-sage-900">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-sage-500">{item.category}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono font-bold text-sage-700">{item.totalStock}</span>
                  <span className="text-xs text-sage-400 ml-1">{item.unit}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sage-500">{item.minThreshold}</span>
                  <span className="text-xs text-sage-400 ml-1">{item.unit}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    className="text-sage-300 hover:text-sage-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectItem(item.id);
                    }}
                  >
                    <ArrowUpRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Master Item">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
          <div>
            <label className="block text-sm font-semibold text-sage-700 mb-1">Item Name</label>
            <input type="text" className="input-zen" placeholder="e.g. Jasmine Oil" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-sage-700 mb-1">Category</label>
              <select className="input-zen">
                <option>Food</option>
                <option>Linens</option>
                <option>Puja</option>
                <option>Furniture</option>
                <option>Office</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-sage-700 mb-1">Unit</label>
              <input type="text" className="input-zen" placeholder="kg, pcs, liters..." required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-sage-700 mb-1">Minimum Threshold</label>
            <input type="number" className="input-zen" placeholder="Alert when stock falls below..." required />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Add to Catalog</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
