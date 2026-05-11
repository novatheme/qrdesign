import React from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

export const TransactionTable = ({ transactions }: { transactions: any[] }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase leading-none shadow-sm shadow-emerald-100/50 italic italic"><CheckCircle2 size={10} strokeWidth={3}/> Success</span>;
      case 'PENDING':
        return <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase leading-none shadow-sm shadow-amber-100/50 italic italic"><Clock size={10} strokeWidth={3}/> Pending</span>;
      default:
        return <span className="flex items-center gap-1.5 text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase leading-none shadow-sm shadow-red-100/50 italic italic"><AlertCircle size={10} strokeWidth={3}/> Failed</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
            <h3 className="font-extrabold text-slate-900 tracking-tight">Recent Transactions</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Live activity stream</p>
        </div>
        <button className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Reference ID</th>
              <th className="px-6 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Description</th>
              <th className="px-6 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Date & Time</th>
              <th className="px-6 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-6 py-4">
                    <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded text-slate-500">#{tx.id.split('-')[1]}</span>
                </td>
                <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-700 truncate max-w-[180px]">{tx.description || 'No description'}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs font-bold text-slate-500">{format(new Date(tx.createdAt), 'MMM dd, yyyy')}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{format(new Date(tx.createdAt), 'HH:mm:ss')}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="font-extrabold text-slate-900 tracking-tight">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tx.amount)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(tx.status)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50 opacity-0 group-hover:opacity-100">
                    <ExternalLink size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
