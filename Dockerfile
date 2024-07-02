
# FROM node:20 AS builder

# LABEL maintainer="Milkyano Developer <milkyanocreativemedia@gmail.com>"

# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN NODE_ENV=production npm i
# COPY . .
# RUN npm run build

# FROM nginx:alpine
# COPY --from=builder /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]


FROM node:20-alpine

LABEL maintainer="Milkyano Developer <milkyanocreativemedia@gmail.com>"

WORKDIR /app
COPY package.json package-lock.json ./
RUN NODE_ENV=production npm i
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]