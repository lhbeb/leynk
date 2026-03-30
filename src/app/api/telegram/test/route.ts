import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/lib/telegram';

// Telegram Group Chat ID
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1002806502052';

// Test endpoint to verify Telegram bot is working
export async function GET(request: NextRequest) {
  try {
    if (!TELEGRAM_CHAT_ID) {
      return NextResponse.json(
        { 
          error: 'Telegram Chat ID not configured',
          message: 'Please set TELEGRAM_CHAT_ID environment variable or hardcode it in the file'
        },
        { status: 400 }
      );
    }

    const testMessage = `🧪 <b>Test Message</b>\n\nThis is a test notification from your Leynk bot!\n\n✅ If you receive this message, your bot is configured correctly.\n\n⏰ Time: ${new Date().toLocaleString()}`;

    const sent = await sendTelegramMessage(TELEGRAM_CHAT_ID, testMessage, 'HTML');

    if (sent) {
      return NextResponse.json({ 
        success: true, 
        message: 'Test message sent successfully! Check your Telegram group.',
        chatId: TELEGRAM_CHAT_ID
      });
    } else {
      return NextResponse.json(
        { 
          error: 'Failed to send test message',
          message: 'Check your bot token and chat ID. Make sure the bot is in the group and has permission to send messages.'
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Error sending test message',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

