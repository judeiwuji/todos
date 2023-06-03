import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

export default async function error404(
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.render('errors/404.hbs', {
    page: {
      title: 'Unauthorized',
    },
  });
}
