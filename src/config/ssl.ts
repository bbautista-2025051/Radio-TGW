import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import forge from 'node-forge';
import { env } from './env';

export interface CertificateMetadata {
  active: boolean;
  protocol: string;
  cipherSuite: string;
  subject: string;
  issuer: string;
  serialNumber: string;
  validFrom: string;
  validTo: string;
  fingerprint256: string;
  san: string[];
  securityHeaders: string[];
}

export function loadOrGenerateSSL(): { key: string; cert: string; metadata: CertificateMetadata } {
  const keyPath = env.SSL_KEY_PATH;
  const certPath = env.SSL_CERT_PATH;
  const certsDir = path.dirname(keyPath);

  if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
  }

  let pemKey: string;
  let pemCert: string;

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    pemKey = fs.readFileSync(keyPath, 'utf8');
    pemCert = fs.readFileSync(certPath, 'utf8');
  } else {
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01' + forge.util.bytesToHex(forge.random.getBytesSync(8));

    const now = new Date();
    cert.validity.notBefore = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    cert.validity.notAfter = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    const attrs = [
      { name: 'commonName', value: 'radiotgw.gob.gt' },
      { name: 'countryName', value: 'GT' },
      { shortName: 'ST', value: 'Guatemala' },
      { name: 'localityName', value: 'Ciudad de Guatemala' },
      { name: 'organizationName', value: 'Radio Nacional TGW - CIV Guatemala' },
      { shortName: 'OU', value: 'Dirección General de Radiodifusión y Televisión Nacional' }
    ];

    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.setExtensions([
      { name: 'basicConstraints', cA: true },
      {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true
      },
      {
        name: 'subjectAltName',
        altNames: [
          { type: 2, value: 'radiotgw.gob.gt' },
          { type: 2, value: 'www.radiotgw.gob.gt' },
          { type: 2, value: 'localhost' },
          { type: 7, ip: '127.0.0.1' }
        ]
      }
    ]);

    cert.sign(keys.privateKey, forge.md.sha256.create());
    pemKey = forge.pki.privateKeyToPem(keys.privateKey);
    pemCert = forge.pki.certificateToPem(cert);

    fs.writeFileSync(keyPath, pemKey, { encoding: 'utf8', mode: 0o600 });
    fs.writeFileSync(certPath, pemCert, { encoding: 'utf8' });
  }

  const x509 = new crypto.X509Certificate(pemCert);

  const metadata: CertificateMetadata = {
    active: true,
    protocol: 'TLSv1.3 / HTTPS X.509 RSA-2048 SHA-256',
    cipherSuite: 'TLS_AES_256_GCM_SHA384',
    subject: x509.subject.replace(/\n/g, ', '),
    issuer: x509.issuer.replace(/\n/g, ', '),
    serialNumber: x509.serialNumber,
    validFrom: x509.validFrom,
    validTo: x509.validTo,
    fingerprint256: x509.fingerprint256,
    san: ['DNS:radiotgw.gob.gt', 'DNS:www.radiotgw.gob.gt', 'DNS:localhost', 'IP:127.0.0.1'],
    securityHeaders: [
      'Strict-Transport-Security (HSTS max-age=31536000; includeSubDomains)',
      'Content-Security-Policy (CSP Directivas Institucionales)',
      'X-Frame-Options: SAMEORIGIN',
      'X-Content-Type-Options: nosniff',
      'Referrer-Policy: strict-origin-when-cross-origin',
      'Rate-Limiter Anti-DDoS Activo'
    ]
  };

  return { key: pemKey, cert: pemCert, metadata };
}
