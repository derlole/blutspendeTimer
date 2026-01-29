// log.js
window.logMessage = function(message) {
    const logContainer = document.getElementById('logContent');
    const p = document.createElement('p');
    const timestamp = new Date().toLocaleTimeString();
    p.textContent = `[${timestamp}] ${message}`;
    logContainer.appendChild(p);
    // Scroll automatisch nach unten
    logContainer.scrollTop = logContainer.scrollHeight;
};

// Beispiel: automatisch Log-Eintrag beim Laden
logMessage("Seite geladen.");
