import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  PORT: parseInt(process.env.PORT || '3000', 10),
  HTTPS_PORT: parseInt(process.env.HTTPS_PORT || '3443', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  SSL_KEY_PATH: path.resolve(process.cwd(), process.env.SSL_KEY_PATH || './certs/server.key'),
  SSL_CERT_PATH: path.resolve(process.cwd(), process.env.SSL_CERT_PATH || './certs/server.cert'),
  EXCHANGE_RATE_GTQ: process.env.EXCHANGE_RATE_GTQ || '7.72',
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,https://localhost:3443')
    .split(',')
    .map((o) => o.trim())
};
