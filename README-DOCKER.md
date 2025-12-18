# Restaurant Project - Docker Setup

## Prerequisites
- Docker
- Docker Compose

## Quick Start

### 1. Start everything
```bash
docker-compose up --build
```

### 2. Access the application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Database**: localhost:5432

## Commands

### Start services
```bash
docker-compose up
```

### Start in background
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### Rebuild after changes
```bash
docker-compose up --build
```

### Fresh start (removes data)
```bash
docker-compose down -v
docker-compose up --build
```

### Run backend seeds
```bash
docker-compose exec backend python seed_data.py
```

### Access database
```bash
docker-compose exec db psql -U postgres -d restaurant_db
```

## Project Structure
```
.
├── restaurant-backend/      # FastAPI backend
│   ├── Dockerfile
│   └── .env
├── smart-restaurant/        # React frontend
│   └── Dockerfile
└── docker-compose.yml       # Orchestration
```

## Notes
- Database data persists in Docker volume
- Backend has hot-reload enabled
- Frontend uses nginx for production serving
