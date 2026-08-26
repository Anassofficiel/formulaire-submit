import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path for storing leads locally so data persists across sessions
const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Google Sheet WebApp URL
const GOOGLE_SHEET_WEBAPP_URL = process.env.GOOGLE_SHEET_WEBAPP_URL || 'https://script.google.com/macros/s/AKfycbz-zyFt64e5sLdyV8FXTBQMojJbEoVsk7Uj1m-7B7VOCOTgH_ZmkZbjP5QIiBeWlYPyFA/exec';
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'anassfatihi2026@gmail.com';

/**
 * Helper to dispatch Lead data to Google Sheet via Google Apps Script Web App
 */
async function sendToGoogleSheet(orderData: {
  date: string;
  fullName: string;
  phoneNumber: string;
  city: string;
  address: string;
  selectedProduct: string;
  customerMessage: string;
  status: string;
  notes: string;
  orderId: string;
  price: string;
}): Promise<boolean> {
  try {
    if (!GOOGLE_SHEET_WEBAPP_URL) {
      console.warn('[Google Sheet] Missing GOOGLE_SHEET_WEBAPP_URL');
      return false;
    }

    const payload = {
      orderId: orderData.orderId,
      date: orderData.date,
      fullName: orderData.fullName,
      name: orderData.fullName,
      phone: orderData.phoneNumber,
      phoneNumber: orderData.phoneNumber,
      city: orderData.city,
      address: orderData.address,
      selectedProduct: orderData.selectedProduct,
      product: orderData.selectedProduct,
      customerMessage: orderData.customerMessage,
      message: orderData.customerMessage,
      status: orderData.status || 'New Order',
      notes: orderData.notes || '',
      price: orderData.price || 'غير محدد',
    };

    console.log(`[Google Sheet] Syncing Order #${orderData.orderId} to Google Sheet WebApp...`);

    const response = await fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    if (response.ok) {
      console.log(`[Google Sheet] Successfully synced Order #${orderData.orderId}`);
      return true;
    } else {
      console.warn(`[Google Sheet] WebApp returned status ${response.status}`);
      return false;
    }
  } catch (sheetErr) {
    console.error('[Google Sheet Sync Error]:', sheetErr);
    return false;
  }
}

// ------------------------------------------------------------
// API Endpoints
// ------------------------------------------------------------

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

/**
 * Submit a new Lead
 */
app.post('/api/leads', async (req, res) => {
  try {
    const { fullName, phone, city, address, deviceName, deviceId, additionalMessage } = req.body;

    if (!fullName || !phone || !city) {
      return res.status(400).json({
        success: false,
        error: 'جميع الحقول المطلوبة يجب ملؤها (الاسم، الهاتف، المدينة)',
      });
    }

    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('ar-MA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(now);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const leadId = `EM-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${randomSuffix}`;

    const productText = deviceName ? String(deviceName).trim() : (additionalMessage ? String(additionalMessage).trim() : 'غير محدد');

    const newLead = {
      id: leadId,
      date: formattedDate,
      timestamp: now.getTime(),
      name: String(fullName).trim(),
      phone: String(phone).trim(),
      city: String(city).trim(),
      address: address ? String(address).trim() : '',
      selectedDevice: productText,
      deviceId: String(deviceId || ''),
      additionalMessage: additionalMessage ? String(additionalMessage).trim() : '',
      status: 'New Order',
      emailSent: true,
      googleSheetSent: false,
    };

    // 1. Send to Google Sheet automatically via Web App URL
    const googleSheetSuccess = await sendToGoogleSheet({
      orderId: newLead.id,
      date: newLead.date,
      fullName: newLead.name,
      phoneNumber: newLead.phone,
      city: newLead.city,
      address: newLead.address,
      selectedProduct: newLead.selectedDevice,
      customerMessage: newLead.additionalMessage,
      status: 'New Order',
      notes: '',
      price: 'غير محدد',
    });
    newLead.googleSheetSent = googleSheetSuccess;

    // 2. Save Lead to JSON file
    try {
      const rawData = fs.readFileSync(LEADS_FILE, 'utf-8');
      const leads = JSON.parse(rawData);
      leads.unshift(newLead);
      fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
    } catch (saveErr) {
      console.error('[Error saving lead to file]:', saveErr);
    }

    return res.status(201).json({
      success: true,
      leadId: newLead.id,
      message: 'تم تسجيل طلبك بنجاح وسنتواصل معك لتأكيد المعلومات',
      lead: newLead,
    });
  } catch (error: any) {
    console.error('[Submit Lead Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مجدداً',
    });
  }
});

/**
 * Get all leads (For internal tracking)
 */
app.get('/api/leads', (req, res) => {
  try {
    const rawData = fs.readFileSync(LEADS_FILE, 'utf-8');
    const leads = JSON.parse(rawData);
    res.json({ success: true, count: leads.length, leads });
  } catch (err) {
    res.json({ success: true, count: 0, leads: [] });
  }
});

/**
 * Export Leads to Google Sheets CSV
 * Columns: ID, Date, Name, Phone, City, Address, Selected Device, Status
 */
app.get('/api/leads/export-csv', (req, res) => {
  try {
    const rawData = fs.readFileSync(LEADS_FILE, 'utf-8');
    const leads = JSON.parse(rawData);

    // CSV Header matching requested Google Sheets format
    const headers = ['Order ID', 'Date', 'Full Name', 'Phone Number', 'City', 'Address', 'Selected Product', 'Customer Message', 'Status'];
    const rows = leads.map((l: any) => [
      `"${l.id}"`,
      `"${l.date}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.city || '').replace(/"/g, '""')}"`,
      `"${(l.address || '').replace(/"/g, '""')}"`,
      `"${(l.selectedDevice || '').replace(/"/g, '""')}"`,
      `"${(l.additionalMessage || '').replace(/"/g, '""')}"`,
      `"${l.status || 'New Order'}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=orders_${Date.now()}.csv`);
    res.send(csvContent);
  } catch (err) {
    res.status(500).send('Error generating CSV');
  }
});

// ------------------------------------------------------------
// Vite and Static File Serving
// ------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ Electro Mostafa Orders running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
