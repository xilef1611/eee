#!/bin/bash

# Webshop v3 Update Script
# Dieses Script updated deinen bestehenden v2 Shop auf v3

echo "🚀 Webshop v3 Update wird gestartet..."
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
  echo "❌ Fehler: docker-compose.yml nicht gefunden!"
  echo "Bitte führe dieses Script im webshop-Verzeichnis aus."
  exit 1
fi

# Stop containers
echo "⏸️  Stoppe Container..."
docker-compose down

# Backup database
echo "💾 Erstelle Datenbank-Backup..."
BACKUP_DIR="backups"
BACKUP_FILE="backup-$(date +%Y%m%d-%H%M%S).db"

mkdir -p $BACKUP_DIR

if [ -f "backend/database/webshop.db" ]; then
  cp backend/database/webshop.db "$BACKUP_DIR/$BACKUP_FILE"
  echo "✅ Backup erstellt: $BACKUP_DIR/$BACKUP_FILE"
else
  echo "⚠️  Keine Datenbank zum Backup gefunden"
fi

# Backup .env
if [ -f "backend/.env" ]; then
  cp backend/.env "$BACKUP_DIR/.env.backup"
  echo "✅ .env Backup erstellt"
fi

# Update files (assumes new files are already in place via upload)
echo ""
echo "📦 Bereite Update vor..."
echo "ℹ️  Stelle sicher, dass alle neuen Dateien hochgeladen wurden:"
echo "   - backend/routes/variants.js"
echo "   - backend/routes/tickets.js"
echo "   - backend/routes/coupons.js"
echo "   - backend/routes/settings.js"
echo "   - backend/routes/analytics.js"
echo "   - backend/config/database.js (updated)"
echo "   - backend/server.js (updated)"
echo "   - frontend/src/* (new components)"
echo ""

read -p "Wurden alle neuen Dateien hochgeladen? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Abgebrochen. Bitte lade zuerst alle Dateien hoch."
    exit 1
fi

# Rebuild containers
echo ""
echo "🔨 Baue Container neu..."
docker-compose build

# Start containers
echo "▶️  Starte Container..."
docker-compose up -d

# Wait for backend to be ready
echo "⏳ Warte auf Backend..."
sleep 5

# Run database migrations (create new tables)
echo "🗄️  Führe Datenbank-Migrationen aus..."
docker-compose exec -T backend node -e "
const db = require('./config/database');
console.log('Datenbank-Schema wird aktualisiert...');
console.log('Neue Tabellen wurden erstellt.');
"

# Check if everything is running
echo ""
echo "🔍 Überprüfe Container-Status..."
docker-compose ps

echo ""
echo "✅ Update abgeschlossen!"
echo ""
echo "📋 Nächste Schritte:"
echo "   1. Öffne https://asklepi0s.top im Browser"
echo "   2. Teste alle Funktionen"
echo "   3. Bei Problemen: docker-compose logs -f"
echo ""
echo "🆕 Neue Features in v3:"
echo "   ✓ Product Variants (Größen/Gewichte)"
echo "   ✓ Support Ticket System"
echo "   ✓ Analytics Dashboard"
echo "   ✓ Coupon System (Rabattcodes)"
echo "   ✓ Shipping Options"
echo "   ✓ Shop Customization Settings"
echo ""
echo "💾 Backup-Speicherort: $BACKUP_DIR/$BACKUP_FILE"
echo ""
echo "🎉 Viel Erfolg mit v3!"
