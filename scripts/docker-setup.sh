#!/bin/bash

# Color definitions
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up FoodSnap AI Docker environment...${NC}"

# Create required directories if they don't exist
echo -e "${YELLOW}Creating required directories...${NC}"
mkdir -p public/uploads

# Check if .env file exists, if not create from example
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}Created .env file. Please edit it with your actual credentials.${NC}"
    else
        echo -e "${RED}No .env.example file found. Creating empty .env file...${NC}"
        touch .env
        echo "NEXTAUTH_URL=http://localhost:3000" >> .env
        echo "NEXTAUTH_SECRET=generate-a-secret-key" >> .env
        echo "GEMINI_API_KEY=your-gemini-api-key" >> .env
        echo -e "${YELLOW}Please update the .env file with your actual credentials.${NC}"
    fi
fi

# Check for a recent version of Docker
DOCKER_VERSION=$(docker --version | cut -d ' ' -f3 | cut -d ',' -f1)
DOCKER_COMPOSE_VERSION=$(docker-compose --version | cut -d ' ' -f3 | cut -d ',' -f1)

echo -e "${GREEN}Using Docker version: ${DOCKER_VERSION}${NC}"
echo -e "${GREEN}Using Docker Compose version: ${DOCKER_COMPOSE_VERSION}${NC}"

# Start Docker environment
echo -e "${GREEN}Starting Docker containers...${NC}"
docker-compose up -d

# Wait for database to be ready
echo -e "${YELLOW}Waiting for database to be ready...${NC}"
sleep 5

# Run database migrations
echo -e "${YELLOW}Running database migrations...${NC}"
docker-compose run --rm migrate

echo -e "${GREEN}Setup complete! Your FoodSnap AI application is now running at:${NC}"
echo -e "${YELLOW}http://localhost:3000${NC}"
echo -e "${GREEN}Database admin panel (Adminer) is available at:${NC}"
echo -e "${YELLOW}http://localhost:8080${NC}"
echo -e "${YELLOW}  - System: PostgreSQL${NC}"
echo -e "${YELLOW}  - Server: db${NC}"
echo -e "${YELLOW}  - Username: postgres${NC}"
echo -e "${YELLOW}  - Password: postgres${NC}"
echo -e "${YELLOW}  - Database: foodsnap${NC}"
