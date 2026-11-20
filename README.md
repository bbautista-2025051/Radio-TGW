# Radio Nacional TGW — La Voz de Guatemala (107.3 FM • 107.5 FM)

Portal web oficial reestructurado y escalable para **Radio Nacional TGW «La Voz de Guatemala»** (Ministerio de Comunicaciones, Infraestructura y Vivienda - CIV), construido con **TypeScript, Node.js, JavaScript, SCSS, CSS, HTML, Prisma ORM** y **Certificados de Seguridad SSL/TLS X.509** listos para entorno de producción.

## 🏗️ Estructura Escalable del Proyecto

```text
Radio-TGW/
├── certs/                          # Certificados criptográficos SSL/TLS X.509 (server.key, server.cert)
├── prisma/
│   ├── schema.prisma               # Modelos relacionales: News, CulturalEvent, RadioProgram, HistoricalArchive, ProcedureSubmission, CitizenReport
│   └── seed.ts                     # Semilla oficial con noticias de Radio TGW, programación FM/TV, agenda cultural y archivo Huellas W
├── scripts/
│   └── generate-certs.ts           # Generador automatizado de certificados SSL/TLS RSA-2048 SHA-256
├── src/
│   ├── config/
│   │   ├── env.ts                  # Variables de entorno tipadas
│   │   └── ssl.ts                  # Cargador y verificador criptográfico de certificados X.509
│   ├── controllers/
│   │   ├── news.controller.ts      # API REST de Noticias W, filtros y validación de OpiniónW por Dirección General
│   │   └── portal.controller.ts    # API REST de Agenda Cultural, Programación W, Huellas W, Trámites y Voz Ciudadana
│   ├── database/
│   │   └── prisma.ts               # Instancia Singleton de PrismaClient
│   ├── middlewares/
│   │   ├── security.middleware.ts  # Helmet (HSTS, CSP, X-Frame-Options), CORS, Rate Limiting anti-DDoS y compresión
│   │   └── error.middleware.ts     # Manejo centralizado de errores
│   ├── routes/
│   │   ├── news.routes.ts          # Endpoints /api/news
│   │   └── portal.routes.ts        # Endpoints /api/portal
│   ├── services/
│   │   └── news.service.ts         # Lógica de negocio de noticias y categorías
│   └── server.ts                   # Servidor dual HTTP (3000) y HTTPS Seguro (3443)
├── styles/
│   ├── _variables.scss             # Tokens de diseño institucional y modo oscuro
│   ├── _header.scss                # Cabecera con live badge pulsante, barras de AL AIRE en movimiento y logos TGW/CIV
│   ├── _navigation.scss            # Menú lateral de 3 líneas (Sobre nosotros, Historia, Misión, Visión, Valores) y Pestañas
│   ├── _sections.scss              # Estilos de secciones, tarjetas, SINACIG y modales
│   └── main.scss                   # Entrada principal SCSS
└── public/
    ├── index.html                  # Portal semántico HTML5
    ├── css/main.css                # Hoja de estilos CSS compilada desde SCSS
    └── js/app.js                   # Cliente interactivo JavaScript
```

## 🚀 Instalación y Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Generar certificados SSL, inicializar base de datos Prisma, poblar noticias TGW y compilar SCSS + TypeScript
npm run setup

# 3. Iniciar servidor en desarrollo (TypeScript directo) o producción (compilado)
npm run dev
# o
npm start
```

- **Portal HTTP**: `http://localhost:3000`
- **Portal HTTPS Seguro (SSL/TLS X.509)**: `https://localhost:3443`
