// ============================================================================
// TAMV MD-X4™ — MEDIA GALLERY · 50 Photos + 20 Videos + Audio
// Curated content for the civilizatory ecosystem
// ============================================================================

// ─── PHOTO GALLERY (50 images) ──────────────────────────────────────────────
// Categories: Tech, Community, XR, Economy, Education, Security, AI, Nature

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  category: string;
  aspect: '16:9' | '1:1' | '4:3' | '9:16';
}

const UNSPLASH_BASE = 'https://images.unsplash.com';

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  // ═══ TECHNOLOGY & FUTURISM (10) ═══
  { id: 'p01', src: `${UNSPLASH_BASE}/photo-1518770660439-4636190af475?w=800&q=80`, alt: 'Circuitos digitales', category: 'tech', aspect: '16:9' },
  { id: 'p02', src: `${UNSPLASH_BASE}/photo-1550751827-4bd374c3f58b?w=800&q=80`, alt: 'Servidor data center', category: 'tech', aspect: '16:9' },
  { id: 'p03', src: `${UNSPLASH_BASE}/photo-1526374965328-7f61d4dc18c5?w=800&q=80`, alt: 'Código matrix', category: 'tech', aspect: '16:9' },
  { id: 'p04', src: `${UNSPLASH_BASE}/photo-1535378917042-10a22c95931a?w=800&q=80`, alt: 'Chip procesador', category: 'tech', aspect: '1:1' },
  { id: 'p05', src: `${UNSPLASH_BASE}/photo-1555949963-ff9fe0c870eb?w=800&q=80`, alt: 'Código en pantalla', category: 'tech', aspect: '16:9' },
  { id: 'p06', src: `${UNSPLASH_BASE}/photo-1504384308090-c894fdcc538d?w=800&q=80`, alt: 'Workspace tech', category: 'tech', aspect: '16:9' },
  { id: 'p07', src: `${UNSPLASH_BASE}/photo-1451187580459-43490279c0fa?w=800&q=80`, alt: 'Conexiones globales', category: 'tech', aspect: '16:9' },
  { id: 'p08', src: `${UNSPLASH_BASE}/photo-1558494949-ef010cbdcc31?w=800&q=80`, alt: 'Red neural', category: 'tech', aspect: '16:9' },
  { id: 'p09', src: `${UNSPLASH_BASE}/photo-1488590528505-98d2b5aba04b?w=800&q=80`, alt: 'Laptop coding', category: 'tech', aspect: '16:9' },
  { id: 'p10', src: `${UNSPLASH_BASE}/photo-1519389950473-47ba0277781c?w=800&q=80`, alt: 'Equipo tech', category: 'tech', aspect: '16:9' },

  // ═══ COMMUNITY & PEOPLE (10) ═══
  { id: 'p11', src: `${UNSPLASH_BASE}/photo-1522071820081-009f0129c71c?w=800&q=80`, alt: 'Comunidad colaborando', category: 'community', aspect: '16:9' },
  { id: 'p12', src: `${UNSPLASH_BASE}/photo-1517245386807-bb43f82c33c4?w=800&q=80`, alt: 'Reunión creativa', category: 'community', aspect: '16:9' },
  { id: 'p13', src: `${UNSPLASH_BASE}/photo-1529156069898-49953e39b3ac?w=800&q=80`, alt: 'Grupo diverso', category: 'community', aspect: '16:9' },
  { id: 'p14', src: `${UNSPLASH_BASE}/photo-1556761175-5973dc0f32e7?w=800&q=80`, alt: 'Trabajo en equipo', category: 'community', aspect: '16:9' },
  { id: 'p15', src: `${UNSPLASH_BASE}/photo-1531482615713-2afd69097998?w=800&q=80`, alt: 'Presentación', category: 'community', aspect: '16:9' },
  { id: 'p16', src: `${UNSPLASH_BASE}/photo-1552664730-d307ca884978?w=800&q=80`, alt: 'Workshop', category: 'community', aspect: '16:9' },
  { id: 'p17', src: `${UNSPLASH_BASE}/photo-1543269865-cbf427effbad?w=800&q=80`, alt: 'Creadores', category: 'community', aspect: '16:9' },
  { id: 'p18', src: `${UNSPLASH_BASE}/photo-1515187029135-18ee286d815b?w=800&q=80`, alt: 'Networking', category: 'community', aspect: '16:9' },
  { id: 'p19', src: `${UNSPLASH_BASE}/photo-1557804506-669a67965ba0?w=800&q=80`, alt: 'Conferencia', category: 'community', aspect: '16:9' },
  { id: 'p20', src: `${UNSPLASH_BASE}/photo-1523240795612-9a054b0db644?w=800&q=80`, alt: 'Estudiantes', category: 'community', aspect: '16:9' },

  // ═══ XR & METAVERSE (8) ═══
  { id: 'p21', src: `${UNSPLASH_BASE}/photo-1617802690992-15d93263d3a9?w=800&q=80`, alt: 'VR headset', category: 'xr', aspect: '16:9' },
  { id: 'p22', src: `${UNSPLASH_BASE}/photo-1592478411213-6153e4ebc07d?w=800&q=80`, alt: 'Realidad aumentada', category: 'xr', aspect: '16:9' },
  { id: 'p23', src: `${UNSPLASH_BASE}/photo-1633356122544-f134324a6cee?w=800&q=80`, alt: 'Mundo virtual', category: 'xr', aspect: '1:1' },
  { id: 'p24', src: `${UNSPLASH_BASE}/photo-1614064641938-3bbee52942c7?w=800&q=80`, alt: 'Experiencia inmersiva', category: 'xr', aspect: '16:9' },
  { id: 'p25', src: `${UNSPLASH_BASE}/photo-1478760329108-5c3ed9d495a0?w=800&q=80`, alt: 'Espacio digital', category: 'xr', aspect: '16:9' },
  { id: 'p26', src: `${UNSPLASH_BASE}/photo-1558618666-fcd25c85f82e?w=800&q=80`, alt: 'Arte digital 3D', category: 'xr', aspect: '1:1' },
  { id: 'p27', src: `${UNSPLASH_BASE}/photo-1550745165-9bc0b252726f?w=800&q=80`, alt: 'Gaming VR', category: 'xr', aspect: '16:9' },
  { id: 'p28', src: `${UNSPLASH_BASE}/photo-1626379953822-baec19c3accd?w=800&q=80`, alt: 'Hologramas', category: 'xr', aspect: '16:9' },

  // ═══ ECONOMY & FINANCE (7) ═══
  { id: 'p29', src: `${UNSPLASH_BASE}/photo-1611974789855-9c2a0a7236a3?w=800&q=80`, alt: 'Trading digital', category: 'economy', aspect: '16:9' },
  { id: 'p30', src: `${UNSPLASH_BASE}/photo-1621761191319-c6fb62004040?w=800&q=80`, alt: 'Crypto coins', category: 'economy', aspect: '1:1' },
  { id: 'p31', src: `${UNSPLASH_BASE}/photo-1559526324-4b87b5e36e44?w=800&q=80`, alt: 'Gráficas financieras', category: 'economy', aspect: '16:9' },
  { id: 'p32', src: `${UNSPLASH_BASE}/photo-1460925895917-afdab827c52f?w=800&q=80`, alt: 'Dashboard analytics', category: 'economy', aspect: '16:9' },
  { id: 'p33', src: `${UNSPLASH_BASE}/photo-1556742049-0cfed4f6a45d?w=800&q=80`, alt: 'Pago digital', category: 'economy', aspect: '16:9' },
  { id: 'p34', src: `${UNSPLASH_BASE}/photo-1551288049-bebda4e38f71?w=800&q=80`, alt: 'Métricas', category: 'economy', aspect: '16:9' },
  { id: 'p35', src: `${UNSPLASH_BASE}/photo-1642790106117-e829e14a795f?w=800&q=80`, alt: 'NFT art', category: 'economy', aspect: '1:1' },

  // ═══ SECURITY & PRIVACY (5) ═══
  { id: 'p36', src: `${UNSPLASH_BASE}/photo-1563986768609-322da13575f2?w=800&q=80`, alt: 'Candado digital', category: 'security', aspect: '16:9' },
  { id: 'p37', src: `${UNSPLASH_BASE}/photo-1510511459019-5dda7724fd87?w=800&q=80`, alt: 'Huella digital', category: 'security', aspect: '1:1' },
  { id: 'p38', src: `${UNSPLASH_BASE}/photo-1555066931-4365d14bab8c?w=800&q=80`, alt: 'Código seguro', category: 'security', aspect: '16:9' },
  { id: 'p39', src: `${UNSPLASH_BASE}/photo-1614064641938-3bbee52942c7?w=800&q=80`, alt: 'Escudo protección', category: 'security', aspect: '16:9' },
  { id: 'p40', src: `${UNSPLASH_BASE}/photo-1550751827-4bd374c3f58b?w=800&q=80`, alt: 'Infraestructura segura', category: 'security', aspect: '16:9' },

  // ═══ EDUCATION (5) ═══
  { id: 'p41', src: `${UNSPLASH_BASE}/photo-1524178232363-1fb2b075b655?w=800&q=80`, alt: 'Aula moderna', category: 'education', aspect: '16:9' },
  { id: 'p42', src: `${UNSPLASH_BASE}/photo-1427504494785-3a9ca7044f45?w=800&q=80`, alt: 'Graduación', category: 'education', aspect: '16:9' },
  { id: 'p43', src: `${UNSPLASH_BASE}/photo-1503676260728-1c00da094a0b?w=800&q=80`, alt: 'Campus universitario', category: 'education', aspect: '16:9' },
  { id: 'p44', src: `${UNSPLASH_BASE}/photo-1513258496099-48168024aec0?w=800&q=80`, alt: 'Aprendizaje digital', category: 'education', aspect: '16:9' },
  { id: 'p45', src: `${UNSPLASH_BASE}/photo-1571260899304-425eee4c7efc?w=800&q=80`, alt: 'Tutoría', category: 'education', aspect: '16:9' },

  // ═══ NATURE & LATAM (5) ═══
  { id: 'p46', src: `${UNSPLASH_BASE}/photo-1518638150340-f706e86654de?w=800&q=80`, alt: 'México paisaje', category: 'latam', aspect: '16:9' },
  { id: 'p47', src: `${UNSPLASH_BASE}/photo-1547995886-6dc09384c6e6?w=800&q=80`, alt: 'Montañas', category: 'latam', aspect: '16:9' },
  { id: 'p48', src: `${UNSPLASH_BASE}/photo-1570077188670-e3a8d69ac5ff?w=800&q=80`, alt: 'Océano azul', category: 'latam', aspect: '16:9' },
  { id: 'p49', src: `${UNSPLASH_BASE}/photo-1506905925346-21bda4d32df4?w=800&q=80`, alt: 'Amanecer', category: 'latam', aspect: '16:9' },
  { id: 'p50', src: `${UNSPLASH_BASE}/photo-1494500764479-0c8f2919a3d8?w=800&q=80`, alt: 'Bosque digital', category: 'latam', aspect: '16:9' },
];

