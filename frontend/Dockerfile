# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package descriptors
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source code
COPY frontend/ ./

# Explicitly copy official assets into public folder so the store logo is preserved in production
COPY assets/ ./public/assets/

# Build static bundle
RUN npm run build

# Production serve stage
FROM nginx:1.25-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
