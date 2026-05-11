import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ShieldCheck, Store, User, ArrowRight, Zap, QrCode, Lock } from "lucide-react";

export const Home = () => {
    const roles = [
        {
            title: "Administrator",
            description: "System-wide analytics, merchant management, and service health monitoring.",
            icon: ShieldCheck,
            link: "/admin",
            color: "slate",
            tag: "Restricted Access"
        },
        {
            title: "Merchant Portal",
            description: "Manage your business, generate VietQR codes, and track your revenue stream.",
            icon: Store,
            link: "/dashboard",
            color: "blue",
            tag: "Business Account"
        },
        {
            title: "Customer View",
            description: "Scan, verify, and complete payments securely via the public interface.",
            icon: User,
            link: "/generate",
            color: "emerald",
            tag: "Public Interface"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
            {/* Background pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            <nav className="relative z-10 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white shadow-xl">
                        <QrCode size={20} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-slate-900">VietQR <span className="text-blue-600">Gateway</span></span>
                </div>
                <div className="flex items-center gap-6">
                    <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Merchant Login</Link>
                    <button className="h-10 px-6 bg-black text-white rounded-xl text-xs font-extrabold uppercase tracking-widest hover:bg-slate-800 transition-all">Support</button>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
                <div className="text-center max-w-3xl mx-auto mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6">
                            <Zap size={12} fill="currentColor" /> Next-Gen Payment Infrastructure
                        </span>
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-[0.9]">
                            One Gateway. <br />
                            <span className="text-slate-400">Complete Control.</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                            A unified platform for banks, merchants, and customers to interact with the VietQR network in real-time. Choose your portal below to get started.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {roles.map((role, idx) => (
                        <motion.div
                            key={role.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link 
                                to={role.link}
                                className="group block bg-white border border-slate-200 p-10 rounded-[32px] hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all relative overflow-hidden h-full"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border transition-colors group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 ${
                                    role.color === 'blue' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                                    role.color === 'emerald' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                    'bg-slate-50 border-slate-200 text-slate-600'
                                }`}>
                                    <role.icon size={28} strokeWidth={2.5} />
                                </div>
                                
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block group-hover:text-slate-500">{role.tag}</span>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:translate-x-1 transition-transform">{role.title}</h3>
                                <p className="text-slate-500 font-semibold leading-relaxed mb-10 group-hover:text-slate-600">{role.description}</p>
                                
                                <div className="flex items-center gap-2 text-slate-900 font-black text-[11px] uppercase tracking-widest group-hover:text-blue-600">
                                    Launch Instance <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                                </div>

                                {role.title === "Administrator" && (
                                    <div className="absolute top-6 right-6 opacity-40">
                                        <Lock size={16} />
                                    </div>
                                )}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-12 grayscale opacity-30">
                    <div className="flex items-center gap-2">
                        <Zap size={20} fill="black" />
                        <span className="font-black italic text-xl">NAPAS</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <QrCode size={20} />
                        <span className="font-black italic text-xl">VIETQR</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={20} />
                        <span className="font-black italic text-xl">SECURE</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap size={20} fill="black" />
                        <span className="font-black italic text-xl">PAYOS</span>
                    </div>
                </div>
            </main>

            <footer className="bg-slate-900 text-slate-400 py-20 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white">
                            <QrCode size={18} strokeWidth={2.5} />
                        </div>
                        <span className="font-black text-white text-lg">VietQR Gateway</span>
                    </div>
                    <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
                        <a href="#" className="hover:text-white">Security</a>
                        <a href="#" className="hover:text-white">Documentation</a>
                        <a href="#" className="hover:text-white">API Reference</a>
                        <a href="#" className="hover:text-white">Legal</a>
                    </div>
                    <p className="text-[10px] uppercase font-black tracking-widest">© 2026 VIETQR TECHNOLOGY PTE LTD.</p>
                </div>
            </footer>
        </div>
    );
};
