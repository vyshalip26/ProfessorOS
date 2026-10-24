
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

/* Make all application windows draggable by their title bars */
function makeWindowDraggable(windowElement) {
    if (!windowElement) return;

    const header = windowElement.querySelector(".window-header");
    if (!header) return;

    header.addEventListener("pointerdown", function (e) {
        // Do not drag when clicking window controls
        if (e.target.closest("button")) return;
        if (e.button !== 0) return;

        e.preventDefault();

        const rect = windowElement.getBoundingClientRect();

        // Switch to consistent viewport-based positioning
        windowElement.style.position = "fixed";
        windowElement.style.transform = "none";
        windowElement.style.left = rect.left + "px";
        windowElement.style.top = rect.top + "px";
        windowElement.style.zIndex = "200";

        const startX = e.clientX;
        const startY = e.clientY;
        const initialLeft = rect.left;
        const initialTop = rect.top;

        function moveWindow(event) {
            windowElement.style.left =
                initialLeft + event.clientX - startX + "px";

            windowElement.style.top =
                initialTop + event.clientY - startY + "px";
        }

        function stopDragging() {
            document.removeEventListener("pointermove", moveWindow);
            document.removeEventListener("pointerup", stopDragging);
            document.removeEventListener("pointercancel", stopDragging);
        }

        document.addEventListener("pointermove", moveWindow);
        document.addEventListener("pointerup", stopDragging);
        document.addEventListener("pointercancel", stopDragging);
    });
}

// Register each window ONCE
[
    "calculatorWindow",
    "calendarWindow",
    "paintWindow",
    "filesWindow",
    "stopwatchWindow",
    "todoWindow"
].forEach(function (id) {
    makeWindowDraggable(document.getElementById(id));
});

// Stopwatch timer
// Open Stopwatch on double-click
const stopwatchIcon = document.querySelector('.app-item img[alt="Stopwatch"]');
const stopwatchWindow = document.getElementById("stopwatchWindow");

stopwatchIcon.addEventListener("dblclick", () => {
    stopwatchWindow.style.display = "block";
});
let [sec, mins, hrs] = [0, 0, 0];
let displayTime = document.getElementById("stopwatch-display");
let timer = null;

function stopwatch() {
    sec++;

    if (sec == 60) {
        sec = 0;
        mins++;

        if (mins == 60) {
            mins = 0;
            hrs++;
        }
    }

    let h = hrs < 10 ? "0" + hrs : hrs;
    let m = mins < 10 ? "0" + mins : mins;
    let s = sec < 10 ? "0" + sec : sec;

    displayTime.textContent = `${h}:${m}:${s}`;
}

function startStopwatch() {
    if (timer !== null) return;

    timer = setInterval(stopwatch, 1000);
}

function stopStopwatch() {
    clearInterval(timer);
    timer = null;
}

function resetStopwatch() {
    clearInterval(timer);
    timer = null;

    [sec, mins, hrs] = [0, 0, 0];
    displayTime.textContent = "00:00:00";
}
document.getElementById("minimizeStopwatch").onclick = function () {
    stopwatchWindow.style.display = "none";
};

document.getElementById("closeStopwatch").onclick = function () {
    stopwatchWindow.style.display = "none";
}; 



/* =========================
   TO-DO LIST APPLICATION
========================= */

const todoWindow = document.getElementById("todoWindow");
const todoInput = document.getElementById("todoInput");
const todoForm = document.getElementById("todoForm");
const todoList = document.getElementById("todoList");
const todoStatus = document.getElementById("todoStatus");

const todoStorageKey = "professorOS_todos";

let todos = loadTodos();

// Open by double-clicking the desktop icon
const todoIcon = document.querySelector(
    '.app-item img[alt="To-do List"]'
);

if (todoIcon) {
    todoIcon.addEventListener("dblclick", function () {
        todoWindow.style.display = "block";
        renderTodos();
    });
}

// Minimize and close
document.getElementById("minimizeTodo").addEventListener(
    "click",
    function () {
        todoWindow.style.display = "none";
    }
);

document.getElementById("closeTodo").addEventListener(
    "click",
    function () {
        todoWindow.style.display = "none";
    }
);

// Load saved tasks
function loadTodos() {
    try {
        const saved = localStorage.getItem(todoStorageKey);
        const parsed = saved ? JSON.parse(saved) : [];

        if (Array.isArray(parsed)) {
            return parsed.filter(function (todo) {
                return todo &&
                    typeof todo.text === "string" &&
                    typeof todo.completed === "boolean" &&
                    typeof todo.id === "string";
            });
        }
    } catch (error) {
        console.warn("Could not load saved tasks.", error);
    }

    return [];
}

// Save tasks
function saveTodos() {
    try {
        localStorage.setItem(
            todoStorageKey,
            JSON.stringify(todos)
        );
        return true;
    } catch (error) {
        console.error("Could not save tasks.", error);
        todoStatus.textContent =
            "Unable to save. Browser storage may be full.";
        return false;
    }
}

// Add a new task
todoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = todoInput.value.trim();

    if (!text) {
        todoStatus.textContent = "Please enter a task.";
        return;
    }

    const newTodo = {
        id: crypto.randomUUID(),
        text: text,
        completed: false
    };

    todos.push(newTodo);

    if (saveTodos()) {
        todoStatus.textContent = "Task added.";
    }

    todoInput.value = "";
    renderTodos();
    todoInput.focus();
});

// Display all tasks
function renderTodos() {
    todoList.replaceChildren();

    todos.forEach(function (todo) {
        const item = document.createElement("li");
        item.className = "todo-item";

        if (todo.completed) {
            item.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.setAttribute(
            "aria-label",
            "Mark " + todo.text + " as complete"
        );

        checkbox.addEventListener("change", function () {
            todo.completed = checkbox.checked;
            saveTodos();
            renderTodos();
        });

        const taskText = document.createElement("span");
        taskText.textContent = todo.text;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-todo";
        deleteButton.setAttribute(
            "aria-label",
            "Delete " + todo.text
        );

        deleteButton.addEventListener("click", function () {
            todos = todos.filter(function (entry) {
                return entry.id !== todo.id;
            });

            saveTodos();
            renderTodos();
            todoStatus.textContent = "Task deleted.";
        });

        item.append(checkbox, taskText, deleteButton);
        todoList.appendChild(item);
    });

    if (todos.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "No tasks yet. Add your first task!";
        emptyMessage.className = "empty-todos";
        todoList.appendChild(emptyMessage);
    }
}

// Initial display
renderTodos();


makeWindowDraggable(document.getElementById("calculatorWindow"));
makeWindowDraggable(document.getElementById("calendarWindow"));
makeWindowDraggable(document.getElementById("paintWindow"));
makeWindowDraggable(document.getElementById("filesWindow"));
makeWindowDraggable(document.getElementById("stopwatchWindow"));
makeWindowDraggable(document.getElementById("todoWindow"));



const backgroundMusic = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");

backgroundMusic.volume = 0.3; // 30% volume

musicToggle.addEventListener("click", async function () {
    if (backgroundMusic.paused) {
        try {
            await backgroundMusic.play();
            musicToggle.textContent = "🔊 Mute Music";
            musicToggle.setAttribute("aria-pressed", "true");
        } catch (error) {
            musicToggle.textContent = "Music unavailable";
            console.error("Could not play music:", error);
        }
    } else {
        backgroundMusic.pause();
        musicToggle.textContent = "▶ Play Music";
        musicToggle.setAttribute("aria-pressed", "false");
    }
});
