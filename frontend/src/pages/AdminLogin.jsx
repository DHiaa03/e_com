import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const { lang, t, loginAdmin } = useStore();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.loginAdmin(email.trim(), password);
      loginAdmin(data.access_token);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center px-4 py-20">
      <div className="glass-panel max-w-md w-full p-8 md:p-10 rounded-2xl border border-white/10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <img src="/assets/logo.png" alt="BLACK ELEGANCE" className="h-14 w-auto mx-auto object-contain" />
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider">
            {t('adminLoginTitle')}
          </h1>
          <p className="text-xs text-gray-400">
            {lang === 'ar' ? 'سجّل الدخول بحساب الأدمن لإدارة المتجر والطلبات' : 'Sign in with administrator credentials'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              {t('adminEmail')}
            </label>
            <div className="relative">
              <Mail className="absolute top-3.5 start-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@blackelegance.com"
                className="glass-input ps-10 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              {t('adminPassword')}
            </label>
            <div className="relative">
              <Lock className="absolute top-3.5 start-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="glass-input ps-10 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="gold-button w-full py-3.5 text-sm font-semibold mt-2"
          >
            {loading ? (
              <span>{t('loading')}</span>
            ) : (
              <>
                <span>{t('loginBtn')}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            {lang === 'ar' ? 'العودة لواجهة المتجر' : 'Return to Storefront'}
          </button>
        </div>
      </div>
    </div>
  );
}
