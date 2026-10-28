# Tischlein deck dich

Tischlein deck dich ist mein persönliches Kochbuch fürs Tablet: Rezepte mit skalierbaren Portionen, ein Vorrat, der Gerichte vorschlägt, und Nährwerte, die man anklicken und verstehen kann.

## So funktioniert's

- Statische PWA (HTML/JS/CSS, kein Build-Schritt), läuft auf GitHub Pages und offline.
- Ein Rezept = eine JSON-Datei in `recipes/`. `{id}` im Schritt-Text wird durch die skalierte Menge ersetzt.
- Skalieren: EL/TL und Stück runden auf ½, g und ml skalieren linear.
- Drei Stufen pro Rezept, von Hand in der JSON gesetzt: `"levels": { "nutrition": "high", "taste": "high", "cost": "low" }` (Werte `high` / `medium` / `low`).
- Vorrat in `pantry.json`: ein Eintrag pro Produkt mit `category` (derselbe Schlüssel wie in den Rezept-Zutaten), `location` (`fridge` / `cupboard` / `freezer`), `status` (`sealed` / `open` / `low` / `empty`), `opened_on` und `best_opened_days`. Die Vorrat-Seite zeigt, was offen zu lange steht, und welche Rezepte mit dem Vorrat gehen.
- Sterne (1–5) und Gekocht/Wunschliste werden im Browser des Geräts gespeichert (`localStorage`). Unter „Meine Bewertungen (Export)“ lassen sie sich kopieren und in die Rezeptdateien übernehmen.

## Neues Rezept

1. `recipes/<id>.json` anlegen (Vorlage: `recipes/red-lentil-sweet-potato-curry.json`).
2. `node tools/build-index.mjs` ausführen, damit es in der Liste erscheint.
3. Bei Änderungen an App-Dateien in `sw.js` die `CACHE`-Version hochzählen.

## Lokal testen

```bash
python -m http.server 8123
```

Dann http://localhost:8123 öffnen.

Hintergrund und Planung: [docs/HANDOVER.md](docs/HANDOVER.md).
