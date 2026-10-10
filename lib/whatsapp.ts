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
 * Helper to test if a string looks like a valid phone candidate
 */
function isPhoneLike(val: string): boolean {
  if (!val || val.includes('@') || val.toLowerCase().includes('http')) return false;
  // Strip RTL/LTR marks and common non-digits
  const digits = val.replace(/[\u200E\u200F\u202A-\u202E\D]/g, '');
  return digits.length >= 7 && digits.length <= 16;
}

/**
 * Universal Contact Parser
 * Supports:
 * 1. Apple / Android vCard files (.vcf)
 * 2. Google Contacts, iCloud, and Outlook multi-column CSVs
 * 3. Delimited text (CSV, TSV, semicolons)
 * 4. Freeform pasted text (Name Phone, Phone Name, Name - Phone)
 */
export function parseContactsCsv(inputText: string): Contact[] {
  if (!inputText || !inputText.trim()) return [];

  // Clean UTF-8 Byte Order Mark (BOM)
  const cleanInput = inputText.replace(/^\uFEFF/, '').trim();

  // 1. VCF / vCard format detection
  if (cleanInput.includes('BEGIN:VCARD') || cleanInput.includes('END:VCARD')) {
    const contacts: Contact[] = [];
    const vcardBlocks = cleanInput.split(/END:VCARD/i);

    vcardBlocks.forEach((block, index) => {
      const trimmedBlock = block.trim();
      if (!trimmedBlock) return;

      let name = '';
      let phone = '';

      const lines = trimmedBlock.split(/\r?\n/);
      for (const line of lines) {
        const l = line.trim();
        // Extract Full Name (FN: ...)
        if (/^FN(?:;[^:]*)?:/i.test(l)) {
          name = l.replace(/^FN(?:;[^:]*)?:/i, '').replace(/\\,/g, ',').replace(/\\;/g, ';').trim();
        } else if (!name && /^N(?:;[^:]*)?:/i.test(l)) {
          // Structured name (N:Last;First;Middle;...)
          const rawN = l.replace(/^N(?:;[^:]*)?:/i, '');
          const parts = rawN.split(';').map(p => p.trim()).filter(Boolean);
          if (parts.length > 0) {
            name = parts.reverse().join(' ');
          }
        } else if (!phone && /^TEL(?:;[^:]*)?:/i.test(l)) {
          phone = l.replace(/^TEL(?:;[^:]*)?:/i, '').trim();
        }
      }

      if (name || phone) {
        const { phone: formattedPhone, isValid } = formatPhoneNumber(phone);
        contacts.push({
          id: `vcf_${Date.now()}_${index}`,
          name: name || `Contact ${index + 1}`,
          phone: formattedPhone,
          rawPhone: phone,
          isValid,
          status: 'idle',
        });
      }
    });

    if (contacts.length > 0) return contacts;
  }

  // 2. Delimited Lines (CSV / TSV / Semicolon)
  const lines = cleanInput
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) return [];

  // Detect delimiter
  const sampleLine = lines[0];
  let delimiter = ',';
  if (sampleLine.includes('\t')) delimiter = '\t';
  else if (sampleLine.includes(';') && !sampleLine.includes(',')) delimiter = ';';

  // Parse lines into columns handling quotes
  const rows = lines.map(line => {
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

  // Check if first row is a header row
  const hasHeaders = headers.some(h =>
    ['name', 'first', 'given', 'family', 'last', 'phone', 'mobile', 'tel', 'cell', 'whatsapp', 'contact'].some(k => h.includes(k))
  );

  let dataRows = rows;
  let candidatePhoneColIdxs: number[] = [];
  let nameColIdx = -1;
  let givenNameColIdx = -1;
  let familyNameColIdx = -1;

  if (hasHeaders) {
    dataRows = rows.slice(1);

    // Identify candidate phone columns (CRITICALLY: excluding 'type', 'label', 'prefix', 'carrier')
    headers.forEach((h, idx) => {
      const isTypeOrLabel = ['type', 'label', 'prefix', 'country', 'carrier'].some(bad => h.includes(bad));
      if (!isTypeOrLabel && ['phone', 'mobile', 'tel', 'cell', 'whatsapp', 'number', 'value'].some(k => h.includes(k))) {
        candidatePhoneColIdxs.push(idx);
      }
    });

    // Name column discovery
    nameColIdx = headers.findIndex(h =>
      ['full name', 'fullname', 'display name', 'contact name', 'customer name'].some(k => h.includes(k)) ||
      (h.includes('name') && !['first', 'given', 'last', 'family', 'middle', 'type', 'file'].some(k => h.includes(k)))
    );

    givenNameColIdx = headers.findIndex(h => ['given name', 'first name', 'firstname'].some(k => h.includes(k)));
    familyNameColIdx = headers.findIndex(h => ['family name', 'last name', 'lastname'].some(k => h.includes(k)));
  }

  const contacts: Contact[] = [];

  dataRows.forEach((row, index) => {
    if (row.length === 0 || (row.length === 1 && !row[0])) return;

    let rawName = '';
    let rawPhone = '';

    // A. Single cell with mixed name & phone (e.g. "07067436817 Zaynab Aunty" or "Zaynab Aunty 07067436817")
    if (row.length === 1 && row[0].includes(' ')) {
      const cell = row[0].trim();
      const phoneMatch = cell.match(/(?:\+?\d[\d\s-().]{7,}\d)/);
      if (phoneMatch) {
        rawPhone = phoneMatch[0].trim();
        rawName = cell.replace(rawPhone, '').replace(/[-:,]/g, '').trim();
      }
    }

    // B. Header-guided extraction
    if (!rawPhone && candidatePhoneColIdxs.length > 0) {
      for (const colIdx of candidatePhoneColIdxs) {
        const val = row[colIdx];
        if (val && isPhoneLike(val)) {
          rawPhone = val;
          break;
        }
      }
    }

    // C. Fallback: Scan ALL columns in this row for any cell that has a valid phone number
    if (!rawPhone) {
      for (let c = 0; c < row.length; c++) {
        const val = row[c];
        if (val && isPhoneLike(val)) {
          rawPhone = val;
          break;
        }
      }
    }

    // Name extraction
    if (!rawName) {
      if (givenNameColIdx !== -1 && row[givenNameColIdx]) {
        const given = row[givenNameColIdx].trim();
        const family = familyNameColIdx !== -1 && row[familyNameColIdx] ? row[familyNameColIdx].trim() : '';
        rawName = family ? `${given} ${family}` : given;
      } else if (nameColIdx !== -1 && row[nameColIdx]) {
        rawName = row[nameColIdx].trim();
      } else {
        // Find the first non-empty column that isn't the phone or an email
        for (let c = 0; c < row.length; c++) {
          const val = row[c]?.trim();
          if (val && val !== rawPhone && !val.includes('@') && !val.toLowerCase().startsWith('http') && !/^\d+$/.test(val)) {
            rawName = val;
            break;
          }
        }
      }
    }

    // Final cleanups
    rawName = (rawName || `Contact ${index + 1}`).replace(/^["']|["']$/g, '').trim();
    rawPhone = (rawPhone || '').replace(/[\u200E\u200F\u202A-\u202E]/g, '').trim();

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
