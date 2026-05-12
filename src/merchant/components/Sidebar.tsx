import React from 'react';
import { LayoutDashboard, QrCode, History, Settings, Key, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'generator', icon: QrCode, label: 'QR Generator' },
    { id: 'transactions', icon: History, label: 'Transactions' },
    { id: 'api', icon: Key, label: 'API & Keys' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full z-40">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg">
          <QrCode size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black text-slate-900 leading-none">VietQR</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Merchant Hub</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-4">Main Menu</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id
                ? 'bg-black text-white shadow-xl shadow-black/10'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <item.icon
              size={18}
              strokeWidth={activeTab === item.id ? 2.5 : 2}
              className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}
            />
            <span className="text-sm font-bold tracking-tight">{item.label}</span>
            {activeTab === item.id && (
              <motion.div
                layoutId="sidebar-active"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified Account</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Your business is ready for production settlements.
          </p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
        >
          <LogOut size={18} />
          <span className="text-sm font-bold tracking-tight">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
