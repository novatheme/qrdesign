import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Book, Shield, Zap, Globe, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SupportDocs = () => {
    const sections = [
        {
            id: "onboarding",
            title: "Getting Started",
            icon: Zap,
            content: "Learn how to onboard your business to the VietQR Gateway. Our automated verification system takes less than 24 hours to activate your settlement endpoints."
        },
        {
            id: "api",
            title: "API Integration",
            icon: Globe,
            content: "Connect your existing ERP or webshop using our standard REST API. We support webhook callbacks for both staging and production environments."
        },
        {
            id: "security",
            title: "Security & Compliance",
            icon: Shield,
            content: "All transactions are secured using EMVCo standards. We utilize multi-regional node clusters to ensure 99.99% uptime for payment link generation."
        },
        {
            id: "legal",
            title: "Legal & Privacy",
            icon: Book,
            content: "Information about our terms of service, merchant agreements, and how we protect your transaction data in accordance with local banking regulations."
        },
        {
            id: "accounts",
            title: "Account Access",
            icon: User,
            content: "Need help accessing your account? Contact our security operations team at security@vietqr.gateway for credential recovery and 2FA resets."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <nav className="p-8 max-w-7xl mx-auto flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-md z-50">
                <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-black transition-colors font-bold text-sm">
                    <ArrowLeft size={16} /> Back to Gateway
                </Link>
                <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <a href="#onboarding" className="hover:text-blue-600 transition-colors">Onboarding</a>
                    <a href="#api" className="hover:text-blue-600 transition-colors">API</a>
                    <a href="#security" className="hover:text-blue-600 transition-colors">Security</a>
                    <a href="#legal" className="hover:text-blue-600 transition-colors">Legal</a>
                    <a href="#accounts" className="hover:text-blue-600 transition-colors">Accounts</a>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-8 py-20 pb-40">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="w-16 h-16 bg-blue-600 rounded-[20px] flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-500/20">
                        <Book size={32} />
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Support & Resources</h1>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed mb-16">
                        Everything you need to integrate, manage, and scale your VietQR payment infrastructure.
                    </p>

                    <div className="space-y-12">
                        {sections.map((section, i) => (
                            <div key={i} id={section.id} className="group p-8 bg-white border border-slate-200 rounded-[32px] hover:border-blue-500 transition-all shadow-sm scroll-mt-32">
                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <section.icon size={24} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-black text-slate-900 mb-2">{section.title}</h3>
                                        <p className="text-slate-500 font-medium leading-relaxed">{section.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 p-10 bg-slate-900 rounded-[40px] text-white overflow-hidden relative group">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black tracking-tight mb-4">Need personalized assistance?</h2>
                            <p className="text-slate-400 font-medium mb-8">Our engineering team is available 24/7 for critical infrastructure support.</p>
                            <button className="px-8 h-12 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Contact Developer Ops</button>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full filter blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2" />
                    </div>
                </motion.div>
            </main>
        </div>
    );
};
