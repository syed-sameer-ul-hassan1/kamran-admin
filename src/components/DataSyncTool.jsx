import { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { DownloadIcon, CopyIcon, UploadIcon, CheckIcon } from './AdminIcons';

export default function DataSyncTool() {
  const { data, importFullData, resetToDefaults, showToast } = useAdminData();
  const [jsonText, setJsonText] = useState(() => JSON.stringify(data, null, 2));
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setIsCopied(true);
    showToast('JSON copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kamran-shawls-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded siteData.json');
  };

  const handleDownloadDataJs = () => {
    const fileContent = `export const WHATSAPP_LINK = '${data.settings.whatsappLink}';

export const PRODUCTS = ${JSON.stringify(data.products, null, 2)};

export const MATERIALS_GUIDE = ${JSON.stringify(data.materials, null, 2)};

export const CRAFT_DETAILED_STEPS = ${JSON.stringify(data.craftSteps, null, 2)};

export const TESTIMONIALS = ${JSON.stringify(data.testimonials, null, 2)};

export const FAQS = ${JSON.stringify(data.faqs, null, 2)};
`;

    const blob = new Blob([fileContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded data.js ready for main website!');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.products && parsed.settings) {
          importFullData(parsed);
          setJsonText(JSON.stringify(parsed, null, 2));
        } else {
          alert('Invalid file format. Must be a valid Kamran Shawls JSON export.');
        }
      } catch (err) {
        alert('Failed to parse JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleApplyJsonEdit = () => {
    try {
      const parsed = JSON.parse(jsonText);
      importFullData(parsed);
    } catch (err) {
      alert('JSON Syntax Error: ' + err.message);
    }
  };

  return (
    <div className="data-sync-tool">
      <div className="card-panel">
        <div className="card-header">
          <div className="card-title-group">
            <h2>Data Synchronization & Export Center</h2>
            <p>Export your updated catalogue and settings into the main website</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <div style={{ background: 'var(--ink)', padding: '22px', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
            <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-serif)', color: 'var(--cream-pure)' }}>
              1. Download Updated `data.js`
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--cream-muted)', marginBottom: '16px' }}>
              One-click drop-in replacement file for your main storefront (`react/src/data.js`).
            </p>
            <button type="button" className="btn btn-primary" onClick={handleDownloadDataJs} style={{ width: '100%' }}>
              <DownloadIcon />
              <span>Download `data.js` File</span>
            </button>
          </div>

          <div style={{ background: 'var(--ink)', padding: '22px', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
            <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-serif)', color: 'var(--cream-pure)' }}>
              2. Download Full JSON Backup
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--cream-muted)', marginBottom: '16px' }}>
              Full backup of your catalogue, settings, reviews, FAQs, and inspection protocols.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={handleDownloadJson} style={{ flex: 1 }}>
                <DownloadIcon />
                <span>Download JSON</span>
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCopyJson}>
                {isCopied ? <CheckIcon /> : <CopyIcon />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div style={{ background: 'var(--ink)', padding: '22px', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
            <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-serif)', color: 'var(--cream-pure)' }}>
              3. Import Existing Backup
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--cream-muted)', marginBottom: '16px' }}>
              Upload any previous JSON configuration to restore or sync updates.
            </p>
            <label className="btn btn-secondary" style={{ width: '100%', cursor: 'pointer', textAlign: 'center' }}>
              <UploadIcon />
              <span>Upload JSON File</span>
              <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--line-soft)', paddingTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.15rem' }}>Raw JSON Live Editor</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => {
                if (confirm('Are you sure you want to reset all data back to original defaults?')) {
                  resetToDefaults();
                  setJsonText(JSON.stringify(data, null, 2));
                }
              }}>
                Reset to Defaults
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleApplyJsonEdit}>
                Apply Raw JSON Edits
              </button>
            </div>
          </div>

          <textarea
            className="form-textarea"
            rows={14}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', lineHeight: 1.45, background: 'var(--ink-deep)' }}
          />
        </div>
      </div>
    </div>
  );
}
