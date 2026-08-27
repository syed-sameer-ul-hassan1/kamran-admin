import { useAdminData } from '../context/AdminDataContext';
import {
  CatalogueIcon,
  LocationPinIcon,
  StarIcon,
  FaqIcon,
  HeroIcon,
  PhoneCallIcon,
  TestimonialIcon,
  SyncIcon
} from './AdminIcons';

export default function DashboardOverview({ setActiveTab }) {
  const { data } = useAdminData();

  const totalProducts = data.products ? data.products.length : 0;
  const inStockProducts = (data.products || []).filter((p) => p.inStock !== false).length;
  const featuredProducts = (data.products || []).filter((p) => Boolean(p.featured)).length;
  const totalReviews = (data.testimonials || []).length;
  const totalFaqs = (data.faqs || []).length;

  return (
    <div className="dashboard-view">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Shawl Weaves</span>
            <span className="stat-icon" style={{ color: 'var(--gold)' }}><CatalogueIcon /></span>
          </div>
          <div className="stat-value">{totalProducts}</div>
          <p className="stat-desc">{inStockProducts} in stock • {featuredProducts} featured</p>
        </div>

        <div className="stat-card oxblood">
          <div className="stat-header">
            <span className="stat-label">Store Coordinates</span>
            <span className="stat-icon" style={{ color: 'var(--oxblood-soft)' }}><LocationPinIcon /></span>
          </div>
          <div className="stat-value">Nathia Gali</div>
          <p className="stat-desc">{data.settings.phonePrimary}</p>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <span className="stat-label">Patron Reviews</span>
            <span className="stat-icon" style={{ color: 'var(--gold)' }}><StarIcon /></span>
          </div>
          <div className="stat-value">{totalReviews}</div>
          <p className="stat-desc">5.0 Star Verified Patrons</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Knowledge & FAQs</span>
            <span className="stat-icon" style={{ color: 'var(--gold)' }}><FaqIcon /></span>
          </div>
          <div className="stat-value">{totalFaqs + data.craftSteps.length}</div>
          <p className="stat-desc">{totalFaqs} FAQs • {data.craftSteps.length} Craft Stages</p>
        </div>
      </div>

      <div className="card-panel">
        <div className="card-header">
          <div className="card-title-group">
            <h2>Quick Management Actions</h2>
            <p>Direct shortcuts to update your storefront in real time</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setActiveTab('products')}
            style={{ padding: '18px 16px', flexDirection: 'column', gap: '8px', height: 'auto' }}
          >
            <span style={{ color: 'var(--gold)' }}><CatalogueIcon /></span>
            <strong>Add / Edit Shawls</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--cream-muted)' }}>Manage catalogue & prices</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setActiveTab('settings')}
            style={{ padding: '18px 16px', flexDirection: 'column', gap: '8px', height: 'auto' }}
          >
            <span style={{ color: 'var(--gold)' }}><PhoneCallIcon /></span>
            <strong>Store Settings</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--cream-muted)' }}>WhatsApp, phones & address</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setActiveTab('testimonials')}
            style={{ padding: '18px 16px', flexDirection: 'column', gap: '8px', height: 'auto' }}
          >
            <span style={{ color: 'var(--gold)' }}><TestimonialIcon /></span>
            <strong>Patron Reviews</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--cream-muted)' }}>Add verified customer stories</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setActiveTab('sync')}
            style={{ padding: '18px 16px', flexDirection: 'column', gap: '8px', height: 'auto' }}
          >
            <span style={{ color: 'var(--gold)' }}><SyncIcon /></span>
            <strong>Export & Live Sync</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--cream-muted)' }}>Export JSON configuration</span>
          </button>
        </div>
      </div>

      <div className="card-panel">
        <div className="card-header">
          <div className="card-title-group">
            <h2>Current Featured Showcase Shawls</h2>
            <p>Active weaves displayed on the storefront hero showcase</p>
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setActiveTab('products')}>
            Manage All Shawls →
          </button>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Weave Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Dimensions</th>
                <th>Weight</th>
                <th>Stock Status</th>
              </tr>
            </thead>
            <tbody>
              {(!data.products || data.products.length === 0) ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--cream-muted)' }}>
                    No shawls in catalogue yet. Click "+ Add New Shawl Weave" to add your first piece.
                  </td>
                </tr>
              ) : (
                data.products.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td><span className="badge badge-gold">{p.category}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--gold)' }}>{p.price}</td>
                    <td>{p.dimensions}</td>
                    <td>{p.weight}</td>
                    <td>
                      {p.inStock === false && (
                        <span className="badge badge-oxblood">Out of Stock</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
