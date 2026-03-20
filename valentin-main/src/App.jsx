import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-scroll';
import { InlineWidget } from 'react-calendly';
import { FiMenu, FiPlay, FiArrowRight, FiX, FiVideo, FiCheck, FiChevronDown, FiInstagram, FiLinkedin } from 'react-icons/fi';

// =========================================================================
// ⚙️ CONFIGURATION GLOBALE DU SITE (MODIFIE TOUT ICI)
// =========================================================================
const CONFIG = {
  // 1. Textes de la section Hero (Accueil)
  HERO: {
    badge: "Monteur vidéo – Finance & Storytelling",
    title_part1: "Vos vidéos informent. ",
    title_part2: "Les miennes font rester.",
    description: "Monteur spécialisé en contenu finance et storytelling long format. J’aide les créateurs et entreprises à structurer des vidéos qui captent, clarifient et positionnent.",
    bullets: [
      "Finary, Xavier Delmas, Alti Trading",
      "Des vidéos qu’on regarde jusqu’au bout",
      "Un monteur qui comprend la finance et vos objectifs"
    ]
  },

  // 2. Vidéos YouTube (Format Long)
  PORTFOLIO_LONG: {
    title: "Projets sélectionnés",
    subtitle: "Formats longs, storytelling immersif, rétention absolue.",
    videos: [
      { id: 1, title: "Storytelling",  desc: "Storytelling long format", videoUrl: "https://youtu.be/YlYpYUPXLmQ" },
      { id: 2, title: "Éducatif",      desc: "Contenu éducatif finance",  videoUrl: "https://youtu.be/x1iE2W0_zms" },
      { id: 3, title: "Analyse",       desc: "Analyse & décryptage",      videoUrl: "https://youtu.be/fGz-jEARnzg" },
      { id: 4, title: "Storytelling",  desc: "Narration visuelle",        videoUrl: "https://youtu.be/VJvLHfAcJVg" },
    ]
  },

  // 3. Vidéos Shorts / Reels (Format Court)
  PORTFOLIO_SHORT: {
    title: "Format court",
    subtitle: "Formats courts structurés.",
    videos: [
      { id: 1, videoUrl: "/videos/short1.mp4" },
      { id: 2, videoUrl: "/videos/short2.mp4" },
      { id: 3, videoUrl: "/videos/short3.mp4" },
      { id: 4, videoUrl: "/videos/short4.mp4" },
    ]
  },

  // 4. Section À Propos
  ABOUT: {
    photo: "/profile.png",
    name: "Je m'appelle Valentin Rouat.",
    paragraphs: [
      "Je ne monte pas des vidéos. Je structure des récits qui captent l'attention et construisent la crédibilité.",
      "J'accompagne des créateurs et des entreprises dans la finance pour transformer une simple face caméra en contenu à forte valeur perçue.",
      "Archives, rythme, narration visuelle, sound design : chaque élément est pensé pour retenir, convaincre et positionner."
    ]
  },

  // 5. Témoignages Clients
  TESTIMONIALS: {
    title: "Avis clients",
    subtitle: "Témoignages",
    items: [
      {
        id: 1,
        name: "Finary",
        role: "Créateur finance",
        text: "Hello Valentin, juste un petit message pour te partager qu'on est super content du travail qu'on fait ensemble depuis 10 mois. Continue comme ça.",
        avatar: "https://i.postimg.cc/JnB0Jfwd/mounir_laggoune_a_fonde_finary_en_2020_1762340710_3cba1a1573096d1ca1a15730906ca1v.jpg",
      },
      {
        id: 2,
        name: "Xavier Delmas",
        role: "Zonebourse / Bourseko",
        text: "Excellent travail sur la vidéo. Mes associés chez Bourseko apprécient beaucoup ton approche et souhaitent développer davantage de formats scriptés sur notre chaîne. Je leur transmets ton contact.",
        avatar: "https://i.postimg.cc/qRCqnPfb/trad.jpg",
      },
      {
        id: 3,
        name: "Alti Trading",
        role: "Créateur finance",
        text: "Très satisfait du travail réalisé. C'est propre, structuré et exactement dans l'esprit attendu. Merci pour ta réactivité et la qualité des retours, les versions sont validées.",
        avatar: "https://i.postimg.cc/G2stYW05/1685454945390.jpg",
      },
    ]
  },

  // 6. Foire aux Questions (FAQ)
  FAQ: [
    {
      q: "Comment sont définis les tarifs ?",
      a: "Chaque projet est évalué en fonction de son niveau de structuration narrative, de la durée et des objectifs éditoriaux. Un échange rapide permet de cadrer précisément le besoin.",
    },
    {
      q: "Interviens-tu uniquement sur le montage ?",
      a: "Non. J'interviens dès la phase de structuration : découpage narratif, hiérarchisation des idées, gestion du rythme, intégration d'archives et d'éléments visuels. L'objectif est de transformer une expertise brute en récit clair et cohérent.",
    },
    {
      q: "Quels types de formats réalises-tu ?",
      a: "J'interviens sur des vidéos storytelling long format jusqu'à 30 minutes, des podcasts (formats interview ou conversation), ainsi que des formats courts structurés pour les réseaux sociaux. Chaque projet est pensé pour clarifier le message, structurer le propos et renforcer l'impact du contenu.",
    },
    {
      q: "Comment démarrer une collaboration ?",
      a: "Un échange rapide permet de définir les objectifs, le niveau d'exigence éditoriale et le cadre du projet.",
    },
  ],

  // 7. Contact (Calendly)
  CONTACT: {
    title: "Discutons de votre projet.",
    subtitle: "Un premier échange pour définir les objectifs éditoriaux et le cadre de collaboration.",
    calendlyUrl: "https://calendly.com/rouatval/30min"
  }
};

