import React from 'react';
import { LayoutDashboard, QrCode, History, Settings, Key, LogOut, Bell } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar = ({ activeTab, setActiveTab, onLogout }: SidebarProps) => {
  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'generator', icon: QrCode, label: 'QR Generator' },
    { id: 'transactions', icon: History, label: 'Transactions' },
    { id: 'api', icon: Key, label: 'API & Keys' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 h-full bg-white text-slate-600 flex flex-col border-r border-slate-200">
      <div className="p-6 flex items-center gap-2.5">
        <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white shadow-xl shadow-black/10">
          <QrCode size={20} strokeWidth={2.5} />
        </div>
        <div>
          <span className="text-slate-900 font-extrabold text-lg tracking-tight block leading-none">VietQR</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Merchant Hub</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        <div className="px-4 mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Menu</span>
        </div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-semibold text-sm",
              activeTab === item.id 
                ? "bg-slate-100 text-slate-900 shadow-sm" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 mb-4">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Production Ready</p>
            <p className="text-xs text-blue-900 font-medium leading-relaxed">Your account is fully verified for real transactions.</p>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all font-semibold text-sm text-slate-400"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};
