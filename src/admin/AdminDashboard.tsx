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
    const [seeding, setSeeding] = useState(false);

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

    useEffect(() => {
        fetchStats();
    }, []);

    const handleSeedData = async () => {
        if (!confirm("Seed database with sample data?")) return;
        setSeeding(true);
        try {
            await api.post('/admin/seed');
            await fetchStats();
        } catch (error) {
            console.error("Seeding failed", error);
        } finally {
            setSeeding(false);
        }
    };

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
                                    <button 
                                        onClick={handleSeedData}
                                        disabled={seeding}
                                        className="h-12 px-8 bg-amber-600/20 text-amber-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-600/30 transition-all border border-amber-500/20 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <Database size={14} className={seeding ? "animate-bounce" : ""} />
                                        {seeding ? "Injecting..." : "Seed Data"}
                                    </button>
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

                            {/* Activity Feed */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-[#111418] border border-slate-800 rounded-3xl overflow-hidden">
                                     <div className="p-8 border-b border-slate-800 flex items-center justify-between">
                                        <h3 className="font-black text-sm tracking-widest uppercase">Network Throughput</h3>
                                        <span className="text-[10px] font-bold text-slate-500">REALTIME_STREAM</span>
                                    </div>
                                    <div className="p-8 space-y-4">
                                        {(stats?.recentActivity || []).map((act: any) => (
                                            <div key={act.id} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-slate-800/50 group hover:border-blue-500/30 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                                                        <Activity size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-white uppercase tracking-tight">{act.merchantName}</p>
                                                        <p className="text-[10px] font-bold text-slate-600 mt-0.5">{format(new Date(act.createdAt), 'HH:mm:ss')} • {act.id.split('-')[0]}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-emerald-500">+{new Intl.NumberFormat('vi-VN').format(act.amount)}</p>
                                                    <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest mt-0.5">{act.status}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden group">
                                     <div className="relative z-10">
                                        <Globe className="mb-6 opacity-40 group-hover:rotate-12 transition-transform duration-700" size={32} />
                                        <h3 className="text-2xl font-black tracking-tighter mb-4 italic leading-tight">Global Settlement Ready.</h3>
                                        <p className="text-blue-100 font-bold text-xs leading-relaxed mb-10">All regional clusters are synced across the VietQR network. Consensus achieved in 120ms.</p>
                                        <button className="w-full h-12 bg-white text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">Verify Protocol</button>
                                     </div>
                                     <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-[80px] -translate-y-1/2 translate-x-1/2" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'merchants' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                             <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Merchant Fleet</h1>
                                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs underline decoration-blue-500 underline-offset-8">Unit Audit & Control</p>
                                </div>
                                <div className="flex items-center gap-3 bg-[#111418] border border-slate-800 p-2 rounded-2xl">
                                    <Search className="text-slate-600 ml-2" size={16} />
                                    <input type="text" placeholder="Search merchant database..." className="bg-transparent border-none outline-none text-xs text-white min-w-[250px]" />
                                </div>
                            </div>

                            <div className="bg-[#111418] border border-slate-800 rounded-[40px] overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5">
                                            <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Business Detail</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Vol</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Endpoints</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Integrity</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Control</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/40">
                                        {(stats?.merchants || []).map((m: any) => (
                                            <tr key={m.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all font-black text-lg">
                                                            {m.businessName[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-white tracking-tight text-lg">{m.businessName}</p>
                                                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">{m.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <p className="font-black text-white text-lg tracking-tighter">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(m.volume)}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-600 uppercase mt-1">{m.transactionCount} Successful Calls</p>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs font-bold text-slate-400">{m.bankAccounts} Bank Accounts</span>
                                                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Joined {format(new Date(m.joinedAt), 'MMM dd, yyyy')}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-2">
                                                        <ShieldCheck className="text-emerald-500" size={14} />
                                                        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">Verified</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <button className="h-10 px-6 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all border border-slate-700 hover:border-blue-500">Review</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'logs' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">System Kernel Logs</h1>
                             <div className="bg-[#0D1117] border border-slate-800 rounded-3xl p-10 font-mono text-xs space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                                <p className="text-emerald-500">[SYSTEM] Root consensus achieved. Epoch: 45091</p>
                                <p className="text-slate-600">[NETWORK] TCP handshake successful with napas-prod-v2</p>
                                <p className="text-slate-600">[AUTH] RSA-2048 identity verification for admin_01</p>
                                <p className="text-blue-400">[DATABASE] Cluster rebalance completed in 45ms</p>
                                <p className="text-slate-600">[API] Response sent to merchant_7c: 200 OK</p>
                                <p className="text-amber-500">[WARN] High latency detected in HKG-01 region (240ms)</p>
                                <p className="text-slate-600">[SYSTEM] Cleaning up temporary transaction buffers...</p>
                                <p className="text-emerald-500">[SYSTEM] Kernel operational. Health score: 100%</p>
                             </div>
                        </motion.div>
                    )}
                    {activeTab === 'network' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Network Topology</h1>
                                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs underline decoration-blue-500 underline-offset-8">Global Node Infrastructure</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { region: 'SGP-01', status: 'Optimal', delay: '12ms', load: '14%' },
                                    { region: 'HKG-01', status: 'High Latency', delay: '240ms', load: '68%' },
                                    { region: 'HAN-01', status: 'Optimal', delay: '8ms', load: '42%' },
                                ].map((node) => (
                                    <div key={node.region} className="bg-[#111418] border border-slate-800 p-8 rounded-3xl">
                                        <div className="flex items-center justify-between mb-6">
                                            <Globe className={node.status === 'Optimal' ? 'text-emerald-500' : 'text-amber-500'} size={24} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${node.status === 'Optimal' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{node.status}</span>
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-1">{node.region} Cluster</h3>
                                        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4">
                                            <span>Ping: {node.delay}</span>
                                            <span>Capacity: {node.load}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                                            <div className={`h-full transition-all duration-1000 ${node.status === 'Optimal' ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: node.load }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                    {activeTab === 'settings' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Kernel Settings</h1>
                            <div className="bg-[#111418] border border-slate-800 rounded-[40px] p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <ShieldCheck size={16} className="text-blue-500" /> Security Protocol
                                        </h3>
                                        <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-slate-800">
                                            <span className="text-xs font-bold text-white">RSA-2048 Force Encryption</span>
                                            <div className="w-10 h-5 bg-blue-600 rounded-full relative"><div className="w-3 h-3 bg-white rounded-full absolute right-1 top-1" /></div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-slate-800">
                                            <span className="text-xs font-bold text-white">Merchant 2FA Mandatory</span>
                                            <div className="w-10 h-5 bg-blue-600 rounded-full relative"><div className="w-3 h-3 bg-white rounded-full absolute right-1 top-1" /></div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <Database size={16} className="text-emerald-500" /> Transaction Logic
                                        </h3>
                                        <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-slate-800">
                                            <span className="text-xs font-bold text-white">Auto-Reconciliation</span>
                                            <div className="w-10 h-5 bg-blue-600 rounded-full relative"><div className="w-3 h-3 bg-white rounded-full absolute right-1 top-1" /></div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-slate-800">
                                            <span className="text-xs font-bold text-white">Dynamic Fee Calculation</span>
                                            <div className="w-10 h-5 bg-slate-800 rounded-full relative"><div className="w-3 h-3 bg-slate-600 rounded-full absolute left-1 top-1" /></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-slate-800">
                                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <Server size={16} className="text-amber-500" /> System Maintenance
                                    </h3>
                                    <div className="bg-black/20 border border-slate-800 p-8 rounded-3xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-white font-black text-lg mb-2 tracking-tight">Database Seeding</h4>
                                                <p className="text-slate-500 text-xs font-bold leading-relaxed max-w-md">Populate the kernel with artificial merchant fleet and transaction streams for training or protocol verification.</p>
                                            </div>
                                            <button 
                                                onClick={handleSeedData}
                                                disabled={seeding}
                                                className="h-12 px-10 bg-amber-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-500 transition-all shadow-2xl flex items-center gap-2"
                                            >
                                                {seeding ? <Loader2 className="animate-spin" size={14} /> : <Database size={14} />}
                                                {seeding ? "Executing..." : "Start Seed Protocol"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button className="px-10 h-14 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-all shadow-2xl">Deploy Config</button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
};
