import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Warehouse, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { STORES } from '../constants';
import Modal from './Modal';

export default function StoreList({ onSelectStore, onBack }: { onSelectStore: (id: string) => void, onBack: () => void }) {
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
            <h2 className="text-3xl font-bold text-sage-900">Stores</h2>
            <p className="text-sage-500">Manage inventory locations and storage units.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
        >
          <Plus size={20} /> Add Store
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-400" size={18} />
          <input 
            type="text" 
            placeholder="Search stores..." 
            className="input-zen pl-12"
          />
        </div>
        <button className="btn-secondary">
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STORES.map((store) => (
          <div 
            key={store.id} 
            onClick={() => onSelectStore(store.id)}
            className="card-zen p-6 group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-sage-50 text-sage-600 rounded-2xl flex items-center justify-center group-hover:bg-sage-600 group-hover:text-white transition-all duration-300">
                <Warehouse size={24} />
              </div>
              <button className="p-2 text-sage-300 hover:text-sage-600 transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
            <h4 className="text-lg font-bold text-sage-900 mb-1">{store.name}</h4>
            <p className="text-sm text-sage-500 mb-6 capitalize">{store.type}</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-sage-400">Status</span>
                <span className={`font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full ${
                  store.status === 'healthy' ? 'bg-emerald-100 text-emerald-700' : 
                  store.status === 'low' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>
                  {store.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-sage-400">Items</span>
                <span className="font-bold text-sage-700">{store.itemCount}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-sage-50 flex items-center justify-between">
              <span className="text-xs font-bold text-sage-400 uppercase tracking-widest">Store Dashboard</span>
              <div className="w-8 h-8 bg-sage-50 text-sage-400 rounded-lg flex items-center justify-center group-hover:bg-sage-600 group-hover:text-white transition-all">
                <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Store"
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
          <div>
            <label className="block text-sm font-semibold text-sage-700 mb-1">Store Name</label>
            <input type="text" className="input-zen" placeholder="e.g. Storage B" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-sage-700 mb-1">Store Type</label>
            <select className="input-zen">
              <option>Storage</option>
              <option>Residential</option>
              <option>Kitchen</option>
              <option>Office</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-sage-700 mb-1">Description</label>
            <textarea className="input-zen min-h-[100px]" placeholder="Optional details..."></textarea>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Create Store</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
