// Tutorial JavaScript - Interaktive Demo
let demoSeatCount = 0;

function attachDraggable(el, workspace, options = {}) {
    el.style.position = 'absolute';
    el.addEventListener('pointerdown', function startDrag(e) {
        if (e.target.closest('button') || e.target.closest('.demo-timer')) return;
        if (typeof options.skipIf === 'function' && options.skipIf(e, el)) return;
        e.preventDefault();

        const workspaceRect = workspace.getBoundingClientRect();
        const elementRect = el.getBoundingClientRect();
        const offsetX = e.clientX - elementRect.left;
        const offsetY = e.clientY - elementRect.top;

        function moveHandler(moveEvent) {
            let left = moveEvent.clientX - workspaceRect.left - offsetX;
            let top = moveEvent.clientY - workspaceRect.top - offsetY;
            left = Math.max(0, Math.min(left, workspaceRect.width - elementRect.width));
            top = Math.max(0, Math.min(top, workspaceRect.height - elementRect.height));
            el.style.left = left + 'px';
            el.style.top = top + 'px';
        }

        function upHandler() {
            document.removeEventListener('pointermove', moveHandler);
            document.removeEventListener('pointerup', upHandler);
        }

        document.addEventListener('pointermove', moveHandler);
        document.addEventListener('pointerup', upHandler);
    });
}

function addDemoSeat() {
    const workspace = document.getElementById('demo-workspace-1');
    if (!workspace) return;

    demoSeatCount++;
    const el = document.createElement('div');
    el.className = 'demo-element';
    el.dataset.id = demoSeatCount;

    const label = document.createElement('div');
    label.className = 'demo-label';
    label.textContent = '💺';
    el.appendChild(label);

    const timer = document.createElement('div');
    timer.className = 'demo-timer';
    timer.textContent = '10:00';
    timer.onclick = function() {
        editDemoTimer(timer);
    };
    el.appendChild(timer);

    const controls = document.createElement('div');
    controls.className = 'demo-controls';

    const startBtn = document.createElement('button');
    startBtn.textContent = '▶';
    startBtn.onclick = function() {
        alert('Timer würde starten! In der echten App läuft der Timer dann.');
    };
    controls.appendChild(startBtn);

    const delBtn = document.createElement('button');
    delBtn.textContent = '✖';
    delBtn.onclick = function() {
        if (confirm('Element löschen?')) {
            el.remove();
        }
    };
    controls.appendChild(delBtn);

    el.appendChild(controls);

    // Position randomly
    el.style.left = Math.random() * 200 + 50 + 'px';
    el.style.top = Math.random() * 150 + 50 + 'px';

    attachDraggable(el, workspace);
    workspace.appendChild(el);
}

function addDemoBed() {
    const workspace = document.getElementById('demo-workspace-1');
    if (!workspace) return;

    demoSeatCount++;
    const el = document.createElement('div');
    el.className = 'demo-element bed';
    el.dataset.id = demoSeatCount;

    const label = document.createElement('div');
    label.className = 'demo-label';
    label.textContent = '🛏️';
    el.appendChild(label);

    const timer = document.createElement('div');
    timer.className = 'demo-timer';
    timer.textContent = '30:00';
    timer.onclick = function() {
        editDemoTimer(timer);
    };
    el.appendChild(timer);

    const controls = document.createElement('div');
    controls.className = 'demo-controls';

    const startBtn = document.createElement('button');
    startBtn.textContent = '▶';
    startBtn.onclick = function() {
        alert('Timer würde starten! In der echten App läuft der Timer dann.');
    };
    controls.appendChild(startBtn);

    const delBtn = document.createElement('button');
    delBtn.textContent = '✖';
    delBtn.onclick = function() {
        if (confirm('Element löschen?')) {
            el.remove();
        }
    };
    controls.appendChild(delBtn);

    el.appendChild(controls);

    // Position randomly
    el.style.left = Math.random() * 200 + 100 + 'px';
    el.style.top = Math.random() * 100 + 25 + 'px';

    attachDraggable(el, workspace);
    workspace.appendChild(el);
}

