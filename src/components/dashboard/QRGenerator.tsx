import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, Landmark, CreditCard, User, MessageSquare, Download, Share2, Copy, Check, Zap } from 'lucide-react';
import api from '../../lib/api';
import { cn } from '../../lib/utils';

export const QRGenerator = () => {
    const [banks, setBanks] = useState<any[]>([]);
    const [loadingBanks, setLoadingBanks] = useState(true);
    const [selectedBank, setSelectedBank] = useState<any>(null);
    const [isBankSelectorOpen, setIsBankSelectorOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        accountNumber: '',
        accountName: '',
        amount: '',
        description: 'Thanh toan don hang'
    });
    const [qrData, setQrData] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        api.get('/banks').then(res => {
            if (res.data && res.data.data && Array.isArray(res.data.data)) {
                setBanks(res.data.data);
            } else {
                setBanks([]);
            }
            setLoadingBanks(false);
        }).catch(err => {
            console.error('Failed to fetch banks', err);
            setBanks([]);
            setLoadingBanks(false);
        });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generateQR = async () => {
        if (!selectedBank || !formData.accountNumber) return;
        setIsGenerating(true);
        try {
            const res = await api.post('/qr/generate', {
                bankBin: selectedBank.bin,
                accountNumber: formData.accountNumber,
                accountName: formData.accountName,
                amount: formData.amount ? parseInt(formData.amount) : undefined,
                description: formData.description
            });
            setQrData(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const filteredBanks = (banks || []).filter(b => 
        (b.shortName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
        (b.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const simulatePayment = async () => {
        if (!qrData) return;
        try {
            await api.post('/webhooks/payment-simulate', {
                reference: qrData.transactionId,
                status: 'SUCCESS'
            });
            alert('Payment simulation successful! Transaction updated to SUCCESS.');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
                            <CreditCard size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Payment Configuration</h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Define your transaction parameters</p>
                        </div>
                    </div>
                    
                    <div className="space-y-8">
                        {/* Bank Selector */}
                        <div className="relative">
                            <label className="block text-[11px] font-extrabold text-slate-400 mb-2 ml-1 uppercase tracking-widest">Destination Bank</label>
                            <button
                                onClick={() => setIsBankSelectorOpen(!isBankSelectorOpen)}
                                className={cn(
                                    "w-full flex items-center justify-between px-5 h-14 rounded-xl border transition-all outline-none",
                                    isBankSelectorOpen ? "border-blue-500 bg-white shadow-sm ring-4 ring-blue-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {selectedBank ? (
                                        <>
                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 p-1 flex items-center justify-center">
                                                <img src={selectedBank.logo} className="max-w-full max-h-full object-contain" />
                                            </div>
                                            <span className="font-bold text-slate-800 tracking-tight">{selectedBank.shortName} <span className="text-slate-400 font-medium ml-1 hidden sm:inline">- {selectedBank.name}</span></span>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <Landmark size={18} />
                                            <span className="font-semibold text-sm">Select bank account...</span>
                                        </div>
                                    )}
                                </div>
                                <ChevronRight className={cn("text-slate-400 transition-transform", isBankSelectorOpen && "rotate-90")} size={18} />
                            </button>

                            <AnimatePresence>
                                {isBankSelectorOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute top-full left-0 right-0 mt-3 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                <input
                                                    type="text"
                                                    placeholder="Search 40+ Vietnamese banks..."
                                                    className="w-full pl-10 h-11 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 shadow-sm"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="max-h-72 overflow-y-auto custom-scrollbar divide-y divide-slate-50">
                                            {loadingBanks ? (
                                                <div className="p-12 text-center text-slate-300 animate-pulse font-bold uppercase tracking-widest text-xs">Loading bank network...</div>
                                            ) : filteredBanks.map(bank => (
                                                <button
                                                    key={bank.bin}
                                                    onClick={() => { setSelectedBank(bank); setIsBankSelectorOpen(false); }}
                                                    className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left group"
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                                                        <img src={bank.logo} className="max-w-full max-h-full object-contain" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-extrabold text-sm text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">{bank.shortName} <span className="text-slate-300 font-medium ml-1">#{bank.bin}</span></p>
                                                        <p className="text-[11px] font-bold text-slate-400 truncate mt-0.5">{bank.name}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-extrabold text-slate-400 mb-2 ml-1 uppercase tracking-widest">Account Number</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <CreditCard className="text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                        </div>
                                        <input 
                                            type="text" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-mono font-bold text-slate-700"
                                            placeholder="Ex: 0123456789"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-extrabold text-slate-400 mb-2 ml-1 uppercase tracking-widest">Recipient Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                        </div>
                                        <input 
                                            type="text" name="accountName" value={formData.accountName} onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-bold uppercase text-slate-700"
                                            placeholder="NGUYEN VAN A"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-extrabold text-slate-400 mb-2 ml-1 uppercase tracking-widest">Amount (VND)</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none font-bold text-slate-300 group-focus-within:text-emerald-500 transition-colors uppercase text-[10px]">
                                            VND
                                        </div>
                                        <input 
                                            type="number" name="amount" value={formData.amount} onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50 transition-all font-extrabold text-lg text-emerald-600 tracking-tight"
                                            placeholder="50,000"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-extrabold text-slate-400 mb-2 ml-1 uppercase tracking-widest">Transaction Memo</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <MessageSquare className="text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                        </div>
                                        <input 
                                            type="text" name="description" value={formData.description} onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-semibold text-slate-600"
                                            placeholder="Order #12345"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={generateQR}
                            disabled={!selectedBank || !formData.accountNumber || isGenerating}
                            className="w-full h-15 bg-black text-white rounded-2xl font-extrabold shadow-2xl shadow-black/20 flex items-center justify-center gap-3 hover:bg-slate-800 disabled:opacity-30 transition-all active:scale-[0.99]"
                        >
                            {isGenerating ? <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" /> : <>Generate Smart QR <Zap size={20} fill="currentColor" /></>}
                        </button>
                    </div>
                    {/* Abstract background blobs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[120px] opacity-30 -translate-y-1/2 translate-x-1/2 -z-10" />
                </div>
            </div>

            <div className="lg:col-span-5 relative">
                <div className="sticky top-24 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-extrabold text-slate-900 tracking-tight">Active Preview</h3>
                        <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest">Real-time</span>
                        </div>
                    </div>
                    
                    <div className="w-full aspect-[4/5] bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col items-center justify-center p-8 relative overflow-hidden group shadow-inner">
                        {qrData ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full flex flex-col items-center gap-6 relative z-10"
                            >
                                <div className="w-full bg-white p-6 rounded-[24px] shadow-2xl shadow-slate-200 border border-slate-100">
                                    <img src={qrData.qrBase64} className="w-full h-auto object-contain" />
                                </div>
                                <div className="text-center group-hover:scale-105 transition-transform">
                                    <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-[0.2em] mb-1">Total Amount</p>
                                    <p className="text-2xl font-black text-slate-900 tracking-tight">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(formData.amount) || 0)}</p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center space-y-6 max-w-[200px]">
                                <div className="w-20 h-20 bg-white rounded-3xl mx-auto flex items-center justify-center text-slate-200 shadow-xl shadow-slate-200/50 border border-slate-100">
                                    <Landmark size={40} strokeWidth={1} />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-extrabold text-slate-600">Waiting for data</p>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">Fill in the payment details to generate your dynamic QR code.</p>
                                </div>
                            </div>
                        )}
                        {/* Decorative card pattern */}
                        <div className="absolute inset-x-0 bottom-0 h-1.5 flex gap-1 px-1">
                            {Array.from({length: 40}).map((_, i) => <div key={i} className="flex-1 bg-slate-200/50 rounded-t-full" />)}
                        </div>
                    </div>

                    {qrData && (
                        <div className="mt-8 space-y-4">
                            <div className="space-y-2">
                                <button 
                                    onClick={() => copyToClipboard(qrData.qrPayload)}
                                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between px-4 hover:bg-white hover:border-blue-300 transition-all group"
                                >
                                    <span className="font-mono text-[11px] text-slate-400 truncate max-w-[220px] font-bold">{qrData.qrPayload}</span>
                                    <div className="flex items-center gap-1.5 text-blue-600 font-extrabold text-[10px] uppercase tracking-wider">
                                        {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                                    </div>
                                </button>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="h-12 bg-white border border-slate-200 text-slate-700 rounded-xl flex items-center justify-center gap-2 font-extrabold text-xs hover:border-blue-500 hover:text-blue-600 transition-all">
                                        <Download size={14} strokeWidth={2.5} /> Save PNG
                                    </button>
                                    <button className="h-12 bg-white border border-slate-200 text-slate-700 rounded-xl flex items-center justify-center gap-2 font-extrabold text-xs hover:border-emerald-500 hover:text-emerald-600 transition-all">
                                        <Share2 size={14} strokeWidth={2.5} /> Send Link
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={simulatePayment}
                                className="w-full py-3 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 text-xs font-extrabold uppercase tracking-widest hover:bg-orange-100 transition-all"
                            >
                                Simulate Success Payment ⚗️
                            </button>
                        </div>
                    )}

                    <div className="mt-10 pt-8 border-t border-slate-100 space-y-4">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.3em]">Institutional Partners</p>
                        <div className="flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black italic tracking-tighter">NAPAS</span>
                                <div className="w-6 h-0.5 bg-blue-600" />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black italic tracking-tighter decoration-blue-500">VietQR</span>
                                <div className="w-6 h-0.5 bg-red-600" />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black italic tracking-tighter">PAYOS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
