# Gym Tracker

Ein kompakter Gym- und Ernährungs-Tracker als installierbare PWA. Läuft komplett
im Browser und speichert alle Daten ausschließlich lokal auf dem Gerät
(`localStorage`) — es gibt kein Backend, keine Anmeldung, keine Datenübertragung.

## Funktionen

- **Zyklus-Tracking**: Aufbau-/Diätphasen mit Wochen-/Tageszähler und Historie
- **Gewichtsverlauf**: tägliche Einträge, Wochendurchschnitt, Chart (Chart.js)
- **Cardio- & Schritteziele**
- **Ernährungsplan**: 5 Mahlzeiten mit Freitext-Eingabe ("150g Haferflocken,
  250ml Milch, 1 Banane"), automatische Makro-Berechnung über eine eingebaute
  Lebensmittel-Datenbank (erweiterbar)
- **Makro-Ziele** mit Fortschrittsbalken

## Lokal testen

Da die App einen Service Worker registriert, muss sie über `http://` bzw.
`https://` ausgeliefert werden (nicht per `file://` öffnen, sonst funktioniert
die PWA-Installation/Offline-Fähigkeit nicht).

```bash
npx serve .
```

oder z.B. mit Python:

```bash
python -m http.server 8080
```

Danach im Browser `http://localhost:3000` (bzw. der ausgegebene Port) öffnen.

## Installation auf dem Smartphone

### iPhone / iPad (Safari)

1. Die App-URL in **Safari** öffnen (nicht Chrome — "Zum Home-Bildschirm" gibt
   es unter iOS nur in Safari).
2. Unten auf das **Teilen**-Symbol tippen.
3. **"Zum Home-Bildschirm"** auswählen.
4. Namen bestätigen und **"Hinzufügen"** tippen.

Die App erscheint danach als eigenes Icon und startet im Standalone-Modus
(ohne Browser-Leiste).

### Android (Chrome)

1. Die App-URL in **Chrome** öffnen.
2. Rechts oben auf das **Drei-Punkte-Menü** tippen.
3. **"App installieren"** bzw. **"Zum Startbildschirm hinzufügen"** wählen.
4. Installation bestätigen.

## Daten & Datenschutz

Alle Eingaben (Gewicht, Zyklen, Ernährungsplan, eigene Lebensmittel, Ziele)
werden ausschließlich im `localStorage` des Geräts/Browsers gespeichert. Es
gibt keinen Server-Sync — ein Wechsel des Browsers oder Geräts bzw. das Löschen
der Browserdaten führt zum Verlust der Einträge. Unter **Einstellungen** in der
App lassen sich alle Daten manuell zurücksetzen.

## Technischer Aufbau

- `index.html` / `styles.css` / `app.js` — die App selbst
- `manifest.webmanifest` — PWA-Manifest (Name, Icons, Standalone-Display)
- `sw.js` — Service Worker mit Cache-first-Strategie für das App-Shell
  (HTML/CSS/JS/Icons + die Chart.js-Bibliothek), damit die App auch offline
  bzw. bei schlechter Verbindung lädt
- `icons/` — App-Icons (192×192, 512×512, Apple-Touch-Icon)
