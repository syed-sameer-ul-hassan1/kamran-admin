import { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';

export default function CraftManager() {
  const { data, saveCraftStep, saveInspectionCheckpoint } = useAdminData();
  const [editingStep, setEditingStep] = useState(null);
  const [editingCheckpoint, setEditingCheckpoint] = useState(null);

  const handleSaveStep = (e) => {
    e.preventDefault();
    saveCraftStep(editingStep);
    setEditingStep(null);
  };

  const handleSaveCheckpoint = (e) => {
    e.preventDefault();
    saveInspectionCheckpoint(editingCheckpoint);
    setEditingCheckpoint(null);
  };

  return (
    <div className="craft-manager">
      <div className="card-panel">
        <div className="card-header">
          <div className="card-title-group">
            <h2>The 6-Stage Craftsmanship Journey</h2>
            <p>Manage the step-by-step artisan wool and handloom narrative</p>
          </div>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Step #</th>
                <th>Stage Name</th>
                <th>Heading Title</th>
                <th>Key Points</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.craftSteps.map((step) => (
                <tr key={step.number}>
                  <td><span className="badge badge-gold">{step.number}</span></td>
                  <td><strong>{step.stage}</strong></td>
                  <td>{step.title}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--cream-muted)' }}>
                    {step.details ? step.details.length : 0} inspection bullets
                  </td>
                  <td>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingStep({ ...step, detailsText: step.details ? step.details.join('\n') : '' })}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-panel">
        <div className="card-header">
          <div className="card-title-group">
            <h2>4-Point In-Store Quality Inspection Protocol</h2>
            <p>Edit the in-store quality assurance checkpoints displayed in Nathia Gali</p>
          </div>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Checkpoint #</th>
                <th>Protocol Title</th>
                <th>Inspection Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.inspectionCheckpoints.map((cp) => (
                <tr key={cp.num}>
                  <td><span className="badge badge-gold">{cp.num}</span></td>
                  <td><strong>{cp.title}</strong></td>
                  <td style={{ fontSize: '0.86rem', color: 'var(--cream-muted)' }}>{cp.desc}</td>
                  <td>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingCheckpoint({ ...cp })}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingStep && (
        <div className="modal-backdrop" onClick={() => setEditingStep(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Craft Step: {editingStep.number}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setEditingStep(null)}>✕</button>
            </div>
            <form onSubmit={handleSaveStep}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Step Number (e.g. 01)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingStep.number}
                      onChange={(e) => setEditingStep({ ...editingStep, number: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stage Subtitle</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingStep.stage}
                      onChange={(e) => setEditingStep({ ...editingStep, stage: e.target.value })}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Stage Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingStep.title}
                      onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={editingStep.desc}
                      onChange={(e) => setEditingStep({ ...editingStep, desc: e.target.value })}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Checklist Bullet Points (One per line)</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={editingStep.detailsText || (editingStep.details ? editingStep.details.join('\n') : '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingStep({
                          ...editingStep,
                          detailsText: val,
                          details: val.split('\n').map((l) => l.trim()).filter(Boolean)
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingStep(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Step</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingCheckpoint && (
        <div className="modal-backdrop" onClick={() => setEditingCheckpoint(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Inspection Checkpoint {editingCheckpoint.num}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setEditingCheckpoint(null)}>✕</button>
            </div>
            <form onSubmit={handleSaveCheckpoint}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Number (e.g. 01)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingCheckpoint.num}
                      onChange={(e) => setEditingCheckpoint({ ...editingCheckpoint, num: e.target.value })}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Protocol Heading</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingCheckpoint.title}
                      onChange={(e) => setEditingCheckpoint({ ...editingCheckpoint, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={editingCheckpoint.desc}
                      onChange={(e) => setEditingCheckpoint({ ...editingCheckpoint, desc: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingCheckpoint(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Checkpoint</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
