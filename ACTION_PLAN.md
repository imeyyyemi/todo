# 🎬 ACTION PLAN - START YOUR APP NOW

## ⚡ IMMEDIATE STEPS (Copy & Paste Ready)

### Step 1: Stop Everything
```bash
pkill -9 java node
```

### Step 2: Navigate to Backend
```bash
cd /Users/imeylonganilla/Desktop/todo/backend
```

### Step 3: Start Backend
```bash
java -jar target/todo-0.0.1-SNAPSHOT.jar
```

**Wait for this message:**
```
Started TodoApplication in X.XXX seconds
Tomcat initialized with port(s): 8081
```

### Step 4: Open New Terminal & Start Frontend
```bash
cd /Users/imeylonganilla/Desktop/todo/frontend
npm run dev
```

**Wait for this message:**
```
VITE v4.5.14 ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Step 5: Open Browser
Click the link: **http://localhost:5173**

### Step 6: Test Registration
1. Click **"Register"** button
2. Fill in:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `password123`
3. Click **"Register"** button
4. **You should see**: "Registration successful!"
5. Click **"Login"**
6. Enter username and password
7. **You should see**: "Your Tasks" section

---

## ✅ VERIFICATION CHECKLIST

- [ ] Backend started on port 8081
- [ ] Frontend started on port 5173
- [ ] Browser opened to http://localhost:5173
- [ ] Registration successful
- [ ] Login successful
- [ ] Tasks page loading

---

## 🆘 IF YOU STILL GET CORS ERROR:

### Quick Fix #1: Clear Browser Cache
1. Press: `Ctrl+Shift+Delete` (Windows/Linux) or `Cmd+Shift+Delete` (Mac)
2. Check "Cached images and files"
3. Click "Clear data"

### Quick Fix #2: Hard Refresh
1. Press: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

### Quick Fix #3: Restart Everything
```bash
# Stop everything
pkill -9 java node

# Wait 2 seconds
sleep 2

# Start backend
cd /Users/imeylonganilla/Desktop/todo/backend
java -jar target/todo-0.0.1-SNAPSHOT.jar

# In new terminal, start frontend
cd /Users/imeylonganilla/Desktop/todo/frontend
npm run dev
```

### Quick Fix #4: Check Backend is Running
```bash
curl -s http://localhost:8081/api/login -X POST -H "Content-Type: application/json" -d '{}' 
```

Should return a JSON response (not an error).

### Quick Fix #5: Check CORS Headers
```bash
curl -v -X OPTIONS http://localhost:8081/api/register \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST"
```

Should show:
```
Access-Control-Allow-Origin: http://localhost:5173
```

---

## 📱 WHAT TO DO AFTER LOGIN

1. **Add Task**: Use the form to create a new task
2. **Mark Complete**: Click checkbox to mark task as done
3. **Delete Task**: Click "Delete" button to remove task
4. **Logout**: Click "Logout" to sign out

---

## 📊 CONFIGURATION SUMMARY

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | http://localhost:5173 | ✅ Ready |
| Backend | http://localhost:8081 | ✅ Ready |
| Database | ./data/todo-db | ✅ Ready |

---

## 🎯 SUMMARY

Everything is configured and ready. Just follow these steps:

1. **Backend**: `java -jar target/todo-0.0.1-SNAPSHOT.jar`
2. **Frontend**: `npm run dev`
3. **Browser**: Open http://localhost:5173
4. **Register**: Create an account
5. **Login**: Sign in
6. **Enjoy**: Create and manage tasks!

---

**That's it! Your TODO app is ready to use! 🎉**

