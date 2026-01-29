// log.js
window.logMessage = function(message, color) {
    const logContainer = document.getElementById('logContent');
    const p = document.createElement('p');
    const timestamp = new Date().toLocaleTimeString();
    p.textContent = `[${timestamp}] ${message}`;

    if(color){
        p.style.color = color;
    } else {
        p.style.color = "#fff"; 
    }
    
    logContainer.appendChild(p);
    logContainer.scrollTop = logContainer.scrollHeight;
};
logMessage("Seite geladen.", "green");

