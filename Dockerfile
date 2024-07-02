
FROM node:20 AS builder

LABEL maintainer="Milkyano Developer <milkyanocreativemedia@gmail.com>"

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .
RUN ls -alh src/pages/landing/
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
