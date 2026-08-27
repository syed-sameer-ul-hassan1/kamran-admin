import { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';

export default function FaqsManager() {
  const { data, saveFaq, deleteFaq } = useAdminData();
  const [editingFaq, setEditingFaq] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingFaq({
      id: 'faq-' + Date.now(),
      question: '',
      answer: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq) => {
    setEditingFaq({ ...faq });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editingFaq.question.trim() || !editingFaq.answer.trim()) {
      alert('Please fill in both question and answer');
      return;
    }
    saveFaq(editingFaq);
    setIsModalOpen(false);
  };

  return (
    <div className="faqs-manager">
      <div className="card-panel">
        <div className="card-header">
          <div className="card-title-group">
            <h2>Frequently Asked Questions (FAQs)</h2>
            <p>Manage client support answers for purity testing, care instructions, and delivery timelines</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
            + Add New FAQ
          </button>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Answer Summary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!data.faqs || data.faqs.length === 0) ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--cream-muted)' }}>
                    No FAQs added yet. Click "+ Add New FAQ" to create answers for client support.
                  </td>
                </tr>
              ) : (
                data.faqs.map((faq) => (
                  <tr key={faq.id}>
                    <td style={{ fontWeight: 600, color: 'var(--cream-pure)', maxWidth: '280px' }}>
                      {faq.question}
                    </td>
                    <td style={{ fontSize: '0.86rem', color: 'var(--cream-muted)', maxWidth: '400px' }}>
                      {faq.answer}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(faq)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            if (confirm(`Delete FAQ: "${faq.question}"?`)) {
                              deleteFaq(faq.id);
                            }
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editingFaq && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingFaq.id.startsWith('faq-') ? 'Add New FAQ' : 'Edit FAQ'}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">Question *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={editingFaq.question}
                      onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                      placeholder="e.g. How can I verify that my Pashmina is pure?"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Answer *</label>
                    <textarea
                      className="form-textarea"
                      rows={5}
                      required
                      value={editingFaq.answer}
                      onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                      placeholder="Detailed answer for clients..."
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save FAQ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
