# 🚀 SUPER-EINFACHES v3 UPDATE FÜR asklepi0s.top

## ⏱️ Geschätzte Dauer: 5 Minuten

---

## 📋 SCHRITT 1: ZIP hochladen

```bash
# Auf deinem Computer:
scp webshop-v3-FINAL.zip root@asklepi0s.top:/root/
```

---

## 📋 SCHRITT 2: SSH verbinden

```bash
ssh root@asklepi0s.top
```

---

## 📋 SCHRITT 3: Backup + Update (Copy-Paste)

```bash
# Alle Befehle auf einmal ausführen:
cd /root && \
docker-compose -f webshop/docker-compose.yml down && \
cp -r webshop webshop-v2-backup && \
cp webshop/backend/database/webshop.db webshop-backup.db && \
unzip -o webshop-v3-FINAL.zip && \
cp webshop-v2-backup/backend/.env webshop/backend/.env && \
cp webshop-backup.db webshop/backend/database/webshop.db && \
cd webshop && \
docker-compose up -d --build && \
echo "✅ Update abgeschlossen!"
```

**Das war's!** 🎉

---

## 📋 SCHRITT 4: Testen

Öffne im Browser: **https://asklepi0s.top**

Sollte funktionieren! Falls nicht:

```bash
# Logs anschauen:
cd /root/webshop
docker-compose logs -f
```

---

## 🔙 ROLLBACK (falls etwas schief geht)

```bash
cd /root
docker-compose -f webshop/docker-compose.yml down
rm -rf webshop
mv webshop-v2-backup webshop
cd webshop
docker-compose up -d
```

---

## 🆕 Was ist neu in v3?

### Backend (API):
- ✅ **Product Variants** - Mehrere Größen/Gewichte pro Produkt
- ✅ **Support Tickets** - Kunden-Support-System
- ✅ **Coupons** - Rabattcodes erstellen
- ✅ **Shipping Options** - Versandmethoden verwalten
- ✅ **Analytics** - Verkaufsstatistiken
- ✅ **Shop Settings** - Farben, Logo, Name anpassen

### API-Endpunkte (bereit zu nutzen):
- `/api/variants/*` - Produktvarianten
- `/api/tickets/*` - Support-Tickets
- `/api/coupons/*` - Rabattcodes
- `/api/settings/shipping` - Versandoptionen
- `/api/settings/shop` - Shop-Einstellungen
- `/api/analytics/*` - Statistiken

### Frontend:
- ✅ Besseres Dark Theme Design
- ✅ Shop Customization UI (Admin → Settings)
- ✅ Alle bestehenden Features bleiben!

---

## 🎯 Nach dem Update

### 1. Shop-Settings konfigurieren:
```
Gehe zu: https://asklepi0s.top/admin/dashboard
→ Settings Tab
→ Shop Settings

Hier kannst du anpassen:
- Shop Name
- Logo URL
- Farben (Primary, Secondary, Accent)
- Kontakt-Infos
- Footer-Text
```

### 2. Erste Versandoption erstellen:
```
Admin → Settings → Shipping Options
→ "Neue Versandoption"

Beispiel:
Name: Standard Shipping
Preis: 9.99
Lieferzeit: 5-7 Tage
```

### 3. Ersten Coupon erstellen:
```
Admin → Marketing → Coupons (neue Features werden noch implementiert)

Oder via API:
curl -X POST https://asklepi0s.top/api/coupons \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"code":"WELCOME10","discount_type":"percentage","discount_value":10}'
```

---

## 🛠️ API-Nutzung (Beispiele)

### Shop-Farben ändern:
```bash
curl -X PUT https://asklepi0s.top/api/settings/shop \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "primary_color": "#3b82f6",
    "secondary_color": "#8b5cf6",
    "shop_name": "Mein Custom Shop"
  }'
```

### Analytics abrufen:
```bash
curl https://asklepi0s.top/api/analytics/overview?days=30 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Versandoptionen anzeigen:
```bash
curl https://asklepi0s.top/api/settings/shipping
```

---

## ❓ Troubleshooting

### Container starten nicht:
```bash
docker-compose logs backend
docker-compose logs frontend
docker system prune -f
docker-compose up -d --build
```

### Alte Daten weg:
```bash
# Datenbank-Backup wiederherstellen:
cp ../webshop-backup.db backend/database/webshop.db
docker-compose restart
```

### 404 Errors:
```bash
# Browser-Cache leeren (Strg+Shift+R)
# Oder:
docker-compose restart frontend
```

---

## 📊 Datenbank-Schema

Die Datenbank wird **automatisch** erweitert. Deine alten Daten bleiben erhalten!

**Neue Tabellen:**
- `product_variants` - Produktvarianten
- `support_tickets` - Support-Tickets
- `ticket_messages` - Ticket-Nachrichten
- `coupons` - Rabattcodes
- `coupon_usages` - Coupon-Nutzung
- `shipping_options` - Versandoptionen
- `shop_settings` - Shop-Einstellungen
- `email_campaigns` - Marketing (vorbereitet)

---

## 🎨 Customizability Highlights

Das waren die wichtigsten Features aus yourshop_ecommerce:

✅ **Shop Settings UI** - Alles im Admin-Panel anpassbar
✅ **Color Customization** - Primary, Secondary, Accent Farben
✅ **Logo Upload** - Eigenes Logo einbinden
✅ **Footer Customization** - Text anpassen
✅ **Feature Toggles** - Features ein/ausschalten
✅ **Live Preview** - Farben sofort sehen

---

## ✅ Fertig!

Dein Shop läuft jetzt auf **v3** mit allen neuen Features!

**Support:** Bei Problemen → `docker-compose logs -f`

🎉 Viel Erfolg!
