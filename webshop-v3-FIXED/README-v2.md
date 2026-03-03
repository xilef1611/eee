# ISRIB Research Labs - Advanced Research Chemicals Shop

Ein moderner, selbst-hostbarer E-Commerce-Shop für Research Chemicals mit Custom Synthesis Services, Dark Theme und OxaPay Krypto-Zahlungen.

## 🎨 Neue Features (v2.0)

### 🚀 Hero Landing Page
- **PostHog-inspiriertes Design** mit interaktivem Terminal
- **Command-Line-Interface** für Navigation (Type `help` for commands)
- Animated Background mit Neon-Effekten
- Moderne Statistiken und CTA-Bereiche

### 🧪 Custom Synthesis Services
- **6 Service-Kategorien**:
  - 🧬 Route Development
  - 🔬 SAR / Analogue Series
  - ⚗️ Scaling (mg to multi-gram)
  - 📊 QC Suite (LC-MS, NMR)
  - 🔒 Confidentiality (NDA available)
  - 📦 Logistics (Worldwide shipping)
  
- Detaillierte Service-Beschreibungen
- Prozess-Timeline
- Quality Standards

### 🎨 Dark Theme Design
- Vollständig dunkles Interface
- Neon-Glow-Effekte beim Cursor-Movement
- Animated Gradients
- Modern glassmorphism UI elements

## 📦 Deployment auf VPS

### Voraussetzungen
- Ubuntu 20.04+ oder Debian 10+
- Docker & Docker Compose
- Mindestens 2GB RAM
- 20GB freier Speicherplatz

### Schnellstart

```bash
# 1. ZIP auf VPS hochladen
scp webshop-FIXED.zip root@your-vps-ip:/root/

# 2. Auf VPS einloggen
ssh root@your-vps-ip

# 3. Entpacken
cd /root
unzip webshop-FIXED.zip
cd webshop

# 4. Backend-Konfiguration anpassen
nano backend/.env

# WICHTIG: Ändern Sie:
# - JWT_SECRET (sicherer Random String)
# - ADMIN_EMAIL & ADMIN_PASSWORD
# - SHOP_URL (Ihre Domain oder IP)

# 5. Container starten
docker-compose up -d --build

# 6. Logs überprüfen
docker-compose logs -f

# 7. Datenbank initialisieren
docker exec -it webshop-backend npm run init-db

# 8. Im Browser öffnen
# http://your-vps-ip
```

### Terminal-Befehle (Landing Page)

Auf der Homepage können Sie folgende Befehle im Terminal eingeben:

```bash
help        - Zeigt alle verfügbaren Befehle
shop        - Öffnet den Shop (Produktkatalog)
synthesis   - Öffnet Custom Synthesis Services
products    - Öffnet Produktkatalog
about       - Über ISRIB Research Labs
contact     - Kontaktformular
clear       - Terminal leeren
```

## 🎯 Haupt-Features

### Shop-Funktionen
- ✅ Produkt-Katalog mit Kategorien
- ✅ Erweiterte Suche & Filter
- ✅ Warenkorb-System (localStorage)
- ✅ Checkout mit Adresseingabe
- ✅ OxaPay Krypto-Zahlungen (BTC, ETH, USDT, LTC, TRX)
- ✅ Bestellbestätigung & Tracking

### Admin-Dashboard
- ✅ Produkt-Management (CRUD)
- ✅ Kategorien-Verwaltung
- ✅ Bestellungs-Übersicht
- ✅ Bestellstatus-Verwaltung
- ✅ Verkaufs-Statistiken
- ✅ PDF-Packlisten-Generator

### Kunden-Features
- ✅ User-Registrierung & Login
- ✅ Bestellhistorie
- ✅ Support-Ticket-System
- ✅ Profilverwaltung

### Technische Features
- ✅ SQLite-Datenbank (selbst-hostbar)
- ✅ JWT-Authentifizierung
- ✅ Responsive Design
- ✅ Dark Theme
- ✅ Docker-Ready
- ✅ Vitest Tests (24 passing)

## 🔐 Sicherheit

**WICHTIG nach Deployment:**

