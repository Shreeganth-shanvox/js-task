const result = document.getElementById("result");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const clearButton = document.getElementById("clear");
const equalsButton = document.getElementById("equals");
const decimalButton = document.getElementById("decimal");
const backspaceButton = document.getElementById("backspace");

let currentNumber = "";
let previousNumber = "";
let operator = "";
let shouldResetDisplay = false;

// Custom function to format standard math symbols for screen display
function getDisplayOperator(op) {
    if (op === "*") return "×";
    if (op === "/") return "÷";
    if (op === "-") return "−";
    return op;
}

// Renders the combined expression to the display screen
function updateDisplay() {
    let expression = "";

    if (previousNumber !== "") {
        expression += previousNumber;
    }
    if (operator !== "") {
        expression += " " + getDisplayOperator(operator) + " ";
    }
    if (currentNumber !== "") {
        expression += currentNumber;
    }

    result.textContent = expression === "" ? "0" : expression;
}

numberButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const number = button.textContent.trim();

        if (shouldResetDisplay) {
            currentNumber = "";
            previousNumber = "";
            operator = "";
            shouldResetDisplay = false;
        }

        if (currentNumber === "0") {
            currentNumber = number;
        } else {
            currentNumber += number;
        }

        updateDisplay();
    });
});

operatorButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        if (shouldResetDisplay) {
            shouldResetDisplay = false;
        }

        if (currentNumber === "" && previousNumber === "") return;

        // If user already entered an expression like "6 + 6" and presses another operator, compute it first
        if (previousNumber !== "" && currentNumber !== "") {
            calculate();
            previousNumber = currentNumber;
            currentNumber = "";
        } else if (currentNumber !== "") {
            previousNumber = currentNumber;
            currentNumber = "";
        }

        operator = button.dataset.operator;
        updateDisplay();
    });
});

equalsButton.addEventListener("click", function() {
    if (previousNumber === "" || currentNumber === "" || operator === "") {
        return;
    }

    calculate();
    shouldResetDisplay = true;
});

function calculate() {
    const firstNumber = Number(previousNumber);
    const secondNumber = Number(currentNumber);
    let answer;

    if (operator === "+") {
        answer = firstNumber + secondNumber;
    } else if (operator === "-") {
        answer = firstNumber - secondNumber;
    } else if (operator === "*") {
        answer = firstNumber * secondNumber;
    } else if (operator === "/") {
        if (secondNumber === 0) {
            result.textContent = "Error";
            currentNumber = "";
            previousNumber = "";
            operator = "";
            return;
        }
        answer = firstNumber / secondNumber;
    }

    answer = Math.round(answer * 100000000) / 100000000;

    currentNumber = answer.toString();
    previousNumber = "";
    operator = "";
    result.textContent = currentNumber;
}

decimalButton.addEventListener("click", function() {
    if (shouldResetDisplay) {
        currentNumber = "0";
        previousNumber = "";
        operator = "";
        shouldResetDisplay = false;
    }

    if (currentNumber === "") {
        currentNumber = "0.";
    } else if (!currentNumber.includes(".")) {
        currentNumber += ".";
    }

    updateDisplay();
});

clearButton.addEventListener("click", function() {
    currentNumber = "";
    previousNumber = "";
    operator = "";
    shouldResetDisplay = false;
    updateDisplay();
});

backspaceButton.addEventListener("click", function() {
    if (shouldResetDisplay) return;

    if (currentNumber !== "") {
        currentNumber = currentNumber.slice(0, -1);
    } else if (operator !== "") {
        operator = "";
        currentNumber = previousNumber;
        previousNumber = "";
    }

    updateDisplay();
});