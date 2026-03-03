#!/bin/bash

echo "⚡ QUICK-FIX für v3"
echo "Wenn Dateien schon da sind, aber nicht funktionieren"
echo "====================================================="
echo ""

cd /root/webshop

echo "1️⃣ Container stoppen..."
docker-compose down

echo ""
echo "2️⃣ Alte Docker-Images löschen..."
docker system prune -af

echo ""
echo "3️⃣ Container komplett neu bauen..."
docker-compose build --no-cache

echo ""
echo "4️⃣ Container starten..."
docker-compose up -d

echo ""
echo "5️⃣ Warte 10 Sekunden..."
sleep 10

echo ""
echo "6️⃣ Container-Status:"
docker-compose ps

echo ""
echo "7️⃣ Backend-Logs:"
docker-compose logs --tail=20 backend | grep -E "(Server läuft|Error|error)"

echo ""
echo "✅ QUICK-FIX ABGESCHLOSSEN!"
echo ""
echo "Teste jetzt: http://asklepi0s.top"
echo "Browser-Cache leeren: Strg+Shift+R"
