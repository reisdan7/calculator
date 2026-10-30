const currentEl = document.getElementById("current");
const historyEl = document.getElementById("history");
const opButtons = document.querySelectorAll(".key.op");

let current = "0";
let previous = null;
let operator = null;
let startNew = false;

const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };

function show() {
  currentEl.textContent = current;

  if (previous !== null && operator) {
    historyEl.textContent = previous + " " + symbols[operator];
  } else {
    historyEl.textContent = "";
  }

  opButtons.forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.op === operator && startNew);
  });
}

function clean(number) {
  return String(parseFloat(number.toFixed(10)));
}

function calculate(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);

  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") return b === 0 ? null : a / b;
}

function addNumber(num) {
  if (current === "Error") current = "0";

  if (startNew) {
    current = num;
    startNew = false;
  } else if (current === "0") {
    current = num;
  } else if (current.length < 14) {
    current += num;
  }
  show();
}

function addDot() {
  if (current === "Error") current = "0";

  if (startNew) {
    current = "0.";
    startNew = false;
  } else if (!current.includes(".")) {
    current += ".";
  }
  show();
}

function chooseOperator(op) {
  if (current === "Error") return;

  if (operator && !startNew) {
    equals();
    if (current === "Error") return;
  }

  previous = current;
  operator = op;
  startNew = true;
  show();
}

function equals() {
  if (!operator || previous === null) return;

  const result = calculate(previous, current, operator);

  if (result === null) {
    current = "Error";
  } else {
    current = clean(result);
  }

  previous = null;
  operator = null;
  startNew = true;
  show();
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  startNew = false;
  show();
}

function deleteLast() {
  if (startNew || current === "Error") return;

  current = current.slice(0, -1);
  if (current === "" || current === "-") current = "0";
  show();
}

function percent() {
  if (current === "Error") return;

  current = clean(parseFloat(current) / 100);
  show();
}

document.querySelector(".keys").addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.num) addNumber(btn.dataset.num);
  else if (btn.dataset.op) chooseOperator(btn.dataset.op);
  else if (btn.dataset.action === "dot") addDot();
  else if (btn.dataset.action === "equals") equals();
  else if (btn.dataset.action === "clear") clearAll();
  else if (btn.dataset.action === "delete") deleteLast();
  else if (btn.dataset.action === "percent") percent();
});

document.addEventListener("keydown", function (e) {
  if (e.key >= "0" && e.key <= "9") addNumber(e.key);
  else if (e.key === ".") addDot();
  else if (["+", "-", "*", "/"].includes(e.key)) chooseOperator(e.key);
  else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    equals();
  }
  else if (e.key === "Backspace") deleteLast();
  else if (e.key === "Escape") clearAll();
  else if (e.key === "%") percent();
});

show();
