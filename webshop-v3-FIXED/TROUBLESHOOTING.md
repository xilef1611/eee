# 🔧 Troubleshooting Guide

## Problem: Docker Build schlägt fehl mit "npm ci" Error

**Lösung:** ✅ GEFIXT in webshop-fixed.zip
- Dockerfiles wurden auf `npm install` statt `npm ci` umgestellt
- `.dockerignore` Dateien hinzugefügt für bessere Build-Performance

---

## Deployment-Schritte (aktualisiert):

### 1. Alte Container stoppen (falls vorhanden)
```bash
docker-compose down
docker system prune -a  # Optional: Löscht alte Images
```

### 2. Neues ZIP hochladen
```bash
# Auf deinem lokalen Rechner
scp webshop-fixed.zip root@your-vps-ip:/root/

# Auf dem VPS
cd /root
rm -rf webshop  # Altes Verzeichnis löschen
unzip webshop-fixed.zip
cd webshop
```

### 3. Konfiguration anpassen
```bash
nano backend/.env
```

**Wichtig zu ändern:**
- `JWT_SECRET` - Generiere einen sicheren String
- `ADMIN_EMAIL` - Deine Admin-Email
- `ADMIN_PASSWORD` - Sicheres Passwort
- `SHOP_URL` - Deine Domain oder IP (z.B. `http://185.123.45.67` oder `http://meinshop.de`)

### 4. Build und Start
```bash
# Container bauen (das dauert ein paar Minuten beim ersten Mal)
docker-compose up -d --build

# Logs verfolgen um Fehler zu sehen
docker-compose logs -f
```

**Was du sehen solltest:**
```
webshop-backend | 🚀 Server läuft auf Port 5000
webshop-backend | 📦 Shop Name: Mein Webshop
webshop-backend | 💳 OxaPay Integration: Aktiv
```

### 5. Datenbank initialisieren
```bash
# In Backend-Container einloggen
docker exec -it webshop-backend sh

# Datenbank mit Testdaten initialisieren
npm run init-db

# Zurück zum VPS
exit
```

**Ausgabe sollte sein:**
```
✅ Datenbank-Schema initialisiert
✅ Datenbank-Indizes erstellt
✅ Admin-User erstellt
✅ Kategorien erstellt
✅ Beispiel-Produkte erstellt
```

### 6. Testen
```bash
# Prüfe ob Container laufen
docker ps

# Sollte zeigen:
# webshop-backend (Port 5000)
# webshop-frontend (Port 80)
```

**Im Browser öffnen:**
- Shop: `http://DEINE-IP` oder `http://DEINE-DOMAIN`
- Admin Login: `http://DEINE-IP/login`

---

## Häufige Probleme und Lösungen:

### Problem: Port 80 ist bereits belegt
```bash
# Prüfe welcher Prozess Port 80 nutzt
sudo netstat -tulpn | grep :80

# Wenn Apache oder nginx läuft, stoppe ihn
sudo systemctl stop apache2
sudo systemctl stop nginx
```

### Problem: Container startet nicht
```bash
# Logs überprüfen
docker-compose logs backend
docker-compose logs frontend

# Container neu starten
docker-compose restart
```

### Problem: Frontend kann Backend nicht erreichen
**Lösung:** Überprüfe die nginx.conf - das Backend sollte auf `http://backend:5000` erreichbar sein (nicht localhost!)

### Problem: OxaPay Zahlungen funktionieren nicht
**Checklist:**
1. ✅ Ist `SHOP_URL` in backend/.env korrekt gesetzt?
2. ✅ Ist der Callback-Endpoint erreichbar: `http://DEINE-URL/api/payment/callback`
3. ✅ Überprüfe Backend-Logs: `docker-compose logs backend | grep payment`
4. ✅ Teste Callback manuell: `curl http://DEINE-URL/api/health`

### Problem: Admin-Login funktioniert nicht
```bash
# Prüfe ob Admin-User existiert
docker exec -it webshop-backend sh
npm run init-db  # Initialisiert Admin-User neu
exit
```

### Problem: Bilder werden nicht angezeigt
**Lösung:** Überprüfe ob das uploads-Verzeichnis existiert und beschreibbar ist:
```bash
docker exec -it webshop-backend sh
ls -la /app/uploads
chmod 755 /app/uploads
exit
```

---

## Nützliche Befehle:

```bash
# Container Status
docker-compose ps

# Logs anzeigen
docker-compose logs -f

# Container neu starten
docker-compose restart

# Container stoppen
docker-compose down

# Komplett neu bauen
docker-compose down
docker-compose up -d --build

# In Container einloggen
docker exec -it webshop-backend sh
docker exec -it webshop-frontend sh

# Datenbank backup
docker exec webshop-backend cp /app/database/webshop.db /app/database/backup.db
docker cp webshop-backend:/app/database/backup.db ./backup.db
```

---

## Performance-Optimierungen:

### SSL/HTTPS mit Let's Encrypt einrichten
```bash
# Certbot installieren
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Zertifikat erhalten (Container müssen laufen!)
sudo certbot --nginx -d deine-domain.de

# Auto-Renewal testen
sudo certbot renew --dry-run
```

### Firewall konfigurieren
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

---

## Support-Checklist:

Wenn etwas nicht funktioniert, sammle folgende Informationen:

1. **System-Info:**
   ```bash
   docker --version
   docker-compose --version
   cat /etc/os-release
   ```

2. **Container-Status:**
   ```bash
   docker ps -a
   docker-compose logs backend
   docker-compose logs frontend
   ```

3. **Netzwerk:**
   ```bash
   sudo netstat -tulpn | grep LISTEN
   curl http://localhost:5000/api/health
   ```

4. **Konfiguration:**
   ```bash
   cat backend/.env | grep -v PASSWORD | grep -v SECRET
   ```

---

## 🎯 Schnelltest nach Deployment:

```bash
# 1. Health Check
curl http://localhost:5000/api/health
# Sollte zurückgeben: {"status":"OK","timestamp":"..."}

# 2. Produkte abrufen
curl http://localhost:5000/api/products
# Sollte JSON mit Produkten zurückgeben

# 3. Frontend testen
curl http://localhost
# Sollte HTML zurückgeben

# 4. Admin Login testen (im Browser)
# http://DEINE-IP/login
```

**Alles funktioniert wenn:**
✅ Alle 4 Tests erfolgreich sind
✅ Du dich im Admin-Panel einloggen kannst
✅ Produkte auf der Startseite angezeigt werden
✅ Warenkorb funktioniert

---

Viel Erfolg! 🚀
