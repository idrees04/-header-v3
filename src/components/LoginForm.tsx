import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { LogIn, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { getAllRoleNames } from '@/config/menuConfig';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const roles = getAllRoleNames();

  useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0]);
    }
  }, [roles, selectedRole]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!username.trim()) {
        setError('Username is required');
        return;
      }
      setError('');
      setLoading(true);
      try {
        await login(username.trim(), selectedRole);
        navigate({ to: '/dashboard' });
      } catch {
        setError('Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [username, selectedRole, login, navigate]
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-login-bg px-4">
      {/* Subtle floating orb */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.15, 0.25, 0.15] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="pointer-events-none absolute h-72 w-72 rounded-full bg-primary/20 blur-3xl"
        style={{ top: '15%', left: '55%' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl bg-login-card p-8 shadow-2xl shadow-primary/10 ring-1 ring-border/50">
          <div className="mb-8 text-center">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 12 }}
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30"
            >
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </motion.div>
            <h1 className="text-2xl font-bold text-login-card-fg">IGEC Portal</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-login-card-fg">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-ring/20 focus:shadow-md focus:shadow-primary/5"
              />
            </div>

            <div>
              <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-login-card-fg">
                Role
              </label>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-ring/20 focus:shadow-md focus:shadow-primary/5"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-60"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent"
                />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Tip: Use &quot;admin&quot; as username for the special user avatar
          </p>
        </div>
      </motion.div>
    </div>
  );
}
