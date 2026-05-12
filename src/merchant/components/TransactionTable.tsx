import React from 'react';
import { format } from 'date-fns';
import { ChevronRight, CheckCircle2, Clock, XCircle, Search } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  description?: string;
  createdAt: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const getStatusDisplay = (status: Transaction['status']) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 italic">
            <CheckCircle2 size={12} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-widest">Settled</span>
          </div>
        );
      case 'PENDING':
        return (
          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 italic">
            <Clock size={12} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-widest">Processing</span>
          </div>
        );
      case 'FAILED':
        return (
          <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 italic">
            <XCircle size={12} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-widest">Rejected</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Ledger Stream</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 underline decoration-blue-500 decoration-2 underline-offset-4">Internal Audit History</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search history..." 
              className="h-10 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500 transition-all w-64"
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Reference ID</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Business Context</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantum</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
                      <History size={32} />
                    </div>
                    <p className="text-sm font-bold text-slate-400 italic">No historical data available in this epoch.</p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                      #{tx.id.split('-')[0].toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-700 tracking-tight">{tx.description || 'General Remittance'}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-slate-900 tracking-tighter">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tx.amount)}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-600">{format(new Date(tx.createdAt), 'MMM dd, yyyy')}</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-0.5">{format(new Date(tx.createdAt), 'HH:mm:ss')}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {getStatusDisplay(tx.status)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <ChevronRight size={16} strokeWidth={3} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import { History } from 'lucide-react';
