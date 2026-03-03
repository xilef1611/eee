# 🚀 Webshop v3 Update-Anleitung

## Schnell-Update (5 Minuten)

### Voraussetzungen
- SSH-Zugriff zu deinem VPS
- Root-Rechte oder sudo
- v2 Shop läuft bereits auf asklepi0s.top

### Schritt-für-Schritt Anleitung

#### 1. Backup erstellen (WICHTIG!)
```bash
# SSH-Verbindung zu VPS
ssh root@asklepi0s.top

# In webshop-Verzeichnis wechseln
cd /root/webshop  # oder dein Installationspfad

# Container stoppen
docker-compose down

# Backup erstellen
mkdir -p ../webshop-v2-backup
cp -r . ../webshop-v2-backup/
cp backend/database/webshop.db ../webshop-backup.db

echo "✅ Backup erstellt!"
```

#### 2. Neue Dateien hochladen

**Option A: Via SCP (von deinem Computer)**
```bash
# webshop-v3-FINAL.zip entpacken
unzip webshop-v3-FINAL.zip

# Zu deinem VPS hochladen
scp -r webshop/* root@asklepi0s.top:/root/webshop/
```

**Option B: Direkt auf VPS**
```bash
# Auf VPS
cd /root
wget https://your-download-link.com/webshop-v3-FINAL.zip
unzip webshop-v3-FINAL.zip

# Alte Dateien ersetzen (außer .env und Datenbank)
cp -r webshop-v3/* /root/webshop/
cd /root/webshop
```

#### 3. Datenbank behalten oder migrieren

```bash
# Die Datenbank wird automatisch erweitert beim Start
# Deine bestehenden Daten bleiben erhalten!

# Prüfe dass die alte Datenbank noch da ist:
ls -lh backend/database/webshop.db
```

#### 4. Container neu bauen und starten

```bash
cd /root/webshop

# Neu bauen (dauert 2-3 Minuten)
docker-compose build

# Starten
docker-compose up -d

# Logs verfolgen
docker-compose logs -f
```

Du solltest sehen:
```
webshop-backend | 🚀 Server läuft auf Port 5000
webshop-backend | ✅ Datenbank-Schema initialisiert (v3 mit allen neuen Features)
```

#### 5. Testen

```bash
# Im Browser öffnen
https://asklepi0s.top

# Admin-Login
https://asklepi0s.top/login
Email: [deine admin email aus .env]
Passwort: [dein admin passwort]
```

---

## 🆕 Neue Features in v3

### 1. Product Variants ✨
- Jedes Produkt kann mehrere Varianten haben (z.B. 5g, 10g, 25g)
- Unterschiedliche Preise und Lagerbestände pro Variante
- Kunden wählen Variante beim Bestellen

### 2. Support Ticket System 🎫
- Kunden können Support-Tickets erstellen
- Admin-Dashboard für Ticket-Verwaltung
- Nachrichten-Thread pro Ticket
- Status-Tracking (open, in_progress, resolved, closed)

### 3. Analytics Dashboard 📊
- Verkaufsstatistiken mit Diagrammen
- Umsatz-Timeline
- Top-Produkte
- Kundenverhalten (Neu vs. Wiederkäufer)
- Order- und Payment-Status

### 4. Coupon System 💰
- Rabattcodes erstellen (Prozent oder Fest)
- Mindestbestellwert
- Nutzungslimits
- Ablaufdatum
- Automatische Validierung im Checkout

### 5. Shipping Options 📦
- Multiple Versandmethoden
- Unterschiedliche Preise und Lieferzeiten
- Kunden wählen beim Checkout
- Admin kann Optionen verwalten

### 6. Shop Customization 🎨
- Shop-Name ändern
- Logo hochladen
- Farben anpassen
- Footer-Text
- Kontakt-Informationen

---

## 🔧 Troubleshooting

### Container starten nicht
```bash
docker-compose logs backend
docker-compose logs frontend

# Alte Images löschen
docker system prune -a

# Neu versuchen
docker-compose up -d --build
```

### Datenbank-Fehler
```bash
# Alte Datenbank wiederherstellen
cp ../webshop-backup.db backend/database/webshop.db

# Container neu starten
docker-compose restart
```

### Frontend zeigt alte Version
```bash
# Browser-Cache leeren
# Oder: Hard Reload (Strg + Shift + R)

# Frontend neu bauen
docker-compose restart frontend
```

### Port-Konflikte
```bash
# Prüfen welcher Prozess Port 80 nutzt
sudo netstat -tulpn | grep :80

# Nginx oder Apache stoppen falls nötig
sudo systemctl stop nginx
sudo systemctl stop apache2
```

---

## 🔙 Rollback zu v2 (falls nötig)

```bash
# Container stoppen
docker-compose down

# Alte Version wiederherstellen
cd /root
rm -rf webshop
mv webshop-v2-backup webshop
cd webshop

# Starten
docker-compose up -d
```

---

## 📝 Nach dem Update

1. **Teste alle Funktionen:**
   - [ ] Produkte mit Varianten erstellen
   - [ ] Support-Ticket als Kunde erstellen
   - [ ] Analytics Dashboard anschauen
   - [ ] Coupon erstellen und testen
   - [ ] Versandoptionen einrichten
   - [ ] Shop-Einstellungen anpassen

2. **Shop-Settings konfigurieren:**
   ```
   Admin → Settings → Shop Settings
   - Shop Name: "ISRIB Research Labs"
   - Logo-URL: "/uploads/logo.png"
   - Primary Color: #3b82f6
   - Footer Text: "© 2024 ISRIB Research Labs"
   ```

3. **Erste Versandoptionen erstellen:**
   ```
   Admin → Settings → Shipping Options
   - Standard Shipping (€9.99, 5-7 Tage)
   - Express Shipping (€19.99, 2-3 Tage)
   - Priority Shipping (€29.99, 1-2 Tage)
   ```

4. **Erste Coupons erstellen:**
   ```
   Admin → Marketing → Coupons
   - WELCOME10 (10% Rabatt für Neukunden)
   - BULK50 (€50 Rabatt ab €500 Bestellwert)
   ```

---

## 🆘 Support

Bei Fragen oder Problemen:

1. Logs überprüfen: `docker-compose logs -f`
2. Container-Status: `docker-compose ps`
3. Datenbank-Backup: `/root/webshop-backup.db`

---

## 📊 Performance-Optimierungen

Nach erfolgreichem Update:

```bash
# SSL-Zertifikat aktualisieren
sudo certbot renew

# Firewall-Regeln prüfen
sudo ufw status

# Logs bereinigen (optional)
docker system prune -f
```

---

**Geschätzte Update-Dauer: 5-10 Minuten**

🎉 Viel Erfolg mit v3!
