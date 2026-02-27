function setStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function getStorage(key, def) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? def : JSON.parse(value);
  } catch {
    return def;
  }
}

const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const copyButton = document.getElementById('copyButton');
const clearButton = document.getElementById('clear-button');
const charCount = document.getElementById('charCount');
const lineCount = document.getElementById('lineCount');
const lineLength = document.getElementById('lineLength');
const chunkSizeInput = document.getElementById('chunk-size-input');
const modeSelect = document.getElementById('mode-select');
const tailSplitInput = document.getElementById('tail-split-input');
const tailSplitContainer = document.getElementById('tail-split-container');
const langToggle = document.getElementById('lang-toggle');
const langMenu = document.getElementById('lang-menu');
const langSelect = document.getElementById('lang-select');

modeSelect.value = getStorage('pr98_mode', 'normal');
let chunkSizeMap = getStorage('pr98_chunks', { normal: 98, tail: 50 });
let tailSplitMap = getStorage('pr98_tail_split', { tail: 5 });
chunkSizeInput.value = chunkSizeMap[modeSelect.value] || (modeSelect.value === 'normal' ? 98 : 50);
tailSplitInput.value = tailSplitMap.tail || 5;
inputText.value = getStorage('pr98_text', '');

function cleanText(text) {
  return text.replace(/\s+/g, '');
}

function formatNormal(text, chunkSize) {
  let result = '';
  for (let i = 0; i < text.length; i += chunkSize) {
    if (i > 0) result += '\n';
    result += text.slice(i, i + chunkSize);
  }
  return result;
}

function formatTailSplit(text, firstHead, parts, tailLen) {
  if (text.length <= firstHead + tailLen || parts < 1) {
    return formatTail(text, tailLen);
  }

  let result = '';
  let index = 0;
  result += text.slice(index, index + firstHead);
  index += firstHead;
  result += '\n';

  const left = text.length - index - tailLen;
  const partLen = Math.floor(left / parts);
  const rem = left % parts;

  for (let i = 0; i < parts; i++) {
    const len = partLen + (i < rem ? 1 : 0);
    result += text.slice(index, index + len);
    index += len;
    result += '\n';
  }

  result += text.slice(-tailLen);
  return result;
}

function formatTail(text, tailLen) {
  if (text.length <= tailLen) return text;
  const head = text.slice(0, text.length - tailLen);
  const tail = text.slice(-tailLen);
  return head + '\n' + tail;
}

function autoResizeTextarea(element) {
  element.style.height = '100px';
  if (element.scrollHeight > 100) {
    const height = Math.min(element.scrollHeight, 300);
    element.style.height = `${height}px`;
    element.style.overflowY = height === 300 ? 'auto' : 'hidden';
  } else {
    element.style.overflowY = 'hidden';
  }
}

function autoResizeDiv(element) {
  element.style.height = '100px';
  setTimeout(function () {
    if (element.scrollHeight > 100) {
      const height = Math.min(element.scrollHeight, 300);
      element.style.height = `${height}px`;
      element.style.overflowY = height === 300 ? 'auto' : 'hidden';
    } else {
      element.style.overflowY = 'hidden';
    }
  }, 1);
}

function updateAll() {
  const mode = modeSelect.value;
  const chunkSize = parseInt(chunkSizeInput.value, 10) || 1;
  const rawText = inputText.value;
  const cleaned = cleanText(rawText);

  setStorage('pr98_mode', mode);
  chunkSizeMap[mode] = chunkSize;
  setStorage('pr98_chunks', chunkSizeMap);
  setStorage('pr98_text', rawText);

  let formatted = '';
  if (mode === 'normal') {
    formatted = formatNormal(cleaned, chunkSize);
  } else {
    const parts = parseInt(tailSplitInput.value, 10) || 1;
    tailSplitMap.tail = parts;
    setStorage('pr98_tail_split', tailSplitMap);
    formatted = formatTailSplit(cleaned, 104, parts, chunkSize);
  }

  outputText.textContent = formatted;
  charCount.textContent = cleaned.length;
  lineCount.textContent = formatted ? formatted.split('\n').length : 0;
  lineLength.textContent = chunkSize;

  autoResizeTextarea(inputText);
  autoResizeDiv(outputText);
}

function initializeTailSplit() {
  tailSplitContainer.classList.toggle('hidden', modeSelect.value !== 'tail');
}

