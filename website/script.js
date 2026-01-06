document.addEventListener('DOMContentLoaded', async () => {
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Header shadow on scroll
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Simple scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('in');
    });
  }, { threshold: 0.08 });
  revealEls.forEach(el => observer.observe(el));

  // Configure outbound links (replace with real links)
  const android = document.getElementById('btn-android');
  const ios = document.getElementById('btn-ios');
  const github = document.getElementById('btn-github');
  const privacy = document.getElementById('btn-privacy');
  const terms = document.getElementById('btn-terms');

  if (android) android.href = 'https://play.google.com/store/apps/details?id=com.tijaniyahpro.app'; // Play Store URL
  if (ios) ios.href = '#'; // e.g., App Store URL or TestFlight
  if (github) github.href = 'https://github.com/bvggies/Tijaniyahmuslimproapp_react';
  if (privacy) privacy.href = '#';
  if (terms) terms.href = '#';

  // Swap in user-provided images if available
  const trySwap = async (id, candidates) => {
    const el = document.getElementById(id);
    if (!el) return;
    for (const path of candidates) {
      try {
        const res = await fetch(encodeURI(path), { method: 'HEAD', cache: 'no-store' });
        if (res.ok) {
          const bust = `${encodeURI(path)}?v=${Date.now()}`;
          el.src = bust;
          break;
        }
      } catch {}
    }
  };
  trySwap('logoImg', ['logo.png', 'logo.jpg', 'logo.svg']);
  // Prefer the uploaded Home screen image for the hero
  trySwap('heroImg', [
    'Home screen.png','home screen.png','home-screen.png','HOME SCREEN.PNG','Home%20screen.png',
    'screens-hero.png','screens-hero.jpg','screens-hero.svg','SCREENS-HERO.PNG','SCREENS-HERO.SVG'
  ]);
  // Prefer JPG for Android if both exist
  trySwap('androidScreen', ['screens-android.jpg','screens-android.png','SCREENS-ANDROID.JPG','screens-hero.png','screens-hero.svg']);
  trySwap('iphoneScreen', ['screens-iphone.png','screens-iphone.jpg','SCREENS-IPHONE.PNG','screens-makkah.png','screens-makkah.svg']);
  trySwap('communityImg', ['screens-community.png','screens-community.jpg','screens-community.svg','SCREENS-COMMUNITY.SVG']);
  trySwap('more1Img', ['more features.png', 'more-features.png', 'more_features.png']);
  trySwap('more2Img', ['more features2.png', 'more-features2.png', 'more_features2.png']);

  // New app screens (with spaces in file names)
  trySwap('homeScreenImg', ['Home screen.png','home screen.png','home-screen.png','HOME SCREEN.PNG']);
  trySwap('quranScreenImg', ['Quran screen.png','quran screen.png','quran-screen.png','QURAN SCREEN.PNG']);
  trySwap('qiblaScreenImg', ['Qibla screen.png','qibla screen.png','qibla-screen.png','QIBLA SCREEN.PNG']);
  trySwap('tijaniyaFeaturesImg', ['Tijaniya features screen.png','tijaniya features screen.png','tijaniya-features-screen.png','TIJANIYA FEATURES SCREEN.PNG']);
  trySwap('scholarsScreenImg', ['Scholars screen.png','scholars screen.png','scholars-screen.png','SCHOLARS SCREEN.PNG']);

  // Build screenshot gallery (exclude logo)
  const galleryCandidates = [
    'screens-android.jpg','screens-android.png','screens-iphone.png','screens-iphone.jpg',
    'Home screen.png','Quran screen.png','Qibla screen.png','Tijaniya features screen.png','Scholars screen.png',
    'screens-hero.png','screens-hero.svg','screens-community.png','screens-community.svg','screens-makkah.png',
    'more features.png','more features2.png'
  ];
  const existing = [];
  for (const path of galleryCandidates) {
    try {
      const res = await fetch(encodeURI(path), { method: 'HEAD', cache: 'no-store' });
      if (res.ok) existing.push(path);
    } catch {}
  }
  const grid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox?.querySelector('.lightbox-image');
  const lbClose = lightbox?.querySelector('.lightbox-close');
  const lbPrev = lightbox?.querySelector('.lightbox-prev');
  const lbNext = lightbox?.querySelector('.lightbox-next');
  let currentIndex = 0;
  const openLightbox = (index) => {
    if (!lightbox || !lbImg) return;
    currentIndex = index;
    lbImg.src = existing[currentIndex] + `?v=${Date.now()}`;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
  };
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
  };
  const showPrev = () => openLightbox((currentIndex - 1 + existing.length) % existing.length);
  const showNext = () => openLightbox((currentIndex + 1) % existing.length);
  if (grid && existing.length) {
    grid.innerHTML = '';
    existing.forEach((src, idx) => {
      const btn = document.createElement('button');
      const img = document.createElement('img');
      img.src = encodeURI(src) + `?v=${Date.now()}`;
      img.alt = 'Screenshot';
      btn.appendChild(img);
      btn.addEventListener('click', () => openLightbox(idx));
      grid.appendChild(btn);
    });
  }
  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click', showPrev);
  lbNext?.addEventListener('click', showNext);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
});


