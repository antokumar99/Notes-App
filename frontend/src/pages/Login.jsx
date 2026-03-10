import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login, loading, error, isLoggedIn, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);

  useEffect(() => { if (isLoggedIn) navigate('/'); }, [isLoggedIn, navigate]);
  useEffect(() => { return () => clearError(); }, [clearError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form);
  };

  return (
    <div className="min-h-screen bg-[#0d0d14] flex">
      {/* left art panel */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] bg-[#0f0f1a] border-r border-white/5 p-12 overflow-hidden relative">
        {/* noise texture */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")'}} />

        {/* glow orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-ink-700/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 rounded-full bg-violet-900/15 blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <div className="w-9 h-9 rounded-xl bg-ink-600 flex items-center justify-center shadow-glow-ink mb-12">
            <span className="text-white font-bold font-mono text-sm">I</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-[1.15] mb-4">
            Think freely.<br />
            <span className="text-ink-400">Write deeply.</span>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Inkwell is a focused notes workspace designed for ideas, tasks, and everything in between.
          </p>
        </div>

        {/* quote card */}
        <div className="relative z-10 bg-white/4 border border-white/6 rounded-2xl p-5">
          <p className="text-white/60 text-sm italic leading-relaxed mb-3">
            "The palest ink is better than the best memory."
          </p>
          <p className="text-white/30 text-xs">— Chinese proverb</p>
        </div>
      </div>

      {/* right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-xl bg-ink-600 flex items-center justify-center">
              <span className="text-white font-bold font-mono text-sm">I</span>
            </div>
            <span className="text-white font-semibold">Inkwell</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-white/40 text-sm mb-8">Sign in to your workspace</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full h-11 bg-white/5 border border-white/8 focus:border-ink-500/60 focus:bg-white/[0.07] rounded-xl px-4 text-sm text-white placeholder-white/20 outline-none transition-all focus:shadow-glow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full h-11 bg-white/5 border border-white/8 focus:border-ink-500/60 focus:bg-white/[0.07] rounded-xl px-4 pr-10 text-sm text-white placeholder-white/20 outline-none transition-all focus:shadow-glow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-ink-600 hover:bg-ink-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all hover:shadow-glow-ink active:scale-[0.98]"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-white/35 mt-6">
            No account?{' '}
            <Link to="/register" className="text-ink-400 hover:text-ink-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}