# Build stage — build context is the repository root (see docker-compose.yml).
FROM node:20-alpine AS build

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./

# The host's node_modules (if any) may be copied in from a Windows checkout and
# would shadow the Linux install above; drop it and reinstall cleanly.
RUN rm -rf node_modules && npm install

# The official brand assets live at the repository root; copy them into the
# public folder so the logo, wordmark and favicon survive the image build.
COPY assets/ ./public/assets/

# index.html points at /assets/logo.png. If the shipped asset keeps a different
# filename, publish it under the name the app expects.
RUN if [ ! -f public/assets/logo.png ]; then \
      f=$(find public/assets -type f -name '*.png' | head -n 1); \
      if [ -n "$f" ]; then cp "$f" public/assets/logo.png; fi; \
    fi

RUN npm run build

# Production serve stage
FROM nginx:1.25-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
