import { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';

export default function MaterialsManager() {
  const { data, saveMaterial } = useAdminData();
  const [editingMaterial, setEditingMaterial] = useState(null);

  const handleEdit = (mat) => {
    setEditingMaterial({ ...mat });
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveMaterial(editingMaterial);
    setEditingMaterial(null);
  };

  return (
    <div className="materials-manager">
      <div className="card-panel">
        <div className="card-header">
          <div className="card-title-group">
            <h2>Fiber Knowledge & Micron Matrix</h2>
            <p>Edit natural fleece profiles, warmth ratings, tactile descriptions, and suited-for labels</p>
          </div>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Fleece / Name</th>
                <th>Micron Grade</th>
                <th>Tactile Feel</th>
                <th>Warmth Index</th>
                <th>Best Suited For</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.materials.map((mat) => (
                <tr key={mat.id || mat.name}>
                  <td><strong>{mat.name}</strong></td>
                  <td><span className="badge badge-gold">{mat.micron}</span></td>
                  <td>{mat.feel}</td>
                  <td style={{ fontWeight: 600, color: 'var(--gold)' }}>{mat.warmth}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--cream-muted)' }}>{mat.idealFor}</td>
                  <td>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleEdit(mat)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingMaterial && (
        <div className="modal-backdrop" onClick={() => setEditingMaterial(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Fiber: {editingMaterial.name}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setEditingMaterial(null)}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Fleece Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={editingMaterial.name}
                      onChange={(e) => setEditingMaterial({ ...editingMaterial, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Micron Grade *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={editingMaterial.micron}
                      onChange={(e) => setEditingMaterial({ ...editingMaterial, micron: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tactile Feel</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingMaterial.feel}
                      onChange={(e) => setEditingMaterial({ ...editingMaterial, feel: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Warmth Rating Text</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingMaterial.warmth}
                      onChange={(e) => setEditingMaterial({ ...editingMaterial, warmth: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Warmth Progress Bar Percentage (0 - 100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="form-input"
                      value={editingMaterial.warmthPercent}
                      onChange={(e) => setEditingMaterial({ ...editingMaterial, warmthPercent: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Best Suited For (Tags/Audience)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingMaterial.idealFor}
                      onChange={(e) => setEditingMaterial({ ...editingMaterial, idealFor: e.target.value })}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Fiber Description</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={editingMaterial.description}
                      onChange={(e) => setEditingMaterial({ ...editingMaterial, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingMaterial(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Fiber Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
