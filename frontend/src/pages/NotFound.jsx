import { Link } from 'react-router-dom';
import { useTitle } from '../hooks/useTitle';
import { useStore } from '../context/StoreContext';

export default function NotFound() {
  const { t } = useStore();
  useTitle(t('loadFailedTitle'));

  return (
    <div className="shell page">
      <div className="state">
        <h3>{t('productGoneTitle')}</h3>
        <p>{t('productGoneBody')}</p>
        <Link className="btn btn--primary" to="/catalog">
          {t('browseStore')}
        </Link>
      </div>
    </div>
  );
}
