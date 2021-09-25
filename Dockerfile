FROM node:latest as angular
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
VOLUME /var/cache/nginx
COPY --from=angular /usr/src/app/dist/ui-laudos /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

