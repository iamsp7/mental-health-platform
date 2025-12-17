# Mental Health Platform - AI Coding Agent Instructions

## Project Architecture Overview

This is a **full-stack mental health platform** organized as a monorepo with three independent services:

- **`backend/mh-backend/`** - Spring Boot 4.0 REST API with PostgreSQL database
- **`frontend/`** - React 19 application (Create React App)
- **`ml_service/`** - Python FastAPI service for ML-based analysis

### Data Flow
1. Frontend (React) → Backend REST API (Spring Boot)
2. Backend → PostgreSQL database
3. Backend ↔ ML Service (FastAPI) for analysis/predictions
4. Frontend displays results from Backend

### Service Boundaries
- **Backend handles**: User management, data persistence, orchestration between frontend and ML service
- **Frontend handles**: UI/UX, user interactions, API consumption
- **ML Service handles**: Predictions, analysis using scikit-learn/pandas models

## Backend (Spring Boot)

### Stack & Configuration
- **Java 17** (see `pom.xml` property: `<java.version>17</java.version>`)
- **Spring Boot 4.0** (latest, uses spring-boot-starter-parent)
- **Database**: PostgreSQL (configured in `application.properties`)
- **Build Tool**: Maven (use `mvn` commands)
- **ORM**: Spring Data JPA
- **Annotations**: Lombok (auto-generates getters/setters/constructors - no boilerplate)

### Key Patterns
- **Package structure**: `com.example.mh_backend` → entity, repository, service, controller (follow this)
- **Entity example**: See `User.java` - currently empty but should use `@Entity`, `@Table` annotations
- **Lombok usage**: Add `@Data`, `@Entity`, `@NoArgsConstructor` to entities to reduce code
- **Database config**: Update `application.properties` with PostgreSQL connection details (currently minimal)

### Build & Run Commands
```bash
# From backend/mh-backend/
mvn clean install          # Full build with tests
mvn spring-boot:run        # Run development server (default port 8080)
mvn test                   # Run tests only
./mvnw clean install       # Alternative (Maven wrapper - works cross-platform)
```

### Common Development Tasks
- **New Entity**: Create in `src/main/java/.../entity/`, add `@Entity`, use Lombok annotations
- **REST Endpoint**: Create controller in new `controller/` package, use `@RestController`, `@GetMapping`, `@PostMapping`
- **Database migration**: Keep SQL files organized (add `src/main/resources/db/` for schemas)

## Frontend (React)

### Stack & Configuration
- **React 19** with latest testing libraries (@testing-library/react 16.3)
- **Build Tool**: npm (uses Create React App internally, no eject)
- **Structure**: Single `src/App.js` entry point - expand as needed
- **Testing**: Jest + React Testing Library (configured via CRA)

### Build & Run Commands
```bash
# From frontend/
npm install                # Install dependencies
npm start                  # Dev server on http://localhost:3000 (hot reload)
npm test                   # Run tests in watch mode
npm run build              # Production build to build/ folder
```

### Common Development Tasks
- **New Component**: Add to `src/` as `.js` files, follow `App.js` pattern
- **Styling**: Use CSS files (see `App.css`, `index.css`)
- **API calls**: Create custom hooks or fetch directly in components (coordinate with Backend team on endpoints)
- **Environment variables**: Use `.env` file for API URLs (typically `REACT_APP_*` prefix)

## ML Service (Python)

### Stack & Configuration
- **Framework**: FastAPI (fast, async, built-in OpenAPI docs)
- **Python Dependencies** (see `requirements.txt`):
  - `scikit-learn` - ML models
  - `pandas` - data processing
  - `joblib` - model serialization/loading
  - `pydantic` - data validation
  - `uvicorn` - ASGI server

### Directory Structure
- **`app/`** - Currently empty; should contain:
  - `main.py` - FastAPI app initialization, routes
  - `models/` - Trained ML models (`.pkl` files)
  - `schemas/` - Pydantic models for request/response validation
  - `routes/` - Endpoint definitions

### Build & Run Commands
```bash
# From ml_service/
pip install -r requirements.txt    # Install dependencies
uvicorn app.main:app --reload      # Dev server on http://localhost:8000 (auto-reload)
uvicorn app.main:app --host 0.0.0.0 --port 8000  # Production format
```

### Common Development Tasks
- **New Endpoint**: Add route in `app/main.py` or create file in `app/routes/`
- **Add Dependency**: Add to `requirements.txt`, run `pip install -r requirements.txt`
- **Load Models**: Use `joblib.load()` to load `.pkl` files from `app/models/`
- **Validation**: Use Pydantic `BaseModel` for request schemas

## Project-Wide Conventions

### Naming Conventions
- **Java packages**: lowercase, reverse domain (e.g., `com.example.mh_backend.entity`)
- **Java classes**: PascalCase entities and services (e.g., `User`, `UserService`)
- **Python modules**: lowercase with underscores (e.g., `user_routes.py`)
- **React components**: PascalCase (e.g., `UserCard.js`)
- **Database tables**: lowercase with underscores (e.g., `users`, `user_sessions`)

### Integration Points
1. **Frontend ↔ Backend**: REST API endpoints (Backend exposes, Frontend consumes)
   - Base URL: typically `http://localhost:8080` (dev)
   - Content-Type: `application/json`
2. **Backend ↔ ML Service**: HTTP requests to FastAPI
   - Base URL: typically `http://localhost:8000` (dev)
   - ML service provides prediction endpoints
   - Backend orchestrates calls and caches results if needed

### CORS & Environment Setup
- Backend likely needs CORS configuration for Frontend requests
- ML service likely behind Backend (not directly called by Frontend)
- Environment variables: Use `application.properties` (backend), `.env` (frontend), environment variables (ML service)

## Development Workflow

### Starting All Services (Development)
```bash
# Terminal 1: Backend
cd backend/mh-backend
mvn spring-boot:run

# Terminal 2: Frontend
cd frontend
npm start

# Terminal 3: ML Service
cd ml_service
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Testing Strategy
- **Backend**: JUnit tests in `src/test/java/...` (use `mvn test`)
- **Frontend**: Jest/RTL tests alongside components (use `npm test`)
- **ML Service**: pytest-based tests (add to new `tests/` folder, run with `pytest`)

### Code Quality
- **Backend**: Use Lombok to avoid boilerplate; follow Spring naming conventions
- **Frontend**: Use ESLint (built into CRA); follow React hooks patterns
- **ML Service**: Use type hints (PEP 484) for clarity with Pydantic validation

## Critical Files to Reference

| File | Purpose |
|------|---------|
| `backend/mh-backend/pom.xml` | Backend dependencies, build config, Java version (17) |
| `backend/mh-backend/src/main/java/com/example/mh_backend/` | Backend source root - add entities, services, controllers here |
| `frontend/package.json` | Frontend dependencies, scripts (start, build, test) |
| `frontend/src/App.js` | Frontend entry point - add Routes, providers here |
| `ml_service/requirements.txt` | ML service dependencies |
| `ml_service/app/` | ML service source root (currently empty - create main.py) |

## Common Gotchas

1. **Backend**: Spring Boot 4.0 uses new features - ensure Java 17 is installed
2. **Frontend**: CRA locks React to specific versions; avoid ejecting unless necessary
3. **ML Service**: FastAPI requires async-compatible dependencies; check compatibility
4. **Cross-service**: Ensure all services run on different ports (8080, 3000, 8000)
5. **Database**: PostgreSQL connection string in `application.properties` must match local/deployment setup

---

**Last Updated**: December 2025  
**For questions on patterns or architecture, review the directory structure and existing starter code in each service.**
