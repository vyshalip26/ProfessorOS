
function updateTime() {
    var currentTime = new Date().toLocaleString();
    var timeElement = document.getElementById("timeElement");
    timeElement.innerHTML =currentTime;
}
setInterval(updateTime, 1000);

document.querySelectorAll(".app-item").forEach(function (app) {
    let startX = 0;
    let startY = 0;
    let moveX = 0;
    let moveY = 0;

    app.addEventListener("mousedown", function (e) {
        e.preventDefault();

        startX = e.clientX - moveX;
        startY = e.clientY - moveY;

        function moveApp(e) {
            moveX = e.clientX - startX;
            moveY = e.clientY - startY;

            app.style.transform =
                `translate(${moveX}px, ${moveY}px)`;
        }

        function stopMoving() {
            document.removeEventListener("mousemove", moveApp);
            document.removeEventListener("mouseup", stopMoving);
        }

        document.addEventListener("mousemove", moveApp);
        document.addEventListener("mouseup", stopMoving);
    });
});


const calculatorIcon = document.querySelector(
    '.app-item img[alt="Calculator"]'
);

const calculatorWindow = document.getElementById(
    "calculatorWindow"
);

const minimizeButton = document.getElementById(
    "minimizeCalculator"
);

const closeButton = document.getElementById(
    "closeCalculator"
);

const display = document.getElementById("calcDisplay");

// Open the calculator by double-clicking its desktop icon
calculatorIcon.addEventListener("dblclick", function () {
    calculatorWindow.style.display = "block";
});

// Minimize the calculator
minimizeButton.addEventListener("click", function () {
    calculatorWindow.style.display = "none";
});

// Close the calculator
closeButton.addEventListener("click", function () {
    calculatorWindow.style.display = "none";
    clearCalculator();
});

// Calculator logic
let current = "0";
let previous = null;
let operator = null;
let startNewNumber = false;

function updateDisplay() {
    display.value = current;
}

function clearCalculator() {
    current = "0";
    previous = null;
    operator = null;
    startNewNumber = false;
    updateDisplay();
}

function calculate() {
    const a = Number(previous);
    const b = Number(current);
    let result;

    switch (operator) {
        case "+":
            result = a + b;
            break;
        case "-":
            result = a - b;
            break;
        case "*":
            result = a * b;
            break;
        case "/":
            if (b === 0) {
                current = "Cannot divide by zero";
                previous = null;
                operator = null;
                startNewNumber = true;
                updateDisplay();
                return;
            }
            result = a / b;
            break;
        default:
            return;
    }

    current = String(Number(result.toPrecision(10)));
    previous = null;
    operator = null;
    startNewNumber = true;
    updateDisplay();
}

document.querySelectorAll(".calculator-buttons button")
    .forEach(function (button) {
        button.addEventListener("click", function () {
            const number = button.dataset.number;
            const op = button.dataset.operator;
            const action = button.dataset.action;

            if (action === "clear") {
                clearCalculator();
                return;
            }

            if (action === "delete") {
                if (startNewNumber) {
                    current = "0";
                    startNewNumber = false;
                } else {
                    current = current.slice(0, -1) || "0";
                }
                updateDisplay();
                return;
            }

            if (action === "equals") {
                calculate();
                return;
            }

            if (number !== undefined) {
                if (startNewNumber) {
                    current = number === "." ? "0." : number;
                    startNewNumber = false;
                } else if (number === ".") {
                    if (!current.includes(".")) current += ".";
                } else if (current === "0") {
                    current = number;
                } else if (current.length < 14) {
                    current += number;
                }

                updateDisplay();
                return;
            }

            if (op !== undefined) {
                if (operator && !startNewNumber) {
                    calculate();
                }

                previous = current;
                operator = op;
                startNewNumber = true;
            }
        });
    });

    
const calendarIcon = document.querySelector(
    '.app-item img[alt="Calendar"]'
);

const calendarWindow = document.getElementById("calendarWindow");
const calendarMinimize = document.getElementById("minimizeCalendar");
const calendarClose = document.getElementById("closeCalendar");

const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const selectedDateText = document.getElementById("selectedDate");

let displayedDate = new Date();
let selectedDate = new Date();

function openCalendar() {
    calendarWindow.style.display = "block";
    renderCalendar();
}

calendarIcon.addEventListener("dblclick", openCalendar);

calendarMinimize.addEventListener("click", function () {
    calendarWindow.style.display = "none";
});

calendarClose.addEventListener("click", function () {
    calendarWindow.style.display = "none";
});

function renderCalendar() {
    const year = displayedDate.getFullYear();
    const month = displayedDate.getMonth();

    monthYear.textContent = displayedDate.toLocaleDateString(
        undefined,
        { month: "long", year: "numeric" }
    );

    calendarDays.replaceChildren();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("span");
        calendarDays.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const button = document.createElement("button");
        button.textContent = day;

        const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

        const isSelected =
            day === selectedDate.getDate() &&
            month === selectedDate.getMonth() &&
            year === selectedDate.getFullYear();

        if (isToday) button.classList.add("today");
        if (isSelected) button.classList.add("selected");

        button.addEventListener("click", function () {
            selectedDate = new Date(year, month, day);
            updateSelectedDate();
            renderCalendar();
        });

        calendarDays.appendChild(button);
    }

    updateSelectedDate();
}

function updateSelectedDate() {
    selectedDateText.textContent =
        "Selected: " +
        selectedDate.toLocaleDateString(undefined, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}

document.getElementById("prevMonth").addEventListener("click", function () {
    displayedDate.setMonth(displayedDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", function () {
    displayedDate.setMonth(displayedDate.getMonth() + 1);
    renderCalendar();
});

document.getElementById("todayButton").addEventListener("click", function () {
    displayedDate = new Date();
    selectedDate = new Date();
    renderCalendar();
});


function makeWindowDraggable(windowElement) {
    const header = windowElement.querySelector(".window-header");

    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    header.addEventListener("mousedown", function (e) {
        // Don't drag when clicking minimize or close
        if (e.target.closest("button")) return;

        e.preventDefault();

        const rect = windowElement.getBoundingClientRect();

        // Remove centering transform before dragging
        windowElement.style.transform = "none";
        windowElement.style.left = rect.left + "px";
        windowElement.style.top = rect.top + "px";

        startX = e.clientX;
        startY = e.clientY;
        initialLeft = rect.left;
        initialTop = rect.top;

        function moveWindow(e) {
            windowElement.style.left =
                initialLeft + e.clientX - startX + "px";

            windowElement.style.top =
                initialTop + e.clientY - startY + "px";
        }

        function stopDragging() {
            document.removeEventListener("mousemove", moveWindow);
            document.removeEventListener("mouseup", stopDragging);
        }

        document.addEventListener("mousemove", moveWindow);
        document.addEventListener("mouseup", stopDragging);
    });
}

// Make both application windows draggable
makeWindowDraggable(document.getElementById("calculatorWindow"));
makeWindowDraggable(document.getElementById("calendarWindow"));
