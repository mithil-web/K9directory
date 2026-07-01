# Collecting sign-ups → Google Sheet

The site is a static page, so sign-up data (name / email / phone) is sent to a
tiny Google Apps Script that writes each entry into a Google Sheet you own.
This is free, unlimited, and the data stays in your Google Drive.

## One-time setup (~5 minutes)

1. **Create the sheet**
   - Go to https://sheets.google.com and create a new blank spreadsheet.
   - Name it e.g. **"CCC Sign-ups"**. (No columns needed — the script adds them.)

2. **Add the script**
   - In the sheet, click **Extensions → Apps Script**.
   - Delete any starter code, then paste the entire contents of
     [`apps-script.gs`](./apps-script.gs) from this repo.
   - Click the **Save** (disk) icon.

3. **Deploy as a Web app**
   - Click **Deploy → New deployment**.
   - Click the gear ⚙️ next to "Select type" → choose **Web app**.
   - Set:
     - **Description:** CCC signups
     - **Execute as:** *Me*
     - **Who has access:** *Anyone*
   - Click **Deploy**, then **Authorize access** and allow the permissions
     (Google will warn it's "unverified" — that's normal for your own script;
     click *Advanced → Go to project → Allow*).
   - Copy the **Web app URL** — it ends in `/exec`.

4. **Wire it into the site**
   - Open `index.html`, find this line near the top of the `<script>` block:
     ```js
     const SIGNUP_ENDPOINT = "";
     ```
   - Paste your `/exec` URL between the quotes, e.g.:
     ```js
     const SIGNUP_ENDPOINT = "https://script.google.com/macros/s/AKfy.../exec";
     ```
   - Commit / re-upload `index.html`.

## Test it

- Open the live site, tap a trainer → **Unlock contact** → fill the form → submit.
- A new row should appear in your **Signups** tab within a couple of seconds.

## Notes

- The gate is client-side, so it captures normal visitors but isn't bulletproof
  against technical users. Good enough for lead collection; a real backend would
  be needed for hard enforcement later.
- If you ever change the script, click **Deploy → Manage deployments → Edit →
  New version** so the URL keeps working.
