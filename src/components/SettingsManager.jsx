import { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';

export default function SettingsManager() {
  const { data, updateSettings } = useAdminData();
  const [formData, setFormData] = useState({ ...data.settings });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
  };

  return (
    <div className="settings-manager">
      <div className="card-panel">
        <div className="card-header">
          <div className="card-title-group">
            <h2>Boutique & Storefront Settings</h2>
            <p>Manage contact information, store coordinates, social channels, and WhatsApp links</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Brand Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Brand Tagline</label>
              <input
                type="text"
                className="form-input"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Live Main Website URL (Domain)</label>
              <input
                type="url"
                className="form-input"
                placeholder="e.g. https://kamranshawls.com.pk or http://localhost:5174/"
                value={formData.storefrontUrl || 'http://localhost:5174/'}
                onChange={(e) => setFormData({ ...formData, storefrontUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Curators Phone (Calls & WhatsApp)</label>
              <input
                type="text"
                className="form-input"
                value={formData.phonePrimary}
                onChange={(e) => setFormData({ ...formData, phonePrimary: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Secondary Helpline Phone</label>
              <input
                type="text"
                className="form-input"
                value={formData.phoneSecondary}
                onChange={(e) => setFormData({ ...formData, phoneSecondary: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">WhatsApp Direct Curation Link</label>
              <input
                type="url"
                className="form-input"
                value={formData.whatsappLink}
                onChange={(e) => setFormData({ ...formData, whatsappLink: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Boutique Physical Address</label>
              <input
                type="text"
                className="form-input"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Instagram Portfolio URL</label>
              <input
                type="url"
                className="form-input"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">TikTok Broadcasts URL</label>
              <input
                type="url"
                className="form-input"
                value={formData.tiktokUrl}
                onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Summer Visiting Timings (May – Oct)</label>
              <input
                type="text"
                className="form-input"
                value={formData.timingsSummer}
                onChange={(e) => setFormData({ ...formData, timingsSummer: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Winter Visiting Timings (Nov – Apr)</label>
              <input
                type="text"
                className="form-input"
                value={formData.timingsWinter}
                onChange={(e) => setFormData({ ...formData, timingsWinter: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              Save Storefront Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
