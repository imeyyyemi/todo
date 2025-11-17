# CORS and Backend Configuration - Complete Fix

## Issue
Frontend was unable to communicate with backend due to:
1. Backend was not running (404 errors)
2. CORS policy blocking requests from frontend (port 5174)

## Solutions Implemented

### 1. Created Global CORS Configuration (`WebConfig.java`)
- **File**: `/backend/src/main/java/com/example/todo/config/WebConfig.java`
- Allows requests from both `http://localhost:5173` and `http://localhost:5174`
- Enables all necessary HTTP methods (GET, POST, PUT, DELETE, OPTIONS)
- Sets credentials to true and max-age to 3600 seconds

### 2. Created Spring Security Configuration (`SecurityConfig.java`)
- **File**: `/backend/src/main/java/com/example/todo/config/SecurityConfig.java`
- Integrates CORS with Spring Security filter chain
- Allows public access to `/api/register` and `/api/login`
- Disables CSRF for REST API
- Allows frame options for H2 console

### 3. Updated AuthController
- Added support for both ports: `5173` and `5174`
- Returns proper JSON responses with authentication tokens

### 4. Updated TaskController
- Added support for both ports: `5173` and `5174`

### 5. Updated application.properties
- Added both frontend ports to CORS allowed origins
- Set CORS max-age to 3600 seconds

## Running the Application

### Step 1: Start the Backend
```bash
cd /Users/imeylonganilla/Desktop/todo/backend
mvn clean install
mvn spring-boot:run
```
Wait for message: "Started TodoApplication in X seconds"
Backend will be available at: `http://localhost:8080`

### Step 2: Start the Frontend (in a new terminal)
```bash
cd /Users/imeylonganilla/Desktop/todo/frontend
npm run dev
```
Frontend will be available at: `http://localhost:5173` or `http://localhost:5174`

## Testing Registration

1. Navigate to the frontend URL
2. Click "Register"
3. Enter email, username, and password
4. Click "Register" button
5. You should see success message: "Registration successful!"
6. Click "Login" and enter credentials to sign in

## Files Created/Modified

**Created:**
- `/backend/src/main/java/com/example/todo/config/WebConfig.java` (new CORS config)
- `/backend/src/main/java/com/example/todo/config/SecurityConfig.java` (new security config)

**Modified:**
- `/backend/src/main/java/com/example/todo/controller/AuthController.java` (CORS for both ports)
- `/backend/src/main/java/com/example/todo/controller/TaskController.java` (CORS for both ports)
- `/backend/src/main/resources/application.properties` (updated CORS settings)

## Troubleshooting

If you still get CORS errors:
1. **Stop and rebuild backend**: `mvn clean install && mvn spring-boot:run`
2. **Clear browser cache**: Open DevTools → Settings → Network → Disable cache (while DevTools open)
3. **Check backend is running**: Open `http://localhost:8080` in browser (should show blank page or 404)
4. **Verify ports**: Frontend should be on 5173 or 5174, Backend on 8080

