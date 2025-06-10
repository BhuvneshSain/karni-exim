# Karni Exim Admin Guide

Welcome to the Karni Exim admin guide! This comprehensive document will help you manage your e-commerce website effectively. This guide covers all administrative tasks, from product management to website customization.

## Table of Contents

1. [Accessing the Admin Panel](#accessing-the-admin-panel)
2. [Product Management](#product-management)
   - [Adding New Products](#adding-new-products)
   - [Editing Products](#editing-products)
   - [Deleting Products](#deleting-products)
   - [Image Guidelines](#image-guidelines)
   - [Categories Management](#categories-management)
3. [Hero Section Management](#hero-section-management)
   - [Setting Up Hero Banner Products](#setting-up-hero-banner-products)
   - [Hero Image Best Practices](#hero-image-best-practices)
   - [Troubleshooting Hero Images](#troubleshooting-hero-images)
4. [Featured Products](#featured-products)
5. [Debugging Tools](#debugging-tools)
6. [Security Best Practices](#security-best-practices)
7. [Common Issues & Solutions](#common-issues--solutions)

## Accessing the Admin Panel

1. **Navigate to Admin URL**
   - Access the admin panel by navigating to `https://yourwebsite.com/karni-admin`
   - This URL is protected and only accessible to authorized users

2. **Login with Credentials**
   - Enter your administrator email and password
   - Keep your login credentials secure and never share them
   - If you've forgotten your password, contact the website developer

3. **Admin Dashboard Overview**
   - After login, you'll see the admin dashboard with various tools and sections
   - The main product management interface will be displayed automatically
   - Additional help resources and guides are accessible via buttons in the dashboard header

## Product Management

### Adding New Products

1. **Fill out the product form**
   - Product Name: Enter a clear, descriptive name for the product
   - Category: Select an existing category or create a new one
   - Description: Provide a detailed description of the product
   - Main Image: Upload a high-quality square image (recommended 800x800px)
   - Additional Images: Upload multiple supporting images as needed
   - Bestseller/Hero flags: Check appropriate boxes for featured products

2. **Image Upload Requirements**
   - Main Product Image: 800×800px (1:1 ratio) - This appears on product listings and as the main product image
   - Hero Banner Image: 1920×1080px (16:9 ratio) - Only required if the product will appear in the hero banner
   - Additional Images: At least 800×800px - These appear in the product gallery

3. **Submit the Product**
   - Click "Add Product" to save the new product
   - Wait for the confirmation message before leaving the page
   - The new product will immediately appear in the product list below

### Editing Products

1. **Locate the product to edit**
   - Scroll through the product list at the bottom of the admin page
   - Products are listed in reverse chronological order (newest first)

2. **Click the Edit button**
   - The product details will be loaded into the form
   - Existing images will be displayed with previews
   - You can replace images by uploading new ones or keep existing ones

3. **Make necessary changes**
   - Update any information as needed
   - You don't need to re-upload images if you want to keep the existing ones

4. **Save changes**
   - Click "Update Product" to save your changes
   - The product listing will refresh automatically

### Deleting Products

1. **Locate the product to delete**
   - Find the product in the product list at the bottom of the page

2. **Click the Delete button**
   - You will be prompted to confirm deletion
   - This action cannot be undone

3. **Confirm deletion**
   - The product will be permanently removed from your website
   - Associated images will be removed from storage

### Image Guidelines

1. **Main Product Images**
   - Recommended size: 800×800px (1:1 square ratio)
   - Clean white background for consistency
   - File format: JPG or PNG (JPG preferred for photographs, PNG for illustrations)
   - Maximum file size: 1MB (smaller is better for performance)

2. **Hero Banner Images**
   - Recommended size: 1920×1080px (16:9 widescreen ratio)
   - High resolution and professional quality
   - Landscape orientation is required
   - Clear focal point that works well with automatic text overlay
   - Maximum file size: 2MB

3. **Additional Images**
   - Maintain consistent size and style with main image
   - Show different angles or details of the product
   - Include context/lifestyle images where appropriate
   - Keep the number of additional images reasonable (3-5 is typically sufficient)

### Categories Management

1. **Using Existing Categories**
   - Select from the dropdown menu of existing categories
   - Consistent categorization helps with navigation and filtering

2. **Creating New Categories**
   - Select "Other (type below)" from the category dropdown
   - Enter a new category name in the field that appears
   - New categories will be available in the dropdown for future products

3. **Category Best Practices**
   - Use clear, concise category names
   - Maintain a reasonable number of categories (avoid excessive fragmentation)
   - Consider your customers' browsing habits when organizing products

## Hero Section Management

### Setting Up Hero Banner Products

1. **What is the Hero Banner?**
   - The hero banner is the large sliding carousel at the top of the home page
   - It showcases important or featured products with high-quality images

2. **Marking Products for Hero Banner**
   - Edit an existing product or create a new one
   - Check the "Show in Hero Banner" checkbox
   - Upload a high-quality hero image (1920×1080px recommended)
   - Save the product

3. **Managing Hero Banner Content**
   - Limit the number of hero products to 3-5 for best user experience
   - Regularly update hero products to keep the website fresh
   - Ensure all hero products have appropriate, high-quality images

### Hero Image Best Practices

1. **Image Quality**
   - Use professional, high-resolution photographs
   - Ensure images are sharp and clear, even on large screens
   - Avoid pixelated, stretched, or blurry images

2. **Image Composition**
   - Use images with enough empty space for text overlay (if applicable)
   - Choose images with good visual impact and clear focal points
   - Maintain consistent style and color themes across hero images

3. **Technical Specifications**
   - Minimum dimensions: 1920×1080px (larger is better)
   - Aspect ratio: 16:9 (widescreen)
   - File format: JPG for photographs
   - Compression: Balanced quality (80-90%) for optimal loading speed

### Troubleshooting Hero Images

1. **Using the Hero Debug Tool**
   - Access the debug tool by adding `?debug=hero` to your homepage URL
   - Example: `https://karniexim.com/?debug=hero`
   - The debug panel shows all products marked as hero and their image status

2. **Common Hero Image Issues**
   - Images not displaying: Verify upload completed successfully
   - Blurry images: Original file too small or low quality
   - Stretched images: Incorrect aspect ratio
   - Mobile display issues: Test on multiple devices and screen sizes

3. **Fixing Hero Issues**
   - Replace low-quality images with higher resolution versions
   - Ensure "Show in Hero Banner" is checked for products that should appear
   - Use the debug panel to identify and fix specific issues

## Featured Products

1. **Setting Bestseller Flag**
   - Check the "Mark as Bestseller" box when adding or editing products
   - Bestseller products appear in the featured section of the home page
   - They may also receive special badges in product listings

2. **Managing Featured Products**
   - Regularly update bestseller flags to showcase different products
   - Limit bestsellers to 10-15% of your total product catalog
   - Use bestseller designation for truly popular or strategic products

3. **Featured Product Best Practices**
   - Ensure featured products have excellent images and descriptions
   - Distribute bestseller flags across different categories
   - Consider seasonal relevance when featuring products

## Debugging Tools

1. **Hero Debug Tool**
   - Access by adding `?debug=hero` to your homepage URL
   - Shows all hero-flagged products with status indicators
   - Provides tools to fix common hero image issues

2. **Browser Developer Tools**
   - Press F12 in most browsers to access developer tools
   - Use the Console tab to check for JavaScript errors
   - Use the Network tab to identify loading issues with images or resources

3. **Image Validation**
   - The system automatically checks uploaded images for size and dimensions
   - Error messages will guide you to correct any issues
   - Preview functionality helps ensure images appear as expected

## Security Best Practices

1. **Account Security**
   - Use a strong, unique password for your admin account
   - Never share login credentials with unauthorized individuals
   - Log out when finished, especially on shared computers

2. **Content Security**
   - Only upload images from trusted sources
   - Never upload executable files (.exe, .js, etc.)
   - Be cautious with product descriptions and avoid including sensitive information

3. **Regular Monitoring**
   - Periodically review all product listings and content
   - Check for unauthorized changes or suspicious activity
   - Report any security concerns to the website developer immediately

## Common Issues & Solutions

1. **Upload Failures**
   - Issue: Images fail to upload or appear as broken
   - Solution: Check file size/format, reduce dimensions, try another browser

2. **Missing Products**
   - Issue: Products not appearing on the website
   - Solution: Verify product was saved successfully, check for filter settings

3. **Layout Problems**
   - Issue: Website layout appears broken after adding content
   - Solution: Check for extremely large images, very long text without breaks, or special characters in text fields

4. **Performance Issues**
   - Issue: Website loading slowly after adding many products
   - Solution: Optimize image sizes, reduce number of hero products, consider pagination

---

For additional help or questions not covered in this guide, please contact your website developer or maintenance team.

Last updated: June 2025
