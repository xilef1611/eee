#!/bin/bash

echo "🔍 Webshop v3 Debug & Fix Script"
echo "=================================="
echo ""

cd /root/webshop

echo "1️⃣ Überprüfe Container-Status..."
docker-compose ps
echo ""

echo "2️⃣ Überprüfe Backend-Dateien..."
if [ -f "backend/routes/variants.js" ]; then
  echo "✅ backend/routes/variants.js existiert"
else
  echo "❌ backend/routes/variants.js FEHLT - Update nicht vollständig!"
fi

if [ -f "backend/routes/tickets.js" ]; then
  echo "✅ backend/routes/tickets.js existiert"
else
  echo "❌ backend/routes/tickets.js FEHLT"
fi

if [ -f "backend/routes/coupons.js" ]; then
  echo "✅ backend/routes/coupons.js existiert"
else
  echo "❌ backend/routes/coupons.js FEHLT"
fi

echo ""
echo "3️⃣ Überprüfe Frontend-Dateien..."

if [ -f "frontend/src/pages/HeroLanding.js" ]; then
  echo "✅ frontend/src/pages/HeroLanding.js existiert"
else
  echo "❌ frontend/src/pages/HeroLanding.js FEHLT - v3 Frontend nicht installiert!"
fi

if [ -f "frontend/src/context/ShopSettingsContext.js" ]; then
  echo "✅ frontend/src/context/ShopSettingsContext.js existiert"
else
  echo "❌ frontend/src/context/ShopSettingsContext.js FEHLT"
fi

echo ""
echo "4️⃣ Überprüfe App.js Route..."
if grep -q "HeroLanding" frontend/src/App.js; then
  echo "✅ App.js verwendet HeroLanding"
else
  echo "❌ App.js verwendet noch alte Home-Route!"
  echo "   → Das ist wahrscheinlich das Problem!"
fi

echo ""
echo "5️⃣ Backend-Logs (letzte 20 Zeilen)..."
docker-compose logs --tail=20 backend

echo ""
echo "6️⃣ Frontend-Logs (letzte 20 Zeilen)..."
docker-compose logs --tail=20 frontend

echo ""
echo "=================================="
echo "Diagnose abgeschlossen!"
echo ""
echo "Falls Dateien fehlen:"
echo "  → Lade webshop-v3-FINAL.zip erneut hoch"
echo "  → Führe das korrigierte Update aus (siehe unten)"
