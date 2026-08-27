import { useState, useRef } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { EditIcon, CopyIcon, TrashIcon, CheckIcon, CloseIcon, UploadIcon } from './AdminIcons';
import { supabase } from '../supabase';

export default function ProductsManager() {
  const { data, saveProduct, deleteProduct } = useAdminData();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [slots, setSlots] = useState([]);
  const [pendingDeletes, setPendingDeletes] = useState([]);

  const filteredProducts = data.products.filter((p) => {
    const matchesCat = filterCat === 'all' || p.category === filterCat;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tag.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const extractStoragePath = (url) => {
    try {
      const marker = '/product-images/';
      const idx = url.indexOf(marker);
      if (idx === -1) return null;
      return url.slice(idx + marker.length).split('?')[0];
    } catch {
      return null;
    }
  };

  const revokeBlobs = (slotList) => {
    slotList.forEach((s) => {
      if (s.type === 'new' && s.url.startsWith('blob:')) {
        URL.revokeObjectURL(s.url);
      }
    });
  };

  const initSlots = (images) =>
    (Array.isArray(images) ? images : [])
      .filter(Boolean)
      .map((url) => ({ type: 'existing', url }));

  const handleOpenAddModal = () => {
    setSlots([]);
    setPendingDeletes([]);
    setUploadError('');
    setEditingProduct({
      id: 'shawl-' + Date.now(),
      name: '',
      category: 'pashmina',
      tag: '100% Pure Pashmina',
      desc: '',
      price: 'PKR 8,500',
      dimensions: '2.25m × 1.15m',
      weight: '190 grams (Featherlight)',
      origin: 'Himalayan Foothills',
      weave: 'Diamond Twill',
      warmth: 'High Warmth (Winter & Autumn)',
      enquiryText: 'New%20Shawl',
      visual: 'pashmina',
      imageUrl: '',
      images: [],
      inStock: true,
      featured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    const existing = Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : (product.imageUrl ? [product.imageUrl] : []);
    setSlots(initSlots(existing));
    setPendingDeletes([]);
    setUploadError('');
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    revokeBlobs(slots);
    setSlots([]);
    setPendingDeletes([]);
    setIsModalOpen(false);
  };

  const handleSlotFileSelect = (e, slotIndex) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP, GIF)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit.');
      return;
    }

    setUploadError('');
    const blobUrl = URL.createObjectURL(file);

    setSlots((prev) => {
      const next = [...prev];
      if (slotIndex < next.length) {
        if (next[slotIndex].type === 'new') URL.revokeObjectURL(next[slotIndex].url);
        if (next[slotIndex].type === 'existing') {
          setPendingDeletes((pd) => [...pd, next[slotIndex].url]);
        }
        next[slotIndex] = { type: 'new', url: blobUrl, file };
      } else {
        next.push({ type: 'new', url: blobUrl, file });
      }
      return next.slice(0, 5);
    });
  };

  const handleRemoveSlot = (slotIndex) => {
    setSlots((prev) => {
      const next = [...prev];
      const removed = next[slotIndex];
      if (removed.type === 'new') {
        URL.revokeObjectURL(removed.url);
      } else {
        setPendingDeletes((pd) => [...pd, removed.url]);
      }
      next.splice(slotIndex, 1);
      return next;
    });
  };

  const handleSetCover = (slotIndex) => {
    if (slotIndex === 0) return;
    setSlots((prev) => {
      const next = [...prev];
      const [item] = next.splice(slotIndex, 1);
      next.unshift(item);
      return next;
    });
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!editingProduct.name.trim()) {
      alert('Please enter a product name');
      return;
    }

    setIsSaving(true);
    setUploadError('');

    try {
      const finalSlots = [...slots];
      for (let i = 0; i < finalSlots.length; i++) {
        const slot = finalSlots[i];
        if (slot.type === 'new' && slot.file) {
          const fileExt = slot.file.name.split('.').pop() || 'jpg';
          const cleanFileName = `shawl_${Date.now()}_slot${i + 1}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
          const filePath = `products/${cleanFileName}`;

          const { error: uploadErr } = await supabase.storage
            .from('product-images')
            .upload(filePath, slot.file, { cacheControl: '3600', upsert: true });

          if (uploadErr) throw uploadErr;

          const { data: pubData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          finalSlots[i] = { type: 'existing', url: pubData.publicUrl };
          URL.revokeObjectURL(slot.url);
        }
      }

      if (pendingDeletes.length > 0) {
        const paths = pendingDeletes.map(extractStoragePath).filter(Boolean);
        if (paths.length > 0) {
          await supabase.storage.from('product-images').remove(paths);
        }
      }

      const finalUrls = finalSlots.map((s) => s.url).filter(Boolean);
      const enquiry = encodeURIComponent(editingProduct.name);
      await saveProduct({
        ...editingProduct,
        images: finalUrls,
        imageUrl: finalUrls[0] || '',
        enquiryText: enquiry
      });

      setSlots([]);
      setPendingDeletes([]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Save failed:', err);
      setUploadError(err.message || 'Upload failed. Please check your connection.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = (product) => {
    const dup = {
      ...product,
      id: 'shawl-' + Date.now(),
      name: `${product.name} (Copy)`,
      enquiryText: encodeURIComponent(`${product.name} (Copy)`)
    };
    saveProduct(dup);
  };

  const toggleStock = (product) => {
    saveProduct({ ...product, inStock: product.inStock === false ? true : false });
  };

  const currentProductImageList = slots.map((s) => s.url);



  return (
    <div className="products-manager">
      <div className="card-panel">
        <div className="card-header">
          <div className="card-title-group">
            <h2>Shawl Catalogue Management</h2>
            <p>Upload up to 5 pictures per piece (Cover + 4 gallery views) to Supabase Storage</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleOpenAddModal}>
            + Add New Shawl Weave
          </button>
        </div>

        <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search shawls by name, tag, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: '380px' }}
          />

          <select
            className="form-select"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            style={{ maxWidth: '200px' }}
          >
            <option value="all">All Categories ({data.products.length})</option>
            <option value="pashmina">Pashmina</option>
            <option value="shatoosh">Shatoosh</option>
            <option value="wool">Swati & Merino Wool</option>
            <option value="silk">Silk Stoles</option>
            <option value="cotton">Cotton & Blockprint</option>
          </select>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Photos</th>
                <th>Weave / Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Dimensions</th>
                <th>Weight & Origin</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--cream-muted)' }}>
                    <div style={{ fontSize: '1rem', marginBottom: '6px' }}>No shawls found in catalogue.</div>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleOpenAddModal}>
                      + Add Your First Shawl Weave
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const pImages = Array.isArray(product.images) && product.images.length > 0
                    ? product.images
                    : (product.imageUrl ? [product.imageUrl] : []);
                  const coverImg = pImages[0];

                  return (
                    <tr key={product.id}>
                      <td>
                        {coverImg ? (
                          <div style={{ position: 'relative', width: '52px', height: '52px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--line-light)', background: '#1c1514' }}>
                            <img
                              src={coverImg}
                              alt={product.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {pImages.length > 1 && (
                              <span style={{ position: 'absolute', bottom: '2px', right: '2px', background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '0.62rem', padding: '1px 4px', borderRadius: '3px', fontWeight: 600 }}>
                                +{pImages.length - 1}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div style={{ width: '52px', height: '52px', borderRadius: '6px', border: '1px dashed var(--line-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.66rem', color: 'var(--gold)', background: 'rgba(184,147,74,0.06)' }}>
                            {product.visual ? product.visual.substring(0, 4).toUpperCase() : 'MOTIF'}
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>{product.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--cream-muted)' }}>{product.tag}</div>
                      </td>
                      <td>
                        <span className="badge badge-gold">{product.category}</span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--gold)' }}>
                        {product.price}
                      </td>
                      <td style={{ fontSize: '0.84rem' }}>{product.dimensions}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--cream-muted)' }}>
                        <div>{product.weight}</div>
                        <div style={{ opacity: 0.8 }}>{product.origin}</div>
                      </td>
                      <td>
                        {product.inStock === false && (
                          <button
                            type="button"
                            onClick={() => toggleStock(product)}
                            className="badge badge-oxblood"
                            style={{ cursor: 'pointer', border: 'none' }}
                            title="Click to toggle stock status"
                          >
                            Out of Stock
                          </button>
                        )}
                        {product.featured && (
                          <span className="badge badge-gold" style={{ marginLeft: product.inStock === false ? '4px' : '0' }}>Featured</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenEditModal(product)}
                            title="Edit Shawl"
                          >
                            <EditIcon />
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleDuplicate(product)}
                            title="Duplicate Shawl"
                          >
                            <CopyIcon />
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              if (confirm(`Delete "${product.name}"?`)) {
                                deleteProduct(product.id, product.images || []);
                              }
                            }}
                            title="Delete Shawl"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editingProduct && (
        <div className="modal-backdrop" onClick={handleCancel}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '740px' }}>
            <div className="modal-header">
              <h3>{editingProduct.id.startsWith('shawl-') ? 'Add New Shawl' : `Edit: ${editingProduct.name}`}</h3>
              <button type="button" className="modal-close-btn" onClick={handleCancel}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className="modal-body">
                <div style={{ marginBottom: '22px', padding: '18px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line-light)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--cream-pure)' }}>Product Images (Up to 5 Photos)</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--cream-muted)' }}>
                        Pick photos — they upload to Supabase only when you click Save.
                      </div>
                    </div>
                    {isSaving && (
                      <span style={{ color: 'var(--gold)', fontSize: '0.78rem', fontWeight: 600 }}>
                        Uploading & saving...
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '12px' }}>
                    {[0, 1, 2, 3, 4].map((slotIdx) => {
                      const imgUrl = currentProductImageList[slotIdx];
                      const isCover = slotIdx === 0;

                      return (
                        <div
                          key={slotIdx}
                          style={{
                            border: isCover ? '2px solid var(--gold)' : '1px solid var(--line-light)',
                            borderRadius: '8px',
                            background: '#15100F',
                            position: 'relative',
                            aspectRatio: '1/1',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                          }}
                        >
                          {imgUrl ? (
                            <>
                              <img
                                src={imgUrl}
                                alt={`Slot ${slotIdx + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                              <div style={{ position: 'absolute', top: '4px', left: '4px', background: isCover ? 'var(--oxblood)' : 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.62rem', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>
                                {isCover ? 'COVER' : `#${slotIdx + 1}`}
                              </div>
                              <div style={{ position: 'absolute', bottom: '4px', right: '4px', display: 'flex', gap: '3px' }}>
                                {!isCover && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetCover(slotIdx)}
                                    title="Set as Cover"
                                    style={{ background: 'rgba(0,0,0,0.75)', border: 'none', color: 'var(--gold)', borderRadius: '3px', padding: '2px 4px', fontSize: '0.65rem', cursor: 'pointer' }}
                                  >
                                    ★
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSlot(slotIdx)}
                                  title="Remove Image"
                                  style={{ background: 'rgba(123,36,38,0.85)', border: 'none', color: '#fff', borderRadius: '3px', padding: '2px 4px', fontSize: '0.65rem', cursor: 'pointer' }}
                                >
                                  ✕
                                </button>
                              </div>
                            </>
                          ) : (
                            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', cursor: 'pointer', padding: '6px', textAlign: 'center' }}>
                              <span style={{ fontSize: '1.2rem', color: isCover ? 'var(--gold)' : 'var(--cream-muted)' }}>+</span>
                              <span style={{ fontSize: '0.68rem', color: isCover ? 'var(--gold)' : 'var(--cream-muted)', fontWeight: isCover ? 600 : 400 }}>
                                {isCover ? 'Cover Photo' : `Photo ${slotIdx + 1}`}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleSlotFileSelect(e, slotIdx)}
                                disabled={isSaving}
                              />
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {uploadError && (
                    <div style={{ color: '#E06C75', fontSize: '0.78rem', marginTop: '6px' }}>
                      {uploadError}
                    </div>
                  )}
                </div>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">Shawl / Weave Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      placeholder="e.g. Royal Ivory Pashmina Wrap"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    >
                      <option value="pashmina">Pashmina</option>
                      <option value="shatoosh">Shatoosh</option>
                      <option value="wool">Swati / Mountain Wool</option>
                      <option value="silk">Mulberry Silk</option>
                      <option value="cotton">Cotton / Blockprint</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price (PKR) *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      placeholder="e.g. PKR 12,500"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Product Tag / Badge</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingProduct.tag}
                      onChange={(e) => setEditingProduct({ ...editingProduct, tag: e.target.value })}
                      placeholder="e.g. 100% Pure Pashmina"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dimensions</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingProduct.dimensions}
                      onChange={(e) => setEditingProduct({ ...editingProduct, dimensions: e.target.value })}
                      placeholder="e.g. 2.5m × 1.35m"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Weight & Feel</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingProduct.weight}
                      onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                      placeholder="e.g. 180 grams (Featherlight)"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Geographic Origin</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingProduct.origin}
                      onChange={(e) => setEditingProduct({ ...editingProduct, origin: e.target.value })}
                      placeholder="e.g. Swat Valley, Khyber Pakhtunkhwa"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Weave Pattern</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingProduct.weave}
                      onChange={(e) => setEditingProduct({ ...editingProduct, weave: e.target.value })}
                      placeholder="e.g. Diamond Twill with Zari"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Visual Motif Fallback (When no photo)</label>
                    <select
                      className="form-select"
                      value={editingProduct.visual}
                      onChange={(e) => setEditingProduct({ ...editingProduct, visual: e.target.value })}
                    >
                      <option value="pashmina">Pashmina (Gold / Ivory Boteh)</option>
                      <option value="swati">Swati (Oxblood & Zari)</option>
                      <option value="shatoosh">Shatoosh (Deep Charcoal Grid)</option>
                      <option value="silk">Silk (Rose / Gold Lustre)</option>
                      <option value="merino">Merino (Slate Lines)</option>
                      <option value="blockprint">Blockprint (Indigo Geometric)</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Product Description</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={editingProduct.desc}
                      onChange={(e) => setEditingProduct({ ...editingProduct, desc: e.target.value })}
                      placeholder="Detailed craftsmanship description..."
                    />
                  </div>

                  <div className="form-group full-width" style={{ display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'center', marginTop: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={editingProduct.inStock !== false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                      />
                      <span>Item In Stock</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(editingProduct.featured)}
                        onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                      />
                      <span>Featured on Homepage Showcase</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Uploading & Saving...' : 'Save Shawl Weave'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
