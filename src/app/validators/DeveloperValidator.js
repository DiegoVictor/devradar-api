import { Joi, celebrate, Segments } from 'celebrate';

export default {
  store: celebrate({
    [Segments.BODY]: Joi.object().keys({
      code: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      techs: Joi.string().required(),
    }),
  }),
  update: celebrate({
    [Segments.BODY]: Joi.object().keys({
      latitude: Joi.number(),
      longitude: Joi.number(),
      techs: Joi.string(),
      name: Joi.string(),
      bio: Joi.string(),
      avatar_url: Joi.string().uri(),
    }),
  }),
};
