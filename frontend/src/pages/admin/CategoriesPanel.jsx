import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { EmptyState, ErrorState, InlineNotice } from '../../components/States';
import { useAsync } from '../../hooks/useAsync';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';
import { pickLang } from '../../context/i18n';

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

function CategoryForm({ category, categories, onClose }) {
  const { t, lang } = useStore();
  const isEdit = Boolean(category);
  const [form, setForm] = useState({
    name_ar: category?.name_ar || '',
    name_en: category?.name_en || '',
    slug: category?.slug || '',
    description_ar: category?.description_ar || '',
    description_en: category?.description_en || '',
    parent_id: category?.parent_id || '',
    is_active: category?.is_active ?? true,
  });
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState(null);

  const set = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const roots = categories.filter(
    (entry) => !entry.parent_id && entry.id !== category?.id
  );

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setFailure(null);
    const payload = {
      name_ar: form.name_ar.trim(),
      name_en: form.name_en.trim(),
      slug: form.slug.trim() || slugify(form.name_en),
      description_ar: form.description_ar.trim() || null,
      description_en: form.description_en.trim() || null,
      parent_id: form.parent_id ? Number(form.parent_id) : null,
      is_active: form.is_active,
    };
    try {
      if (isEdit) await api.categories.update(category.id, payload);
      else await api.categories.create(payload);
      onClose(true);
    } catch (error) {
      setFailure(error);
      setBusy(false);
    }
  };

  return (
    <form className="form-block" onSubmit={submit}>
      <h3>{isEdit ? t('edit') : t('newCategory')}</h3>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="cf-name-ar">{t('nameAr')}</label>
          <input
            id="cf-name-ar"
            required
            dir="rtl"
            value={form.name_ar}
            onChange={(event) => set('name_ar', event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="cf-name-en">{t('nameEn')}</label>
          <input
            id="cf-name-en"
            required
            dir="ltr"
            value={form.name_en}
            onChange={(event) => {
              set('name_en', event.target.value);
              if (!slugEdited) set('slug', slugify(event.target.value));
            }}
          />
        </div>
        <div className="field">
          <label htmlFor="cf-slug">{t('slug')}</label>
          <input
            id="cf-slug"
            required
            dir="ltr"
            value={form.slug}
            onChange={(event) => {
              setSlugEdited(true);
              set('slug', event.target.value);
            }}
          />
        </div>
        <div className="field">
          <label htmlFor="cf-parent">{t('parentCategory')}</label>
          <select
            id="cf-parent"
            value={form.parent_id}
            onChange={(event) => set('parent_id', event.target.value)}
          >
            <option value="">{t('noParent')}</option>
            {roots.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {pickLang(entry, 'name', lang)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <label className="check">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(event) => set('is_active', event.target.checked)}
        />
        {t('active')}
      </label>
      {failure ? <InlineNotice tone="error">{failure.message}</InlineNotice> : null}
      <div className="form-actions">
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? t('saving') : t('save')}
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          disabled={busy}
          onClick={() => onClose(false)}
        >
          {t('cancel')}
        </button>
      </div>
    </form>
  );
}

export default function CategoriesPanel() {
  const { t, lang } = useStore();
  const [editing, setEditing] = useState(null); // 'new' or a category object
  const [notice, setNotice] = useState(null);

  const categories = useAsync(({ signal }) => api.categories.list(false, { signal }), []);
  const items = categories.data || [];

  const removeCategory = async (category) => {
    if (!window.confirm(t('confirmDeleteCategory'))) return;
    setNotice(null);
    try {
      await api.categories.remove(category.id);
      if (editing && editing !== 'new' && editing.id === category.id) setEditing(null);
      categories.reload();
    } catch (error) {
      setNotice({ tone: 'error', text: error.message });
    }
  };

  const closeForm = (saved) => {
    setEditing(null);
    if (saved) {
      setNotice({ tone: 'info', text: t('saved') });
      categories.reload();
    }
  };

  return (
    <section className="panel">
      <div className="panel__head">
        <h2>{t('tabCategories')}</h2>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setEditing(editing === 'new' ? null : 'new')}
        >
          <Plus size={16} aria-hidden="true" />
          {t('newCategory')}
        </button>
      </div>

      {notice ? (
        <div className="mt-4">
          <InlineNotice tone={notice.tone}>{notice.text}</InlineNotice>
        </div>
      ) : null}

      {editing ? (
        <CategoryForm
          key={editing === 'new' ? 'new' : editing.id}
          category={editing === 'new' ? null : editing}
          categories={items}
          onClose={closeForm}
        />
      ) : null}

      {categories.error ? <ErrorState error={categories.error} onRetry={categories.reload} /> : null}
      {categories.loading ? <p className="small muted">{t('loading')}</p> : null}

      {!categories.loading && !categories.error && items.length === 0 ? (
        <EmptyState title={t('noCategories')} body={t('noCategoriesBody')} />
      ) : null}

      <div className="data-list">
        {items.map((category) => (
          <article className="data-row" key={category.id}>
            <div>
              <p className="data-row__title">
                {category.parent_id ? '— ' : ''}
                {pickLang(category, 'name', lang)}
              </p>
              <p className="data-row__meta">
                {pickLang(category, 'name', lang === 'ar' ? 'en' : 'ar')} — {category.slug}
              </p>
            </div>
            <div className="data-row__fields" />
            <div className="data-row__actions">
              <button
                type="button"
                className="icon-btn"
                onClick={() =>
                  setEditing(editing !== 'new' && editing?.id === category.id ? null : category)
                }
              >
                <Pencil size={17} aria-hidden="true" />
                <span className="sr-only">{t('edit')}</span>
              </button>
              <button type="button" className="icon-btn" onClick={() => removeCategory(category)}>
                <Trash2 size={17} aria-hidden="true" />
                <span className="sr-only">{t('delete')}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
