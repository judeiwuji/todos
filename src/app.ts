const dateFormat = require('handlebars-dateformat');
import cookieParser from 'cookie-parser';
import connectFlash from 'connect-flash';
import express, { Application, Request, Response } from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import session from 'express-session';
import { config } from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import methodOverride from 'method-override';
import HandlebarsUtil from './utils/HandlebarsUtil';
import RouteManager from './routes/RouteManager';
import DB from './models/engine/DBStorage';
import deserializeUser from './middlewares/deserializeUser';
config();

class App {
  private app!: Application;
  private port = process.env.PORT || 5000;

  constructor() {
    DB.sync({ alter: false }).catch((error) => {
      console.log(error.message);
    });
    this.app = express();
    this.middlewares();
    this.locals();
    this.settings();
  }

  locals() {
    this.app.use((req, res, next) => {
      res.locals.info = req.flash('info');
      res.locals.error = req.flash('error');

      next();
    });
  }

  middlewares() {
    this.app.use(morgan('dev'));
    this.app.use(express.static(path.join(__dirname, '..', 'public')));
    this.app.use(express.json({ limit: '20mb' }));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(
      methodOverride((req: Request, res: Response) => {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
          // look in urlencoded POST bodies and delete it
          var method = req.body._method;
          delete req.body._method;
          return method;
        }
      })
    );
    this.app.use(cookieParser(process.env.COOKIE_SECRET));
    this.app.use(
      session({
        secret: process.env.SESSION_SECRET as string,
        saveUninitialized: false,
        resave: false,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24,
        },
      })
    );
    this.app.use(connectFlash());
    this.app.use(cors({ origin: '*' }));
    this.app.engine(
      'hbs',
      engine({
        extname: 'hbs',
        helpers: {
          dateFormat,
          eq: HandlebarsUtil.eq,
          math: HandlebarsUtil.math,
          not: HandlebarsUtil.not,
        },
      })
    );
    const viewsPath = path.join(__dirname, '..', 'views');
    this.app.set('view engine', 'hbs');
    this.app.set('views', viewsPath);
    this.app.use(deserializeUser);
  }

  settings() {
    new RouteManager(this.app);
    this.app.listen(this.port, () => {
      console.log(`App is running on port ::${this.port}`);
    });
  }
}

function main() {
  const app = new App();
}

if (require.main === module) {
  main();
}
