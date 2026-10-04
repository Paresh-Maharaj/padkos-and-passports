# Padkos & Passports

A fast, free travel blog for a South African who travels solo and with the family, at home and around the world.

- **Costs nothing to run.** It's hosted on Cloudflare Pages' free plan, with no limit on visitors.
- **Easy to update.** You write in a friendly editor at `yoursite/admin`. No code involved.
- **Fast everywhere.** Pages are built ahead of time and served from Cloudflare's worldwide network, and photos are resized automatically.
- **Ready for Google.** Each page gets proper titles, descriptions, sharing previews (WhatsApp, Facebook, Pinterest), structured data, a sitemap and an RSS feed.
- **Ready to grow.** It comes with a newsletter sign-up box, a "Work with me" media-kit page, a sponsor banner, labels for sponsored stories, and an affiliate-and-privacy page written with POPIA in mind.
- **Easy to read.** Large text, high contrast, a "Larger text" button and a dark mode.

---

## Part 1 — One-time setup (about an afternoon)

Ask a tech-minded friend or grandchild to sit with you for this part. Once it's done, you never need to repeat it.

### Step 1. Create two free accounts

1. **GitHub** (stores your blog safely): <https://github.com/signup>
2. **Cloudflare** (shows your blog to the world): <https://dash.cloudflare.com/sign-up>

### Step 2. Put the blog on GitHub

1. In GitHub, click **+** (top right), then **New repository**.
2. Name it `padkos-and-passports`. Choose **Public**, then click **Create repository**.
3. On the next page, click **uploading an existing file**.
4. Unzip `padkos-and-passports.zip` on your computer. Open the folder and drag **everything inside it** into the GitHub page. Then click **Commit changes**.

> Tip: on a Mac, press **Cmd + Shift + .** in Finder to show hidden files such as `.gitignore`, so they get uploaded too.

### Step 3. Publish it with Cloudflare Pages

1. In Cloudflare, go to **Workers & Pages**, click **Create**, then pick the **Pages** tab and choose **Connect to Git**. (If Cloudflare offers you "Workers" first, look for the link to Pages.)
2. Connect your GitHub account and choose `padkos-and-passports`.
3. Fill in the build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Under **Environment variables**, add `NODE_VERSION` with the value `22`.
4. Click **Save and Deploy**. After a minute or two you'll have a live address such as `https://padkos-and-passports.pages.dev`. **Write it down.**

### Step 4. Tell the blog its address

In GitHub, open each file below, click the ✏️ pencil, make the change, and click **Commit changes**.

| File | What to change |
| --- | --- |
| `public/admin/config.yml` | The 4 lines marked ✏️: your GitHub username, and your site address (the address appears 3 times). |
| `src/data/settings.json` | `"siteUrl"`: your site address. |

### Step 5. Let the editor log in with GitHub

1. In GitHub, go to **Settings → Developer settings → OAuth Apps → New OAuth App**.
   - Application name: `Padkos editor`
   - Homepage URL: your site address
   - Authorization callback URL: your site address followed by `/api/callback`, for example `https://padkos-and-passports.pages.dev/api/callback`
2. Click **Register application**. Copy the **Client ID**, then click **Generate a new client secret** and copy that too.
3. In Cloudflare, open your Pages project, go to **Settings → Variables and Secrets**, and add:
   - `GITHUB_CLIENT_ID`, with the Client ID
   - `GITHUB_CLIENT_SECRET`, with the secret (choose **Encrypt** / **Secret**)
4. Go to **Deployments** and click **Retry deployment** on the latest one, so the new settings take effect.

### Step 6. Open the editor

Go to `your-site-address/admin` and click **Login with GitHub**. You're in.

Open **Site settings** first and fill in your name, bio, email and social links.

---

## Part 2 — Writing a story (every time)

1. Go to `your-site-address/admin` and log in.
2. Click **Stories → New Story**.
3. Fill in the boxes. Each one has a short hint underneath.
   - **Cover photo:** upload straight from your phone or camera. Size doesn't matter.
   - **Describe the cover photo:** one short sentence about what's in the picture. Google uses it, and so do blind readers.
   - **Sponsored story?:** switch this on if a partner paid for any part of the trip. A clear note is added automatically.
4. Write your story in the big box. Use the toolbar for headings, **bold**, lists and extra photos. The preview on the right shows how it will look.
5. Click **Save**. Your story is now a draft, and nobody else can see it.
6. When you're happy, set the status to **Ready**, then click **Publish → Publish now**.

About two minutes later, your story is live.

**To change or delete a story:** open it from the **Stories** list, edit it, then publish again.

**The four sample stories** show how everything looks. Delete them once you've written a few of your own.

---

## Part 3 — Growing your audience (do these when you're ready)

| What | How | Cost |
| --- | --- | --- |
| **Visitor numbers** | In your Cloudflare Pages project, open **Metrics** and turn on **Web Analytics**. It uses no cookies, so no cookie banner is needed. | Free |
| **Google** | Add your site at <https://search.google.com/search-console>, then submit `your-site-address/sitemap-index.xml`. Do the same at Bing Webmaster Tools. | Free |
| **Newsletter** | Sign up with a newsletter service that has a free plan (for example MailerLite, Kit or Buttondown). Find its "HTML form" embed code, and copy the form's `action` address and the email field's `name` into **Site settings → Newsletter**. | Free plans available |
| **Sponsors** | Your **Work with me** page is your media kit. Update its numbers under **Site settings → Media kit**. When a partner books the monthly banner, fill in **Site settings → Sponsor banner** and switch it on. | — |
| **Affiliate links** | Paste affiliate links normally. Links to Booking.com, GetYourGuide, SafariNow, or any link containing `affiliate`, `ref=` or `aff_id`, are labelled for Google automatically. To add more sites, edit the list in `src/lib/rehype-external-links.mjs`. | — |
| **Your own domain** | You can buy a `.co.za` address from any registrar, then add it in Cloudflare Pages under **Custom domains**. Afterwards, update the site address in the files from Step 4 and in the GitHub OAuth App. | About R100 a year (optional) |

**Good habits that help with Google:** write a clear summary for every story, always describe your photos, mention places by name, and come back to update older stories when prices change (there's an "Updated on" date for this).

---

## For helpers and developers

Built with **Astro 7** (pages built ahead of time, no JavaScript framework sent to readers), **Decap CMS** (Git-based editor), **Pagefind** (search with no server), and **Cloudflare Pages Functions** (GitHub login for the editor).

```bash
npm install
npm run dev              # http://localhost:4321
npx decap-server         # in a second terminal: use /admin locally without logging in
npm run build            # builds the site into dist/ and creates the search index
```

| Path | Purpose |
| --- | --- |
| `src/content/posts/` | Stories (Markdown with front-matter). The format is checked in `src/content.config.ts`. |
| `src/content/pages/about.md` | The About page. |
| `src/data/settings.json` | Site-wide settings, edited from the CMS. |
| `src/styles/tokens.css` | Design tokens, matching the *Padkos & Passports* design system. |
| `src/styles/components.css` | Component styles (button, tag, post card, sponsor slot, newsletter, stat). |
| `public/admin/` | The CMS page and its `config.yml`. |
| `functions/api/` | GitHub login handshake for Decap (`auth.js`, `callback.js`). |
| `public/_headers` | Security and caching headers for Cloudflare. |

Licence: MIT. The words and photos you publish remain yours.
