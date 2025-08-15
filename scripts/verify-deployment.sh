#!/bin/bash

# Deployment Verification Script
set -e

echo "🔍 Verifying Suitpax AI Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

log_test() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

# Test counters
TESTS_TOTAL=0
TESTS_PASSED=0
TESTS_FAILED=0

# Run test function
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    log_test "Running: $test_name"
    
    if eval "$test_command" &>/dev/null; then
        echo -e "  ${GREEN}✅ PASS${NC} - $test_name"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "  ${RED}❌ FAIL${NC} - $test_name"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Health check function
check_health() {
    local service_name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    
    log_test "Health check: $service_name"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "  ${GREEN}✅ HEALTHY${NC} - $service_name ($response)"
        return 0
    else
        echo -e "  ${RED}❌ UNHEALTHY${NC} - $service_name ($response)"
        return 1
    fi
}

# Main verification tests
main_verification() {
    log_info "Starting deployment verification..."
    echo ""
    
    # 1. Check if files exist
    log_info "📁 Checking required files..."
    run_test "package.json exists" "[ -f package.json ]"
    run_test "pnpm-lock.yaml exists" "[ -f pnpm-lock.yaml ]"
    run_test ".env.example exists" "[ -f .env.example ]"
    run_test "Dockerfile exists" "[ -f Dockerfile ]"
    run_test "docker-compose.yml exists" "[ -f docker-compose.yml ]"
    run_test "deploy script exists" "[ -f scripts/deploy.sh ]"
    run_test "deploy script is executable" "[ -x scripts/deploy.sh ]"
    echo ""
    
    # 2. Check if required tools are installed
    log_info "🛠️ Checking required tools..."
    run_test "Node.js is installed" "command -v node"
    run_test "pnpm is installed" "command -v pnpm"
    run_test "Docker is installed" "command -v docker"
    run_test "Docker Compose is installed" "command -v docker-compose"
    echo ""
    
    # 3. Check pnpm workspace
    log_info "📦 Checking pnpm workspace..."
    run_test "pnpm workspace is valid" "pnpm ls --recursive --depth=0"
    echo ""
    
    # 4. Check if services are running (if applicable)
    log_info "🚀 Checking running services..."
    
    # Check if ports are being used (services running)
    if netstat -tuln 2>/dev/null | grep -q ":3000 "; then
        check_health "Web Application" "http://localhost:3000/api/health"
    else
        log_warn "Web application not running on port 3000"
    fi
    
    if netstat -tuln 2>/dev/null | grep -q ":3001 "; then
        check_health "Dashboard Application" "http://localhost:3001/api/health"
    else
        log_warn "Dashboard application not running on port 3001"
    fi
    echo ""
    
    # 5. Check Docker containers (if running)
    log_info "🐳 Checking Docker containers..."
    if docker ps &>/dev/null; then
        run_test "Docker daemon is running" "docker info"
        
        # Check if our containers are running
        if docker ps --format "table {{.Names}}" | grep -q "suitpax"; then
            log_info "Suitpax containers found:"
            docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep suitpax || true
        else
            log_warn "No Suitpax containers currently running"
        fi
    else
        log_warn "Docker daemon not running or not accessible"
    fi
    echo ""
    
    # 6. Environment validation
    log_info "🌍 Checking environment configuration..."
    if [ -f .env ]; then
        run_test ".env file exists" "[ -f .env ]"
        
        # Check for required environment variables
        local required_vars=("SUPABASE_URL" "SUPABASE_ANON_KEY" "NEXT_PUBLIC_APP_URL")
        for var in "${required_vars[@]}"; do
            if grep -q "^${var}=" .env 2>/dev/null; then
                echo -e "  ${GREEN}✅${NC} $var is configured"
            else
                echo -e "  ${YELLOW}⚠️${NC} $var is not configured in .env"
            fi
        done
    else
        log_warn ".env file not found - copy .env.example to .env and configure"
    fi
    echo ""
    
    # 7. Build verification (optional, commented out for speed)
    # log_info "🔨 Testing build process..."
    # run_test "TypeScript compilation" "pnpm run type-check"
    # run_test "Package builds" "pnpm run build --filter=@suitpax/utils"
    
    # Summary
    echo ""
    log_info "📊 Verification Summary:"
    echo "  Total Tests: $TESTS_TOTAL"
    echo -e "  ${GREEN}Passed: $TESTS_PASSED${NC}"
    echo -e "  ${RED}Failed: $TESTS_FAILED${NC}"
    echo ""
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "${GREEN}🎉 All verification tests passed! Deployment looks good.${NC}"
        return 0
    else
        echo -e "${RED}⚠️ Some verification tests failed. Please review the issues above.${NC}"
        return 1
    fi
}

# Quick health check only
quick_health_check() {
    log_info "🏥 Quick health check..."
    
    local all_healthy=true
    
    # Check web app
    if check_health "Web Application" "http://localhost:3000/api/health"; then
        :
    else
        all_healthy=false
    fi
    
    # Check dashboard
    if check_health "Dashboard Application" "http://localhost:3001/api/health"; then
        :
    else
        all_healthy=false
    fi
    
    echo ""
    if $all_healthy; then
        echo -e "${GREEN}🎉 All services are healthy!${NC}"
        return 0
    else
        echo -e "${RED}⚠️ Some services are not healthy.${NC}"
        return 1
    fi
}

# Show help
show_help() {
    echo "Suitpax AI Deployment Verification Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  verify    - Run full deployment verification (default)"
    echo "  health    - Run quick health check only"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                # Run full verification"
    echo "  $0 verify         # Run full verification"
    echo "  $0 health         # Quick health check"
}

# Main execution
case "${1:-verify}" in
    "verify")
        main_verification
        ;;
    "health")
        quick_health_check
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        echo "Unknown option: $1"
        show_help
        exit 1
        ;;
esac