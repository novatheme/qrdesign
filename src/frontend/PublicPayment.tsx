import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle2, Clock, ShieldCheck, QrCode, CreditCard, Landmark, Copy, Check, Info, Loader2 } from "lucide-react";
import api from "../lib/api";
import { format } from "date-fns";

export const PublicPayment = () => {
    const { id } = useParams();
    const [tx, setTx] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchTx = async () => {
            if (id === 'demo') {
                setTx({
                    id: 'DEMO-12345',
                    amount: 50000,
                    description: 'VietQR Gateway Demo Payment',
                    status: 'PENDING',
                    createdAt: new Date().toISOString(),
                    qrBase64: 'https://api.vietqr.io/image/970415-113366668888-8Vp6p5f.jpg?accountName=DEMO%20MERCHANT&amount=50000&addInfo=DEMO%2012345'
                });
                setLoading(false);
                return;
            }

            try {
                const res = await api.get(`/public/transaction/${id}`);
                setTx(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const interval = setInterval(fetchTx, 5000);
        fetchTx();
        return () => clearInterval(interval);
    }, [id]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-400">
            <Loader2 className="animate-spin mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">Securing Payment Channel...</p>
        </div>
    );

    if (!tx) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                <Info size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">Order Not Found</h1>
            <p className="text-slate-500 font-medium max-w-xs mx-auto">This payment link may have expired or does not exist.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 font-sans">
            <div className="max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 mb-10 text-slate-900">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                        <QrCode size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-lg font-black tracking-tight">VietQR <span className="text-blue-600">Checkout</span></span>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100"
                >
                    <div className="p-8 pb-4 text-center border-b border-slate-50 relative overflow-hidden">
                        <div className="relative z-10">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Amount to Pay</span>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tx.amount)}
                            </h2>
                            <div className="flex items-center justify-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-full w-fit mx-auto border border-amber-100 mb-2">
                                <Clock size={12} strokeWidth={3} className="animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">Waiting for payment</span>
                            </div>
                        </div>
                        {/* Decorative pattern */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2 -z-0" />
                    </div>

                    <div className="p-8 flex flex-col items-center">
                        <div className="w-full aspect-square bg-slate-50 rounded-[40px] border border-slate-100 p-8 mb-8 flex items-center justify-center group relative overflow-hidden">
                            <img src={tx.qrBase64} className="w-full h-full object-contain relative z-10" />
                            <div className="absolute inset-x-0 bottom-0 py-4 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scan with Banking App</span>
                            </div>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                                            <Landmark size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instructions</p>
                                            <p className="text-sm font-bold text-slate-900 leading-none mt-0.5">Scan or Copy Info</p>
                                        </div>
                                    </div>
                                    <ShieldCheck className="text-blue-500" size={20} />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                                        <div className="text-[11px] font-bold text-slate-400">Reference ID</div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-black text-slate-900">#{tx.id.split('-')[0]}</span>
                                            <button onClick={() => copyToClipboard(tx.id)} className="text-slate-300 hover:text-blue-600">
                                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                                        <div className="text-[11px] font-bold text-slate-400">Merchant Info</div>
                                        <div className="text-xs font-black text-slate-900">Verified Partner</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-600 rounded-2xl p-6 text-white text-center shadow-xl shadow-blue-600/20">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-80">Quick Tip</p>
                                <p className="text-xs font-bold leading-relaxed">
                                    Open your banking app, select QR Pay, and scan the code above. No need to enter amount or description.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 pb-8 flex items-center justify-center gap-8 grayscale opacity-20">
                         <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black italic">NAPAS</span>
                            <div className="w-full h-0.5 bg-blue-600 mt-0.5" />
                         </div>
                         <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black italic">VietQR</span>
                         </div>
                         <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black italic">PayOS</span>
                         </div>
                    </div>
                </motion.div>

                <div className="mt-12 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Secured by VietQR Gateway</p>
                    <div className="flex items-center justify-center gap-6 text-slate-400 text-xs font-bold">
                        <a href="#" className="hover:text-slate-900">Help Center</a>
                        <a href="#" className="hover:text-slate-900">Term of Service</a>
                        <a href="#" className="hover:text-slate-900">Privacy</a>
                    </div>
                </div>
            </div>
        </div>
    );
};
