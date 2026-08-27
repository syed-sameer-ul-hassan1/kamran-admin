import { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DATA } from '../initialData';
import { supabase } from '../supabase';
import { DEFAULT_SITE_CONTENT } from '../defaultSiteContent';

const AdminDataContext = createContext();
const STORAGE_KEY = 'kamran_shawls_admin_data_v1';

export function AdminDataProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved admin data', e);
    }
    return INITIAL_DATA;
  });

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', title = '') => {
    const defaultTitle =
      title ||
      (type === 'success'
        ? 'Changes Saved Live'
        : type === 'error'
        ? 'Action Failed'
        : type === 'warning'
        ? 'Notice'
        : 'Update');

    setToast({
      id: Date.now(),
      message,
      type,
      title: defaultTitle
    });

    setTimeout(() => {
      setToast((current) => (current && Date.now() - current.id >= 3900 ? null : current));
    }, 4200);
  };

  const closeToast = () => setToast(null);

  const fetchFromSupabase = async () => {
    try {
      setLoading(true);
      const [
        productsRes,
        settingsRes,
        heroRes,
        materialsRes,
        craftRes,
        checkpointsRes,
        testimonialsRes,
        faqsRes,
        inquiriesRes,
        siteContentRes
      ] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('settings').select('*').eq('id', 'main').maybeSingle(),
        supabase.from('hero').select('*').eq('id', 'main').maybeSingle(),
        supabase.from('materials').select('*').order('sort_order', { ascending: true }),
        supabase.from('craft_steps').select('*').order('sort_order', { ascending: true }),
        supabase.from('inspection_checkpoints').select('*').order('sort_order', { ascending: true }),
        supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
        supabase.from('faqs').select('*').order('sort_order', { ascending: true }),
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('site_content').select('*').eq('id', 'main').maybeSingle()
      ]);

      const updated = { ...data };

      if (productsRes.data) {
        updated.products = productsRes.data.map((p) => {
          const imagesList = p.images && Array.isArray(p.images) && p.images.length > 0
            ? p.images
            : (p.image_url ? [p.image_url] : []);
          return {
            id: p.id,
            name: p.name,
            category: p.category,
            tag: p.tag,
            desc: p.desc,
            price: p.price,
            dimensions: p.dimensions,
            weight: p.weight,
            origin: p.origin,
            weave: p.weave,
            warmth: p.warmth,
            enquiryText: p.enquiry_text,
            visual: p.visual || 'pashmina',
            imageUrl: imagesList[0] || p.image_url || '',
            images: imagesList,
            inStock: p.in_stock !== false,
            featured: Boolean(p.featured)
          };
        });
      }

      if (settingsRes.data) {
        const s = settingsRes.data;
        updated.settings = {
          siteName: s.site_name || updated.settings.siteName,
          tagline: s.tagline || updated.settings.tagline,
          phonePrimary: s.phone_primary || updated.settings.phonePrimary,
          phoneSecondary: s.phone_secondary || updated.settings.phoneSecondary,
          email: s.email || updated.settings.email,
          address: s.address || updated.settings.address,
          whatsappLink: s.whatsapp_link || updated.settings.whatsappLink,
          instagramUrl: s.instagram_url || updated.settings.instagramUrl,
          tiktokUrl: s.tiktok_url || updated.settings.tiktokUrl,
          timingsSummer: s.timings_summer || updated.settings.timingsSummer,
          timingsWinter: s.timings_winter || updated.settings.timingsWinter,
          storefrontUrl: s.storefront_url || updated.settings.storefrontUrl || 'http://localhost:5174/'
        };
      }

      if (heroRes.data) {
        const h = heroRes.data;
        updated.hero = {
          title: h.title || updated.hero.title,
          lede: h.lede || updated.hero.lede,
          ctaText: h.cta_text || updated.hero.ctaText,
          whatsappCtaText: h.whatsapp_cta_text || updated.hero.whatsappCtaText
        };
      }

      if (materialsRes.data && materialsRes.data.length > 0) {
        updated.materials = materialsRes.data.map((m) => ({
          id: m.id,
          name: m.name,
          micron: m.micron,
          feel: m.feel,
          warmth: m.warmth,
          warmthPercent: m.warmth_percent,
          description: m.description,
          idealFor: m.ideal_for
        }));
      }

      if (craftRes.data && craftRes.data.length > 0) {
        updated.craftSteps = craftRes.data.map((c) => ({
          number: c.number,
          stage: c.stage,
          title: c.title,
          desc: c.desc,
          details: c.details || []
        }));
      }

      if (checkpointsRes.data && checkpointsRes.data.length > 0) {
        updated.inspectionCheckpoints = checkpointsRes.data.map((cp) => ({
          num: cp.num,
          title: cp.title,
          desc: cp.desc
        }));
      }

      if (testimonialsRes.data) {
        updated.testimonials = testimonialsRes.data.map((t) => ({
          id: t.id,
          name: t.name,
          city: t.city,
          shawl: t.shawl,
          comment: t.comment,
          rating: t.rating || 5,
          productId: t.product_id || null
        }));
      }

      if (faqsRes.data) {
        updated.faqs = faqsRes.data.map((f) => ({
          id: f.id,
          question: f.question,
          answer: f.answer
        }));
      }

      if (inquiriesRes.data) {
        setInquiries(inquiriesRes.data);
      }

      if (siteContentRes.data && siteContentRes.data.data) {
        updated.siteContent = {
          ...DEFAULT_SITE_CONTENT,
          ...siteContentRes.data.data
        };
      } else if (!updated.siteContent) {
        updated.siteContent = DEFAULT_SITE_CONTENT;
      }

      setData(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Supabase fetch failed, using cached data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFromSupabase();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [data]);

  const updateSettings = async (newSettings) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));

    try {
      const { error } = await supabase.from('settings').upsert({
        id: 'main',
        site_name: newSettings.siteName,
        tagline: newSettings.tagline,
        phone_primary: newSettings.phonePrimary,
        phone_secondary: newSettings.phoneSecondary,
        email: newSettings.email,
        address: newSettings.address,
        whatsapp_link: newSettings.whatsappLink,
        instagram_url: newSettings.instagramUrl,
        tiktok_url: newSettings.tiktokUrl,
        timings_summer: newSettings.timingsSummer,
        timings_winter: newSettings.timingsWinter,
        storefront_url: newSettings.storefrontUrl,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      showToast('Store contact & location settings saved live to Supabase', 'success', 'Settings Saved');
    } catch (e) {
      console.error(e);
      showToast(e.message || 'Failed to update settings in Supabase', 'error', 'Save Failed');
    }
  };

  const updateHero = async (newHero) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...newHero }
    }));

    try {
      const { error } = await supabase.from('hero').upsert({
        id: 'main',
        title: newHero.title,
        lede: newHero.lede,
        cta_text: newHero.ctaText,
        whatsapp_cta_text: newHero.whatsappCtaText,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      showToast('Hero headline & introduction updated on live store', 'success', 'Hero Saved');
    } catch (e) {
      console.error(e);
      showToast(e.message || 'Failed to save hero headline', 'error', 'Save Failed');
    }
  };

  const saveProduct = async (product) => {
    const imagesList = Array.isArray(product.images) && product.images.length > 0
      ? product.images.filter(Boolean)
      : (product.imageUrl ? [product.imageUrl] : []);
    const coverUrl = imagesList[0] || product.imageUrl || '';

    const sanitizedProduct = {
      ...product,
      images: imagesList,
      imageUrl: coverUrl
    };

    setData((prev) => {
      const existsIndex = prev.products.findIndex((p) => p.id === sanitizedProduct.id);
      let updatedProducts = [...prev.products];
      if (existsIndex >= 0) {
        updatedProducts[existsIndex] = sanitizedProduct;
      } else {
        updatedProducts.unshift(sanitizedProduct);
      }
      return { ...prev, products: updatedProducts };
    });

    try {
      const { error } = await supabase.from('products').upsert({
        id: sanitizedProduct.id,
        name: sanitizedProduct.name,
        category: sanitizedProduct.category,
        tag: sanitizedProduct.tag,
        desc: sanitizedProduct.desc,
        price: sanitizedProduct.price,
        dimensions: sanitizedProduct.dimensions,
        weight: sanitizedProduct.weight,
        origin: sanitizedProduct.origin,
        weave: sanitizedProduct.weave,
        warmth: sanitizedProduct.warmth,
        enquiry_text: sanitizedProduct.enquiryText,
        visual: sanitizedProduct.visual || 'pashmina',
        image_url: coverUrl,
        images: imagesList,
        in_stock: sanitizedProduct.inStock !== false,
        featured: Boolean(sanitizedProduct.featured),
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      showToast(`Shawl "${sanitizedProduct.name}" saved live to catalogue`, 'success', 'Product Saved');
    } catch (e) {
      console.error(e);
      showToast(e.message || `Failed to save "${sanitizedProduct.name}"`, 'error', 'Save Failed');
    }
  };

  const deleteProduct = async (id, images = []) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id)
    }));

    try {
      if (images.length > 0) {
        const paths = images
          .map((url) => {
            try {
              const marker = '/product-images/';
              const idx = url.indexOf(marker);
              if (idx === -1) return null;
              return url.slice(idx + marker.length).split('?')[0];
            } catch {
              return null;
            }
          })
          .filter(Boolean);

        if (paths.length > 0) {
          await supabase.storage.from('product-images').remove(paths);
        }
      }

      await supabase.from('products').delete().eq('id', id);
      showToast('Product & all images deleted from Supabase', 'warning');
    } catch (e) {
      console.error(e);
      showToast('Deleted locally (storage cleanup may have failed)', 'warning');
    }
  };

  const saveMaterial = async (material) => {
    setData((prev) => {
      const idx = prev.materials.findIndex((m) => m.id === material.id);
      let updated = [...prev.materials];
      if (idx >= 0) updated[idx] = material;
      else updated.push(material);
      return { ...prev, materials: updated };
    });

    try {
      await supabase.from('materials').upsert({
        id: material.id,
        name: material.name,
        micron: material.micron,
        feel: material.feel,
        warmth: material.warmth,
        warmth_percent: material.warmthPercent,
        description: material.description,
        ideal_for: material.idealFor
      });
      showToast(`Material "${material.name}" synced to Supabase`);
    } catch (e) {
      console.error(e);
    }
  };

  const saveCraftStep = async (step) => {
    setData((prev) => {
      const idx = prev.craftSteps.findIndex((s) => s.number === step.number);
      let updated = [...prev.craftSteps];
      if (idx >= 0) updated[idx] = step;
      else updated.push(step);
      return { ...prev, craftSteps: updated };
    });

    try {
      await supabase.from('craft_steps').upsert({
        number: step.number,
        stage: step.stage,
        title: step.title,
        desc: step.desc,
        details: step.details || []
      });
      showToast(`Craft Step ${step.number} synced to Supabase`);
    } catch (e) {
      console.error(e);
    }
  };

  const saveInspectionCheckpoint = async (cp) => {
    setData((prev) => {
      const idx = prev.inspectionCheckpoints.findIndex((i) => i.num === cp.num);
      let updated = [...prev.inspectionCheckpoints];
      if (idx >= 0) updated[idx] = cp;
      else updated.push(cp);
      return { ...prev, inspectionCheckpoints: updated };
    });

    try {
      await supabase.from('inspection_checkpoints').upsert({
        num: cp.num,
        title: cp.title,
        desc: cp.desc
      });
      showToast(`Checkpoint ${cp.num} synced to Supabase`);
    } catch (e) {
      console.error(e);
    }
  };

  const saveTestimonial = async (testimonial) => {
    setData((prev) => {
      const idx = prev.testimonials.findIndex((t) => t.id === testimonial.id);
      let updated = [...prev.testimonials];
      if (idx >= 0) updated[idx] = testimonial;
      else updated.unshift(testimonial);
      return { ...prev, testimonials: updated };
    });

    try {
      await supabase.from('testimonials').upsert({
        id: testimonial.id,
        name: testimonial.name,
        city: testimonial.city,
        shawl: testimonial.shawl,
        comment: testimonial.comment,
        rating: testimonial.rating || 5,
        product_id: testimonial.productId || testimonial.product_id || null
      });
      showToast(`Review from "${testimonial.name}" synced to Supabase`, 'success', 'Review Saved');
    } catch (e) {
      console.error(e);
      showToast('Failed to save review to Supabase', 'error', 'Save Failed');
    }
  };

  const deleteTestimonial = async (id) => {
    setData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((t) => t.id !== id)
    }));

    try {
      await supabase.from('testimonials').delete().eq('id', id);
      showToast('Review removed from Supabase', 'warning');
    } catch (e) {
      console.error(e);
    }
  };

  const saveFaq = async (faq) => {
    setData((prev) => {
      const idx = prev.faqs.findIndex((f) => f.id === faq.id);
      let updated = [...prev.faqs];
      if (idx >= 0) updated[idx] = faq;
      else updated.push(faq);
      return { ...prev, faqs: updated };
    });

    try {
      await supabase.from('faqs').upsert({
        id: faq.id,
        question: faq.question,
        answer: faq.answer
      });
      showToast('FAQ synced to Supabase');
    } catch (e) {
      console.error(e);
    }
  };

  const deleteFaq = async (id) => {
    setData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((f) => f.id !== id)
    }));

    try {
      await supabase.from('faqs').delete().eq('id', id);
      showToast('FAQ deleted from Supabase', 'warning');
    } catch (e) {
      console.error(e);
    }
  };

  const updateInquiryStatus = async (id, status) => {
    setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
    try {
      await supabase.from('inquiries').update({ status }).eq('id', id);
      showToast(`Inquiry marked as ${status}`);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteInquiry = async (id) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    try {
      await supabase.from('inquiries').delete().eq('id', id);
      showToast('Inquiry deleted from database', 'warning');
    } catch (e) {
      console.error(e);
      showToast('Failed to delete inquiry', 'warning');
    }
  };

  const updateSiteContent = async (sectionKey, newSectionData) => {
    const currentSiteContent = data.siteContent || DEFAULT_SITE_CONTENT;
    const nextContent = {
      ...currentSiteContent,
      [sectionKey]: {
        ...(currentSiteContent[sectionKey] || {}),
        ...newSectionData
      }
    };

    setData((prev) => ({
      ...prev,
      siteContent: nextContent
    }));

    try {
      const { error } = await supabase.from('site_content').upsert({
        id: 'main',
        data: nextContent,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      showToast(`"${sectionKey}" text & button changes saved live`, 'success', 'Changes Saved Live');
    } catch (e) {
      console.error(e);
      showToast(e.message || `Failed to update "${sectionKey}" on Supabase`, 'error', 'Save Failed');
    }
  };

  const saveAllSiteContent = async (fullContent) => {
    setData((prev) => ({
      ...prev,
      siteContent: fullContent
    }));

    try {
      const { error } = await supabase.from('site_content').upsert({
        id: 'main',
        data: fullContent,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      showToast('All website page text & button labels updated live', 'success', 'All Content Saved');
    } catch (e) {
      console.error(e);
      showToast(e.message || 'Failed to save all page content', 'error', 'Save Failed');
    }
  };


  const importFullData = (newData) => {
    setData(newData);
    showToast('Full dataset imported successfully!', 'success');
  };

  const resetToDefaults = () => {
    setData(INITIAL_DATA);
    showToast('Reset to original default data', 'info');
  };

  return (
    <AdminDataContext.Provider
      value={{
        data,
        inquiries,
        loading,
        toast,
        showToast,
        closeToast,
        fetchFromSupabase,
        updateSettings,
        updateHero,
        saveProduct,
        deleteProduct,
        saveMaterial,
        saveCraftStep,
        saveInspectionCheckpoint,
        saveTestimonial,
        deleteTestimonial,
        saveFaq,
        deleteFaq,
        updateInquiryStatus,
        deleteInquiry,
        updateSiteContent,
        saveAllSiteContent,
        importFullData,
        resetToDefaults
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
}
