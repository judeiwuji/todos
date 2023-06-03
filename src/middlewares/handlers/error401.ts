import { NextFunction, Request, Response } from 'express';

export default async function error401(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(err);
  res.render('errors/401.hbs', {
    page: {
      title: 'Unauthorized',
    },
  });
}
