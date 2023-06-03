import { NextFunction, Response } from 'express';
import IRequest from '../interfaces/IRequest';
import JWTUtil from '../utils/JWTUtil';

export default async function ensureAuthenticated(
  req: IRequest,
  res: Response,
  next: NextFunction
) {
  const session = req.cookies['session'];

  if (!session) {
    res.status(401).send('Unauthorized');
    return;
  }

  try {
    JWTUtil.verify({ token: session });
    next();
  } catch (error: any) {
    res.status(401).send('Unauthorized');
    console.log(error.message);
  }
}
