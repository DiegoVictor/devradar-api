import { celebrate, Segments, Joi } from 'celebrate';

export default celebrate({
  [Segments.QUERY]: Joi.object().keys({
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
    techs: Joi.string().required(),
  }),
});
