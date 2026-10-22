
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


/* =========================
   PAINT APPLICATION
========================= */

const paintWindow = document.getElementById("paintWindow");
const paintCanvas = document.getElementById("paintCanvas");
const ctx = paintCanvas.getContext("2d");

const paintColor = document.getElementById("paintColor");
const brushSize = document.getElementById("brushSize");

let drawing = false;
let erasing = false;

document.querySelector('.app-item img[alt="Paint"]')
    .addEventListener("dblclick", function () {
        paintWindow.style.display = "block";
    });

document.getElementById("minimizePaint").onclick = function () {
    paintWindow.style.display = "none";
};

document.getElementById("closePaint").onclick = function () {
    paintWindow.style.display = "none";
};

function getCanvasPosition(e) {
    const rect = paintCanvas.getBoundingClientRect();

    return {
        x: (e.clientX - rect.left) * paintCanvas.width / rect.width,
        y: (e.clientY - rect.top) * paintCanvas.height / rect.height
    };
}

paintCanvas.addEventListener("pointerdown", function (e) {
    drawing = true;
    paintCanvas.setPointerCapture(e.pointerId);

    const pos = getCanvasPosition(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);

    // Draw a dot even when the user only clicks
    ctx.fillStyle = erasing ? "#ffffff" : paintColor.value;
    ctx.arc(pos.x, pos.y, Number(brushSize.value) / 2, 0, Math.PI * 2);
    ctx.fill();
});

paintCanvas.addEventListener("pointermove", function (e) {
    if (!drawing) return;

    const pos = getCanvasPosition(e);

    ctx.lineWidth = Number(brushSize.value);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = erasing ? "#ffffff" : paintColor.value;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
});

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

paintCanvas.addEventListener("pointerup", stopDrawing);
paintCanvas.addEventListener("pointercancel", stopDrawing);

document.getElementById("eraserButton").onclick = function () {
    erasing = !erasing;
    this.textContent = erasing ? "Pencil" : "Eraser";
};

document.getElementById("clearCanvas").onclick = function () {
    ctx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
};

document.getElementById("savePainting").onclick = function () {
    const link = document.createElement("a");
    link.download = "professor-painting.png";
    link.href = paintCanvas.toDataURL("image/png");
    link.click();
};


/* =========================
   FILES APPLICATION
========================= */

const filesWindow = document.getElementById("filesWindow");
const filesList = document.getElementById("filesList");
const filesPath = document.getElementById("filesPath");
const filesStatus = document.getElementById("filesStatus");

const storageKey = "professorOSFiles";

let rootFolder = loadFiles();
let currentFolder = rootFolder;
let folderStack = [];
let selectedFile = null;

function loadFiles() {
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey));

        if (saved && Array.isArray(saved.children)) {
            return saved;
        }
    } catch (error) {
        console.warn("Could not load saved files.", error);
    }

    return {
        name: "Home",
        type: "folder",
        children: [
            { name: "Documents", type: "folder", children: [] },
            { name: "Pictures", type: "folder", children: [] },
            { name: "Projects", type: "folder", children: [] },
            { name: "Welcome.txt", type: "file",
              content: "Welcome to Professor OS!" }
        ]
    };
}

function saveFiles() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(rootFolder));
        filesStatus.textContent = "Changes saved in this browser.";
    } catch (error) {
        filesStatus.textContent =
            "Storage is full or unavailable. Download important files.";
    }
}

document.querySelector('.app-item img[alt="File Folder"]')
    .addEventListener("dblclick", function () {
        filesWindow.style.display = "block";
        renderFiles();
    });

document.getElementById("minimizeFiles").onclick = function () {
    filesWindow.style.display = "none";
};

document.getElementById("closeFiles").onclick = function () {
    filesWindow.style.display = "none";
};

function renderFiles() {
    filesList.replaceChildren();
    selectedFile = null;

    filesPath.textContent = "Home" +
        folderStack.map(folder => " / " + folder.name).join("");

    currentFolder.children.forEach(function (item) {
        const entry = document.createElement("button");
        entry.className = "file-entry";

        const icon = document.createElement("span");
        icon.className = "file-icon";
        icon.textContent = item.type === "folder" ? "📁" : "📄";

        const name = document.createElement("span");
        name.textContent = item.name;

        entry.append(icon, name);

        entry.addEventListener("click", function () {
            selectedFile = item;
            filesStatus.textContent = item.name + " selected.";
        });

        entry.addEventListener("dblclick", function () {
            if (item.type === "folder") {
                folderStack.push(currentFolder);
                currentFolder = item;
                renderFiles();
            } else {
                editTextFile(item);
            }
        });

        filesList.appendChild(entry);
    });

    if (currentFolder.children.length === 0) {
        filesStatus.textContent = "This folder is empty.";
    }
}

function editTextFile(file) {
    const updated = prompt(
        "Edit text file contents:",
        file.content || ""
    );

    if (updated !== null) {
        file.content = updated;
        saveFiles();
    }
}

document.getElementById("filesHome").onclick = function () {
    currentFolder = rootFolder;
    folderStack = [];
    renderFiles();
};

document.getElementById("createFolder").onclick = function () {
    const name = prompt("Enter folder name:");

    if (!name || !name.trim()) return;

    if (currentFolder.children.some(item =>
        item.name.toLowerCase() === name.trim().toLowerCase()
    )) {
        alert("An item with that name already exists.");
        return;
    }

    currentFolder.children.push({
        name: name.trim(),
        type: "folder",
        children: []
    });

    saveFiles();
    renderFiles();
};

document.getElementById("createTextFile").onclick = function () {
    const name = prompt("Enter file name:", "Notes.txt");

    if (!name || !name.trim()) return;

    if (currentFolder.children.some(item =>
        item.name.toLowerCase() === name.trim().toLowerCase()
    )) {
        alert("An item with that name already exists.");
        return;
    }

    const file = {
        name: name.trim(),
        type: "file",
        content: ""
    };

    currentFolder.children.push(file);
    saveFiles();
    renderFiles();
    editTextFile(file);
};

document.getElementById("uploadFile").onclick = function () {
    document.getElementById("fileUploadInput").click();
};

document.getElementById("fileUploadInput")
    .addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function () {
            const name = file.name;

            if (currentFolder.children.some(item =>
                item.name.toLowerCase() === name.toLowerCase()
            )) {
                alert("An item with that name already exists.");
                return;
            }

            currentFolder.children.push({
                name: name,
                type: "file",
                content: String(reader.result)
            });

            saveFiles();
            renderFiles();
            filesStatus.textContent = "Uploaded: " + name;
        };

        reader.onerror = function () {
            filesStatus.textContent = "Could not read that file.";
        };

        // This simple version imports text files only.
        if (file.type.startsWith("text/") ||
            /\.(txt|md|csv|json|html|css|js|xml)$/i.test(file.name)) {
            reader.readAsText(file);
        } else {
            alert("This version supports text files only.");
        }

        e.target.value = "";
    });

// Download the selected text file
const downloadButton = document.createElement("button");
downloadButton.textContent = "Download";
downloadButton.onclick = function () {
    if (!selectedFile || selectedFile.type !== "file") {
        alert("Select a text file first.");
        return;
    }

    const blob = new Blob([selectedFile.content || ""], {
        type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = selectedFile.name;
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
};

document.querySelector(".files-toolbar").appendChild(downloadButton);

renderFiles();


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


makeWindowDraggable(document.getElementById("calculatorWindow"));
makeWindowDraggable(document.getElementById("calendarWindow"));
makeWindowDraggable(document.getElementById("paintWindow"));
makeWindowDraggable(document.getElementById("filesWindow"));