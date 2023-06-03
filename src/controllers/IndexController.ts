import { Response } from 'express';
import IRequest from '../interfaces/IRequest';

export default class IndexController {
  static getHomePage(req: IRequest, res: Response) {
    res.render('index', {
      page: {
        title: 'Todo',
        description: 'A Todo List application',
      },
      path: req.path,
      isLoggedIn: !!req.user,
    });
  }
}
