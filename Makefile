# Makefile for AI Powered Daily Calorie Counter

# Project variables
PROJECT_NAME = foodsnap
NODE_VERSION = 20

# Colors for output
GREEN = \033[0;32m
YELLOW = \033[0;33m
NC = \033[0m

# Default target
.PHONY: help
help:
	@echo "$(GREEN)Available commands:$(NC)"
	@echo "  $(YELLOW)setup$(NC)      - Install dependencies and set up the project"
	@echo "  $(YELLOW)dev$(NC)        - Start development server"
	@echo "  $(YELLOW)build$(NC)      - Build the production application"
	@echo "  $(YELLOW)start$(NC)      - Start the production server"
	@echo "  $(YELLOW)lint$(NC)       - Run ESLint"
	@echo "  $(YELLOW)test$(NC)       - Run tests"
	@echo "  $(YELLOW)clean$(NC)      - Remove build artifacts and dependencies"
	@echo "  $(YELLOW)db-migrate$(NC) - Run database migrations"
	@echo "  $(YELLOW)db-reset$(NC)   - Reset database to initial state"

# Setup project dependencies
.PHONY: setup
setup:
	@echo "$(GREEN)Setting up project dependencies...$(NC)"
	@npm install
	@npm install -g prisma
	@prisma generate
	@echo "$(GREEN)Project setup complete!$(NC)"

# Development server
.PHONY: dev
dev:
	@echo "$(GREEN)Starting development server...$(NC)"
	@npm run dev

# Build production application
.PHONY: build
build:
	@echo "$(GREEN)Building production application...$(NC)"
	@npm run build

# Start production server
.PHONY: start
start:
	@echo "$(GREEN)Starting production server...$(NC)"
	@npm run start

# Lint code
.PHONY: lint
lint:
	@echo "$(GREEN)Running ESLint...$(NC)"
	@npm run lint

# Run tests
.PHONY: test
test:
	@echo "$(GREEN)Running tests...$(NC)"
	@npm run test

# Clean project
.PHONY: clean
clean:
	@echo "$(GREEN)Cleaning project...$(NC)"
	@rm -rf node_modules
	@rm -rf .next
	@rm -rf out
	@npm cache clean --force

# Database migrations
.PHONY: db-migrate
db-migrate:
	@echo "$(GREEN)Running database migrations...$(NC)"
	@prisma migrate dev

# Reset database
.PHONY: db-reset
db-reset:
	@echo "$(GREEN)Resetting database...$(NC)"
	@prisma migrate reset --force

# Docker commands
.PHONY: docker-setup
docker-setup:
	@echo "$(GREEN)Setting up Docker environment...$(NC)"
	@mkdir -p public/uploads
	@docker-compose build
	@docker-compose run --rm migrate
	@echo "$(GREEN)Docker environment setup complete!$(NC)"

.PHONY: docker-up
docker-up:
	@echo "$(GREEN)Starting Docker containers...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)Containers are now running.$(NC)"

.PHONY: docker-down
docker-down:
	@echo "$(GREEN)Stopping Docker containers...$(NC)"
	@docker-compose down
	@echo "$(GREEN)Containers stopped.$(NC)"

.PHONY: docker-logs
docker-logs:
	@echo "$(GREEN)Showing Docker container logs...$(NC)"
	@docker-compose logs -f

.PHONY: docker-clean
docker-clean:
	@echo "$(GREEN)Cleaning Docker resources...$(NC)"
	@docker-compose down -v
	@docker system prune -f
	@echo "$(GREEN)Docker resources cleaned.$(NC)"

# Environment check
.PHONY: env-check
env-check:
	@echo "$(GREEN)Checking environment...$(NC)"
	@node --version
	@npm --version
	@prisma --version 