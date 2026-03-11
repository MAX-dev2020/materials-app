import React, { useState } from 'react';
import { Plus, Search, Calendar, MoreVertical, Layout, ArrowLeft, Clock } from 'lucide-react';
import { PROGRAMS, DEPARTMENTS } from '../constants';
import Modal from './Modal';

export default function ProgramMaster({ onBack }: { onBack: () => void }) {
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
            <h2 className="text-3xl font-bold text-sage-900">Programs</h2>
            <p className="text-sage-500">Track Ashram programs and events that require inventory.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
        >
          <Plus size={20} /> Add Program
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
            <Calendar size={20} />
          </div>
          <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Upcoming</p>
          <h3 className="text-3xl font-bold">{PROGRAMS.length} Events</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-sage-100 shadow-sm">
          <div className="w-10 h-10 bg-sage-50 text-sage-600 rounded-xl flex items-center justify-center mb-4">
            <Clock size={20} />
          </div>
          <p className="text-sage-400 text-xs font-bold uppercase tracking-widest mb-1">Next 30 Days</p>
          <h3 className="text-3xl font-bold text-sage-900">4 Programs</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-sage-100 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <Layout size={20} />
          </div>
          <p className="text-sage-400 text-xs font-bold uppercase tracking-widest mb-1">Active Now</p>
          <h3 className="text-3xl font-bold text-sage-900">2 Running</h3>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-400" size={18} />
        <input 
          type="text" 
          placeholder="Search programs..." 
          className="input-zen pl-12"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROGRAMS.map((program) => {
          const dept = DEPARTMENTS.find(d => d.id === program.departmentId);
          return (
            <div key={program.id} className="card-zen p-6 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-sage-50 text-sage-600 rounded-2xl flex items-center justify-center group-hover:bg-sage-600 group-hover:text-white transition-all">
                  <Layout size={24} />
                </div>
                <button className="p-2 text-sage-300 hover:text-sage-600 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
              <h4 className="text-lg font-bold text-sage-900 mb-1">{program.name}</h4>
              <p className="text-sm text-sage-500 mb-4">{dept?.name || 'No Department'}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sage-400 text-xs font-medium uppercase tracking-wider">
                  <Calendar size={14} />
                  <span>Starts: {new Date(program.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sage-400 text-xs font-medium uppercase tracking-wider">
                  <Calendar size={14} className="opacity-50" />
                  <span>Ends: {new Date(program.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Program"
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
          <div>
            <label className="block text-sm font-semibold text-sage-700 mb-1">Program Name</label>
            <input type="text" className="input-zen" placeholder="e.g. Yoga Intensive" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-sage-700 mb-1">Owning Department</label>
            <select className="input-zen">
              {DEPARTMENTS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-sage-700 mb-1">Start Date</label>
              <input type="date" className="input-zen" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-sage-700 mb-1">End Date</label>
              <input type="date" className="input-zen" required />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Create Program</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
