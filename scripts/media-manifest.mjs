const std = { widths: [800, 1600], formats: ['avif', 'webp', 'jpg'] };

export const IMAGES = [
  { id: 'rubro-moda', ratio: '4:3', ...std },
  { id: 'rubro-accesorios', ratio: '4:3', ...std },
  { id: 'rubro-tecnologia', ratio: '4:3', ...std },
  { id: 'rubro-minimarket', ratio: '4:3', ...std },
  { id: 'rubro-alimentos', ratio: '4:3', ...std },
  { id: 'rubro-galerias', ratio: '4:3', ...std },
  { id: 'problema-fotos', ratio: '4:5', ...std },
  { id: 'problema-diseno', ratio: '4:5', ...std },
  { id: 'problema-tiempo', ratio: '4:5', ...std },
  { id: 'paso-entrevista', ratio: '3:2', ...std },
  { id: 'paso-lab', ratio: '3:2', ...std },
  { id: 'paso-estrategia', ratio: '3:2', ...std },
  { id: 'paso-produccion', ratio: '3:2', ...std },
  { id: 'eco-investigar', ratio: '3:2', ...std },
  { id: 'eco-planificar', ratio: '3:2', ...std },
  { id: 'eco-producir', ratio: '3:2', ...std },
  { id: 'eco-publicar', ratio: '3:2', ...std },
  { id: 'historia', ratio: '4:5', ...std },
  { id: 'og-fondo', ratio: '16:9', widths: [1600], formats: ['jpg'] },
];

export const VIDEO_FILES = []; // videos que se sirven desde public/media (hoy ninguno)
export const VIDEO_MAX_BYTES = 4 * 1024 * 1024;
