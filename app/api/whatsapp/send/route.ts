import { NextRequest, NextResponse } from 'next/server';
import { sendMetaTemplateMessage } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      to,
      recipientName,
      templateName = process.env.WHATSAPP_TEMPLATE_NAME || 'bextery_customer_greeting',
      languageCode = process.env.WHATSAPP_TEMPLATE_LANG || 'en_US',
      credentials,
    } = body;

    if (!to || !recipientName) {
      return NextResponse.json(
        { success: false, error: 'Recipient phone number and name are required.' },
        { status: 400 }
      );
    }

    const phoneNumberId =
      credentials?.phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    const accessToken =
      credentials?.accessToken || process.env.WHATSAPP_API_TOKEN || '';

    if (!phoneNumberId || !accessToken) {
      return NextResponse.json(
        {
          success: false,
          error:
            'WhatsApp Cloud API credentials not configured. Please supply WHATSAPP_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID in your environment or Settings tab.',
        },
        { status: 400 }
      );
    }

    const result = await sendMetaTemplateMessage({
      phoneNumberId,
      accessToken,
      to,
      templateName,
      languageCode,
      recipientName,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error occurred.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
