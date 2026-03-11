import React, { useState } from 'react';
import { Plus, Search, Building2, User, MoreVertical, ArrowLeft, Users } from 'lucide-react';
import { DEPARTMENTS } from '../constants';
import Modal from './Modal';

export default function DepartmentMaster({ onBack }: { onBack: () => void }) {
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
            <h2 className="text-3xl font-bold text-sage-900">Departments</h2>
            <p className="text-sage-500">Manage Ashram departments and their respective heads.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
        >
          <Plus size={20} /> Add Department
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-amber-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-amber-100 flex items-center justify-between">
          <div>
            <p className="text-amber-100 text-xs font-bold uppercase tracking-widest mb-1">Active Depts</p>
            <h3 className="text-4xl font-bold">{DEPARTMENTS.length}</h3>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Building2 size={32} />
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-sage-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sage-400 text-xs font-bold uppercase tracking-widest mb-1">Total Staff</p>
            <h3 className="text-4xl font-bold text-sage-900">42</h3>
          </div>
          <div className="w-16 h-16 bg-sage-50 text-sage-600 rounded-2xl flex items-center justify-center">
            <Users size={32} />
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-400" size={18} />
        <input 
          type="text" 
          placeholder="Search departments..." 
          className="input-zen pl-12"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEPARTMENTS.map((dept) => (
          <div key={dept.id} className="card-zen p-6 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-sage-50 text-sage-600 rounded-2xl flex items-center justify-center group-hover:bg-sage-600 group-hover:text-white transition-all">
                <Building2 size={24} />
              </div>
              <button className="p-2 text-sage-300 hover:text-sage-600 transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
            <h4 className="text-lg font-bold text-sage-900 mb-1">{dept.name}</h4>
            <div className="flex items-center gap-2 text-sage-500 text-sm">
              <User size={14} />
              <span>Head: {dept.head}</span>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Department"
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
          <div>
            <label className="block text-sm font-semibold text-sage-700 mb-1">Department Name</label>
            <input type="text" className="input-zen" placeholder="e.g. Housekeeping" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-sage-700 mb-1">Department Head</label>
            <input type="text" className="input-zen" placeholder="Name of the person in charge" required />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Create Department</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
