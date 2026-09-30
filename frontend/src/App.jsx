import { Route, Routes, useLocation } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';
import { useStore } from './context/StoreContext';

export default function App() {
  const location = useLocation();
  const { t } = useStore();
  const isAdminArea = location.pathname.startsWith('/admin');
  const isHome = location.pathname === '/';

  return (
    <div className="site">
      {!isAdminArea ? (
        <>
          <a className="skip-link" href="#main">
            {t('skipToContent')}
          </a>
          <SiteHeader />
        </>
      ) : null}

      <main id="main" className={`site-main${isHome ? ' site-main--flush' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAdminArea ? <SiteFooter /> : null}
    </div>
  );
}
