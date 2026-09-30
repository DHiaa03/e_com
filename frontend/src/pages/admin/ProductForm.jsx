import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { InlineNotice } from '../../components/States';
import { useStore } from '../../context/StoreContext';
import { api, mediaUrl } from '../../services/api';
import { pickLang } from '../../context/i18n';

let tempId = -1;

/** Lowercase latin slug from a product name. */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

function emptyVariant() {
  return {
    id: tempId--,
    isNew: true,
    size: '',
    color: '',
    color_code: '',
    sku: '',
    additional_price: '',
    stock_quantity: '',
    is_active: true,
  };
}

function variantPayload(variant) {
  return {
    size: variant.size || null,
    color: variant.color || null,
    color_code: variant.color_code || null,
    sku: variant.sku || null,
    additional_price: Number(variant.additional_price) || 0,
    stock_quantity: Math.max(0, Number.parseInt(variant.stock_quantity, 10) || 0),
    is_active: Boolean(variant.is_active),
  };
}

export default function ProductForm({ product, categories, onClose }) {
  const { t, lang } = useStore();
  const isEdit = Boolean(product);
  const [form, setForm] = useState({
    name_ar: product?.name_ar || '',
    name_en: product?.name_en || '',
    slug: product?.slug || '',
    description_ar: product?.description_ar || '',
    description_en: product?.description_en || '',
    base_price: product?.base_price ?? '',
    discount_price: product?.discount_price ?? '',
    is_on_sale: product?.is_on_sale || false,
    is_featured: product?.is_featured || false,
    is_active: product?.is_active ?? true,
    gender_section: product?.gender_section || 'men',
    category_id: product?.category_id || '',
  });
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [variants, setVariants] = useState(() => (product?.variants || []).map((v) => ({ ...v })));
  const [images, setImages] = useState(product?.images || []);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState(null);

  const set = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const onNameEn = (value) => {
    set('name_en', value);
    if (!slugEdited) set('slug', slugify(value));
  };

  const setVariant = (id, field, value) =>
    setVariants((current) =>
      current.map((variant) => (variant.id === id ? { ...variant, [field]: value } : variant))
    );

  const removeVariant = async (variant) => {
    if (!variant.isNew) {
      try {
        await api.products.removeVariant(variant.id);
      } catch (error) {
        setFailure(error);
        return;
      }
    }
    setVariants((current) => current.filter((entry) => entry.id !== variant.id));
  };

  const uploadFiles = async (productId, files, hasImages) => {
    const uploaded = [];
    for (let index = 0; index < files.length; index += 1) {
      const data = new FormData();
      data.append('file', files[index]);
      data.append('is_primary', !hasImages && index === 0 ? 'true' : 'false');
      data.append('sort_order', String(images.length + index));
      // eslint-disable-next-line no-await-in-loop
      uploaded.push(await api.images.upload(productId, data));
    }
    return uploaded;
  };

  const onPickFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;
    setFailure(null);
    if (!isEdit) {
      setPendingFiles((current) => [...current, ...files]);
      return;
    }
    setBusy(true);
    try {
      const uploaded = await uploadFiles(product.id, files, images.length > 0);
      setImages((current) => [...current, ...uploaded]);
    } catch (error) {
      setFailure(error);
    } finally {
      setBusy(false);
    }
  };

  const removeImage = async (image) => {
    try {
      await api.images.remove(image.id);
      setImages((current) => current.filter((entry) => entry.id !== image.id));
    } catch (error) {
      setFailure(error);
    }
  };

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
      base_price: Number(form.base_price) || 0,
      discount_price: form.discount_price === '' ? null : Number(form.discount_price),
      is_on_sale: form.is_on_sale,
      is_featured: form.is_featured,
      is_active: form.is_active,
      gender_section: form.gender_section,
      category_id: Number(form.category_id),
    };
    try {
      if (isEdit) {
        await api.products.update(product.id, payload);
        for (const variant of variants) {
          // eslint-disable-next-line no-await-in-loop
          if (variant.isNew) await api.products.addVariant(product.id, variantPayload(variant));
          // eslint-disable-next-line no-await-in-loop
          else await api.products.updateVariant(variant.id, variantPayload(variant));
        }
      } else {
        const created = await api.products.create({
          ...payload,
          variants: variants.filter((v) => v.size || v.color).map(variantPayload),
        });
        if (pendingFiles.length) await uploadFiles(created.id, pendingFiles, false);
      }
      onClose(true);
    } catch (error) {
      setFailure(error);
      setBusy(false);
    }
  };

  return (
    <form className="form-block" onSubmit={submit}>
      <h3>{isEdit ? t('editProductTitle') : t('createProductTitle')}</h3>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="pf-name-ar">{t('nameAr')}</label>
          <input
            id="pf-name-ar"
            required
            dir="rtl"
            value={form.name_ar}
            onChange={(event) => set('name_ar', event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="pf-name-en">{t('nameEn')}</label>
          <input
            id="pf-name-en"
            required
            dir="ltr"
            value={form.name_en}
            onChange={(event) => onNameEn(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="pf-slug">{t('slug')}</label>
          <input
            id="pf-slug"
            required
            dir="ltr"
            value={form.slug}
            aria-describedby="pf-slug-hint"
            onChange={(event) => {
              setSlugEdited(true);
              set('slug', event.target.value);
            }}
          />
          <small className="label" id="pf-slug-hint">
            {t('slugHint')}
          </small>
        </div>
        <div className="field">
          <label htmlFor="pf-category">{t('category')}</label>
          <select
            id="pf-category"
            required
            value={form.category_id}
            onChange={(event) => set('category_id', event.target.value)}
          >
            <option value="" disabled>
              —
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {pickLang(category, 'name', lang)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="pf-section">{t('section')}</label>
          <select
            id="pf-section"
            value={form.gender_section}
            onChange={(event) => set('gender_section', event.target.value)}
          >
            <option value="men">{t('stateMen')}</option>
            <option value="women">{t('stateWomen')}</option>
            <option value="unisex">{t('sectionUnisex')}</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="pf-base-price">{t('basePrice')}</label>
          <input
            id="pf-base-price"
            required
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={form.base_price}
            onChange={(event) => set('base_price', event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="pf-discount-price">{t('discountPrice')}</label>
          <input
            id="pf-discount-price"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={form.discount_price ?? ''}
            onChange={(event) => set('discount_price', event.target.value)}
          />
        </div>
        <div className="field form-grid__full">
          <label htmlFor="pf-desc-ar">{t('descriptionAr')}</label>
          <textarea
            id="pf-desc-ar"
            rows={3}
            dir="rtl"
            value={form.description_ar}
            onChange={(event) => set('description_ar', event.target.value)}
          />
        </div>
        <div className="field form-grid__full">
          <label htmlFor="pf-desc-en">{t('descriptionEn')}</label>
          <textarea
            id="pf-desc-en"
            rows={3}
            dir="ltr"
            value={form.description_en}
            onChange={(event) => set('description_en', event.target.value)}
          />
        </div>
      </div>

      <div className="row">
        <label className="check">
          <input
            type="checkbox"
            checked={form.is_on_sale}
            onChange={(event) => set('is_on_sale', event.target.checked)}
          />
          {t('onSale')}
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(event) => set('is_featured', event.target.checked)}
          />
          {t('featured')}
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(event) => set('is_active', event.target.checked)}
          />
          {t('active')}
        </label>
      </div>

      <div className="stack">
        <h4>{t('images')}</h4>
        <div className="uploader">
          <div className="uploader__row">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              multiple
              aria-label={t('uploadImage')}
              onChange={onPickFiles}
            />
          </div>
          {pendingFiles.length > 0 ? (
            <p className="small muted">{pendingFiles.map((file) => file.name).join('، ')}</p>
          ) : null}
          {images.length ? (
            <div className="thumbs">
              {images.map((image) => (
                <figure
                  key={image.id}
                  className={`thumb-card${image.is_primary ? ' thumb-card--primary' : ''}`}
                >
                  <img src={mediaUrl(image.image_url)} alt={image.alt_text || ''} />
                  <figcaption className="thumb-card__bar">
                    <span>{image.is_primary ? t('imagePrimary') : `#${image.sort_order}`}</span>
                    <button type="button" className="icon-btn" onClick={() => removeImage(image)}>
                      <Trash2 size={15} aria-hidden="true" />
                      <span className="sr-only">{t('deleteImage')}</span>
                    </button>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <p className="small muted">{t('noImages')}</p>
          )}
        </div>
      </div>

      <div className="stack">
        <h4>{t('variants')}</h4>
        {variants.length ? (
          <div className="variant-list">
            {variants.map((variant) => (
              <div className="variant-edit" key={variant.id}>
                <div className="variant-edit__fields">
                  <div className="field">
                    <label htmlFor={`pf-size-${variant.id}`}>{t('size')}</label>
                    <input
                      id={`pf-size-${variant.id}`}
                      value={variant.size || ''}
                      onChange={(event) => setVariant(variant.id, 'size', event.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={`pf-color-${variant.id}`}>{t('color')}</label>
                    <input
                      id={`pf-color-${variant.id}`}
                      value={variant.color || ''}
                      onChange={(event) => setVariant(variant.id, 'color', event.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={`pf-stock-${variant.id}`}>{t('variantStock')}</label>
                    <input
                      id={`pf-stock-${variant.id}`}
                      type="number"
                      min="0"
                      inputMode="numeric"
                      value={variant.stock_quantity}
                      onChange={(event) =>
                        setVariant(variant.id, 'stock_quantity', event.target.value)
                      }
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={`pf-extra-${variant.id}`}>{t('variantExtra')}</label>
                    <input
                      id={`pf-extra-${variant.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={variant.additional_price}
                      onChange={(event) =>
                        setVariant(variant.id, 'additional_price', event.target.value)
                      }
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={`pf-sku-${variant.id}`}>{t('variantSku')}</label>
                    <input
                      id={`pf-sku-${variant.id}`}
                      dir="ltr"
                      value={variant.sku || ''}
                      onChange={(event) => setVariant(variant.id, 'sku', event.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={`pf-code-${variant.id}`}>{t('colorCode')}</label>
                    <input
                      id={`pf-code-${variant.id}`}
                      dir="ltr"
                      value={variant.color_code || ''}
                      onChange={(event) =>
                        setVariant(variant.id, 'color_code', event.target.value)
                      }
                    />
                  </div>
                </div>
                <button type="button" className="icon-btn" onClick={() => removeVariant(variant)}>
                  <Trash2 size={16} aria-hidden="true" />
                  <span className="sr-only">{t('delete')}</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="small muted">{t('noVariants')}</p>
        )}
        <div>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setVariants((current) => [...current, emptyVariant()])}
          >
            <Plus size={16} aria-hidden="true" />
            {t('addVariant')}
          </button>
        </div>
      </div>

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
