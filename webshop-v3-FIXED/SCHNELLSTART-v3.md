# 🎉 WEBSHOP v3 - FINALE VERSION

## 📦 Was ist im ZIP?

**webshop-v3-FINAL.zip (99KB)** enthält:

### ✅ Backend (vollständig implementiert):
- Alle v2 Features + 6 neue Systeme
- Product Variants API
- Support Tickets API
- Coupons/Rabattcodes API
- Shipping Options API
- Analytics API
- Shop Settings API (Customizability!)

### ✅ Frontend (erweitert):
- Shop Settings Context (für Customizability)
- Admin Settings Page (Farben, Logo, Name anpassen)
- Alle v2 Komponenten bleiben erhalten
- Dark Theme beibehalten

### 📚 Dokumentation:
- `EINFACHES-UPDATE.md` → **LIES DAS ZUERST!**
- `ONE-LINE-UPDATE.sh` → Copy-Paste Update
- `FEATURES-v3.md` → Alle neuen Features erklärt
- `UPDATE-GUIDE.md` → Detaillierte Anleitung
- `TROUBLESHOOTING.md` → Problemlösungen

---

## 🚀 SUPER-SCHNELLES UPDATE (3 Schritte)

### 1️⃣ ZIP hochladen
```bash
scp webshop-v3-FINAL.zip root@asklepi0s.top:/root/
```

### 2️⃣ SSH verbinden
```bash
ssh root@asklepi0s.top
```

### 3️⃣ One-Line Update (Copy-Paste!)
```bash
cd /root && docker-compose -f webshop/docker-compose.yml down && cp -r webshop webshop-v2-backup && cp webshop/backend/database/webshop.db webshop-backup.db && unzip -o webshop-v3-FINAL.zip && mv webshop-v3 webshop-temp && cp webshop-v2-backup/backend/.env webshop-temp/backend/.env && cp webshop-backup.db webshop-temp/backend/database/webshop.db && rm -rf webshop && mv webshop-temp webshop && cd webshop && docker-compose up -d --build && echo "✅ v3 Update abgeschlossen! → https://asklepi0s.top"
```

**FERTIG!** 🎉

---

## 🆕 Neue Features in v3

### 1. 🎨 Shop Customization (HAUPTFEATURE!)
**Was:** Admin kann Shop komplett anpassen
**Wo:** Admin → Settings → Shop Settings

**Anpassbar:**
- ✅ Shop Name
- ✅ Logo URL
- ✅ Primary Color (Buttons, Links)
- ✅ Secondary Color (Akzente)
- ✅ Accent Color (Highlights)
- ✅ Footer Text
- ✅ Kontakt-Email & Telefon
- ✅ Währung & Symbol

**Live Preview:** Farben werden sofort angewendet!

### 2. 📦 Product Variants
**Was:** Ein Produkt = mehrere Varianten (Größen/Gewichte)
**API:** `/api/variants/*`

**Beispiel:**
```
Produkt: "ISRIB Compound"
Varianten:
- 5g → €49.99
- 10g → €89.99
- 25g → €199.99
```

### 3. 🎫 Support Tickets
**Was:** Kunden-Support-System mit Threads
**API:** `/api/tickets/*`

**Features:**
- Ticket-Nummern
- Nachrichten-Thread
- Status-Tracking
- Admin-Antworten

### 4. 💰 Coupon System
**Was:** Rabattcodes mit Limits
**API:** `/api/coupons/*`

**Typen:**
- Prozent (10% Rabatt)
- Festbetrag (€50 Rabatt)

**Limits:**
- Mindestbestellwert
- Nutzungslimit
- Pro-User-Limit
- Ablaufdatum

### 5. 📊 Analytics Dashboard
**Was:** Verkaufsstatistiken
**API:** `/api/analytics/*`

**Metriken:**
- Umsatz-Timeline
- Top-Produkte
- Order-Status
- Kundenverhalten
- Wiederkäufer-Rate

### 6. 🚚 Shipping Options
**Was:** Multiple Versandmethoden
**API:** `/api/settings/shipping`

**Beispiel:**
```
Standard: €9.99 (5-7 Tage)
Express: €19.99 (2-3 Tage)
Priority: €29.99 (1-2 Tage)
```

---

## 🎯 Nach dem Update

### 1. Shop anpassen
```
1. Gehe zu: https://asklepi0s.top/admin/dashboard
2. Klicke auf "Settings"
3. Wähle "Shop Settings"
4. Passe Farben an:
   - Primary: #3b82f6 (Blau)
   - Secondary: #8b5cf6 (Lila)
   - Accent: #06b6d4 (Cyan)
5. Klicke "Speichern"
```

### 2. Erste Versandoption erstellen
```
1. Settings → Shipping Options
2. "Neue Option"
3. Name: Standard Shipping
4. Preis: 9.99
5. Lieferzeit: 5-7 Tage
6. Speichern
```

### 3. Ersten Coupon erstellen (via API)
```bash
curl -X POST https://asklepi0s.top/api/coupons \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WELCOME10",
    "discount_type": "percentage",
    "discount_value": 10,
    "description": "10% Rabatt für Neukunden"
  }'
```

---

## 📊 API-Übersicht (alle funktionsfähig)

