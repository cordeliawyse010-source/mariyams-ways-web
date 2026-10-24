(() => {
  'use strict';
  const wizard = document.querySelector('#outreach-wizard');
  if (!wizard) return;
  const panels = Array.from(wizard.querySelectorAll('[data-wizard-step]'));
  const markers = Array.from(document.querySelectorAll('.progress-step'));
  const stepStatus = document.querySelector('#wizard-step-status');
  const fields = wizard.querySelector('#organisation-fields');
  let current = 0;

  function show(index) {
    if (index < 0 || index >= panels.length) return;
    current = index;
    panels.forEach((panel, i) => {
      panel.hidden = i !== index;
      panel.setAttribute('aria-hidden', String(i !== index));
    });
    markers.forEach((marker, i) => {
      marker.classList.toggle('is-active', i === index);
      marker.classList.toggle('is-complete', i < index);
      if (i === index) marker.setAttribute('aria-current','step');
      else marker.removeAttribute('aria-current');
    });
    if (stepStatus) stepStatus.textContent = 'Step ' + (index + 1) + ' of 5: ' + ['Organisation', 'Programme', 'Audience', 'Review', 'Complete'][index];
    if (index === 3) updateReview();
    const heading = panels[index].querySelector('h2');
    if (heading) heading.setAttribute('tabindex','-1');
    window.scrollTo({top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    // Focus new step for keyboard/screen reader navigation once it becomes visible.
    if (heading) heading.focus({preventScroll: true});
  }
  function validateStepOne() {
    const inputs = Array.from(fields.querySelectorAll('input[required]'));
    for (const input of inputs) {
      if (!input.checkValidity()) { input.reportValidity(); input.focus(); return false; }
    }
    return true;
  }
  function validateProgramme() {
    if (wizard.querySelector('input[name="programme"]:checked')) return true;
    displayMessage(1, 'Please choose one programme before continuing.'); return false;
  }
  function validateAudience() {
    if (wizard.querySelectorAll('input[name="audience"]:checked').length) return true;
    displayMessage(2, 'Please choose at least one audience group.'); return false;
  }
  function displayMessage(step, value) {
    const el = panels[step].querySelector('.form-status');
    if (el) {el.textContent = value; el.setAttribute('role','alert');}
  }
  function clearMessages() { panels.forEach(panel => {const e = panel.querySelector('.form-status');if (e) e.textContent='';}); }
  function setReview(field, text) { const el = document.querySelector('[data-review="' + field + '"]'); if (el) el.textContent = text; }
  function updateReview() {
    const val = name => {const x = wizard.querySelector('[name="'+name+'"]');return x ? x.value.trim() : '';};
    setReview('organisation',val('organisation'));
    setReview('person',val('person'));
    setReview('email',val('email'));
    setReview('phone',val('phone'));
    setReview('location',val('location'));
    const chosen = wizard.querySelector('input[name="programme"]:checked');
    setReview('programme', chosen ? chosen.value : 'Not selected');
    const list = document.querySelector('#review-audiences');
    list.replaceChildren();
    wizard.querySelectorAll('input[name="audience"]:checked').forEach(input => {
      const tag = document.createElement('span'); tag.className='tag'; tag.textContent=input.value; list.append(tag);
    });
  }
  wizard.addEventListener('click', event => {
    const button = event.target.closest('[data-next], [data-back], [data-submit]');
    if (!button) return;
    event.preventDefault();
    clearMessages();
    if (button.hasAttribute('data-back')) { show(current - 1); return; }
    if (button.hasAttribute('data-submit')) { show(4); return; }
    if (current === 0 && !validateStepOne()) return;
    if (current === 1 && !validateProgramme()) return;
    if (current === 2 && !validateAudience()) return;
    show(current + 1);
  });
  wizard.querySelectorAll('input[name="programme"], input[name="audience"]').forEach(input => input.addEventListener('change', clearMessages));
  // URL hash supports opening the first step; do not reveal unvalidated steps through URL.
  show(0);
})();
