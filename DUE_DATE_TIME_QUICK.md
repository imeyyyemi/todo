# ⏰📅 DUE DATE & TIME - QUICK START

## What's New

Tasks now support due dates and times! ⏰

## Add Due Date & Time to Task

1. Click "Add New Task"
2. Fill in:
   - **Task Title** ✓ (required)
   - **Description** (optional)
   - **Due Date** (optional) - Pick from calendar
   - **Due Time** (optional) - Pick time
3. Click "Create"

## View Due Date & Time

Tasks display:
```
Task Title
Description
📅 2025-12-25 ⏰ 14:30
```

## Edit Due Date & Time

1. Click task Edit button
2. Update date/time
3. Click "Update"

## Start Your App

```bash
# Kill processes
pkill -9 java node

# Terminal 1: Backend
cd /Users/imeylonganilla/Desktop/todo/backend
mvn clean package -DskipTests
java -jar target/todo-0.0.1-SNAPSHOT.jar

# Terminal 2: Frontend
cd /Users/imeylonganilla/Desktop/todo/frontend
npm run dev
```

## Test Flow

1. Login
2. Add new task with due date/time
3. See date/time display on task
4. Edit task to update date/time
5. Tasks without dates still work!

---

**Tasks now have deadlines!** ⏰📅

