/* Contact form handler for claytoncunninghamdesign.com.

   Receives the POST from contact.html at /api/contact and emails it to
   Clayton through Cloudflare Email Routing. Nothing is stored. The visitor's
   address goes in Reply-To, so replying to the email answers them directly.

   Setup and deploy steps are in README.md next to this file. */

import { EmailMessage } from 'cloudflare:email';

const SITE = 'https://www.claytoncunninghamdesign.com';
const DOMAIN = 'claytoncunninghamdesign.com';
const FROM = `contact-form@${DOMAIN}`;
const LIMITS = { name: 120, email: 200, message: 5000 };
const MAX_BODY_BYTES = 20000;

// Header values must never contain line breaks (that is how header
// injection works), and display names lose quotes and angle brackets.
const oneLine = s => s.replace(/[\r\n\t]+/g, ' ').trim();
const displayName = s => oneLine(s).replace(/["<>\\]/g, '');
const isEmail = s => /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+$/.test(s);

function base64(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

// RFC 2047 encoded word, so names and subjects with accents survive
const encodedWord = text => `=?UTF-8?B?${base64(text)}?=`;

function buildMessage({ name, email, message, to }) {
  const body = `${message}\n\n--\n${name} <${email}>\nSent from the contact form at ${SITE}/contact.html\n`;
  return [
    `From: ${encodedWord('Portfolio contact form')} <${FROM}>`,
    `To: <${to}>`,
    `Reply-To: ${encodedWord(displayName(name))} <${email}>`,
    `Subject: ${encodedWord(`Portfolio message from ${oneLine(name)}`)}`,
    `Message-ID: <${crypto.randomUUID()}@${DOMAIN}>`,
    `Date: ${new Date().toUTCString().replace('GMT', '+0000')}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    base64(body).replace(/.{1,76}/g, '$&\r\n'),
  ].join('\r\n');
}

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
    }

    // The page's script asks for JSON; a plain form post (no JavaScript)
    // gets sent back to the contact page with the result in the URL.
    const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
    const reply = (ok, status, error) => wantsJson
      ? Response.json(ok ? { ok: true } : { ok: false, error }, { status })
      : Response.redirect(`${SITE}/contact.html?${ok ? 'sent' : 'error'}=1`, 303);

    // Only the site's own form may post here
    const origin = request.headers.get('Origin');
    if (origin && origin !== SITE) return reply(false, 403, 'forbidden');

    if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY_BYTES) {
      return reply(false, 413, 'too_large');
    }

    let form;
    try {
      form = await request.formData();
    } catch (err) {
      return reply(false, 400, 'invalid');
    }
    const field = key => {
      const value = form.get(key);
      return typeof value === 'string' ? value.trim() : '';
    };

    // Spam trap: the hidden "website" field is only ever filled by bots.
    // Report success so they don't learn to leave it empty.
    if (field('website')) return reply(true, 200);

    const name = field('name');
    const email = field('email');
    const message = field('message');
    if (!name || !message || !isEmail(email)) return reply(false, 400, 'invalid');
    if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
      return reply(false, 400, 'too_long');
    }

    try {
      const to = env.CONTACT_TO;
      await env.MAIL.send(new EmailMessage(FROM, to, buildMessage({ name, email, message, to })));
    } catch (err) {
      console.error('contact: send failed', err && err.message);
      return reply(false, 502, 'send_failed');
    }
    return reply(true, 200);
  },
};
