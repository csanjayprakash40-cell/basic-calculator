"use strict";

const currentDisplay = document.querySelector("#current-number");
const previousDisplay = document.querySelector("#previous-operation");
const keypad = document.querySelector(".keypad");

let currentInput = "0";
let storedValue = null;
let pendingOperator = null;
let waitingForOperand = false;
let justEvaluated = false;

// Show the current number and the previous operation in the display.
function updateDisplay() {
  currentDisplay.textContent = currentInput;
  previousDisplay.textContent = getPreviousText();
}

// Build the small display line from the stored number and pending operator.
function getPreviousText() {
  if (pendingOperator === null || storedValue === null) {
    return "\u00a0";
  }

  return `${formatNumber(storedValue)} ${getOperatorSymbol(pendingOperator)}`;
}

// Return the familiar calculator symbol for an operator value.
function getOperatorSymbol(operator) {
  const symbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷"
  };

  return symbols[operator];
}

// Convert a numeric result to a readable string and remove floating-point noise.
function formatNumber(number) {
  const roundedNumber = Number(number.toPrecision(12));
  return String(Object.is(roundedNumber, -0) ? 0 : roundedNumber);
}

// Enter a digit, starting a fresh number when the calculator is ready for one.
function enterDigit(digit) {
  if (currentInput === "Error" || justEvaluated) {
    currentInput = digit;
    storedValue = null;
    pendingOperator = null;
    waitingForOperand = false;
    justEvaluated = false;
  } else if (waitingForOperand) {
    currentInput = digit;
    waitingForOperand = false;
  } else {
    currentInput = currentInput === "0" ? digit : currentInput + digit;
  }

  updateDisplay();
}

// Add a decimal point only when the current number does not already have one.
function enterDecimal() {
  if (currentInput === "Error" || justEvaluated) {
    currentInput = "0.";
    storedValue = null;
    pendingOperator = null;
    waitingForOperand = false;
    justEvaluated = false;
  } else if (waitingForOperand) {
    currentInput = "0.";
    waitingForOperand = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }

  updateDisplay();
}

// Save an operator or calculate a pending operation before saving the next one.
function chooseOperator(operator) {
  if (currentInput === "Error") {
    return;
  }

  const inputValue = Number(currentInput);

  if (pendingOperator !== null && !waitingForOperand) {
    const result = calculate(storedValue, inputValue, pendingOperator);

    if (result === null) {
      showError();
      return;
    }

    currentInput = formatNumber(result);
    storedValue = result;
  } else {
    storedValue = inputValue;
  }

  pendingOperator = operator;
  waitingForOperand = true;
  justEvaluated = false;
  updateDisplay();
}

// Apply the selected arithmetic operation to two numbers.
function calculate(firstNumber, secondNumber, operator) {
  let result;

  switch (operator) {
    case "+":
      result = firstNumber + secondNumber;
      break;
    case "-":
      result = firstNumber - secondNumber;
      break;
    case "*":
      result = firstNumber * secondNumber;
      break;
    case "/":
      if (secondNumber === 0) {
        return null;
      }

      result = firstNumber / secondNumber;
      break;
    default:
      return null;
  }

  return Number.isFinite(result) ? Number(formatNumber(result)) : null;
}

// Finish the pending operation and display its expression and result.
function evaluate() {
  if (currentInput === "Error" || pendingOperator === null || storedValue === null || waitingForOperand) {
    return;
  }

  const firstNumber = storedValue;
  const secondNumber = Number(currentInput);
  const operator = pendingOperator;
  const result = calculate(firstNumber, secondNumber, operator);

  if (result === null) {
    showError();
    return;
  }

  previousDisplay.textContent =
    `${formatNumber(firstNumber)} ${getOperatorSymbol(operator)} ${formatNumber(secondNumber)} =`;
  currentInput = formatNumber(result);
  storedValue = null;
  pendingOperator = null;
  waitingForOperand = false;
  justEvaluated = true;
  currentDisplay.textContent = currentInput;
}

// Divide the current number by 100 for percentage input.
function applyPercent() {
  if (currentInput === "Error") {
    return;
  }

  currentInput = formatNumber(Number(currentInput) / 100);
  justEvaluated = false;
  updateDisplay();
}

// Remove the last character from the current number.
function deleteLastDigit() {
  if (currentInput === "Error") {
    clearCalculator();
    return;
  }

  if (justEvaluated) {
    justEvaluated = false;
  }

  if (waitingForOperand) {
    return;
  }

  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
  if (currentInput === "-" || currentInput === "") {
    currentInput = "0";
  }

  updateDisplay();
}

// Reset every part of the calculator to its initial state.
function clearCalculator() {
  currentInput = "0";
  storedValue = null;
  pendingOperator = null;
  waitingForOperand = false;
  justEvaluated = false;
  updateDisplay();
}

// Show an error after an invalid calculation and reset operation state.
function showError() {
  currentInput = "Error";
  storedValue = null;
  pendingOperator = null;
  waitingForOperand = false;
  justEvaluated = false;
  updateDisplay();
}

// Handle a calculator button click using its data attributes.
function handleButtonClick(event) {
  const button = event.target.closest("button");

  if (!button || !keypad.contains(button)) {
    return;
  }

  if (button.dataset.digit !== undefined) {
    enterDigit(button.dataset.digit);
    return;
  }

  if (button.dataset.operator !== undefined) {
    chooseOperator(button.dataset.operator);
    return;
  }

  switch (button.dataset.action) {
    case "decimal":
      enterDecimal();
      break;
    case "percent":
      applyPercent();
      break;
    case "delete":
      deleteLastDigit();
      break;
    case "clear":
      clearCalculator();
      break;
    case "equals":
      evaluate();
      break;
  }
}

// Handle calculator keys while leaving unrelated keys alone.
function handleKeyDown(event) {
  if (/^\d$/.test(event.key)) {
    enterDigit(event.key);
  } else if (event.key === ".") {
    enterDecimal();
  } else if (["+", "-", "*", "/"].includes(event.key)) {
    chooseOperator(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    evaluate();
  } else if (event.key === "Backspace") {
    event.preventDefault();
    deleteLastDigit();
  } else if (event.key === "Escape" || event.key.toLowerCase() === "c") {
    clearCalculator();
  } else if (event.key === "%") {
    applyPercent();
  }
}

keypad.addEventListener("click", handleButtonClick);
document.addEventListener("keydown", handleKeyDown);
updateDisplay();