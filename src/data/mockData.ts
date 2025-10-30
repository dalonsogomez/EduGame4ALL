import { Achievement, Reward, Resource, Question } from '../types';

export const mockAchievements: Achievement[] = [
  {
    id: 'first_login',
    title: 'Primer Paso',
    description: 'Completaste tu primer inicio de sesión',
    icon: '🎯',
    xpRequired: 0,
    unlocked: false
  },
  {
    id: 'first_game',
    title: 'Jugador Novato',
    description: 'Completaste tu primer juego',
    icon: '🎮',
    xpRequired: 50,
    unlocked: false
  },
  {
    id: 'ten_games',
    title: 'Entusiasta',
    description: 'Completaste 10 juegos',
    icon: '🔥',
    xpRequired: 500,
    unlocked: false
  },
  {
    id: 'perfect_score',
    title: 'Perfeccionista',
    description: 'Obtuviste un puntaje perfecto en un juego',
    icon: '⭐',
    xpRequired: 100,
    unlocked: false
  },
  {
    id: 'week_streak',
    title: 'Dedicación',
    description: 'Mantuviste una racha de 7 días',
    icon: '📅',
    xpRequired: 350,
    unlocked: false
  },
  {
    id: 'language_master',
    title: 'Maestro del Idioma',
    description: 'Completaste 20 ejercicios de vocabulario',
    icon: '📚',
    xpRequired: 1000,
    unlocked: false
  }
];

export const mockRewards: Reward[] = [
  {
    id: 'reward_1',
    title: '10% Descuento - Supermercado Local',
    description: 'Cupón de descuento para tu compra en supermercados participantes',
    pointsCost: 200,
    category: 'Alimentación',
    partner: 'Mercadona',
    imageUrl: 'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f',
    available: true
  },
  {
    id: 'reward_2',
    title: 'Transporte Público Gratis - 1 Día',
    description: 'Un día de viaje ilimitado en transporte público',
    pointsCost: 300,
    category: 'Transporte',
    partner: 'Metro Ciudad',
    imageUrl: 'https://images.unsplash.com/photo-1554224311-beee415c201f',
    available: true
  },
  {
    id: 'reward_3',
    title: 'Clase de Idiomas Gratis',
    description: 'Una clase presencial de idiomas en centro comunitario',
    pointsCost: 400,
    category: 'Educación',
    partner: 'Centro Comunitario',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    available: true
  },
  {
    id: 'reward_4',
    title: 'Material Escolar',
    description: 'Kit básico de material escolar para estudiantes',
    pointsCost: 250,
    category: 'Educación',
    partner: 'Librería Solidaria',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a',
    available: true
  },
  {
    id: 'reward_5',
    title: 'Entrada Museo',
    description: 'Entrada gratis para museo de la ciudad',
    pointsCost: 150,
    category: 'Cultura',
    partner: 'Museo Nacional',
    imageUrl: 'https://images.unsplash.com/photo-1566127444eeb-4d42b5a7e5b3',
    available: true
  }
];

export const mockResources: Resource[] = [
  {
    id: 'res_1',
    title: 'Oportunidad: Empleado de Almacén',
    description: 'Empresa local busca empleados para almacén. No se requiere experiencia previa. Formación incluida.',
    category: 'job',
    url: '#',
    date: '2025-10-25',
    relevant: true
  },
  {
    id: 'res_2',
    title: 'Subvención para Familias Refugiadas',
    description: 'Ayuda económica mensual disponible para familias en proceso de integración. Plazo hasta fin de mes.',
    category: 'grant',
    url: '#',
    date: '2025-10-20',
    relevant: true
  },
  {
    id: 'res_3',
    title: 'Centro de Ayuda - Asesoramiento Legal Gratuito',
    description: 'ONG local ofrece asesoramiento legal gratuito todos los martes de 10:00 a 14:00.',
    category: 'community',
    url: '#',
    date: '2025-10-28',
    relevant: true
  },
  {
    id: 'res_4',
    title: 'Eventos Culturales del Fin de Semana',
    description: 'Festival multicultural con actividades gratuitas para toda la familia. Sábado y domingo en el parque central.',
    category: 'news',
    url: '#',
    date: '2025-10-26',
    relevant: true
  },
  {
    id: 'res_5',
    title: 'Programa de Mentoría Laboral',
    description: 'Programa gratuito que conecta a trabajadores con mentores profesionales. Inscripciones abiertas.',
    category: 'job',
    url: '#',
    date: '2025-10-22',
    relevant: true
  }
];

