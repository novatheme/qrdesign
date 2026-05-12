import React, { useState, useEffect } from 'react';
import { Landmark, Plus, Trash2, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';

export const BankAccountManager = () => {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [banks, setBanks] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    
    const [newAccount, setNewAccount] = useState({
        bankCode: '',
        accountNumber: '',
        accountName: ''
    });

    useEffect(() => {
        fetchAccounts();
        api.get('/banks').then(res => setBanks(res.data.data || []));
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await api.get('/merchant/banks');
            setAccounts(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/merchant/banks', newAccount);
            setIsAdding(false);
            setNewAccount({ bankCode: '', accountNumber: '', accountName: '' });
            fetchAccounts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this account?')) return;
        try {
            await api.delete(`/merchant/banks/${id}`);
            fetchAccounts();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-slate-300" /></div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Withdrawal & Settlement</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Manage destination bank accounts</p>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                >
                    <Plus size={14} /> Add Account
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                    {isAdding && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-3xl p-8"
                        >
                            <form onSubmit={handleAdd} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block">Provider BIN</label>
                                    <select 
                                        required
                                        className="w-full h-12 bg-white border border-blue-200 rounded-xl px-4 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                                        value={newAccount.bankCode}
                                        onChange={e => setNewAccount({...newAccount, bankCode: e.target.value})}
                                    >
                                        <option value="">Select Bank</option>
                                        {banks.map(b => <option key={b.bin} value={b.bin}>{b.shortName} - {b.name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block">Account Number</label>
                                        <input 
                                            required
                                            type="text" 
                                            className="w-full h-12 bg-white border border-blue-200 rounded-xl px-4 text-sm font-mono font-bold"
                                            value={newAccount.accountNumber}
                                            onChange={e => setNewAccount({...newAccount, accountNumber: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block">Account Holder</label>
                                        <input 
                                            required
                                            type="text" 
                                            className="w-full h-12 bg-white border border-blue-200 rounded-xl px-4 text-sm font-black uppercase placeholder:normal-case"
                                            placeholder="FULL NAME"
                                            value={newAccount.accountName}
                                            onChange={e => setNewAccount({...newAccount, accountName: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="submit" className="flex-1 h-12 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Submit Protocol</button>
                                    <button type="button" onClick={() => setIsAdding(false)} className="px-6 h-12 bg-white border border-blue-200 text-blue-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-all">Cancel</button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {accounts.map((acc, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={acc.id}
                        className="bg-white border border-slate-200 p-8 rounded-[32px] group relative hover:border-blue-500 transition-all shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
                    >
                        <div className="flex items-start justify-between mb-8">
                            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:text-blue-500 transition-colors">
                                <Landmark size={24} />
                            </div>
                            <div className="flex items-center gap-2">
                                {acc.isDefault && <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded tracking-widest uppercase">Default</span>}
                                <button 
                                    onClick={() => handleDelete(acc.id)}
                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Connected Account</p>
                            <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{acc.accountName.toUpperCase()}</h3>
                            <p className="text-xl font-mono font-black text-slate-600 tracking-tight mt-1">{acc.accountNumber}</p>
                            <div className="flex items-center gap-2 mt-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                                <ShieldCheck size={12} className="text-emerald-500" />
                                Verified Endpoint • BIN {acc.bankCode}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {accounts.length === 0 && !isAdding && (
                    <div className="md:col-span-2 border-2 border-dashed border-slate-200 rounded-[32px] p-20 text-center text-slate-400">
                        <AlertCircle className="mx-auto mb-4 opacity-20" size={48} />
                        <p className="text-sm font-bold uppercase tracking-widest">No settlement endpoints configured</p>
                        <p className="text-xs font-medium mt-2">Add a bank account to receive automated settlements.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
