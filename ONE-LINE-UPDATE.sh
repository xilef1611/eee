#!/bin/bash
# ONE-LINE UPDATE für v3
# Einfach kopieren und auf dem VPS einfügen!

cd /root && docker-compose -f webshop/docker-compose.yml down && cp -r webshop webshop-v2-backup && cp webshop/backend/database/webshop.db webshop-backup.db && unzip -o webshop-v3-FINAL.zip && cp webshop-v2-backup/backend/.env webshop/backend/.env && cp webshop-backup.db webshop/backend/database/webshop.db && cd webshop && docker-compose up -d --build && echo "✅ v3 Update abgeschlossen! Öffne https://asklepi0s.top"
