#!/bin/bash

echo "🚀 Webshop v3 Update (KORRIGIERTE VERSION)"
echo "==========================================="
echo ""

# Prüfe ob ZIP existiert
if [ ! -f "/root/webshop-v3-FINAL.zip" ]; then
  echo "❌ FEHLER: webshop-v3-FINAL.zip nicht gefunden in /root/"
  echo "Bitte lade die Datei erst hoch:"
  echo "  scp webshop-v3-FINAL.zip root@asklepi0s.top:/root/"
  exit 1
fi

cd /root

echo "1️⃣ Stoppe Container..."
docker-compose -f webshop/docker-compose.yml down
echo "✅ Container gestoppt"
echo ""

echo "2️⃣ Erstelle Backup..."
if [ -d "webshop" ]; then
  if [ -d "webshop-v2-backup" ]; then
    echo "⚠️  Altes Backup existiert, erstelle webshop-v2-backup-$(date +%Y%m%d-%H%M%S)"
    cp -r webshop "webshop-v2-backup-$(date +%Y%m%d-%H%M%S)"
  else
    cp -r webshop webshop-v2-backup
  fi
  
  # Datenbank-Backup
  if [ -f "webshop/backend/database/webshop.db" ]; then
    cp webshop/backend/database/webshop.db "webshop-backup-$(date +%Y%m%d-%H%M%S).db"
    echo "✅ Backup erstellt"
  fi
else
  echo "⚠️  Kein webshop-Verzeichnis gefunden"
fi
echo ""

echo "3️⃣ Entpacke v3..."
unzip -o webshop-v3-FINAL.zip
echo "✅ ZIP entpackt"
echo ""

echo "4️⃣ Sichere .env und Datenbank..."
if [ -f "webshop-v2-backup/backend/.env" ]; then
  cp webshop-v2-backup/backend/.env webshop-v3/backend/.env
  echo "✅ .env kopiert"
else
  echo "⚠️  Keine .env gefunden - bitte manuell erstellen!"
fi

if [ -f "webshop-v2-backup/backend/database/webshop.db" ]; then
  cp webshop-v2-backup/backend/database/webshop.db webshop-v3/backend/database/webshop.db
  echo "✅ Datenbank kopiert"
else
  echo "⚠️  Keine Datenbank gefunden - neue wird erstellt"
fi
echo ""

echo "5️⃣ Ersetze altes Verzeichnis..."
rm -rf webshop
mv webshop-v3 webshop
cd webshop
echo "✅ Verzeichnis ersetzt"
echo ""

echo "6️⃣ Lösche alte Docker-Images..."
docker system prune -f
echo "✅ Alte Images gelöscht"
echo ""

echo "7️⃣ Baue Container neu (dauert 2-3 Minuten)..."
docker-compose build --no-cache
echo "✅ Container gebaut"
echo ""

echo "8️⃣ Starte Container..."
docker-compose up -d
echo "✅ Container gestartet"
echo ""

echo "9️⃣ Warte 10 Sekunden..."
sleep 10

echo "🔟 Überprüfe Container-Status..."
docker-compose ps
echo ""

echo "✅✅✅ UPDATE ABGESCHLOSSEN! ✅✅✅"
echo ""
echo "🌐 Öffne jetzt: http://asklepi0s.top"
echo "   → Du solltest die neue Landing Page mit Terminal sehen!"
echo ""
echo "⚠️  Falls alte Seite erscheint:"
echo "   1. Hard Reload: Strg+Shift+R (Chrome/Firefox)"
echo "   2. Oder: Inkognito-Fenster öffnen"
echo ""
echo "📊 Logs anschauen:"
echo "   docker-compose logs -f"
echo ""
echo "🔙 Rollback bei Problemen:"
echo "   cd /root"
echo "   docker-compose -f webshop/docker-compose.yml down"
echo "   rm -rf webshop"
echo "   mv webshop-v2-backup webshop"
echo "   cd webshop && docker-compose up -d"
