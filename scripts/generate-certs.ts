import fs from 'fs';
import path from 'path';
import forge from 'node-forge';

export function ensureSecurityCertificates(
  keyPath = path.resolve(process.cwd(), 'certs/server.key'),
  certPath = path.resolve(process.cwd(), 'certs/server.cert')
): { key: string; cert: string } {
  const certsDir = path.dirname(keyPath);
  if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
  }

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return {
      key: fs.readFileSync(keyPath, 'utf8'),
      cert: fs.readFileSync(certPath, 'utf8')
    };
  }

  console.log('🔐 Generando certificados de seguridad SSL/TLS X.509 (RSA 2048 / SHA-256) para Radio Nacional TGW...');

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
    { name: 'organizationName', value: 'Radio Nacional TGW - Ministerio de Comunicaciones, Infraestructura y Vivienda (CIV)' },
    { shortName: 'OU', value: 'Dirección General de Radiodifusión y Televisión Nacional' }
  ];

  cert.setSubject(attrs);
  cert.setIssuer(attrs);

  cert.setExtensions([
    {
      name: 'basicConstraints',
      cA: true
    },
    {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    },
    {
      name: 'extKeyUsage',
      serverAuth: true,
      clientAuth: true
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

  const pemKey = forge.pki.privateKeyToPem(keys.privateKey);
  const pemCert = forge.pki.certificateToPem(cert);

  fs.writeFileSync(keyPath, pemKey, { encoding: 'utf8', mode: 0o600 });
  fs.writeFileSync(certPath, pemCert, { encoding: 'utf8' });

  console.log(`✅ Certificados SSL generados correctamente en:\n   - Key:  ${keyPath}\n   - Cert: ${certPath}`);
  return { key: pemKey, cert: pemCert };
}

if (require.main === module) {
  ensureSecurityCertificates();
}
