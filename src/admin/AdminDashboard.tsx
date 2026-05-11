import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
    LayoutDashboard, Users, CreditCard, Activity, 
    Settings, LogOut, Search, Bell, ChevronRight, 
    TrendingUp, ExternalLink, ShieldCheck, Database,
    Server, Globe, Terminal, Loader2
} from "lucide-react";
import { useAuthStore } from "../lib/store";
import api from "../lib/api";
import { StatsCard } from "../merchant/components/StatsCard";
import { format } from "date-fns";

export const AdminDashboard = () => {
    const { logout, user } = useAuthStore();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                if (res.data && res.data.data) {
                    setStats(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch admin stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-xs font-black uppercase tracking-widest">Waking up admin cluster...</p>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#0A0D10] text-slate-300 font-sans selection:bg-blue-500/30">
            {/* Dark Sidebar */}
            <aside className="w-64 border-r border-slate-800/50 flex flex-col bg-[#0D1117]">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black">
                            <ShieldCheck size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <span className="text-white font-black text-lg tracking-tight block leading-none">SYS_ADMIN</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">Root Protocol</span>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {[
                            { id: 'overview', label: 'Monitor', icon: Terminal },
                            { id: 'merchants', label: 'Merchants', icon: Users },
                            { id: 'network', label: 'Network', icon: Globe },
                            { id: 'logs', label: 'System Logs', icon: Database },
                            { id: 'settings', label: 'Config', icon: Settings },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${
                                    activeTab === item.id 
                                    ? "bg-white text-black" 
                                    : "text-slate-500 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <item.icon size={16} />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-800">
                    <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Server size={14} className="text-blue-500" />
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Cluster 01</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">System status optimal. All nodes operational.</p>
                    </div>
                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-xs uppercase tracking-widest text-slate-500"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Console */}
            <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900/50 via-[#0A0D10] to-[#0A0D10]">
                {/* HUD Header */}
                <header className="h-20 border-b border-slate-800/50 px-10 flex items-center justify-between backdrop-blur-xl sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500">
                            <span className="text-white">Admin</span>
                            <ChevronRight size={14} className="text-slate-700" />
                            <span>{activeTab}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Mainnet Live</span>
                        </div>
                        <div className="h-6 w-px bg-slate-800" />
                        <button className="text-slate-500 hover:text-white transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0A0D10]" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-xs font-black text-white leading-none uppercase tracking-tight">{user?.email?.split('@')[0]}</p>
                                <p className="text-[10px] font-bold text-blue-500 uppercase mt-1">Super User</p>
                            </div>
                            <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-slate-100 border border-slate-700">
                                <Users size={16} />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10 max-w-7xl mx-auto space-y-12 pb-32">
                    {activeTab === 'overview' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Global Consensus</h1>
                                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs underline decoration-blue-500 underline-offset-8">System Analytics Real-Time Pulse</p>
                                </div>
                                <div className="flex gap-4">
                                    <button className="h-12 px-8 bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all border border-slate-700">Health Check</button>
                                    <button className="h-12 px-8 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20">New Endpoint</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-[#111418] border border-slate-800 p-8 rounded-3xl group hover:border-blue-500/50 transition-all">
                                    <TrendingUp className="text-blue-500 mb-6" size={24} />
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Global Volume</p>
                                    <h2 className="text-3xl font-black text-white tracking-tight">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats?.globalVolume || 0)}</h2>
                                </div>
                                <div className="bg-[#111418] border border-slate-800 p-8 rounded-3xl group hover:border-emerald-500/50 transition-all">
                                    <Activity className="text-emerald-500 mb-6" size={24} />
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Network Capacity</p>
                                    <h2 className="text-3xl font-black text-white tracking-tight">{stats?.totalTransactions} Txns</h2>
                                </div>
                                <div className="bg-[#111418] border border-slate-800 p-8 rounded-3xl group hover:border-amber-500/50 transition-all">
                                    <Users className="text-amber-500 mb-6" size={24} />
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Managed Merchants</p>
                                    <h2 className="text-3xl font-black text-white tracking-tight">{stats?.merchantCount} Units</h2>
                                </div>
                                <div className="bg-[#111418] border border-slate-800 p-8 rounded-3xl group hover:border-slate-500/50 transition-all">
                                    <Server className="text-slate-500 mb-6" size={24} />
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Avg Ticket Size</p>
                                    <h2 className="text-3xl font-black text-white tracking-tight">{new Intl.NumberFormat('vi-VN').format(Math.floor(stats?.avgTransactionValue || 0))}</h2>
                                </div>
                            </div>

                            {/* Merchant Management Table */}
                            <div className="bg-[#111418] border border-slate-800 rounded-3xl overflow-hidden">
                                <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                                    <h3 className="font-black text-lg tracking-tight uppercase">Merchant Ledger</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                                            <input type="text" placeholder="Filter merchants..." className="h-9 w-64 pl-9 pr-4 bg-black border border-slate-800 rounded-lg text-xs outline-none focus:border-blue-500 transition-all" />
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-black/40">
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">ID</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Merchant Title</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Volume (VND)</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Status</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/50">
                                            {(stats?.merchants || []).map((m: any) => (
                                                <tr key={m.id} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <span className="font-mono text-[11px] text-slate-600">#{m.id.split('-')[0]}</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 font-black text-xs">
                                                                {m.businessName[0].toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-sm text-slate-300 group-hover:text-white transition-colors block">{m.businessName}</span>
                                                                <span className="text-[10px] text-slate-600 font-semibold">{m.email}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-white tracking-tight">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(m.volume)}</span>
                                                            <span className="text-[10px] text-slate-600 font-bold uppercase">{m.transactionCount} Trans</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                                            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Active</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button className="p-2 text-slate-600 hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100">
                                                            <ExternalLink size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
};