### Shop Settings (Customizability)
```bash
# Abrufen
GET /api/settings/shop

# Aktualisieren (Admin)
PUT /api/settings/shop
Body: {
  "shop_name": "Mein Shop",
  "primary_color": "#3b82f6",
  "logo_url": "/uploads/logo.png"
}
```

### Produktvarianten
```bash
# Varianten eines Produkts
GET /api/variants/product/:productId

# Variante erstellen (Admin)
POST /api/variants
Body: {
  "product_id": 1,
  "unit_label": "10g",
  "price": 89.99,
  "stock": 50
}
```

### Support Tickets
```bash
# Ticket erstellen
POST /api/tickets
Body: {
  "customer_email": "user@example.com",
  "customer_name": "Max Mustermann",
  "subject": "Frage zu Bestellung",
  "message": "Wo ist meine Bestellung?"
}

# Eigene Tickets
GET /api/tickets/my-tickets?email=user@example.com

# Ticket mit Nachrichten
GET /api/tickets/:ticketNumber
```

### Coupons
```bash
# Validieren
POST /api/coupons/validate
Body: {
  "code": "WELCOME10",
  "orderAmount": 100
}

# Alle Coupons (Admin)
GET /api/coupons
```

### Analytics (Admin)
```bash
# Übersicht
GET /api/analytics/overview?days=30

# Verkaufs-Timeline
GET /api/analytics/sales-timeline?days=30

# Top-Produkte
GET /api/analytics/top-products?limit=10
```

### Versandoptionen
```bash
# Aktive Optionen (öffentlich)
GET /api/settings/shipping

# Alle Optionen (Admin)
GET /api/settings/shipping/admin
```

---

## 🔑 Was bleibt wie in v2?

✅ **Alle bestehenden Features funktionieren!**
- Produkte, Kategorien, Warenkorb
- Checkout, OxaPay-Zahlungen
- Admin-Dashboard
- User-Authentifizierung
- Bestellverwaltung

❌ **Nichts geht kaputt!**
- Deine Datenbank bleibt erhalten
- .env Einstellungen bleiben
- Alle Produkte bleiben

---

## 🔄 Was wurde geändert?

### Datenbank (automatisch erweitert):
**Neue Tabellen:**
- `product_variants`
- `support_tickets`
- `ticket_messages`
- `coupons`
- `coupon_usages`
- `shipping_options`
- `shop_settings`

**Erweiterte Tabellen:**
- `users` → phone, address-Felder
- `orders` → shipping_cost, discount_amount, coupon_code
- `order_items` → variant_id

### Backend:
**Neue Dateien:**
- `routes/variants.js`
- `routes/tickets.js`
- `routes/coupons.js`
- `routes/settings.js`
- `routes/analytics.js`

**Aktualisierte Dateien:**
- `config/database.js` (neues Schema)
- `server.js` (neue Routen)

### Frontend:
**Neue Dateien:**
- `context/ShopSettingsContext.js`
- `pages/admin/AdminSettings.js`
- `pages/admin/AdminSettings.css`

---

## 🆘 Troubleshooting

### Container starten nicht
```bash
cd /root/webshop
docker-compose logs backend
docker-compose logs frontend

# Fix:
docker system prune -f
docker-compose up -d --build
```

### Alte Version wiederherstellen
```bash
cd /root
docker-compose -f webshop/docker-compose.yml down
rm -rf webshop
mv webshop-v2-backup webshop
cd webshop
docker-compose up -d
```

### Datenbank-Fehler
```bash
# Backup wiederherstellen
cp ../webshop-backup.db backend/database/webshop.db
docker-compose restart
```

---

## 📈 Nächste Schritte

1. **Update durchführen** (siehe oben)
2. **Shop-Farben anpassen** (Admin → Settings)
3. **Versandoptionen einrichten**
4. **Ersten Coupon erstellen**
5. **Analytics anschauen**

---

## 💡 Tipps

### Shop-Branding:
```
Logo: Lade dein Logo zu /uploads/logo.png hoch
Dann: Settings → Logo URL → "/uploads/logo.png"
```

### Farb-Empfehlungen:
```
Modern Blue: #3b82f6, #2563eb, #06b6d4
Purple Vibes: #8b5cf6, #7c3aed, #a855f7
Green Clean: #10b981, #059669, #34d399
```

### Performance:
```
# Nach Update:
docker system prune -f
```

---

## 📋 Checkliste

- [ ] ZIP hochgeladen
- [ ] SSH verbunden
- [ ] Update-Command ausgeführt
- [ ] Logs gecheckt (kein Error)
- [ ] Browser: https://asklepi0s.top geöffnet
- [ ] Admin-Login funktioniert
- [ ] Settings geöffnet
- [ ] Farben angepasst
- [ ] Erste Versandoption erstellt

---

## 🎊 FERTIG!

Dein Shop läuft jetzt auf **v3** mit:
- ✅ Vollständiger Customizability
- ✅ Product Variants System
- ✅ Support Tickets
- ✅ Coupon System
- ✅ Analytics Dashboard
- ✅ Shipping Options
- ✅ Und allem aus v2!

**Support:** `docker-compose logs -f` bei Problemen

🚀 **Viel Erfolg mit v3!**
