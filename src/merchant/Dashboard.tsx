import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../lib/store';
import { Sidebar } from './components/Sidebar';
import { StatsCard } from './components/StatsCard';
import { TransactionTable } from './components/TransactionTable';
import { QRGenerator } from './components/QRGenerator';
import { motion } from 'motion/react';
import { 
  DollarSign, Activity, Users, Zap, Bell, Search, 
  User as UserIcon, ChevronRight, Key, Copy 
} from 'lucide-react';
import api from '../lib/api';
import { io, Socket } from 'socket.io-client';

export const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/merchant/stats');
        if (res.data && res.data.data) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Setup Realtime Socket
    const newSocket = io(window.location.origin);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join-merchant', user?.id);
    });

    newSocket.on('payment-received', (tx) => {
      // Refresh stats on new payment
      fetchStats();
    });

    return () => {
      newSocket.close();
    };
  }, [user]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Top Navbar */}
        <header className="h-14 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 text-slate-400">
             <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <span className="text-slate-900 border-b-2 border-black pb-4 mt-4">Dashboard</span>
                <ChevronRight size={14} className="mt-0.5" />
                <span className="text-slate-400 font-bold uppercase tracking-widest">{activeTab}</span>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest">Connected</span>
            </div>
            <div className="h-6 w-px bg-slate-200 mx-2" />
            <button className="text-slate-400 hover:text-slate-900 transition-colors">
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-3 ml-2 group cursor-pointer">
              <div className="text-right">
                <p className="text-[11px] font-extrabold text-slate-900 leading-none">{user?.email}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Merchant ID: {user?.id.split('-')[0]}</p>
              </div>
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 border border-slate-200 group-hover:bg-slate-200 transition-colors">
                <UserIcon size={14} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-10 pb-20">
          {activeTab === 'overview' && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="space-y-10"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="text-blue-600" size={16} />
                        <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest">Business Intelligence</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Financial Overview</h1>
                    <p className="text-slate-400 font-semibold mt-1">Real-time performance metrics and insights.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-5 h-11 bg-white border border-slate-200 rounded-xl text-xs font-extrabold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">Export Data</button>
                  <button 
                    onClick={() => setActiveTab('generator')}
                    className="px-6 h-11 bg-black text-white rounded-xl text-xs font-extrabold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-black/10"
                  >
                    Quick Collect
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                  {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white border border-slate-200 rounded-2xl" />)}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard 
                      title="Revenue" 
                      value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats?.totalVolume || 0)} 
                      icon={DollarSign}
                      trend={{ value: '12.5%', positive: true }}
                      color="blue"
                    />
                    <StatsCard 
                      title="Net Transactions" 
                      value={stats?.totalTransactions || 0} 
                      icon={Activity}
                      trend={{ value: '8.3%', positive: true }}
                      color="emerald"
                    />
                    <StatsCard 
                      title="Success Rate" 
                      value={`${stats?.successRate?.toFixed(1) || 0}%`} 
                      icon={Zap}
                      color="amber"
                    />
                    <StatsCard 
                      title="Terminal Active" 
                      value="01" 
                      icon={Users}
                      color="slate"
                    />
                  </div>

                  <TransactionTable transactions={stats?.recentActivity || []} />
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'generator' && (
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-10"
             >
                <div>
                   <div className="flex items-center gap-2 mb-2">
                        <Zap className="text-amber-500 fill-amber-500" size={16} />
                        <span className="text-[11px] font-extrabold text-amber-500 uppercase tracking-widest">Payment Link Generator</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">QR Billing Engine</h1>
                    <p className="text-slate-400 font-semibold mt-1">Request payments instantly through VietQR dynamic codes.</p>
                </div>
                <QRGenerator />
             </motion.div>
          )}

          {activeTab === 'api' && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-10"
            >
                <div className="bg-slate-900 text-white p-10 rounded-[32px] relative overflow-hidden shadow-2xl shadow-slate-900/20">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 backdrop-blur-sm">
                                <Key size={20} className="text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Developer Credentials</h2>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Live Environment Keys</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                            <div>
                                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] block mb-3">Public API Key</label>
                                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 group hover:border-white/20 transition-all">
                                    <code className="flex-1 text-sm text-blue-400 font-mono font-bold tracking-tight">pk_live_51O7c...vm4x</code>
                                    <button className="text-slate-500 hover:text-white transition-colors">
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] block mb-3">Secret Merchant Key</label>
                                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 group hover:border-white/20 transition-all">
                                    <code className="flex-1 text-sm text-slate-600 font-mono font-bold tracking-widest">sk_live_••••••••••••••</code>
                                    <button className="text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black">Reveal</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full filter blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/2" />
                </div>

                <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm relative group overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                                <Activity size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-slate-900 tracking-tight">Webhook Notifications</h3>
                                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5">HTTP Callbacks for successful payments</p>
                            </div>
                        </div>
                        <div className="space-y-8 max-w-2xl">
                            <div>
                                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 block">Target Payload URL</label>
                                <div className="relative">
                                    <input 
                                        type="url" 
                                        placeholder="https://api.your-system.com/webhooks/vietqr" 
                                        className="w-full pl-5 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-semibold italic placeholder:italic"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="px-8 h-12 bg-black text-white rounded-xl font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-slate-800 transition-all">Save Webhook</button>
                                <button className="px-8 h-12 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl font-extrabold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">Ping Endpoint</button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};
