import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  ListOrdered,
  LogOut,
  Bell,
  Plus,
  Trash2,
  CheckCircle,
  TrendingUp,
  Clock,
  PackageCheck,
  RefreshCw,
  X
} from 'lucide-react';

export default function AdminDashboard() {
  const { lang, t, isAdminLoggedIn, logoutAdmin } = useStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'categories'
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrderAlert, setNewOrderAlert] = useState(false);

  // New Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProductData, setNewProductData] = useState({
    name_ar: '',
    name_en: '',
    slug: '',
    description_ar: '',
    description_en: '',
    base_price: '',
    discount_price: '',
    gender_section: 'men',
    category_id: '',
    is_on_sale: false,
    is_featured: false
  });

  // New Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatData, setNewCatData] = useState({
    name_ar: '',
    name_en: '',
    slug: '',
    parent_id: ''
  });

  // Protection
  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
    }
  }, [isAdminLoggedIn, navigate]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes, catsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminOrders({ limit: 50 }),
        api.getProducts({ limit: 100 }),
        api.getCategories(false)
      ]);
      setStats(statsRes);
      setOrders(ordersRes.items || []);
      setProducts(productsRes.items || []);
      setCategories(catsRes || []);

      // Check if there are any pending orders for internal notification
      const hasPending = (ordersRes.items || []).some((o) => o.status === 'pending');
      setNewOrderAlert(hasPending);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
      if (err.message.includes('credentials') || err.message.includes('401')) {
        logoutAdmin();
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAllData();
      // Optional polling for live dashboard updates every 30s
      const interval = setInterval(loadAllData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdminLoggedIn]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      // Reload stats
      const statsRes = await api.getAdminStats();
      setStats(statsRes);
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.createProduct({
        ...newProductData,
        base_price: parseFloat(newProductData.base_price),
        discount_price: newProductData.discount_price ? parseFloat(newProductData.discount_price) : null,
        category_id: parseInt(newProductData.category_id)
      });
      setShowProductModal(false);
      setNewProductData({
        name_ar: '',
        name_en: '',
        slug: '',
        description_ar: '',
        description_en: '',
        base_price: '',
        discount_price: '',
        gender_section: 'men',
        category_id: '',
        is_on_sale: false,
        is_featured: false
      });
      loadAllData();
    } catch (err) {
      alert(err.message || 'Failed to create product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Delete this product?')) {
      try {
        await api.deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        alert(err.message || 'Failed to delete');
      }
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.createCategory({
        ...newCatData,
        parent_id: newCatData.parent_id ? parseInt(newCatData.parent_id) : null
      });
      setShowCategoryModal(false);
      setNewCatData({ name_ar: '', name_en: '', slug: '', parent_id: '' });
      loadAllData();
    } catch (err) {
      alert(err.message || 'Failed to create category');
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Logo" className="h-10 w-auto" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wider">
                {t('adminDashboard')}
              </h1>
              <p className="text-xs text-[#c5a059]">
                {lang === 'ar' ? 'إدارة متجر BLACK ELEGANCE' : 'BLACK ELEGANCE Store Management'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={loadAllData}
              className="p-2 text-gray-400 hover:text-white rounded-lg border border-white/10 hover:bg-white/5"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                logoutAdmin();
                navigate('/admin/login');
              }}
              className="glass-outline-button text-xs py-2 px-4 hover:border-red-500 hover:text-red-400"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>

        {/* Live Notification for New Orders */}
        {newOrderAlert && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-amber-400" />
              <span className="font-semibold">{t('newOrderAlert')}</span>
            </div>
            <span className="text-xs bg-amber-400 text-black font-bold px-2 py-0.5 rounded">
              {orders.filter((o) => o.status === 'pending').length} {lang === 'ar' ? 'طلب جديد' : 'Pending'}
            </span>
          </div>
        )}

        {/* 4 Overview Metric Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-5 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider block">{t('totalOrders')}</span>
                <span className="text-2xl font-extrabold text-white mt-1 block">{stats.total_orders}</span>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                <ListOrdered className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-card p-5 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider block">{t('totalRevenue')}</span>
                <span className="text-2xl font-extrabold text-[#c5a059] mt-1 block">
                  {stats.total_revenue} {t('currency')}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#c5a059]/10 text-[#c5a059]">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-card p-5 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider block">{t('pendingOrders')}</span>
                <span className="text-2xl font-extrabold text-amber-400 mt-1 block">{stats.pending_orders}</span>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-card p-5 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider block">{t('deliveredOrders')}</span>
                <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">{stats.delivered_orders}</span>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                <PackageCheck className="w-6 h-6" />
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#c5a059] text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>{t('ordersList')} ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-[#c5a059] text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('manageProducts')} ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-[#c5a059] text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>{t('manageCategories')} ({categories.length})</span>
          </button>
        </div>

        {/* ---------------- Tab 1: Orders ---------------- */}
        {activeTab === 'orders' && (
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-white text-base">{t('ordersList')}</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-white/5 text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">{t('orderNumber')}</th>
                    <th className="p-4">{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                    <th className="p-4">{t('phone')}</th>
                    <th className="p-4">{t('address')}</th>
                    <th className="p-4">{lang === 'ar' ? 'المنتجات' : 'Items'}</th>
                    <th className="p-4">{t('cartTotal')}</th>
                    <th className="p-4">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-[#c5a059]">{ord.order_number}</td>
                      <td className="p-4 font-semibold text-white">{ord.customer_name}</td>
                      <td className="p-4 text-gray-300">{ord.phone}</td>
                      <td className="p-4 text-gray-300 max-w-xs truncate">{ord.address}, {ord.city || ''}</td>
                      <td className="p-4 text-gray-300">
                        {ord.items?.map((it) => (
                          <div key={it.id} className="truncate">
                            {it.quantity}x {it.product_name}
                          </div>
                        ))}
                      </td>
                      <td className="p-4 font-bold text-white">{ord.total_amount} {t('currency')}</td>
                      <td className="p-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          className="glass-input py-1 px-2 text-xs bg-[#1a1a1a] rounded border border-white/20"
                        >
                          <option value="pending">{t('statusPending')}</option>
                          <option value="confirmed">{t('statusConfirmed')}</option>
                          <option value="shipped">{t('statusShipped')}</option>
                          <option value="delivered">{t('statusDelivered')}</option>
                          <option value="cancelled">{t('statusCancelled')}</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- Tab 2: Products ---------------- */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base">{t('manageProducts')}</h3>
              <button
                onClick={() => setShowProductModal(true)}
                className="gold-button text-xs py-2 px-4"
              >
                <Plus className="w-4 h-4" />
                <span>{t('addNewProduct')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="glass-card p-4 rounded-xl border border-white/10 flex gap-4 items-center">
                  <img
                    src={p.images?.[0]?.image_url || '/assets/logo.png'}
                    alt={p.name_ar}
                    className="w-16 h-20 rounded-lg object-cover bg-neutral-900"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#c5a059] uppercase">{p.gender_section}</span>
                    <h4 className="font-semibold text-white text-sm truncate">{lang === 'ar' ? p.name_ar : p.name_en}</h4>
                    <p className="text-xs text-gray-400 mt-1 font-bold">{p.discount_price || p.base_price} {t('currency')}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-2 text-gray-400 hover:text-red-400 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- Tab 3: Categories ---------------- */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base">{t('manageCategories')}</h3>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="gold-button text-xs py-2 px-4"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إضافة فئة جديدة' : 'Add Category'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="glass-card p-4 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">ID: {c.id} {c.parent_id ? `(Parent: ${c.parent_id})` : '(Root)'}</span>
                    <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded text-gray-300">{c.slug}</span>
                  </div>
                  <h4 className="font-bold text-white text-base mt-2">{c.name_ar} / {c.name_en}</h4>
                  {c.subcategories && c.subcategories.length > 0 && (
                    <div className="mt-2 text-xs text-[#c5a059]">
                      {c.subcategories.map((sub) => sub.name_ar).join(' · ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- Modal: Add Product ---------------- */}
        {showProductModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel max-w-2xl w-full p-6 md:p-8 rounded-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">{t('addNewProduct')}</h3>
                <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">الاسم بالعربية *</label>
                    <input
                      type="text"
                      required
                      value={newProductData.name_ar}
                      onChange={(e) => setNewProductData({ ...newProductData, name_ar: e.target.value })}
                      className="glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Name (English) *</label>
                    <input
                      type="text"
                      required
                      value={newProductData.name_en}
                      onChange={(e) => setNewProductData({ ...newProductData, name_en: e.target.value })}
                      className="glass-input text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">الاسم اللطيف (Slug) *</label>
                    <input
                      type="text"
                      required
                      value={newProductData.slug}
                      onChange={(e) => setNewProductData({ ...newProductData, slug: e.target.value })}
                      placeholder="e.g. classic-black-jacket"
                      className="glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">القسم الرئيسي *</label>
                    <select
                      value={newProductData.gender_section}
                      onChange={(e) => setNewProductData({ ...newProductData, gender_section: e.target.value })}
                      className="glass-input text-xs bg-[#181818]"
                    >
                      <option value="men">{t('navMen')}</option>
                      <option value="women">{t('navWomen')}</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">السعر الأساسي *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProductData.base_price}
                      onChange={(e) => setNewProductData({ ...newProductData, base_price: e.target.value })}
                      className="glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">سعر التخفيض (اختياري)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProductData.discount_price}
                      onChange={(e) => setNewProductData({ ...newProductData, discount_price: e.target.value })}
                      className="glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">التصنيف *</label>
                    <select
                      required
                      value={newProductData.category_id}
                      onChange={(e) => setNewProductData({ ...newProductData, category_id: e.target.value })}
                      className="glass-input text-xs bg-[#181818]"
                    >
                      <option value="">اختر التصنيف...</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name_ar} ({c.name_en})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">الوصف بالعربية</label>
                  <textarea
                    rows={2}
                    value={newProductData.description_ar}
                    onChange={(e) => setNewProductData({ ...newProductData, description_ar: e.target.value })}
                    className="glass-input text-xs resize-none"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProductData.is_on_sale}
                      onChange={(e) => setNewProductData({ ...newProductData, is_on_sale: e.target.checked })}
                    />
                    <span>{lang === 'ar' ? 'تخفيض فعّال' : 'On Sale'}</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProductData.is_featured}
                      onChange={(e) => setNewProductData({ ...newProductData, is_featured: e.target.checked })}
                    />
                    <span>{lang === 'ar' ? 'مميز في الرئيسية' : 'Featured'}</span>
                  </label>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="glass-outline-button text-xs py-2 px-4"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button type="submit" className="gold-button text-xs py-2 px-6">
                    {lang === 'ar' ? 'إضافة المنتج' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ---------------- Modal: Add Category ---------------- */}
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel max-w-md w-full p-6 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                <h3 className="text-base font-bold text-white">{lang === 'ar' ? 'إضافة فئة جديدة' : 'Add Category'}</h3>
                <button onClick={() => setShowCategoryModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">الاسم بالعربية *</label>
                  <input
                    type="text"
                    required
                    value={newCatData.name_ar}
                    onChange={(e) => setNewCatData({ ...newCatData, name_ar: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={newCatData.name_en}
                    onChange={(e) => setNewCatData({ ...newCatData, name_en: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={newCatData.slug}
                    onChange={(e) => setNewCatData({ ...newCatData, slug: e.target.value })}
                    className="glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">الفئة الأب (فارغ إن كانت فئة رئيسية)</label>
                  <select
                    value={newCatData.parent_id}
                    onChange={(e) => setNewCatData({ ...newCatData, parent_id: e.target.value })}
                    className="glass-input text-xs bg-[#181818]"
                  >
                    <option value="">فئة رئيسية (None - Root)</option>
                    {categories.filter((c) => !c.parent_id).map((c) => (
                      <option key={c.id} value={c.id}>{c.name_ar} ({c.name_en})</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
                    className="glass-outline-button text-xs py-2 px-4"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button type="submit" className="gold-button text-xs py-2 px-6">
                    {lang === 'ar' ? 'إنشاء' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
