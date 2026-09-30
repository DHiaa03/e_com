import { useState } from 'react';
import { InlineNotice } from '../../components/States';
import { useAsync } from '../../hooks/useAsync';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';
import { formatDate } from '../../context/i18n';

export default function AccountPanel() {
  const { t, lang } = useStore();
  const profile = useAsync(({ signal }) => api.admin.profile({ signal }), []);
  const [form, setForm] = useState({ old_password: '', new_password: '' });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      await api.admin.changePassword(form.old_password, form.new_password);
      setForm({ old_password: '', new_password: '' });
      setNotice({ tone: 'info', text: t('passwordUpdated') });
    } catch (error) {
      setNotice({ tone: 'error', text: error.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel">
      <div className="panel__head">
        <h2>{t('accountTitle')}</h2>
      </div>

      {profile.data ? (
        <div className="stack">
          <div className="data-pair">
            <dt>{t('accountSignedInAs')}</dt>
            <dd className="strong">{profile.data.email}</dd>
          </div>
          {profile.data.full_name ? (
            <div className="data-pair">
              <dt>{t('fullName')}</dt>
              <dd>{profile.data.full_name}</dd>
            </div>
          ) : null}
          <div className="data-pair">
            <dt>{t('memberSince')}</dt>
            <dd>{formatDate(profile.data.created_at, lang)}</dd>
          </div>
        </div>
      ) : (
        <p className="small muted">{t('loading')}</p>
      )}

      <form className="form-block mt-5" onSubmit={submit}>
        <h3>{t('changePassword')}</h3>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="ac-old">{t('oldPassword')}</label>
            <input
              id="ac-old"
              type="password"
              required
              autoComplete="current-password"
              value={form.old_password}
              onChange={(event) => setForm({ ...form, old_password: event.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="ac-new">{t('newPassword')}</label>
            <input
              id="ac-new"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={form.new_password}
              onChange={(event) => setForm({ ...form, new_password: event.target.value })}
            />
          </div>
        </div>
        {notice ? <InlineNotice tone={notice.tone}>{notice.text}</InlineNotice> : null}
        <div className="form-actions">
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? t('saving') : t('updatePassword')}
          </button>
        </div>
      </form>
    </section>
  );
}
