import { Request, Response } from 'express';
import axios from 'axios';
import AppConfig from '../config/AppConfig';
import UserService from '../services/UserService';
import AlreadyExistsError from '../models/errors/AlreadyExistsError';
import crypto from 'crypto';
import JWTUtil from '../utils/JWTUtil';

export default class AuthController {
  static getLoginPage(req: Request, res: Response) {
    res.render('login', {
      page: {
        title: `Login - ${AppConfig.appName}`,
        description: 'Login to get access to your todos',
      },
    });
  }

  static getAuthLoginPage(req: Request, res: Response) {
    res.redirect(
      307,
      `${process.env.AUTH_HOST}/login?client=${process.env.AUTH_CLIENT_ID}`
    );
  }

  static async login(req: Request, res: Response) {
    try {
      const response = await axios.get(
        `${process.env.AUTH_HOST}/users/public/profile`,
        {
          headers: {
            Authorization: `Bearer ${req.query.code}`,
            'x-secret': process.env.AUTH_SECRET,
          },
        }
      );

      if (response.status !== 200) {
        req.flash('error', response.statusText);
        res.redirect('/login');
        return;
      }

      const userService = new UserService();
      const user = await userService.createUser(response.data);
      const session = JWTUtil.sign({
        payload: { user: user.id },
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
      });
      res.cookie('session', session, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      });
      res.redirect('/dashboard');
    } catch (error: any) {
      req.flash('error', error.message);
      res.redirect('/login');
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie('session');
    res.redirect('/');
  }
}
