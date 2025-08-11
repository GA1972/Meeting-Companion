# Meeting Companion — Online

A minimal online portal that sends a recording bot into Zoom, Google Meet, or Microsoft Teams using Recall.ai. After meetings end, it fetches the transcript and produces a concise summary and action items using OpenAI. Branded for internal use only.

## Deploy on Vercel

1) Create a new Vercel project and import this folder
2) Add Environment Variables:
   - RECALL_API_KEY
   - OPENAI_API_KEY
   - BASE_URL (set to your deployed URL after the first deploy)
3) Deploy

## Configure Webhook
Set your webhook to: `https://YOUR-APP.vercel.app/api/webhooks/recall` and enable the event that fires when a meeting ends.

## Use
- Open your site
- Paste a meeting link (Zoom, Google Meet, Teams)
- Optional: choose a start time
- Click “Send bot”
- After the meeting ends, check your logs for the summary. You can wire a DB or email later.

## Naming
- Site/product name: Meeting Companion
- Bot display name in meeting: Meeting Scribe

## Notes
This starter intentionally avoids third-party databases. Add Supabase or Vercel Postgres later if you want persistence.
