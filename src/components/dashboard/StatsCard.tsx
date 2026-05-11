import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  color?: 'blue' | 'emerald' | 'amber' | 'slate';
}

export const StatsCard = ({ title, value, icon: Icon, trend, color = 'blue' }: StatsCardProps) => {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    slate: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center border transition-colors",
            color === 'blue' ? "bg-blue-50 border-blue-100 text-blue-600" :
            color === 'emerald' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
            color === 'amber' ? "bg-amber-50 border-amber-100 text-amber-600" :
            "bg-slate-50 border-slate-100 text-slate-600"
        )}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            <span className={cn(
                "text-[11px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center",
                trend.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            )}>
                {trend.positive ? '+' : ''}{trend.value}
            </span>
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );
};
