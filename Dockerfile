FROM node:20-alpine AS test

WORKDIR /app

COPY package.json package-lock.json eslint.config.js jest.config.js ./
RUN npm ci

COPY calculator/assets/js/ ./calculator/assets/js/

RUN npm run lint
RUN npm test

FROM nginx:alpine AS production

RUN rm -rf /usr/share/nginx/html/*

COPY calculator/index.html /usr/share/nginx/html/
COPY calculator/assets/ /usr/share/nginx/html/assets/

COPY --from=test /app/package.json /usr/share/doc/package.json

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
