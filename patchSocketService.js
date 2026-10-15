const fs = require('fs');

const socketServiceCode = `
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
  ioInstance.to(\`user_\${userId}\`).emit(event, payload);
};
`;

fs.writeFileSync('server/services/socket.service.js', socketServiceCode);
console.log("Updated socket.service.js to real implementation");
