# WebShop - E-Commerce Platform mit OxaPay Integration

Ein vollständiger, selbst-hostbarer Webshop mit React Frontend, Node.js Backend und OxaPay Kryptowährungs-Payment-Integration.

## 🚀 Features

- ✅ Modernes React Frontend mit responsivem Design
- ✅ Node.js/Express REST API Backend
- ✅ SQLite Datenbank (einfach zu deployen)
- ✅ OxaPay Integration für Krypto-Zahlungen (BTC, ETH, USDT, LTC, TRX)
- ✅ Admin-Dashboard für Produktverwaltung
- ✅ Warenkorb-System
- ✅ Bestellungsverwaltung
- ✅ JWT-Authentifizierung
- ✅ Docker-Ready für einfaches Deployment

## 📋 Voraussetzungen

- VPS mit Ubuntu 20.04+ oder Debian 10+
- Docker und Docker Compose installiert
- Domain (optional, aber empfohlen)

## 🛠️ Installation auf VPS

### Schritt 1: Docker installieren (falls noch nicht installiert)

```bash
# Docker installieren
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose installieren
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# User zu docker Gruppe hinzufügen
sudo usermod -aG docker $USER
```

### Schritt 2: Projekt hochladen

```bash
# ZIP auf VPS hochladen (z.B. via scp)
scp webshop.zip user@your-vps-ip:/home/user/

# Auf VPS einloggen
ssh user@your-vps-ip

# Entpacken
unzip webshop.zip
cd webshop
```

### Schritt 3: Konfiguration anpassen

```bash
# Backend .env bearbeiten
nano backend/.env
```

**WICHTIG**: Ändern Sie folgende Werte:

```env
# JWT Secret - Generieren Sie einen sicheren Random String!
JWT_SECRET=IHR-SICHERER-RANDOM-STRING-HIER

# Admin Credentials - Ändern Sie diese!
ADMIN_EMAIL=ihre@email.de
ADMIN_PASSWORD=SicheresPasswort123!

# Shop URL - Ihre Domain oder IP
SHOP_URL=http://ihre-domain.de  # oder http://ihre-ip-adresse

# OxaPay API Key (bereits konfiguriert)
OXAPAY_MERCHANT_API_KEY=IATBVJ-ZETSQG-ERLMYY-ODTKGZ
```

### Schritt 4: Deployment starten

```bash
# Docker Container bauen und starten
docker-compose up -d --build

# Logs überprüfen
docker-compose logs -f
```

### Schritt 5: Datenbank initialisieren

```bash
# In Backend Container einloggen
docker exec -it webshop-backend sh

# Datenbank initialisieren
npm run init-db

# Container verlassen
exit
```

### Schritt 6: Zugriff

Öffnen Sie Ihren Browser und navigieren Sie zu:
- **Shop**: http://ihre-ip-adresse (oder http://ihre-domain.de)
- **Admin Login**: http://ihre-ip-adresse/login

**Standard Admin-Zugangsdaten** (ändern Sie diese sofort!):
- Email: admin@shop.com (oder was Sie in .env gesetzt haben)
- Passwort: admin123 (oder was Sie in .env gesetzt haben)

## 🔧 Verwaltung

### Container starten/stoppen

```bash
# Starten
docker-compose up -d

# Stoppen
docker-compose down

# Neu starten
docker-compose restart

# Logs anzeigen
docker-compose logs -f
```

### Datenbank-Backup erstellen

```bash
# Backup der SQLite-Datenbank
docker exec webshop-backend cp /app/database/webshop.db /app/database/backup-$(date +%Y%m%d).db

# Backup herunterladen
docker cp webshop-backend:/app/database/backup-20240101.db ./backup.db
```

### Updates deployen

```bash
# Container stoppen
docker-compose down

# Neue Version hochladen und entpacken
# ... 

# Neu bauen und starten
docker-compose up -d --build
```

## 📦 Manuelle Installation (ohne Docker)

### Backend

```bash
cd backend

# Dependencies installieren
npm install

# Datenbank initialisieren
npm run init-db

# Server starten
npm start
```

### Frontend

```bash
cd frontend

# Dependencies installieren
npm install

# Production Build erstellen
npm run build

# Serve mit einem Webserver (z.B. nginx)
```

## 💳 OxaPay Integration

Die OxaPay-Integration ist bereits vollständig konfiguriert mit Ihrem API-Key: `IATBVJ-ZETSQG-ERLMYY-ODTKGZ`

### Wie es funktioniert:

1. Kunde legt Produkte in den Warenkorb
2. Beim Checkout werden Bestelldaten erfasst
3. Nach Absenden wird automatisch eine OxaPay-Rechnung erstellt
4. Kunde wird zu OxaPay weitergeleitet
5. Nach Zahlung wird automatisch ein Callback an Ihren Shop gesendet
6. Bestellstatus wird automatisch aktualisiert

### Wichtig:

- Stellen Sie sicher, dass Ihre VPS-IP/Domain von außen erreichbar ist
- OxaPay benötigt Zugriff auf den Callback-Endpoint: `http://ihre-domain.de/api/payment/callback`

## 🛡️ Sicherheit

**Wichtige Sicherheitsmaßnahmen:**

1. **Ändern Sie sofort das Admin-Passwort** nach dem ersten Login!
2. **Generieren Sie einen neuen JWT_SECRET** in der .env Datei
3. **Setzen Sie eine Firewall** auf (z.B. ufw):
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```
4. **SSL/HTTPS einrichten** für Production (empfohlen mit Let's Encrypt)
5. **Regelmäßige Backups** der Datenbank erstellen

## 🔐 SSL/HTTPS mit Let's Encrypt (empfohlen)

```bash
# Certbot installieren
sudo apt install certbot python3-certbot-nginx

# SSL-Zertifikat erhalten
sudo certbot --nginx -d ihre-domain.de

# Auto-Renewal testen
sudo certbot renew --dry-run
```

## 📊 Admin-Panel Features

- ✅ Produktverwaltung (Erstellen, Bearbeiten, Löschen)
- ✅ Kategorienverwaltung
- ✅ Bestellungsübersicht
- ✅ Bestellstatus-Verwaltung
- ✅ Dashboard mit Statistiken

## 🆘 Troubleshooting

### Container startet nicht

```bash
# Logs überprüfen
docker-compose logs backend
docker-compose logs frontend

# Ports überprüfen
sudo netstat -tulpn | grep LISTEN
```

### Datenbank-Fehler

```bash
# Datenbank neu initialisieren
docker exec -it webshop-backend npm run init-db
```

### OxaPay-Zahlungen funktionieren nicht

1. Überprüfen Sie, ob die Callback-URL erreichbar ist
2. Prüfen Sie die Backend-Logs: `docker-compose logs backend`
3. Stellen Sie sicher, dass SHOP_URL korrekt in .env gesetzt ist

## 📝 Support

Bei Fragen oder Problemen:
1. Überprüfen Sie die Logs: `docker-compose logs -f`
2. Prüfen Sie die .env Konfiguration
3. Stellen Sie sicher, dass alle Ports frei sind

## 📄 Lizenz

Dieses Projekt ist für private und kommerzielle Nutzung frei verfügbar.

## 🎉 Viel Erfolg mit Ihrem Webshop!
# eee
