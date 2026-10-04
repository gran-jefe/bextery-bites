/**
 * WhatsApp Cloud API Helper & Contact Management Utilities
 * Built for Bextery Bites
 */

export interface Contact {
  id: string;
  name: string;
  phone: string;
  rawPhone: string;
  isValid: boolean;
  status: 'idle' | 'sending' | 'sent' | 'failed';
  errorMessage?: string;
}

/**
 * Standardize phone numbers to international E.164 format without '+'
 * Specifically optimized for Nigerian numbers (070/080/090/081 -> 234...)
 */
export function formatPhoneNumber(input: string, defaultCountryCode = '234'): { phone: string; isValid: boolean } {
  if (!input) return { phone: '', isValid: false };

  // Remove all non-numeric characters
  let digits = input.replace(/\D/g, '');

  if (!digits) return { phone: '', isValid: false };

  // Handle Nigerian local format e.g. 07067436817 (11 digits starting with 0)
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = defaultCountryCode + digits.slice(1);
  } else if (digits.length === 10 && !digits.startsWith('0') && defaultCountryCode === '234') {
    // 10 digits missing leading zero (e.g. 7067436817)
    digits = defaultCountryCode + digits;
  } else if (digits.startsWith('00')) {
    // E.g. 00234...
    digits = digits.slice(2);
  }

  // Valid international numbers typically range between 10 and 15 digits
  const isValid = digits.length >= 10 && digits.length <= 15;

  return { phone: digits, isValid };
}

/**
 * Generates a direct WhatsApp Click-to-Chat (wa.me) URL
 */
export function generateWaMeLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Smart CSV Parser that identifies Name and Phone columns dynamically
 */
export function parseContactsCsv(csvText: string): Contact[] {
  const lines = csvText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) return [];

  // Detect delimiter
  const firstLine = lines[0];
  let delimiter = ',';
  if (firstLine.includes('\t')) delimiter = '\t';
  else if (firstLine.includes(';') && !firstLine.includes(',')) delimiter = ';';

  const rows = lines.map(line => {
    // Handle quoted fields
    const regex = new RegExp(`(?:^|${delimiter})(?:"([^"]*(?:""[^"]*)*)"|([^"${delimiter}]*))`, 'g');
    const cols: string[] = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      const val = (match[1] !== undefined ? match[1].replace(/""/g, '"') : match[2] || '').trim();
      cols.push(val);
      if (regex.lastIndex >= line.length) break;
    }
    return cols;
  });

  if (rows.length === 0) return [];

  const headers = rows[0].map(h => h.toLowerCase());
  
  // Find column indexes
  let nameColIdx = headers.findIndex(h =>
    ['name', 'full name', 'fullname', 'first name', 'firstname', 'contact', 'customer', 'customer name'].some(k => h.includes(k))
  );

  let phoneColIdx = headers.findIndex(h =>
    ['phone', 'mobile', 'tel', 'cell', 'whatsapp', 'number', 'phone 1 - value'].some(k => h.includes(k))
  );

  let dataRows = rows;
  // If first row looked like a header
  if (nameColIdx !== -1 || phoneColIdx !== -1) {
    dataRows = rows.slice(1);
    if (nameColIdx === -1) nameColIdx = 0;
    if (phoneColIdx === -1) phoneColIdx = 1;
  } else {
    // Default to Col 0 as Name, Col 1 as Phone
    nameColIdx = 0;
    phoneColIdx = 1;
  }

  const contacts: Contact[] = [];

  dataRows.forEach((row, index) => {
    if (row.length === 0 || (row.length === 1 && !row[0])) return;

    let colA = (row[0] || '').trim();
    let colB = (row[1] || '').trim();

    // If no delimiter was found and line has "09061770885 Sherif"
    if (row.length === 1 && colA.includes(' ')) {
      const parts = colA.split(/\s+/);
      if (parts.length >= 2) {
        if (/^\+?\d[\d\s-]{6,}$/.test(parts[0])) {
          colA = parts[0];
          colB = parts.slice(1).join(' ');
        } else if (/^\+?\d[\d\s-]{6,}$/.test(parts[parts.length - 1])) {
          colB = parts[parts.length - 1];
          colA = parts.slice(0, -1).join(' ');
        }
      }
    }

    let rawName = '';
    let rawPhone = '';

    // Smart detection: determine which column is the phone number
    const isColAPhone = /^\+?\d[\d\s-]{6,}$/.test(colA.replace(/[\s-]/g, ''));
    const isColBPhone = /^\+?\d[\d\s-]{6,}$/.test(colB.replace(/[\s-]/g, ''));

    if (isColAPhone && !isColBPhone) {
      rawPhone = colA;
      rawName = colB || `Customer ${index + 1}`;
    } else if (isColBPhone && !isColAPhone) {
      rawName = colA || `Customer ${index + 1}`;
      rawPhone = colB;
    } else {
      rawName = (row[nameColIdx] || '').trim() || `Customer ${index + 1}`;
      rawPhone = (row[phoneColIdx] || '').trim();
    }

    const { phone, isValid } = formatPhoneNumber(rawPhone);

    contacts.push({
      id: `c_${Date.now()}_${index}`,
      name: rawName,
      phone,
      rawPhone,
      isValid,
      status: 'idle',
    });
  });

  return contacts;
}

/**
 * Meta WhatsApp Cloud API Send Payload Structure
 */
export interface SendWhatsAppTemplateParams {
  phoneNumberId: string;
  accessToken: string;
  to: string; // E.164 phone without '+'
  templateName: string;
  languageCode?: string;
  recipientName: string;
}

export async function sendMetaTemplateMessage(params: SendWhatsAppTemplateParams): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  const { phoneNumberId, accessToken, to, templateName, languageCode = 'en_US', recipientName } = params;

  if (!phoneNumberId || !accessToken) {
    return {
      success: false,
      error: 'Missing Meta API credentials. Please set WHATSAPP_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID.',
    };
  }

  const endpoint = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
      components: [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: recipientName,
            },
          ],
        },
      ],
    },
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const errDetail = data?.error?.message || res.statusText || 'Failed to send message via WhatsApp Cloud API';
      return {
        success: false,
        error: errDetail,
      };
    }

    const messageId = data?.messages?.[0]?.id;
    return {
      success: true,
      messageId,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network error while contacting Meta API';
    return {
      success: false,
      error: errorMsg,
    };
  }
}
