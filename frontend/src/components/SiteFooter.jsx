import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function SiteFooter() {
  const { t } = useStore();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <img
              className="site-footer__mark"
              src="/assets/logo.png"
              alt=""
              width="34"
              height="34"
            />
            <span className="strong">{t('brandName')}</span>
            <p className="small muted">{t('brandLine')}</p>
          </div>

          <nav className="site-footer__col" aria-label={t('navStore')}>
            <h3>{t('navStore')}</h3>
            <Link to="/catalog">{t('navStore')}</Link>
            <Link to="/catalog?section=men">{t('navMen')}</Link>
            <Link to="/catalog?section=women">{t('navWomen')}</Link>
            <Link to="/catalog?featured=true">{t('navNew')}</Link>
            <Link to="/catalog?sale=true">{t('navSale')}</Link>
          </nav>

          <div className="site-footer__col">
            <h3>{t('trustCodTitle')}</h3>
            <p className="small">{t('trustCodBody')}</p>
            <p className="small">{t('trustDeliveryBody')}</p>
            <Link to="/admin">{t('navAdmin')}</Link>
          </div>
        </div>

        <div className="site-footer__legal">
          <span>
            © {year} {t('brandName')}
          </span>
          <span>{t('paidOnDelivery')}</span>
        </div>
      </div>
    </footer>
  );
}
