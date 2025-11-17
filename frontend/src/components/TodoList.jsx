import React, { useEffect, useState } from 'react';
import {
  Container,
  CssBaseline,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Grid,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';

function TodoList({ token, username, onLogout, onProfileClick }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', dueDate: '', dueTime: '' });
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8081/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setTasks(Array.isArray(data) ? data : []);
      else setError(data.message || 'Failed to fetch tasks.');
    } catch {
      setError('Network error.');
    }
    setLoading(false);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', dueDate: '', dueTime: '' });
    setOpenDialog(true);
  };

  const handleEditClick = (task) => {
    setEditingId(task.id);
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate || '',
      dueTime: task.dueTime || ''
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFormData({ title: '', description: '', dueDate: '', dueTime: '' });
  };

  const handleSaveTask = async () => {
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      let res;
      if (editingId) {
        res = await fetch(`http://localhost:8081/api/tasks/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch('http://localhost:8081/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      const data = await res.json();
      if (res.ok) {
        fetchTasks();
        handleDialogClose();
        setError('');
      } else {
        setError(data.message || 'Failed to save task.');
      }
    } catch {
      setError('Network error.');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const res = await fetch(`http://localhost:8081/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...task, completed: !task.completed }),
      });

      if (res.ok) {
        fetchTasks();
      } else {
        setError('Failed to update task.');
      }
    } catch {
      setError('Network error.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const res = await fetch(`http://localhost:8081/api/tasks/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          fetchTasks();
          setError('');
        } else {
          setError('Failed to delete task.');
        }
      } catch {
        setError('Network error.');
      }
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const remainingCount = tasks.length - completedCount;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            📋 My Tasks
          </Typography>
          <Typography variant="body2" sx={{ mr: 2, fontWeight: 500 }}>
            {username}
          </Typography>
          <IconButton
            color="inherit"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ ml: 2 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#42a5f5' }}>
              {username.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem disabled>
              <Typography variant="body2">@{username}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                onProfileClick();
              }}
            >
              <AccountCircleIcon sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                onLogout();
              }}
            >
              <LogoutIcon sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sx={{ sm: 6, md: 4 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Total Tasks
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {tasks.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sx={{ sm: 6, md: 4 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Completed
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {completedCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sx={{ sm: 6, md: 4 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  Remaining
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {remainingCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Add Task Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            size="large"
            sx={{ fontWeight: 600 }}
          >
            Add New Task
          </Button>
        </Box>

        {/* Tasks List */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : tasks.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#fff' }}>
            <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
              No tasks yet. Create one to get started! 🚀
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
            >
              Create Your First Task
            </Button>
          </Paper>
        ) : (
          <Card>
            <List>
              {tasks.map((task, index) => (
                <React.Fragment key={task.id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEditClick(task)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDelete(task.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                    sx={{
                      bgcolor: task.completed ? '#f0f7ff' : 'transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': { bgcolor: '#f5f5f5' },
                    }}
                  >
                    <ListItemButton
                      role={undefined}
                      onClick={() => handleToggleComplete(task)}
                      dense
                      sx={{ flexGrow: 0, mr: 2, p: 0 }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {task.completed ? (
                          <CheckCircleIcon sx={{ color: 'success.main' }} />
                        ) : (
                          <RadioButtonUncheckedIcon />
                        )}
                      </ListItemIcon>
                    </ListItemButton>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? 'text.secondary' : 'text.primary',
                            fontWeight: 500,
                          }}
                        >
                          {task.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {task.description}
                          </Typography>
                          {(task.dueDate || task.dueTime) && (
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                              📅 {task.dueDate} {task.dueTime ? `⏰ ${task.dueTime}` : ''}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    {task.completed && (
                      <Chip label="Completed" size="small" color="success" variant="outlined" />
                    )}
                  </ListItem>
                  {index < tasks.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        )}
      </Container>

      {/* Add/Edit Task Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingId ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Task Title"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description (optional)"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="dueDate"
            label="Due Date (optional)"
            type="date"
            fullWidth
            variant="outlined"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="dueTime"
            label="Due Time (optional)"
            type="time"
            fullWidth
            variant="outlined"
            value={formData.dueTime}
            onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveTask} variant="contained">
            {editingId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TodoList;

