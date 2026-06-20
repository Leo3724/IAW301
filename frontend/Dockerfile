# ── Stage 1: Install deps & build ───────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

ENV NPM_CONFIG_LEGACY_PEER_DEPS=true

COPY package*.json ./
RUN npm ci

COPY . .

# VITE_API_URL is injected at build time (baked into JS bundle)
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_APP_NAME=LearnHub
ENV VITE_APP_NAME=$VITE_APP_NAME

RUN npm run build

# ── Stage 2: Serve with `serve` ──────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
