-- Seed Achievements
INSERT INTO public.achievements (code, title, description, icon, category, xp_reward, requirement_type, requirement_value) VALUES
  ('first_steps', 'Primeros Pasos', 'Completa tu primer juego', '🎯', 'games', 50, 'games_completed', 1),
  ('week_warrior', 'Guerrero Semanal', 'Mantén una racha de 7 días', '🔥', 'streak', 100, 'streak_days', 7),
  ('vocab_master', 'Maestro del Vocabulario', 'Completa 10 juegos de vocabulario', '📚', 'games', 150, 'vocab_games', 10),
  ('culture_explorer', 'Explorador Cultural', 'Completa 10 juegos de cultura', '🌍', 'games', 150, 'culture_games', 10),
  ('soft_skills_pro', 'Profesional de Habilidades', 'Completa 10 juegos de habilidades blandas', '💼', 'games', 150, 'soft_skills_games', 10),
  ('xp_collector', 'Coleccionista de XP', 'Alcanza 1000 XP', '⭐', 'xp', 200, 'total_xp', 1000),
  ('perfect_score', 'Puntuación Perfecta', 'Obtén 100% en un juego', '🏆', 'performance', 100, 'perfect_games', 1),
  ('speed_demon', 'Demonio de Velocidad', 'Completa un juego en menos de 2 minutos', '⚡', 'performance', 75, 'fast_games', 1),
  ('dedicated_learner', 'Aprendiz Dedicado', 'Completa 50 juegos en total', '🎓', 'games', 300, 'games_completed', 50),
  ('month_champion', 'Campeón del Mes', 'Mantén una racha de 30 días', '👑', 'streak', 500, 'streak_days', 30)
ON CONFLICT (code) DO NOTHING;

-- Seed Rewards
INSERT INTO public.rewards (title, description, category, xp_cost, stock, image_url, external_url, is_active) VALUES
  ('Curso de Inglés Básico', 'Acceso a curso completo de inglés para principiantes en Duolingo', 'courses', 500, -1, NULL, 'https://www.duolingo.com', true),
  ('Sesión de Mentoring 1:1', 'Una hora de mentoring personalizado con un profesional', 'mentoring', 1000, 10, NULL, NULL, true),
  ('Plantilla de CV Profesional', 'Plantilla de currículum optimizada para ATS', 'resources', 300, -1, NULL, NULL, true),
  ('Certificado de Finalización', 'Certificado digital de finalización del programa', 'certificates', 2000, -1, NULL, NULL, true),
  ('Acceso Premium 1 Mes', 'Un mes de acceso a funcionalidades premium', 'premium', 1500, -1, NULL, NULL, true),
  ('Curso de Habilidades Blandas', 'Curso completo sobre comunicación y trabajo en equipo', 'courses', 750, -1, NULL, 'https://www.coursera.org', true),
  ('Guía de Búsqueda de Empleo', 'E-book completo con estrategias de búsqueda de empleo', 'resources', 400, -1, NULL, NULL, true),
  ('Sesión Grupal de Networking', 'Acceso a evento de networking con empleadores', 'mentoring', 800, 20, NULL, NULL, true)
ON CONFLICT DO NOTHING;

-- Seed Resources
INSERT INTO public.resources (title, description, category, url, icon, is_featured) VALUES
  -- Jobs
  ('InfoJobs', 'Portal de empleo líder en España', 'jobs', 'https://www.infojobs.net', 'Briefcase', true),
  ('LinkedIn Jobs', 'Red profesional y ofertas de empleo', 'jobs', 'https://www.linkedin.com/jobs', 'Linkedin', true),
  ('Indeed', 'Buscador de empleo internacional', 'jobs', 'https://www.indeed.es', 'Search', false),
  ('Trabajando.com', 'Portal de empleo para Latinoamérica', 'jobs', 'https://www.trabajando.com', 'Globe', false),
  ('Fundación Adecco', 'Empleo para personas en situación vulnerable', 'jobs', 'https://fundacionadecco.org', 'Heart', true),
  
  -- Courses
  ('Coursera', 'Cursos online de universidades de prestigio', 'courses', 'https://www.coursera.org', 'GraduationCap', true),
  ('edX', 'Cursos gratuitos de MIT, Harvard y más', 'courses', 'https://www.edx.org', 'BookOpen', true),
  ('Google Actívate', 'Cursos gratuitos de Google', 'courses', 'https://learndigital.withgoogle.com/activate', 'Award', true),
  ('Fundación Telefónica', 'Formación digital gratuita', 'courses', 'https://www.fundaciontelefonica.com', 'Smartphone', false),
  ('Khan Academy', 'Educación gratuita para todos', 'courses', 'https://es.khanacademy.org', 'Library', false),
  
  -- Help
  ('Cruz Roja Española', 'Ayuda humanitaria y servicios sociales', 'help', 'https://www.cruzroja.es', 'Cross', true),
  ('Cáritas', 'Ayuda a personas en situación de vulnerabilidad', 'help', 'https://www.caritas.es', 'HandHeart', true),
  ('ACNUR', 'Agencia de la ONU para refugiados', 'help', 'https://www.acnur.org', 'Shield', true),
  ('Médicos del Mundo', 'Asistencia sanitaria para personas vulnerables', 'help', 'https://www.medicosdelmundo.org', 'Stethoscope', false),
  ('Teléfono de la Esperanza', 'Apoyo emocional y prevención del suicidio', 'help', 'https://www.telefonodelaesperanza.org', 'Phone', true),
  
  -- Legal
  ('Abogados Sin Fronteras', 'Asistencia legal gratuita', 'legal', 'https://www.abogadossinfronteras.org', 'Scale', true),
  ('Turno de Oficio', 'Información sobre asistencia jurídica gratuita', 'legal', 'https://www.cgae.es', 'FileText', true),
  ('Comisión Española de Ayuda al Refugiado', 'Asesoramiento legal para refugiados', 'legal', 'https://www.cear.es', 'Users', true),
  ('Fundación Secretariado Gitano', 'Asesoramiento legal para comunidad gitana', 'legal', 'https://www.gitanos.org', 'Building', false),
  
  -- Community
  ('Meetup', 'Encuentra grupos y eventos en tu ciudad', 'community', 'https://www.meetup.com', 'Users', true),
  ('Eventbrite', 'Descubre eventos locales', 'community', 'https://www.eventbrite.es', 'Calendar', false),
  ('Voluntariado.net', 'Oportunidades de voluntariado', 'community', 'https://www.hacesfalta.org', 'Heart', true),
  ('Red Acoge', 'Red de entidades de acogida', 'community', 'https://redacoge.org', 'Home', true),
  ('Plataforma del Voluntariado', 'Coordinadora de organizaciones de voluntariado', 'community', 'https://www.plataformavoluntariado.org', 'Handshake', false)
ON CONFLICT DO NOTHING;
