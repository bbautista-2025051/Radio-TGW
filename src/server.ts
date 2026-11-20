import express from 'express';
import http from 'http';
import https from 'https';
import path from 'path';
import { env } from './config/env';
import { loadOrGenerateSSL } from './config/ssl';
import { applySecurityMiddlewares } from './middlewares/security.middleware';
import { errorHandler } from './middlewares/error.middleware';
import newsRoutes from './routes/news.routes';
import portalRoutes from './routes/portal.routes';
import { prisma } from './database/prisma';

const app = express();

applySecurityMiddlewares(app);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Archivos estáticos del Portal TGW
const publicDir = path.resolve(process.cwd(), 'public');
app.use(express.static(publicDir));

// Rutas REST API con Prisma
app.use('/api/news', newsRoutes);
app.use('/api/portal', portalRoutes);

// Healthcheck y estado de seguridad
app.get('/api/health', (_req, res) => {
  const { metadata } = loadOrGenerateSSL();
  res.json({
    status: 'ok',
    service: 'Radio Nacional TGW - La Voz de Guatemala (107.3 FM • 107.5 FM)',
    database: 'Prisma ORM Connected',
    ssl: metadata
  });
});

// Fallback SPA hacia index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.use(errorHandler);

function startServers() {
  const { key, cert, metadata } = loadOrGenerateSSL();

  const httpServer = http.createServer(app);
  httpServer.listen(env.PORT, () => {
    console.log(`📻 [Radio TGW HTTP]  Portal disponible en: http://localhost:${env.PORT}`);
  });

  const httpsServer = https.createServer({ key, cert }, app);
  httpsServer.listen(env.HTTPS_PORT, () => {
    console.log(`🔒 [Radio TGW HTTPS] Servidor Seguro SSL/TLS activo en: https://localhost:${env.HTTPS_PORT}`);
    console.log(`🛡️  Certificado X.509 SHA-256 Fingerprint: ${metadata.fingerprint256}`);
  });

  const shutdown = async () => {
    console.log('\nCerrando servidores y desconectando Prisma...');
    await prisma.$disconnect();
    httpServer.close();
    httpsServer.close();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServers();
