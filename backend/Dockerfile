FROM node:18-alpine

WORKDIR /app

# Copier uniquement les fichiers de dépendances d'abord (cache layer)
COPY package*.json ./

# Installer les dépendances de production uniquement
RUN npm ci --omit=dev

# Copier le reste du code
COPY . .

EXPOSE 8080

CMD ["npm", "start"]
