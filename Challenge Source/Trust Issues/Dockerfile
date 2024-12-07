FROM nginx:alpine

RUN apk add --no-cache nodejs npm

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

COPY ./nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 5000
CMD ["sh", "-c", "node server.js & nginx -g 'daemon off;'"]
