/**
 * Dynamic Sitemap Generator for Karni Exim
 * Fetches all products from Firebase and generates sitemap.xml
 * Run: node generate-sitemap.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClUG-ZXpH7KMrIWQXKfRNZcuOpkYDtQ-M",
  authDomain: "karni-exim.firebaseapp.com",
  projectId: "karni-exim",
  storageBucket: "karni-exim.firebasestorage.app",
  messagingSenderId: "929893887316",
  appId: "1:929893887316:web:40f6ee89e84b02cfd20cfb",
  measurementId: "G-QV03L2SKMP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BASE_URL = 'https://karni-exim-new.netlify.app';

async function generateSitemap() {
  try {
    console.log('🔥 Fetching products from Firebase...');
    
    // Fetch all products
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`✅ Found ${products.length} products`);
    
    // Static pages
    const staticPages = [
      { loc: '/', priority: '1.0', changefreq: 'weekly' },
      { loc: '/products', priority: '0.9', changefreq: 'daily' },
      { loc: '/about', priority: '0.8', changefreq: 'monthly' },
      { loc: '/contact', priority: '0.8', changefreq: 'monthly' },
      { loc: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
      { loc: '/terms-of-service', priority: '0.5', changefreq: 'yearly' },
    ];
    
    // Get current date in ISO format
    const lastmod = new Date().toISOString().split('T')[0];
    
    // Build sitemap XML
    let sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemapXml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    sitemapXml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
    
    // Add static pages
    staticPages.forEach(page => {
      sitemapXml += '  <url>\n';
      sitemapXml += `    <loc>${BASE_URL}${page.loc}</loc>\n`;
      sitemapXml += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemapXml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemapXml += `    <priority>${page.priority}</priority>\n`;
      sitemapXml += '  </url>\n';
    });
    
    // Add product pages
    products.forEach(product => {
      sitemapXml += '  <url>\n';
      sitemapXml += `    <loc>${BASE_URL}/product/${product.id}</loc>\n`;
      sitemapXml += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemapXml += `    <changefreq>weekly</changefreq>\n`;
      sitemapXml += `    <priority>0.8</priority>\n`;
      
      // Add image sitemap data if product has images
      if (product.mainImage) {
        sitemapXml += '    <image:image>\n';
        sitemapXml += `      <image:loc>${product.mainImage}</image:loc>\n`;
        sitemapXml += `      <image:title>${escapeXml(product.name || 'Product Image')}</image:title>\n`;
        if (product.description) {
          sitemapXml += `      <image:caption>${escapeXml(product.description.substring(0, 100))}</image:caption>\n`;
        }
        sitemapXml += '    </image:image>\n';
      }
      
      sitemapXml += '  </url>\n';
    });
    
    // Add category pages (dynamically based on products)
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    categories.forEach(category => {
      sitemapXml += '  <url>\n';
      sitemapXml += `    <loc>${BASE_URL}/products?category=${encodeURIComponent(category)}</loc>\n`;
      sitemapXml += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemapXml += `    <changefreq>weekly</changefreq>\n`;
      sitemapXml += `    <priority>0.7</priority>\n`;
      sitemapXml += '  </url>\n';
    });
    
    sitemapXml += '</urlset>';
    
    // Write to public/sitemap.xml
    const sitemapPath = join(process.cwd(), 'public', 'sitemap.xml');
    writeFileSync(sitemapPath, sitemapXml, 'utf8');
    
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`📄 Total URLs: ${staticPages.length + products.length + categories.length}`);
    console.log(`   - Static pages: ${staticPages.length}`);
    console.log(`   - Product pages: ${products.length}`);
    console.log(`   - Category pages: ${categories.length}`);
    console.log(`📁 Location: ${sitemapPath}`);
    console.log(`\n🔗 Submit to Google: https://search.google.com/search-console`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Helper function to escape XML special characters
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Run the generator
generateSitemap();
