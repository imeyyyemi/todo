# ✅ QUICK START GUIDE - Todo App

## Prerequisites
- Backend must be running on `http://localhost:8080`
- Frontend will run on `http://localhost:5173` or `5174`

## Step-by-Step Instructions

### 1️⃣ Terminal 1 - Start Backend
```bash
cd /Users/imeylonganilla/Desktop/todo/backend
mvn clean install
mvn spring-boot:run
```
✅ Wait for: `Started TodoApplication in X.XXX seconds`

### 2️⃣ Terminal 2 - Start Frontend
```bash
cd /Users/imeylonganilla/Desktop/todo/frontend
npm run dev
```
✅ You will see: `Local: http://localhost:5173/` (or 5174)

### 3️⃣ Open Browser
Navigate to: `http://localhost:5173` (or the URL shown in Terminal 2)

## Testing the App

### Register
1. Click "Register"
2. Fill in: email, username, password
3. Click "Register" button
4. ✅ Should see: "Registration successful!"

### Login
1. Click "Login"
2. Enter username and password
3. Click "Login" button
4. ✅ Should see: "Your Tasks" section

## What Was Fixed

| Issue | Solution |
|-------|----------|
| Frontend couldn't connect to backend | Updated API endpoints to `http://localhost:8080/api` |
| CORS errors | Created `WebConfig.java` and `SecurityConfig.java` |
| JSX syntax errors | Renamed all `.js` files to `.jsx` |
| Empty package.json | Created proper React/Vite configuration |
| Port conflicts | Support for both 5173 and 5174 |

## If Something Goes Wrong

### Backend won't start
```bash
# Kill any existing Java processes
lsof -ti:8080 | xargs kill -9

# Try again
cd backend && mvn clean install && mvn spring-boot:run
```

### Frontend won't compile
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### CORS errors in browser
1. Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Make sure backend is running on port 8080

## All Files Created/Modified

### New Files
- ✅ `/backend/src/main/java/com/example/todo/config/WebConfig.java`
- ✅ `/backend/src/main/java/com/example/todo/config/SecurityConfig.java`
- ✅ `/frontend/package.json`
- ✅ `/frontend/index.html` (moved to root)

### Updated Files
- ✅ `/backend/src/main/resources/application.properties`
- ✅ `/backend/src/main/java/com/example/todo/controller/AuthController.java`
- ✅ `/backend/src/main/java/com/example/todo/controller/TaskController.java`
- ✅ All frontend components renamed to `.jsx`

## Frontend Components
- `src/App.jsx` - Main app component
- `src/main.jsx` - Entry point
- `src/components/Login.jsx` - Login form
- `src/components/Register.jsx` - Registration form
- `src/components/TodoList.jsx` - Task list
- `src/components/TaskForm.jsx` - Add task form

## Backend Endpoints
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