function editDemoTimer(timerEl) {
    const current = timerEl.textContent.split(':')[0];
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.value = current;
    input.style.width = '50px';
    input.style.fontSize = '0.7rem';
    input.style.textAlign = 'center';

    timerEl.textContent = '';
    timerEl.appendChild(input);
    input.focus();
    input.select();

    input.onkeydown = function(e) {
        if (e.key === 'Enter') {
            const minutes = Math.max(1, parseInt(input.value) || 1);
            timerEl.textContent = minutes + ':00';
        } else if (e.key === 'Escape') {
            timerEl.textContent = current + ':00';
        }
    };

    input.onblur = function() {
        const minutes = Math.max(1, parseInt(input.value) || 1);
        timerEl.textContent = minutes + ':00';
    };
}

// Demo for section 2
function initDemoSection2() {
    const workspace = document.getElementById('demo-workspace-2');
    if (!workspace) return;

    const el = document.createElement('div');
    el.className = 'demo-element';
    el.style.left = '150px';
    el.style.top = '100px';

    const label = document.createElement('div');
    label.className = 'demo-label';
    label.textContent = '💺';
    el.appendChild(label);

    const timer = document.createElement('div');
    timer.className = 'demo-timer';
    timer.textContent = '10:00';
    timer.onclick = function() {
        editDemoTimer(timer);
    };
    el.appendChild(timer);

    attachDraggable(el, workspace);
    workspace.appendChild(el);
}

// Demo for section 3
function initDemoSection3() {
    const workspace = document.getElementById('demo-workspace-3');
    if (!workspace) return;

    const el = document.createElement('div');
    el.className = 'demo-element';
    el.style.left = '150px';
    el.style.top = '100px';

    const label = document.createElement('div');
    label.className = 'demo-label';
    label.textContent = '💺';
    el.appendChild(label);

    const timer = document.createElement('div');
    timer.className = 'demo-timer';
    timer.textContent = '10:00';
    el.appendChild(timer);

    let remainingSeconds = 10 * 60;
    let intervalId = null;
    let paused = true;

    function updateTimerDisplay() {
        const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
        const seconds = String(remainingSeconds % 60).padStart(2, '0');
        timer.textContent = `${minutes}:${seconds}`;
    }

    function setRunningState(isRunning) {
        paused = !isRunning;
        el.style.background = isRunning ? '#52b788' : '#aaa';
        label.textContent = isRunning ? '⏱️' : '💺';
    }

    const controls = document.createElement('div');
    controls.className = 'demo-controls';

    const startBtn = document.createElement('button');
    startBtn.textContent = '▶';
    startBtn.onclick = function() {
        if (!intervalId) {
            intervalId = setInterval(() => {
                if (remainingSeconds > 0) {
                    remainingSeconds -= 1;
                    updateTimerDisplay();
                } else {
                    clearInterval(intervalId);
                    intervalId = null;
                    setRunningState(false);
                    startBtn.textContent = '▶';
                }
            }, 1000);
        } else {
            clearInterval(intervalId);
            intervalId = null;
        }

        const isRunning = !!intervalId;
        startBtn.textContent = isRunning ? '⏸' : '▶';
        setRunningState(isRunning);
        delBtn.textContent = isRunning ? '✖' : '🔄';
    };
    controls.appendChild(startBtn);

    const delBtn = document.createElement('button');
    delBtn.textContent = '✖';
    const deleteFunc = function() {
        if (confirm('Element löschen?')) {
            clearInterval(intervalId);
            el.remove();
        }
    };
    delBtn.onclick = function() {
        if (delBtn.textContent === '🔄') {
            remainingSeconds = 10 * 60;
            updateTimerDisplay();
            delBtn.textContent = '✖';
            setRunningState(false);
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
                startBtn.textContent = '▶';
            }
        } else {
            deleteFunc();
        }
    };
    controls.appendChild(delBtn);

    el.appendChild(controls);
    attachDraggable(el, workspace);
    workspace.appendChild(el);
}

