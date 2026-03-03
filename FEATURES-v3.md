# Webshop v3 - Feature-Übersicht

## ✅ Vollständig Implementiert (Backend)

### 1. Product Variants System
- **API-Routen:** `/api/variants/*`
- **Features:**
  - Mehrere Varianten pro Produkt (Größen, Gewichte)
  - Individueller Preis und Lagerbestand pro Variante
  - SKU-Verwaltung
  - CRUD-Operationen (Admin)

**Verwendung:**
```javascript
// GET /api/variants/product/:productId - Varianten abrufen
// POST /api/variants - Neue Variante erstellen (Admin)
// PUT /api/variants/:id - Variante aktualisieren (Admin)
// DELETE /api/variants/:id - Variante löschen (Admin)
```

### 2. Support Ticket System
- **API-Routen:** `/api/tickets/*`
- **Features:**
  - Kunden können Tickets erstellen
  - Ticket-Nummern-Tracking
  - Nachrichten-Thread pro Ticket
  - Status-Management (open, in_progress, resolved, closed)
  - Admin-Antworten

**Verwendung:**
```javascript
// POST /api/tickets - Neues Ticket erstellen
// GET /api/tickets/my-tickets?email=... - Eigene Tickets abrufen
// GET /api/tickets/:ticketNumber - Ticket mit Nachrichten
// POST /api/tickets/:ticketNumber/messages - Nachricht hinzufügen
// GET /api/tickets/admin/all - Alle Tickets (Admin)
// PUT /api/tickets/:ticketNumber/status - Status ändern (Admin)
```

### 3. Coupon/Rabatt System
- **API-Routen:** `/api/coupons/*`
- **Features:**
  - Prozent- oder Festbetrag-Rabatte
  - Mindestbestellwert
  - Nutzungslimits (global und pro User)
  - Ablaufdatum
  - Automatische Validierung

**Verwendung:**
```javascript
// POST /api/coupons/validate - Coupon validieren
// GET /api/coupons - Alle Coupons (Admin)
// POST /api/coupons - Coupon erstellen (Admin)
// PUT /api/coupons/:id - Coupon aktualisieren (Admin)
// DELETE /api/coupons/:id - Coupon löschen (Admin)
```

### 4. Shipping Options
- **API-Routen:** `/api/settings/shipping/*`
- **Features:**
  - Multiple Versandmethoden
  - Preis und geschätzte Lieferzeit
  - Sortierung
  - Aktiv/Inaktiv-Status

**Verwendung:**
```javascript
// GET /api/settings/shipping - Aktive Versandoptionen
// GET /api/settings/shipping/admin - Alle Optionen (Admin)
// POST /api/settings/shipping - Option erstellen (Admin)
// PUT /api/settings/shipping/:id - Option aktualisieren (Admin)
// DELETE /api/settings/shipping/:id - Option löschen (Admin)
```

### 5. Analytics Dashboard
- **API-Routen:** `/api/analytics/*`
- **Features:**
  - Umsatz-Statistiken
  - Verkaufs-Timeline
  - Top-Produkte
  - Order- und Payment-Status
  - Kundenverhalten (Neu vs. Wiederkäufer)

**Verwendung:**
```javascript
// GET /api/analytics/overview?days=30 - Übersicht
// GET /api/analytics/sales-timeline?days=30 - Verkaufs-Timeline
// GET /api/analytics/top-products?limit=10 - Top-Produkte
// GET /api/analytics/order-status - Bestellstatus-Verteilung
// GET /api/analytics/payment-status - Zahlungsstatus-Verteilung
// GET /api/analytics/customer-behavior - Kundenverhalten
```

### 6. Shop Settings (Customizability)
- **API-Routen:** `/api/settings/shop`
- **Features:**
  - Shop-Name
  - Logo-URL
  - Primary/Secondary Colors
  - Footer-Text
  - Kontakt-Informationen
  - Key-Value Storage

**Verwendung:**
```javascript
// GET /api/settings/shop - Alle Settings abrufen
// PUT /api/settings/shop - Settings aktualisieren (Admin)
```

**Beispiel-Settings:**
```json
{
  "shop_name": "ISRIB Research Labs",
  "logo_url": "/uploads/logo.png",
  "primary_color": "#3b82f6",
  "secondary_color": "#8b5cf6",
  "footer_text": "© 2024 ISRIB Research Labs",
  "contact_email": "info@isrib-labs.com",
  "contact_phone": "+49 123 456789"
}
```

---

## 🔨 Datenbank-Schema (v3)

