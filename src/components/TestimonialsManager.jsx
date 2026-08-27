import { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';

export default function TestimonialsManager() {
  const { data, saveTestimonial, deleteTestimonial } = useAdminData();
  const [editingReview, setEditingReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingReview({
      id: 'test-' + Date.now(),
      name: '',
      city: 'Islamabad',
      shawl: 'Pure Pashmina Wrap',
      comment: '',
      rating: 5
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingReview({ ...t });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editingReview.name.trim() || !editingReview.comment.trim()) {
      alert('Please fill in both name and review comment');
      return;
    }
    saveTestimonial(editingReview);
    setIsModalOpen(false);
  };

  return (
    <div className="testimonials-manager">
      <div className="card-panel">
        <div className="card-header">
          <div className="card-title-group">
            <h2>Patron Testimonials & Customer Stories</h2>
            <p>Manage verified customer reviews displayed on the homepage</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
            + Add New Testimonial
          </button>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patron Name</th>
                <th>City / Location</th>
                <th>Purchased Shawl</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!data.testimonials || data.testimonials.length === 0) ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--cream-muted)' }}>
                    No patron testimonials added yet. Click "+ Add New Testimonial" to add customer stories.
                  </td>
                </tr>
              ) : (
                data.testimonials.map((t) => (
                <tr key={t.id}>
                  <td><strong>{t.name}</strong></td>
                  <td><span className="badge badge-gold">{t.city}</span></td>
                  <td style={{ fontSize: '0.84rem' }}>{t.shawl}</td>
                  <td style={{ color: 'var(--gold)', letterSpacing: '2px' }}>
                    {'★'.repeat(t.rating || 5)}
                  </td>
                  <td style={{ fontSize: '0.84rem', color: 'var(--cream-muted)', maxWidth: '300px' }}>
                    &ldquo;{t.comment}&rdquo;
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(t)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          if (confirm(`Delete review from "${t.name}"?`)) {
                            deleteTestimonial(t.id);
                          }
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editingReview && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingReview.id.startsWith('test-') ? 'Add Testimonial' : `Edit: ${editingReview.name}`}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Client / Patron Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={editingReview.name}
                      onChange={(e) => setEditingReview({ ...editingReview, name: e.target.value })}
                      placeholder="e.g. Sardar Hamza Khan"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City / Region *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={editingReview.city}
                      onChange={(e) => setEditingReview({ ...editingReview, city: e.target.value })}
                      placeholder="e.g. Islamabad, Lahore, Karachi"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Purchased Shawl Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingReview.shawl}
                      onChange={(e) => setEditingReview({ ...editingReview, shawl: e.target.value })}
                      placeholder="e.g. Swati Heritage Shawl in Oxblood"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Star Rating (1 - 5)</label>
                    <select
                      className="form-select"
                      value={editingReview.rating}
                      onChange={(e) => setEditingReview({ ...editingReview, rating: parseInt(e.target.value, 10) })}
                    >
                      <option value="5">★★★★★ (5 Stars)</option>
                      <option value="4">★★★★☆ (4 Stars)</option>
                      <option value="3">★★★☆☆ (3 Stars)</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Patron Testimonial Quote *</label>
                    <textarea
                      className="form-textarea"
                      rows={4}
                      required
                      value={editingReview.comment}
                      onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                      placeholder="Write the customer's testimonial comment..."
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Testimonial</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