// ─── VIDEO GALLERY (20 videos) ──────────────────────────────────────────────

export interface GalleryVideo {
  id: string;
  title: string;
  thumbnail: string;
  embedUrl: string;
  duration: string;
  category: string;
}

export const GALLERY_VIDEOS: GalleryVideo[] = [
  // ═══ TECH & FUTURE (5) ═══
  { id: 'v01', title: 'El Futuro de la IA', thumbnail: `${UNSPLASH_BASE}/photo-1677442136019-21780ecad995?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/aircAruvnKk', duration: '19:13', category: 'tech' },
  { id: 'v02', title: 'Web3 Explicado', thumbnail: `${UNSPLASH_BASE}/photo-1639762681485-074b7f938ba0?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/nHhAEkG1y2U', duration: '12:30', category: 'tech' },
  { id: 'v03', title: 'Blockchain y Soberanía', thumbnail: `${UNSPLASH_BASE}/photo-1621504450181-5d356f61d307?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/SSo_EIwHSd4', duration: '15:45', category: 'tech' },
  { id: 'v04', title: 'Computación Cuántica', thumbnail: `${UNSPLASH_BASE}/photo-1635070041078-e363dbe005cb?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/JhHMJCUmq28', duration: '10:22', category: 'tech' },
  { id: 'v05', title: 'Ciberseguridad 2026', thumbnail: `${UNSPLASH_BASE}/photo-1550751827-4bd374c3f58b?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/inWWhr5tnEA', duration: '8:15', category: 'tech' },

  // ═══ CREATIVITY & DESIGN (5) ═══
  { id: 'v06', title: 'Diseño UX Premium', thumbnail: `${UNSPLASH_BASE}/photo-1561070791-2526d30994b5?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU', duration: '14:30', category: 'design' },
  { id: 'v07', title: 'Motion Design', thumbnail: `${UNSPLASH_BASE}/photo-1550745165-9bc0b252726f?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/UOPyBRgs1Zo', duration: '11:20', category: 'design' },
  { id: 'v08', title: 'Arte Digital 3D', thumbnail: `${UNSPLASH_BASE}/photo-1558618666-fcd25c85f82e?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/6YLWFX4OQWI', duration: '16:45', category: 'design' },
  { id: 'v09', title: 'Tipografía Cinética', thumbnail: `${UNSPLASH_BASE}/photo-1626785774573-4b799315345d?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/QkGSN2P3vr4', duration: '9:10', category: 'design' },
  { id: 'v10', title: 'Producción Musical AI', thumbnail: `${UNSPLASH_BASE}/photo-1511379938547-c1f69419868d?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/1aA1WGON49E', duration: '13:55', category: 'design' },

  // ═══ LATAM & CULTURE (5) ═══
  { id: 'v11', title: 'Innovación LATAM', thumbnail: `${UNSPLASH_BASE}/photo-1518638150340-f706e86654de?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '7:30', category: 'latam' },
  { id: 'v12', title: 'Startups Mexicanas', thumbnail: `${UNSPLASH_BASE}/photo-1547995886-6dc09384c6e6?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '12:15', category: 'latam' },
  { id: 'v13', title: 'Economía Digital LATAM', thumbnail: `${UNSPLASH_BASE}/photo-1611974789855-9c2a0a7236a3?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '18:20', category: 'latam' },
  { id: 'v14', title: 'Educación del Futuro', thumbnail: `${UNSPLASH_BASE}/photo-1524178232363-1fb2b075b655?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '10:45', category: 'latam' },
  { id: 'v15', title: 'Soberanía Digital', thumbnail: `${UNSPLASH_BASE}/photo-1563986768609-322da13575f2?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '15:30', category: 'latam' },

  // ═══ XR & METAVERSE (5) ═══
  { id: 'v16', title: 'Metaverso 2026', thumbnail: `${UNSPLASH_BASE}/photo-1617802690992-15d93263d3a9?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '20:00', category: 'xr' },
  { id: 'v17', title: 'Realidad Mixta', thumbnail: `${UNSPLASH_BASE}/photo-1592478411213-6153e4ebc07d?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '8:45', category: 'xr' },
  { id: 'v18', title: 'Avatares Digitales', thumbnail: `${UNSPLASH_BASE}/photo-1633356122544-f134324a6cee?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '11:30', category: 'xr' },
  { id: 'v19', title: 'Espacios Inmersivos', thumbnail: `${UNSPLASH_BASE}/photo-1478760329108-5c3ed9d495a0?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '14:10', category: 'xr' },
  { id: 'v20', title: 'DreamSpaces XR Demo', thumbnail: `${UNSPLASH_BASE}/photo-1626379953822-baec19c3accd?w=400&q=80`, embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '6:20', category: 'xr' },
];

// ─── AUDIO & MUSIC ──────────────────────────────────────────────────────────

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  category: 'ambient' | 'binaural' | 'electronic' | 'soundtrack';
  // Placeholder URLs - replace with real hosted audio files
  src: string;
  duration: string;
}

export const MUSIC_TRACKS: AudioTrack[] = [
  { id: 'a01', title: 'Quantum Drift', artist: 'TAMV Audio', category: 'ambient', src: '/audio/quantum-drift.mp3', duration: '4:30' },
  { id: 'a02', title: 'Steel Horizons', artist: 'TAMV Audio', category: 'electronic', src: '/audio/steel-horizons.mp3', duration: '3:45' },
  { id: 'a03', title: 'Neural Waves 432Hz', artist: 'TAMV Audio', category: 'binaural', src: '/audio/neural-waves.mp3', duration: '5:00' },
  { id: 'a04', title: 'Civilizatory Theme', artist: 'TAMV Audio', category: 'soundtrack', src: '/audio/civilizatory-theme.mp3', duration: '3:20' },
  { id: 'a05', title: 'Deep Focus Alpha', artist: 'TAMV Audio', category: 'binaural', src: '/audio/deep-focus.mp3', duration: '6:00' },
];

// ─── NOTIFICATION SOUNDS (10) ──────────────────────────────────────────────

export interface NotificationSound {
  id: string;
  name: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'message' | 'achievement' | 'transaction' | 'mention' | 'live' | 'system';
  /** Generates the sound programmatically via Web Audio API */
  play: () => void;
}

function createOscillatorSound(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain: number = 0.15,
  rampDown: boolean = true,
): () => void {
  return () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      g.gain.setValueAtTime(gain, ctx.currentTime);
      if (rampDown) {
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      }
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not available
    }
  };
}

function createChimeSound(freqs: number[], interval: number = 0.12): () => void {
  return () => {
    try {
      const ctx = new AudioContext();
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        g.gain.setValueAtTime(0.12, ctx.currentTime + i * interval);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * interval + 0.3);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(ctx.currentTime + i * interval);
        osc.stop(ctx.currentTime + i * interval + 0.35);
      });
    } catch {
      // Audio not available
    }
  };
}

export const NOTIFICATION_SOUNDS: NotificationSound[] = [
  { id: 'snd-success', name: 'Éxito', type: 'success', play: createChimeSound([523, 659, 784]) },
  { id: 'snd-error', name: 'Error', type: 'error', play: createOscillatorSound(220, 0.4, 'square', 0.1) },
  { id: 'snd-warning', name: 'Advertencia', type: 'warning', play: createChimeSound([440, 349], 0.15) },
  { id: 'snd-info', name: 'Información', type: 'info', play: createOscillatorSound(660, 0.2, 'sine', 0.1) },
  { id: 'snd-message', name: 'Mensaje', type: 'message', play: createChimeSound([587, 784]) },
  { id: 'snd-achievement', name: 'Logro', type: 'achievement', play: createChimeSound([523, 659, 784, 1047], 0.1) },
  { id: 'snd-transaction', name: 'Transacción', type: 'transaction', play: createChimeSound([440, 554, 659]) },
  { id: 'snd-mention', name: 'Mención', type: 'mention', play: createOscillatorSound(880, 0.15, 'sine', 0.08) },
  { id: 'snd-live', name: 'En Vivo', type: 'live', play: createChimeSound([392, 494, 587, 784], 0.08) },
  { id: 'snd-system', name: 'Sistema', type: 'system', play: createOscillatorSound(440, 0.3, 'triangle', 0.1) },
];

/** Play a notification sound by type */
export function playNotificationSound(type: NotificationSound['type']) {
  const sound = NOTIFICATION_SOUNDS.find(s => s.type === type);
  sound?.play();
}

// ─── GALLERY CATEGORIES ─────────────────────────────────────────────────────

export const PHOTO_CATEGORIES = [
  { id: 'all', label: 'Todas', count: GALLERY_PHOTOS.length },
  { id: 'tech', label: 'Tecnología', count: GALLERY_PHOTOS.filter(p => p.category === 'tech').length },
  { id: 'community', label: 'Comunidad', count: GALLERY_PHOTOS.filter(p => p.category === 'community').length },
  { id: 'xr', label: 'XR & Metaverso', count: GALLERY_PHOTOS.filter(p => p.category === 'xr').length },
  { id: 'economy', label: 'Economía', count: GALLERY_PHOTOS.filter(p => p.category === 'economy').length },
  { id: 'security', label: 'Seguridad', count: GALLERY_PHOTOS.filter(p => p.category === 'security').length },
  { id: 'education', label: 'Educación', count: GALLERY_PHOTOS.filter(p => p.category === 'education').length },
  { id: 'latam', label: 'LATAM', count: GALLERY_PHOTOS.filter(p => p.category === 'latam').length },
];

export const VIDEO_CATEGORIES = [
  { id: 'all', label: 'Todos', count: GALLERY_VIDEOS.length },
  { id: 'tech', label: 'Tecnología', count: GALLERY_VIDEOS.filter(v => v.category === 'tech').length },
  { id: 'design', label: 'Diseño', count: GALLERY_VIDEOS.filter(v => v.category === 'design').length },
  { id: 'latam', label: 'LATAM', count: GALLERY_VIDEOS.filter(v => v.category === 'latam').length },
  { id: 'xr', label: 'XR', count: GALLERY_VIDEOS.filter(v => v.category === 'xr').length },
];

export const getPhotosByCategory = (cat: string) =>
  cat === 'all' ? GALLERY_PHOTOS : GALLERY_PHOTOS.filter(p => p.category === cat);

export const getVideosByCategory = (cat: string) =>
  cat === 'all' ? GALLERY_VIDEOS : GALLERY_VIDEOS.filter(v => v.category === cat);