// =========================================================================
// 🎬 COMPOSANTS UTILITAIRES
// =========================================================================
function getYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
  } catch {
    const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return m ? m[1] : null;
  }
  return null;
}

const MediaPlayer = ({ src, className = '', autoPlay = false, muted = false, loop = false, playsInline = false }) => {
  if (!src) return null;
  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
  if (isYouTube) {
    const id = getYouTubeId(src);
    const params = `?rel=0&modestbranding=1&playsinline=1&autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}`;
    const srcUrl = id ? `https://www.youtube.com/embed/${id}${params}` : src;
    return <iframe title="youtube-player" src={srcUrl} className={className} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen />;
  }
  return <video src={src} className={className} autoPlay={autoPlay} muted={muted} loop={loop} playsInline={playsInline} preload="auto" />;
};

// Miniature pour vidéos courtes (sans autoplay, première frame affichée)
function ShortThumbnail({ src, className = '' }) {
  const videoRef = useRef(null);

  const seekToFirstFrame = () => {
    const v = videoRef.current;
    if (v && v.readyState >= 1) {
      v.currentTime = 0.01;
    }
  };

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      muted
      playsInline
      preload="metadata"
      onLoadedMetadata={seekToFirstFrame}
      onLoadedData={seekToFirstFrame}
      onCanPlay={seekToFirstFrame}
    />
  );
}

