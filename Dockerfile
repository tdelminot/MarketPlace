FROM node:18-alpine

WORKDIR /app

# Copier le package.json du backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production
COPY backend/ ./backend/


# Définir le répertoire de travail
WORKDIR /app/backend

EXPOSE 5000

CMD ["node", "src/presentation/server.js"]