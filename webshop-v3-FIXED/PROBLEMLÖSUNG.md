# 🔧 PROBLEM-LÖSUNG: v3 Update funktioniert nicht

## Was ist passiert?
Die Seite zeigt noch **v2** (keine neue Landing Page mit Terminal).

## Mögliche Ursachen:
1. ❌ Frontend-Container wurde nicht neu gebaut
2. ❌ Neue Dateien nicht richtig kopiert
3. ❌ Browser-Cache zeigt alte Version
4. ❌ Docker nutzt alte Images

---

## 🚀 LÖSUNG (3 Optionen)

### **Option 1: QUICK-FIX (wenn Dateien schon da sind)**

```bash
# SSH zu VPS
ssh root@asklepi0s.top

# Quick-Fix ausführen
cd /root/webshop
bash quick-fix.sh
```

**Was macht das?**
- Stoppt Container
- Löscht alle alten Docker-Images
- Baut Container komplett neu (--no-cache)
- Startet neu

**Dauer:** 3-4 Minuten

---

### **Option 2: KOMPLETTES NEU-UPDATE**

```bash
# SSH zu VPS
ssh root@asklepi0s.top

# Korrigiertes Update-Script ausführen
cd /root
bash webshop/update-v3-FIXED.sh
```

**Was macht das?**
- Erstellt Backup
- Entpackt v3 neu
- Kopiert .env und Datenbank
- Baut alles neu
- Startet Container

**Dauer:** 5-6 Minuten

---

### **Option 3: MANUELLES DEBUG**

```bash
ssh root@asklepi0s.top

# Debug-Script ausführen
cd /root/webshop
bash debug.sh
```

Das zeigt dir genau, welche Dateien fehlen oder falsch sind.

**Dann basierend auf Output:**

#### Falls Dateien fehlen:
```bash
cd /root
rm -rf webshop
unzip webshop-v3-FINAL.zip
cp webshop-v2-backup/backend/.env webshop-v3/backend/.env
cp webshop-v2-backup/backend/database/webshop.db webshop-v3/backend/database/
mv webshop-v3 webshop
cd webshop
docker-compose up -d --build
```

#### Falls Dateien da sind, aber Container falsch:
```bash
cd /root/webshop
docker-compose down
docker system prune -af
docker-compose build --no-cache
docker-compose up -d
```

---

## ✅ TESTEN nach dem Fix

### 1. Warte 30 Sekunden
```bash
sleep 30
```

### 2. Prüfe Container
```bash
docker-compose ps
```

Sollte zeigen:
```
webshop-backend    Up
webshop-frontend   Up
```

### 3. Prüfe Backend-Logs
```bash
docker-compose logs backend | tail -20
```

Sollte enthalten:
```
✅ Datenbank-Schema initialisiert (v3 mit allen neuen Features)
🚀 Server läuft auf Port 5000
```

### 4. Prüfe Frontend
```bash
docker-compose logs frontend | tail -20
```

Sollte KEINE Errors zeigen.

### 5. Browser-Test
```
1. Öffne: http://asklepi0s.top
2. Hard Reload: Strg+Shift+R (Chrome/Firefox)
3. Oder: Inkognito-Fenster

Du solltest sehen:
✅ Neue Landing Page mit animiertem Background
✅ Interaktives Terminal
✅ "Type 'help' for commands"
```

---

## 🐛 SPEZIFISCHE PROBLEME

### "Container starten nicht"
```bash
# Logs anschauen
docker-compose logs backend
docker-compose logs frontend

# Häufiger Fix:
docker system prune -af
docker-compose build --no-cache
docker-compose up -d
```

### "Alte Seite wird angezeigt"
```bash
# Browser-Cache-Problem!
1. Hard Reload: Strg+Shift+R
2. DevTools öffnen (F12)
3. Network-Tab → "Disable cache" aktivieren
4. Seite neu laden

# Oder Inkognito-Fenster:
Strg+Shift+N (Chrome)
Strg+Shift+P (Firefox)
```

### "404 Errors in Browser-Console"
```bash
# Frontend wurde nicht richtig gebaut
cd /root/webshop
docker-compose restart frontend

# Falls das nicht hilft:
docker-compose down
docker-compose build frontend --no-cache
docker-compose up -d
```

### "Backend-Errors in Logs"
```bash
# Datenbank-Problem
cd /root/webshop
docker exec -it webshop-backend node -e "
const db = require('./config/database');
console.log('DB initialized');
"

# Falls Error: Datenbank neu erstellen
rm backend/database/webshop.db
docker-compose restart backend
docker exec -it webshop-backend npm run init-db
```

---

## 🔙 ROLLBACK (wenn gar nichts funktioniert)

```bash
cd /root
docker-compose -f webshop/docker-compose.yml down
rm -rf webshop
mv webshop-v2-backup webshop
cd webshop
docker-compose up -d

# Warte 30 Sekunden
sleep 30

# Teste
curl http://localhost
```

---

## 📞 WENN NICHTS HILFT

Schicke mir die Output von:

```bash
# 1. Container-Status
docker-compose ps

# 2. Backend-Logs
docker-compose logs backend | tail -50

# 3. Frontend-Logs  
docker-compose logs frontend | tail -50

# 4. Dateisystem-Check
ls -la backend/routes/ | grep -E "(variants|tickets|coupons)"
ls -la frontend/src/pages/ | grep Hero
cat frontend/src/App.js | grep -E "(HeroLanding|Home)" | head -5
```

---

## 💡 PRÄVENTIVE MASSNAHMEN

Für zukünftige Updates:

```bash
# Immer mit --no-cache bauen
docker-compose build --no-cache

# Alte Images regelmäßig löschen
docker system prune -af

# Browser-Cache deaktivieren beim Testen
# DevTools → Network → Disable cache
```

---

## ✅ SUCCESS CHECKLIST

Nach erfolgreichem Fix solltest du haben:

- [ ] Container laufen (docker-compose ps)
- [ ] Keine Errors in Logs
- [ ] Neue Landing Page sichtbar
- [ ] Terminal funktioniert (Type "help")
- [ ] Admin-Login funktioniert
- [ ] Settings-Page erreichbar (Admin → Settings)

---

**Los geht's! Versuch zuerst Option 1 (Quick-Fix)** 🚀
