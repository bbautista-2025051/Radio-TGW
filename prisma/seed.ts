import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando carga de base de datos de Radio Nacional TGW...');

  await prisma.news.deleteMany();
  await prisma.culturalEvent.deleteMany();
  await prisma.radioProgram.deleteMany();
  await prisma.historicalArchive.deleteMany();

  const newsData = [
    // GUATEMALA -> EJECUTIVO
    {
      slug: 'ejecutivo-civ-supervisan-rehabilitacion-red-vial-puentes',
      title: 'Ejecutivo y Ministerio de Comunicaciones supervisan avances en rehabilitación de red vial estratégica',
      summary: 'El Ministerio de Comunicaciones, Infraestructura y Vivienda (CIV) reportó avances significativos en el mantenimiento de rutas centroamericanas y puentes departamentales para garantizar el transporte seguro.',
      content: 'En cumplimiento del plan de fortalecimiento de la infraestructura nacional, autoridades del Organismo Ejecutivo junto al Ministerio de Comunicaciones, Infraestructura y Vivienda (CIV) realizaron una gira de supervisión técnica en los tramos carreteros estratégicos del país. Durante la jornada transmitida en directo por Radio Nacional TGW 107.3 FM, se detalló la intervención de puntos críticos, estabilización de taludes y rehabilitación de puentes clave para el comercio y la movilidad ciudadana.',
      category: 'GUATEMALA',
      subcategory: 'EJECUTIVO',
      author: 'Redacción Diario del Aire - TGW',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d09bb18086f6?auto=format&fit=crop&w=900&q=80',
      sourceUrl: 'https://radiotgw.gob.gt/category/noticias/nacionales/',
      isFeatured: true,
      directorValidated: true,
      views: 1420
    },
    {
      slug: 'ejecutivo-conectividad-digital-modernizacion-radiodifusion',
      title: 'Gobierno impulsa modernización tecnológica de las telecomunicaciones y cobertura radial del Estado',
      summary: 'A través del CIV y la Dirección General de Radiodifusión y Televisión Nacional, se amplía el alcance de las frecuencias 107.3 FM y 107.5 FM hacia comunidades rurales.',
      content: 'El Gobierno de la República reafirmó su compromiso con el acceso universal a la información veraz, cultural y educativa mediante el fortalecimiento técnico de Radio Nacional TGW «La Voz de Guatemala». El proyecto contempla la optimización de transmisores, enlaces digitales y plataformas de transmisión multipropósito que integran radio FM y televisión digital.',
      category: 'GUATEMALA',
      subcategory: 'EJECUTIVO',
      author: 'Unidad Informativa TGW',
      imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80',
      sourceUrl: 'https://radiotgw.gob.gt/category/noticias/nacionales/',
      isFeatured: true,
      directorValidated: true,
      views: 980
    },
    // GUATEMALA -> LEGISLATIVO
    {
      slug: 'legislativo-congreso-iniciativas-infraestructura-desarrollo',
      title: 'Congreso de la República avanza en discusión de iniciativas para infraestructura y desarrollo económico',
      summary: 'El Pleno del Organismo Legislativo conoció dictámenes técnicos orientados a dinamizar la inversión pública, conectividad vial y transparencia presupuestaria.',
      content: 'Durante la sesión ordinaria de esta semana, diputados del Congreso de la República abordaron en distintas lecturas los proyectos legislativos enfocados en la modernización de la infraestructura estratégica y el fortalecimiento de la fiscalización de los recursos públicos, con cobertura especial de los periodistas parlamentarios de Radio TGW.',
      category: 'GUATEMALA',
      subcategory: 'LEGISLATIVO',
      author: 'Corresponsalía Legislativa TGW',
      imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=900&q=80',
      sourceUrl: 'https://radiotgw.gob.gt/category/noticias/nacionales/',
      isFeatured: false,
      directorValidated: true,
      views: 760
    },
    {
      slug: 'legislativo-comision-cultura-patrimonio-sonoro',
      title: 'Comisión legislativa resalta preservación del Patrimonio Cultural y archivos históricos de la Nación',
      summary: 'Mesas técnicas parlamentarias evaluaron mecanismos de apoyo institucional para museos, fonotecas y centros culturales del país.',
      content: 'Con la participación de especialistas en gestión cultural, la Comisión de Cultura del Congreso destacó la importancia del Acuerdo Ministerial 459-2012 que declaró a Radio Nacional TGW como Patrimonio Cultural de la Nación, impulsando acciones para la digitalización permanente de la memoria sonora guatemalteca.',
      category: 'GUATEMALA',
      subcategory: 'LEGISLATIVO',
      author: 'Redacción Parlamentaria TGW',
      imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=900&q=80',
      sourceUrl: 'https://radiotgw.gob.gt/category/noticias/nacionales/',
      isFeatured: false,
      directorValidated: true,
      views: 530
    },
    // GUATEMALA -> JUDICIAL – MP
    {
      slug: 'judicial-mp-fortalecimiento-expediente-electronico-justicia',
      title: 'Organismo Judicial y Ministerio Público amplían plataformas digitales de atención y denuncia ciudadana',
      summary: 'La modernización de los servicios judiciales y fiscales permite agilizar trámites electrónicos, consultas procesales y seguimiento de casos a nivel nacional.',
      content: 'El sector justicia continúa implementando herramientas tecnológicas para acercar sus servicios a la población guatemalteca. Tanto el Organismo Judicial mediante sus tribunales conectados como el Ministerio Público a través de sus canales de atención permanente informaron en Diario del Aire sobre los avances en tiempos de respuesta y acceso a la justicia.',
      category: 'GUATEMALA',
      subcategory: 'JUDICIAL_MP',
      author: 'Sección Judicial W',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80',
      sourceUrl: 'https://radiotgw.gob.gt/category/noticias/nacionales/',
      isFeatured: false,
      directorValidated: true,
      views: 845
    },
    // GUATEMALA -> SEGURIDAD
    {
      slug: 'seguridad-gobernacion-pnc-operativos-prevencion-ciudadana',
      title: 'Ministerio de Gobernación y PNC refuerzan patrullajes combinados y seguridad en rutas nacionales',
      summary: 'Más de mil agentes policiales participan en operativos preventivos de seguridad ciudadana, control vial y combate frontal a las extorsiones.',
      content: 'El Ministerio de Gobernación, a través de la Policía Nacional Civil (PNC), desplegó operativos estratégicos en las principales arterias viales y centros urbanos del país. Los reportes emitidos en las frecuencias 107.3 y 107.5 FM de TGW orientan a la población sobre rutas seguras, números de emergencia y acciones de prevención comunitaria.',
      category: 'GUATEMALA',
      subcategory: 'SEGURIDAD',
      author: 'Unidad de Cobertura Nacional TGW',
      imageUrl: 'https://images.unsplash.com/photo-1453873531674-2151bcd01707?auto=format&fit=crop&w=900&q=80',
      sourceUrl: 'https://radiotgw.gob.gt/category/noticias/nacionales/',
      isFeatured: true,
      directorValidated: true,
      views: 1190
    },
    // GUATEMALA -> ELECCIONES 2027
    {
      slug: 'elecciones-2027-tse-jornadas-empadronamiento-formacion-civica',
      title: 'Rumbo a Elecciones 2027: TSE intensifica jornadas de empadronamiento y educación cívica nacional',
      summary: 'El Tribunal Supremo Electoral habilita puestos móviles en cabeceras departamentales y municipios para actualizar el padrón electoral con miras a los comicios de 2027.',
      content: 'Como parte de la preparación democrática hacia las Elecciones Generales 2027, el Tribunal Supremo Electoral (TSE) desarrolla campañas permanentes de empadronamiento y actualización de residencia electoral. Radio Nacional TGW acompaña este esfuerzo cívico difundiendo información verificada para fortalecer la participación ciudadana informada.',
      category: 'GUATEMALA',
      subcategory: 'ELECCIONES_2027',
      author: 'Mesa Electoral TGW 2027',
      imageUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=900&q=80',
      sourceUrl: 'https://radiotgw.gob.gt/category/noticias/nacionales/',
      isFeatured: false,
      directorValidated: true,
      views: 920
    },
    // CULTURA, ARTE Y MÚSICA
    {
      slug: 'cultura-chapinlandia-marimba-patrimonio-identidad-guatemala',
      title: 'Chapinlandia y las maderas que cantan: TGW exalta la marimba guatemalteca como emblema cultural',
      summary: 'Desde 1947, el emblemático programa Chapinlandia de Radio TGW lleva las notas de la marimba pura a los hogares guatemaltecos dentro y fuera de nuestras fronteras.',
      content: 'La música de marimba constituye el corazón sonoro de «La Voz de Guatemala». A través del histórico programa Chapinlandia y del Teatro de Bolsillo Mildred Chávez de Almorza, TGW promueve el talento de marimbistas, compositores y ensambles sinfónicos que preservan nuestra identidad nacional.',
      category: 'CULTURA',
      subcategory: 'CULTURA_ARTE_MUSICA',
      author: 'Cultura TGW',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80',
      sourceUrl: 'https://radiotgw.gob.gt/cultura-tgw/',
      isFeatured: true,
      directorValidated: true,
      views: 1640
    },
    {
      slug: 'cultura-museo-otto-rene-mancilla-fonoteca-patrimonio',
      title: 'Museo Histórico Otto René Mancilla abre recorridos guiados sobre los 96 años de la radio en Guatemala',
      summary: 'Estudiantes y familias visitan la histórica cabina de cristal Martha Bolaños de Prado y conocen micrófonos, consolas y discos de acetato de los años 30 y 40.',
      content: 'Ubicado en el tercer nivel del edificio de la Tipografía Nacional en la zona 1 capitalina, el Museo Histórico Otto René Mancilla de TGW ofrece una experiencia única por la evolución de la radiodifusión guatemalteca, exhibiendo joyas técnicas y grabaciones invaluables resguardadas en su Fonoteca.',
      category: 'CULTURA',
      subcategory: 'CULTURA_ARTE_MUSICA',
      author: 'Departamento Cultural TGW',
      imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=900&q=80',
      sourceUrl: 'https://radiotgw.gob.gt/cultura-tgw/',
      isFeatured: false,
      directorValidated: true,
      views: 870
    },
    // DEPORTES
    {
      slug: 'deportes-vuelta-ciclistica-guatemala-cobertura-tgw',
      title: 'Cobertura Deportiva TGW: Ciclismo guatemalteco brilla en etapas de alta montaña y pruebas internacionales',
      summary: 'El equipo deportivo de La Voz de Guatemala transmite kilómetro a kilómetro el desempeño de los escarabajos nacionales en las carreteras del país.',
      content: 'Con su tradicional despliegue técnico y humano, los narradores y comentaristas deportivos de Radio Nacional TGW 107.3 FM llevan la emoción del ciclismo, el fútbol nacional y el deporte olímpico guatemalteco a todos los rincones de la República.',
      category: 'DEPORTES',
      subcategory: 'DEPORTES',
      author: 'Deportes W',
      imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266013b?auto=format&fit=crop&w=900&q=80',
      sourceUrl: 'https://radiotgw.gob.gt/',
      isFeatured: true,
      directorValidated: true,
      views: 1120
    },
    {
      slug: 'deportes-atletas-guatemaltecos-destacan-marcha-badminton',
      title: 'Delegación guatemalteca suma preseas doradas en atletismo, marcha y bádminton regional',
      summary: 'Jóvenes deportistas del ciclo olímpico continúan poniendo en alto el nombre de Guatemala en torneos panamericanos y centroamericanos.',
      content: 'El deporte federado guatemalteco celebra una semana de triunfos internacionales gracias a la preparación constante de sus atletas. En entrevista con Deportes TGW, los medallistas agradecieron el respaldo de la afición nacional que sigue cada competencia a través de la radio pública.',
      category: 'DEPORTES',
      subcategory: 'DEPORTES',
      author: 'Redacción Deportiva TGW',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80',
      sourceUrl: 'https://radiotgw.gob.gt/',
      isFeatured: false,
      directorValidated: true,
      views: 740
    },
    // OPINIÓN W (Sujeta a validación del Director General de la radio)
    {
      slug: 'opinionw-radiodifusion-publica-identidad-ciudadania',
      title: 'OpiniónW: La radiodifusión pública como baluarte de la identidad nacional y el servicio ciudadano',
      summary: 'Análisis editorial sobre la misión histórica de TGW desde 1930 en la construcción de ciudadanía, educación y veracidad informativa.',
      content: 'Desde su fundación el 15 de septiembre de 1930 hasta la era digital actual, Radio Nacional TGW ha demostrado que un medio público fuerte es indispensable para cohesionar a la nación, preservar nuestros valores culturales y garantizar que la información veraz llegue desde la capital hasta las comunidades más lejanas. [Columna revisada y validada conforme a los lineamientos editoriales de la Dirección General de Radio Nacional TGW].',
      category: 'OPINION_W',
      subcategory: 'EDITORIAL_DG',
      author: 'Consejo Editorial TGW',
      imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=900&q=80',
      sourceUrl: 'https://radiotgw.gob.gt/',
      isFeatured: false,
      directorValidated: true,
      validatedBy: 'Validado por el Director General de Radio TGW',
      views: 685
    },
    {
      slug: 'opinionw-legado-miguel-angel-asturias-diario-del-aire',
      title: 'OpiniónW: Miguel Ángel Asturias y el Diario del Aire, ética periodística y sensibilidad poética',
      summary: 'Reflexión sobre cómo el Premio Nobel de Literatura transformó el periodismo radiofónico guatemalteco en 1937 desde los micrófonos de TGW.',
      content: 'Cuando en 1937 nació el Diario del Aire en el tercer nivel de la Tipografía Nacional, Miguel Ángel Asturias demostró que el periodismo radial podía conjugar el rigor informativo con la belleza del lenguaje y la filosofía humanista. Hoy, ese estándar ético inspira cada emisión de Noticieros W. [Columna validada por Dirección General].',
      category: 'OPINION_W',
      subcategory: 'EDITORIAL_DG',
      author: 'Dirección General / Cátedra Asturias TGW',
      imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
      sourceUrl: 'https://radiotgw.gob.gt/',
      isFeatured: false,
      directorValidated: true,
      validatedBy: 'Validado por el Director General de Radio TGW',
      views: 610
    },
    // NOTICIAS W INTERNACIONALES
    {
      slug: 'internacionales-uit-transicion-digital-radiodifusion-publica',
      title: 'UIT impulsa estándares globales de radiodifusión híbrida y resiliencia de telecomunicaciones ante emergencias',
      summary: 'La Unión Internacional de Telecomunicaciones destacó el papel irremplazable de las emisoras estatales en sistemas de alerta temprana y educación.',
      content: 'En su reciente foro internacional en Ginebra, la Unión Internacional de Telecomunicaciones (UIT) —organismo que en la década de 1920 asignó a Guatemala el prefijo TG— subrayó que la radio en frecuencia modulada combinada con streaming digital sigue siendo el medio más resiliente y confiable del planeta.',
      category: 'INTERNACIONALES',
      subcategory: 'MUNDO',
      author: 'Mesa Internacional W',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
      sourceUrl: 'https://radiotgw.gob.gt/category/noticias/internacionales/',
      isFeatured: false,
      directorValidated: true,
      views: 830
    },
    {
      slug: 'internacionales-unesco-proteccion-archivos-sonoros-patrimonio',
      title: 'UNESCO promueve cooperación iberoamericana para digitalizar fonotecas y archivos radiofónicos del siglo XX',
      summary: 'Emisoras públicas de América Latina comparten protocolos técnicos de restauración sonora para salvaguardar grabaciones históricas.',
      content: 'La Organización de las Naciones Unidas para la Educación, la Ciencia y la Cultura (UNESCO) anunció nuevas líneas de cooperación técnica para proteger colecciones fonográficas históricas, destacando el valor patrimonial de emisoras pioneras fundadas en la primera mitad del siglo XX como Radio Nacional TGW.',
      category: 'INTERNACIONALES',
      subcategory: 'MUNDO',
      author: 'Servicios Internacionales TGW',
      imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=900&q=80',
      sourceUrl: 'https://radiotgw.gob.gt/category/noticias/internacionales/',
      isFeatured: false,
      directorValidated: true,
      views: 590
    },
    // CURIOSIDADES
    {
      slug: 'curiosidades-origen-siglas-tgw-1930-julio-caballeros',
      title: '¿Por qué nuestra emisora se llama TGW? El origen del código internacional asignado a Guatemala',
      summary: 'En los años 20 la UIT asignó a Guatemala las letras "TG", y la primera estación fundada el 15 de septiembre de 1930 adoptó el distintivo "W".',
      content: 'Pocas personas conocen que las siglas TGW provienen del convenio de la Unión Internacional de Telecomunicaciones (UIT) de la década de 1920. A Guatemala le correspondió el prefijo "TG" para sus telecomunicaciones, y cuando Julio Caballeros de Paz impulsó la primera estación radial el 15 de septiembre de 1930 durante el gobierno de Lázaro Chacón, se le asignó la letra "W", dando vida a TGW: La Voz de Guatemala.',
      category: 'CURIOSIDADES',
      subcategory: 'HISTORIA_SONORA',
      author: 'Archivo Histórico TGW',
      imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=900&q=80',
      sourceUrl: 'https://radiotgw.gob.gt/cultura-tgw/',
      isFeatured: false,
      directorValidated: true,
      views: 1950
    },
    {
      slug: 'curiosidades-cabina-cristal-martha-bolanos-de-prado',
      title: 'Los secretos acústicos de la icónica Cabina de Cristal «Martha Bolaños de Prado»',
      summary: 'Diseñada en el tercer nivel de la Tipografía Nacional, fue escenario de estrenos musicales en vivo y de trascendentales anuncios históricos.',
      content: 'Construida tras el traslado de TGW al edificio de la Tipografía Nacional en 1937, la cabina de cristal bautizada en honor a la célebre actriz y soprano guatemalteca Martha Bolaños de Prado cuenta con paneles acústicos originales que permitieron transmitir conciertos completos de orquesta y marimba en vivo, además de ser testigo de mensajes históricos en las décadas de los 70 y 80.',
      category: 'CURIOSIDADES',
      subcategory: 'HISTORIA_SONORA',
      author: 'Museo Otto René Mancilla',
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=80',
      sourceUrl: 'https://radiotgw.gob.gt/cultura-tgw/',
      isFeatured: false,
      directorValidated: true,
      views: 1410
    }
  ];

  for (const item of newsData) {
    await prisma.news.create({ data: item });
  }

  // AGENDA CULTURAL
  const culturalEvents = [
    {
      title: 'Gala de Marimba de Concierto en el Teatro de Bolsillo Mildred Chávez de Almorza',
      category: 'CONCIERTO',
      dateText: 'Viernes, 27 de Noviembre de 2026',
      timeText: '18:00 hrs',
      venue: 'Teatro de Bolsillo Mildred Chávez de Almorza - TGW (3er Nivel Tipografía Nacional)',
      location: '18 Calle 6-72, Zona 1, Ciudad de Guatemala',
      description: 'Recital especial con repertorio clásico guatemalteco y sones tradicionales transmitido en directo por 107.3 FM.',
      price: 'Entrada Libre (Aforo limitado)',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      isRecommended: true
    },
    {
      title: 'Recorrido Nocturno: 96 Años de Memoria Sonora en el Museo Otto René Mancilla',
      category: 'MUSEO',
      dateText: 'Sábado, 28 de Noviembre de 2026',
      timeText: '15:00 a 20:00 hrs',
      venue: 'Museo Histórico Otto René Mancilla y Fonoteca TGW',
      location: 'Centro Histórico, Zona 1, Ciudad de Guatemala',
      description: 'Exhibición interactiva de transmisores de bulbos de 1930, guiones originales del Diario del Aire y escucha de vinilos patrimoniales.',
      price: 'Ingreso Gratuito',
      imageUrl: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&w=800&q=80',
      isRecommended: true
    },
    {
      title: 'Exposición Plástica «Paisajes y Colores de Mi Tierra»',
      category: 'EXPOSICION',
      dateText: 'Del 25 de Noviembre al 12 de Diciembre de 2026',
      timeText: '09:00 a 17:00 hrs',
      venue: 'Palacio Nacional de la Cultura - Galería Kilómetro Cero',
      location: '6a Calle y 6a Avenida, Zona 1, Ciudad de Guatemala',
      description: 'Muestra colectiva de pintura y escultura contemporánea guatemalteca con artistas de Quetzaltenango, Totonicapán y Alta Verapaz.',
      price: 'Entrada Libre para Nacionales',
      imageUrl: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?auto=format&fit=crop&w=800&q=80',
      isRecommended: true
    },
    {
      title: 'Muestra de Cine Guatemalteco y Documental Centroamericano',
      category: 'CINE',
      dateText: 'Domingo, 29 de Noviembre de 2026',
      timeText: '16:30 hrs',
      venue: 'Teatro Lux / Circuito Cultural Centro Histórico',
      location: '6a Avenida 11-02, Zona 1, Ciudad de Guatemala',
      description: 'Proyección de largometrajes nacionales premiados y conversatorio con directores y sonidistas cinematográficos.',
      price: 'Entrada Gratuita con Boleto de Cortesía',
      imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      isRecommended: true
    },
    {
      title: 'Temporada Escénica: «Leyendas de Guatemala» en Teatro de Cámara',
      category: 'ESCENICA',
      dateText: 'Jueves, 3 de Diciembre de 2026',
      timeText: '19:30 hrs',
      venue: 'Centro Cultural Miguel Ángel Asturias - Teatro de Cámara Hugo Carrillo',
      location: '24 Calle 3-81, Zona 1, Ciudad de Guatemala',
      description: 'Puesta en escena inspirada en la narrativa de Miguel Ángel Asturias con diseño sonoro inspirado en la época de oro de TGW.',
      price: 'Q 50.00 (Estudiantes con carné: Entrada Libre)',
      imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=800&q=80',
      isRecommended: true
    }
  ];

  for (const event of culturalEvents) {
    await prisma.culturalEvent.create({ data: event });
  }

  // PROGRAMACIÓN W (TGW FM & TGW TV)
  const programs = [
    {
      channel: 'TGW_FM',
      name: 'Diario del Aire - Primera Emisión',
      hosts: 'Equipo Periodístico Noticias W',
      schedule: '06:00 - 08:00 hrs',
      days: 'Lunes a Viernes',
      description: 'El primer radioperiódico de Guatemala fundado en 1937. Información oficial, cobertura nacional, tránsito y enlaces departamentales en 107.3 y 107.5 FM.',
      category: 'Noticiero Institucional',
      isLiveNow: true
    },
    {
      channel: 'TGW_FM',
      name: 'Chapinlandia - El Alma Sonora de Guatemala',
      hosts: 'Locutores Patrimoniales TGW',
      schedule: '12:00 - 14:00 hrs / 20:00 - 22:00 hrs',
      days: 'Lunes a Domingo',
      description: 'El programa insignia de marimba pura guatemalteca que une a los connacionales dentro y fuera de nuestras fronteras.',
      category: 'Identidad y Marimba',
      isLiveNow: false
    },
    {
      channel: 'TGW_FM',
      name: 'Diario del Aire - Emisión Meridiana',
      hosts: 'Redacción Central TGW',
      schedule: '12:30 - 13:30 hrs',
      days: 'Lunes a Viernes',
      description: 'Resumen informativo del acontecer del Ejecutivo, Legislativo, Judicial, Seguridad y Deportes.',
      category: 'Noticiero Institucional',
      isLiveNow: false
    },
    {
      channel: 'TGW_FM',
      name: 'Deportes W en Acción',
      hosts: 'Staff Deportivo La Voz de Guatemala',
      schedule: '18:00 - 19:00 hrs',
      days: 'Lunes a Sábado',
      description: 'Análisis, entrevistas y cobertura del deporte federado, fútbol nacional y ciclismo guatemalteco.',
      category: 'Deportes',
      isLiveNow: false
    },
    {
      channel: 'TGW_TV',
      name: 'Diario del Aire TV - Transmisión Simultánea',
      hosts: 'Presentadores Multimedia TGW',
      schedule: '06:00 - 08:00 hrs / 19:00 - 20:00 hrs',
      days: 'Lunes a Viernes',
      description: 'Señal televisiva y streaming en alta definición con reportajes especiales desde los 22 departamentos del país.',
      category: 'Informativo TV',
      isLiveNow: true
    },
    {
      channel: 'TGW_TV',
      name: 'Sesiones desde la Cabina Martha Bolaños de Prado',
      hosts: 'Producción Audiovisual TGW TV',
      schedule: '16:00 - 17:30 hrs',
      days: 'Martes y Jueves',
      description: 'Conciertos íntimos grabados a múltiples cámaras desde el estudio histórico del tercer nivel de la Tipografía Nacional.',
      category: 'Cultura y Conciertos TV',
      isLiveNow: false
    },
    {
      channel: 'TGW_TV',
      name: 'Documentales Memoria de Guatemala',
      hosts: 'Archivo Audiovisual y Fonoteca TGW',
      schedule: '21:00 - 22:00 hrs',
      days: 'Sábados y Domingos',
      description: 'Especiales históricos sobre el patrimonio arquitectónico, arqueológico y radiofónico de la Nación.',
      category: 'Documental Histórico',
      isLiveNow: false
    }
  ];

  for (const prog of programs) {
    await prisma.radioProgram.create({ data: prog });
  }

  // HUELLAS W (CONALFA, Podcasts sin continuidad y Archivo de Administraciones Anteriores)
  const archives = [
    {
      title: 'CONALFA al Aire: Alfabetización Radiofónica y Educación Bilingüe',
      type: 'CONALFA',
      period: 'Archivo Educativo (2016 - 2023)',
      episodesCount: 48,
      description: 'Colección de cápsulas y lecciones radiofónicas desarrolladas junto al Comité Nacional de Alfabetización (CONALFA) para apoyar el aprendizaje de lectoescritura y cálculo básico en comunidades de todo el país.',
      audioDuration: '28 min por episodio',
      badgeText: 'CONALFA • Educación'
    },
    {
      title: 'CONALFA en Idiomas Mayas: K’iche’, Q’eqchi’, Kaqchikel y Mam',
      type: 'CONALFA',
      period: 'Archivo Intercultural (2018 - 2023)',
      episodesCount: 36,
      description: 'Jornadas educativas de post-alfabetización transmitidas en frecuencias regionales para el fortalecimiento educativo de jóvenes y adultos.',
      audioDuration: '25 min por episodio',
      badgeText: 'CONALFA • Intercultural'
    },
    {
      title: 'Podcast «Voces del Bicentenario y Crónicas de Antaño»',
      type: 'PODCAST',
      period: 'Administración Anterior (2020 - 2023)',
      episodesCount: 24,
      description: 'Serie de podcasts históricos producidos en gestiones anteriores que no tuvieron continuidad en la parrilla actual, conservados íntegramente para consulta pública e investigación.',
      audioDuration: '35 min por episodio',
      badgeText: 'Podcast Archivado'
    },
    {
      title: 'Podcast «Diálogos de Gestión y Desarrollo Municipal»',
      type: 'PODCAST',
      period: 'Administración Anterior (2019 - 2022)',
      episodesCount: 19,
      description: 'Repositorio de entrevistas y mesas técnicas grabadas en periodos anteriores sobre proyectos departamentales y administración local.',
      audioDuration: '40 min por episodio',
      badgeText: 'Podcast Archivado'
    },
    {
      title: 'Fonoteca Patrimonial: Voces Históricas del Diario del Aire (Colección 1937 - 1985)',
      type: 'FONOTECA',
      period: 'Acervo Patrimonial (Acuerdo Ministerial 459-2012)',
      episodesCount: 65,
      description: 'Registros digitalizados de cintas magnetofónicas y discos de acetato con locuciones históricas, radioteatros y piezas de la época de oro de TGW.',
      audioDuration: '15 a 45 min',
      badgeText: 'Fonoteca TGW'
    }
  ];

  for (const arc of archives) {
    await prisma.historicalArchive.create({ data: arc });
  }

  console.log('✅ Base de datos inicializada con éxito.');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
