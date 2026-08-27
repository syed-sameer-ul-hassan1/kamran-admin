import { DEFAULT_SITE_CONTENT } from './defaultSiteContent';

export const INITIAL_DATA = {
  settings: {
    siteName: 'Kamran Shawls',
    tagline: 'Handwoven Himalayan Shawls & Pure Pashmina',
    phonePrimary: '+92 300 2121224',
    phoneSecondary: '+92 349 9134377',
    email: 'hello@kamranshawls.com.pk',
    address: 'Main Bazaar, Nathia Gali, District Abbottabad, KPK, Pakistan',
    whatsappLink: 'https://wa.me/923002121224?text=Hello%20Kamran%20Shawls%2C%20I%27d%20like%20to%20know%20more%20about%20your%20collection.',
    instagramUrl: 'https://instagram.com/kamranshawls',
    tiktokUrl: 'https://tiktok.com/@kamranshawls',
    timingsSummer: '10:00 AM – 10:00 PM Daily (May – Oct)',
    timingsWinter: '11:00 AM – 8:00 PM Daily (Nov – Apr)',
    storefrontUrl: 'http://localhost:5173/'
  },
  hero: {
    title: 'Shawls chosen carefully, worn for years',
    lede: 'Kamran Shawls curates authentic hand-finished Pashmina, Shatoosh and Swati weaves directly from master artisans. Every piece is individually inspected in-store for thread density, finish, and authentic warmth.',
    ctaText: 'Explore Collection',
    whatsappCtaText: 'Enquire on WhatsApp'
  },
  siteContent: DEFAULT_SITE_CONTENT,
  products: [],
  materials: [
    {
      id: 'pashmina',
      name: 'Pure Pashmina',
      micron: '12 – 15 Microns',
      feel: 'Featherlight & Cloud-Soft',
      warmth: '9.5 / 10',
      warmthPercent: 95,
      description: 'Harvested exclusively from the underbelly of high-altitude Himalayan mountain goats. Unrivalled insulation despite being almost weightless.',
      idealFor: 'Formal Winter Events, Weddings & Luxury Everyday Drape'
    },
    {
      id: 'shatoosh',
      name: 'Royal Shatoosh',
      micron: '9 – 11 Microns',
      feel: 'Gossamer Fine & Weightless',
      warmth: '10 / 10',
      warmthPercent: 100,
      description: 'The finest natural animal fiber known to mankind. King of weaves with supreme thermal density that easily passes through a small ring.',
      idealFor: 'Heirloom Keepsakes, Connoisseurs & Deep Freezing Temperatures'
    },
    {
      id: 'swati',
      name: 'Swati Mountain Wool',
      micron: '24 – 28 Microns',
      feel: 'Substantial, Crisp & Structured',
      warmth: '9.0 / 10',
      warmthPercent: 90,
      description: 'Spun from hardy mountain sheep wool in Swat Valley. Famous for its thick density, weather resistance, and ornate border weaves.',
      idealFor: 'Men’s Traditional Chadars, Cold Outdoor Evenings & Lifetime Wear'
    },
    {
      id: 'silk-merino',
      name: 'Mulberry Silk & Merino',
      micron: '17 – 20 Microns',
      feel: 'Lustrous Sheen & Fluid Drape',
      warmth: '7.5 / 10',
      warmthPercent: 75,
      description: 'A blend of raw Chinese/Kashmiri silk with Australian extrafine merino. Radiant in low light with a flowing silhouette.',
      idealFor: 'Formal Evening Soirées, Light Winter Parties & Gifting'
    }
  ],
  craftSteps: [
    {
      number: '01',
      stage: 'Raw Fleece Harvesting',
      title: 'Combed, Never Sheared',
      desc: 'In spring, mountain herders gently hand-comb the soft underbelly fleece of high-altitude mountain goats without harming the animal.',
      details: ['Hand-combed during natural moulting season', 'Zero synthetic polyester or nylon blending', 'Cruelty-free ethical mountain sourcing']
    },
    {
      number: '02',
      stage: 'Artisanal Hand-Spinning',
      title: 'Spun on Wooden Charkha Wheels',
      desc: 'Delicate high-altitude fleece cannot withstand harsh industrial automated spinners. Skilled village craftswomen spin the fiber by hand to maintain natural elasticity and warmth.',
      details: ['Preserves natural air pockets between fibers', 'Gentle yarn tension prevents breakage', 'Traditional wooden wheel craftsmanship']
    },
    {
      number: '03',
      stage: 'Handloom Weaving',
      title: 'Interlaced Thread by Thread',
      desc: 'Each shawl is painstakingly woven on traditional wooden pit looms or frame looms. A master weaver spends anywhere from 4 to 45 days completing a single shawl.',
      details: ['Intricate Boteh (paisley) and Zari borders', 'High warp-to-weft thread count', 'Distinctive organic handloom selvage edge']
    },
    {
      number: '04',
      stage: 'Natural Botanical Dyeing',
      title: 'Gentle Mineral & Vegetable Pigments',
      desc: 'To preserve the soft, sensitive fleece, yarns are immersed in warm dye vats infused with natural walnut husks, madder roots, indigo, and gentle botanical extracts.',
      details: ['Colorfast, non-fading hues', 'Chemical-free gentle treatment', 'Rich, deep organic color tones']
    },
    {
      number: '05',
      stage: 'Hand-Finishing & Needlework',
      title: 'Rolled Fringes & Sozni Needles',
      desc: 'Edges are hand-twisted and knotted into traditional eyelashes. For embroidered pieces, master needle-smiths use single-strand silk threads to hand-stitch ornate floral motifs.',
      details: ['Hand-rolled and knotted fringes', 'Optional Sozni & Tilla needlework', 'Clean, refined reverse-side finish']
    },
    {
      number: '06',
      stage: '4-Point Nathia Gali Inspection',
      title: 'In-Store Verification Before Display',
      desc: 'Every shawl entering our Nathia Gali boutique is hand-examined under bright light: testing weight, checking weave uniformity, ensuring border alignment, and steam-pressing.',
      details: ['100% purity and weight verification', 'Gentle cedar press and protective packing', 'Direct nationwide tracked courier dispatch']
    }
  ],
  inspectionCheckpoints: [
    {
      num: '01',
      title: 'Fiber Micron & Weight Audit',
      desc: 'Testing density and weight on precision jeweler scales to verify authentic fleece grade.'
    },
    {
      num: '02',
      title: 'Light Transparency & Weft Uniformity',
      desc: 'Examining the shawl over diffused backlight to ensure uniform weave interlacing without gaps.'
    },
    {
      num: '03',
      title: 'Fringe & Border Alignment',
      desc: 'Verifying that every hand-rolled edge and Zari border sits perfectly parallel and secure.'
    },
    {
      num: '04',
      title: 'Steam Press & Cedar Packing',
      desc: 'Gentle steam pressing and wrapping in breathable cotton cases with organic cedar protection.'
    }
  ],
  testimonials: [],
  faqs: []
};
