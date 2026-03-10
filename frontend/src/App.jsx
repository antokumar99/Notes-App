import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import Dashboard  from './pages/Dashboard';
import NoteDetail from './pages/NoteDetail';
import Login      from './pages/Login';
import Register   from './pages/Register';

/* ── guards ──────────────────────────────────────────────────────── */
function PrivateRoute({ children }) {
  const { isLoggedIn, initialized } = useAuth();
  if (!initialized) return (
    <div className="min-h-screen bg-[#0d0d14] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-ink-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/" replace /> : children;
}

/* ── App ─────────────────────────────────────────────────────────── */
export default function App() {
  const { token, refreshMe } = useAuth();

  // Attempt to rehydrate session on first load
  useEffect(() => {
    if (token) refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for global auth:expired event from axiosInstance
  useEffect(() => {
    const handler = () => window.location.replace('/login');
    window.addEventListener('auth:expired', handler);
    return () => window.removeEventListener('auth:expired', handler);
  }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a28',
            color: '#e2e2f0',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '0.875rem',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#1a1a28' } },
          error:   { iconTheme: { primary: '#f43f5e', secondary: '#1a1a28' } },
        }}
      />
      <Routes>
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/notes/:id" element={<PrivateRoute><NoteDetail /></PrivateRoute>} />
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}