export const vocabularyQuestions: Question[] = [
  {
    id: 'vocab_1',
    type: 'vocabulary',
    difficulty: 'beginner',
    question: '¿Cómo se dice "Hello" en español?',
    options: ['Adiós', 'Hola', 'Gracias', 'Por favor'],
    correctAnswer: 1,
    explanation: '"Hola" es el saludo más común en español para decir "Hello".',
    context: 'Saludos básicos'
  },
  {
    id: 'vocab_2',
    type: 'vocabulary',
    difficulty: 'beginner',
    question: '¿Qué significa "Gracias"?',
    options: ['Please', 'Sorry', 'Thank you', 'Goodbye'],
    correctAnswer: 2,
    explanation: '"Gracias" significa "Thank you" en inglés.',
    context: 'Expresiones de cortesía'
  },
  {
    id: 'vocab_3',
    type: 'vocabulary',
    difficulty: 'intermediate',
    question: 'En el supermercado, ¿cómo pides ayuda?',
    options: ['Dame esto', '¿Me puede ayudar?', 'Quiero eso', 'Ven aquí'],
    correctAnswer: 1,
    explanation: '"¿Me puede ayudar?" es la forma educada de pedir ayuda.',
    context: 'Situación: Supermercado'
  },
  {
    id: 'vocab_4',
    type: 'vocabulary',
    difficulty: 'intermediate',
    question: '¿Cómo preguntas el precio de algo?',
    options: ['¿Cuánto cuesta?', '¿Qué es esto?', '¿Dónde está?', '¿Cuándo abre?'],
    correctAnswer: 0,
    explanation: '"¿Cuánto cuesta?" es la pregunta estándar para saber el precio.',
    context: 'Situación: Compras'
  },
  {
    id: 'vocab_5',
    type: 'vocabulary',
    difficulty: 'advanced',
    question: 'En una entrevista de trabajo, ¿cómo expresas tu experiencia?',
    options: [
      'He trabajado mucho',
      'Tengo experiencia en atención al cliente',
      'Soy bueno',
      'Trabajé antes'
    ],
    correctAnswer: 1,
    explanation: 'Es importante ser específico y profesional al mencionar tu experiencia.',
    context: 'Situación: Entrevista laboral'
  }
];

export const cultureQuestions: Question[] = [
  {
    id: 'culture_1',
    type: 'culture',
    difficulty: 'beginner',
    question: '¿A qué hora suele ser la cena en España?',
    options: ['18:00', '20:00 - 21:00', '23:00', '17:00'],
    correctAnswer: 1,
    explanation: 'En España, la cena suele ser entre las 20:00 y 21:00, más tarde que en otros países.',
    context: 'Costumbres alimentarias'
  },
  {
    id: 'culture_2',
    type: 'culture',
    difficulty: 'beginner',
    question: '¿Qué es una "siesta"?',
    options: [
      'Una comida',
      'Un descanso después del almuerzo',
      'Una fiesta',
      'Un tipo de danza'
    ],
    correctAnswer: 1,
    explanation: 'La siesta es una tradición de descansar o dormir después del almuerzo.',
    context: 'Tradiciones españolas'
  },
  {
    id: 'culture_3',
    type: 'culture',
    difficulty: 'intermediate',
    question: 'Al entrar en una tienda pequeña, ¿qué es lo apropiado?',
    options: [
      'No decir nada',
      'Saludar con un "Hola" o "Buenos días"',
      'Gritar para llamar atención',
      'Esperar en silencio'
    ],
    correctAnswer: 1,
    explanation: 'Es cortés saludar al entrar en tiendas pequeñas en España.',
    context: 'Normas sociales'
  },
  {
    id: 'culture_4',
    type: 'culture',
    difficulty: 'intermediate',
    question: '¿Cuál es un gesto común para llamar al camarero?',
    options: [
      'Gritar "¡Eh!"',
      'Levantar la mano discretamente',
      'Silbar',
      'Golpear la mesa'
    ],
    correctAnswer: 1,
    explanation: 'Levantar la mano es la forma educada de llamar al camarero.',
    context: 'Situación: Restaurante'
  },
  {
    id: 'culture_5',
    type: 'culture',
    difficulty: 'advanced',
    question: '¿Qué se celebra el 6 de enero en España?',
    options: [
      'Navidad',
      'Día de Reyes',
      'Año Nuevo',
      'San Valentín'
    ],
    correctAnswer: 1,
    explanation: 'El Día de Reyes (Epifanía) es cuando los niños reciben regalos, es una tradición importante.',
    context: 'Festividades españolas'
  }
];

