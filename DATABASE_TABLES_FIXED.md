# 🔧 DATABASE TABLE NOT FOUND - FIXED

## 🎯 The Problem

You got this error:
```
Table "USERS" not found (this database is empty)
Registration failed: could not prepare statement
```

**Why:** The database tables were never created. Hibernate/JPA needs to be configured to auto-create tables from your entity models.

## ✅ The Solution

Added two critical properties to `application.properties`:

```properties
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false
```

**What this does:**
- `ddl-auto=create-drop` - Automatically creates tables from @Entity classes on startup
- `show-sql=false` - Prevents SQL logging (keep it off for performance)

## 🚀 NOW DO THIS:

### Step 1: Kill All Processes
```bash
pkill -9 java node
```

### Step 2: Delete Old Database
```bash
rm -f /Users/imeylonganilla/Desktop/todo/data/todo-db.*
```

This is important because `create-drop` mode recreates tables on each startup.

### Step 3: Rebuild Backend
```bash
cd /Users/imeylonganilla/Desktop/todo/backend
mvn clean package -DskipTests
```

**Wait for:** `BUILD SUCCESS`

### Step 4: Start Backend (Terminal 1)
```bash
java -jar target/todo-0.0.1-SNAPSHOT.jar
```

**Wait for:** `Started TodoApplication in...`

You should now see Hibernate creating tables:
```
Hibernate: create table tasks (...)
Hibernate: create table users (...)
```

### Step 5: Start Frontend (Terminal 2)
```bash
cd /Users/imeylonganilla/Desktop/todo/frontend
npm run dev
```

**Wait for:** `Local: http://localhost:5173`

### Step 6: Test Registration
1. Open: http://localhost:5173
2. Click "Register"
3. Enter:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `password123`
4. Click "Register"
5. ✅ **Should see: "Registration successful!"**
6. Click "Login"
7. Enter username and password
8. ✅ **Should see: "Your Tasks" section**

## 📝 What Changed

**File:** `application.properties`

**Added:**
```properties
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false
```

## ✨ How It Works

1. **On startup:** Hibernate reads your @Entity classes (User.java, Task.java)
2. **Creates tables:** Automatically creates `USERS` and `TASKS` tables with proper schema
3. **Sets up relationships:** Foreign keys, constraints, indexes
4. **Ready to use:** Database is now empty but with proper tables

## 🎉 Ready to Test!

Everything is now configured correctly:
- ✅ Tables will be auto-created
- ✅ User and Task entities mapped
- ✅ Database relationships set up
- ✅ Registration can save users
- ✅ Login can find users

---

**Follow the steps above to rebuild, start, and test registration!** 🎉