// =========================================================================
// 🎞️ COURBES D'ANIMATION
// =========================================================================
const ease = [0.16, 1, 0.3, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// =========================================================================
// 🔽 FAQ ITEM
// =========================================================================
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
      className="bg-[#1A1D24] rounded-2xl border border-white/5 overflow-hidden transition-colors hover:border-[#3B82F6]/30"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-6 md:p-8 flex justify-between items-center bg-transparent"
      >
        <span className="font-medium text-lg text-white/90 pr-4 flex-1 min-w-0">{q}</span>
        <FiChevronDown className={`transform transition-transform duration-300 text-[#3B82F6] text-xl flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 md:px-8 pb-8 text-white/50 text-base font-light leading-relaxed">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// =========================================================================
// 🏠 APP
// =========================================================================
export default function App() {
  const [scrolled, setScrolled]         = useState(false);
  const [activeVideo, setActiveVideo]   = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCookies, setShowCookies]   = useState(false);
  const [showLegal, setShowLegal]       = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (activeVideo || mobileMenuOpen || showLegal) ? 'hidden' : 'unset';
  }, [activeVideo, mobileMenuOpen, showLegal]);

  useEffect(() => {
    if (!localStorage.getItem('cookiesAccepted')) setShowCookies(true);
  }, []);

  const acceptCookies = () => { localStorage.setItem('cookiesAccepted', 'true'); setShowCookies(false); };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-[#3B82F6] selection:text-white relative" style={{ background: 'linear-gradient(160deg, #040d1a 0%, #020810 30%, #000000 60%, #010611 85%, #020918 100%)' }}>
      
      {/* Texture anti-banding (bruit léger) pour un noir plus profond et élégant */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundRepeat: 'repeat', backgroundSize: '256px' }}
      />

      {/* ── MODAL VIDÉO ── */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-8"
            onClick={() => setActiveVideo(null)}
          >
            <button className="absolute top-4 right-4 md:top-6 md:right-6 text-white/50 hover:text-white text-4xl z-50 p-2"><FiX /></button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ duration: 0.4, ease }}
              className={`relative rounded-2xl overflow-hidden shadow-2xl ${activeVideo.type === 'short' ? 'w-full max-w-[380px] aspect-[9/16]' : 'w-full max-w-6xl aspect-video'}`}
              onClick={e => e.stopPropagation()}
            >
              <MediaPlayer src={activeVideo.videoUrl} autoPlay muted={false} playsInline className="w-full h-full object-contain bg-black" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL MENTIONS LÉGALES ── */}
      <AnimatePresence>
        {showLegal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setShowLegal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0D0F14] border border-white/8 p-8 md:p-10 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8 border-b border-white/8 pb-4">
                <h3 className="text-2xl font-black text-[#3B82F6] uppercase tracking-tight">Mentions Légales & RGPD</h3>
                <button onClick={() => setShowLegal(false)} className="text-white/50 hover:text-white text-3xl"><FiX /></button>
              </div>
              <div className="space-y-6 text-sm text-white/60 leading-relaxed font-light">
                <div><h4 className="font-bold text-white mb-1">Éditeur du site</h4><p>Valentin Rouat — Monteur Vidéo Indépendant.</p></div>
                <div><h4 className="font-bold text-white mb-1">Hébergement</h4><p>Ce site est hébergé par Vercel / Netlify.</p></div>
                <div><h4 className="font-bold text-white mb-1">Propriété Intellectuelle</h4><p>Le contenu de ce site (vidéos, textes, design) est la propriété exclusive de Valentin Rouat. Toute reproduction, totale ou partielle, est interdite sans autorisation préalable.</p></div>
                <div><h4 className="font-bold text-white mb-1">Données personnelles & RGPD</h4><p>Les informations recueillies via le module Calendly sont utilisées uniquement pour la prise de rendez-vous. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données en me contactant directement.</p></div>
                <div><h4 className="font-bold text-white mb-1">Cookies</h4><p>Ce site utilise des cookies strictement nécessaires à son bon fonctionnement, ainsi que des cookies tiers liés à Calendly et aux lecteurs vidéo (YouTube) pour l'affichage du portfolio.</p></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BANNIÈRE COOKIES ── */}
      <AnimatePresence>
        {showCookies && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:max-w-sm bg-[#0D0F14]/95 backdrop-blur-xl border border-white/8 rounded-2xl p-5 shadow-2xl z-[90] flex flex-col gap-4"
          >
            <p className="text-sm text-white/70 leading-relaxed">Ce site utilise des cookies pour analyser le trafic et améliorer votre expérience de navigation.</p>
            <button onClick={acceptCookies} className="w-full bg-[#3B82F6] hover:bg-blue-500 text-white text-xs font-black py-3 rounded-xl transition-all uppercase tracking-widest flex items-center justify-center gap-2">
              <FiCheck /> Compris
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MENU MOBILE ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center space-y-10"
          >
            <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 text-white text-3xl p-2"><FiX /></button>
            {['portfolio', 'about', 'faq', 'contact'].map((id) => (
              <Link key={id} to={id} smooth onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-black text-white hover:text-[#3B82F6] transition-colors uppercase tracking-tight cursor-pointer"
              >
                {id === 'portfolio' ? 'Portfolio' : id === 'about' ? 'À propos' : id === 'faq' ? 'FAQ' : 'Contact'}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════ */}
      <motion.nav
        initial={{ y: '-100%' }} animate={{ y: 0 }} transition={{ duration: 0.8, ease }}
        className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-7'}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-[#3B82F6]" style={{ boxShadow: '0 0 10px #3B82F6' }} />
            <span className="text-lg font-black text-white tracking-tight">valentin.</span>
          </div>

          {/* Mobile burger */}
          <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-white text-2xl p-1"><FiMenu /></button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10 text-xs font-bold text-white/50 tracking-widest uppercase">
            <Link to="portfolio" smooth className="cursor-pointer hover:text-white transition-colors">Portfolio</Link>
            <Link to="about" smooth className="cursor-pointer hover:text-white transition-colors">À propos</Link>
            <Link to="faq" smooth className="cursor-pointer hover:text-white transition-colors">FAQ</Link>
          </div>

          {/* CTA */}
          <Link to="contact" smooth
            className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#3B82F6] hover:text-white transition-all duration-300 cursor-pointer"
          >
            Contact
          </Link>
        </div>
      </motion.nav>

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section id="hero" className="min-h-screen flex items-center pt-28 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 xl:gap-32">

            {/* ── Texte ── */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="w-full md:w-[55%] lg:w-1/2 flex-shrink-0"
            >
              {/* Pill badge */}
              <motion.div variants={fadeUp}
                className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/8 text-[#3B82F6] text-xs font-bold uppercase tracking-widest"
              >
                <FiVideo className="text-sm" /> {CONFIG.HERO.badge}
              </motion.div>

              <h1 className="font-extrabold leading-[1.08] tracking-tight text-white break-words"
                style={{ fontSize: 'clamp(1.8rem, 5.5vw, 5rem)' }}
              >
                {CONFIG.HERO.title_part1}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(100deg, #60a5fa 0%, #93c5fd 50%, #bfdbfe 100%)' }}>
                  {CONFIG.HERO.title_part2}
                </span>
              </h1>

              <p className="mt-6 text-base md:text-lg text-white/60 max-w-xl font-light leading-relaxed">
                {CONFIG.HERO.description}
              </p>

              <ul className="mt-8 space-y-3">
                {CONFIG.HERO.bullets.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/80 text-sm font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] flex-shrink-0" style={{ boxShadow: '0 0 8px #3B82F6' }} />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link to="contact" smooth offset={-50}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#3B82F6] text-white rounded-full font-bold uppercase tracking-widest hover:bg-blue-500 transition cursor-pointer text-sm"
                  style={{ boxShadow: '0 0 30px rgba(59,130,246,0.35)' }}
                >
                  Commencer <FiArrowRight />
                </Link>
                {/* Suppression du bouton "Voir le portfolio" ici */}
              </div>
            </motion.div>

            {/* ── Vidéo hero ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.9, ease }}
              className="hidden md:flex w-full md:w-[45%] lg:w-1/2 justify-center lg:justify-end"
            >
              <div className="relative"
                style={{ filter: 'drop-shadow(0 0 40px rgba(59,130,246,0.2))' }}
              >
                {/* Border glow ring */}
                <div className="absolute -inset-px rounded-2xl pointer-events-none z-20"
                  style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.4), transparent 60%)', borderRadius: '1rem' }}
                />
                <div
                  className="w-[52vw] max-w-[200px] sm:w-[38vw] sm:max-w-[240px] md:w-full md:max-w-[260px] lg:max-w-[320px] xl:max-w-[360px] rounded-2xl overflow-hidden flex-shrink-0"
                >
                  <div className="w-full aspect-[9/16]">
                    <MediaPlayer
                      src={CONFIG.PORTFOLIO_SHORT.videos[0].videoUrl}
                      autoPlay muted loop playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PORTFOLIO — LONG
      ═══════════════════════════════════════════ */}
      <section id="portfolio" className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-14">
            {/* Titre principal blanc */}
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              {CONFIG.PORTFOLIO_LONG.title}
            </h2>
            {/* Sous-titre bleu appliqué selon ta demande */}
            <p className="text-[#3B82F6] text-sm font-bold uppercase tracking-widest mt-3">
              {CONFIG.PORTFOLIO_LONG.subtitle}
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14"
          >
            {CONFIG.PORTFOLIO_LONG.videos.map((item) => (
              <motion.div key={item.id} variants={fadeUp} className="group cursor-pointer" onClick={() => setActiveVideo({ ...item, type: 'long' })}>
                <div className="w-full aspect-video bg-[#0D0F14] rounded-2xl overflow-hidden relative border border-white/5 group-hover:border-[#3B82F6]/40 transition-colors duration-300">
                  <div className="absolute inset-0">
                    <MediaPlayer src={item.videoUrl} muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors duration-500 z-10 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#3B82F6] flex items-center justify-center scale-0 group-hover:scale-100 transition-all duration-400 shadow-xl">
                      <FiPlay className="text-white text-xl ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#3B82F6] transition-colors">{item.title}</h3>
                    <p className="text-white/40 text-sm mt-0.5">{item.desc}</p>
                  </div>
                  <FiArrowRight className="text-white/20 group-hover:text-[#3B82F6] group-hover:translate-x-1 transition-all duration-300 text-xl flex-shrink-0" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PORTFOLIO — SHORTS
      ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-14">
            {/* Titre principal blanc */}
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              {CONFIG.PORTFOLIO_SHORT.title}
            </h2>
            {/* Sous-titre bleu appliqué selon ta demande */}
            <p className="text-[#3B82F6] text-sm font-bold uppercase tracking-widest mt-3">
              {CONFIG.PORTFOLIO_SHORT.subtitle}
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {CONFIG.PORTFOLIO_SHORT.videos.map((item) => (
              <motion.div key={item.id} variants={fadeUp} className="group cursor-pointer" onClick={() => setActiveVideo({ ...item, type: 'short' })}>
                <div className="w-full aspect-[9/16] bg-[#0D0F14] rounded-2xl overflow-hidden relative border border-white/5 group-hover:border-[#3B82F6]/40 transition-colors duration-300">
                  <div className="absolute inset-0">
                    <ShortThumbnail src={item.videoUrl} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 z-10 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-[#3B82F6] flex items-center justify-center opacity-100 md:opacity-0 md:scale-0 md:group-hover:opacity-100 md:group-hover:scale-100 transition-all duration-300 shadow-xl">
                      <FiPlay className="text-white text-base ml-0.5" />
                    </div>
                  </div>
                </div>
                {/* Suppression du titre en dessous des shorts ici comme demandé */}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          À PROPOS
      ═══════════════════════════════════════════ */}
      <section id="about" className="py-20 md:py-32 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24 relative z-10">

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 1, ease }}
            className="flex-shrink-0 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 border border-[#3B82F6]/40 rounded-3xl translate-x-4 translate-y-4 z-0" />
              <div className="w-[260px] h-[330px] md:w-[320px] md:h-[400px] rounded-3xl overflow-hidden relative z-10 bg-[#0D0F14] border border-white/8">
                <img
                  src={CONFIG.ABOUT.photo}
                  alt="Valentin Rouat"
                  className="w-full h-full object-cover"
                  onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x500/0D0F14/3B82F6?text=VR'; }}
                />
              </div>
            </div>
          </motion.div>

          {/* Texte */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="flex-1 space-y-6 min-w-0"
          >
            {/* À propos passé en titre blanc */}
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              À propos
            </h2>
            {/* Je m'appelle Valentin Rouat passé en texte normal / paragraphe */}
            <p className="text-xl md:text-2xl font-bold text-white">
              {CONFIG.ABOUT.name}
            </p>

            {CONFIG.ABOUT.paragraphs.map((text, index) => (
              <p key={index} className="text-white/60 text-base md:text-lg leading-relaxed font-light">
                {text}
              </p>
            ))}

            <Link to="contact" smooth
              className="inline-flex items-center gap-2 mt-2 px-7 py-3.5 bg-[#3B82F6] text-white rounded-full font-bold uppercase tracking-widest hover:bg-blue-500 transition cursor-pointer text-sm"
            >
              Discutons <FiArrowRight />
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          AVIS CLIENTS
      ═══════════════════════════════════════════ */}
      <section id="avis" className="py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-14 text-center">
             {/* Titre principal blanc */}
            <h2 className="text-3xl md:text-5xl font-black text-white">
              {CONFIG.TESTIMONIALS.title}
            </h2>
            {/* Sous-titre bleu en dessous */}
            <p className="text-[#3B82F6] text-sm font-bold uppercase tracking-widest mt-3">
              {CONFIG.TESTIMONIALS.subtitle}
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {CONFIG.TESTIMONIALS.items.map((r) => (
              <motion.div key={r.id} variants={fadeUp}
                className="bg-[#0A0C10] border border-white/6 rounded-2xl p-7 flex flex-col h-full hover:border-[#3B82F6]/30 transition-colors duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#3B82F6] text-sm">★</span>
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed flex-grow mb-6">"{r.text}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover border border-white/10"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/80'; }}
                  />
                  <div>
                    <div className="text-sm font-bold text-white">{r.name}</div>
                    <div className="text-xs text-white/40">{r.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════ */}
      <section id="faq" className="py-20 md:py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-14 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-3">Une question ?</h2>
            <p className="text-[#3B82F6] text-sm font-bold uppercase tracking-widest">FAQ</p>
          </motion.div>
          <div className="space-y-4">
            {CONFIG.FAQ.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CONTACT
      ═══════════════════════════════════════════ */}
      <section id="contact" className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight leading-tight">
            {CONFIG.CONTACT.title}
          </h2>
          <p className="text-[#3B82F6] text-sm font-bold uppercase tracking-widest mb-4">Contact</p>
          <p className="text-base md:text-lg font-light text-white/50 mb-10">
            {CONFIG.CONTACT.subtitle}
          </p>

          {/* Suppression du tableau explicatif "Echange stratégique" ici comme demandé */}

          <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.12)] border border-white/10 p-1 md:p-2">
            <InlineWidget url={CONFIG.CONTACT.calendlyUrl} styles={{ height: '700px', minWidth: '320px' }} />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer className="py-10 flex flex-col items-center gap-3 text-center text-xs text-white/20 border-t border-white/5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
          <span className="font-black text-white/40 tracking-tight">valentin.</span>
        </div>
        <p>Monteur Vidéo Professionnel © {new Date().getFullYear()}</p>
        <div className="flex items-center gap-5 my-1">
          <a href="https://www.instagram.com/valentin_monteur/" target="_blank" rel="noopener noreferrer"
            className="text-white/30 hover:text-[#3B82F6] transition-colors text-xl">
            <FiInstagram />
          </a>
          <a href="https://www.linkedin.com/in/valentin-rouat/" target="_blank" rel="noopener noreferrer"
            className="text-white/30 hover:text-[#3B82F6] transition-colors text-xl">
            <FiLinkedin />
          </a>
        </div>
        <button onClick={() => setShowLegal(true)} className="hover:text-[#3B82F6] transition-colors underline underline-offset-4 decoration-white/10">
          Mentions Légales & Politique de Confidentialité (RGPD)
        </button>
      </footer>
    </div>
  );
}
