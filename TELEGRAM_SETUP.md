# Telegram Bot Setup Guide

This guide will help you set up Telegram notifications for link clicks.

## Prerequisites

1. You already have a Telegram bot token from BotFather: `7742080768:AAFaskpr-XCXiEWgcuJhtAsCHiffkhRfyrc`
2. Your bot is created and active

## Step 1: Get Your Group Chat ID

To receive notifications in a Telegram group, you need to get the group's Chat ID. Here are the methods:

### Method 1: Using @userinfobot (Easiest for Groups)

1. Add `@userinfobot` to your Telegram group
2. The bot will automatically send the group Chat ID
3. **Important**: Group Chat IDs are negative numbers (like `-1001234567890`)
4. Copy that number (including the minus sign)

### Method 2: Using Your Bot API

1. Make sure your bot is added to the group
2. Send any message in the group (e.g., `/start` or just type something)
3. Visit this URL in your browser:
   ```
   https://api.telegram.org/bot7742080768:AAFaskpr-XCXiEWgcuJhtAsCHiffkhRfyrc/getUpdates
   ```
4. Look for `"chat":{"id":-1001234567890}` in the response (note the negative number)
5. That number (including the minus sign) is your Group Chat ID

### Method 3: Using @RawDataBot

1. Add `@RawDataBot` to your Telegram group
2. The bot will show you the raw group data including the Chat ID
3. Look for `"id": -1001234567890` (negative number for groups)

**Important Notes:**
- **Personal chats** have positive IDs (e.g., `123456789`)
- **Groups** have negative IDs (e.g., `-1001234567890`)
- **Supergroups** also have negative IDs starting with `-100`
- Make sure your bot has permission to send messages in the group

## Step 2: Configure Group Chat ID

### Option A: Hardcode in Code (Recommended)

Edit `src/app/api/analytics/link-click/route.ts` and replace line 9:

```typescript
const TELEGRAM_CHAT_ID = '-1001234567890'; // Replace with your actual group chat ID (negative number)
```

**Important**: For groups, the Chat ID is a negative number. Make sure to include the minus sign!

### Option B: Environment Variable

Create or update `.env.local` file in your project root:

```env
TELEGRAM_CHAT_ID=-1001234567890
```

Note: Include the minus sign for group chat IDs.

## Step 3: Bot Permissions in Group

Make sure your bot has the necessary permissions in the group:

1. **Add Bot to Group**: The bot must be a member of the group
2. **Send Messages**: The bot needs permission to send messages
   - Go to Group Settings → Permissions
   - Make sure "Send Messages" is enabled for bots
3. **Test the Bot**: Send a test message in the group to verify the bot can send messages

## Step 4: Test the Integration

### Test with Test Endpoint

1. Make sure your dev server is running
2. Visit this URL in your browser:
   ```
   http://localhost:3000/api/telegram/test
   ```
3. You should see a success message if the bot is configured correctly
4. Check your Telegram group for a test message

### Test with Real Link Click

1. Make sure your bot is added to the group and has send message permissions
2. Visit a user page on your website
3. Click on any link
4. Check your Telegram group for a notification message

**Troubleshooting:**
- If you don't see messages, check that the bot is still in the group
- Verify the Chat ID is correct (should be negative for groups, e.g., `-1001234567890`)
- Make sure the bot has permission to send messages in the group
- Check server logs for any error messages
- Use the test endpoint (`/api/telegram/test`) to verify your configuration

## Notification Format

You will receive notifications in this format:

```
🔔 New Link Click!

👤 User: @username
🔗 Link: Link Title
🌐 URL: https://example.com
📍 Location: City, Country
🌍 IP: 123.45.67.89
⏰ Time: 1/15/2025, 10:30:00 AM
```

## Troubleshooting

### Not Receiving Notifications?

1. **Check Group Chat ID**: Make sure your Group Chat ID is correct (should be negative, e.g., `-1001234567890`)
2. **Bot in Group**: Make sure your bot is added to the group
3. **Bot Permissions**: Verify the bot has permission to send messages in the group
4. **Check Bot Token**: Verify the bot token is correct
5. **Check Server Logs**: Look for errors in your server console
6. **Test Endpoint**: Use `/api/telegram/test` to verify your configuration
7. **Send Message in Group**: Try sending any message in the group first to activate the bot

### Getting Errors?

- **"chat not found"**: Bot is not in the group, or Chat ID is incorrect
- **"unauthorized"**: Bot token is incorrect
- **"bad request"**: Chat ID format is wrong (should be a negative number as a string, e.g., `"-1001234567890"`)
- **"bot was blocked"**: The bot was removed from the group or blocked
- **"not enough rights"**: Bot doesn't have permission to send messages in the group

## Security Notes

- Keep your bot token secure
- Don't commit `.env.local` to version control
- Consider using environment variables for production deployments

## Database Setup

**No database setup required!** Link clicks are only sent to Telegram - nothing is stored in the database.

## Features

- ✅ Real-time Telegram notifications
- ✅ No database storage (saves Supabase usage)
- ✅ IP geolocation (country, city)
- ✅ Lightweight and fast
- ✅ All click information sent directly to Telegram