// Demo for section 4 - Table dragging/resizing
function initDemoSection4() {
    const table = document.getElementById('demo-table-4');
    if (!table) return;

    table.style.transform = 'none';
    table.style.left = '60px';
    table.style.top = '60px';
    table.style.cursor = 'grab';
    table.style.boxSizing = 'border-box';
    table.style.overflow = 'auto';
    attachDraggable(table, table.parentElement, {
        skipIf: function(e, el) {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            return x > rect.width - 24 && y > rect.height - 24;
        }
    });
}

// Demo for section 5
function openDemoSeatDialog() {
    const overlay = document.createElement('div');
    overlay.className = 'demo-dialog-overlay';
    overlay.innerHTML = `
        <div class="demo-dialog-panel">
            <h2>Sitzplatz-Verteilung</h2>
            <p>Gib ein, wie viele Stühle pro Tischseite platziert werden sollen.</p>
            <div class="seat-config-grid">
                <div class="seat-config-row">
                    <label>Oben<input id="demo-top" type="number" min="0" step="1" value="2"></label>
                </div>
                <div class="seat-config-row">
                    <label>Links<input id="demo-left" type="number" min="0" step="1" value="1"></label>
                    <div class="mini-table"></div>
                    <label>Rechts<input id="demo-right" type="number" min="0" step="1" value="1"></label>
                </div>
                <div class="seat-config-row">
                    <label>Unten<input id="demo-bottom" type="number" min="0" step="1" value="1"></label>
                </div>
            </div>
            <div class="dialog-buttons">
                <button type="button" class="cancel-btn">Abbrechen</button>
                <button type="button" class="commit-btn">Platzieren</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    const cancelBtn = overlay.querySelector('.cancel-btn');
    const commitBtn = overlay.querySelector('.commit-btn');

    cancelBtn.onclick = function() { overlay.remove(); };
    commitBtn.onclick = function() {
        const top = parseInt(document.getElementById('demo-top').value) || 0;
        const right = parseInt(document.getElementById('demo-right').value) || 0;
        const bottom = parseInt(document.getElementById('demo-bottom').value) || 0;
        const left = parseInt(document.getElementById('demo-left').value) || 0;

        const workspace = document.getElementById('demo-workspace-5');
        const table = workspace.querySelector('.demo-table');
        if (table) {
            table.style.transform = 'none';
            table.style.left = '120px';
            table.style.top = '80px';
        }

        // Clear existing seats
        Array.from(workspace.querySelectorAll('.demo-element')).forEach(el => el.remove());

        // Add seats based on counts around the table
        const seatStep = 90;
        for (let i = 0; i < top; i++) {
            addSeatAt(workspace, 130 + i * seatStep, 20);
        }
        for (let i = 0; i < bottom; i++) {
            addSeatAt(workspace, 130 + i * seatStep, 250);
        }
        for (let i = 0; i < left; i++) {
            addSeatAt(workspace, 20, 110 + i * seatStep);
        }
        for (let i = 0; i < right; i++) {
            addSeatAt(workspace, 340, 110 + i * seatStep);
        }

        overlay.remove();
    };

    overlay.onclick = function(e) {
        if (e.target === overlay) overlay.remove();
    };
}

function addSeatAt(workspace, x, y) {
    const el = document.createElement('div');
    el.className = 'demo-element';
    el.style.left = x + 'px';
    el.style.top = y + 'px';

    const label = document.createElement('div');
    label.className = 'demo-label';
    label.textContent = '💺';
    el.appendChild(label);

    attachDraggable(el, workspace);
    workspace.appendChild(el);
}

function initDemoSection5() {
    const workspace = document.getElementById('demo-workspace-5');
    if (!workspace) return;
    const table = workspace.querySelector('.demo-table');
    if (!table) return;
    table.style.transform = 'none';
    table.style.left = '120px';
    table.style.top = '80px';
    table.style.boxSizing = 'border-box';
}

// Initialize demos
document.addEventListener('DOMContentLoaded', function() {
    initDemoSection2();
    initDemoSection3();
    initDemoSection4();
    initDemoSection5();
});