### Neue Tabellen:
1. **product_variants** - Produktvarianten
2. **support_tickets** - Support-Tickets
3. **ticket_messages** - Ticket-Nachrichten
4. **email_campaigns** - Marketing-Kampagnen (vorbereitet)
5. **shipping_options** - Versandoptionen
6. **coupons** - Rabattcodes
7. **coupon_usages** - Coupon-Verwendungslog
8. **shop_settings** - Shop-Einstellungen

### Erweiterte Tabellen:
- **users**: `phone`, `address_*` Felder hinzugefügt
- **orders**: `subtotal`, `shipping_cost`, `discount_amount`, `coupon_code`, `shipping_option_id` hinzugefügt
- **order_items**: `variant_id`, `unit_label` hinzugefügt
- **products**: `price` und `stock` entfernt (jetzt in variants)

---

## 📋 Frontend-Integration TODO

Um die v3-Features im Frontend zu nutzen, müssen folgende Komponenten erstellt/angepasst werden:

### 1. Product Detail Page
```javascript
// Variants auswählen
const [selectedVariant, setSelectedVariant] = useState(null);
const { data: variants } = useQuery(`/api/variants/product/${productId}`);

// Variante auswählen und zum Warenkorb hinzufügen
<select onChange={(e) => setSelectedVariant(e.target.value)}>
  {variants.map(v => (
    <option value={v.id}>{v.unit_label} - €{v.price}</option>
  ))}
</select>
```

### 2. Support Tickets Page
```javascript
// Neues Ticket erstellen
<TicketForm onSubmit={(data) => {
  fetch('/api/tickets', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}} />

// Eigene Tickets anzeigen
const { data: tickets } = useQuery(`/api/tickets/my-tickets?email=${email}`);
```

### 3. Checkout Page
```javascript
// Coupon eingeben
const [couponCode, setCouponCode] = useState('');
const validateCoupon = () => {
  fetch('/api/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code: couponCode, orderAmount: total })
  });
};

// Versandoption wählen
const { data: shippingOptions } = useQuery('/api/settings/shipping');
<select name="shipping">
  {shippingOptions.map(opt => (
    <option value={opt.id}>{opt.name} - €{opt.price}</option>
  ))}
</select>
```

### 4. Admin Analytics
```javascript
// Admin Analytics Dashboard mit Recharts
import { LineChart, BarChart, PieChart } from 'recharts';

const { data: overview } = useQuery('/api/analytics/overview?days=30');
const { data: timeline } = useQuery('/api/analytics/sales-timeline');
const { data: topProducts } = useQuery('/api/analytics/top-products');

<LineChart data={timeline}>
  <XAxis dataKey="date" />
  <YAxis />
  <Line dataKey="revenue" stroke="#3b82f6" />
</LineChart>
```

### 5. Admin Settings
```javascript
// Shop Settings verwalten
const [settings, setSettings] = useState({});

const saveSettings = () => {
  fetch('/api/settings/shop', {
    method: 'PUT',
    body: JSON.stringify(settings)
  });
};
```

---

## 🚀 Deployment-Strategie

### Option 1: Schrittweises Update (Empfohlen)

1. **Backend zuerst:**
   ```bash
   # Neue Backend-Dateien hochladen
   # Container neu starten
   docker-compose up -d --build
   ```

2. **API testen:**
   ```bash
   # Test mit curl
   curl https://asklepi0s.top/api/analytics/overview
   curl https://asklepi0s.top/api/settings/shop
   ```

3. **Frontend nach und nach:**
   - Eine Seite nach der anderen anpassen
   - Testen nach jeder Änderung
   - Bei Problemen: alte Version wiederherstellen

### Option 2: Komplettes Update

1. Backup erstellen
2. Alle Dateien ersetzen
3. Container neu bauen
4. Alles testen

---

## 🔑 API-Keys und Konfiguration

Keine neuen Umgebungsvariablen nötig! Alles funktioniert mit deiner bestehenden `.env`:

```env
PORT=5000
JWT_SECRET=...
OXAPAY_MERCHANT_API_KEY=IATBVJ-ZETSQG-ERLMYY-ODTKGZ
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
SHOP_URL=https://asklepi0s.top
```

---

## 📦 Deployment-Checklist

- [ ] Backup der Datenbank erstellt
- [ ] Backup der .env Datei erstellt
- [ ] Neue Backend-Dateien hochgeladen
- [ ] `docker-compose build` ausgeführt
- [ ] Container gestartet mit `docker-compose up -d`
- [ ] Logs überprüft: `docker-compose logs -f`
- [ ] API-Endpunkte testen
- [ ] Frontend testen
- [ ] Admin-Panel testen

---

**Status:** Backend vollständig implementiert ✅  
**Next Steps:** Frontend-Komponenten erstellen oder API direkt nutzen

🎉 Viel Erfolg mit v3!
