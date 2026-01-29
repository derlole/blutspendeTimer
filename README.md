# Sitzplatz Übersicht

**Version:** 1.0.1  
**Creator / Maintainer:** Benjamin Keppler  
**Lizenz:** [MIT License](https://opensource.org/licenses/MIT)  

## Projektübersicht
Dieses Projekt stellt eine interaktive **Sitzplatz- und Bettenübersicht** dar, die komplett im Browser läuft, ohne Backend.  
Es ermöglicht das Hinzufügen, Bearbeiten, Verschieben und Verwalten von Stühlen und Betten um einen zentralen Tisch. Jede Aktion wird protokolliert.

## Features

- **Stuhl / Liege hinzufügen:**  
  - `➕ Stuhl` fügt einen Sitzplatz hinzu  
  - `➕ Liege` fügt ein Bett hinzu  

- **Timer:**  
  - Jeder Sitzplatz oder jede Liege hat einen eigenen Timer (Stuhl: 10 min, Bett: 30 min)  
  - Start/Pause mit `▶ / ⏸`  
  - Restzeit wird im Log angezeigt, beim Löschen erscheint ebenfalls die Restzeit  

- **Element löschen:**  
  - `✖` löscht das Element  
  - Vor dem Löschen erscheint eine Bestätigung inklusive verbleibender Zeit  

- **Drag & Drop:**  
  - Elemente lassen sich per Maus oder Touch frei im Workspace verschieben  

- **Standard-Tischanordnung:**  
  - Mit `Standard Tisch` werden Sitzplätze automatisch um den Tisch positioniert  

- **Logs:**  
  - Alle Aktionen werden im Logfenster festgehalten  
  - Farbliche Unterscheidung:  
    - Grün → Erstellen/Starten  
    - Orange → Pause / zurücksetzen  
    - Rot → Löschen  

- **Persistenz-Warnung:**  
  - Beim Schließen der Seite warnt der Browser, damit keine Daten versehentlich verloren gehen  

## Bedienung

1. **Workspace:**  
   - Zentrale Fläche (`#workspace`) mit Tisch (`#table`)  
   - Neue Elemente erscheinen automatisch im Workspace oder können nachträglich verschoben werden  

2. **Elemente bearbeiten:**  
   - Klick auf das Label (💺 oder 🛏️), um Namen zu ändern  
   - Enter → Speichern, Escape → Abbrechen  

3. **Timer bedienen:**  
   - `▶` → Start, `⏸` → Pause  
   - Timer läuft bis 0:00, danach Alarmstatus angezeigt  

4. **Element löschen:**  
   - `✖` → Löschen  
   - Bestätigung erscheint mit aktueller Restzeit  

5. **Standard-Tisch:**  
   - Fügt mehrere Stühle automatisch um den Tisch herum ein  

6. **Log einsehen:**  
   - Links unter `Log` werden alle Aktionen protokolliert  

## Installation & Nutzung

- Einfach die `index.html` im Browser öffnen (kein Server nötig)  
- Alle Aktionen laufen komplett clientseitig  

## Kontakt

- **E-Mail:** [benjaaimnpekkler@gmail.com](mailto:benjaaimnpekkler@gmail.com)  
- **Telefon:** 01575 1120889  
