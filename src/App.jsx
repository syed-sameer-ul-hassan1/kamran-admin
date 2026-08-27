import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useAdminData } from './context/AdminDataContext';
import LoginPage from './components/LoginPage';
import {
  DashboardIcon,
  CatalogueIcon,
  SettingsIcon,
  HeroIcon,
  FiberIcon,
  CraftIcon,
  TestimonialIcon,
  FaqIcon,
  SyncIcon,
  PhoneCallIcon,
  CheckIcon,
  AlertIcon,
  CloseIcon,
  TextContentIcon
} from './components/AdminIcons';

import DashboardOverview from './components/DashboardOverview';
import ProductsManager from './components/ProductsManager';
import SettingsManager from './components/SettingsManager';
import HeroManager from './components/HeroManager';
import SiteContentManager from './components/SiteContentManager';
import MaterialsManager from './components/MaterialsManager';
import CraftManager from './components/CraftManager';
import TestimonialsManager from './components/TestimonialsManager';
import FaqsManager from './components/FaqsManager';
import InquiriesManager from './components/InquiriesManager';
import DataSyncTool from './components/DataSyncTool';

const NAV_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: DashboardIcon },
  { id: 'products', label: 'Shawls Catalogue', icon: CatalogueIcon, badgeKey: 'products' },
  { id: 'inquiries', label: 'Consultations & Leads', icon: PhoneCallIcon, badgeKey: 'inquiries' },
  { id: 'content', label: 'Page Text & Buttons', icon: TextContentIcon },
  { id: 'settings', label: 'Store Settings', icon: SettingsIcon },
  { id: 'hero', label: 'Hero & Headline', icon: HeroIcon },
  { id: 'materials', label: 'Fiber Knowledge', icon: FiberIcon, badgeKey: 'materials' },
  { id: 'craft', label: 'Craft & Inspection', icon: CraftIcon },
  { id: 'testimonials', label: 'Patron Reviews', icon: TestimonialIcon, badgeKey: 'testimonials' },
  { id: 'faqs', label: 'FAQs Support', icon: FaqIcon, badgeKey: 'faqs' },
  { id: 'sync', label: 'Export & Live Sync', icon: SyncIcon },
];

export default function App() {
  const { user, loading, signOut } = useAuth();
  const { data, toast, closeToast } = useAdminData();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-card">
          <div className="scm-spinner" style={{ width: '28px', height: '28px', borderWidth: '3px' }} />
          <p style={{ marginTop: '16px', color: 'var(--cream-soft)', fontSize: '0.92rem', letterSpacing: '0.02em' }}>
            Authenticating Administrator…
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const getBadgeCount = (item) => {
    if (item.badgeKey && data[item.badgeKey]) {
      return data[item.badgeKey].length;
    }
    return null;
  };

  return (
    <div className="admin-shell">
      {mobileNavOpen && (
        <div
          className="floating-sidebar-backdrop"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <button
        type="button"
        className="floating-mobile-fab"
        onClick={() => setMobileNavOpen((prev) => !prev)}
        aria-label="Toggle navigation menu"
      >
        {mobileNavOpen ? <CloseIcon /> : '☰'}
      </button>

      <aside className={`admin-sidebar ${mobileNavOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <img
            src="/logo-dark.svg"
            alt="Kamran Shawls Logo"
            className="brand-logo"
            width="34"
            height="34"
            style={{ width: '34px', height: '34px', objectFit: 'contain' }}
          />
          <div className="brand-text">
            <h1>Kamran Shawls</h1>
            <span>Admin</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const count = getBadgeCount(item);
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileNavOpen(false);
                }}
              >
                <div className="nav-btn-left">
                  <span className="nav-icon"><Icon /></span>
                  <span>{item.label}</span>
                </div>
                {count !== null && <span className="nav-badge">{count}</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            onClick={signOut}
            className="btn btn-sm"
            style={{
              width: '100%',
              justifyContent: 'center',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#fca5a5'
            }}
          >
            Sign Out ⎋
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-content">
          <div className="admin-topbar">
            <div className="topbar-left">
              <h2>{NAV_ITEMS.find((n) => n.id === activeTab)?.label || 'Dashboard'}</h2>
              <p>
                {activeTab === 'overview' && 'Real-time overview of boutique inventory, consultations, and verified reviews.'}
                {activeTab === 'products' && 'Manage your handcrafted shawls, pricing, inventory stock, and high-res photography.'}
                {activeTab === 'inquiries' && 'Direct customer WhatsApp and bridal consultation inquiries received.'}
                {activeTab === 'content' && 'Edit every button label, section heading, story paragraph, and banner across the entire website.'}
                {activeTab === 'settings' && 'Configure boutique phone lines, WhatsApp links, and physical store coordinates.'}
                {activeTab === 'hero' && 'Customize the storefront main headline, background text, and introduction copy.'}
                {activeTab === 'materials' && 'Educate clients on pure pashmina, shatoosh, Swati wool, and silk craftsmanship.'}
                {activeTab === 'craft' && 'Display the 5-stage traditional weaving and inspection standards.'}
                {activeTab === 'testimonials' && 'Curate verified patron stories and Himalayan client testimonials.'}
                {activeTab === 'faqs' && 'Frequently asked questions regarding care, shipping, authenticity, and boutique visits.'}
                {activeTab === 'sync' && 'Real-time Supabase cloud synchronization, backup, and JSON export tools.'}
              </p>
            </div>
            <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={signOut}
                className="btn btn-secondary btn-sm"
                title="Sign out of Admin Portal"
              >
                Sign Out
              </button>
            </div>
          </div>

          {activeTab === 'overview' && <DashboardOverview setActiveTab={setActiveTab} />}
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'inquiries' && <InquiriesManager />}
          {activeTab === 'content' && <SiteContentManager />}
          {activeTab === 'settings' && <SettingsManager />}
          {activeTab === 'hero' && <HeroManager />}
          {activeTab === 'materials' && <MaterialsManager />}
          {activeTab === 'craft' && <CraftManager />}
          {activeTab === 'testimonials' && <TestimonialsManager />}
          {activeTab === 'faqs' && <FaqsManager />}
          {activeTab === 'sync' && <DataSyncTool />}
        </div>
      </main>

      {toast && (
        <div className="toast-container" aria-live="polite">
          <div className={`toast toast-${toast.type} toast-animated`} role="status">
            <div className={`toast-icon-wrap toast-icon-${toast.type}`}>
              {toast.type === 'error' ? (
                <CloseIcon />
              ) : toast.type === 'warning' ? (
                <AlertIcon />
              ) : (
                <CheckIcon />
              )}
            </div>
            <div className="toast-content">
              {toast.title && <strong className="toast-title">{toast.title}</strong>}
              <span className="toast-msg">{toast.message}</span>
            </div>
            <button
              type="button"
              className="toast-close-btn"
              onClick={closeToast}
              aria-label="Dismiss notification"
              title="Dismiss"
            >
              ✕
            </button>
            <div className={`toast-progress-bar toast-progress-${toast.type}`} key={toast.id} />
          </div>
        </div>
      )}
    </div>
  );
}
