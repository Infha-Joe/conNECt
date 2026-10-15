
let ioInstance;

export const setIO = (io) => {
  ioInstance = io;
};

export const getIO = () => {
  if (!ioInstance) throw new Error("Socket.IO not initialized yet");
  return ioInstance;
};

export const emitToUser = (userId, event, payload) => {
  if (!ioInstance) return;
  ioInstance.to(`user_${userId}`).emit(event, payload);
};
