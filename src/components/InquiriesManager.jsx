import { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { PhoneCallIcon, CheckIcon, TrashIcon } from './AdminIcons';

export default function InquiriesManager() {
  const { inquiries, updateInquiryStatus, deleteInquiry } = useAdminData();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDelete = (id) => {
    if (confirmDeleteId === id) {
      deleteInquiry(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };

  return (
    <div className="inquiries-manager">
      <div className="card-panel">
        <div className="card-header">
          <div className="card-title-group">
            <h2>Customer Consultations &amp; Leads</h2>
            <p>Live inquiries captured from website consultation forms and WhatsApp inquiries</p>
          </div>
          {inquiries.length > 0 && (
            <span className="badge badge-gold">{inquiries.length} total</span>
          )}
        </div>

        {inquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--cream-muted)' }}>
            <p style={{ fontSize: '1.05rem', margin: '0 0 6px' }}>No inquiries captured yet.</p>
            <span style={{ fontSize: '0.84rem' }}>When customers submit inquiry forms on the storefront, they will appear here in real time.</span>
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone / WhatsApp</th>
                  <th>City</th>
                  <th>Interested Weave</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq.id}>
                    <td><strong>{inq.name || 'Anonymous Visitor'}</strong></td>
                    <td>
                      {inq.phone ? (
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--gold)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <PhoneCallIcon />
                          <span>{inq.phone}</span>
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td><span className="badge badge-gold">{inq.city || 'Pakistan'}</span></td>
                    <td style={{ fontSize: '0.86rem' }}>{inq.shawl_name || 'General Inquiry'}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--cream-muted)' }}>
                      {new Date(inq.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge ${inq.status === 'contacted' ? 'badge-success' : 'badge-oxblood'}`}>
                        {inq.status || 'new'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {inq.status !== 'contacted' ? (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => updateInquiryStatus(inq.id, 'contacted')}
                            title="Mark as Contacted"
                          >
                            <CheckIcon />
                            <span>Contacted</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => updateInquiryStatus(inq.id, 'new')}
                            title="Mark as New"
                          >
                            Mark New
                          </button>
                        )}
                        <button
                          type="button"
                          className={`btn btn-sm ${confirmDeleteId === inq.id ? 'btn-oxblood' : 'btn-danger'}`}
                          onClick={() => handleDelete(inq.id)}
                          title={confirmDeleteId === inq.id ? 'Click again to confirm delete' : 'Delete inquiry'}
                        >
                          <TrashIcon />
                          {confirmDeleteId === inq.id && <span>Confirm?</span>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