function applyLocale(locale) {
  const fallback = (window.APP_LOCALES && window.APP_LOCALES.ru) || {};
  const data = (window.APP_LOCALES && window.APP_LOCALES[locale]) || fallback;

  document.documentElement.lang = locale;
  document.title = data.pageTitle || fallback.pageTitle || document.title;
  document.getElementById('header-title').textContent = data.headerTitle || fallback.headerTitle;
  document.getElementById('book-title').textContent = data.bookTitle || fallback.bookTitle;
  document.getElementById('book-desc').textContent = data.bookDesc || fallback.bookDesc;
  document.getElementById('panel-title').textContent = data.panelTitle || fallback.panelTitle;
  document.getElementById('format-title').textContent = data.formatTitle || fallback.formatTitle;
  document.getElementById('mode-label').textContent = data.modeLabel || fallback.modeLabel;
  document.getElementById('mode-normal').textContent = data.modeNormal || fallback.modeNormal;
  document.getElementById('mode-tail').textContent = data.modeTail || fallback.modeTail;
  document.getElementById('input-label').textContent = data.inputLabel || fallback.inputLabel;
  document.getElementById('inputText').placeholder = data.inputPlaceholder || fallback.inputPlaceholder;
  document.getElementById('tail-parts-label').textContent = data.tailPartsLabel || fallback.tailPartsLabel;
  document.getElementById('tail-chars-label').textContent = data.tailCharsLabel || fallback.tailCharsLabel;
  document.getElementById('copyButton').textContent = data.copyButton || fallback.copyButton;
  document.getElementById('char-count-label').textContent = data.charCountLabel || fallback.charCountLabel;
  document.getElementById('line-count-label').textContent = data.lineCountLabel || fallback.lineCountLabel;
  document.getElementById('line-length-label').textContent = data.lineLengthLabel || fallback.lineLengthLabel;
  document.getElementById('support-text').textContent = data.supportText || fallback.supportText;
  document.getElementById('compression-link-text').textContent = data.compressionLink || fallback.compressionLink;
  document.getElementById('clear-button').title = data.clearTitle || fallback.clearTitle;
  document.getElementById('lang-select').setAttribute('aria-label', data.langAria || fallback.langAria);

  setStorage('pr98_lang', locale);
}

function toggleLangMenu(forceOpen) {
  const open = typeof forceOpen === 'boolean' ? forceOpen : langMenu.classList.contains('hidden');
  langMenu.classList.toggle('hidden', !open);
  langToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
}

let copyTimeout;
copyButton.addEventListener('click', function () {
  const text = outputText.textContent;
  navigator.clipboard.writeText(text);
  copyButton.classList.add('copied');
  clearTimeout(copyTimeout);
  copyTimeout = setTimeout(function () {
    copyButton.classList.remove('copied');
  }, 900);
});

clearButton.addEventListener('click', function (event) {
  event.preventDefault();
  inputText.value = '';
  updateAll();
});

inputText.addEventListener('input', updateAll);
chunkSizeInput.addEventListener('input', function () {
  const value = parseInt(chunkSizeInput.value, 10) || 1;
  chunkSizeInput.value = value;
  updateAll();
});

tailSplitInput.addEventListener('input', function () {
  const value = parseInt(tailSplitInput.value, 10) || 1;
  tailSplitInput.value = value;
  updateAll();
});

modeSelect.addEventListener('change', function () {
  const mode = modeSelect.value;
  chunkSizeInput.value = chunkSizeMap[mode] || (mode === 'normal' ? 98 : 50);
  if (mode === 'tail') {
    tailSplitInput.value = tailSplitMap.tail || 5;
  }
  initializeTailSplit();
  updateAll();
});

langToggle.addEventListener('click', function () {
  toggleLangMenu();
});

langSelect.addEventListener('change', function () {
  applyLocale(langSelect.value);
});

document.addEventListener('click', function (event) {
  if (!langMenu.contains(event.target) && !langToggle.contains(event.target)) {
    toggleLangMenu(false);
  }
});

let lastX = 0;
let lastY = 0;
document.addEventListener('mousemove', function (event) {
  const x = Math.round(event.clientX / window.innerWidth * 5) - 2;
  const y = Math.round(event.clientY / window.innerHeight * 5) - 2;
  if (x !== lastX || y !== lastY) {
    document.body.style.backgroundPosition = `${x}px ${y}px`;
    lastX = x;
    lastY = y;
  }
});

const savedLang = getStorage('pr98_lang', 'ru');
langSelect.value = savedLang;
applyLocale(savedLang);
initializeTailSplit();
updateAll();
autoResizeTextarea(inputText);
autoResizeDiv(outputText);
