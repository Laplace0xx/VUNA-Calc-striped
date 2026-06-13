// ===============================
// 🧠 SMART RESULT MEMORY FEATURE
// ===============================

let LAST_RESULT = 0;
let currentExpression = "";

// ------------------------------
// Theme Toggle Logic
// ------------------------------
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    btn.innerHTML = "☀️";
    btn.title = "Switch to light mode";
    localStorage.setItem("theme", "dark");
  } else {
    btn.innerHTML = "🌙";
    btn.title = "Switch to dark mode";
    localStorage.setItem("theme", "light");
  }
}

// Set theme on page load from localStorage
window.addEventListener("DOMContentLoaded", function () {
  const theme = localStorage.getItem("theme");
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  if (btn) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      btn.innerHTML = "☀️";
      btn.title = "Switch to light mode";
    } else {
      btn.innerHTML = "🌙";
      btn.title = "Switch to dark mode";
    }
  }
});

// ------------------------------
// Calculator State
// ------------------------------
// ------------------------------
// Basic Calculator Functions
// ------------------------------
function appendToResult(value) {
  currentExpression += value.toString();
  updateResult();
}

function bracketToResult(value) {
  currentExpression += value;
  updateResult();
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateResult();
}

function operatorToResult(value) {
  if (value === "^") {
    currentExpression += "**";
  } else {
    currentExpression += value;
  }
  updateResult();
}

function clearResult() {
  currentExpression = "";
  updateResult();
}


