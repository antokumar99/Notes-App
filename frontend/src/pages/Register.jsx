import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Check } from 'lucide-react';

const PwCheck = ({ ok, label }) => (
  <span className={`flex items-center gap-1 text-xs ${ok ? 'text-emerald-400' : 'text-white/30'}`}>
    <Check size={11} className={ok ? 'opacity-100' : 'opacity-0'} /> {label}
  </span>
);

export default function Register() {
  const { register: registerUser, loading, error, isLoggedIn, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [localErr, setLocalErr] = useState('');

  useEffect(() => { if (isLoggedIn) navigate('/'); }, [isLoggedIn, navigate]);
  useEffect(() => { return () => clearError(); }, [clearError]);

  const pw = form.password;
  const checks = {
    length:  pw.length >= 6,
    upper:   /[A-Z]/.test(pw),
    number:  /\d/.test(pw),
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalErr('');
    clearError();
    if (pw !== form.confirm) return setLocalErr('Passwords do not match');
    if (!checks.length) return setLocalErr('Password must be at least 6 characters');
    registerUser({ name: form.name, email: form.email, password: pw });
  };

  const displayErr = localErr || error;

  return (
    <div className="min-h-screen bg-[#0d0d14] flex">
      {/* left art */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] bg-[#0f0f1a] border-r border-white/5 p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-ink-900/30 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-pink-900/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <div className="w-9 h-9 rounded-xl bg-ink-600 flex items-center justify-center shadow-glow-ink mb-12">
            <span className="text-white font-bold font-mono text-sm">I</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-[1.15] mb-4">
            Start your<br />
            <span className="text-ink-400">story here.</span>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Capture every idea, every task, every thought — all in one beautiful, distraction-free space.
          </p>
        </div>

        {/* feature pills */}
        <div className="relative z-10 space-y-3">
          {['Rich text & checklists', 'Tags & smart filtering', 'Pin, archive & organise', 'Full-text search'].map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-ink-600/40 border border-ink-500/30 flex items-center justify-center">
                <Check size={10} className="text-ink-400" />
              </div>
              <span className="text-white/50 text-sm">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-xl bg-ink-600 flex items-center justify-center">
              <span className="text-white font-bold font-mono text-sm">I</span>
            </div>
            <span className="text-white font-semibold">Inkwell</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
          <p className="text-white/40 text-sm mb-8">Set up your free workspace</p>

          {displayErr && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
              {displayErr}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name',  label: 'Full name',  type: 'text',     placeholder: 'Jane Doe' },
              { key: 'email', label: 'Email',       type: 'email',    placeholder: 'you@example.com' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2">{label}</label>
                <input
                  type={type}
                  required
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full h-11 bg-white/5 border border-white/8 focus:border-ink-500/60 rounded-xl px-4 text-sm text-white placeholder-white/20 outline-none transition-all focus:shadow-glow-sm"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={pw}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 6 characters"
                  className="w-full h-11 bg-white/5 border border-white/8 focus:border-ink-500/60 rounded-xl px-4 pr-10 text-sm text-white placeholder-white/20 outline-none transition-all focus:shadow-glow-sm"
                />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {pw && (
                <div className="flex gap-3 mt-2 flex-wrap">
                  <PwCheck ok={checks.length} label="6+ chars" />
                  <PwCheck ok={checks.upper}  label="Uppercase" />
                  <PwCheck ok={checks.number} label="Number" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2">Confirm password</label>
              <input
                type="password"
                required
                value={form.confirm}
                onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                placeholder="Repeat password"
                className="w-full h-11 bg-white/5 border border-white/8 focus:border-ink-500/60 rounded-xl px-4 text-sm text-white placeholder-white/20 outline-none transition-all focus:shadow-glow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-ink-600 hover:bg-ink-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all hover:shadow-glow-ink active:scale-[0.98]"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-white/35 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-ink-400 hover:text-ink-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}