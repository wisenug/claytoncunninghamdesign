/* contact.js — contact form: sends the message in place and reports the
   result. Without JavaScript the form posts normally and the Worker
   redirects back here with ?sent=1 or ?error=1. Requires site.js. */
(function () {
  var form = document.getElementById('contact-form');
  var status = document.getElementById('contact-status');
  var sent = document.getElementById('contact-sent');
  var button = document.getElementById('contact-submit');
  if (!form || !status || !sent || !button) return;

  var FAILED = 'That didn’t go through. Please email info@claytoncunninghamdesign.com instead.';

  function showSent() {
    form.hidden = true;
    sent.hidden = false;
    sent.focus();
  }

  // Result of a no-JavaScript submit, or a reload after one
  var params = new URLSearchParams(location.search);
  if (params.has('sent')) showSent();
  else if (params.has('error')) status.textContent = FAILED;
  if (params.has('sent') || params.has('error')) history.replaceState(null, '', location.pathname);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (button.disabled) return;
    button.disabled = true;
    status.textContent = 'Sending…';
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(function (data) {
      if (!data || !data.ok) throw new Error('rejected');
      showSent();
    }).catch(function () {
      status.textContent = FAILED;
      button.disabled = false;
    });
  });
})();