function normalizeExpression(expr) {
  return expr
    .replace(/asin\(/g, "asinDeg(")
    .replace(/acos\(/g, "acosDeg(")
    .replace(/atan\(/g, "atanDeg(")
    .replace(/sin\(/g, "sinDeg(")
    .replace(/cos\(/g, "cosDeg(")
    .replace(/tan\(/g, "tanDeg(")
    .replace(/asinh\(/g, "asinh(")
    .replace(/sinh\(/g, "sinh(")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bpi\b/g, "Math.PI");
}

function percentToResult() {
  if (!currentExpression) {
    return;
  }

  const match = currentExpression.match(/(.+?)(\*\*|[+\-*/^])([0-9.]*)$/);

  if (!match) {
    const num = parseFloat(currentExpression);
    if (isNaN(num)) {
      return;
    }

    currentExpression = (num / 100).toString();
  } else {
    const leftPart = match[1];
    const rightPart = match[3];

    if (!rightPart) {
      return;
    }

    let leftVal;

    try {
      leftVal = eval(leftPart); // eslint-disable-line no-eval
    } catch {
      leftVal = parseFloat(leftPart);
    }

    const rightVal = parseFloat(rightPart);
    if (isNaN(leftVal) || isNaN(rightVal)) {
      return;
    }

    const percentVal = (leftVal * rightVal) / 100;

    currentExpression = percentVal.toString();
  }

  // 🔥 ADD THIS LINE
  currentExpression += "*";

  updateResult();
}

// ------------------------------
// Calculate Result
// ------------------------------
function calculateExpression(expression) {
  try {
    let normalizedExpression = normalizeExpression(expression);

    // 🧠 Replace "ans" with last result automatically
    normalizedExpression = normalizedExpression.replace(
      /\bans\b/gi,
      LAST_RESULT,
    );

    // Calculate result
    const result = eval(normalizedExpression); // eslint-disable-line no-eval
    console.log("Calculated result for expression:", expression, "->", result);

    if (isNaN(result) || !isFinite(result)) {
      throw new Error();
    }

    return result;
  } catch {
    return "Error";
  }
}
function calculateResult() {
  if (!currentExpression) {
    return;
  }
    const display = document.getElementById("result");
    // Calculate result
    const calculatedResult = calculateExpression(currentExpression);
    const result = String(calculatedResult);

    // Save result for future expressions
    LAST_RESULT = result;

    // Display normally
    display.value = result;

    currentExpression = result;
    updateResult();
}


function updateResult() {
  document.getElementById("result").value = currentExpression || "0";
}

// ------------------------------
// Graph Plotting
// ------------------------------
function plotGraph() {
  const modal = document.getElementById("graph-modal");
  if (modal) {
    modal.classList.add("open");
    drawGraph();
  }
}

function closeGraphModal() {
  const modal = document.getElementById("graph-modal");
  if (modal) {
    modal.classList.remove("open");
  }
}

function drawGraph() {
  const equationInput = document.getElementById("graph-equation");
  const xMinInput = document.getElementById("graph-xmin");
  const xMaxInput = document.getElementById("graph-xmax");
  const canvas = document.getElementById("graph-canvas");

  if (!equationInput || !canvas) {
    return;
  }

  const expr = equationInput.value.trim();
  if (!expr) {
    return;
  }

  const xMin = parseFloat(xMinInput.value) || -10;
  const xMax = parseFloat(xMaxInput.value) || 10;
  if (xMin >= xMax) {
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || 600;
  const h = canvas.clientHeight || 300;
  canvas.width = w * dpr;
  canvas.height = h * dpr;

  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const plotW = w - padding.left - padding.right;
  const plotH = h - padding.top - padding.bottom;
  const yMin = -10;
  const yMax = 10;

  function xToPixel(x) {
    return padding.left + ((x - xMin) / (xMax - xMin)) * plotW;
  }

  function yToPixel(y) {
    return padding.top + plotH - ((y - yMin) / (yMax - yMin)) * plotH;
  }

  const isDark = document.body.classList.contains("dark-mode");
  const bgColor = isDark ? "#2d2d2d" : "#ffffff";
  const gridColor = isDark ? "#444444" : "#e9ecef";
  const axisColor = isDark ? "#888888" : "#495057";
  const curveColor = "#0d6efd";
  const textColor = isDark ? "#cccccc" : "#495057";

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);

  // draw grid
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 0.5;
  for (let x = Math.ceil(xMin); x <= xMax; x++) {
    if (x === 0) {
      continue;
    }
    const px = xToPixel(x);
    ctx.beginPath();
    ctx.moveTo(px, padding.top);
    ctx.lineTo(px, h - padding.bottom);
    ctx.stroke();
  }
  for (let y = Math.ceil(yMin); y <= yMax; y++) {
    if (y === 0) {
      continue;
    }
    const py = yToPixel(y);
    ctx.beginPath();
    ctx.moveTo(padding.left, py);
    ctx.lineTo(w - padding.right, py);
    ctx.stroke();
  }

  // draw axes
  ctx.strokeStyle = axisColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const xAxisY = yToPixel(0);
  ctx.moveTo(padding.left, xAxisY);
  ctx.lineTo(w - padding.right, xAxisY);
  ctx.stroke();
  const yAxisX = xToPixel(0);
  ctx.beginPath();
  ctx.moveTo(yAxisX, padding.top);
  ctx.lineTo(yAxisX, h - padding.bottom);
  ctx.stroke();

  // tick labels
  ctx.fillStyle = textColor;
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let x = Math.ceil(xMin); x <= xMax; x++) {
    if (x === 0) {
      continue;
    }
    const px = xToPixel(x);
    ctx.fillText(x.toString(), px, xAxisY + 4);
  }
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let y = Math.ceil(yMin); y <= yMax; y++) {
    if (y === 0) {
      continue;
    }
    const py = yToPixel(y);
    ctx.fillText(y.toString(), yAxisX - 6, py);
  }

  // draw curve
  ctx.strokeStyle = curveColor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();

  const steps = plotW * 2;
  let first = true;

  for (let i = 0; i <= steps; i++) {
    const x = xMin + ((xMax - xMin) * i) / steps;
    let normalized = expr.toLowerCase()
      .replace(/(\d)x/g, '$1*x')
      .replace(/x/g, `(${x})`);
    normalized = normalizeExpression(normalized);
    let y;
    try {
      y = eval(normalized); // eslint-disable-line no-eval
    } catch {
      y = NaN;
    }

    if (isNaN(y) || !isFinite(y)) {
      first = true;
      continue;
    }

    if (y < yMin - 5 || y > yMax + 5) {
      first = true;
      continue;
    }

    const px = xToPixel(x);
    const py = yToPixel(y);

    if (first) {
      ctx.moveTo(px, py);
      first = false;
    } else {
      ctx.lineTo(px, py);
    }
  }

  ctx.stroke();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    get LAST_RESULT() { return LAST_RESULT; },
    set LAST_RESULT(v) { LAST_RESULT = v; },
    get currentExpression() { return currentExpression; },
    set currentExpression(v) { currentExpression = v; },
    appendToResult,
    bracketToResult,
    backspace,
    operatorToResult,
    clearResult,
    normalizeExpression,
    percentToResult,
    calculateExpression,
    calculateResult,
    updateResult,
    toggleTheme,
    plotGraph,
    closeGraphModal,
    drawGraph,
  };
}