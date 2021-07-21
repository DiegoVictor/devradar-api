import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { badRequest, unauthorized } from '@hapi/boom';

export default async (req, _, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw badRequest('Missing authorization token', { code: 240 });
  }

  const [, token] = authorization.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    req.id = decoded.id;

    return next();
  } catch (err) {
    throw unauthorized('Token expired or invalid', 'sample', { code: 241 });
  }
};
