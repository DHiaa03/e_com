import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useTitle } from '../hooks/useTitle';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';

export default function AdminLogin() {
  const { t, isAdmin, signIn } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState(null);

  useTitle(t('adminLoginTitle'));

  if (isAdmin) return <Navigate to="/admin" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setFailure(null);
    try {
      const data = await api.auth.login(email.trim(), password);
      signIn(data.access_token);
      navigate('/admin', { replace: true });
    } catch (error) {
      setFailure(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={submit}>
        <div className="login-card__brand">
          <img src="/assets/logo.png" alt="" width="40" height="40" />
          <span className="strong">{t('brandName')}</span>
        </div>

        <div className="stack">
          <h1 className="page__title">{t('adminLoginTitle')}</h1>
          <p className="small muted">{t('adminLoginIntro')}</p>
        </div>

        <div className="field">
          <label htmlFor="admin-email">{t('adminEmail')}</label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="admin-password">{t('adminPassword')}</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {failure ? (
          <div className="notice notice--error" role="alert">
            {failure}
          </div>
        ) : null}

        <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={busy}>
          {busy ? t('adminSigningIn') : t('adminSignIn')}
        </button>

        <Link className="btn btn--quiet" to="/">
          {t('adminViewStore')}
        </Link>
      </form>
    </div>
  );
}
