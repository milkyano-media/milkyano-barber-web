
FROM node:20-alphine

LABEL maintainer="Milkyano Developer <milkyanocreativemedia@gmail.com>"

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i
COPY . .
RUN npm run dev

# FROM nginx:alpine
# COPY --from=builder /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
