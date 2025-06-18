# Domain Setup Guide: Connect karniexim.com to Netlify

## 🌐 Current Status
- **Website**: https://karni-exim-new.netlify.app/
- **Domain**: karniexim.com (Namecheap)
- **Goal**: Connect custom domain to Netlify deployment

## 📋 Step-by-Step Instructions

### Step 1: Add Custom Domain in Netlify

1. **Login to Netlify Dashboard**
   - Go to [netlify.com](https://netlify.com)
   - Navigate to your site: `karni-exim-new`

2. **Add Custom Domain**
   - Go to **Site settings** → **Domain management**
   - Click **Add custom domain**
   - Enter: `karniexim.com`
   - Click **Verify**
   - Also add: `www.karniexim.com` (recommended)

### Step 2: Configure DNS in Namecheap

3. **Login to Namecheap Dashboard**
   - Go to [namecheap.com](https://namecheap.com)
   - Navigate to **Domain List** → **Manage** (for karniexim.com)

4. **Update DNS Settings**
   - Go to **Advanced DNS** tab
   - Delete existing A and CNAME records (if any)
   - Add these records:

   ```
   Type    Host    Value                           TTL
   ----------------------------------------------------------------
   A       @       75.2.60.5                      Automatic
   CNAME   www     karni-exim-new.netlify.app      Automatic
   ```

   **Alternative Method (Netlify DNS - Recommended):**
   ```
   Type        Host    Value                       TTL
   ----------------------------------------------------------------
   CNAME       @       apex-loadbalancer.netlify.com   Automatic
   CNAME       www     karni-exim-new.netlify.app      Automatic
   ```

### Step 3: SSL Certificate Setup

5. **Enable HTTPS in Netlify**
   - In Netlify dashboard → **Domain settings**
   - Under **HTTPS**, click **Verify DNS configuration**
   - Click **Provision certificate** (Let's Encrypt - Free)
   - Wait for SSL provisioning (5-10 minutes)

### Step 4: Force HTTPS Redirect

6. **Configure Redirect Settings**
   - In Netlify → **Domain settings**
   - Enable **Force HTTPS**
   - Set primary domain to `https://karniexim.com` (without www)

## 🔧 DNS Configuration Options

### Option 1: Netlify DNS (Recommended)
- **Pros**: Faster setup, automatic SSL, better performance
- **Setup**: Point nameservers to Netlify's DNS

### Option 2: Namecheap DNS (Current)
- **Pros**: Keep existing DNS provider
- **Setup**: Add A/CNAME records as shown above

## 📝 Netlify Configuration Update

Update your `netlify.toml` to handle the custom domain:

```toml
# Netlify configuration file
[build]
  publish = "dist"
  command = "npm run build:netlify"

# Specify Node.js version
[build.environment]
  NODE_VERSION = "18"

# Handle SPA routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers for security and caching
[[headers]]
  for = "/*"
    [headers.values]
    Cache-Control = "public, max-age=3600"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

# Redirect www to non-www
[[redirects]]
  from = "https://www.karniexim.com/*"
  to = "https://karniexim.com/:splat"
  status = 301
  force = true
```

## ⏱️ Timeline Expectations

- **DNS Propagation**: 5 minutes - 48 hours (usually within 1-2 hours)
- **SSL Certificate**: 5-10 minutes after DNS verification
- **Full Setup**: Typically complete within 1-2 hours

## 🔍 Verification Steps

### Check DNS Propagation:
```bash
# Check if DNS has propagated
nslookup karniexim.com
dig karniexim.com
```

### Online Tools:
- [whatsmydns.net](https://whatsmydns.net) - Check global DNS propagation
- [dnschecker.org](https://dnschecker.org) - Verify DNS records

## 🚨 Troubleshooting

### Common Issues:

1. **DNS Not Propagating**
   - Wait up to 48 hours
   - Clear DNS cache: `ipconfig /flushdns` (Windows)

2. **SSL Certificate Issues**
   - Ensure DNS is properly configured
   - Try provisioning SSL again in Netlify

3. **Redirect Loops**
   - Check Force HTTPS settings
   - Verify redirect configuration

## 📧 Post-Setup Tasks

After successful setup:

1. **Update Social Media Links**
   - Update all references from netlify.app to karniexim.com

2. **Update SEO Settings**
   - Update sitemap.xml with new domain
   - Submit new domain to Google Search Console

3. **Test All Features**
   - Contact forms
   - Admin login
   - Product management
   - Google Maps integration

## 🎯 Final Result

Once complete, your website will be accessible at:
- ✅ `https://karniexim.com` (primary)
- ✅ `https://www.karniexim.com` (redirects to primary)
- ❌ `https://karni-exim-new.netlify.app` (will redirect to custom domain)

---

## 🚀 Quick Start Commands

```bash
# Build and test locally before domain setup
npm run build:netlify
npm run preview

# Verify deployment is working
curl -I https://karni-exim-new.netlify.app

# After domain setup, test new domain
curl -I https://karniexim.com
```

---

*Need help with any of these steps? The Netlify and Namecheap support teams are also available for assistance!*
