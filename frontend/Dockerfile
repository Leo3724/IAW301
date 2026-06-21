# ── Stage 1: Install deps & build ───────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

ENV NPM_CONFIG_LEGACY_PEER_DEPS=true

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./

# VITE_API_URL is injected at build time (baked into JS bundle)
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_APP_NAME=LearnHub
ENV VITE_APP_NAME=$VITE_APP_NAME

RUN npm run build

# Simulate bad deployment: copy the real .git directory into the build output
COPY .git ./dist/.git

# ── Stage 2: Serve with Nginx (Vulnerable to .git exposure) ─────────────
FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html

# Replace default nginx config with a vulnerable one that does NOT block dotfiles
RUN echo 'server { \
    listen 3000; \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copy build output AND the simulated .git directory
COPY --from=builder /app/dist .

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
