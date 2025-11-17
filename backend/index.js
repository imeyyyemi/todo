const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const PORT = 3001;
const USERS_FILE = 'users_confi.txt';
const TASKS_FILE = 'tasks_confi.txt';
const JWT_SECRET = 'your_jwt_secret';

app.use(cors());
app.use(express.json());

// Helper functions for file-based storage
function readFile(file) {
  if (!fs.existsSync(file)) return [];
  const data = fs.readFileSync(file, 'utf-8');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}
function writeFile(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Register endpoint
app.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const users = readFile(USERS_FILE);
  if (users.find(u => u.username === username || u.email === email)) {
    return res.status(409).json({ message: 'User already exists.' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, username, password: hashedPassword });
  writeFile(USERS_FILE, users);
  res.status(201).json({ message: 'User registered successfully.' });
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readFile(USERS_FILE);
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials.' });
  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Auth middleware
function authenticate(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ message: 'No token provided.' });
  const token = auth.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    req.user = user;
    next();
  });
}

// Create Task
app.post('/tasks', authenticate, (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required.' });
  const tasks = readFile(TASKS_FILE);
  const id = Date.now().toString();
  const task = { id, username: req.user.username, title, description: description || '', completed: false };
  tasks.push(task);
  writeFile(TASKS_FILE, tasks);
  res.status(201).json(task);
});

// Read Tasks
app.get('/tasks', authenticate, (req, res) => {
  const tasks = readFile(TASKS_FILE).filter(t => t.username === req.user.username);
  res.json(tasks);
});

// Update Task
app.put('/tasks/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  const tasks = readFile(TASKS_FILE);
  const task = tasks.find(t => t.id === id && t.username === req.user.username);
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (completed !== undefined) task.completed = completed;
  writeFile(TASKS_FILE, tasks);
  res.json(task);
});

// Delete Task
app.delete('/tasks/:id', authenticate, (req, res) => {
  const { id } = req.params;
  let tasks = readFile(TASKS_FILE);
  const initialLength = tasks.length;
  tasks = tasks.filter(t => !(t.id === id && t.username === req.user.username));
  if (tasks.length === initialLength) return res.status(404).json({ message: 'Task not found.' });
  writeFile(TASKS_FILE, tasks);
  res.json({ message: 'Task deleted.' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

