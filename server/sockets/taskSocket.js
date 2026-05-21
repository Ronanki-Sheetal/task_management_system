/**
 * Socket.IO event handlers for real-time task updates
 */
const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join user-specific room
    socket.on('join:user', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`👤 User ${userId} joined their room`);
    });

    // Join admin room
    socket.on('join:admin', () => {
      socket.join('admin');
      console.log(`🛡️  Admin joined admin room`);
    });

    // Task drag-drop status change from Kanban
    socket.on('task:move', (data) => {
      // Broadcast to all OTHER clients
      socket.broadcast.emit('task:moved', data);
    });

    // Typing indicator for comments
    socket.on('comment:typing', (data) => {
      socket.broadcast.to(`task:${data.taskId}`).emit('comment:typing', data);
    });

    // Join task room (for collaborative comments)
    socket.on('join:task', (taskId) => {
      socket.join(`task:${taskId}`);
    });

    socket.on('leave:task', (taskId) => {
      socket.leave(`task:${taskId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;
