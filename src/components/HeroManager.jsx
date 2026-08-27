import { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';

export default function HeroManager() {
  const { data, updateHero } = useAdminData();
  const [formData, setFormData] = useState({ ...data.hero });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateHero(formData);
  };

  return (
    <div className="hero-manager">
      <div className="card-panel">
        <div className="card-header">
          <div className="card-title-group">
            <h2>Homepage Hero & Headline Editor</h2>
            <p>Customize the primary headline, story summary, and action buttons displayed on the storefront</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">Primary Hero Headline *</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Shawls chosen carefully, worn for years"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Hero Story & Lede Paragraph *</label>
              <textarea
                className="form-textarea"
                rows={4}
                required
                value={formData.lede}
                onChange={(e) => setFormData({ ...formData, lede: e.target.value })}
                placeholder="Main introductory paragraph..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary CTA Button Label</label>
              <input
                type="text"
                className="form-input"
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp CTA Button Label</label>
              <input
                type="text"
                className="form-input"
                value={formData.whatsappCtaText}
                onChange={(e) => setFormData({ ...formData, whatsappCtaText: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              Save Hero Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