1. **Ändern Sie das Admin-Passwort** sofort nach dem ersten Login!
2. **Generieren Sie einen neuen JWT_SECRET**:
   ```bash
   openssl rand -base64 32
   ```
3. **Setzen Sie eine Firewall**:
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```

## 🌐 SSL/HTTPS einrichten (Empfohlen)

```bash
# Certbot installieren
sudo apt install certbot python3-certbot-nginx

# SSL-Zertifikat erhalten
sudo certbot --nginx -d ihre-domain.de

# Auto-Renewal testen
sudo certbot renew --dry-run
```

## 🔧 Wichtige Konfigurationen

### Backend (.env)
```env
PORT=5000
NODE_ENV=production

# JWT Secret - ÄNDERN!
JWT_SECRET=your-secure-random-string-here

# OxaPay (bereits konfiguriert)
OXAPAY_MERCHANT_API_KEY=IATBVJ-ZETSQG-ERLMYY-ODTKGZ

# Admin Credentials - ÄNDERN!
ADMIN_EMAIL=admin@shop.com
ADMIN_PASSWORD=admin123

# Shop URL - Ihre Domain/IP
SHOP_URL=http://your-domain.com
```

## 📊 Admin-Zugangsdaten (Standard)

**Email:** admin@shop.com  
**Passwort:** admin123  

⚠️ **WICHTIG:** Ändern Sie diese sofort nach dem ersten Login!

## 🛠️ Wartung & Updates

```bash
# Container neustarten
docker-compose restart

# Container stoppen
docker-compose down

# Neu bauen nach Updates
docker-compose up -d --build

# Logs anzeigen
docker-compose logs -f

# Datenbank-Backup
docker exec webshop-backend cp /app/database/webshop.db /app/database/backup.db
docker cp webshop-backend:/app/database/backup.db ./backup.db
```

## 🆘 Troubleshooting

### Container startet nicht
```bash
docker-compose logs backend
docker-compose logs frontend
docker system prune -a  # Löscht alte Images
```

### Port 80 bereits belegt
```bash
sudo netstat -tulpn | grep :80
sudo systemctl stop apache2  # oder nginx
```

### OxaPay Zahlungen funktionieren nicht
1. Überprüfen Sie `SHOP_URL` in backend/.env
2. Stellen Sie sicher, dass der Callback erreichbar ist:
   `http://your-domain.com/api/payment/callback`
3. Prüfen Sie Backend-Logs: `docker-compose logs backend`

## 📁 Projektstruktur

```
webshop/
├── backend/
│   ├── routes/          # API-Endpunkte
│   ├── config/          # Datenbank-Konfiguration
│   ├── middleware/      # JWT-Auth
│   ├── scripts/         # DB-Initialisierung
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/       # React-Seiten
│   │   │   ├── HeroLanding.js    # Neue Homepage
│   │   │   ├── Synthesis.js      # Custom Synthesis
│   │   │   ├── Products.js       # Produktkatalog
│   │   │   └── admin/            # Admin-Dashboard
│   │   ├── components/  # Wiederverwendbare Komponenten
│   │   └── context/     # State Management
│   └── public/
├── docker-compose.yml
└── README.md
```

## 🎨 Design-Inspiration

- **Landing Page**: PostHog.com
- **Shop Design**: devbishal.netlify.app
- **Color Scheme**: Dark Theme mit Neon-Blau/Lila-Akzenten
- **Typography**: System Fonts für beste Performance

## 💳 OxaPay Integration

Die OxaPay-Integration ist vollständig konfiguriert:
- **API Key:** `IATBVJ-ZETSQG-ERLMYY-ODTKGZ`
- **Unterstützte Coins:** BTC, ETH, USDT, LTC, TRX
- **Automatische Callbacks** für Zahlungsstatus-Updates
- **Webhook-Handler** für Order-Updates

## 📝 Lizenz

Dieses Projekt ist für private und kommerzielle Nutzung frei verfügbar.

## 🎉 Support

Bei Fragen oder Problemen:
1. Überprüfen Sie die Logs: `docker-compose logs -f`
2. Lesen Sie TROUBLESHOOTING.md
3. Stellen Sie sicher, dass alle Ports frei sind

---

**Built with ❤️ for Research Teams Worldwide**
