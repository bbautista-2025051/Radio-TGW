import { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { env } from '../config/env';

export function applySecurityMiddlewares(app: Express): void {
  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
          imgSrc: ["'self'", 'data:', 'https://images.unsplash.com', 'https://*.radiotgw.gob.gt'],
          mediaSrc: ["'self'", 'https:', 'http:', 'blob:'],
          connectSrc: ["'self'", 'https:', 'http:'],
          upgradeInsecureRequests: null
        }
      },
      crossOriginEmbedderPolicy: false,
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    })
  );

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || env.ALLOWED_ORIGINS.includes(origin) || origin.includes('localhost')) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true
    })
  );

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 'error',
      message: 'Límite de solicitudes excedido por políticas de seguridad. Intente nuevamente en unos minutos.'
    }
  });

  app.use('/api', apiLimiter);
  app.use(compression());

  // Sanitización básica de cabeceras y trazabilidad de seguridad institucional
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Institutional-Security', 'TGW-CIV-SSL-Verified');
    res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
    next();
  });
}
