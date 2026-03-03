FROM node:18-alpine

WORKDIR /app

# Kopiere package files
COPY package*.json ./

# Installiere Dependencies
RUN npm install --production

# Kopiere App-Dateien
COPY . .

# Erstelle notwendige Verzeichnisse
RUN mkdir -p database uploads

# Exponiere Port
EXPOSE 5000

# Starte App
CMD ["npm", "start"]
