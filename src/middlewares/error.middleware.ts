import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error('[TGW Error Handler]:', err.message);
  res.status(500).json({
    status: 'error',
    message: 'Error interno en el servidor de Radio Nacional TGW',
    detail: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}
