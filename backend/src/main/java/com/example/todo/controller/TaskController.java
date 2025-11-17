package com.example.todo.controller;

import com.example.todo.model.Task;
import com.example.todo.model.User;
import com.example.todo.repository.TaskRepository;
import com.example.todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @Autowired
    private TaskRepository taskRepo;
    @Autowired
    private UserRepository userRepo;

    // Helper method to extract username from Authorization header token
    private String extractUsernameFromToken(String token) {
        if (token != null && token.startsWith("jwt-token-")) {
            return token.substring("jwt-token-".length());
        }
        throw new RuntimeException("Invalid token format");
    }

    @GetMapping
    public ResponseEntity<?> getAllTasks(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Authorization header required"));
            }

            String token = authHeader.substring("Bearer ".length());
            String username = extractUsernameFromToken(token);

            User user = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Task> userTasks = taskRepo.findByUser(user);
            return ResponseEntity.ok(userTasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: " + e.getMessage()));
        }
    }

    @GetMapping("/{username}")
    public List<Task> getTasks(@PathVariable String username) {
        User user = userRepo.findByUsername(username).orElseThrow();
        return taskRepo.findByUser(user);
    }

    @PostMapping
    public ResponseEntity<?> addTask(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Task task) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Authorization header required"));
            }

            String token = authHeader.substring("Bearer ".length());
            String username = extractUsernameFromToken(token);

            User user = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            task.setUser(user);
            Task savedTask = taskRepo.save(task);
            return ResponseEntity.ok(savedTask);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: " + e.getMessage()));
        }
    }

    @PostMapping("/{username}")
    public ResponseEntity<?> addTaskForUser(@PathVariable String username, @RequestBody Task task) {
        User user = userRepo.findByUsername(username).orElseThrow();
        task.setUser(user);
        Task savedTask = taskRepo.save(task);
        return ResponseEntity.ok(savedTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Task task) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Authorization header required"));
            }

            Task t = taskRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Task not found"));

            String token = authHeader.substring("Bearer ".length());
            String username = extractUsernameFromToken(token);

            User user = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Verify task belongs to user
            if (!t.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body(Map.of("message", "Unauthorized: This task does not belong to you"));
            }

            if (task.getTitle() != null) t.setTitle(task.getTitle());
            if (task.getDescription() != null) t.setDescription(task.getDescription());
            t.setCompleted(task.isCompleted());
            Task updatedTask = taskRepo.save(t);
            return ResponseEntity.ok(updatedTask);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Authorization header required"));
            }

            Task t = taskRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Task not found"));

            String token = authHeader.substring("Bearer ".length());
            String username = extractUsernameFromToken(token);

            User user = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Verify task belongs to user
            if (!t.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body(Map.of("message", "Unauthorized: This task does not belong to you"));
            }

            taskRepo.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Task deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: " + e.getMessage()));
        }
    }
}

