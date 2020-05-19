import socketio from 'socket.io';

import Connection from './app/models/Connection';
import parseStringAsArray from './app/helpers/parseStringAsArray';

let io;

export function setupWebSocket(server) {
  io = socketio(server);

  io.on('connection', async socket => {
    const { latitude, longitude, techs } = socket.handshake.query;

    socket.on('disconnect', async () => {
      await Connection.findOneAndDelete({ socket_id: socket.id });
    });

    await Connection.create({
      socket_id: socket.id,
      location: {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)],
      },
      techs: parseStringAsArray(techs),
    });
  });
}

export function emit(socket_id, message, data) {
  io.to(socket_id).emit(message, data);
}
