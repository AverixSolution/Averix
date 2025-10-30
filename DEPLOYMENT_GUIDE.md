# Averix Solutions Website - Deployment Guide

## Recent Changes Implemented

### 1. ✅ Logo in Navbar
- Added company logo (`img/original logo.png`) to the navbar beside "Averix Solutions"
- Logo is properly styled and responsive

### 2. ✅ Floating Contact Buttons
- Updated WhatsApp and Email floating buttons with brand-colored icons
- WhatsApp button: Green (#25d366) icon on white background
- Email button: Blue (#3b82f6) icon on white background
- Icons are now visible and properly styled

### 3. ✅ AI-Powered Chat with Gemini API
- Integrated Google Gemini API for intelligent chat responses
- Chat widget now provides real-time AI assistance
- Fallback error handling included

### 4. ✅ Newsletter Subscription
- Newsletter form now sends subscriptions to your Google Sheet
- Subscriptions are forwarded to averixsolutions001@gmail.com
- Success/error messages displayed to users

## Pre-Deployment Checklist

### CRITICAL: Configure Gemini API Key
1. Get your Gemini API key from: https://makersuite.google.com/app/apikey
2. Open `script.js`
3. Find line 376: `const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';`
4. Replace `'YOUR_GEMINI_API_KEY_HERE'` with your actual API key
5. Example: `const GEMINI_API_KEY = 'AIzaSyABC123...';`

### Verify Google Sheets Integration
- The existing Google Apps Script Web App URL is already configured in `script.js` (line 22)
- Make sure your Google Sheet is set up to receive:
  - Contact form submissions
  - Newsletter subscriptions (with `type: 'newsletter'` field)
- Ensure the Apps Script forwards newsletter subscriptions to averixsolutions001@gmail.com

### Test Before Deployment
1. Open `index.html` in a browser
2. Check that the logo appears in the navbar
3. Verify floating WhatsApp and Email buttons show colored icons
4. Test the chat widget (requires API key to be configured)
5. Test newsletter subscription form

## Deployment Options

### Option 1: Netlify (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd "c:/Users/ABDUL/Desktop/Averix/web version8"
netlify deploy --prod
```

### Option 2: GitHub Pages
1. Create a new repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit with all features"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```
3. Enable GitHub Pages in repository settings

### Option 3: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd "c:/Users/ABDUL/Desktop/Averix/web version8"
vercel --prod
```

## File Structure
```
web version8/
├── index.html          # Main HTML file
├── style.css           # All styles
├── script.js           # JavaScript with Gemini API integration
├── img/
│   └── original logo.png  # Company logo
└── DEPLOYMENT_GUIDE.md    # This file
```

## Important Notes

1. **API Key Security**: Never commit your actual Gemini API key to public repositories
   - Use environment variables for production
   - Consider using a backend proxy for API calls

2. **Newsletter Data Flow**:
   - User submits email → Google Sheet → Email to averixsolutions001@gmail.com
   - Ensure your Google Apps Script has email forwarding configured

3. **Chat Widget**:
   - Without API key: Shows fallback message with contact info
   - With API key: Provides intelligent AI responses about Averix Solutions

4. **Mobile Responsiveness**: All features are fully responsive and tested

## Support
For issues or questions, contact: averixsolutions001@gmail.com

## Version
Last Updated: October 31, 2025
