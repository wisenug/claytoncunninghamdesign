# Contact form Worker

Handles the form on `contact.html`. The form posts to `/api/contact`, this
Worker checks the message and emails it to Clayton using Cloudflare Email
Routing (already set up for `info@claytoncunninghamdesign.com`). No outside
service is involved and nothing is stored.

## One-time setup

1. Sign in: `npx wrangler login`
2. Set the inbox that receives messages. It must be a **verified destination
   address** in Cloudflare (dashboard: Email, Email Routing, Destination
   addresses), which is the inbox `info@` already forwards to:

   ```
   cd workers/contact
   npx wrangler secret put CONTACT_TO
   ```

3. Deploy: `npx wrangler deploy`

## Check it

Send a message from the live contact page. It should arrive within a minute,
and Reply should address the visitor. If it doesn't arrive, run
`npx wrangler tail` in this folder and submit again to see the error.

## Notes

- The Worker only answers `POST /api/contact`. Everything else on the domain
  is untouched.
- Spam protection is a hidden trap field plus length limits. If spam becomes
  a problem, add a rate limit rule for `/api/contact` in the Cloudflare
  dashboard (Security, WAF, Rate limiting rules).
- Until the Worker is deployed, the form shows its "didn't go through"
  message and points people to the email address.
