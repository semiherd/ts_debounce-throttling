import { debounce, throttle } from './lib.mjs';

const $ = (sel) => document.querySelector(sel);

// Debug flag controlled by checkbox in the demo
let DEBUG = false;
const debugToggle = $('#debug-toggle');
if (debugToggle) {
  debugToggle.addEventListener('change', (e) => {
    DEBUG = e.target.checked;
    if (DEBUG) console.log('debug enabled');
  });
}

// Debounce demo
const debInput = $('#deb-input');
const debLog = $('#deb-log');
const debDelay = $('#deb-delay');

const doSave = (v) => {
  const el = document.createElement('div');
  el.textContent = `saved: ${v} @ ${new Date().toLocaleTimeString()}`;
  debLog.prepend(el);
};

let debouncedSave = debounce(doSave, Number(debDelay.value));
if (DEBUG) console.log('debounce demo initialized with delay', Number(debDelay.value));

debDelay.addEventListener('input', () => {
  debouncedSave.cancel();
  debouncedSave = debounce(doSave, Number(debDelay.value));
  if (DEBUG) console.log('debounce delay changed to', Number(debDelay.value));
});

debInput.addEventListener('input', (e) => {
  debouncedSave(e.target.value);
});

$('#deb-flush').addEventListener('click', () => {
  const res = debouncedSave.flush();
  if (DEBUG) console.log('debouncedSave.flush ->', res);
});
$('#deb-cancel').addEventListener('click', () => {
  debouncedSave.cancel();
  if (DEBUG) console.log('debouncedSave.cancel -> canceled');
});

// Throttle demo
const thrInput = $('#thr-input');
const thrLog = $('#thr-log');
const thrDelay = $('#thr-delay');

const doScroll = (v) => {
  const el = document.createElement('div');
  el.textContent = `handled: ${v} @ ${new Date().toLocaleTimeString()}`;
  thrLog.prepend(el);
};

let throttled = throttle(doScroll, Number(thrDelay.value));
if (DEBUG) console.log('throttle demo initialized with interval', Number(thrDelay.value));

thrDelay.addEventListener('input', () => {
  throttled.cancel();
  throttled = throttle(doScroll, Number(thrDelay.value));
  if (DEBUG) console.log('throttle interval changed to', Number(thrDelay.value));
});

thrInput.addEventListener('input', (e) => {
  throttled(e.target.value);
});

$('#thr-flush').addEventListener('click', () => {
  const res = throttled.flush();
  if (DEBUG) console.log('throttled.flush ->', res);
});
$('#thr-cancel').addEventListener('click', () => {
  throttled.cancel();
  if (DEBUG) console.log('throttled.cancel -> canceled');
});

// small helpers
document.querySelectorAll('button').forEach(b => b.addEventListener('click', () => b.blur()));