export const softSkillsQuestions: Question[] = [
  {
    id: 'soft_1',
    type: 'soft-skills',
    difficulty: 'beginner',
    question: 'Un compañero de equipo no está de acuerdo contigo. ¿Qué haces?',
    options: [
      'Ignorarlo',
      'Escuchar su punto de vista y buscar un compromiso',
      'Insistir en que tienes razón',
      'Dejarlo hacer lo que quiera'
    ],
    correctAnswer: 1,
    explanation: 'Escuchar activamente y buscar soluciones es clave para el trabajo en equipo.',
    context: 'Resolución de conflictos'
  },
  {
    id: 'soft_2',
    type: 'soft-skills',
    difficulty: 'beginner',
    question: 'En una reunión, alguien presenta una idea. ¿Cómo respondes?',
    options: [
      'Critico inmediatamente si no me gusta',
      'Escucho completamente antes de opinar',
      'No digo nada',
      'Cambio de tema'
    ],
    correctAnswer: 1,
    explanation: 'La escucha activa demuestra respeto y permite una comunicación efectiva.',
    context: 'Comunicación efectiva'
  },
  {
    id: 'soft_3',
    type: 'soft-skills',
    difficulty: 'intermediate',
    question: 'Tienes que completar una tarea en equipo pero hay desacuerdo sobre el enfoque. ¿Qué haces?',
    options: [
      'Haces tu parte sola',
      'Propones una reunión para discutir y votar',
      'Impones tu idea',
      'Abandonas el equipo'
    ],
    correctAnswer: 1,
    explanation: 'Facilitar el diálogo y la toma de decisiones democrática fortalece al equipo.',
    context: 'Liderazgo colaborativo'
  },
  {
    id: 'soft_4',
    type: 'soft-skills',
    difficulty: 'intermediate',
    question: 'Un cliente está molesto porque hay un retraso. ¿Cómo manejas la situación?',
    options: [
      'Le dices que no es tu culpa',
      'Reconoces su frustración y ofreces una solución',
      'Lo ignoras',
      'Te molestas también'
    ],
    correctAnswer: 1,
    explanation: 'La empatía y la búsqueda de soluciones son fundamentales en atención al cliente.',
    context: 'Gestión de situaciones difíciles'
  },
  {
    id: 'soft_5',
    type: 'soft-skills',
    difficulty: 'advanced',
    question: 'Tu equipo no está cumpliendo plazos. Como líder, ¿qué haces?',
    options: [
      'Trabajas tú solo para compensar',
      'Analizas las causas, redistribuyes tareas y ofreces apoyo',
      'Culpas a los miembros del equipo',
      'Pides una extensión sin consultar'
    ],
    correctAnswer: 1,
    explanation: 'Un buen líder identifica problemas, reorganiza recursos y apoya al equipo.',
    context: 'Liderazgo y gestión de equipos'
  }
];
