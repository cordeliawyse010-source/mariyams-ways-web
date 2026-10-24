(() => {
  'use strict';
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const notice = document.querySelector('#contact-notice');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    notice.hidden = false;
    notice.textContent = 'Preview form completed. This offline website is not connected to a mailbox, so your message was not sent. The Foundation’s real contact address or a submission service can be added later.';
    notice.setAttribute('role', 'status');
    notice.scrollIntoView({behavior:'smooth',block:'nearest'});
  });
})();
