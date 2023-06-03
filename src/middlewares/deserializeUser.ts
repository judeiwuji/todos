import { NextFunction, Request, Response } from 'express';
import IRequest from '../interfaces/IRequest';
import JWTUtil from '../utils/JWTUtil';
import UserService from '../services/UserService';

export default async function deserializeUser(
  req: IRequest,
  res: Response,
  next: NextFunction
) {
  const session = req.cookies['session'];

  if (session) {
    try {
      const jwtData = JWTUtil.decode(session);
      const userService = new UserService();
      req.user = await userService.findUserBy({ id: jwtData.user });
    } catch (error) {
      console.debug(error);
    }
  }
  next();
}
