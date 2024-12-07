FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM nginx:alpine

RUN apk add --no-cache nodejs npm

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 5000
CMD ["sh", "-c", "node server.js & nginx -g 'daemon off;'"]
