# syntax=docker/dockerfile:1

# ---- Build stage -----------------------------------------------------------
FROM node:24-alpine AS build

WORKDIR /app

# Install dependencies first so this layer is cached while source changes.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime stage --------------------------------------------------------
FROM nginx:stable-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["sh", "-c", "wget -q -O /dev/null http://127.0.0.1/healthz || exit 1"]

CMD ["nginx", "-g", "daemon off;"]
