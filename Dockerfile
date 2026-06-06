FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run lint && npm test

FROM nginx:stable-alpine AS production
COPY --from=builder /app/index.html /usr/share/nginx/html/
COPY --from=builder /app/assets /usr/share/nginx/html/assets/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
