import { Schema, model } from 'mongoose';

export default model(
  'Connection',
  new Schema({
    socket_id: String,
    location: {
      type: new Schema({
        type: {
          type: String,
          enum: ['Point'],
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      }),
      index: '2dsphere',
    },
    techs: [String],
  })
);
