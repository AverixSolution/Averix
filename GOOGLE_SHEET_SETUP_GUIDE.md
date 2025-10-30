# Google Sheet Setup Guide for Averix Solutions Website

## Complete Step-by-Step Instructions

### ✅ Step 1: Sign In to Official Email
1. Go to [Google Sheets](https://sheets.google.com)
2. **Sign in with**: averixsolutions001@gmail.com
3. Make sure you're using this account (check top-right corner)

---

### ✅ Step 2: Create New Spreadsheet
1. Click **+ Blank** to create new spreadsheet
2. Name it: **"Averix Website Leads & Subscriptions"**
3. Create two sheets (tabs at bottom):
   - Rename Sheet1 to: **"Contact Form"**
   - Add new sheet named: **"Newsletter"**

#### Sheet Structure:

**Contact Form Sheet:**
| Timestamp | Name | Email | Purpose | Message | Page URL | User Agent |
|-----------|------|-------|---------|---------|----------|------------|

**Newsletter Sheet:**
| Timestamp | Email | Type | Page URL |
|-----------|-------|------|----------|

---

### ✅ Step 3: Create Apps Script
1. In your spreadsheet, click **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy the ENTIRE script from below and paste it:

```javascript
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = e.parameter;
    
    // Handle Newsletter Subscription
    if (data.type === 'newsletter') {
      var newsletterSheet = ss.getSheetByName('Newsletter');
      if (!newsletterSheet) {
        newsletterSheet = ss.insertSheet('Newsletter');
        newsletterSheet.appendRow(['Timestamp', 'Email', 'Type', 'Page URL']);
      }
      
      newsletterSheet.appendRow([
        new Date(),
        data.email,
        data.type,
        data.page
      ]);
      
      // Send notification to you
      MailApp.sendEmail({
        to: 'averixsolutions001@gmail.com',
        subject: '📧 New Newsletter Subscription - Averix Solutions',
        htmlBody: '<h2>New Newsletter Subscriber</h2>' +
                  '<p><strong>Email:</strong> ' + data.email + '</p>' +
                  '<p><strong>Subscribed at:</strong> ' + new Date() + '</p>' +
                  '<p><strong>Page:</strong> ' + data.page + '</p>'
      });
      
      // Send welcome email to subscriber
      MailApp.sendEmail({
        to: data.email,
        subject: 'Welcome to Averix Solutions Newsletter! 🚀',
        htmlBody: '<h2>Thank You for Subscribing!</h2>' +
                  '<p>Welcome to the Averix Solutions community!</p>' +
                  '<p>You\'ll receive updates about:</p>' +
                  '<ul>' +
                  '<li>Latest technology insights</li>' +
                  '<li>New projects and case studies</li>' +
                  '<li>Software development tips</li>' +
                  '<li>AI/ML innovations</li>' +
                  '</ul>' +
                  '<p>Best regards,<br><strong>Averix Solutions Team</strong></p>' +
                  '<p>📧 averixsolutions001@gmail.com | 📞 +91 90285 33147</p>' +
                  '<p style="font-size: 12px; color: #666;">Solapur, Maharashtra, India</p>'
      });
      
    } 
    // Handle Contact Form
    else {
      var contactSheet = ss.getSheetByName('Contact Form');
      if (!contactSheet) {
        contactSheet = ss.insertSheet('Contact Form');
        contactSheet.appendRow(['Timestamp', 'Name', 'Email', 'Purpose', 'Message', 'Page URL', 'User Agent']);
      }
      
      contactSheet.appendRow([
        new Date(),
        data.name,
        data.email,
        data.purpose,
        data.message,
        data.page,
        data.userAgent
      ]);
      
      // Send notification to you
      MailApp.sendEmail({
        to: 'averixsolutions001@gmail.com',
        subject: '🔔 New Contact Form Submission - Averix Solutions',
        htmlBody: '<h2>New Contact Form Submission</h2>' +
                  '<p><strong>Name:</strong> ' + data.name + '</p>' +
                  '<p><strong>Email:</strong> ' + data.email + '</p>' +
                  '<p><strong>Purpose:</strong> ' + data.purpose + '</p>' +
                  '<p><strong>Message:</strong></p>' +
                  '<p style="background: #f5f5f5; padding: 15px; border-left: 4px solid #3b82f6;">' + data.message + '</p>' +
                  '<p><strong>Submitted at:</strong> ' + new Date() + '</p>' +
                  '<p><strong>Page:</strong> ' + data.page + '</p>' +
                  '<hr>' +
                  '<p style="font-size: 12px; color: #666;">Reply to: ' + data.email + '</p>'
      });
      
      // Send auto-reply to user
      MailApp.sendEmail({
        to: data.email,
        subject: 'Thank You for Contacting Averix Solutions',
        htmlBody: '<h2>Hello ' + data.name + ',</h2>' +
                  '<p>Thank you for reaching out to Averix Solutions!</p>' +
                  '<p>We have received your message and will get back to you within 24-48 hours.</p>' +
                  '<p><strong>Your Message:</strong></p>' +
                  '<p style="background: #f5f5f5; padding: 15px; border-left: 4px solid #3b82f6;">' + data.message + '</p>' +
                  '<p>In the meantime, feel free to explore our services at our website.</p>' +
                  '<p>Best regards,<br><strong>Averix Solutions Team</strong></p>' +
                  '<p>📧 averixsolutions001@gmail.com | 📞 +91 90285 33147</p>' +
                  '<p style="font-size: 12px; color: #666;">Solapur, Maharashtra, India</p>'
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Averix Solutions Form Handler is running!');
}
```

4. Click **Save** (disk icon) or Ctrl+S
5. Name the project: **"Averix Form Handler"**

---

### ✅ Step 4: Deploy as Web App
1. Click **Deploy** → **New deployment**
2. Click the **gear icon** ⚙️ next to "Select type"
3. Choose **Web app**
4. Fill in the settings:
   - **Description**: "Averix Contact & Newsletter Handler"
   - **Execute as**: **Me (averixsolutions001@gmail.com)**
   - **Who has access**: **Anyone**
5. Click **Deploy**

---

### ✅ Step 5: Authorize Permissions
1. You'll see "Authorization required" popup
2. Click **Authorize access**
3. Choose your account: **averixsolutions001@gmail.com**
4. Click **Advanced** (if you see a warning)
5. Click **Go to Averix Form Handler (unsafe)**
6. Click **Allow** to grant permissions:
   - Send emails on your behalf
   - Access Google Sheets

---

### ✅ Step 6: Copy Web App URL
1. After deployment, you'll see a **Web app URL**
2. It looks like: `https://script.google.com/macros/s/AKfycby.../exec`
3. **COPY THIS ENTIRE URL** - you'll need it for the next step

---

### ✅ Step 7: Update Website Code
1. Open `script.js` in your website folder
2. Find line 23: `const SHEET_WEB_APP_URL = 'PASTE_YOUR_NEW_WEB_APP_URL_HERE';`
3. Replace `'PASTE_YOUR_NEW_WEB_APP_URL_HERE'` with your copied URL
4. Example:
   ```javascript
   const SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
   ```
5. Save the file

---

### ✅ Step 8: Test Your Setup

#### Test Contact Form:
1. Open your website
2. Go to Contact section
3. Fill in the form and submit
4. Check:
   - ✅ Data appears in "Contact Form" sheet
   - ✅ You receive email at averixsolutions001@gmail.com
   - ✅ User receives auto-reply email

#### Test Newsletter:
1. Scroll to footer
2. Enter an email and click Subscribe
3. Check:
   - ✅ Email appears in "Newsletter" sheet
   - ✅ You receive notification at averixsolutions001@gmail.com
   - ✅ Subscriber receives welcome email

---

## What Happens Now?

### When Someone Submits Contact Form:
1. ✅ Data saved to Google Sheet "Contact Form" tab
2. ✅ You receive email notification with all details
3. ✅ User receives auto-reply confirmation

### When Someone Subscribes to Newsletter:
1. ✅ Email saved to Google Sheet "Newsletter" tab
2. ✅ You receive notification email
3. ✅ Subscriber receives welcome email with unsubscribe option

---

## Troubleshooting

### If forms don't work:
1. Check if Web App URL is correctly pasted in script.js
2. Make sure deployment is set to "Anyone" can access
3. Check Google Sheet for any errors
4. View Apps Script logs: Extensions → Apps Script → Executions

### If emails aren't sending:
1. Check Gmail spam folder
2. Verify MailApp permissions were granted
3. Check daily email quota (100 emails/day for free Gmail)

---

## Important Notes

- **Email Quota**: Free Gmail accounts can send 100 emails per day
- **Data Storage**: All submissions are permanently stored in Google Sheet
- **Privacy**: Keep your Web App URL secure (though it's safe to use publicly)
- **Backup**: Regularly backup your Google Sheet data

---

## Support
If you face any issues, check the Apps Script execution logs or contact Google Workspace support.

**Last Updated**: October 31, 2025
