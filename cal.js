const display = document.getElementById('display');
const keys = document.querySelector('.keys');
const themeToggle = document.getElementById('themeToggle');

let expression = '';
let lastResult = '';

function updateDisplay(val) {
  display.value = val || '0';
}

function appendValue(val) {
  // Prevent multiple decimals in the same number segment
  if (val === '.') {
    const parts = expression.split(/[\+\-\*\/%]/);
    const last = parts[parts.length - 1];
    if (last.includes('.')) return;
  }
  // Avoid double operators
  if (/[+\-*/%]/.test(val) && /[+\-*/%]$/.test(expression)) {
    expression = expression.slice(0, -1) + val;
  } else {
    expression += val;
  }
  updateDisplay(expression);
}

function clearAll() {
  expression = '';
  updateDisplay(expression);
}

function deleteOne() {
  expression = expression.slice(0, -1);
  updateDisplay(expression);
}

function safeEval(expr) {
  // Replace % with /100 multiplication for percentage behavior
  const normalized = expr.replace(/%/g, '/100');
  // Evaluate using Function to avoid eval()
  try {
    const result = Function(`return (${normalized})`)();
    if (!isFinite(result)) throw new Error('Invalid result');
    return result;
  } catch {
    return 'Error';
  }
}

function evaluate() {
  if (!expression) return;
  const result = safeEval(expression);
  updateDisplay(String(result));
  lastResult = String(result);
  expression = String(result) === 'Error' ? '' : String(result);
}

keys.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const val = btn.getAttribute('data-value');
  const action = btn.getAttribute('data-action');

  if (action === 'clear') return clearAll();
  if (action === 'delete') return deleteOne();
  if (action === 'evaluate') return evaluate();
  if (val) appendValue(val);
});

// Keyboard support
window.addEventListener('keydown', (e) => {
  const k = e.key;
  if (/\d/.test(k)) return appendValue(k);
  if (['+', '-', '*', '/', '%', '.'].includes(k)) return appendValue(k);
  if (k === 'Enter' || k === '=') return evaluate();
  if (k === 'Backspace') return deleteOne();
  if (k.toLowerCase() === 'c') return clearAll();
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeToggle.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
});

// Initialize
updateDisplay('');