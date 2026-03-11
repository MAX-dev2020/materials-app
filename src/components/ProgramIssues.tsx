import React, { useState } from 'react';
import { Search, Filter, ArrowLeft, Download, Plus, History, CheckCircle2, AlertCircle, Ban, Package } from 'lucide-react';
import { PROGRAM_ISSUES, PROGRAMS, DEPARTMENTS, ITEMS } from '../constants';

export default function ProgramIssues({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredIssues = PROGRAM_ISSUES.filter(issue => {
    const matchesSearch = issue.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         issue.collectedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.pocName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case '✅ All Returned': return 'text-emerald-600 bg-emerald-50';
      case '🟠 DUE FOR RETURN ⏰': return 'text-amber-600 bg-amber-50';
      case '🚫 Non-Returnable': return 'text-sage-400 bg-sage-50';
      case '⚠️ Partially Returned': return 'text-orange-600 bg-orange-50';
      default: return 'text-sage-400 bg-sage-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '✅ All Returned': return <CheckCircle2 size={14} />;
      case '🟠 DUE FOR RETURN ⏰': return <AlertCircle size={14} />;
      case '🚫 Non-Returnable': return <Ban size={14} />;
      case '⚠️ Partially Returned': return <History size={14} />;
      default: return null;
    }
  };

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
            <h2 className="text-3xl font-bold text-sage-900">Material Issues</h2>
            <p className="text-sage-500">Track distribution and collection of materials for programs.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Download size={20} /> Export Excel
          </button>
          <button className="btn-primary">
            <Plus size={20} /> New Issue
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by material, collector, or POC..." 
            className="input-zen pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-sage-100 shadow-sm">
          <button 
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${statusFilter === 'all' ? 'bg-sage-900 text-white' : 'text-sage-500 hover:bg-sage-50'}`}
          >
            All
          </button>
          <button 
            onClick={() => setStatusFilter('🟠 DUE FOR RETURN ⏰')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${statusFilter === '🟠 DUE FOR RETURN ⏰' ? 'bg-amber-100 text-amber-700' : 'text-sage-500 hover:bg-sage-50'}`}
          >
            Due
          </button>
          <button 
            onClick={() => setStatusFilter('✅ All Returned')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${statusFilter === '✅ All Returned' ? 'bg-emerald-100 text-emerald-700' : 'text-sage-500 hover:bg-sage-50'}`}
          >
            Returned
          </button>
        </div>
      </div>

      {/* Issues Table */}
      <div className="card-zen overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sage-50/50 border-b border-sage-100">
                <th className="px-6 py-4 text-[10px] font-bold text-sage-400 uppercase tracking-widest">Sl No</th>
                <th className="px-6 py-4 text-[10px] font-bold text-sage-400 uppercase tracking-widest">Date / Due</th>
                <th className="px-6 py-4 text-[10px] font-bold text-sage-400 uppercase tracking-widest">Program / Dept</th>
                <th className="px-6 py-4 text-[10px] font-bold text-sage-400 uppercase tracking-widest">Material</th>
                <th className="px-6 py-4 text-[10px] font-bold text-sage-400 uppercase tracking-widest text-center">Issued</th>
                <th className="px-6 py-4 text-[10px] font-bold text-sage-400 uppercase tracking-widest text-center">Returned</th>
                <th className="px-6 py-4 text-[10px] font-bold text-sage-400 uppercase tracking-widest text-center">Pending</th>
                <th className="px-6 py-4 text-[10px] font-bold text-sage-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-sage-400 uppercase tracking-widest">Collected By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-50">
              {filteredIssues.map((issue, idx) => {
                const program = PROGRAMS.find(p => p.id === issue.programId);
                const dept = DEPARTMENTS.find(d => d.id === issue.departmentId);
                return (
                  <tr key={issue.id} className="hover:bg-sage-50/30 transition-colors group">
                    <td className="px-6 py-4 text-xs font-mono text-sage-400">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-sage-900">{issue.date}</p>
                      {issue.expectedReturnDate && (
                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-0.5">
                          Due: {issue.expectedReturnDate}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-sage-900">{program?.name || issue.programId}</p>
                      <p className="text-[10px] text-sage-400 uppercase tracking-widest">{dept?.name || 'General'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sage-50 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                          {ITEMS.find(i => i.id === issue.itemId)?.imageUrl ? (
                            <img src={ITEMS.find(i => i.id === issue.itemId)?.imageUrl} alt={issue.itemName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <Package size={16} className="text-sage-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-sage-900">{issue.itemName}</p>
                          <p className="text-[10px] text-sage-400 uppercase tracking-widest">{issue.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-sage-900">
                      {issue.issued}
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-emerald-600">
                      {issue.returned}
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-amber-600">
                      {issue.pending}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(issue.status)}`}>
                        {getStatusIcon(issue.status)}
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-sage-900">{issue.collectedBy || 'N/A'}</p>
                      {issue.phone && <p className="text-[10px] text-sage-400">{issue.phone}</p>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
