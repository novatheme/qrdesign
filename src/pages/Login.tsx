import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuthStore } from '../lib/store';
import api from '../lib/api';
import { LogIn, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('merchant@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.data.merchant, res.data.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-500" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] z-10"
      >
        <div className="text-center mb-10">
            <div className="w-14 h-14 bg-black rounded-2xl mx-auto flex items-center justify-center text-white mb-6 shadow-2xl shadow-black/20">
                <ShieldCheck size={28} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Merchant Access</h1>
            <p className="text-slate-400 mt-2 font-semibold text-sm">Secure login to your VietQR dashboard</p>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2 ml-1">Business Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 h-13 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-semibold"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block">Password</label>
                <a href="#" className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest hover:text-blue-700">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 h-13 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-semibold"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-red-600 text-xs font-bold text-center bg-red-50 border border-red-100 py-3 rounded-xl"
                >
                    {error}
                </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-13 bg-black hover:bg-slate-800 text-white rounded-xl font-extrabold shadow-xl shadow-black/10 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <footer className="pt-6 border-t border-slate-100">
            <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                Protected by VietQR Security Systems
            </p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};
