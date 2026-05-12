import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    Search, ChevronRight, Landmark, CreditCard, User, 
    MessageSquare, Download, Share2, Copy, Check, 
    Zap, Palette, Settings2, Globe, FileJson, 
    Languages, Image as ImageIcon, LayoutGrid
} from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import jsPDF from 'jspdf';
import api from '../../lib/api';
import { cn } from '../../lib/utils';
import { translations, Language } from '../../shared/i18n';
import { templates } from '../../shared/templates';
import { QRStyle } from '../../types';

export const QRGenerator = () => {
    const [lang, setLang] = useState<Language>('vi');
    const t = translations[lang];

    const [banks, setBanks] = useState<any[]>([]);
    const [loadingBanks, setLoadingBanks] = useState(true);
    const [selectedBank, setSelectedBank] = useState<any>(null);
    const [isBankSelectorOpen, setIsBankSelectorOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<'info' | 'design'>('info');
    
    const [formData, setFormData] = useState({
        accountNumber: '',
        accountName: '',
        amount: '',
        description: 'Thanh toan don hang'
    });

    const [qrData, setQrData] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    
    const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
    const [customStyle, setCustomStyle] = useState<QRStyle>(templates[0]);
    
    const qrRef = useRef<HTMLDivElement>(null);
    const qrCode = useRef<QRCodeStyling | null>(null);

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

        // Initialize QR Code Styling
        qrCode.current = new QRCodeStyling({
            width: 300,
            height: 300,
            data: "https://vietqr.net",
            dotsOptions: { color: "#2563eb", type: "square" },
            backgroundOptions: { color: "#ffffff" },
        });
    }, []);

    useEffect(() => {
        if (qrRef.current && qrCode.current) {
            qrRef.current.innerHTML = "";
            qrCode.current.append(qrRef.current);
        }
    }, [qrRef.current]);

    useEffect(() => {
        if (qrCode.current && (qrData || selectedTemplate)) {
            const style = activeTab === 'design' ? customStyle : selectedTemplate;
            qrCode.current.update({
                data: qrData?.qrPayload || "https://vietqr.net",
                dotsOptions: {
                    color: style.dotsColor,
                    type: style.dotsType as any
                },
                backgroundOptions: {
                    color: style.backgroundColor
                },
                cornersSquareOptions: {
                    color: style.cornersSquareColor,
                    type: style.cornersSquareType as any
                },
                cornersDotOptions: {
                    color: style.cornersDotColor,
                    type: style.cornersDotType as any
                },
                image: style.image || selectedBank?.logo
            });
        }
    }, [qrData, selectedTemplate, customStyle, activeTab, selectedBank]);

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

    const downloadQR = async (format: 'png' | 'svg' | 'pdf') => {
        if (!qrCode.current) return;

        if (format === 'pdf') {
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [400, 500]
            });
            
            // Generate PNG first
            const blob = await qrCode.current.getRawData('png') as Blob;
            if (!blob) return;
            
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result as string;
                doc.setFontSize(16);
                doc.text("VietQR Payment", 200, 40, { align: 'center' });
                doc.addImage(base64data, 'PNG', 50, 60, 300, 300);
                doc.setFontSize(10);
                doc.text(`${selectedBank?.shortName} - ${formData.accountNumber}`, 200, 380, { align: 'center' });
                doc.text(`Amount: ${formData.amount || '0'} VND`, 200, 400, { align: 'center' });
                doc.save(`vietqr-${formData.accountNumber}.pdf`);
            };
        } else {
            qrCode.current.download({
                name: `vietqr-${formData.accountNumber || 'payment'}`,
                extension: format as any
            });
        }
    };

    const filteredBanks = (banks || []).filter(b => 
        (b.shortName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
        (b.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const languages: { code: Language, label: string, flag: string }[] = [
        { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'zh', label: '中文', flag: '🇨🇳' },
        { code: 'ko', label: '한국어', flag: '🇰🇷' },
        { code: 'ja', label: '日本語', flag: '🇯🇵' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                {/* Language Switcher */}
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 pl-3">
                        <Globe size={14} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t. financialStandard}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {languages.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => setLang(l.code)}
                                className={cn(
                                    "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                                    lang === l.code 
                                        ? "bg-white text-blue-600 shadow-sm border border-slate-200" 
                                        : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <span className="mr-1.5">{l.flag}</span>
                                {l.code}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Tabs */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                    <div className="flex items-center gap-1 mb-8 bg-slate-50 p-1 rounded-2xl w-fit">
                        <button 
                            onClick={() => setActiveTab('info')}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all",
                                activeTab === 'info' ? "bg-white text-blue-600 shadow-md" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <CreditCard size={14} /> {t.paymentInfo}
                        </button>
                        <button 
                            onClick={() => setActiveTab('design')}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all",
                                activeTab === 'design' ? "bg-white text-blue-600 shadow-md" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <Palette size={14} /> {t.design.templates}
                        </button>
                    </div>

                    <div className="min-h-[440px]">
                        {activeTab === 'info' ? (
                            <div className="space-y-6">
                                {/* Bank Selector */}
                                <div className="relative">
                                    <label className="block text-[11px] font-extrabold text-slate-400 mb-2 ml-1 uppercase tracking-widest">{t.chooseBank}</label>
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
                                                    <span className="font-semibold text-sm">{t.bankPlaceholder}</span>
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
                                                            placeholder={t.searchBank}
                                                            className="w-full pl-10 h-11 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 shadow-sm"
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="max-h-72 overflow-y-auto custom-scrollbar divide-y divide-slate-50 font-sans">
                                                    {loadingBanks ? (
                                                        <div className="p-12 text-center text-slate-300 animate-pulse font-bold uppercase tracking-widest text-xs">{t.loading}</div>
                                                    ) : filteredBanks.length === 0 ? (
                                                        <div className="p-12 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">{t.noBank}</div>
                                                    ) : filteredBanks.map(bank => (
                                                        <button
                                                            key={bank.bin}
                                                            onClick={() => { setSelectedBank(bank); setIsBankSelectorOpen(false); }}
                                                            className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left group"
                                                        >
                                                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 p-1.5 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[11px] font-extrabold text-slate-400 mb-2 ml-1 uppercase tracking-widest">{t.accountNumber}</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <CreditCard className="text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                            </div>
                                            <input 
                                                type="text" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-mono font-bold text-slate-700"
                                                placeholder={t.accountNumberPlaceholder}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-extrabold text-slate-400 mb-2 ml-1 uppercase tracking-widest">{t.accountName}</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                            </div>
                                            <input 
                                                type="text" name="accountName" value={formData.accountName} onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-bold uppercase text-slate-700 placeholder:normal-case"
                                                placeholder={t.accountNamePlaceholder}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-extrabold text-slate-400 mb-2 ml-1 uppercase tracking-widest">{t.amount}</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none font-bold text-slate-300 group-focus-within:text-emerald-500 transition-colors uppercase text-[10px]">
                                                VND
                                            </div>
                                            <input 
                                                type="number" name="amount" value={formData.amount} onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50 transition-all font-extrabold text-lg text-emerald-600 tracking-tight"
                                                placeholder={t.amountPlaceholder}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-extrabold text-slate-400 mb-2 ml-1 uppercase tracking-widest">{t.memo}</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <MessageSquare className="text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                            </div>
                                            <input 
                                                type="text" name="description" value={formData.description} onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-semibold text-slate-600"
                                                placeholder={t.descriptionPlaceholder}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={generateQR}
                                    disabled={!selectedBank || !formData.accountNumber || isGenerating}
                                    className="w-full h-15 bg-black text-white rounded-2xl font-black shadow-2xl shadow-black/20 flex items-center justify-center gap-3 hover:bg-slate-800 disabled:opacity-30 transition-all active:scale-[0.99] uppercase tracking-widest text-xs"
                                >
                                    {isGenerating ? <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" /> : <>Generate Smart QR <Zap size={18} fill="currentColor" /></>}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                        <LayoutGrid size={14} className="text-blue-500" /> {t.design.templates}
                                    </h4>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{templates.length} Styles</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {templates.map((tpl, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setSelectedTemplate(tpl); setCustomStyle(tpl); }}
                                            className={cn(
                                                "group relative aspect-square rounded-2xl border transition-all overflow-hidden flex flex-col items-center justify-center gap-2 p-4",
                                                selectedTemplate.name === tpl.name ? "border-blue-500 ring-4 ring-blue-50 bg-blue-50/10" : "border-slate-100 bg-slate-50 hover:border-slate-200"
                                            )}
                                        >
                                            <div 
                                                className="w-12 h-12 rounded-lg shadow-sm border border-white/20"
                                                style={{ backgroundColor: tpl.dotsColor }}
                                            />
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-wider text-center line-clamp-1",
                                                selectedTemplate.name === tpl.name ? "text-blue-600" : "text-slate-400"
                                            )}>
                                                {tpl.name}
                                            </span>
                                            {selectedTemplate.name === tpl.name && (
                                                <div className="absolute top-1 right-1 bg-blue-500 text-white p-1 rounded-full">
                                                    <Check size={8} strokeWidth={4} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Decorative pattern */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-[80px] -z-10" />
                </div>
            </div>

            <div className="lg:col-span-5 relative">
                <div className="sticky top-24 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 text-center">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-extrabold text-slate-900 tracking-tight">{t.preview}</h3>
                        <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest">Live</span>
                        </div>
                    </div>
                    
                    <div className="w-full aspect-square bg-slate-50 rounded-[40px] border border-slate-100 flex flex-col items-center justify-center p-8 relative overflow-hidden group shadow-inner">
                        <div ref={qrRef} className="w-full h-full flex items-center justify-center transition-transform group-hover:scale-105 duration-500" />
                        
                        {!qrData && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 backdrop-blur-[2px] z-20 rounded-[40px]">
                                <div className="text-center space-y-4 max-w-[200px]">
                                    <div className="w-16 h-16 bg-white rounded-3xl mx-auto flex items-center justify-center text-slate-200 shadow-xl shadow-slate-200/50 border border-slate-100">
                                        <Landmark size={32} strokeWidth={1} />
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">{t.previewInstruction}</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Decorative card pattern */}
                        <div className="absolute inset-x-0 bottom-0 h-1.5 flex gap-1 px-1">
                            {Array.from({length: 40}).map((_, i) => <div key={i} className="flex-1 bg-slate-200/20 rounded-t-full" />)}
                        </div>
                    </div>

                    {qrData && (
                        <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-700">
                            <div className="space-y-3">
                                <button 
                                    onClick={() => copyToClipboard(qrData.qrPayload)}
                                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between px-4 hover:bg-white hover:border-blue-300 transition-all group shadow-sm"
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <FileJson size={14} className="text-slate-300" />
                                        <span className="font-mono text-[10px] text-slate-400 truncate max-w-[200px] font-bold">{qrData.qrPayload}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-blue-600 font-black text-[9px] uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-lg">
                                        {copied ? <><Check size={10} /> {t.copied}</> : <><Copy size={10} /> {t.copy}</>}
                                    </div>
                                </button>
                                
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    <div className="relative group lg:col-span-1">
                                        <button 
                                            onClick={() => downloadQR('png')}
                                            className="w-full h-12 bg-white border border-slate-200 text-slate-700 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
                                        >
                                            <Download size={14} strokeWidth={2.5} /> Save PNG
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => downloadQR('pdf')}
                                        className="w-full h-12 bg-white border border-slate-200 text-slate-700 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 hover:shadow-lg hover:shadow-emerald-500/10 transition-all"
                                    >
                                        <Download size={14} strokeWidth={2.5} /> Save PDF
                                    </button>
                                    <button 
                                        onClick={() => {
                                            const link = `${window.location.origin}/pay/${qrData.transaction.id}`;
                                            copyToClipboard(link);
                                        }}
                                        className="w-full lg:col-span-1 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all"
                                    >
                                        <Share2 size={14} strokeWidth={2.5} /> {copied ? 'Linked!' : 'Payment Link'}
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest mb-3">{t.financialStandard}</p>
                                <div className="flex items-center justify-center gap-6 grayscale opacity-40">
                                    <span className="text-[10px] font-black italic tracking-tighter">NAPAS</span>
                                    <span className="text-[10px] font-black italic tracking-tighter">VIETQR</span>
                                    <span className="text-[10px] font-black italic tracking-tighter">PAYOS</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
