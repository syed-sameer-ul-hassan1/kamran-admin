import { useState, useEffect } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { DEFAULT_SITE_CONTENT } from '../defaultSiteContent';
import { CheckIcon } from './AdminIcons';

const CONTENT_TABS = [
  { id: 'navbar', label: 'Navbar & Header' },
  { id: 'homePillars', label: 'Home: 3 Pillars' },
  { id: 'homeCollection', label: 'Home: Collection' },
  { id: 'homeCraftBanner', label: 'Home: Craft Banner' },
  { id: 'homeConcierge', label: 'Home: Concierge' },
  { id: 'collectionPage', label: 'Collection Page' },
  { id: 'craftPage', label: 'Craftsmanship Page' },
  { id: 'contactPage', label: 'Contact & Form' },
  { id: 'guidesPage', label: 'Guides Hub Page' },
  { id: 'productDetailPage', label: 'Product View & Actions' },
  { id: 'footer', label: 'Footer & Notice' }
];

export default function SiteContentManager() {
  const { data, updateSiteContent, saveAllSiteContent } = useAdminData();
  const [activeTab, setActiveTab] = useState('navbar');
  const [formData, setFormData] = useState(() => data.siteContent || DEFAULT_SITE_CONTENT);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data.siteContent) {
      setFormData(data.siteContent);
    }
  }, [data.siteContent]);

  const handleFieldChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value
      }
    }));
  };

  const handleSaveCurrentSection = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSiteContent(activeTab, formData[activeTab]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSection = () => {
    if (confirm(`Reset "${CONTENT_TABS.find(t => t.id === activeTab)?.label}" text to original default?`)) {
      setFormData((prev) => ({
        ...prev,
        [activeTab]: DEFAULT_SITE_CONTENT[activeTab]
      }));
      updateSiteContent(activeTab, DEFAULT_SITE_CONTENT[activeTab]);
    }
  };

  const currentSection = formData[activeTab] || DEFAULT_SITE_CONTENT[activeTab] || {};

  return (
    <div className="site-content-manager">
      <div className="card-panel">
        <div className="card-header">
          <div className="card-title-group">
            <h2>Site Text & Buttons Manager</h2>
            <p>Directly edit every heading, button label, paragraph, banner, and notice across the entire storefront</p>
          </div>
          <span className="badge badge-gold">Live Synced to Website</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '14px', marginBottom: '22px', borderBottom: '1px solid var(--line-light)' }}>
          {CONTENT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ whiteSpace: 'nowrap' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSaveCurrentSection}>
          {activeTab === 'navbar' && (
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Brand Name in Navbar</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.brandName || ''}
                  onChange={(e) => handleFieldChange('navbar', 'brandName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Navbar Main CTA Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.ctaText || ''}
                  onChange={(e) => handleFieldChange('navbar', 'ctaText', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Menu WhatsApp CTA Button</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.mobileCtaWhatsapp || ''}
                  onChange={(e) => handleFieldChange('navbar', 'mobileCtaWhatsapp', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Menu Call Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.mobileCtaCall || ''}
                  onChange={(e) => handleFieldChange('navbar', 'mobileCtaCall', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Boutique Location Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.mobileBoutiqueTitle || ''}
                  onChange={(e) => handleFieldChange('navbar', 'mobileBoutiqueTitle', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Boutique Location Subtitle</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.mobileBoutiqueSub || ''}
                  onChange={(e) => handleFieldChange('navbar', 'mobileBoutiqueSub', e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'homePillars' && (
            <div className="form-grid">
              <div className="form-group full-width">
                <h4 style={{ margin: '0 0 10px', color: 'var(--gold)', fontSize: '0.95rem' }}>Pillar 01</h4>
              </div>
              <div className="form-group">
                <label className="form-label">Pillar 1 Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.pillar1Title || ''}
                  onChange={(e) => handleFieldChange('homePillars', 'pillar1Title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Pillar 1 Description</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={currentSection.pillar1Desc || ''}
                  onChange={(e) => handleFieldChange('homePillars', 'pillar1Desc', e.target.value)}
                />
              </div>

              <div className="form-group full-width" style={{ marginTop: '10px' }}>
                <h4 style={{ margin: '0 0 10px', color: 'var(--gold)', fontSize: '0.95rem' }}>Pillar 02</h4>
              </div>
              <div className="form-group">
                <label className="form-label">Pillar 2 Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.pillar2Title || ''}
                  onChange={(e) => handleFieldChange('homePillars', 'pillar2Title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Pillar 2 Description</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={currentSection.pillar2Desc || ''}
                  onChange={(e) => handleFieldChange('homePillars', 'pillar2Desc', e.target.value)}
                />
              </div>

              <div className="form-group full-width" style={{ marginTop: '10px' }}>
                <h4 style={{ margin: '0 0 10px', color: 'var(--gold)', fontSize: '0.95rem' }}>Pillar 03</h4>
              </div>
              <div className="form-group">
                <label className="form-label">Pillar 3 Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.pillar3Title || ''}
                  onChange={(e) => handleFieldChange('homePillars', 'pillar3Title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Pillar 3 Description</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={currentSection.pillar3Desc || ''}
                  onChange={(e) => handleFieldChange('homePillars', 'pillar3Desc', e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'homeCollection' && (
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Section Eyebrow</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.eyebrow || ''}
                  onChange={(e) => handleFieldChange('homeCollection', 'eyebrow', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Section Main Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.title || ''}
                  onChange={(e) => handleFieldChange('homeCollection', 'title', e.target.value)}
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Section Subtitle / Description</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={currentSection.desc || ''}
                  onChange={(e) => handleFieldChange('homeCollection', 'desc', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Filter Button 1 Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.filterAll || ''}
                  onChange={(e) => handleFieldChange('homeCollection', 'filterAll', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Filter Button 2 Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.filterPashmina || ''}
                  onChange={(e) => handleFieldChange('homeCollection', 'filterPashmina', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Filter Button 3 Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.filterWool || ''}
                  onChange={(e) => handleFieldChange('homeCollection', 'filterWool', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Filter Button 4 Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.filterSilk || ''}
                  onChange={(e) => handleFieldChange('homeCollection', 'filterSilk', e.target.value)}
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Bottom Button Text (Browse Complete Catalogue)</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.browseAllCta || ''}
                  onChange={(e) => handleFieldChange('homeCollection', 'browseAllCta', e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'homeCraftBanner' && (
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Banner Eyebrow</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.eyebrow || ''}
                  onChange={(e) => handleFieldChange('homeCraftBanner', 'eyebrow', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Banner Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.title || ''}
                  onChange={(e) => handleFieldChange('homeCraftBanner', 'title', e.target.value)}
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Banner Story / Paragraph</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={currentSection.lead || ''}
                  onChange={(e) => handleFieldChange('homeCraftBanner', 'lead', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Timeline Step 1 Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.step1Title || ''}
                  onChange={(e) => handleFieldChange('homeCraftBanner', 'step1Title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Timeline Step 1 Description</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.step1Desc || ''}
                  onChange={(e) => handleFieldChange('homeCraftBanner', 'step1Desc', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Timeline Step 2 Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.step2Title || ''}
                  onChange={(e) => handleFieldChange('homeCraftBanner', 'step2Title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Timeline Step 2 Description</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.step2Desc || ''}
                  onChange={(e) => handleFieldChange('homeCraftBanner', 'step2Desc', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Timeline Step 3 Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.step3Title || ''}
                  onChange={(e) => handleFieldChange('homeCraftBanner', 'step3Title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Timeline Step 3 Description</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.step3Desc || ''}
                  onChange={(e) => handleFieldChange('homeCraftBanner', 'step3Desc', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Timeline Step 4 Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.step4Title || ''}
                  onChange={(e) => handleFieldChange('homeCraftBanner', 'step4Title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Timeline Step 4 Description</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.step4Desc || ''}
                  onChange={(e) => handleFieldChange('homeCraftBanner', 'step4Desc', e.target.value)}
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Button Text (Explore Full Craftsmanship Journey)</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.ctaText || ''}
                  onChange={(e) => handleFieldChange('homeCraftBanner', 'ctaText', e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'homeConcierge' && (
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Section Eyebrow</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.eyebrow || ''}
                  onChange={(e) => handleFieldChange('homeConcierge', 'eyebrow', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Section Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.title || ''}
                  onChange={(e) => handleFieldChange('homeConcierge', 'title', e.target.value)}
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Section Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={currentSection.desc || ''}
                  onChange={(e) => handleFieldChange('homeConcierge', 'desc', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.whatsappCta || ''}
                  onChange={(e) => handleFieldChange('homeConcierge', 'whatsappCta', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Call Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.callCta || ''}
                  onChange={(e) => handleFieldChange('homeConcierge', 'callCta', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location Card Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.shopTitle || ''}
                  onChange={(e) => handleFieldChange('homeConcierge', 'shopTitle', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location Card Subtitle</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.shopSub || ''}
                  onChange={(e) => handleFieldChange('homeConcierge', 'shopSub', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Instagram Card Subtitle</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.instaSub || ''}
                  onChange={(e) => handleFieldChange('homeConcierge', 'instaSub', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">TikTok Card Subtitle</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.tiktokSub || ''}
                  onChange={(e) => handleFieldChange('homeConcierge', 'tiktokSub', e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'collectionPage' && (
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Hero Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.heroTitle || ''}
                  onChange={(e) => handleFieldChange('collectionPage', 'heroTitle', e.target.value)}
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Hero Description / Lede</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={currentSection.heroLede || ''}
                  onChange={(e) => handleFieldChange('collectionPage', 'heroLede', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Browse Catalogue Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.heroBrowseBtn || ''}
                  onChange={(e) => handleFieldChange('collectionPage', 'heroBrowseBtn', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.heroWaBtn || ''}
                  onChange={(e) => handleFieldChange('collectionPage', 'heroWaBtn', e.target.value)}
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Search Input Placeholder</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.searchPlaceholder || ''}
                  onChange={(e) => handleFieldChange('collectionPage', 'searchPlaceholder', e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'craftPage' && (
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Page Hero Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.heroTitle || ''}
                  onChange={(e) => handleFieldChange('craftPage', 'heroTitle', e.target.value)}
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Page Hero Lede</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={currentSection.heroLede || ''}
                  onChange={(e) => handleFieldChange('craftPage', 'heroLede', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hero Button 1 Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.heroBtn1 || ''}
                  onChange={(e) => handleFieldChange('craftPage', 'heroBtn1', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hero Button 2 Text (WhatsApp)</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.heroBtn2 || ''}
                  onChange={(e) => handleFieldChange('craftPage', 'heroBtn2', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">6-Stage Journey Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.journeyTitle || ''}
                  onChange={(e) => handleFieldChange('craftPage', 'journeyTitle', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">6-Stage Journey Subtitle</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.journeyDesc || ''}
                  onChange={(e) => handleFieldChange('craftPage', 'journeyDesc', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Comparison Section Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.comparisonTitle || ''}
                  onChange={(e) => handleFieldChange('craftPage', 'comparisonTitle', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Comparison Section Description</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.comparisonDesc || ''}
                  onChange={(e) => handleFieldChange('craftPage', 'comparisonDesc', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Inspection Protocol Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.inspectionTitle || ''}
                  onChange={(e) => handleFieldChange('craftPage', 'inspectionTitle', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Inspection Video CTA Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.inspectionCta || ''}
                  onChange={(e) => handleFieldChange('craftPage', 'inspectionCta', e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'contactPage' && (
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Hero Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.heroTitle || ''}
                  onChange={(e) => handleFieldChange('contactPage', 'heroTitle', e.target.value)}
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Hero Description / Lede</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={currentSection.heroLede || ''}
                  onChange={(e) => handleFieldChange('contactPage', 'heroLede', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hero Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.heroBtn1 || ''}
                  onChange={(e) => handleFieldChange('contactPage', 'heroBtn1', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Consultation Suite Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.suiteTitle || ''}
                  onChange={(e) => handleFieldChange('contactPage', 'suiteTitle', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tab 1 (Video Audit) Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.tab1Title || ''}
                  onChange={(e) => handleFieldChange('contactPage', 'tab1Title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tab 1 Subtitle</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.tab1Subtitle || ''}
                  onChange={(e) => handleFieldChange('contactPage', 'tab1Subtitle', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tab 2 (Bridal/Bespoke) Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.tab2Title || ''}
                  onChange={(e) => handleFieldChange('contactPage', 'tab2Title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tab 2 Subtitle</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.tab2Subtitle || ''}
                  onChange={(e) => handleFieldChange('contactPage', 'tab2Subtitle', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tab 3 (Boutique Visit) Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.tab3Title || ''}
                  onChange={(e) => handleFieldChange('contactPage', 'tab3Title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tab 3 Subtitle</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.tab3Subtitle || ''}
                  onChange={(e) => handleFieldChange('contactPage', 'tab3Subtitle', e.target.value)}
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Inquiry Submit Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.formSubmitBtn || ''}
                  onChange={(e) => handleFieldChange('contactPage', 'formSubmitBtn', e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'guidesPage' && (
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Guides Page Hero Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.heroTitle || ''}
                  onChange={(e) => handleFieldChange('guidesPage', 'heroTitle', e.target.value)}
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Guides Page Hero Lede</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={currentSection.heroLede || ''}
                  onChange={(e) => handleFieldChange('guidesPage', 'heroLede', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hero Button 1 Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.heroBtn1 || ''}
                  onChange={(e) => handleFieldChange('guidesPage', 'heroBtn1', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hero Button 2 Text (WhatsApp)</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.heroBtn2 || ''}
                  onChange={(e) => handleFieldChange('guidesPage', 'heroBtn2', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Knowledge Hub Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.hubTitle || ''}
                  onChange={(e) => handleFieldChange('guidesPage', 'hubTitle', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Knowledge Hub Subtitle</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.hubDesc || ''}
                  onChange={(e) => handleFieldChange('guidesPage', 'hubDesc', e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'productDetailPage' && (
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Product Detail WhatsApp Order Button</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.orderBtnText || ''}
                  onChange={(e) => handleFieldChange('productDetailPage', 'orderBtnText', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Product Detail Call Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.callBtnText || ''}
                  onChange={(e) => handleFieldChange('productDetailPage', 'callBtnText', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Inspection Guarantee Badge Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.inspectionBadge || ''}
                  onChange={(e) => handleFieldChange('productDetailPage', 'inspectionBadge', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Shipping / Delivery Guarantee Note</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.shippingNote || ''}
                  onChange={(e) => handleFieldChange('productDetailPage', 'shippingNote', e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'footer' && (
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Footer Brand Story / Tagline</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={currentSection.tagline || ''}
                  onChange={(e) => handleFieldChange('footer', 'tagline', e.target.value)}
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Footer Notice / Disclaimer Card Text</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={currentSection.disclaimer || ''}
                  onChange={(e) => handleFieldChange('footer', 'disclaimer', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Footer Copyright Notice</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.copyright || ''}
                  onChange={(e) => handleFieldChange('footer', 'copyright', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Footer Bottom Location Bar</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentSection.bottomNote || ''}
                  onChange={(e) => handleFieldChange('footer', 'bottomNote', e.target.value)}
                />
              </div>
            </div>
          )}

          <div style={{ marginTop: '26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '18px', borderTop: '1px solid var(--line-light)' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleResetSection}>
              Reset Section to Defaults
            </button>
            <button
              type="submit"
              className={`btn btn-primary scm-save-btn ${isSaving ? 'scm-save-saving' : ''}`}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="scm-spinner" />
                  <span>Saving Live…</span>
                </>
              ) : (
                <>
                  <CheckIcon />
                  <span>Save {CONTENT_TABS.find(t => t.id === activeTab)?.label}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
