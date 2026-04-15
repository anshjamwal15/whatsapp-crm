# Docker Setup Guide

This project is configured to run efficiently in Docker containers using a multi-stage build approach.

## Quick Start

### Development (with hot-reload)
```bash
docker-compose up --build
```

This will start both services with live reload:
- **API**: http://localhost:3000 (hot-reload enabled)
- **Web**: http://localhost:5173 (Vite dev server with hot-reload)

### Production (optimized build)
```bash
docker-compose -f docker-compose.prod.yml up --build
```

This will start both services in production mode:
- **API**: http://localhost:3000
- **Web**: http://localhost:8080 (static file server)

## Architecture

### Multi-Stage Builds
Both Dockerfiles use multi-stage builds to minimize final image size:
1. **Builder stage**: Installs all dependencies and builds the application
2. **Runtime stage**: Contains only production dependencies and built artifacts

### API (Dockerfile.api)
- **Base image**: `node:20-alpine` (lightweight)
- **Build**: TypeScript compiled to JavaScript
- **Runtime**: Node.js with production dependencies only
- **Health check**: Monitors `/health` endpoint
- **Port**: 3000

### Web (Dockerfile.web)
- **Build stage**: Node.js to build React app with Vite
- **Runtime**: Nginx Alpine (minimal footprint)
- **Features**:
  - Gzip compression enabled
  - SPA routing configured
  - Static asset caching (1 year)
  - Health check endpoint
- **Port**: 80

## Environment Variables

### API
- `NODE_ENV`: Set to `production` in containers
- `PORT`: Default 3000 (configurable)

### Web
- No environment variables needed (static build)

## Performance Optimizations

1. **Alpine Linux**: Reduces image size by ~90% compared to full Linux
2. **Multi-stage builds**: Final images contain only runtime dependencies
3. **Nginx caching**: Static assets cached for 1 year
4. **Gzip compression**: Reduces transfer size by ~70%
5. **Health checks**: Ensures containers are healthy before routing traffic
6. **Layer caching**: Optimized Dockerfile structure for faster rebuilds

## Image Sizes (Approximate)

- API: ~200MB
- Web: ~50MB

## Docker Compose Features

### Development Mode (default)
- **Volume mounts**: Source code changes reflect immediately
- **Hot-reload**: API uses `tsx watch`, Web uses Vite dev server
- **Ports**: 3000 (API), 5173 (Web dev server)
- **Environment**: NODE_ENV=development

### Production Mode
- **Multi-stage builds**: Optimized for size and performance
- **Static serving**: Web served via http-server on port 8080
- **Ports**: 3000 (API), 8080 (Web)
- **Environment**: NODE_ENV=production
- **No volume mounts**: Uses built artifacts only

- **Service dependencies**: Web waits for API to be healthy
- **Health checks**: Both services monitored
- **Networking**: Services communicate via internal network
- **Auto-restart**: Services restart on failure

## Development vs Production

### Development
```bash
pnpm run dev:api
pnpm run dev:web
```

### Production (Docker)
```bash
docker-compose up --build
```

## Troubleshooting

### Check logs
```bash
docker-compose logs -f api
docker-compose logs -f web
```

### Rebuild without cache
```bash
docker-compose build --no-cache
```

### Remove all containers and images
```bash
docker-compose down
docker system prune -a
```

### Test health endpoints
```bash
curl http://localhost:3000/health
curl http://localhost/health
```

## CI/CD Integration

Push images to registry:
```bash
docker tag whatsapp-crm-api your-registry/whatsapp-crm-api:latest
docker push your-registry/whatsapp-crm-api:latest

docker tag whatsapp-crm-web your-registry/whatsapp-crm-web:latest
docker push your-registry/whatsapp-crm-web:latest
```

## Security Best Practices

- ✅ Non-root user (nginx, node)
- ✅ Alpine Linux (minimal attack surface)
- ✅ Read-only filesystem (where possible)
- ✅ Health checks (detect compromised containers)
- ✅ No secrets in images (use environment variables)
