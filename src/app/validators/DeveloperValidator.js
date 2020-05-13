import { celebrate, Segments, Joi } from 'celebrate';
import ObjectId from 'joi-objectid';

Joi.objectId = ObjectId(Joi);

export default celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.objectId(),
  }),
  [Segments.BODY]: Joi.object()
    .keys({
      code: Joi.string(),
      latitude: Joi.number(),
      longitude: Joi.number(),
      techs: Joi.string(),
      name: Joi.string(),
      bio: Joi.string(),
      avatar_url: Joi.string().uri(),
    })
    .when(Joi.object({ code: Joi.exist() }).unknown(), {
      then: Joi.object({
        latitude: Joi.required(),
        longitude: Joi.required(),
        techs: Joi.required(),
      }),
    })
    .when(Joi.object({ latitude: Joi.exist() }).unknown(), {
      then: Joi.object({
        code: Joi.required(),
        techs: Joi.required(),
        longitude: Joi.required(),
      }),
    })
    .when(Joi.object({ longitude: Joi.exist() }).unknown(), {
      then: Joi.object({
        code: Joi.required(),
        techs: Joi.required(),
        latitude: Joi.required(),
      }),
    }),
});
