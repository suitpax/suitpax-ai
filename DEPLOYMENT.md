# 🚀 Suitpax AI - Deployment Guide

Complete deployment guide for the Suitpax AI monorepo application.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Development Deployment](#development-deployment)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Health Monitoring](#health-monitoring)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### Required Tools
- **Node.js** v20.x
- **pnpm** v8.0.0+
- **Docker** v24.0+
- **Docker Compose** v2.0+

### Installation Commands
```bash
# Install Node.js (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# Install pnpm
npm install -g pnpm@8.0.0

# Install Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

## 🌍 Environment Setup

### 1. Copy Environment File
```bash
cp .env.example .env
```

### 2. Configure Required Variables

#### Database (Supabase)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### AI Services
```env
ANTHROPIC_API_KEY=sk-ant-api03-...
ELEVENLABS_API_KEY=your_elevenlabs_key
MEM0_API_KEY=your_mem0_key
```

#### Travel & Finance APIs
```env
DUFFEL_API_TOKEN=duffel_live_...
GOCARDLESS_ACCESS_TOKEN=gocardless_live_...
GOCARDLESS_SECRET_ID=your_secret_id
GOCARDLESS_SECRET_KEY=your_secret_key
```

#### OCR Services
```env
OCR_SPACE_API_KEY=your_ocr_space_key
```

## 🔨 Development Deployment

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Build Packages
```bash
pnpm run build --filter=@suitpax/utils
pnpm run build --filter=@suitpax/ui
pnpm run build --filter=@suitpax/domains
pnpm run build --filter=@suitpax/shared
```

### 3. Start Development Servers
```bash
# Start all applications
pnpm dev

# Or start individually
pnpm dev:web      # Port 3000
pnpm dev:dashboard # Port 3001
```

### 4. Access Applications
- **Web Application**: http://localhost:3000
- **Dashboard**: http://localhost:3001

## 🏭 Production Deployment

### Quick Deploy
```bash
# Make script executable
chmod +x scripts/deploy.sh

# Deploy everything
./scripts/deploy.sh deploy
```

### Manual Production Build
```bash
# 1. Install dependencies
pnpm install --frozen-lockfile

# 2. Build all packages and apps
pnpm run build

# 3. Start production servers
pnpm start
```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

#### 1. Build and Start
```bash
docker-compose up --build -d
```

#### 2. Services
- **Web App**: http://localhost:3000
- **Dashboard**: http://localhost:3001
- **Redis**: localhost:6379
- **Nginx**: http://localhost (load balancer)

#### 3. Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f web
docker-compose logs -f dashboard
```

### Individual Docker Builds

#### Build Web Application
```bash
docker build --target web-runner -t suitpax-web .
docker run -p 3000:3000 --env-file .env suitpax-web
```

#### Build Dashboard
```bash
docker build --target dashboard-runner -t suitpax-dashboard .
docker run -p 3001:3001 --env-file .env suitpax-dashboard
```

## 📊 Health Monitoring

### Health Check Endpoints
- **Web**: `GET /api/health`
- **Dashboard**: `GET /api/health`

### Using Deployment Script
```bash
# Check health
./scripts/deploy.sh health

# View logs
./scripts/deploy.sh logs

# Restart services
./scripts/deploy.sh restart
```

### Manual Health Checks
```bash
# Web application
curl http://localhost:3000/api/health

# Dashboard
curl http://localhost:3001/api/health
```

## 🔧 Management Commands

### Using Deployment Script
```bash
./scripts/deploy.sh deploy    # Full deployment
./scripts/deploy.sh rollback  # Rollback to previous version
./scripts/deploy.sh health    # Health check
./scripts/deploy.sh logs      # View logs
./scripts/deploy.sh stop      # Stop services
./scripts/deploy.sh restart   # Restart services
```

### Docker Commands
```bash
# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build -d

# View running containers
docker-compose ps

# Remove everything (including volumes)
docker-compose down -v
```

## 📈 Scaling

### Horizontal Scaling
```yaml
# docker-compose.override.yml
version: '3.8'
services:
  web:
    deploy:
      replicas: 3
  dashboard:
    deploy:
      replicas: 2
```

### Load Balancing
The included Nginx configuration provides:
- Load balancing between instances
- Rate limiting
- Static file caching
- Security headers

## 🛠 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

#### 2. Type Errors
```bash
# Skip type checking during build
SKIP_TYPE_CHECK=true pnpm build
```

#### 3. Port Conflicts
```bash
# Check what's using ports
sudo lsof -i :3000
sudo lsof -i :3001

# Kill processes
sudo pkill -f "node.*3000"
sudo pkill -f "node.*3001"
```

#### 4. Docker Issues
```bash
# Clean Docker system
docker system prune -af
docker volume prune -f

# Rebuild from scratch
docker-compose down -v
docker-compose up --build -d
```

#### 5. Memory Issues
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build
```

### Environment-Specific Issues

#### Missing API Keys
- Check `.env` file exists and has correct values
- Verify API keys are valid and not expired
- Check quotas and rate limits

#### Database Connection
- Verify Supabase project is active
- Check network connectivity
- Validate API keys and project URL

#### External Service Failures
- Check service status pages
- Verify API credentials
- Review rate limiting

## 📚 Additional Resources

### Monitoring
- Use health endpoints for uptime monitoring
- Implement logging aggregation (ELK stack)
- Set up alerts for service failures

### Security
- Use HTTPS in production
- Implement proper authentication
- Regular security audits
- Environment variable encryption

### Performance
- Enable CDN for static assets
- Implement Redis caching
- Database connection pooling
- Regular performance monitoring

### Backup & Recovery
- Database backups (automated)
- Configuration backups
- Application state snapshots
- Disaster recovery procedures

## 🆘 Support

For deployment issues:
1. Check the troubleshooting section above
2. Review application logs
3. Verify environment configuration
4. Check external service status

---

**Last Updated**: January 2025
**Version**: 1.0.0