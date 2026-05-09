import React, { useState, useEffect, useRef, useMemo } from "react";
import QRCodeStyling, {
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType,
  Options
} from "qr-code-styling";
import { jsPDF } from "jspdf";
import { Search, Download, ChevronRight, CreditCard, User, Landmark, MessageSquare, IndianRupee, Globe, Share2, Copy, Check, Languages, Settings, Palette, Grid, Image as ImageIcon, Upload } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Bank, QRData, ApiResponse, QRStyle } from "./types";
import { generateVietQR } from "./lib/vietqr";
import { cn, formatCurrency } from "./lib/utils";
import { Language, translations } from "./i18n";
import { templates } from "./templates";

export default function App() {
  const [lang, setLang] = useState<Language>("vi");
  const t = translations[lang];

  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [formData, setFormData] = useState<QRData>({
    bankBin: "",
    accountNumber: "",
    accountName: "",
    amount: "",
    description: "",
  });
  const [isBankSelectorOpen, setIsBankSelectorOpen] = useState(false);
  const [isLangSelectorOpen, setIsLangSelectorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const qrCode = useMemo(() => new QRCodeStyling({
    width: 300,
    height: 300,
    type: "svg" as DrawType,
    data: "https://vietqr.net",
    image: "",
    dotsOptions: { color: "#1e293b", type: "square" as DotType },
    backgroundOptions: { color: "#ffffff" },
    imageOptions: { crossOrigin: "anonymous", margin: 8, imageSize: 0.35, hideBackgroundDots: true },
    cornersSquareOptions: { type: "square" as CornerSquareType, color: "#0f172a" },
    cornersDotOptions: { type: "square" as CornerDotType, color: "#0f172a" }
  }), []);

  const getProxyUrl = (url: string) => {
    if (!url || url.startsWith('data:') || url.startsWith('blob:')) return url;
    return `/api/proxy-logo?url=${encodeURIComponent(url)}`;
  };

  const [qrStyle, setQrStyle] = useState<QRStyle>({
    dotsType: "square",
    dotsColor: "#1e293b",
    backgroundColor: "#ffffff",
    cornersSquareType: "square",
    cornersSquareColor: "#0f172a",
    cornersDotType: "square",
    cornersDotColor: "#0f172a",
  });

  const [activeTab, setActiveTab] = useState<'info' | 'design'>('info');
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [bgFile, setBgFile] = useState<string | null>(null);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: "vi", name: "Tiếng Việt", flag: "https://flagcdn.com/w40/vn.png" },
    { code: "en", name: "English", flag: "https://flagcdn.com/w40/us.png" },
    { code: "zh", name: "中文", flag: "https://flagcdn.com/w40/cn.png" },
    { code: "ko", name: "한국어", flag: "https://flagcdn.com/w40/kr.png" },
    { code: "ja", name: "日本語", flag: "https://flagcdn.com/w40/jp.png" },
  ];

  useEffect(() => {
    fetch("https://api.vietqr.io/v2/banks")
      .then((res) => res.json())
      .then((data: ApiResponse<Bank[]>) => {
        if (data.code === "00") {
          setBanks(data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch banks", err))
      .finally(() => setLoading(false));
  }, []);

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    setFormData((prev) => ({ ...prev, bankBin: bank.bin }));
    setIsBankSelectorOpen(false);
    setSearchTerm("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const qrString = selectedBank && formData.accountNumber 
    ? generateVietQR({
        bankBin: formData.bankBin,
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
        amount: formData.amount,
        description: formData.description
      })
    : "";

  useEffect(() => {
    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = "";
      qrCode.append(qrContainerRef.current);
    }
  }, [qrCode]);

  useEffect(() => {
    if (!qrCode) return;
    
    qrCode.update({
      data: qrString || "https://vietqr.net",
      image: logoFile || (selectedBank?.logo ? getProxyUrl(selectedBank.logo) : ""),
      dotsOptions: {
        color: qrStyle.dotsColor,
        type: qrStyle.dotsType as DotType,
      },
      backgroundOptions: {
        color: bgFile ? "transparent" : qrStyle.backgroundColor,
      },
      cornersSquareOptions: {
        type: qrStyle.cornersSquareType as CornerSquareType,
        color: qrStyle.cornersSquareColor,
      },
      cornersDotOptions: {
        type: qrStyle.cornersDotType as CornerDotType,
        color: qrStyle.cornersDotColor,
      }
    });
  }, [qrString, qrStyle, logoFile, selectedBank, qrCode, bgFile]);

  const copyQRString = () => {
    if (!qrString) return;
    navigator.clipboard.writeText(qrString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg' | 'pdf'>('png');
  const [isDownloadOptionsOpen, setIsDownloadOptionsOpen] = useState(false);

  const downloadQR = async () => {
    if (!qrCode) return;
    
    const fileName = `VietQR-${formData.accountNumber || 'template'}`;

    if (downloadFormat === 'pdf') {
      const extension = 'png'; // Get as png for PDF embedding
      const blob = await qrCode.getRawData(extension);
      if (blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64data = reader.result as string;
          const pdf = new jsPDF();
          pdf.addImage(base64data, 'PNG', 10, 10, 190, 190);
          pdf.save(`${fileName}.pdf`);
        };
        reader.readAsDataURL(blob);
      }
    } else {
      qrCode.download({ 
        name: fileName, 
        extension: downloadFormat 
      });
    }
    setIsDownloadOptionsOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'bg') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const content = readerEvent.target?.result as string;
        if (type === 'logo') setLogoFile(content);
        else setBgFile(content);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyTemplate = (template: QRStyle) => {
    setQrStyle(template);
  };

  const filteredBanks = banks.filter(bank => 
    bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-bottom border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
              QR
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">{t.title}</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t.financialStandard}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="relative">
                <button
                onClick={() => setIsLangSelectorOpen(!isLangSelectorOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-sm font-medium"
              >
                <Languages size={16} className="text-slate-500" />
                <div className="flex items-center gap-2">
                  <img 
                    src={languages.find(l => l.code === lang)?.flag} 
                    alt="" 
                    className="w-5 h-3.5 object-cover rounded shadow-sm" 
                    referrerPolicy="no-referrer"
                  />
                  <span>{languages.find(l => l.code === lang)?.name}</span>
                </div>
                <ChevronRight size={14} className={cn("text-slate-400 transition-transform", isLangSelectorOpen && "rotate-90")} />
              </button>

              <AnimatePresence>
                {isLangSelectorOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50"
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLang(l.code);
                          setIsLangSelectorOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-blue-50 transition-colors",
                          lang === l.code ? "text-blue-600 font-bold bg-blue-50/50" : "text-slate-600"
                        )}
                      >
                        <img 
                          src={l.flag} 
                          alt="" 
                          className="w-5 h-3.5 object-cover rounded shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <span>{l.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">{t.docs}</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">{t.about}</a>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
              {t.login}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Form */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-6">
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit mb-4">
              <button
                onClick={() => setActiveTab('info')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                  activeTab === 'info' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <CreditCard size={18} />
                {t.paymentInfo}
              </button>
              <button
                onClick={() => setActiveTab('design')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                  activeTab === 'design' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Palette size={18} />
                {t.design.customize}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'info' ? (
                <motion.div 
                  key="info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                    <h2 className="text-2xl font-bold tracking-tight">{t.paymentInfo}</h2>
                  </div>

                  <div className="space-y-6">
                {/* Bank Select */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{t.chooseBank}</label>
                  <button
                    onClick={() => setIsBankSelectorOpen(!isBankSelectorOpen)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 h-14 rounded-xl border-2 transition-all outline-none",
                      isBankSelectorOpen ? "border-blue-500 bg-blue-50/10" : "border-slate-100 bg-slate-50 hover:border-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {selectedBank ? (
                        <>
                          <img src={selectedBank.logo} alt={selectedBank.shortName} className="w-8 h-8 rounded-md object-contain bg-white" />
                          <span className="font-semibold">{selectedBank.shortName} - {selectedBank.name}</span>
                        </>
                      ) : (
                        <div className="flex items-center gap-3 text-slate-400">
                          <Landmark size={20} />
                          <span>{t.bankPlaceholder}</span>
                        </div>
                      )}
                    </div>
                    <ChevronRight className={cn("text-slate-400 transition-transform", isBankSelectorOpen && "rotate-90")} size={20} />
                  </button>

                  <AnimatePresence>
                    {isBankSelectorOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-3 z-50 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                      >
                        <div className="p-4 border-bottom border-slate-50">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                              type="text"
                              placeholder={t.searchBank}
                              className="w-full pl-10 pr-4 h-11 bg-slate-50 rounded-lg outline-none border border-transparent focus:border-blue-200 transition-colors"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                          {loading ? (
                            <div className="p-8 text-center text-slate-500 animate-pulse">{t.loading}</div>
                          ) : filteredBanks.length > 0 ? (
                            filteredBanks.map((bank) => (
                              <button
                                key={bank.id}
                                onClick={() => handleBankSelect(bank)}
                                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-blue-50 transition-colors text-left group"
                              >
                                <div className="w-12 h-12 rounded-lg bg-white border border-slate-100 p-1 flex items-center justify-center shrink-0">
                                  <img src={bank.logo} alt={bank.shortName} className="max-w-full max-h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-sm group-hover:text-blue-700">{bank.shortName}</div>
                                  <div className="text-xs text-slate-500 truncate">{bank.name}</div>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="p-8 text-center text-slate-500">{t.noBank}</div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Account Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.accountNumber}</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        name="accountNumber"
                        placeholder={t.accountNumberPlaceholder}
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 h-14 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-500 focus:bg-white outline-none transition-all font-mono font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.accountName}</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        name="accountName"
                        placeholder={t.accountNamePlaceholder}
                        value={formData.accountName}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 h-14 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-500 focus:bg-white outline-none transition-all uppercase font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.amount}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">VND</span>
                      <input
                        type="number"
                        name="amount"
                        placeholder={t.amountPlaceholder}
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="w-full pl-16 pr-4 h-14 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-lg text-emerald-600"
                      />
                    </div>
                    {formData.amount && (
                      <p className="mt-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        {formatCurrency(formData.amount)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{t.memo}</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        name="description"
                        placeholder={t.descriptionPlaceholder}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 h-14 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="design"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                <h2 className="text-2xl font-bold tracking-tight">{t.design.customize}</h2>
              </div>

              <div className="space-y-10">
                {/* Templates Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Grid size={18} className="text-blue-600" />
                    <h3 className="font-bold text-slate-700">{t.design.templates}</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {templates.map((tpl, idx) => (
                      <button
                        key={idx}
                        onClick={() => applyTemplate(tpl)}
                        className="group relative flex flex-col items-center gap-2"
                      >
                        <div 
                          className="w-full aspect-square rounded-xl border-2 border-transparent group-hover:border-blue-500 transition-all flex items-center justify-center overflow-hidden"
                          style={{ backgroundColor: tpl.backgroundColor }}
                        >
                          <div className="w-2/3 h-2/3" style={{ background: tpl.dotsColor, opacity: 0.8, mask: 'radial-gradient(circle, #000 70%, transparent 70%)', maskSize: '4px 4px' }} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-600 text-center truncate w-full">{tpl.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Shapes Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings size={18} className="text-blue-600" />
                      <h3 className="font-bold text-slate-700">{t.design.shapes}</h3>
                    </div>
                    
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">{t.design.dotsType}</label>
                      <select 
                        value={qrStyle.dotsType}
                        onChange={(e) => setQrStyle({...qrStyle, dotsType: e.target.value as any})}
                        className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 outline-none focus:border-blue-500 transition-all text-sm font-medium"
                      >
                        <option value="square">Square</option>
                        <option value="rounded">Rounded</option>
                        <option value="dots">Dots</option>
                        <option value="classy">Classy</option>
                        <option value="classy-rounded">Classy Rounded</option>
                        <option value="extra-rounded">Extra Rounded</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">{t.design.cornersSquareType}</label>
                        <select 
                          value={qrStyle.cornersSquareType}
                          onChange={(e) => setQrStyle({...qrStyle, cornersSquareType: e.target.value as any})}
                          className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 outline-none focus:border-blue-500 transition-all text-sm font-medium"
                        >
                          <option value="square">Square</option>
                          <option value="dot">Dot</option>
                          <option value="extra-rounded">Extra Rounded</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">{t.design.cornersDotType}</label>
                        <select 
                          value={qrStyle.cornersDotType}
                          onChange={(e) => setQrStyle({...qrStyle, cornersDotType: e.target.value as any})}
                          className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 outline-none focus:border-blue-500 transition-all text-sm font-medium"
                        >
                          <option value="square">Square</option>
                          <option value="dot">Dot</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Colors Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Palette size={18} className="text-blue-600" />
                      <h3 className="font-bold text-slate-700">{t.design.colors}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">{t.design.colorsForeground}</label>
                        <div className="flex gap-2 items-center">
                          <input 
                            type="color" 
                            value={qrStyle.dotsColor}
                            onChange={(e) => setQrStyle({...qrStyle, dotsColor: e.target.value})}
                            className="w-10 h-10 rounded-lg p-0.5 bg-white border border-slate-200 cursor-pointer"
                          />
                          <input 
                            type="text"
                            value={qrStyle.dotsColor}
                            onChange={(e) => setQrStyle({...qrStyle, dotsColor: e.target.value})}
                            className="flex-1 h-10 bg-slate-50 border border-slate-100 rounded-lg px-2 text-xs font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">{t.design.colorsBackground}</label>
                        <div className="flex gap-2 items-center">
                          <input 
                            type="color" 
                            value={qrStyle.backgroundColor}
                            onChange={(e) => setQrStyle({...qrStyle, backgroundColor: e.target.value})}
                            className="w-10 h-10 rounded-lg p-0.5 bg-white border border-slate-200 cursor-pointer"
                          />
                          <input 
                            type="text"
                            value={qrStyle.backgroundColor}
                            onChange={(e) => setQrStyle({...qrStyle, backgroundColor: e.target.value})}
                            className="flex-1 h-10 bg-slate-50 border border-slate-100 rounded-lg px-2 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">{t.design.eyeFrameColor}</label>
                        <input 
                          type="color" 
                          value={qrStyle.cornersSquareColor}
                          onChange={(e) => setQrStyle({...qrStyle, cornersSquareColor: e.target.value})}
                          className="w-full h-10 rounded-lg p-0.5 bg-white border border-slate-200 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">{t.design.eyeBallColor}</label>
                        <input 
                          type="color" 
                          value={qrStyle.cornersDotColor}
                          onChange={(e) => setQrStyle({...qrStyle, cornersDotColor: e.target.value})}
                          className="w-full h-10 rounded-lg p-0.5 bg-white border border-slate-200 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Logo Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon size={18} className="text-blue-600" />
                      <h3 className="font-bold text-slate-700">{t.design.logo}</h3>
                    </div>
                    <label className="relative flex flex-col items-center justify-center gap-2 w-full h-32 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:bg-slate-100 hover:border-blue-400 transition-all cursor-pointer group">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
                      <Upload className="text-slate-400 group-hover:text-blue-500 transition-colors" size={24} />
                      <span className="text-xs font-bold text-slate-500">{t.design.uploadLogo}</span>
                      {logoFile && (
                        <img src={logoFile} alt="logo" className="absolute inset-0 w-full h-full object-contain p-4 bg-white/50 rounded-2xl" />
                      )}
                    </label>
                  </div>

                  {/* Background Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon size={18} className="text-blue-600" />
                      <h3 className="font-bold text-slate-700">{t.design.background}</h3>
                    </div>
                    <label className="relative flex flex-col items-center justify-center gap-2 w-full h-32 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:bg-slate-100 hover:border-blue-400 transition-all cursor-pointer group">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'bg')} />
                      <Upload className="text-slate-400 group-hover:text-blue-500 transition-colors" size={24} />
                      <span className="text-xs font-bold text-slate-500">{t.design.uploadBg}</span>
                      {bgFile && (
                        <img src={bgFile} alt="bg" className="absolute inset-0 w-full h-full object-cover p-2 bg-white/50 rounded-2xl" />
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-4 flex flex-col gap-2">
                <Globe className="text-blue-600" size={24} />
                <h3 className="font-bold text-blue-900">{t.features.standard.title}</h3>
                <p className="text-xs text-blue-700 leading-relaxed">{t.features.standard.desc}</p>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 flex flex-col gap-2">
                <CreditCard className="text-emerald-600" size={24} />
                <h3 className="font-bold text-emerald-900">{t.features.allBanks.title}</h3>
                <p className="text-xs text-emerald-700 leading-relaxed">{t.features.allBanks.desc}</p>
              </div>
              <div className="bg-amber-50 rounded-2xl p-4 flex flex-col gap-2">
                <Share2 className="text-amber-600" size={24} />
                <h3 className="font-bold text-amber-900">{t.features.share.title}</h3>
                <p className="text-xs text-amber-700 leading-relaxed">{t.features.share.desc}</p>
              </div>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden"
            >
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                <span className="text-white font-bold text-sm">{t.preview}</span>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex flex-col items-center gap-6">
                  <div 
                    className="relative group cursor-pointer p-0 bg-white rounded-3xl border border-slate-100 shadow-inner overflow-hidden w-[300px] h-[300px] flex items-center justify-center shrink-0"
                    style={{ 
                      backgroundImage: bgFile ? `url(${bgFile})` : 'none', 
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div 
                      ref={qrContainerRef} 
                      className={cn(
                        "w-[300px] h-[300px] flex items-center justify-center transition-colors",
                        bgFile ? "bg-transparent" : "bg-white"
                      )} 
                    />
                  </div>

                  <div className="w-full space-y-4">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <button
                            disabled={!qrString}
                            onClick={() => setIsDownloadOptionsOpen(!isDownloadOptionsOpen)}
                            className={cn(
                              "w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all shadow-lg",
                              qrString 
                                ? "bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-slate-200" 
                                : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                            )}
                          >
                            <Download size={20} />
                            {t.download}
                            <ChevronRight size={16} className={cn("ml-auto mr-2 transition-transform", isDownloadOptionsOpen && "rotate-90")} />
                          </button>

                          <AnimatePresence>
                            {isDownloadOptionsOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute bottom-full left-0 right-0 mb-3 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 p-2"
                              >
                                {(['png', 'svg', 'pdf'] as const).map((ext) => (
                                  <button
                                    key={ext}
                                    onClick={() => {
                                      setDownloadFormat(ext);
                                      // Execute download immediately for better UX
                                      setTimeout(() => {
                                        const fileName = `VietQR-${formData.accountNumber || 'template'}`;
                                        if (ext === 'pdf') {
                                          qrCode.getRawData('png').then(blob => {
                                            if (blob) {
                                              const reader = new FileReader();
                                              reader.onload = () => {
                                                const base64data = reader.result as string;
                                                const pdf = new jsPDF();
                                                pdf.addImage(base64data, 'PNG', 10, 10, 190, 190);
                                                pdf.save(`${fileName}.pdf`);
                                              };
                                              reader.readAsDataURL(blob);
                                            }
                                          });
                                        } else {
                                          qrCode.download({ name: fileName, extension: ext });
                                        }
                                        setIsDownloadOptionsOpen(false);
                                      }, 100);
                                    }}
                                    className={cn(
                                      "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                                      downloadFormat === ext ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                                    )}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] uppercase",
                                        ext === 'png' ? "bg-emerald-100 text-emerald-600" : 
                                        ext === 'svg' ? "bg-amber-100 text-amber-600" : 
                                        "bg-red-100 text-red-600"
                                      )}>
                                        {ext}
                                      </div>
                                      <span>{ext === 'pdf' ? 'PDF Document' : ext === 'svg' ? 'Vector SVG' : 'High Quality PNG'}</span>
                                    </div>
                                    {downloadFormat === ext && <Check size={16} />}
                                  </button>
                                ))}
                                <div className="mt-2 p-2 bg-slate-50 rounded-xl text-[10px] text-slate-400 text-center font-medium">
                                  {lang === 'vi' ? 'Chọn định dạng để tải về máy' : 'Select format to download'}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <button
                          disabled={!qrString}
                          onClick={copyQRString}
                          className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg border",
                            qrString 
                              ? "bg-white text-slate-700 hover:bg-slate-50 border-slate-200" 
                              : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                          )}
                          title={t.copy}
                        >
                          {copied ? <Check className="text-emerald-500" size={20} /> : <Copy size={20} />}
                        </button>
                      </div>
                    </div>
                </div>
              </div>
            </motion.div>
            
            <p className="mt-6 text-center text-xs text-slate-500 font-medium leading-relaxed italic">
              {t.warning}
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-12 bg-white border-top border-slate-100">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">QR</div>
              <span className="font-bold text-lg">{t.title}</span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              {t.footerDesc}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-tighter">{t.features.standard.title}</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-blue-600">{t.chooseBank}</a></li>
              <li><a href="#" className="hover:text-blue-600">{lang === 'vi' ? 'QR Thanh toán động' : 'Dynamic QR Payment'}</a></li>
              <li><a href="#" className="hover:text-blue-600">{lang === 'vi' ? 'Quản lý giao dịch' : 'Transaction Management'}</a></li>
              <li><a href="#" className="hover:text-blue-600">{lang === 'vi' ? 'Tích hợp Website' : 'Website Integration'}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-tighter">{lang === 'vi' ? 'Hỗ trợ' : 'Support'}</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-blue-600">{lang === 'vi' ? 'Câu hỏi thường gặp' : 'FAQ'}</a></li>
              <li><a href="#" className="hover:text-blue-600">{lang === 'vi' ? 'Hướng dẫn sử dụng' : 'User Guide'}</a></li>
              <li><a href="#" className="hover:text-blue-600">{lang === 'vi' ? 'Điều khoản dịch vụ' : 'Terms of Service'}</a></li>
              <li><a href="#" className="hover:text-blue-600">{lang === 'vi' ? 'Chính sách bảo mật' : 'Privacy Policy'}</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-top border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-medium">© 2026 {t.title}. Developed with AI Studio.</p>
          <div className="flex gap-6">
            <Globe className="text-slate-300 hover:text-blue-600 cursor-pointer transition-colors" size={18} />
          </div>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F8FAFC;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}</style>
    </div>
  );
}
