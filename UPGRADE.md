# 🚀 Upgrade-Anleitung: v1 → v2

## Was ist neu in v2.0?

### 🎨 Design-Overhaul
- ✨ **Neue Hero Landing Page** mit interaktivem Terminal (PostHog-inspired)
- 🌙 **Vollständiges Dark Theme** mit Neon-Glow-Effekten
- ⚡ **Moderne Animationen** und glassmorphism UI

### 🧪 Custom Synthesis Services
- 📄 **Neue Services-Page** mit 6 detaillierten Service-Kategorien
- 📊 **Prozess-Timeline** für Custom Synthesis
- 🎯 **Quality Standards** und Features

### 🎯 Terminal-Interface
- 💻 **Command-Line Navigation** auf der Homepage
- ⌨️ Befehle: `help`, `shop`, `synthesis`, `products`, `contact`, `clear`
- 🔄 **Live-Command-Feedback**

---

## 🔄 Upgrade-Prozess (5 Minuten)

### Option 1: Saubere Neuinstallation (Empfohlen)

```bash
# 1. Alte Version stoppen
cd /root/webshop  # oder Ihr Installationspfad
docker-compose down

# 2. Backup erstellen (WICHTIG!)
cp -r webshop webshop-v1-backup
docker exec webshop-backend cp /app/database/webshop.db /app/database/backup.db
docker cp webshop-backend:/app/database/backup.db ./database-backup.db

# 3. Alte Version entfernen
cd ..
rm -rf webshop

# 4. Neue Version hochladen und entpacken
unzip webshop-v2-COMPLETE.zip
cd webshop

# 5. .env-Datei aus Backup übernehmen
cp ../webshop-v1-backup/backend/.env backend/.env

# ODER: Neu konfigurieren
nano backend/.env
# Ändern Sie: JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, SHOP_URL

# 6. Datenbank aus Backup wiederherstellen (optional)
cp ../database-backup.db backend/database/webshop.db

# 7. Container starten
docker-compose up -d --build

# 8. Logs überprüfen
docker-compose logs -f

# 9. Testen
# http://your-vps-ip
```

---

### Option 2: In-Place-Update (für Fortgeschrittene)

```bash
# 1. Backup erstellen
cd /root/webshop
docker-compose down
cp -r . ../webshop-v1-backup

# 2. Neue Dateien hochladen (nur Frontend)
# Ersetzen Sie:
# - frontend/src/pages/HeroLanding.js
# - frontend/src/pages/HeroLanding.css
# - frontend/src/pages/Synthesis.js
# - frontend/src/pages/Synthesis.css
# - frontend/src/App.js
# - frontend/src/index.css

# 3. App.js aktualisieren
# Fügen Sie hinzu:
# import HeroLanding from './pages/HeroLanding';
# import Synthesis from './pages/Synthesis';
# 
# Routen aktualisieren:
# <Route path="/" element={<HeroLanding />} />
# <Route path="/synthesis" element={<Synthesis />} />

# 4. Container neu bauen
docker-compose up -d --build
```

---

## ✅ Nach dem Upgrade prüfen

1. **Homepage**: Sollte die neue Hero-Landing-Page zeigen
   - Terminal-Interface funktioniert
   - Befehle wie `help` und `shop` funktionieren

2. **Synthesis Page**: http://your-ip/synthesis
   - Alle 6 Services werden angezeigt
   - Navigation funktioniert

3. **Dark Theme**: Überall dunkler Hintergrund
   - Neon-Effekte sichtbar
   - Buttons mit Glow-Effekt

4. **Shop-Funktionen**: Alte Features funktionieren weiter
   - Produkte, Warenkorb, Checkout
   - Admin-Dashboard
   - OxaPay-Zahlungen

---

## 🐛 Troubleshooting

### Frontend zeigt weiße Seite
```bash
# Browser-Cache leeren
# Oder: Hard Reload (Strg+Shift+R)

# Container-Logs prüfen
docker-compose logs frontend
```

### Terminal funktioniert nicht
```bash
# JavaScript-Fehler in Browser-Konsole prüfen (F12)
# Container neu bauen
docker-compose down
docker-compose up -d --build
```

### Dark Theme wird nicht angewendet
```bash
# index.css wurde möglicherweise nicht aktualisiert
# Prüfen Sie: frontend/src/index.css
# Sollte enthalten: --bg-primary: #0a0a0f;
```

### Alte Homepage wird noch angezeigt
```bash
# App.js Route überprüfen
# Sollte sein: <Route path="/" element={<HeroLanding />} />
# Nicht: <Route path="/" element={<Home />} />
```

---

## 🔙 Rollback zu v1 (falls nötig)

```bash
# Container stoppen
docker-compose down

# Alte Version wiederherstellen
cd /root
rm -rf webshop
mv webshop-v1-backup webshop
cd webshop

# Starten
docker-compose up -d
```

---

## 📝 Migrations-Checklist

- [ ] Backup der alten Version erstellt
- [ ] Datenbank gesichert
- [ ] .env-Datei angepasst oder übernommen
- [ ] Container erfolgreich gestartet
- [ ] Homepage zeigt neue Landing Page
- [ ] Terminal-Interface funktioniert
- [ ] Synthesis-Page erreichbar
- [ ] Shop-Funktionen testen (Warenkorb, Checkout)
- [ ] Admin-Dashboard funktioniert
- [ ] OxaPay-Zahlungen testen

---

## 🎉 Nach erfolgreichem Upgrade

1. **Browser-Cache leeren** bei allen Nutzern
2. **SSL-Zertifikat aktualisieren** falls nötig
3. **Performance testen** mit neuen Features
4. **Feedback sammeln** von ersten Besuchern

---

Viel Erfolg mit v2.0! 🚀
