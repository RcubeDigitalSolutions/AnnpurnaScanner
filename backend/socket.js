const { Server } = require('socket.io');

const createOriginValidator = (allowedOrigins) => (origin, callback) => {
  if (process.env.NODE_ENV !== 'production') return callback(null, true);
  if (!origin) return callback(null, true);
  const normalizedOrigin = String(origin).trim().replace(/\/$/, '');
  if (allowedOrigins.includes(normalizedOrigin)) return callback(null, true);
  return callback(new Error('Socket CORS origin not allowed'));
};

const setupSocket = (httpServer, allowedOrigins) => {
  const io = new Server(httpServer, {
    cors: {
      origin: createOriginValidator(allowedOrigins),
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('join:restaurant', (restaurantId) => {
      if (!restaurantId) return;
      socket.join(`restaurant:${restaurantId}`);
    });

    socket.on('leave:restaurant', (restaurantId) => {
      if (!restaurantId) return;
      socket.leave(`restaurant:${restaurantId}`);
    });

    socket.on('join:order', (orderId) => {
      if (!orderId) return;
      socket.join(`order:${orderId}`);
    });

    socket.on('leave:order', (orderId) => {
      if (!orderId) return;
      socket.leave(`order:${orderId}`);
    });
  });

  return io;
};

const emitOrderCreated = (io, order) => {
  if (!io || !order) return;
  const restaurantId = String(order.restaurant || '');
  const orderId = String(order._id || '');
  const payload = { order };
  if (restaurantId) io.to(`restaurant:${restaurantId}`).emit('order:created', payload);
  if (orderId) io.to(`order:${orderId}`).emit('order:updated', payload);
};

const emitOrderUpdated = (io, order) => {
  if (!io || !order) return;
  const restaurantId = String(order.restaurant || '');
  const orderId = String(order._id || '');
  const payload = { order };
  if (restaurantId) io.to(`restaurant:${restaurantId}`).emit('order:updated', payload);
  if (orderId) io.to(`order:${orderId}`).emit('order:updated', payload);
};

module.exports = {
  setupSocket,
  emitOrderCreated,
  emitOrderUpdated,
};
