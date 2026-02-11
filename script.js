function setStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function getStorage(key, def) {
  try {
    let v = localStorage.getItem(key);
    return v === null ? def : JSON.parse(v);
  } catch { return def; }
}
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const copyButton = document.getElementById('copyButton');
const charCount = document.getElementById('charCount');
const lineCount = document.getElementById('lineCount');
const lineLength = document.getElementById('lineLength');
const chunkSizeInput = document.getElementById('chunk-size-input');
const modeSelect = document.getElementById('mode-select');
const tailSplitInput = document.getElementById('tail-split-input');
const tailSplitContainer = document.getElementById('tail-split-container');
modeSelect.value = getStorage('pr98_mode', 'normal');
let chunkSizeMap = getStorage('pr98_chunks', {normal:98, tail:50});
let tailSplitMap = getStorage('pr98_tail_split', {tail:5});
let lastMode = modeSelect.value;
chunkSizeInput.value = chunkSizeMap[lastMode] || (lastMode === 'normal'?98:50);
tailSplitInput.value = tailSplitMap['tail'] || 5;
inputText.value = getStorage('pr98_text', '');
function cleanText(txt) {
  return txt.replace(/\s+/g, '');
}
function formatNormal(text, chunkSize) {
  let result = '';
  for(let i=0; i<text.length; i+=chunkSize) {
    if(i>0) result+='\n';
    result+=text.slice(i, i+chunkSize);
  }
  return result;
}
function formatTailSplit(text, firstHead, parts, tailLen) {
  if (text.length <= firstHead + tailLen || parts < 1) {
    return formatTail(text, tailLen);
  }
  let result = '';
  let idx = 0;
  result += text.slice(idx, idx+firstHead);
  idx += firstHead;
  result += '\n';
  let left = text.length - idx - tailLen;
  let partLen = Math.floor(left / parts);
  let rem = left % parts;
  for(let i=0; i<parts; i++) {
    let len = partLen + (i < rem ? 1 : 0);
    result += text.slice(idx, idx+len);
    idx += len;
    result += '\n';
  }
  result += text.slice(-tailLen);
  return result;
}
function formatTail(text, tailLen) {
  if (text.length <= tailLen) return text;
  let head = text.slice(0, text.length-tailLen);
  let tail = text.slice(-tailLen);
  let tailLines = '';
  for(let i=0; i<tail.length; i+=tailLen) {
    if(i>0) tailLines+='\n';
    tailLines+=tail.slice(i, i+tailLen);
  }
  return head + '\n' + tailLines;
}
function autoResizeTextarea(el) {
  el.style.height = "100px";
  if (el.scrollHeight > 100) {
    let h = Math.min(el.scrollHeight, 300);
    el.style.height = h + "px";
    el.style.overflowY = h === 300 ? "auto" : "hidden";
  } else {
    el.style.overflowY = "hidden";
  }
}
function autoResizeDiv(div) {
  div.style.height = "100px";
  setTimeout(function(){
    if (div.scrollHeight > 100) {
      let h = Math.min(div.scrollHeight, 300);
      div.style.height = h + "px";
      div.style.overflowY = h === 300 ? "auto" : "hidden";
    } else {
      div.style.overflowY = "hidden";
    }
  }, 1);
}
function updateAll() {
  let mode = modeSelect.value;
  let chunkSize = parseInt(chunkSizeInput.value)||1;
  let rawText = inputText.value;
  let cleaned = cleanText(rawText);

  setStorage('pr98_mode', mode);
  chunkSizeMap[mode] = chunkSize;
  setStorage('pr98_chunks', chunkSizeMap);
  setStorage('pr98_text', rawText);

  let formatted = '';
  if(mode==='normal') {
    formatted = formatNormal(cleaned, chunkSize);
  } else {
    let parts = parseInt(tailSplitInput.value) || 1;
    tailSplitMap['tail'] = parts;
    setStorage('pr98_tail_split', tailSplitMap);
    formatted = formatTailSplit(cleaned, 104, parts, chunkSize);
  }
  outputText.textContent = formatted;
  charCount.textContent = cleaned.length;
  let lines = formatted ? formatted.split('\n').length : 0;
  lineCount.textContent = lines;
  lineLength.textContent = chunkSize;

  autoResizeTextarea(inputText);
  autoResizeDiv(outputText);
}
let copyTimeout;
copyButton.addEventListener('click', function() {
  let txt = outputText.textContent;
  navigator.clipboard.writeText(txt);
  copyButton.classList.add('copied');
  clearTimeout(copyTimeout);
  copyTimeout = setTimeout(() => copyButton.classList.remove('copied'), 900);
});
inputText.addEventListener('input', updateAll);
inputText.addEventListener('input', function(){autoResizeTextarea(inputText)});
chunkSizeInput.addEventListener('input', function(){
  let v = parseInt(chunkSizeInput.value) || 1;
  chunkSizeInput.value = v;
  updateAll();
});
tailSplitInput.addEventListener('input', function(){
  let v = parseInt(tailSplitInput.value) || 1;
  tailSplitInput.value = v;
  updateAll();
});
modeSelect.addEventListener('change', function(){
  let m = modeSelect.value;
  chunkSizeInput.value = chunkSizeMap[m] || (m==='normal'?98:50);
  if (m === 'tail') {
    tailSplitInput.value = tailSplitMap['tail'] || 5;
    tailSplitContainer.style.display = '';
  } else {
    tailSplitContainer.style.display = 'none';
  }
  updateAll();
});
let lastX = 0, lastY = 0;
document.addEventListener('mousemove', function(e) {
  const x = Math.round(e.clientX / window.innerWidth * 5) - 2;
  const y = Math.round(e.clientY / window.innerHeight * 5) - 2;
  if (x !== lastX || y !== lastY) {
    document.body.style.backgroundPosition = `${x*1}px ${y*1}px`;
    lastX = x; lastY = y;
  }
});
function initializeTailSplit() {
  if (modeSelect.value === 'tail') {
    tailSplitContainer.style.display = '';
  } else {
    tailSplitContainer.style.display = 'none';
  }
}
updateAll();
autoResizeTextarea(inputText);
autoResizeDiv(outputText);
initializeTailSplit();
function clearFields() {
  inputText.value = '';
  updateAll();
}
