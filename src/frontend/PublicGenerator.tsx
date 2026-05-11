import React from "react";
import { motion } from "motion/react";
import { QRGenerator } from "../merchant/components/QRGenerator";
import { QrCode, ArrowLeft, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const PublicGenerator = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Top Bar */}
            <nav className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <Link to="/" className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="h-6 w-px bg-slate-200 mx-2" />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                            <QrCode size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Free Generator</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest">Network Active</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-8 md:p-12 pb-32">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Zap className="text-amber-500 fill-amber-500" size={16} />
                        <span className="text-[11px] font-extrabold text-amber-500 uppercase tracking-widest">Open Protocol</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">VietQR Smart Link</h1>
                    <p className="text-slate-500 font-semibold max-w-2xl">Create persistent, dynamic payment codes for any Vietnamese bank account instantly. No account required.</p>
                </motion.div>

                <div className="bg-white rounded-[32px] p-2 border border-slate-200 shadow-xl shadow-slate-200/50">
                    <div className="p-8 md:p-10">
                        <QRGenerator />
                    </div>
                </div>

                <div className="mt-20 text-center space-y-6">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Institutional Partners</p>
                    <div className="flex items-center justify-center gap-10 grayscale opacity-20 hover:opacity-100 transition-opacity">
                         <span className="text-xs font-black italic">NAPAS 24/7</span>
                         <span className="text-xs font-black italic">VIETQR</span>
                         <span className="text-xs font-black italic">PAYOS</span>
                         <span className="text-xs font-black italic">MOMO</span>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-slate-200 bg-white text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 VIETQR TECHNOLOGY PTE LTD • SECURE PAYMENT INFRASTRUCTURE</p>
            </footer>
        </div>
    );
};
