// Telegram Bot Integration
const TELEGRAM_BOT_TOKEN = '7742080768:AAFaskpr-XCXiEWgcuJhtAsCHiffkhRfyrc';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown';
}

// Send a message to a Telegram chat
export async function sendTelegramMessage(
  chatId: string,
  message: string,
  parseMode: 'HTML' | 'Markdown' = 'HTML'
): Promise<boolean> {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: parseMode,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Telegram API error:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
}

// Convert country code to flag emoji
function getCountryFlag(countryCode: string | null | undefined): string {
  if (!countryCode || countryCode === 'UN' || countryCode === 'LOC') {
    return '🌍'; // Default globe emoji for unknown/local
  }

  // Convert 2-letter country code to flag emoji
  // Each letter becomes a regional indicator symbol (U+1F1E6 to U+1F1FF)
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 0x1f1e6 + (char.charCodeAt(0) - 0x41));

    return String.fromCodePoint(...codePoints);
  } catch (error) {
    return '🌍'; // Fallback to globe if conversion fails
  }
}

// Format link click notification message
export function formatLinkClickNotification(data: {
  username: string;
  linkTitle: string;
  linkUrl: string;
  userIp?: string;
  country?: string;
  countryCode?: string;
  city?: string;
}): string {
  const { username, linkTitle, linkUrl, userIp, country, countryCode, city } = data;
  
  let message = `🔔 <b>New Link Click!</b>\n\n`;
  message += `👤 <b>User:</b> @${username}\n`;
  message += `🔗 <b>Link:</b> ${linkTitle}\n`;
  message += `🌐 <b>URL:</b> <a href="${linkUrl}">${linkUrl}</a>\n`;
  
  // Always show IP address
  message += `🌍 <b>IP:</b> ${userIp || 'Unknown'}\n`;
  
  // Show location with flag emoji
  if (country && country !== 'Unknown' && country !== 'Local') {
    const flag = getCountryFlag(countryCode);
    message += `📍 <b>Location:</b> ${flag} ${city && city !== 'Unknown' && city !== 'Local' ? `${city}, ` : ''}${country}\n`;
  } else if (userIp && (userIp === '127.0.0.1' || userIp === '::1' || userIp.startsWith('192.168.') || userIp.startsWith('10.') || userIp.startsWith('172.') || userIp === 'Unknown')) {
    message += `📍 <b>Location:</b> 🌍 Local/Private Network\n`;
  } else {
    message += `📍 <b>Location:</b> 🌍 Unknown\n`;
  }
  
  message += `⏰ <b>Time:</b> ${new Date().toLocaleString()}\n`;
  
  return message;
}

// Format page view notification message
export function formatPageViewNotification(data: {
  username: string;
  userIp?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  referrer?: string | null;
}): string {
  const { username, userIp, country, countryCode, city, referrer } = data;
  
  let message = `👁️ <b>New Page View!</b>\n\n`;
  message += `👤 <b>User Page:</b> @${username}\n`;
  message += `🔗 <b>Page:</b> <a href="https://leynk.co/${username}">leynk.co/${username}</a>\n`;
  
  // Always show IP address
  message += `🌍 <b>IP:</b> ${userIp || 'Unknown'}\n`;
  
  // Show location with flag emoji
  if (country && country !== 'Unknown' && country !== 'Local') {
    const flag = getCountryFlag(countryCode);
    message += `📍 <b>Location:</b> ${flag} ${city && city !== 'Unknown' && city !== 'Local' ? `${city}, ` : ''}${country}\n`;
  } else if (userIp && (userIp === '127.0.0.1' || userIp === '::1' || userIp.startsWith('192.168.') || userIp.startsWith('10.') || userIp.startsWith('172.') || userIp === 'Unknown')) {
    message += `📍 <b>Location:</b> 🌍 Local/Private Network\n`;
  } else {
    message += `📍 <b>Location:</b> 🌍 Unknown\n`;
  }
  
  if (referrer && referrer !== 'null' && !referrer.includes('leynk.co')) {
    message += `🔗 <b>Referrer:</b> ${referrer}\n`;
  }
  
  message += `⏰ <b>Time:</b> ${new Date().toLocaleString()}\n`;
  
  return message;
}

// Format subscription notification message
export function formatSubscriptionNotification(data: {
  username: string;
  email: string;
  userIp?: string;
  country?: string;
  countryCode?: string;
  city?: string;
}): string {
  const { username, email, userIp, country, countryCode, city } = data;
  
  let message = `📧 <b>New Subscription!</b>\n\n`;
  message += `👤 <b>User Page:</b> @${username}\n`;
  message += `📬 <b>Email:</b> ${email}\n`;
  message += `🔗 <b>Page:</b> <a href="https://leynk.co/${username}">leynk.co/${username}</a>\n`;
  
  // Always show IP address
  message += `🌍 <b>IP:</b> ${userIp || 'Unknown'}\n`;
  
  // Show location with flag emoji
  if (country && country !== 'Unknown' && country !== 'Local') {
    const flag = getCountryFlag(countryCode);
    message += `📍 <b>Location:</b> ${flag} ${city && city !== 'Unknown' && city !== 'Local' ? `${city}, ` : ''}${country}\n`;
  } else if (userIp && (userIp === '127.0.0.1' || userIp === '::1' || userIp.startsWith('192.168.') || userIp.startsWith('10.') || userIp.startsWith('172.') || userIp === 'Unknown')) {
    message += `📍 <b>Location:</b> 🌍 Local/Private Network\n`;
  } else {
    message += `📍 <b>Location:</b> 🌍 Unknown\n`;
  }
  
  message += `⏰ <b>Time:</b> ${new Date().toLocaleString()}\n`;
  
  return message;
}

// Get bot info (useful for getting chat ID)
export async function getBotInfo(): Promise<any> {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/getMe`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error getting bot info:', error);
    return null;
  }
}

