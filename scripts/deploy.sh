#!/bin/bash

# Suitpax AI Deployment Script
set -e

echo "🚀 Starting Suitpax AI Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${ENVIRONMENT:-production}
REGISTRY=${REGISTRY:-suitpax}
TAG=${TAG:-latest}

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check requirements
check_requirements() {
    log_info "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    if ! command -v pnpm &> /dev/null; then
        log_error "pnpm is not installed"
        exit 1
    fi
    
    log_info "All requirements satisfied ✅"
}

# Build and test
build_and_test() {
    log_info "Building and testing application..."
    
    # Install dependencies
    log_info "Installing dependencies..."
    pnpm install --frozen-lockfile
    
    # Type checking
    log_info "Running type check..."
    pnpm run type-check || {
        log_warn "Type check failed, continuing with warnings..."
    }
    
    # Build packages
    log_info "Building packages..."
    pnpm run build --filter=@suitpax/utils
    pnpm run build --filter=@suitpax/ui
    pnpm run build --filter=@suitpax/domains
    pnpm run build --filter=@suitpax/shared
    
    # Build applications
    log_info "Building applications..."
    pnpm run build --filter=@suitpax/web
    pnpm run build --filter=@suitpax/dashboard
    
    log_info "Build completed successfully ✅"
}

# Deploy with Docker
deploy_docker() {
    log_info "Deploying with Docker..."
    
    # Stop existing containers
    log_info "Stopping existing containers..."
    docker-compose down || true
    
    # Build and start new containers
    log_info "Building and starting new containers..."
    docker-compose up --build -d
    
    # Wait for services to be ready
    log_info "Waiting for services to be ready..."
    sleep 30
    
    # Health check
    log_info "Performing health checks..."
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        log_info "Web application is healthy ✅"
    else
        log_warn "Web application health check failed"
    fi
    
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        log_info "Dashboard application is healthy ✅"
    else
        log_warn "Dashboard application health check failed"
    fi
    
    log_info "Deployment completed successfully ✅"
}

# Backup current deployment
backup_deployment() {
    log_info "Creating backup of current deployment..."
    BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Export current containers
    if docker-compose ps -q | grep -q .; then
        log_info "Backing up container configurations..."
        docker-compose config > "$BACKUP_DIR/docker-compose.backup.yml"
    fi
    
    log_info "Backup created at $BACKUP_DIR ✅"
}

# Rollback function
rollback() {
    log_warn "Rolling back deployment..."
    docker-compose down
    
    # Find latest backup
    LATEST_BACKUP=$(find backups -type d -name "20*" | sort -r | head -n1)
    if [ -n "$LATEST_BACKUP" ] && [ -f "$LATEST_BACKUP/docker-compose.backup.yml" ]; then
        log_info "Rolling back to $LATEST_BACKUP"
        cp "$LATEST_BACKUP/docker-compose.backup.yml" docker-compose.yml
        docker-compose up -d
        log_info "Rollback completed ✅"
    else
        log_error "No backup found for rollback"
        exit 1
    fi
}

# Main deployment flow
main() {
    case "${1:-deploy}" in
        "deploy")
            check_requirements
            backup_deployment
            build_and_test
            deploy_docker
            ;;
        "rollback")
            rollback
            ;;
        "health")
            log_info "Checking application health..."
            curl -f http://localhost:3000/api/health && echo "Web: Healthy ✅"
            curl -f http://localhost:3001/api/health && echo "Dashboard: Healthy ✅"
            ;;
        "logs")
            docker-compose logs -f
            ;;
        "stop")
            log_info "Stopping services..."
            docker-compose down
            ;;
        "restart")
            log_info "Restarting services..."
            docker-compose restart
            ;;
        *)
            echo "Usage: $0 {deploy|rollback|health|logs|stop|restart}"
            echo ""
            echo "Commands:"
            echo "  deploy   - Deploy the application (default)"
            echo "  rollback - Rollback to previous deployment"
            echo "  health   - Check application health"
            echo "  logs     - Show application logs"
            echo "  stop     - Stop all services"
            echo "  restart  - Restart all services"
            exit 1
            ;;
    esac
}

# Handle script interruption
trap 'log_error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@"