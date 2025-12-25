 (function(){
    let seatCount = 0;
    const workspace = () => document.getElementById('workspace');
    const table = () => document.getElementById('table');

    function createElement(type, opts){
        seatCount++;
        const el = document.createElement('div');
        el.className = 'element' + (type === 'bed' ? ' bed' : '');
        el.dataset.type = type;
        el.dataset.id = seatCount;

        // label (editable)
        const label = document.createElement('div');
        label.className = 'label';
        label.style.fontSize = '16px';
        label.textContent = type === 'bed' ? '🛏️' : '💺';
        label.title = 'Klicken zum Bearbeiten';
        el.appendChild(label);

        // prevent pointerdown on label from starting drag
        label.addEventListener('pointerdown', function(e){ e.stopPropagation(); });

        // inline edit behavior
        label.addEventListener('click', function(e){
            e.stopPropagation();
            if(el._editing) return;
            el._editing = true;
            const current = label.textContent || '';
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'label-edit';
            input.value = current;
            label.textContent = '';
            label.appendChild(input);
            input.focus();
            input.select();

            function finish(save){
                const val = save ? input.value.trim() : current;
                label.removeChild(input);
                label.textContent = val || (type === 'bed' ? '🛏️' : '💺');
                el._editing = false;
            }

            input.addEventListener('keydown', function(ev){
                if(ev.key === 'Enter') finish(true);
                else if(ev.key === 'Escape') finish(false);
            });
            input.addEventListener('blur', function(){ finish(true); });
            // prevent the input from causing parent pointerdown drag
            input.addEventListener('pointerdown', function(ev){ ev.stopPropagation(); });
        });

        // timer display
        const timerDisplay = document.createElement('div');
        timerDisplay.className = 'timer';
        timerDisplay.textContent = '';
        el.appendChild(timerDisplay);

        // controls container
        const controls = document.createElement('div');
        controls.className = 'controls';

        const startBtn = document.createElement('button');
        startBtn.title = 'Start/Pause';
        startBtn.className = 'start';
        startBtn.textContent = '▶';
        controls.appendChild(startBtn);

        const delBtn = document.createElement('button');
        delBtn.title = 'Löschen';
        delBtn.className = 'delete';
        delBtn.textContent = '✖';
        controls.appendChild(delBtn);

        el.appendChild(controls);

        delBtn.addEventListener('click', function(e){
            e.stopPropagation();
            if(el._timer && el._timer.interval) clearInterval(el._timer.interval);
            el.remove();
        });

        // timer setup (seat: 10min, bed: 30min)
        const duration = type === 'bed' ? 30 * 60 : 10 * 60; // seconds
        el._timer = {
            duration: duration,
            remaining: duration,
            running: false,
            interval: null,
            display: timerDisplay,
            startBtn: startBtn
        };

        function formatTime(s){
            const mm = Math.floor(s/60).toString().padStart(2,'0');
            const ss = Math.floor(s%60).toString().padStart(2,'0');
            return `${mm}:${ss}`;
        }

        function updateDisplay(){
            el._timer.display.textContent = formatTime(el._timer.remaining);
            if(el._timer.running){
                el.classList.add('running');
                el.classList.remove('alert');
                startBtn.textContent = '⏸';
            } else {
                el.classList.remove('running');
                el.classList.remove('alert');
                startBtn.textContent = '▶';
            }
            if(el._timer.remaining <= 0){
                el.classList.remove('running');
                el.classList.add('alert');
                startBtn.textContent = '🔁';
            }
        }

        function tick(){
            if(!el._timer.running) return;
            el._timer.remaining = Math.max(0, el._timer.remaining - 1);
            updateDisplay();
            if(el._timer.remaining <= 0){
                el._timer.running = false;
                if(el._timer.interval){ clearInterval(el._timer.interval); el._timer.interval = null; }
            }
        }

        startBtn.addEventListener('click', function(e){
            e.stopPropagation();
            if(el._timer.remaining <= 0){
                // reset only, don't auto-start
                el._timer.remaining = el._timer.duration;
                el._timer.running = false;
                if(el._timer.interval){ clearInterval(el._timer.interval); el._timer.interval = null; }
                updateDisplay();
                return;
            }
            if(el._timer.running){
                // pause
                el._timer.running = false;
                if(el._timer.interval){ clearInterval(el._timer.interval); el._timer.interval = null; }
            } else {
                // start
                el._timer.running = true;
                if(!el._timer.interval){ el._timer.interval = setInterval(tick, 1000); }
            }
            updateDisplay();
        });

        // initialize display
        updateDisplay();

        // initial position: near table center with small random offset
        const ws = workspace();
        ws.appendChild(el);

        requestAnimationFrame(() => {
            const tableRect = table().getBoundingClientRect();
            const wsRect = ws.getBoundingClientRect();
            if(opts && typeof opts.x === 'number' && typeof opts.y === 'number'){
                // absolute placement provided
                const nx = Math.max(10, Math.min(opts.x, wsRect.width - el.offsetWidth - 10));
                const ny = Math.max(10, Math.min(opts.y, wsRect.height - el.offsetHeight - 10));
                el.style.left = nx + 'px';
                el.style.top = ny + 'px';
            } else {
                // deterministic placement: center on table with small deterministic offset based on id
                const centerX = tableRect.left + tableRect.width / 2 - wsRect.left;
                const centerY = tableRect.top + tableRect.height / 2 - wsRect.top;
                // deterministic offsets to slightly separate stacked items
                const idx = seatCount;
                const offsetX = ((idx % 5) - 2) * 18; 
                const offsetY = (Math.floor(idx / 5) - 1) * 18; 
                const finalX = centerX + offsetX;
                const finalY = centerY + offsetY;
                el.style.left = Math.max(10, Math.min(finalX, wsRect.width - el.offsetWidth - 10)) + 'px';
                el.style.top = Math.max(10, Math.min(finalY, wsRect.height - el.offsetHeight - 10)) + 'px';
            }
            // if opts.label provided, set it
            if(opts && typeof opts.label === 'string') label.textContent = opts.label;
        });

        // make draggable via pointer events
        el.style.touchAction = 'none';
        el.addEventListener('pointerdown', onPointerDown);
    }

    let active = null;
    let startX = 0, startY = 0, elStartX = 0, elStartY = 0;

    function onPointerDown(e){
        // only start dragging if not clicking the internal button or editing
        if(e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
        active = this;
        active.setPointerCapture(e.pointerId);
        active.style.cursor = 'grabbing';
        startX = e.clientX; startY = e.clientY;

        const left = parseFloat(active.style.left);
        const top = parseFloat(active.style.top);
        if(!isNaN(left) && !isNaN(top)){
            elStartX = left; elStartY = top;
        } else {
            const wsRect = document.getElementById('workspace').getBoundingClientRect();
            const rect = active.getBoundingClientRect();
            elStartX = rect.left - wsRect.left;
            elStartY = rect.top - wsRect.top;
        }

        active.addEventListener('pointermove', onPointerMove);
        active.addEventListener('pointerup', onPointerUp);
        active.addEventListener('pointercancel', onPointerUp);
    }

    function onPointerMove(e){
        if(!active) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const ws = document.getElementById('workspace');
        const wsRect = ws.getBoundingClientRect();
        let nx = elStartX + dx;
        let ny = elStartY + dy;
        nx = Math.max(0, Math.min(nx, wsRect.width - active.offsetWidth));
        ny = Math.max(0, Math.min(ny, wsRect.height - active.offsetHeight));
        active.style.left = nx + 'px';
        active.style.top = ny + 'px';
    }

    function onPointerUp(e){
        if(!active) return;
        active.style.cursor = 'grab';
        try{ active.releasePointerCapture(e.pointerId); } catch(_){ }
        active.removeEventListener('pointermove', onPointerMove);
        active.removeEventListener('pointerup', onPointerUp);
        active.removeEventListener('pointercancel', onPointerUp);
        active = null;
    }

    // export globals used by index.html
    window.addSeat = function(){ createElement('seat'); };
    window.addBed = function(){ createElement('bed'); };

    // place seats approximately around the main #table element
    // opts: { top: number, right: number, bottom: number, left: number, distance: number, clearExisting: boolean }
    window.placeSeatsAroundTable = function(opts = {}){
        const cfg = Object.assign({ top:4, right:2, bottom:3, left:2, distance: 10, clearExisting: false }, opts);
        const ws = workspace();
        const tableEl = table();
        if(!ws || !tableEl) return;
        const wsRect = ws.getBoundingClientRect();
        const tRect = tableEl.getBoundingClientRect();

        if(cfg.clearExisting){
            // remove existing seats created earlier (class .element and data-type seat)
            const existing = Array.from(ws.querySelectorAll('.element')).filter(e => e.dataset.type === 'seat');
            existing.forEach(e => { if(e._timer && e._timer.interval) clearInterval(e._timer.interval); e.remove(); });
        }

        // element sizes (match stylesheet)
        const seatW = 100, seatH = 100;

        // helper to compute positions along a side with even spacing using table dimensions
        function placeAlongTop(n){
            if(n <= 0) return;
            // horizontal available width on table
            const totalTableW = tRect.width;
            // spacing between seats and table edges
            const gap = Math.max(6, (totalTableW - n * seatW) / (n + 1));
            for(let i=0;i<n;i++){
                const xTable = tRect.left + gap * (i + 1) + seatW * i + seatW / 2; // center x in page coords
                const x = Math.round(xTable - seatW/2 - wsRect.left);
                const y = Math.round(tRect.top - wsRect.top - cfg.distance - seatH);
                createElement('seat', { x: x, y: y });
            }
        }

        function placeAlongBottom(n){
            if(n <= 0) return;
            const totalTableW = tRect.width;
            const gap = Math.max(6, (totalTableW - n * seatW) / (n + 1));
            for(let i=0;i<n;i++){
                const xTable = tRect.left + gap * (i + 1) + seatW * i + seatW / 2;
                const x = Math.round(xTable - seatW/2 - wsRect.left);
                const y = Math.round(tRect.bottom - wsRect.top + cfg.distance);
                createElement('seat', { x: x, y: y });
            }
        }

        function placeAlongLeft(n){
            if(n <= 0) return;
            const totalTableH = tRect.height;
            const gap = Math.max(6, (totalTableH - n * seatH) / (n + 1));
            for(let i=0;i<n;i++){
                const yTable = tRect.top + gap * (i + 1) + seatH * i + seatH / 2;
                const x = Math.round(tRect.left - wsRect.left - cfg.distance - seatW);
                const y = Math.round(yTable - seatH/2 - wsRect.top);
                createElement('seat', { x: x, y: y });
            }
        }

        function placeAlongRight(n){
            if(n <= 0) return;
            const totalTableH = tRect.height;
            const gap = Math.max(6, (totalTableH - n * seatH) / (n + 1));
            for(let i=0;i<n;i++){
                const yTable = tRect.top + gap * (i + 1) + seatH * i + seatH / 2;
                const x = Math.round(tRect.right - wsRect.left + cfg.distance);
                const y = Math.round(yTable - seatH/2 - wsRect.top);
                createElement('seat', { x: x, y: y });
            }
        }

        // run placements
        placeAlongTop(cfg.top);
        placeAlongRight(cfg.right);
        placeAlongBottom(cfg.bottom);
        placeAlongLeft(cfg.left);
    };

    // place elements at fixed absolute offsets relative to the table top-left
    // Edit the numbers in `positions` below to adjust placement quickly.
    // opts: { clearExisting: boolean }
    window.placeAbsoluteLayout = function(opts = {}){
        const cfg = Object.assign({ clearExisting: false }, opts);
        const ws = workspace();
        const tableEl = table();
        if(!ws || !tableEl) return;
        const wsRect = ws.getBoundingClientRect();
        const tRect = tableEl.getBoundingClientRect();

        if(cfg.clearExisting){
            const existing = Array.from(ws.querySelectorAll('.element')).filter(e => e.dataset.type === 'seat' || e.dataset.type === 'bed');
            existing.forEach(e => { if(e._timer && e._timer.interval) clearInterval(e._timer.interval); e.remove(); });
        }

        // base (table top-left) in workspace coordinates
        const baseX = Math.round(tRect.left - wsRect.left);
        const baseY = Math.round(tRect.top - wsRect.top);

        // --- EDIT THESE VALUES to adjust absolute placement ---
        // Offsets are in pixels relative to table top-left
        const positions = [
            // top 4 seats
            {type: 'seat', x: baseX + 40, y: baseY - 300, label: 'T1'},
            {type: 'seat', x: baseX + 160, y: baseY - 300, label: 'T2'},
            {type: 'seat', x: baseX + 280, y: baseY - 300, label: 'T3'},
            {type: 'seat', x: baseX + 400, y: baseY - 300, label: 'T4'},
            // right side 2 seats
            {type: 'seat', x: baseX + tRect.width + 20, y: baseY + 40, label: 'R1'},
            {type: 'seat', x: baseX + tRect.width + 20, y: baseY + 160, label: 'R2'},
            // bottom 3 seats (leave bottom-left area empty)
            {type: 'seat', x: baseX + 220, y: baseY + tRect.height + 20, label: 'B1'},
            {type: 'seat', x: baseX + 340, y: baseY + tRect.height + 20, label: 'B2'},
            {type: 'seat', x: baseX + 460, y: baseY + tRect.height + 20, label: 'B3'},
            // four beds side-by-side (near lower center)
            {type: 'bed', x: baseX + 120, y: baseY + Math.round(tRect.height * 0.6), label: 'Bed1'},
            {type: 'bed', x: baseX + 230, y: baseY + Math.round(tRect.height * 0.6), label: 'Bed2'},
            {type: 'bed', x: baseX + 340, y: baseY + Math.round(tRect.height * 0.6), label: 'Bed3'},
            {type: 'bed', x: baseX + 450, y: baseY + Math.round(tRect.height * 0.6), label: 'Bed4'}
        ];

        // create elements at absolute positions
        positions.forEach(p => {
            createElement(p.type, { x: p.x, y: p.y, label: p.label });
        });
    };

})();
